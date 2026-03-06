const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { b2bProducts, sectors, b2bStats } = require('../data/b2bStore');

// ── Index ─────────────────────────────────────────────────
router.get('/', ensureAuthenticated, (req, res) => {
  const { sort = 'demand', industry = '', search = '' } = req.query;

  let products = [...b2bProducts];

  if (industry) products = products.filter(p => p.industry === industry);
  if (search) products = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  const sortFns = {
    demand:   (a, b) => b.annualDemandUnits - a.annualDemandUnits,
    margin:   (a, b) => b.margin - a.margin,
    price:    (a, b) => b.marketPrice - a.marketPrice,
    leadtime: (a, b) => a.leadTimeDays - b.leadTimeDays,
    name:     (a, b) => a.name.localeCompare(b.name)
  };
  products.sort(sortFns[sort] || sortFns.demand);

  const industries = [...new Set(b2bProducts.map(p => p.industry))].sort();

  res.render('b2b/index', {
    title: 'B2B Commercial — Margyn',
    page: 'b2b',
    products,
    sectors,
    b2bStats,
    industries,
    currentIndustry: industry,
    currentSort: sort,
    searchQuery: search,
    totalCount: products.length
  });
});

// ── Detail ────────────────────────────────────────────────
router.get('/:id', ensureAuthenticated, (req, res) => {
  const product = b2bProducts.find(p => p.id === req.params.id);
  if (!product) return res.redirect('/b2b');

  res.render('b2b/detail', {
    title: `${product.name} — B2B — Margyn`,
    page: 'b2b',
    product
  });
});

module.exports = router;
