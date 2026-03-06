const bcrypt = require('bcryptjs');

// ── Users ────────────────────────────────────────────────────────────────────
const hashedPassword = bcrypt.hashSync('password123', 10);

const users = [
  { id: '1', name: 'Alex Rivera', email: 'admin@margyn.io', password: hashedPassword, role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=00D4FF&color=0A1628&bold=true' },
  { id: '2', name: 'Jordan Lee', email: 'jordan@margyn.io', password: hashedPassword, role: 'analyst', avatar: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=7B2FBE&color=fff&bold=true' }
];

// ── Market Sources ────────────────────────────────────────────────────────────
const marketSources = [
  { id: 'amazon', name: 'Amazon', icon: 'bi-bag-fill', color: '#FF9900', status: 'active', lastSync: '2 min ago', productsTracked: 100 },
  { id: 'ebay', name: 'eBay', icon: 'bi-shop', color: '#E53238', status: 'active', lastSync: '5 min ago', productsTracked: 87 },
  { id: 'walmart', name: 'Walmart', icon: 'bi-cart4', color: '#0071CE', status: 'active', lastSync: '8 min ago', productsTracked: 73 },
  { id: 'facebook', name: 'Facebook Marketplace', icon: 'bi-facebook', color: '#1877F2', status: 'active', lastSync: '12 min ago', productsTracked: 55 },
  { id: 'etsy', name: 'Etsy', icon: 'bi-scissors', color: '#F1641E', status: 'active', lastSync: '15 min ago', productsTracked: 42 },
];

// ── Supplier Sources ──────────────────────────────────────────────────────────
const supplierSources = [
  { id: 'alibaba', name: 'Alibaba', icon: 'bi-building', color: '#FF6A00', status: 'active', lastSync: '3 min ago', productsMatched: 94 },
  { id: 'aliexpress', name: 'AliExpress', icon: 'bi-globe-asia-australia', color: '#E62323', status: 'active', lastSync: '4 min ago', productsMatched: 88 },
  { id: 'dhgate', name: 'DHgate', icon: 'bi-box-seam', color: '#00A0E9', status: 'active', lastSync: '10 min ago', productsMatched: 61 },
  { id: 'made_china', name: 'Made-in-China', icon: 'bi-globe2', color: '#D4282A', status: 'syncing', lastSync: '20 min ago', productsMatched: 45 },
  { id: 'faire', name: 'Faire (Wholesale)', icon: 'bi-shop-window', color: '#6B4EFF', status: 'active', lastSync: '6 min ago', productsMatched: 38 },
];

// ── Products ──────────────────────────────────────────────────────────────────
const products = [
  {
    id: 'p001',
    name: 'Wireless Earbuds Pro X',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=80&h=80&fit=crop',
    sku: 'ELEC-WEP-001',
    monthlySales: 28400,
    trend: 'up',
    rating: 4.5,
    reviewCount: 12847,
    marketSources: {
      amazon: { price: 49.99, rank: 3 },
      ebay: { price: 44.95, rank: 8 },
      walmart: { price: 47.88, rank: 5 }
    },
    avgSellPrice: 47.61,
    supplierPrices: {
      alibaba: { price: 8.50, moq: 100 },
      aliexpress: { price: 11.20, moq: 1 },
      dhgate: { price: 9.80, moq: 50 }
    },
    bestSupplierPrice: 8.50,
    margin: 82.1,
    marginAmount: 39.11,
    tags: ['trending', 'high-volume']
  },
  {
    id: 'p002',
    name: 'Portable Phone Stand Adjustable',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2844?w=80&h=80&fit=crop',
    sku: 'ACC-PSA-002',
    monthlySales: 41200,
    trend: 'up',
    rating: 4.7,
    reviewCount: 23419,
    marketSources: {
      amazon: { price: 15.99, rank: 1 },
      ebay: { price: 13.49, rank: 4 },
      walmart: { price: 14.97, rank: 2 }
    },
    avgSellPrice: 14.82,
    supplierPrices: {
      alibaba: { price: 1.20, moq: 200 },
      aliexpress: { price: 1.85, moq: 1 },
      dhgate: { price: 1.45, moq: 100 }
    },
    bestSupplierPrice: 1.20,
    margin: 91.9,
    marginAmount: 13.62,
    tags: ['best-margin', 'high-volume']
  },
  {
    id: 'p003',
    name: 'LED Strip Lights 10m Smart',
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop',
    sku: 'HOM-LED-003',
    monthlySales: 35800,
    trend: 'up',
    rating: 4.3,
    reviewCount: 18923,
    marketSources: {
      amazon: { price: 24.99, rank: 2 },
      ebay: { price: 19.99, rank: 6 },
      walmart: { price: 22.88, rank: 3 }
    },
    avgSellPrice: 22.62,
    supplierPrices: {
      alibaba: { price: 3.80, moq: 150 },
      aliexpress: { price: 5.20, moq: 1 },
      dhgate: { price: 4.10, moq: 50 }
    },
    bestSupplierPrice: 3.80,
    margin: 83.2,
    marginAmount: 18.82,
    tags: ['trending', 'high-volume']
  },
  {
    id: 'p004',
    name: 'Silicone Kitchen Utensil Set 6pc',
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop',
    sku: 'KIT-SUS-004',
    monthlySales: 19600,
    trend: 'stable',
    rating: 4.6,
    reviewCount: 9234,
    marketSources: {
      amazon: { price: 22.99, rank: 4 },
      walmart: { price: 21.47, rank: 3 },
      etsy: { price: 28.00, rank: 12 }
    },
    avgSellPrice: 24.15,
    supplierPrices: {
      alibaba: { price: 4.50, moq: 100 },
      aliexpress: { price: 6.80, moq: 1 },
      made_china: { price: 4.20, moq: 200 }
    },
    bestSupplierPrice: 4.20,
    margin: 82.6,
    marginAmount: 19.95,
    tags: ['steady-seller']
  },
  {
    id: 'p005',
    name: 'Resistance Bands Set (5 levels)',
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=80&h=80&fit=crop',
    sku: 'FIT-RBS-005',
    monthlySales: 31700,
    trend: 'up',
    rating: 4.4,
    reviewCount: 15672,
    marketSources: {
      amazon: { price: 18.99, rank: 2 },
      ebay: { price: 15.00, rank: 9 },
      walmart: { price: 17.44, rank: 4 }
    },
    avgSellPrice: 17.14,
    supplierPrices: {
      alibaba: { price: 2.10, moq: 200 },
      aliexpress: { price: 3.20, moq: 1 },
      dhgate: { price: 2.40, moq: 100 }
    },
    bestSupplierPrice: 2.10,
    margin: 87.7,
    marginAmount: 15.04,
    tags: ['trending', 'high-volume']
  },
  {
    id: 'p006',
    name: 'Car Phone Mount Magnetic',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1609337162800-a78ddf6ad68a?w=80&h=80&fit=crop',
    sku: 'AUT-CPM-006',
    monthlySales: 52100,
    trend: 'up',
    rating: 4.2,
    reviewCount: 31445,
    marketSources: {
      amazon: { price: 12.99, rank: 1 },
      ebay: { price: 9.99, rank: 5 },
      walmart: { price: 11.88, rank: 2 }
    },
    avgSellPrice: 11.62,
    supplierPrices: {
      alibaba: { price: 1.05, moq: 500 },
      aliexpress: { price: 1.60, moq: 1 },
      dhgate: { price: 1.20, moq: 200 }
    },
    bestSupplierPrice: 1.05,
    margin: 91.0,
    marginAmount: 10.57,
    tags: ['best-margin', 'high-volume', 'trending']
  },
  {
    id: 'p007',
    name: 'Stainless Steel Water Bottle 1L',
    category: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&h=80&fit=crop',
    sku: 'SPO-WB1-007',
    monthlySales: 24900,
    trend: 'stable',
    rating: 4.8,
    reviewCount: 8921,
    marketSources: {
      amazon: { price: 29.99, rank: 7 },
      walmart: { price: 27.88, rank: 5 },
      etsy: { price: 35.00, rank: 18 }
    },
    avgSellPrice: 30.96,
    supplierPrices: {
      alibaba: { price: 4.80, moq: 100 },
      aliexpress: { price: 6.50, moq: 1 },
      dhgate: { price: 5.20, moq: 50 }
    },
    bestSupplierPrice: 4.80,
    margin: 84.5,
    marginAmount: 26.16,
    tags: ['steady-seller']
  },
  {
    id: 'p008',
    name: 'USB-C Hub 7-in-1 Multiport',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=80&h=80&fit=crop',
    sku: 'ELEC-HUB-008',
    monthlySales: 17300,
    trend: 'up',
    rating: 4.1,
    reviewCount: 6782,
    marketSources: {
      amazon: { price: 39.99, rank: 12 },
      ebay: { price: 32.00, rank: 18 },
      walmart: { price: 36.88, rank: 9 }
    },
    avgSellPrice: 36.29,
    supplierPrices: {
      alibaba: { price: 9.50, moq: 100 },
      aliexpress: { price: 12.80, moq: 1 },
      dhgate: { price: 10.40, moq: 50 }
    },
    bestSupplierPrice: 9.50,
    margin: 73.8,
    marginAmount: 26.79,
    tags: []
  },
  {
    id: 'p009',
    name: 'Bamboo Cutting Board Set 3pc',
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1616783781917-2c4a3b4a0c67?w=80&h=80&fit=crop',
    sku: 'KIT-BCB-009',
    monthlySales: 14200,
    trend: 'down',
    rating: 4.5,
    reviewCount: 5234,
    marketSources: {
      amazon: { price: 26.99, rank: 9 },
      walmart: { price: 24.97, rank: 7 },
      etsy: { price: 34.00, rank: 22 }
    },
    avgSellPrice: 28.65,
    supplierPrices: {
      alibaba: { price: 5.20, moq: 100 },
      aliexpress: { price: 7.40, moq: 1 },
      made_china: { price: 4.90, moq: 200 }
    },
    bestSupplierPrice: 4.90,
    margin: 82.9,
    marginAmount: 23.75,
    tags: []
  },
  {
    id: 'p010',
    name: 'Foam Roller Deep Tissue 33cm',
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=80&h=80&fit=crop',
    sku: 'FIT-FR3-010',
    monthlySales: 22100,
    trend: 'stable',
    rating: 4.6,
    reviewCount: 11234,
    marketSources: {
      amazon: { price: 21.99, rank: 5 },
      ebay: { price: 17.99, rank: 11 },
      walmart: { price: 19.88, rank: 6 }
    },
    avgSellPrice: 19.95,
    supplierPrices: {
      alibaba: { price: 3.40, moq: 150 },
      aliexpress: { price: 4.80, moq: 1 },
      dhgate: { price: 3.70, moq: 100 }
    },
    bestSupplierPrice: 3.40,
    margin: 82.9,
    marginAmount: 16.55,
    tags: ['steady-seller']
  },
  {
    id: 'p011',
    name: 'Smart WiFi Plug Mini (4-pack)',
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=80&h=80&fit=crop',
    sku: 'SHO-WPM-011',
    monthlySales: 38900,
    trend: 'up',
    rating: 4.3,
    reviewCount: 19872,
    marketSources: {
      amazon: { price: 29.99, rank: 3 },
      walmart: { price: 27.88, rank: 4 },
      ebay: { price: 25.00, rank: 14 }
    },
    avgSellPrice: 27.62,
    supplierPrices: {
      alibaba: { price: 5.80, moq: 200 },
      aliexpress: { price: 8.20, moq: 1 },
      dhgate: { price: 6.40, moq: 100 }
    },
    bestSupplierPrice: 5.80,
    margin: 79.0,
    marginAmount: 21.82,
    tags: ['trending', 'high-volume']
  },
  {
    id: 'p012',
    name: 'Garden Kneeling Pad Thick Foam',
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop',
    sku: 'GAR-KPF-012',
    monthlySales: 9800,
    trend: 'down',
    rating: 4.4,
    reviewCount: 3421,
    marketSources: {
      amazon: { price: 17.99, rank: 14 },
      walmart: { price: 16.47, rank: 10 },
      facebook: { price: 12.00, rank: null }
    },
    avgSellPrice: 15.49,
    supplierPrices: {
      alibaba: { price: 2.20, moq: 200 },
      aliexpress: { price: 3.10, moq: 1 },
      dhgate: { price: 2.50, moq: 100 }
    },
    bestSupplierPrice: 2.20,
    margin: 85.8,
    marginAmount: 13.29,
    tags: []
  }
];

// ── Analytics / Stats ─────────────────────────────────────────────────────────
const stats = {
  totalProducts: products.length,
  avgMargin: parseFloat((products.reduce((a, p) => a + p.margin, 0) / products.length).toFixed(1)),
  topMarginProduct: products.reduce((best, p) => p.margin > best.margin ? p : best, products[0]),
  totalMonthlySales: products.reduce((a, p) => a + p.monthlySales, 0),
  sourcesActive: marketSources.length + supplierSources.length,
  lastUpdated: new Date().toLocaleString(),
  weeklyRevenue: 847200,
  weeklyGrowth: 12.4,
  newOpportunities: 7,
  alerts: 3
};

// ── Chart Data ────────────────────────────────────────────────────────────────
const chartData = {
  marginDistribution: {
    labels: ['80-85%', '85-90%', '90%+', '70-80%', '<70%'],
    values: [5, 3, 3, 1, 0]
  },
  topCategories: {
    labels: ['Electronics', 'Fitness', 'Kitchen', 'Home & Garden', 'Accessories', 'Other'],
    values: [3, 2, 2, 2, 1, 2]
  },
  salesTrend: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    revenue: [118000, 125000, 132000, 128000, 145000, 162000, 137000],
    units: [4200, 4480, 4720, 4560, 5180, 5780, 4890]
  }
};

module.exports = { users, products, marketSources, supplierSources, stats, chartData };
