const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated } = require('../middleware/auth');
const store = require('../data/sourceStore');
const { runSource, jobEvents } = require('../engines/jobRunner');
const { testConnection } = require('../engines/apiConnector');

router.get('/', ensureAuthenticated, (req, res) => {
  const marketSources  = store.sourceConfigs.filter(s => s.role === 'market');
  const supplierSources = store.sourceConfigs.filter(s => s.role === 'supplier');
  const recentLogs = store.jobLogs.slice(0, 30);
  const stats = {
    total: store.sourceConfigs.length,
    active: store.sourceConfigs.filter(s => s.status === 'active').length,
    errors: store.sourceConfigs.filter(s => s.lastRunStatus === 'error').length,
    partial: store.sourceConfigs.filter(s => s.lastRunStatus === 'partial').length,
    totalRuns: store.jobLogs.length,
    successRate: store.jobLogs.length
      ? Math.round(store.jobLogs.filter(j => j.status === 'success').length / store.jobLogs.length * 100)
      : 0
  };
  res.render('sources/index', {
    title: 'Data Sources — Margyn',
    page: 'sources',
    marketSources, supplierSources, recentLogs, stats,
    sourceTypes: ['scraper', 'rest', 'graphql', 'soap'],
    activeRuns: JSON.stringify(store.activeRuns)
  });
});

router.post('/', ensureAuthenticated, (req, res) => {
  const { name, role, type, color, icon, schedule,
    url, cssListSelector, cssNameSelector, cssPriceSelector, cssRankSelector, cssImageSelector,
    userAgent, delayMs, maxPages,
    baseUrl, endpoint, httpMethod,
    authType, apiKeyHeader, apiKeyValue, bearerToken,
    oauthTokenUrl, oauthClientId, oauthClientSecret, oauthScope,
    basicUsername, basicPassword,
    responseListPath, responseNamePath, responsePricePath, responseMoqPath,
    customHeaders, queryParams,
    graphqlQuery, graphqlVariables,
    wsdlUrl, soapOperation, soapNamespace, soapAction, soapTemplate,
    notes
  } = req.body;

  if (!name || !role || !type) {
    req.flash('error_msg', 'Name, role and type are required.');
    return res.redirect('/sources');
  }

  let authConfig = null;
  if (authType && authType !== 'none') {
    switch (authType) {
      case 'oauth2': authConfig = { type:'oauth2', tokenUrl:oauthTokenUrl, clientId:oauthClientId, clientSecret:oauthClientSecret, scope:oauthScope }; break;
      case 'bearer': authConfig = { type:'bearer', token:bearerToken }; break;
      case 'apikey': authConfig = { type:'apikey', headerName:apiKeyHeader, value:apiKeyValue }; break;
      case 'basic':  authConfig = { type:'basic', username:basicUsername, password:basicPassword }; break;
    }
  }

  let parsedHeaders = {}, parsedVars = {}, parsedParams = {};
  try { parsedHeaders = customHeaders ? JSON.parse(customHeaders) : {}; } catch {}
  try { parsedVars = graphqlVariables ? JSON.parse(graphqlVariables) : {}; } catch {}
  try { parsedParams = queryParams ? JSON.parse(queryParams) : {}; } catch {}

  let config = { schedule: schedule || '0 6 * * *' };
  switch (type) {
    case 'scraper':
      config = { ...config, url, method:'GET',
        headers: { 'User-Agent': userAgent||'Mozilla/5.0 (compatible; MargynBot/1.0)', ...parsedHeaders },
        selectors: { productList:cssListSelector||'', name:cssNameSelector||'', price:cssPriceSelector||'', rank:cssRankSelector||'', image:cssImageSelector||'' },
        rateLimit: { requestsPerMinute: Math.round(60000/(parseInt(delayMs)||3000)), delayMs:parseInt(delayMs)||3000 },
        pagination: parseInt(maxPages)>1 ? { type:'url', pattern:'?pg={page}', maxPages:parseInt(maxPages)||1 } : null,
        notes };
      break;
    case 'rest':
      config = { ...config, baseUrl, auth:authConfig,
        endpoints: [{ path:endpoint||'/', method:httpMethod||'GET', params:parsedParams }],
        responseMapping: { productList:responseListPath||'items', name:responseNamePath||'name', price:responsePricePath||'price', moq:responseMoqPath||null },
        headers: parsedHeaders };
      break;
    case 'graphql':
      config = { ...config, endpoint:baseUrl, auth:authConfig, query:graphqlQuery||'', variables:parsedVars,
        responseMapping: { productList:responseListPath||'data.items', name:responseNamePath||'name', price:responsePricePath||'price', moq:responseMoqPath||null } };
      break;
    case 'soap':
      config = { ...config, wsdlUrl, operation:soapOperation, auth:authConfig, namespace:soapNamespace,
        soapAction:soapAction||soapOperation, requestTemplate:soapTemplate||'',
        responseMapping: { productList:responseListPath||'items', name:responseNamePath||'name', price:responsePricePath||'price' } };
      break;
  }

  store.sourceConfigs.push({
    id: 'src_'+uuidv4().slice(0,8), name, role, type, status:'active',
    icon: icon||(role==='market'?'bi-shop':'bi-building'), color:color||'#00D4FF',
    createdAt:new Date().toISOString(), lastRun:null, lastRunStatus:'never', runCount:0,
    config, stats:{ productsFound:0, successRate:100, avgResponseMs:0 }
  });

  req.flash('success_msg', `Source "${name}" added successfully.`);
  res.redirect('/sources');
});

