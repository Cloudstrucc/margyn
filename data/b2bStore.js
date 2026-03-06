// ============================================================
// Margyn — B2B Commercial Data Store
// Industries: Electronics Components, Manufacturing, Industrial
// Supplies, Raw Materials, Medical/Lab, Automotive, Construction
// ============================================================

const b2bProducts = [
  {
    id: 'b001',
    name: 'SMD Resistor Kit 0402 (10,000 pcs)',
    industry: 'Electronics Components',
    subcategory: 'Passive Components',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&h=80&fit=crop',
    sku: 'ELEC-RES-0402',
    description: 'Surface mount resistor assortment, 1% tolerance, 170 values, AEC-Q200 compliant',
    certifications: ['RoHS', 'AEC-Q200', 'ISO 9001'],
    originCountry: 'China',
    leadTimeDays: 14,
    trend: 'up',
    annualDemandUnits: 4200000,
    rating: 4.6,
    reviewCount: 892,
    marketPrice: 48.50,
    pricingTiers: [
      { moq: 10,   unitPrice: 44.99, label: 'Sample' },
      { moq: 50,   unitPrice: 39.50, label: 'Small' },
      { moq: 200,  unitPrice: 32.00, label: 'Standard' },
      { moq: 1000, unitPrice: 24.80, label: 'Bulk' },
      { moq: 5000, unitPrice: 19.20, label: 'Volume' }
    ],
    bestUnitPrice: 19.20,
    bestMoq: 5000,
    margin: 60.4,
    marginAmount: 29.30,
    paymentTerms: ['T/T', 'L/C', 'NET30'],
    tags: ['high-volume', 'trending', 'certified'],
    suppliers: [
      { name: 'Yageo Corp', country: 'TW', rating: 4.8, verified: true },
      { name: 'Walsin Technology', country: 'CN', rating: 4.5, verified: true }
    ]
  },
  {
    id: 'b002',
    name: 'Industrial Bearing SKF 6205-2RS (100 pcs)',
    industry: 'Manufacturing',
    subcategory: 'Bearings & Seals',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop',
    sku: 'MFG-BRG-6205',
    description: 'Deep groove ball bearing, 25x52x15mm, rubber sealed, grease lubricated',
    certifications: ['ISO 9001', 'DIN 625', 'CE'],
    originCountry: 'Germany',
    leadTimeDays: 7,
    trend: 'stable',
    annualDemandUnits: 820000,
    rating: 4.9,
    reviewCount: 2341,
    marketPrice: 8.40,
    pricingTiers: [
      { moq: 10,  unitPrice: 7.20,  label: 'Sample' },
      { moq: 50,  unitPrice: 6.10,  label: 'Small' },
      { moq: 200, unitPrice: 4.80,  label: 'Standard' },
      { moq: 500, unitPrice: 3.90,  label: 'Bulk' },
      { moq: 2000,unitPrice: 3.10,  label: 'Volume' }
    ],
    bestUnitPrice: 3.10,
    bestMoq: 2000,
    margin: 63.1,
    marginAmount: 5.30,
    paymentTerms: ['T/T', 'NET30', 'NET60'],
    tags: ['steady-seller', 'certified'],
    suppliers: [
      { name: 'SKF Group', country: 'SE', rating: 4.9, verified: true },
      { name: 'NSK Ltd', country: 'JP', rating: 4.8, verified: true }
    ]
  },
  {
    id: 'b003',
    name: 'Polypropylene Resin PP-H 100 (500kg)',
    industry: 'Raw Materials',
    subcategory: 'Polymers & Plastics',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=80&h=80&fit=crop',
    sku: 'RAW-PPR-H100',
    description: 'Homopolymer PP resin, MFI 3g/10min, natural pellets, food-grade, injection moulding grade',
    certifications: ['FDA', 'REACH', 'ISO 9001'],
    originCountry: 'South Korea',
    leadTimeDays: 21,
    trend: 'up',
    annualDemandUnits: 95000,
    rating: 4.4,
    reviewCount: 412,
    marketPrice: 1.42,
    pricingTiers: [
      { moq: 500,  unitPrice: 1.28, label: 'Min Order' },
      { moq: 2000, unitPrice: 1.15, label: 'Standard' },
      { moq: 5000, unitPrice: 1.04, label: 'Bulk' },
      { moq: 20000,unitPrice: 0.94, label: 'Container' }
    ],
    bestUnitPrice: 0.94,
    bestMoq: 20000,
    margin: 33.8,
    marginAmount: 0.48,
    paymentTerms: ['L/C', 'T/T', 'NET60'],
    tags: ['certified', 'high-volume'],
    unit: 'kg',
    suppliers: [
      { name: 'LG Chem', country: 'KR', rating: 4.7, verified: true },
      { name: 'Lotte Chemical', country: 'KR', rating: 4.5, verified: true }
    ]
  },
  {
    id: 'b004',
    name: 'HEPA Filter Media Roll 1m × 50m',
    industry: 'Industrial Supplies',
    subcategory: 'Filtration',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=80&h=80&fit=crop',
    sku: 'IND-HEP-R150',
    description: 'H14 grade HEPA media, 99.995% efficiency @0.3μm, polypropylene microfibre, cleanroom rated',
    certifications: ['EN 1822', 'ISO 14644', 'ULPA'],
    originCountry: 'Germany',
    leadTimeDays: 10,
    trend: 'up',
    annualDemandUnits: 38000,
    rating: 4.7,
    reviewCount: 674,
    marketPrice: 320.00,
    pricingTiers: [
      { moq: 1,   unitPrice: 298.00, label: 'Single' },
      { moq: 5,   unitPrice: 265.00, label: 'Small' },
      { moq: 20,  unitPrice: 228.00, label: 'Standard' },
      { moq: 100, unitPrice: 195.00, label: 'Bulk' }
    ],
    bestUnitPrice: 195.00,
    bestMoq: 100,
    margin: 39.1,
    marginAmount: 125.00,
    paymentTerms: ['T/T', 'NET30'],
    tags: ['certified', 'trending'],
    suppliers: [
      { name: 'Freudenberg Filtration', country: 'DE', rating: 4.9, verified: true },
      { name: 'Ahlstrom-Munksjö', country: 'FI', rating: 4.6, verified: true }
    ]
  },
  {
    id: 'b005',
    name: 'CNC Carbide End Mill 4F ⌀6mm (50 pcs)',
    industry: 'Manufacturing',
    subcategory: 'Cutting Tools',
    image: 'https://images.unsplash.com/photo-1565087868997-f2dfb73df5be?w=80&h=80&fit=crop',
    sku: 'MFG-CEM-6MM',
    description: '4-flute solid carbide end mill, TiAlN coated, 6mm diameter, 50mm LOC, HRC65 hardness',
    certifications: ['ISO 1641', 'DIN 6527'],
    originCountry: 'Japan',
    leadTimeDays: 12,
    trend: 'stable',
    annualDemandUnits: 210000,
    rating: 4.8,
    reviewCount: 1203,
    marketPrice: 18.50,
    pricingTiers: [
      { moq: 10,  unitPrice: 16.80, label: 'Sample' },
      { moq: 50,  unitPrice: 13.20, label: 'Small' },
      { moq: 200, unitPrice: 10.50, label: 'Standard' },
      { moq: 500, unitPrice: 8.40,  label: 'Bulk' }
    ],
    bestUnitPrice: 8.40,
    bestMoq: 500,
    margin: 54.6,
    marginAmount: 10.10,
    paymentTerms: ['T/T', 'NET30'],
    tags: ['steady-seller', 'certified'],
    suppliers: [
      { name: 'OSG Corporation', country: 'JP', rating: 4.9, verified: true },
      { name: 'Kennametal', country: 'US', rating: 4.7, verified: true }
    ]
  },
  {
    id: 'b006',
    name: 'Medical Disposable Gloves Nitrile L (1000 pcs)',
    industry: 'Medical & Lab',
    subcategory: 'PPE & Disposables',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&h=80&fit=crop',
    sku: 'MED-GLV-NIT-L',
    description: 'Powder-free nitrile examination gloves, AQL 1.5, 3.5g, blue, FDA 510k cleared',
    certifications: ['FDA 510k', 'EN 455', 'ISO 11193'],
    originCountry: 'Malaysia',
    leadTimeDays: 18,
    trend: 'up',
    annualDemandUnits: 18000000,
    rating: 4.5,
    reviewCount: 5621,
    marketPrice: 72.00,
    pricingTiers: [
      { moq: 10,   unitPrice: 68.00, label: 'Sample' },
      { moq: 100,  unitPrice: 58.50, label: 'Small' },
      { moq: 500,  unitPrice: 48.00, label: 'Standard' },
      { moq: 2000, unitPrice: 38.40, label: 'Bulk' },
      { moq: 10000,unitPrice: 31.20, label: 'Volume' }
    ],
    bestUnitPrice: 31.20,
    bestMoq: 10000,
    margin: 56.7,
    marginAmount: 40.80,
    paymentTerms: ['T/T', 'L/C', 'NET60'],
    tags: ['high-volume', 'certified', 'trending'],
    unit: 'case',
    suppliers: [
      { name: 'Top Glove Corp', country: 'MY', rating: 4.6, verified: true },
      { name: 'Hartalega', country: 'MY', rating: 4.7, verified: true }
    ]
  },
  {
    id: 'b007',
    name: 'Aluminium Alloy 6061-T6 Sheet 1220×2440×3mm',
    industry: 'Raw Materials',
    subcategory: 'Metals & Alloys',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=80&h=80&fit=crop',
    sku: 'RAW-AL-6061-3',
    description: '6061-T6 aluminium alloy sheet, mill finish, aerospace grade, ASTM B209 compliant',
    certifications: ['ASTM B209', 'AMS 2770', 'ISO 6361'],
    originCountry: 'USA',
    leadTimeDays: 8,
    trend: 'stable',
    annualDemandUnits: 72000,
    rating: 4.7,
    reviewCount: 1876,
    marketPrice: 86.00,
    pricingTiers: [
      { moq: 5,   unitPrice: 78.50, label: 'Sample' },
      { moq: 20,  unitPrice: 68.00, label: 'Small' },
      { moq: 100, unitPrice: 57.20, label: 'Standard' },
      { moq: 500, unitPrice: 49.80, label: 'Bulk' }
    ],
    bestUnitPrice: 49.80,
    bestMoq: 500,
    margin: 42.1,
    marginAmount: 36.20,
    paymentTerms: ['T/T', 'NET30', 'NET60'],
    tags: ['steady-seller', 'certified'],
    unit: 'sheet',
    suppliers: [
      { name: 'Alcoa Corporation', country: 'US', rating: 4.8, verified: true },
      { name: 'Norsk Hydro', country: 'NO', rating: 4.7, verified: true }
    ]
  },
  {
    id: 'b008',
    name: 'OBD-II Diagnostic Module CAN Bus (100 pcs)',
    industry: 'Automotive',
    subcategory: 'Electronics & Diagnostics',
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=80&h=80&fit=crop',
    sku: 'AUT-OBD-CAN-100',
    description: 'OBD2 protocol module, CAN/LIN bus, ISO 15765 compliant, operating temp -40°C to +105°C',
    certifications: ['ISO 15765', 'AEC-Q100', 'CE', 'RoHS'],
    originCountry: 'China',
    leadTimeDays: 20,
    trend: 'up',
    annualDemandUnits: 520000,
    rating: 4.3,
    reviewCount: 789,
    marketPrice: 34.00,
    pricingTiers: [
      { moq: 10,  unitPrice: 29.50, label: 'Sample' },
      { moq: 50,  unitPrice: 23.80, label: 'Small' },
      { moq: 200, unitPrice: 18.40, label: 'Standard' },
      { moq: 500, unitPrice: 14.60, label: 'Bulk' },
      { moq: 2000,unitPrice: 11.20, label: 'Volume' }
    ],
    bestUnitPrice: 11.20,
    bestMoq: 2000,
    margin: 67.1,
    marginAmount: 22.80,
    paymentTerms: ['T/T', 'NET30'],
    tags: ['trending', 'certified', 'high-volume'],
    suppliers: [
      { name: 'Continental AG', country: 'DE', rating: 4.8, verified: true },
      { name: 'Shenzhen Zhiyuan', country: 'CN', rating: 4.2, verified: false }
    ]
  },
  {
    id: 'b009',
    name: 'Portland Cement CEM I 52.5R (1 tonne bag)',
    industry: 'Construction',
    subcategory: 'Binding Agents',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop',
    sku: 'CON-CEM-52R',
    description: 'High-early-strength Portland cement, BS EN 197-1 certified, 1000kg big bag, 28-day strength 60MPa',
    certifications: ['BS EN 197-1', 'CE', 'ISO 9001'],
    originCountry: 'United Kingdom',
    leadTimeDays: 3,
    trend: 'stable',
    annualDemandUnits: 4800000,
    rating: 4.5,
    reviewCount: 3241,
    marketPrice: 142.00,
    pricingTiers: [
      { moq: 1,   unitPrice: 138.00, label: 'Single' },
      { moq: 10,  unitPrice: 128.00, label: 'Small' },
      { moq: 50,  unitPrice: 115.00, label: 'Standard' },
      { moq: 200, unitPrice: 104.00, label: 'Bulk' },
      { moq: 1000,unitPrice: 95.00,  label: 'Volume' }
    ],
    bestUnitPrice: 95.00,
    bestMoq: 1000,
    margin: 33.1,
    marginAmount: 47.00,
    paymentTerms: ['T/T', 'NET30', 'NET60'],
    tags: ['steady-seller', 'certified'],
    unit: 'tonne',
    suppliers: [
      { name: 'Heidelberg Materials', country: 'DE', rating: 4.7, verified: true },
      { name: 'CEMEX UK', country: 'GB', rating: 4.5, verified: true }
    ]
  },
  {
    id: 'b010',
    name: 'Laboratory Pipette Tips 200μL Universal (10,000 pcs)',
    industry: 'Medical & Lab',
    subcategory: 'Lab Consumables',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=80&h=80&fit=crop',
    sku: 'LAB-TIP-200UL',
    description: 'Universal fit 200μL pipette tips, low-retention, RNase/DNase free, autoclavable, sterile-packed',
    certifications: ['ISO 8655', 'CE-IVD', 'RNase-free'],
    originCountry: 'Germany',
    leadTimeDays: 5,
    trend: 'up',
    annualDemandUnits: 12000000,
    rating: 4.8,
    reviewCount: 4102,
    marketPrice: 98.00,
    pricingTiers: [
      { moq: 1,   unitPrice: 92.00, label: 'Single' },
      { moq: 10,  unitPrice: 80.00, label: 'Small' },
      { moq: 50,  unitPrice: 66.00, label: 'Standard' },
      { moq: 200, unitPrice: 54.00, label: 'Bulk' },
      { moq: 1000,unitPrice: 44.00, label: 'Volume' }
    ],
    bestUnitPrice: 44.00,
    bestMoq: 1000,
    margin: 55.1,
    marginAmount: 54.00,
    paymentTerms: ['T/T', 'NET30'],
    tags: ['high-volume', 'certified', 'trending'],
    unit: 'pack',
    suppliers: [
      { name: 'Sartorius AG', country: 'DE', rating: 4.9, verified: true },
      { name: 'Eppendorf SE', country: 'DE', rating: 4.8, verified: true }
    ]
  },
  {
    id: 'b011',
    name: 'Stainless Steel Fastener Set M6 A2-70 (500 pcs)',
    industry: 'Industrial Supplies',
    subcategory: 'Fasteners & Hardware',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=80&h=80&fit=crop',
    sku: 'IND-FST-M6-A2',
    description: 'M6×20mm hex cap screws A2-70 stainless, DIN 931, with matching nuts and washers',
    certifications: ['DIN 931', 'ISO 4017', 'A2-70'],
    originCountry: 'Taiwan',
    leadTimeDays: 6,
    trend: 'stable',
    annualDemandUnits: 6200000,
    rating: 4.6,
    reviewCount: 2890,
    marketPrice: 38.00,
    pricingTiers: [
      { moq: 10,   unitPrice: 35.00, label: 'Sample' },
      { moq: 50,   unitPrice: 29.50, label: 'Small' },
      { moq: 200,  unitPrice: 23.80, label: 'Standard' },
      { moq: 1000, unitPrice: 18.40, label: 'Bulk' },
      { moq: 5000, unitPrice: 14.20, label: 'Volume' }
    ],
    bestUnitPrice: 14.20,
    bestMoq: 5000,
    margin: 62.6,
    marginAmount: 23.80,
    paymentTerms: ['T/T', 'NET30'],
    tags: ['steady-seller', 'high-volume'],
    suppliers: [
      { name: 'Bossard Group', country: 'CH', rating: 4.8, verified: true },
      { name: 'Bufab Group', country: 'SE', rating: 4.6, verified: true }
    ]
  },
  {
    id: 'b012',
    name: 'Servo Motor NEMA23 3Nm Stepper (20 pcs)',
    industry: 'Electronics Components',
    subcategory: 'Motion Control',
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=80&h=80&fit=crop',
    sku: 'ELEC-SRV-N23-3',
    description: 'NEMA23 closed-loop stepper/servo hybrid, 3Nm holding torque, encoder feedback, IP54',
    certifications: ['CE', 'RoHS', 'UL'],
    originCountry: 'China',
    leadTimeDays: 15,
    trend: 'up',
    annualDemandUnits: 180000,
    rating: 4.4,
    reviewCount: 634,
    marketPrice: 185.00,
    pricingTiers: [
      { moq: 1,  unitPrice: 168.00, label: 'Single' },
      { moq: 5,  unitPrice: 145.00, label: 'Small' },
      { moq: 20, unitPrice: 118.00, label: 'Standard' },
      { moq: 100,unitPrice: 94.00,  label: 'Bulk' },
      { moq: 500,unitPrice: 76.00,  label: 'Volume' }
    ],
    bestUnitPrice: 76.00,
    bestMoq: 500,
    margin: 58.9,
    marginAmount: 109.00,
    paymentTerms: ['T/T', 'NET30'],
    tags: ['trending', 'certified'],
    suppliers: [
      { name: 'Leadshine Technology', country: 'CN', rating: 4.5, verified: true },
      { name: 'Oriental Motor', country: 'JP', rating: 4.8, verified: true }
    ]
  }
];

