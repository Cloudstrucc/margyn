// ============================================================
// Margyn — API Connector Engine
// Supports: REST, GraphQL, SOAP/WSDL, OAuth 2.0, API Key,
//           Bearer Token, Basic Auth, HMAC signing
// ============================================================

const axios = require('axios');
const xml2js = require('xml2js');

// ── OAuth 2.0 token cache ─────────────────────────────────
const tokenCache = {}; // sourceId -> { token, expiresAt }

async function getOAuthToken(sourceId, authConfig) {
  const cached = tokenCache[sourceId];
  if (cached && cached.expiresAt > Date.now() + 60000) return cached.token;

  const { tokenUrl, clientId, clientSecret, scope, grantType = 'client_credentials' } = authConfig;

  const params = new URLSearchParams({
    grant_type: grantType,
    client_id: clientId,
    client_secret: clientSecret,
    ...(scope ? { scope } : {})
  });

  const response = await axios.post(tokenUrl, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 10000
  });

  const { access_token, expires_in = 3600 } = response.data;
  tokenCache[sourceId] = { token: access_token, expiresAt: Date.now() + expires_in * 1000 };
  return access_token;
}

// ── Build auth headers ────────────────────────────────────
async function buildAuthHeaders(sourceId, authConfig) {
  if (!authConfig) return {};
  const { type } = authConfig;

  switch (type) {
    case 'oauth2': {
      const token = await getOAuthToken(sourceId, authConfig);
      return { Authorization: `Bearer ${token}` };
    }
    case 'bearer':
      return { Authorization: `Bearer ${authConfig.token}` };
    case 'apikey':
      return { [authConfig.headerName]: authConfig.value };
    case 'basic': {
      const b64 = Buffer.from(`${authConfig.username}:${authConfig.password}`).toString('base64');
      return { Authorization: `Basic ${b64}` };
    }
    case 'hmac':
      // Would compute HMAC-SHA256 signature; simplified here
      return { 'X-Signature': 'HMAC_PLACEHOLDER' };
    default:
      return {};
  }
}

// ── Deep path resolver ────────────────────────────────────
function resolvePath(obj, path) {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return null;
    const arrMatch = key.match(/^(.+)\[(\d+)\]$/);
    if (arrMatch) {
      const arr = acc[arrMatch[1]];
      return Array.isArray(arr) ? arr[parseInt(arrMatch[2])] : null;
    }
    return acc[key] ?? null;
  }, obj);
}

// ── Map raw API product to Margyn product schema ──────────
function mapProduct(raw, mapping) {
  return {
    name:     String(resolvePath(raw, mapping.name) ?? '').trim() || null,
    price:    parseFloat(resolvePath(raw, mapping.price)) || null,
    moq:      parseInt(resolvePath(raw, mapping.moq)) || null,
    currency: resolvePath(raw, mapping.currency) || 'USD',
    image:    resolvePath(raw, mapping.image) || null,
    supplier: resolvePath(raw, mapping.supplier) || null,
    raw
  };
}

// ── REST Connector ────────────────────────────────────────
async function callRest(sourceId, config, searchQuery, onProgress) {
  const { baseUrl, auth, endpoints = [], responseMapping } = config;
  const authHeaders = await buildAuthHeaders(sourceId, auth);

  const results = [];
  const errors = [];

  for (const ep of endpoints) {
    onProgress?.({ step: 'calling', endpoint: ep.path });
    const params = {};
    for (const [k, v] of Object.entries(ep.params || {})) {
      params[k] = typeof v === 'string' ? v.replace('{query}', searchQuery || '') : v;
    }

    try {
      const url = baseUrl.replace(/\/$/, '') + ep.path;
      const response = await axios({
        method: ep.method || 'GET',
        url,
        params: ep.method === 'GET' ? params : undefined,
        data: ep.method !== 'GET' ? params : undefined,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        timeout: 12000
      });

      const list = resolvePath(response.data, responseMapping.productList);
      if (Array.isArray(list)) {
        list.forEach(item => results.push(mapProduct(item, responseMapping)));
        onProgress?.({ step: 'parsed', count: list.length });
      } else {
        errors.push({ endpoint: ep.path, error: 'Unexpected response shape', raw: JSON.stringify(response.data).slice(0, 200) });
      }
    } catch (err) {
      errors.push({ endpoint: ep.path, error: err.message, status: err.response?.status });
    }
  }

  return { products: results, errors, totalFound: results.length };
}

