const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

// Passport config
require('./config/passport')(passport);

// Engines
const { startScheduler } = require('./engines/jobRunner');

const app = express();

// Handlebars setup
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    formatCurrency: (val) => {
      if (val == null) return 'N/A';
      return '$' + parseFloat(val).toFixed(2);
    },
    marginClass: (margin) => {
      if (margin == null) return 'text-secondary';
      if (margin > 30) return 'text-success';
      if (margin > 10) return 'text-warning';
      return 'text-danger';
    },
    marginBadge: (margin) => {
      if (margin == null) return 'bg-secondary';
      if (margin > 30) return 'bg-success';
      if (margin > 10) return 'bg-warning text-dark';
      return 'bg-danger';
    },
    trendIcon: (trend) => {
      if (trend === 'up') return '↑';
      if (trend === 'down') return '↓';
      return '→';
    },
    trendClass: (trend) => {
      if (trend === 'up') return 'text-success';
      if (trend === 'down') return 'text-danger';
      return 'text-secondary';
    },
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    formatNum: (n) => n ? n.toLocaleString() : '0',
    activeNav: (page, current) => page === current ? 'active' : '',
    json: (ctx) => JSON.stringify(ctx),
    stars: (rating) => {
      const full = Math.floor(rating);
      const half = rating % 1 >= 0.5;
      let html = '';
      for (let i = 0; i < full; i++) html += '★';
      if (half) html += '½';
      return html;
    },
    sourceIcon: (source) => {
      const icons = {
        amazon: 'bi-bag-fill',
        ebay: 'bi-shop',
        walmart: 'bi-cart4',
        facebook: 'bi-facebook',
        etsy: 'bi-scissors',
        aliexpress: 'bi-globe-asia-australia',
        alibaba: 'bi-building',
        shopify: 'bi-bag-check'
      };
      return icons[source?.toLowerCase()] || 'bi-shop';
    },
    percentage: (val) => val ? val.toFixed(1) + '%' : '0%',
    statusClass: (s) => ({ success:'text-success', partial:'text-warning', error:'text-danger', never:'text-muted', syncing:'text-info' }[s]||'text-muted'),
    statusBadge: (s) => ({ success:'bg-success', partial:'bg-warning text-dark', error:'bg-danger', never:'bg-secondary', syncing:'bg-info' }[s]||'bg-secondary'),
    typeIcon: (t) => ({ scraper:'bi-code-slash', rest:'bi-cloud-arrow-up', graphql:'bi-braces', soap:'bi-file-code', oauth:'bi-shield-lock' }[t]||'bi-plug'),
    relativeTime: (iso) => {
      if (!iso) return 'Never';
      const diff = Date.now() - new Date(iso).getTime();
      if (diff < 60000) return 'just now';
      if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
      if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
      return Math.floor(diff/86400000) + 'd ago';
    },
    durationFmt: (ms) => {
      if (!ms) return '—';
      if (ms < 1000) return ms + 'ms';
      if (ms < 60000) return (ms/1000).toFixed(1) + 's';
      return Math.floor(ms/60000) + 'm ' + Math.floor((ms%60000)/1000) + 's';
    },
    rankNum: (idx) => String(idx + 1).padStart(2, '0')
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: 'margyn-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/products', require('./routes/products'));
app.use('/sources', require('./routes/sources'));
app.use('/b2b', require('./routes/b2b'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  ███╗   ███╗ █████╗ ██████╗  ██████╗██╗   ██╗███╗   ██╗`);
  console.log(`  ████╗ ████║██╔══██╗██╔══██╗██╔════╝╚██╗ ██╔╝████╗  ██║`);
  console.log(`  ██╔████╔██║███████║██████╔╝██║  ███╗ ╚████╔╝ ██╔██╗ ██║`);
  console.log(`  ██║╚██╔╝██║██╔══██║██╔══██╗██║   ██║  ╚██╔╝  ██║╚██╗██║`);
  console.log(`  ██║ ╚═╝ ██║██║  ██║██║  ██║╚██████╔╝   ██║   ██║ ╚████║`);
  console.log(`  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═══╝\n`);
  console.log(`  🎯 Product Arbitrage Intelligence Platform`);
  console.log(`  🚀 Running at http://localhost:${PORT}`);
  console.log(`  👤 Demo: admin@margyn.io / password123\n`);
  startScheduler();
});
