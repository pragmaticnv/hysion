
import { searchForGLBModels } from './geminiService';
import { searchPolyHaven } from './polyhavenService';

export interface ModelSearchResult {
  name: string;
  url: string;
  source: string;
  author: string;
  description?: string;
  thumbnail?: string;
  isRealistic?: boolean;
}

// Pre-indexed high-quality Kenney/Quaternius models for 100% precision on common items
const STATIC_ASSETS: ModelSearchResult[] = [
  {
    name: "Heart",
    url: "/api/proxy-model?url=https://raw.githubusercontent.com/Quaternius/Quaternius-Models/master/HumanBody/GLB/Heart.glb",
    source: "Quaternius",
    author: "Quaternius",
    isRealistic: true
  },
  {
    name: "Skull",
    url: "/api/proxy-model?url=https://raw.githubusercontent.com/Quaternius/Quaternius-Models/master/HumanBody/GLB/Skull.glb",
    source: "Quaternius",
    author: "Quaternius",
    isRealistic: true
  },
  {
    name: "Airplane",
    url: "/api/proxy-model?url=https://raw.githubusercontent.com/Quaternius/Quaternius-Models/master/Vehicles/GLB/Airplane.glb",
    source: "Quaternius",
    author: "Quaternius",
    isRealistic: true
  }
];

export async function fetchModelsFromAllSources(prompt: string): Promise<ModelSearchResult[]> {
  const query = prompt.toLowerCase().trim();
  const results: ModelSearchResult[] = [];

  // 1. Check static assets first for 100% precision
  const staticMatches = STATIC_ASSETS.filter(a => 
    a.name.toLowerCase().includes(query) || query.includes(a.name.toLowerCase())
  );
  results.push(...staticMatches);

  // 2. Search Poly Haven (Very high precision)
  try {
    const polyHavenUrl = await searchPolyHaven(prompt);
    if (polyHavenUrl) {
      results.push({
        name: `${prompt} (Poly Haven)`,
        url: `/api/proxy-model?url=${encodeURIComponent(polyHavenUrl)}`,
        source: 'Poly Haven',
        author: 'Poly Haven',
        isRealistic: true
      });
    }
  } catch (e) {
    console.error("Poly Haven search failed:", e);
  }

  // 3. Search Gemini (Broad search across Sketchfab, CGTrader, TurboSquid, etc.)
  try {
    const aiModels = await searchForGLBModels(prompt);
    if (aiModels && aiModels.length > 0) {
      // Filter out duplicates if any
      const existingUrls = new Set(results.map(r => r.url));
      aiModels.forEach(m => {
        if (!existingUrls.has(m.url)) {
          results.push(m);
        }
      });
    }
  } catch (e) {
    console.error("AI Model search failed:", e);
  }

  return results;
}
