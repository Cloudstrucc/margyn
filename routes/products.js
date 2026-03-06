const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const db = require('../data/db');

router.get('/', ensureAuthenticated, (req, res) => {
  const { sort = 'sales', order = 'desc', category = '', search = '' } = req.query;

  let products = [...db.products];

  if (category) products = products.filter(p => p.category === category);
  if (search) products = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const sortFns = {
    sales: (a, b) => b.monthlySales - a.monthlySales,
    margin: (a, b) => b.margin - a.margin,
    price: (a, b) => b.avgSellPrice - a.avgSellPrice,
    name: (a, b) => a.name.localeCompare(b.name)
  };
  products.sort(sortFns[sort] || sortFns.sales);
  if (order === 'asc') products.reverse();

  const categories = [...new Set(db.products.map(p => p.category))].sort();

  res.render('products/index', {
    title: 'Products — Margyn',
    page: 'products',
    products,
    categories,
    currentCategory: category,
    currentSort: sort,
    currentOrder: order,
    searchQuery: search,
    totalCount: products.length
  });
});

router.get('/:id', ensureAuthenticated, (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.redirect('/products');

  res.render('products/detail', {
    title: `${product.name} — Margyn`,
    page: 'products',
    product,
    supplierSources: db.supplierSources,
    marketSources: db.marketSources
  });
});

module.exports = router;
