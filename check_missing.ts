import * as fs from 'fs';
const types = fs.readFileSync('src/types.ts', 'utf8');
const match = types.match(/type Topic =([\s\S]*?);/);
if (match) {
  const topics = match[1].split('|').map(t => t.trim().replace(/'/g, '').split(' ')[0]).filter(t => t && t !== 'type' && t !== 'Topic');
  const preloaded = fs.readFileSync('src/data/preloadedExplanations.ts', 'utf8');
  const missing = topics.filter(t => !preloaded.includes(t + ': {'));
  console.log('Missing topics:', missing);
}