router.post('/:id/delete', ensureAuthenticated, (req, res) => {
  const idx = store.sourceConfigs.findIndex(s => s.id === req.params.id);
  if (idx >= 0) { store.sourceConfigs.splice(idx, 1); }
  req.flash('success_msg', 'Source removed.');
  res.redirect('/sources');
});

router.post('/:id/toggle', ensureAuthenticated, (req, res) => {
  const source = store.findSource(req.params.id);
  if (source) source.status = source.status === 'active' ? 'paused' : 'active';
  res.redirect('/sources');
});

router.post('/:id/run', ensureAuthenticated, async (req, res) => {
  const source = store.findSource(req.params.id);
  if (!source) return res.status(404).json({ error:'Source not found' });
  runSource(source).catch(console.error);
  res.json({ ok:true, message:`Job started for "${source.name}"` });
});

router.post('/run-all', ensureAuthenticated, async (req, res) => {
  const { runAll } = require('../engines/jobRunner');
  runAll().catch(console.error);
  res.json({ ok:true, message:'All source jobs triggered' });
});

router.post('/:id/test', ensureAuthenticated, async (req, res) => {
  const source = store.findSource(req.params.id);
  if (!source) return res.status(404).json({ error:'Source not found' });
  try { res.json(await testConnection(source)); }
  catch(err) { res.json({ ok:false, error:err.message }); }
});

router.get('/events', ensureAuthenticated, (req, res) => {
  res.setHeader('Content-Type','text/event-stream');
  res.setHeader('Cache-Control','no-cache');
  res.setHeader('Connection','keep-alive');
  res.setHeader('X-Accel-Buffering','no');
  res.flushHeaders();
  const handler = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  jobEvents.on('progress', handler);
  const hb = setInterval(() => res.write(': ping\n\n'), 20000);
  req.on('close', () => { jobEvents.off('progress', handler); clearInterval(hb); });
});

router.get('/logs', ensureAuthenticated, (req, res) => {
  const { sourceId } = req.query;
  const logs = sourceId ? store.jobLogs.filter(l=>l.sourceId===sourceId) : store.jobLogs.slice(0,50);
  res.json(logs);
});

router.get('/:id/detail', ensureAuthenticated, (req, res) => {
  const source = store.findSource(req.params.id);
  if (!source) return res.status(404).json({ error:'not found' });
  const safe = JSON.parse(JSON.stringify(source));
  ['clientSecret','value','token','password'].forEach(k => { if(safe.config?.auth?.[k]) safe.config.auth[k]='••••••••'; });
  res.json(safe);
});

module.exports = router;
