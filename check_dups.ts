import * as fs from 'fs';
const preloaded = fs.readFileSync('src/data/preloadedExplanations.ts', 'utf8');
const lines = preloaded.split('\n');
const keys = [];
lines.forEach((line, i) => {
  const match = line.match(/^  ([A-Za-z]+): {/);
  if (match) {
    keys.push({ key: match[1], line: i + 1 });
  }
});
console.log('Keys:', keys);
const counts = {};
keys.forEach(k => {
  counts[k.key] = (counts[k.key] || 0) + 1;
});
console.log('Duplicates:', Object.keys(counts).filter(k => counts[k] > 1));
