import urllib.request
import json

url = "https://unsplash.com/napi/search/photos?query=atom&per_page=5"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for r in data['results']:
            print(r['id'])
except Exception as e:
    print(e)
