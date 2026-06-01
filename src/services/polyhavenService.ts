
export interface PolyHavenAsset {
  name: string;
  id: string;
  tags: string[];
  categories: string[];
}

export async function searchPolyHaven(query: string): Promise<string | null> {
  try {
    // 1. Get all model assets
    const response = await fetch('https://api.polyhaven.com/assets?t=models');
    if (!response.ok) return null;
    const assets: Record<string, any> = await response.json();

    // 2. Simple keyword matching
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    let bestMatchId: string | null = null;
    let maxMatches = 0;

    for (const [id, data] of Object.entries(assets)) {
      let matches = 0;
      const searchableText = `${data.name} ${data.tags?.join(' ') || ''} ${data.categories?.join(' ') || ''} ${id}`.toLowerCase();
      
      for (const term of queryTerms) {
        if (searchableText.includes(term)) {
          matches += 2; // Exact word match is better
        }
      }

      // Exact substring match for the whole query
      if (searchableText.includes(query.toLowerCase())) {
        matches += 5;
      }

      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatchId = id;
      }
    }

    if (!bestMatchId) return null;

    // 3. Get file info for the best match
    const fileResponse = await fetch(`https://api.polyhaven.com/files/${bestMatchId}`);
    if (!fileResponse.ok) return null;
    const files = await fileResponse.json();

    // 4. Return GLB URL (prefer 1k resolution for speed/memory)
    if (files.glb) {
      const resolutions = Object.keys(files.glb);
      const targetRes = resolutions.includes('1k') ? '1k' : resolutions[0];
      return files.glb[targetRes].url;
    }

    return null;
  } catch (error) {
    console.error("Poly Haven search error:", error);
    return null;
  }
}
