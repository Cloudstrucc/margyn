const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const db = require('../data/db');

router.get('/', ensureAuthenticated, (req, res) => {
  const topProducts = [...db.products]
    .sort((a, b) => b.monthlySales - a.monthlySales)
    .slice(0, 5);

  const bestMargins = [...db.products]
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  res.render('dashboard/index', {
    title: 'Dashboard — Margyn',
    page: 'dashboard',
    stats: db.stats,
    topProducts,
    bestMargins,
    chartData: JSON.stringify(db.chartData),
    marketSources: db.marketSources,
    supplierSources: db.supplierSources
  });
});

module.exports = router;