// ── Sector summaries ──────────────────────────────────────────
const sectors = [
  { id: 'Electronics Components', icon: 'bi-cpu', color: '#00D4FF', count: 0 },
  { id: 'Manufacturing',          icon: 'bi-gear-wide-connected', color: '#FF9F43', count: 0 },
  { id: 'Raw Materials',          icon: 'bi-stack', color: '#00E676', count: 0 },
  { id: 'Industrial Supplies',    icon: 'bi-tools', color: '#7B2FBE', count: 0 },
  { id: 'Medical & Lab',          icon: 'bi-heart-pulse', color: '#FF5252', count: 0 },
  { id: 'Automotive',             icon: 'bi-car-front', color: '#FFD700', count: 0 },
  { id: 'Construction',           icon: 'bi-building', color: '#A0A0A0', count: 0 },
];

// Auto-populate counts
sectors.forEach(s => {
  s.count = b2bProducts.filter(p => p.industry === s.id).length;
});

// ── B2B Stats ─────────────────────────────────────────────────
const b2bStats = {
  totalProducts: b2bProducts.length,
  avgMargin: parseFloat((b2bProducts.reduce((a, p) => a + p.margin, 0) / b2bProducts.length).toFixed(1)),
  totalAnnualDemand: b2bProducts.reduce((a, p) => a + p.annualDemandUnits, 0),
  avgLeadDays: Math.round(b2bProducts.reduce((a, p) => a + p.leadTimeDays, 0) / b2bProducts.length),
  certifiedCount: b2bProducts.filter(p => p.certifications.length > 0).length,
  sectors: sectors.length
};

module.exports = { b2bProducts, sectors, b2bStats };
