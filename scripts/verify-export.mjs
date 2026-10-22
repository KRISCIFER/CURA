import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('out');
const expected={
 '':'Find medicine.', 'search':'Find medicine.',
 'search/paracetamol':'Paracetamol', 'search/ors':'ORS',
 'search/amoxicillin':'Amoxicillin', 'search/cetirizine':'Cetirizine', 'search/metformin':'Metformin',
 'pharmacy/apollo':'Apollo Pharmacy', 'pharmacy/healthpoint':'HealthPoint Pharmacy',
 'pharmacy/medplus':'MedPlus', 'pharmacy/wellness':'Wellness Forever',
 'reservation/new':'A little certainty.', 'reservation/pickup':'Your pickup, in progress.',
 'reservations':'Reservations', 'pulse':'The health of access.', 'radar':'See pressure.',
 'shortage/east-delhi':'See pressure.', 'pharmacy-mode':'Good morning, HealthPoint.',
 'pharmacy-mode/inventory':'Inventory intelligence.', 'pharmacy-mode/analytics':'Know what comes next.',
 'pharmacy-mode/reservations':'Reservations', 'pharmacy-mode/wastewatch':'Less waste.',
 'alerts':'Signals that need attention.', 'profile':'Profile &amp; preferences.', 'demo':'Make the signals visible.'
};
let assets=0;
for(const [route,title] of Object.entries(expected)){
 const html=fs.readFileSync(path.join(root,route,'index.html'),'utf8');
 assert.ok(html.includes(title),`${route||'/'} must render its intended content`);
 assert.ok(html.includes('<h1'),`${route||'/'} needs a page heading`);
 for(const [,asset] of html.matchAll(/(?:src|href)="(\/_next\/[^"?]+)/g)){
  assert.ok(fs.existsSync(path.join(root,decodeURIComponent(asset))),`Missing asset ${asset}`);assets++;
 }
}
console.log(`Passed: ${Object.keys(expected).length} route content checks and ${assets} asset references.`);