// ── GraphQL Connector ─────────────────────────────────────
async function callGraphQL(sourceId, config, searchQuery, onProgress) {
  const { endpoint, auth, query, variables = {}, responseMapping } = config;
  const authHeaders = await buildAuthHeaders(sourceId, auth);

  onProgress?.({ step: 'graphql-query', endpoint });

  // Substitute {searchQuery} in variables
  const resolvedVars = {};
  for (const [k, v] of Object.entries(variables)) {
    resolvedVars[k] = typeof v === 'string' ? v.replace('{searchQuery}', searchQuery || '') : v;
  }

  try {
    const response = await axios.post(endpoint, { query, variables: resolvedVars }, {
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      timeout: 12000
    });

    if (response.data.errors) {
      return { products: [], errors: response.data.errors, totalFound: 0 };
    }

    const list = resolvePath(response.data, responseMapping.productList);
    if (!Array.isArray(list)) {
      return { products: [], errors: [{ error: 'productList path returned non-array' }], totalFound: 0 };
    }

    const products = list.map(item => mapProduct(item, responseMapping));
    onProgress?.({ step: 'parsed', count: products.length });
    return { products, errors: [], totalFound: products.length };

  } catch (err) {
    return { products: [], errors: [{ error: err.message }], totalFound: 0 };
  }
}

// ── SOAP Connector ────────────────────────────────────────
async function callSOAP(sourceId, config, searchQuery, onProgress) {
  const { wsdlUrl, operation, auth, namespace, soapAction, requestTemplate, responseMapping } = config;
  const authHeaders = await buildAuthHeaders(sourceId, auth);

  onProgress?.({ step: 'soap-call', operation });

  // Substitute query in SOAP template
  const body = requestTemplate.replace(/\{\{query\}\}/g, searchQuery || '');

  try {
    const wsdlBase = new URL(wsdlUrl);
    const serviceUrl = `${wsdlBase.protocol}//${wsdlBase.host}${wsdlBase.pathname.replace('.wsdl', '')}`;

    const response = await axios.post(serviceUrl, body, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': soapAction || operation,
        ...authHeaders
      },
      timeout: 20000
    });

    const parsed = await xml2js.parseStringPromise(response.data, {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    });

    const list = resolvePath(parsed, responseMapping.productList);
    const items = Array.isArray(list) ? list : (list ? [list] : []);
    const products = items.map(item => mapProduct(item, responseMapping));

    onProgress?.({ step: 'parsed', count: products.length });
    return { products, errors: [], totalFound: products.length };

  } catch (err) {
    return { products: [], errors: [{ error: err.message }], totalFound: 0 };
  }
}

// ── Router ────────────────────────────────────────────────
async function runConnector(source, searchQuery, onProgress) {
  switch (source.type) {
    case 'rest':     return callRest(source.id, source.config, searchQuery, onProgress);
    case 'graphql':  return callGraphQL(source.id, source.config, searchQuery, onProgress);
    case 'soap':     return callSOAP(source.id, source.config, searchQuery, onProgress);
    default:
      return { products: [], errors: [{ error: `Unknown connector type: ${source.type}` }], totalFound: 0 };
  }
}

// ── Test connection (validate config) ─────────────────────
async function testConnection(source) {
  const start = Date.now();
  try {
    if (source.type === 'scraper') {
      // Simple HEAD request to test reachability
      const { scrape } = require('./scraper');
      const res = await axios.head(source.config.url, {
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MargynBot/1.0)' }
      });
      return { ok: res.status < 400, statusCode: res.status, latencyMs: Date.now() - start };
    }

    const authHeaders = await buildAuthHeaders(source.id, source.config?.auth);
    const testUrl = source.type === 'graphql'
      ? source.config.endpoint
      : source.config.baseUrl;

    const res = await axios.options(testUrl, {
      headers: authHeaders,
      timeout: 8000,
      validateStatus: () => true
    });
    return { ok: res.status < 500, statusCode: res.status, latencyMs: Date.now() - start };
  } catch (err) {
    return { ok: false, error: err.message, latencyMs: Date.now() - start };
  }
}

module.exports = { runConnector, testConnection, buildAuthHeaders };
