async function run() {
  const res = await fetch('https://unsplash.com/napi/search/photos?query=atom&per_page=5', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
  });
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    console.log(data.results.map(x => x.id).join('\n'));
  } catch (e) {
    console.log(text.substring(0, 200));
  }
}
run();
