import fs from 'fs';

async function main() {
  const res = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
  const data = await res.json();
  const elements = data.elements.map((e: any) => ({
    symbol: e.symbol,
    name: e.name,
    number: e.number,
    group: e.category.split(' ')[0], // simplify category
    col: e.xpos,
    row: e.ypos
  }));
  fs.writeFileSync('elements.json', JSON.stringify(elements, null, 2));
}

main();
