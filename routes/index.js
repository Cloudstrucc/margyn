const express = require('express');
const router = express.Router();
const { forwardAuthenticated } = require('../middleware/auth');

router.get('/', forwardAuthenticated, (req, res) => {
  res.render('index', {
    layout: 'landing',
    title: 'Margyn — Product Arbitrage Intelligence'
  });
});

module.exports = router;
