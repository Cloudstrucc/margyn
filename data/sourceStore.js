// ============================================================
// Margyn — Extended In-Memory Store
// Adds source configs, job logs, scraped results on top of db.js
// ============================================================

const { v4: uuidv4 } = require('uuid');

// ── Source Configs ────────────────────────────────────────
// type: 'scraper' | 'rest' | 'graphql' | 'soap' | 'oauth'
// role: 'market' (sell-side) | 'supplier' (buy-side)

const sourceConfigs = [
  {
    id: 'src_amz_01',
    name: 'Amazon Best Sellers',
    role: 'market',
    type: 'scraper',
    status: 'active',
    icon: 'bi-bag-fill',
    color: '#FF9900',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 5 * 60000).toISOString(),
    lastRunStatus: 'success',
    runCount: 142,
    config: {
      url: 'https://www.amazon.com/Best-Sellers/zgbs',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MargynBot/1.0)',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      selectors: {
        productList: '.zg-grid-general-faceout',
        name: '.p13n-sc-truncated',
        price: '.p13n-sc-price',
        rank: '.zg-badge-text',
        image: 'img.product-image'
      },
      pagination: { type: 'url', pattern: '?pg={page}', maxPages: 5 },
      rateLimit: { requestsPerMinute: 10, delayMs: 6000 },
      schedule: '0 6 * * *',
      category: 'Electronics'
    },
    stats: { productsFound: 100, successRate: 97.2, avgResponseMs: 1240 }
  },
  {
    id: 'src_ebay_01',
    name: 'eBay Trending',
    role: 'market',
    type: 'rest',
    status: 'active',
    icon: 'bi-shop',
    color: '#E53238',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 8 * 60000).toISOString(),
    lastRunStatus: 'success',
    runCount: 98,
    config: {
      baseUrl: 'https://api.ebay.com/buy/browse/v1',
      auth: {
        type: 'oauth2',
        tokenUrl: 'https://api.ebay.com/identity/v1/oauth2/token',
        clientId: 'YOUR_EBAY_CLIENT_ID',
        clientSecret: 'YOUR_EBAY_CLIENT_SECRET',
        scope: 'https://api.ebay.com/oauth/api_scope'
      },
      endpoints: [
        { path: '/item_summary/search', method: 'GET', params: { q: 'trending', sort: 'bestMatch', limit: 100 } }
      ],
      responseMapping: {
        productList: 'itemSummaries',
        name: 'title',
        price: 'price.value',
        currency: 'price.currency',
        image: 'thumbnailImages[0].imageUrl'
      },
      schedule: '0 */4 * * *'
    },
    stats: { productsFound: 87, successRate: 99.1, avgResponseMs: 380 }
  },
  {
    id: 'src_wmt_01',
    name: 'Walmart Trending',
    role: 'market',
    type: 'rest',
    status: 'active',
    icon: 'bi-cart4',
    color: '#0071CE',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 10 * 60000).toISOString(),
    lastRunStatus: 'success',
    runCount: 77,
    config: {
      baseUrl: 'https://developer.api.walmart.com/api-proxy/service',
      auth: { type: 'apikey', headerName: 'WM_CONSUMER.ID', value: 'YOUR_WALMART_KEY' },
      endpoints: [
        { path: '/affil/product/v2/trending', method: 'GET', params: { numItems: 100 } }
      ],
      responseMapping: {
        productList: 'items',
        name: 'name',
        price: 'salePrice',
        image: 'largeImage'
      },
      schedule: '30 6 * * *'
    },
    stats: { productsFound: 73, successRate: 98.4, avgResponseMs: 510 }
  },
  {
    id: 'src_fb_01',
    name: 'Facebook Marketplace',
    role: 'market',
    type: 'scraper',
    status: 'active',
    icon: 'bi-facebook',
    color: '#1877F2',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 15 * 60000).toISOString(),
    lastRunStatus: 'partial',
    runCount: 55,
    config: {
      url: 'https://www.facebook.com/marketplace/',
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MargynBot/1.0)' },
      selectors: {
        productList: '[data-testid="marketplace_feed_item"]',
        name: 'span[class*="itemTitle"]',
        price: 'span[class*="itemPrice"]',
        image: 'img[class*="itemImage"]'
      },
      rateLimit: { requestsPerMinute: 5, delayMs: 12000 },
      schedule: '0 8 * * *',
      notes: 'Requires rotating user-agents. Some regions gated.'
    },
    stats: { productsFound: 55, successRate: 82.1, avgResponseMs: 2800 }
  },
  {
    id: 'src_etsy_01',
    name: 'Etsy Trending',
    role: 'market',
    type: 'rest',
    status: 'active',
    icon: 'bi-scissors',
    color: '#F1641E',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 18 * 60000).toISOString(),
    lastRunStatus: 'success',
    runCount: 61,
    config: {
      baseUrl: 'https://openapi.etsy.com/v3',
      auth: { type: 'apikey', headerName: 'x-api-key', value: 'YOUR_ETSY_API_KEY' },
      endpoints: [
        { path: '/application/listings/active', method: 'GET', params: { limit: 100, sort_on: 'score' } }
      ],
      responseMapping: { productList: 'results', name: 'title', price: 'price.amount' },
      schedule: '0 7 * * *'
    },
    stats: { productsFound: 42, successRate: 99.5, avgResponseMs: 290 }
  },
  {
    id: 'src_ali_01',
    name: 'Alibaba',
    role: 'supplier',
    type: 'rest',
    status: 'active',
    icon: 'bi-building',
    color: '#FF6A00',
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 3 * 60000).toISOString(),
    lastRunStatus: 'success',
    runCount: 160,
    config: {
      baseUrl: 'https://openapi.alibaba.com/param2/rest',
      auth: {
        type: 'oauth2',
        tokenUrl: 'https://oauth.alibaba.com/token',
        clientId: 'YOUR_ALIBABA_APP_KEY',
        clientSecret: 'YOUR_ALIBABA_APP_SECRET'
      },
      endpoints: [
        { path: '/cn.alibaba.open.product.search.get', method: 'GET', params: { keywords: '{query}', pageSize: 20 } }
      ],
      responseMapping: {
        productList: 'result.data',
        name: 'subject',
        price: 'tradePrice.price',
        moq: 'tradeInfo.minOrderQuantity',
        supplier: 'companyInfo.name'
      },
      schedule: '30 5 * * *'
    },
    stats: { productsFound: 94, successRate: 98.8, avgResponseMs: 420 }
  },
  {
    id: 'src_aex_01',
    name: 'AliExpress',
    role: 'supplier',
    type: 'rest',
    status: 'active',
    icon: 'bi-globe-asia-australia',
    color: '#E62323',
    createdAt: new Date(Date.now() - 22 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 4 * 60000).toISOString(),
    lastRunStatus: 'success',
    runCount: 130,
    config: {
      baseUrl: 'https://api-sg.aliexpress.com/sync',
      auth: { type: 'apikey', headerName: 'Authorization', value: 'Bearer YOUR_ALIEXPRESS_TOKEN' },
      endpoints: [
        { path: '/', method: 'POST', params: { method: 'aliexpress.affiliate.product.query', keywords: '{query}', pageSize: 20 } }
      ],
      responseMapping: {
        productList: 'aliexpress_affiliate_product_query_response.resp_result.result.products.product',
        name: 'product_title',
        price: 'target_sale_price',
        image: 'product_main_image_url'
      },
      schedule: '45 5 * * *'
    },
    stats: { productsFound: 88, successRate: 97.6, avgResponseMs: 350 }
  },
  {
    id: 'src_dhg_01',
    name: 'DHgate',
    role: 'supplier',
    type: 'scraper',
    status: 'active',
    icon: 'bi-box-seam',
    color: '#00A0E9',
    createdAt: new Date(Date.now() - 19 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 12 * 60000).toISOString(),
    lastRunStatus: 'success',
    runCount: 88,
    config: {
      url: 'https://www.dhgate.com/wholesale/search.do',
      method: 'GET',
      selectors: {
        productList: '.gallery-item',
        name: '.gallery-item h2 a',
        price: '.gallery-item .item-price',
        moq: '.min-order-qty',
        image: '.gallery-item img'
      },
      rateLimit: { requestsPerMinute: 8, delayMs: 7500 },
      schedule: '0 6 * * *'
    },
    stats: { productsFound: 61, successRate: 94.3, avgResponseMs: 1850 }
  },
  {
    id: 'src_faire_01',
    name: 'Faire Wholesale',
    role: 'supplier',
    type: 'graphql',
    status: 'active',
    icon: 'bi-shop-window',
    color: '#6B4EFF',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 7 * 60000).toISOString(),
    lastRunStatus: 'success',
    runCount: 72,
    config: {
      endpoint: 'https://www.faire.com/api/graphql',
      auth: { type: 'bearer', token: 'YOUR_FAIRE_TOKEN' },
      query: `query SearchProducts($query: String!, $first: Int!) {
  searchProducts(query: $query, first: $first) {
    edges {
      node {
        id
        name
        wholesalePrice { amount currency }
        minimumOrderQuantity
        brand { name }
      }
    }
  }
}`,
      variables: { query: '{searchQuery}', first: 50 },
      responseMapping: {
        productList: 'data.searchProducts.edges',
        name: 'node.name',
        price: 'node.wholesalePrice.amount',
        moq: 'node.minimumOrderQuantity'
      },
      schedule: '15 6 * * *'
    },
    stats: { productsFound: 38, successRate: 99.2, avgResponseMs: 210 }
  },
  {
    id: 'src_mic_01',
    name: 'Made-in-China',
    role: 'supplier',
    type: 'soap',
    status: 'syncing',
    icon: 'bi-globe2',
    color: '#D4282A',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    lastRun: new Date(Date.now() - 22 * 60000).toISOString(),
    lastRunStatus: 'partial',
    runCount: 40,
    config: {
      wsdlUrl: 'https://www.made-in-china.com/api/search.wsdl',
      operation: 'ProductSearch',
      auth: { type: 'basic', username: 'YOUR_USERNAME', password: 'YOUR_PASSWORD' },
      namespace: 'http://www.made-in-china.com/api/',
      soapAction: 'ProductSearch',
      requestTemplate: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <ns:ProductSearch>
      <ns:keyword>{{query}}</ns:keyword>
      <ns:pageSize>50</ns:pageSize>
    </ns:ProductSearch>
  </soapenv:Body>
</soapenv:Envelope>`,
      responseMapping: { productList: 'ProductSearchResponse.products.item', name: 'productName', price: 'unitPrice' },
      schedule: '30 6 * * *'
    },
    stats: { productsFound: 45, successRate: 88.7, avgResponseMs: 3200 }
  }
];

// ── Job Log ───────────────────────────────────────────────
const jobLogs = [
  { id: uuidv4(), sourceId: 'src_amz_01', startedAt: new Date(Date.now() - 5*60000).toISOString(), completedAt: new Date(Date.now() - 4*60000).toISOString(), status: 'success', productsFound: 100, errors: 0, durationMs: 58400 },
  { id: uuidv4(), sourceId: 'src_ebay_01', startedAt: new Date(Date.now() - 8*60000).toISOString(), completedAt: new Date(Date.now() - 7*60000).toISOString(), status: 'success', productsFound: 87, errors: 0, durationMs: 1820 },
  { id: uuidv4(), sourceId: 'src_ali_01', startedAt: new Date(Date.now() - 3*60000).toISOString(), completedAt: new Date(Date.now() - 2*60000).toISOString(), status: 'success', productsFound: 94, errors: 0, durationMs: 2140 },
  { id: uuidv4(), sourceId: 'src_fb_01', startedAt: new Date(Date.now() - 15*60000).toISOString(), completedAt: new Date(Date.now() - 13*60000).toISOString(), status: 'partial', productsFound: 42, errors: 13, durationMs: 124000 },
  { id: uuidv4(), sourceId: 'src_mic_01', startedAt: new Date(Date.now() - 22*60000).toISOString(), completedAt: new Date(Date.now() - 19*60000).toISOString(), status: 'partial', productsFound: 38, errors: 7, durationMs: 183000 },
  { id: uuidv4(), sourceId: 'src_aex_01', startedAt: new Date(Date.now() - 4*60000).toISOString(), completedAt: new Date(Date.now() - 3*60000).toISOString(), status: 'success', productsFound: 88, errors: 0, durationMs: 1670 },
  { id: uuidv4(), sourceId: 'src_faire_01', startedAt: new Date(Date.now() - 7*60000).toISOString(), completedAt: new Date(Date.now() - 6*60000).toISOString(), status: 'success', productsFound: 38, errors: 0, durationMs: 980 },
];

// ── Active Run State ──────────────────────────────────────
const activeRuns = {}; // sourceId -> { started, progress, step }

// ── Helper: add job log ───────────────────────────────────
function addJobLog(entry) {
  jobLogs.unshift({ id: uuidv4(), ...entry });
  if (jobLogs.length > 500) jobLogs.pop();
}

// ── Helper: find source ───────────────────────────────────
function findSource(id) {
  return sourceConfigs.find(s => s.id === id);
}

function updateSource(id, patch) {
  const idx = sourceConfigs.findIndex(s => s.id === id);
  if (idx >= 0) Object.assign(sourceConfigs[idx], patch);
}

module.exports = { sourceConfigs, jobLogs, activeRuns, addJobLog, findSource, updateSource };
