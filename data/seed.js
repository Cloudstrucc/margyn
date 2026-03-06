const db = require('./db');
console.log('\n🌱 Margyn — Seed Data Loaded\n');
console.log(`  ✅ Users:      ${db.users.length}`);
console.log(`  ✅ Products:   ${db.products.length}`);
console.log(`  ✅ Markets:    ${db.marketSources.length}`);
console.log(`  ✅ Suppliers:  ${db.supplierSources.length}`);
console.log(`\n  🔑 Login: admin@margyn.io / password123\n`);
