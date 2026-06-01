async function check() {
  const urls = [
    'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_packed_assets.data',
    'https://unpkg.com/@mediapipe/hands@0.4.1675469240/hands_solution_packed_assets.data',
    'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_packed_assets.data'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`${url}: ${res.status}`);
    } catch (e: any) {
      console.log(`${url}: ${e.message}`);
    }
  }
}
check();
