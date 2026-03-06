// ============================================================
// Margyn — Web Scraper Engine
// Supports: CSS selector extraction, pagination, rate limiting,
//           rotating user-agents, proxy support
// ============================================================

const axios = require('axios');
const cheerio = require('cheerio');

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
];

function randomAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Deep value extractor: 'a.b[0].c' path notation ───────
function deepGet(obj, path) {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return null;
    const arrMatch = key.match(/^(.+)\[(\d+)\]$/);
    if (arrMatch) {
      const arr = acc[arrMatch[1]];
      return Array.isArray(arr) ? arr[parseInt(arrMatch[2])] : null;
    }
    return acc[key];
  }, obj);
}

// ── Extract product from a cheerio element ─────────────────
function extractFromElement($el, $, selectors) {
  const extract = (sel) => {
    if (!sel) return null;
    const el = $el.find(sel).first();
    return el.length ? (el.attr('src') || el.attr('href') || el.text().trim()) : null;
  };

  return {
    name:   extract(selectors.name),
    price:  parsePrice(extract(selectors.price)),
    rank:   parseRank(extract(selectors.rank)),
    image:  extractImage($el, $, selectors.image),
    url:    $el.find('a').first().attr('href') || null,
    raw:    $el.html()?.slice(0, 200)
  };
}

function extractImage($el, $, imgSel) {
  if (!imgSel) return null;
  const img = $el.find(imgSel).first();
  return img.attr('data-src') || img.attr('src') || img.attr('data-lazy-src') || null;
}

function parsePrice(str) {
  if (!str) return null;
  const match = str.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function parseRank(str) {
  if (!str) return null;
  const match = str.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

// ── Build paginated URLs ───────────────────────────────────
function buildPages(baseUrl, pagination) {
  if (!pagination || pagination.maxPages <= 1) return [baseUrl];
  const pages = [];
  for (let p = 1; p <= pagination.maxPages; p++) {
    if (pagination.type === 'url') {
      const sep = baseUrl.includes('?') ? '&' : '?';
      pages.push(baseUrl + sep + pagination.pattern.replace('{page}', p));
    } else if (pagination.type === 'path') {
      pages.push(baseUrl + pagination.pattern.replace('{page}', p));
    }
  }
  return pages;
}

// ── Core scrape function ───────────────────────────────────
async function scrape(config, onProgress) {
  const { url, headers = {}, selectors, pagination, rateLimit } = config;
  const delayMs = rateLimit?.delayMs || 2000;
  const pages = buildPages(url, pagination);

  const results = [];
  const errors = [];

  for (let i = 0; i < pages.length; i++) {
    const pageUrl = pages[i];

    try {
      onProgress?.({ step: 'fetching', page: i + 1, total: pages.length, url: pageUrl });

      const response = await axios.get(pageUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': randomAgent(),
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
          ...headers
        },
        validateStatus: (s) => s < 500,
        maxRedirects: 5
      });

      if (response.status === 429) {
        onProgress?.({ step: 'rate-limited', page: i + 1, retrying: true });
        await sleep(delayMs * 3);
        i--; // retry
        continue;
      }

      if (response.status >= 400) {
        errors.push({ page: i + 1, url: pageUrl, status: response.status });
        continue;
      }

      const $ = cheerio.load(response.data);
      const items = $(selectors.productList);

      onProgress?.({ step: 'parsing', page: i + 1, itemsFound: items.length });

      items.each((idx, el) => {
        const product = extractFromElement($(el), $, selectors);
        if (product.name || product.price) {
          results.push({ ...product, pageNum: i + 1, itemIndex: idx });
        }
      });

    } catch (err) {
      errors.push({ page: i + 1, url: pageUrl, error: err.message });
    }

    if (i < pages.length - 1) {
      await sleep(delayMs + Math.random() * 1000);
    }
  }

  return {
    products: results,
    errors,
    totalFound: results.length,
    pagesScraped: pages.length - errors.length
  };
}

module.exports = { scrape };
