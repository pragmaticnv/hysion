const fs = require('fs');
const lines = fs.readFileSync('src/data/preloadedExplanations.ts', 'utf8').split('\n');
const newContent = lines.slice(0, 215).join('\n') + '\n};\n\nexport const getPreloadedExplanation = (topic: Topic, detailLevel: DetailLevel): string | null => {\n  if (preloadedExplanations[topic] && preloadedExplanations[topic]![detailLevel]) {\n    return preloadedExplanations[topic]![detailLevel];\n  }\n  return null;\n};\n';
fs.writeFileSync('src/data/preloadedExplanations.ts', newContent);
