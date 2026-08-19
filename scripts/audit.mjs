import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'app/page.js','app/plan/page.js','app/around/page.js','app/safety/page.js','app/trip/page.js',
  'app/api/health/route.js','app/api/trips/route.js','lib/budget-engine.mjs','lib/db.js',
  'components/BrandHeader.js','migrations/V001_init.sql','.env.example','.gitignore'
];
let failed = false;
for (const rel of required) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) { console.error(`FAIL missing/empty: ${rel}`); failed = true; }
  else console.log(`PASS ${rel}`);
}
const envExample = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
const api = fs.readFileSync(path.join(root, 'app/api/trips/route.js'), 'utf8');
const brand = fs.readFileSync(path.join(root, 'components/BrandHeader.js'), 'utf8');
if (!envExample.includes('DATABASE_URL=')) { console.error('FAIL DATABASE_URL example missing'); failed = true; }
if (!gitignore.includes('.env.local')) { console.error('FAIL .env.local not ignored'); failed = true; }
if (!api.includes('LIMIT 30')) { console.error('FAIL trip query must be bounded'); failed = true; }
if (!api.includes('100_000')) { console.error('FAIL request size guard missing'); failed = true; }
if (!brand.includes('data:image/webp;base64,') || !brand.includes('Safety from roots to every journey.')) { console.error('FAIL official brand asset/tagline not embedded'); failed = true; }
if (failed) process.exit(1);
console.log('AUDIT PASS');
