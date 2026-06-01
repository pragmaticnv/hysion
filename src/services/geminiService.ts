import { GoogleGenAI, Modality, ThinkingLevel, Type } from '@google/genai';
import { getPreloadedExplanation, preloadedExplanations } from '../data/preloadedExplanations';
import { Topic } from '../types';

function searchOfflineDatabase(query: string): string | null {
  try {
    const normalizedQuery = query.toLowerCase();
    const searchTerms = normalizedQuery.split(/[\s,?\.]+/)
      .filter(w => !['what', 'how', 'why', 'who', 'when', 'where', 'is', 'are', 'do', 'does', 'the', 'a', 'an', 'in', 'on', 'of', 'for', 'to', 'and'].includes(w) && w.length > 2);
      
    if (searchTerms.length === 0) return null;

    let bestMatch = "";
    let highestScore = 0;

    for (const [topic, levels] of Object.entries(preloadedExplanations)) {
      // Prioritize the detailed level for general overview in chat
      const text = (levels as any).detailed || (levels as any).basic || "";
      let score = 0;
      for (const term of searchTerms) {
        if (topic.toLowerCase().includes(term)) score += 5; 
        if (text.toLowerCase().includes(term)) score += 1;
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = `**[Topic Overview: ${topic}]**\n\n${text}\n\n*(Note: Displaying stored local version)*`;
      }
    }
    return highestScore > 0 ? bestMatch : null;
  } catch (e) {
    return null;
  }
}

async function tryOfflineGeminiNano(contextPrompt: string): Promise<string | null> {
  try {
    const globalWin = window as any;
    if (globalWin.ai && globalWin.ai.languageModel) {
      const capabilities = await globalWin.ai.languageModel.capabilities();
      if (capabilities.available !== 'no') {
        const session = await globalWin.ai.languageModel.create({
           systemPrompt: "You are an advanced AI Neural Tutor. You run locally and fully offline. Explain concepts clearly and concisely to the student."
        });
        const result = await session.prompt(contextPrompt);
        if (session.destroy) session.destroy();
        return result;
      }
    } else if (globalWin.ai && globalWin.ai.createTextSession) {
       // Legacy fallback API
       const session = await globalWin.ai.createTextSession();
       const result = await session.prompt("You are an offline AI Neural Tutor. Answer this: " + contextPrompt);
       if (session.destroy) session.destroy();
       return result;
    }
  } catch (e) {
    console.error("Offline Gemini Nano error:", e);
    return null;
  }
  return null;
}

function getAI() {
  const globalProcess = (window as any)['process'];
  const apiKey = globalProcess?.env?.API_KEY || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: apiKey as string });
}

export async function parseVoiceCommand(transcript: string) {
  try {
    const t = transcript.toLowerCase().trim();
    const containsAny = (str: string, words: string[]) => words.some(w => str.includes(w));

    // 1. PANELS & AR & APP CONTROL
    const panels = [
      { key: 'ai', words: ['ai panel', 'ai assistant', 'tutor', 'ai'] },
      { key: 'course', words: ['course', 'lesson'] },
      { key: 'progress', words: ['progress', 'stats'] },
      { key: 'library', words: ['library', 'saved'] },
      { key: 'notes', words: ['notes'] },
      { key: 'quiz', words: ['quiz', 'test'] },
      { key: 'sidebar', words: ['sidebar', 'menu'] },
      { key: 'gesture', words: ['gesture', 'hand tracking'] },
      { key: 'transcription', words: ['transcription', 'transcript', 'explain', 'explanation panel'] },
      { key: 'ncert', words: ['ncert', 'books', 'textbook', 'book'] }
    ];
    
    if (containsAny(t, ['open', 'show', 'enable', 'start'])) {
      if (containsAny(t, ['ar', 'augmented reality'])) return { action: 'ENTER_AR' };
      
      // Check for specific books
      const subjects = ['physics', 'chemistry', 'maths', 'math', 'biology', 'computer science', 'cs'];
      for (const sub of subjects) {
        if (t.includes(sub) && containsAny(t, ['book', 'ncert'])) {
          return { action: 'OPEN_BOOK', subject: t };
        }
      }

      for (const p of panels) {
        if (containsAny(t, p.words)) {
          return { action: 'OPEN_PANEL', panel: p.key };
        }
      }
    }

    if (containsAny(t, ['close', 'hide', 'disable', 'stop', 'exit'])) {
      if (containsAny(t, ['ar', 'augmented reality'])) return { action: 'EXIT_AR' };
      if (containsAny(t, ['app', 'viewer', 'application']) || t.trim() === 'exit' || t.trim() === 'close') return { action: 'EXIT_APP' };

      for (const p of panels) {
        if (containsAny(t, p.words)) {
          return { action: 'CLOSE_PANEL', panel: p.key };
        }
      }
    }

    if (containsAny(t, ['read chapter', 'open chapter', 'go to chapter'])) {
      const match = t.match(/chapter\s*(\d+)/);
      if (match) {
        return { action: 'READ_CHAPTER', chapter: parseInt(match[1]) };
      }
    }

    // 2. CHANGE_MODULE
    const modules = [
      { key: 'relativity', words: ['relativity', 'einstein'] },
      { key: 'atom', words: ['atom', 'molecule', 'hydrogen', 'helium', 'carbon', 'oxygen', 'neon'] },
      { key: 'aerodynamics', words: ['aerodynamics', 'aircraft', 'plane', 'flight'] },
      { key: 'fingerprint', words: ['fingerprint', 'sensor', 'biometric'] },
      { key: 'neural', words: ['neural network', 'brain module'] },
      { key: 'dna', words: ['dna', 'genetics', 'biology'] },
      { key: 'engine', words: ['engine', 'motor', 'car module'] },
      { key: 'virus', words: ['virus', 'bacteria', 'cell module'] },
      { key: 'solar', words: ['solar system', 'planets', 'space module'] },
      { key: 'QuantumPhysics', words: ['quantum', 'quantum physics'] },
      { key: 'OrganicChemistry', words: ['chemistry', 'organic chemistry'] },
      { key: 'CrystalLattice', words: ['crystal', 'lattice'] },
      { key: 'HumanHeart', words: ['heart', 'human heart'] },
      { key: 'Microscope', words: ['microscope'] },
      { key: 'Drone', words: ['drone'] },
      { key: 'PeriodicTable', words: ['periodic table', 'elements'] },
      { key: 'Fractals', words: ['fractal', 'fractals'] },
      { key: 'Calculus', words: ['calculus', 'manifold', 'riemann'] },
      { key: 'Geometry', words: ['geometry', 'shapes'] },
      { key: 'AncientRome', words: ['rome', 'colosseum', 'ancient rome'] },
      { key: 'Pyramid', words: ['pyramid', 'egypt'] },
      { key: 'BlackHole', words: ['black hole', 'blackhole'] },
      { key: 'Cell', words: ['cell'] },
      { key: 'JetEngine', words: ['jet engine', 'jet'] },
      { key: 'JamesWebb', words: ['james webb', 'telescope'] },
      { key: 'NuclearReactor', words: ['nuclear reactor', 'nuclear'] },
      { key: 'MarsRover', words: ['mars rover', 'rover'] },
      { key: 'Volcano', words: ['volcano'] },
      { key: 'SemiconductorChip', words: ['semiconductor', 'chip'] },
      { key: 'Globe', words: ['globe', 'earth map'] },
      { key: 'AnimalCell', words: ['animal cell'] },
      { key: 'Missile', words: ['missile', 'rocket'] },
      { key: 'Display', words: ['display', 'screen'] },
      { key: 'MillikanOilDrop', words: ['millikan', 'oil drop'] },
      { key: 'Plasma', words: ['plasma'] },
      { key: 'Tornado', words: ['tornado', 'storm'] },
      { key: 'Satellite', words: ['satellite'] },
      { key: 'Rainforest', words: ['rainforest', 'jungle'] },
      { key: 'Desert', words: ['desert'] },
      { key: 'NCERTBooks', words: ['ncert', 'books', 'textbook'] }
    ];
    
    if (containsAny(t, ['open', 'show', 'go to', 'switch to', 'module', 'load'])) {
      for (const m of modules) {
        if (containsAny(t, m.words)) {
          return { action: 'CHANGE_MODULE', module: m.key };
        }
      }
    }

    // 3. RELATIVITY_CONTROL
    if (containsAny(t, ['earth', 'star', 'black hole', 'blackhole'])) {
      let obj = 'earth';
      if (t.includes('star')) obj = 'star';
      if (t.includes('black hole') || t.includes('blackhole')) obj = 'blackhole';
      return { action: 'RELATIVITY_CONTROL', setting: 'objectType', value: obj };
    }
    
    if (t.includes('mass')) {
      const match = t.match(/mass.*?(?:to|of|is|set)?\s*([\d.]+)/);
      if (match) return { action: 'RELATIVITY_CONTROL', setting: 'mass', value: match[1] };
    }
    
    if (containsAny(t, ['warping', 'warp'])) {
      const value = containsAny(t, ['hide', 'off', 'disable', 'stop']) ? 'false' : 'true';
      return { action: 'RELATIVITY_CONTROL', setting: 'showWarping', value };
    }
    
    if (containsAny(t, ['lensing', 'lens'])) {
      const value = containsAny(t, ['hide', 'off', 'disable', 'stop']) ? 'false' : 'true';
      return { action: 'RELATIVITY_CONTROL', setting: 'showLensing', value };
    }
    
    if (containsAny(t, ['clock', 'time dilation'])) {
      const value = containsAny(t, ['hide', 'off', 'disable', 'stop']) ? 'false' : 'true';
      return { action: 'RELATIVITY_CONTROL', setting: 'showClocks', value };
    }
    
    if (containsAny(t, ['frame', 'inertial'])) {
      const value = containsAny(t, ['hide', 'off', 'disable', 'stop']) ? 'false' : 'true';
      return { action: 'RELATIVITY_CONTROL', setting: 'showInertialFrames', value };
    }

    // 4. AERODYNAMICS_CONTROL
    if (containsAny(t, ['speed', 'mach'])) {
      const match = t.match(/(?:speed|mach).*?(?:to|of|is|set)?\s*([\d.]+)/);
      if (match) return { action: 'AERODYNAMICS_CONTROL', setting: 'speed', value: match[1] };
    }
    
    if (containsAny(t, ['angle', 'attack'])) {
      const match = t.match(/(?:angle|attack).*?(?:to|of|is|set)?\s*(-?[\d.]+)/);
      if (match) return { action: 'AERODYNAMICS_CONTROL', setting: 'angle', value: match[1] };
    }
    
    if (t.includes('airflow')) {
      const value = containsAny(t, ['hide', 'off', 'disable', 'stop']) ? 'false' : 'true';
      return { action: 'AERODYNAMICS_CONTROL', setting: 'showAirflow', value };
    }
    
    if (t.includes('forces')) {
      const value = containsAny(t, ['hide', 'off', 'disable', 'stop']) ? 'false' : 'true';
      return { action: 'AERODYNAMICS_CONTROL', setting: 'showForces', value };
    }

    // 5. ATOM_CONTROL
    const elements = ['hydrogen', 'helium', 'carbon', 'oxygen', 'neon'];
    for (const el of elements) {
      if (t.includes(el)) {
        return { action: 'ATOM_CONTROL', setting: 'element', value: el };
      }
    }
    
    if (t.includes('orbital')) {
      const value = containsAny(t, ['hide', 'off', 'disable', 'stop']) ? 'false' : 'true';
      return { action: 'ATOM_CONTROL', setting: 'showOrbitals', value };
    }
    
    if (t.includes('nucleus')) {
      const value = containsAny(t, ['hide', 'off', 'disable', 'stop']) ? 'false' : 'true';
      return { action: 'ATOM_CONTROL', setting: 'showNucleus', value };
    }

    // Fallback for simple module switching without "open" or "show"
    for (const m of modules) {
      if (m.words.some(w => t === w || t === `go to ${w}`)) {
        return { action: 'CHANGE_MODULE', module: m.key };
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing voice command locally:", error);
    return null;
  }
}

function isGeminiQuotaError(error: any): boolean {
  if (!error) return false;
  const errorString = JSON.stringify(error).toLowerCase();
  return error?.status === 429 || 
         error?.status === "RESOURCE_EXHAUSTED" || 
         error?.error?.code === 429 || 
         error?.error?.status === "RESOURCE_EXHAUSTED" ||
         error?.message?.toLowerCase().includes("quota") || 
         error?.message?.toLowerCase().includes("rate_limit") ||
         errorString.includes("quota") ||
         errorString.includes("rate_limit") ||
         errorString.includes("429") ||
         errorString.includes("resource_exhausted");
}

export async function chatWithAI(history: { role: string, parts: { text: string }[] }[], userMessage: string, topicName: string) {
  try {
    const cacheKey = `tutor_cache_${topicName}_${userMessage.substring(0, 50)}`;
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return cached;
      } else {
        const fullPrompt = history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n") + `\nuser: [Context: ${topicName}] ${userMessage}`;
        const nanoResponse = await tryOfflineGeminiNano(fullPrompt);
        if (nanoResponse) {
           return nanoResponse;
        }

        const localData = searchOfflineDatabase(userMessage);
        if (localData) {
            return localData;
        }
        return `I cannot access updated information right now. Please check your connection to access the full datasets.`;
      }
    }

    const ai = getAI();
    const chatHistory = [
      ...history,
      {
        role: 'user',
        parts: [{ text: `[Context: Current Topic is ${topicName}] ${userMessage}` }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: chatHistory,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are an advanced AI Tutor and Assistant for an interactive 3D educational platform.
        
        YOUR CAPABILITIES:
        1. Answer ANY question the user asks with high accuracy and depth. Do not limit yourself to just the current topic. You have access to vast knowledge and LIVE global datasets via Google Search.
        2. Always summarize up-to-date global information and datasets if the user asks for real-world knowledge.
        3. Explain complex concepts simply or in detail as requested.
        4. Be engaging, encouraging, and professional.
        
        GUIDED LESSON MODE:
        If the user asks to "start a guided lesson" or "teach me", you MUST:
        1. Break the topic down into small, digestible steps.
        2. Explain ONE concept at a time.
        3. End your response with a question to test their understanding.
        4. Wait for their answer. If they are correct, praise them and move to the next step. If incorrect, gently correct them and re-explain before moving on.
        5. Adapt the pace based on their responses. If they struggle, slow down and use simpler analogies.
        
        SPECIAL FEATURE - HOLOGRAM GENERATION:
        ONLY if the user explicitly and directly asks to "generate", "create", "show", "visualize", or "build" a new hologram/object (e.g., "generate a black hole", "can you show me a virus model?"), you MUST trigger the hologram generator.
        CRITICAL: NEVER include the [GENERATE:] tag during regular text explanations, guided lessons, or answering follow-up questions UNLESS the user specifically asked for a new visual model in that exact message. If you are just explaining, do NOT include the tag.
        To do this, include a JSON block at the VERY END of your response like this:
        [GENERATE: {"prompt": "a highly detailed 3D holographic projection of [OBJECT], glowing neon cyan and blue wireframe, futuristic sci-fi style, isolated on black background"}]
        
        - The prompt should be a descriptive image generation prompt.
        - Choose colors/params that best fit the user's request.
        
        OUTPUT FORMATTING:
        - Use Markdown for all responses.
        - Use bold headers for sections.
        - Use bullet points for lists of facts or properties.
        - Keep explanations concise and scannable.
        - Avoid long, dense paragraphs.
        - If explaining an element or concept, use a "Dashboard" style layout with clear sections.`,
      }
    });

    const text = response.text || "I apologize, but I couldn't generate a response at the moment.";
    try {
      localStorage.setItem(cacheKey, text);
    } catch (e) {
      console.warn("Could not cache response. Storage full?");
    }
    return text;
  } catch (error: any) {
    const cacheKey = `tutor_cache_${topicName}_${userMessage.substring(0, 50)}`;
    if (isGeminiQuotaError(error)) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return cached;
      }
      const fullPrompt = history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n") + `\nuser: [Context: ${topicName}] ${userMessage}`;
      const nanoResponse = await tryOfflineGeminiNano(fullPrompt);
      if (nanoResponse) {
         return nanoResponse;
      }
      const localData = searchOfflineDatabase(userMessage);
      if (localData) {
        return localData;
      }
      return "I'm sorry, I'm having trouble retrieving a new response right now. Please try again in a moment.";
    }
    console.error("Chat error:", error);
    
    // Final offline fallback if network completely fails
    const fullPrompt = history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n") + `\nuser: [Context: ${topicName}] ${userMessage}`;
    const nanoResponse = await tryOfflineGeminiNano(fullPrompt);
    if (nanoResponse) {
       return nanoResponse;
    }
    const localData = searchOfflineDatabase(userMessage);
    if (localData) {
      return localData;
    }
    return "I'm having trouble connecting to the neural network. Please try again.";
  }
}

export async function* chatWithAIStream(history: { role: string, parts: { text: string }[] }[], userMessage: string, topicName: string) {
  try {
    const cacheKey = `tutor_cache_${topicName}_${userMessage.substring(0, 50)}`;
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        yield cached;
        return;
      } else {
        const fullPrompt = history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n") + `\nuser: [Context: ${topicName}] ${userMessage}`;
        const nanoResponse = await tryOfflineGeminiNano(fullPrompt);
        if (nanoResponse) {
           yield nanoResponse;
           return;
        }

        const localData = searchOfflineDatabase(userMessage);
        if (localData) {
            yield localData;
            return;
        }
        yield `I cannot access updated information right now. Please check your connection to access the full datasets.`;
        return;
      }
    }

    const ai = getAI();
    const chatHistory = [
      ...history,
      {
        role: 'user',
        parts: [{ text: `[Context: Current Topic is ${topicName}] ${userMessage}` }]
      }
    ];

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: chatHistory,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are an advanced AI Tutor and Assistant for an interactive 3D educational platform.
        
        YOUR CAPABILITIES:
        1. Answer ANY question the user asks with high accuracy and depth. Do not limit yourself to just the current topic. You have access to vast knowledge and LIVE global datasets via Google Search.
        2. Always summarize up-to-date global information and datasets if the user asks for real-world knowledge.
        3. Explain complex concepts simply or in detail as requested.
        4. Be engaging, encouraging, and professional.
        
        GUIDED LESSON MODE:
        If the user asks to "start a guided lesson" or "teach me", you MUST:
        1. Break the topic down into small, digestible steps.
        2. Explain ONE concept at a time.
        3. End your response with a question to test their understanding.
        4. Wait for their answer. If they are correct, praise them and move to the next step. If incorrect, gently correct them and re-explain before moving on.
        5. Adapt the pace based on their responses. If they struggle, slow down and use simpler analogies.
        
        SPECIAL FEATURE - HOLOGRAM GENERATION:
        ONLY if the user explicitly and directly asks to "generate", "create", "show", "visualize", or "build" a new hologram/object (e.g., "generate a black hole", "can you show me a virus model?"), you MUST trigger the hologram generator.
        CRITICAL: NEVER include the [GENERATE:] tag during regular text explanations, guided lessons, or answering follow-up questions UNLESS the user specifically asked for a new visual model in that exact message. If you are just explaining, do NOT include the tag.
        To do this, include a JSON block at the VERY END of your response like this:
        [GENERATE: {"prompt": "a highly detailed 3D holographic projection of [OBJECT], glowing neon cyan and blue wireframe, futuristic sci-fi style, isolated on black background"}]
        
        - The prompt should be a descriptive image generation prompt.
        - Choose colors/params that best fit the user's request.
        
        OUTPUT FORMATTING:
        - Use Markdown for all responses.
        - Use bold headers for sections.
        - Use bullet points for lists of facts or properties.
        - Keep explanations concise and scannable.
        - Avoid long, dense paragraphs.
        - If explaining an element or concept, use a "Dashboard" style layout with clear sections.`,
      }
    });

    let fullResponse = "";
    for await (const chunk of responseStream) {
      if (chunk.text) {
        fullResponse += chunk.text;
        yield chunk.text;
      }
    }
    
    try {
      localStorage.setItem(cacheKey, fullResponse);
    } catch (e) {
      console.warn("Could not cache response. Storage full?");
    }
  } catch (error: any) {
    const cacheKey = `tutor_cache_${topicName}_${userMessage.substring(0, 50)}`;
      if (isGeminiQuotaError(error)) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          yield cached;
        } else {
          const fullPrompt = history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n") + `\nuser: [Context: ${topicName}] ${userMessage}`;
          const nanoResponse = await tryOfflineGeminiNano(fullPrompt);
          if (nanoResponse) {
             yield nanoResponse;
          } else {
              const localData = searchOfflineDatabase(userMessage);
              if (localData) {
                  yield localData;
              } else {
                  yield "I'm sorry, I'm having trouble retrieving a new response right now. Please try again in a moment.";
              }
          }
        }
        return;
      }
    console.error("Chat stream error:", error);
    
    // Final offline fallback if network completely fails
    const fullPrompt = history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n") + `\nuser: [Context: ${topicName}] ${userMessage}`;
    const nanoResponse = await tryOfflineGeminiNano(fullPrompt);
    if (nanoResponse) {
       yield nanoResponse;
       return;
    }
    const localData = searchOfflineDatabase(userMessage);
    if (localData) {
      yield localData;
      return;
    }
    yield "I'm having trouble connecting to the neural network. Please try again.";
  }
}

export async function generateSpeech(text: string) {
  try {
    const stream = generateSpeechStream(text);
    let result = "";
    for await (const chunk of stream) {
      result += chunk;
    }
    return result || null;
  } catch (error) {
    return null;
  }
}

export async function* generateSpeechStream(text: string) {
  if (!text || text.trim().length === 0) return;

  try {
    const ai = getAI();
    // Strip markdown and problematic characters for smoother speech
    const cleanText = text
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '')   // Remove italics/bullets
      .replace(/#/g, '')    // Remove headers
      .replace(/`/g, '')    // Remove code blocks
      .replace(/_/g, '')    // Remove underscores
      .replace(/~/g, '')    // Remove strikethrough
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters (emojis, etc.) that might crash TTS
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (cleanText.length === 0) return;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Speak clearly: ${cleanText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      yield base64Audio;
    }
  } catch (error: any) {
    const isQuota = isGeminiQuotaError(error);
    if (!isQuota) {
      console.error("Gemini TTS streaming error:", error);
    }
    // Specifically re-throw or return indicator of quota exhaustion to trigger fallback or stop
    if (isQuota) {
      throw new Error("QUOTA_EXHAUSTED");
    }
    // Yield nothing so the fallback is triggered
  }
}

export async function generateExplanation(topicName: string, detailLevel: string, language: string) {
  try {
    const cacheKey = `explanation_cache_${topicName}_${detailLevel}_${language}`;
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return cached;
      }
      // If we don't have a cached one, we fall back to preloaded if possible
    }

    const ai = getAI();
    // Check for preloaded explanation first (only for English currently)
    if (language === 'English' || language === 'en') {
      // We need to map the string topicName back to the Topic type, or just cast it
      const preloaded = getPreloadedExplanation(topicName as Topic, detailLevel as any);
      if (preloaded) {
        return preloaded;
      }
    }

    if (typeof window !== 'undefined' && !window.navigator.onLine) {
         const nanoResponse = await tryOfflineGeminiNano(`Explain the topic: ${topicName}. Detail level: ${detailLevel}. Language: ${language}.`);
         if (nanoResponse) {
             return nanoResponse;
         }

         const localData = searchOfflineDatabase(`${topicName} ${detailLevel}`);
         if (localData) {
             return localData;
         }
         return `I cannot access updated information right now. Please check your connection.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the topic: ${topicName}. 
      Detail level: ${detailLevel}.
      Language: ${language}.
      Keep explanations concise and scannable. Use Markdown. Combine this with any recent online datasets or real-world information available.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "No explanation available.";
    try {
      localStorage.setItem(cacheKey, text);
    } catch (e) {
      console.warn("Could not cache explanation. Storage full?");
    }
    return text;
  } catch (error: any) {
    const cacheKey = `explanation_cache_${topicName}_${detailLevel}_${language}`;
    if (isGeminiQuotaError(error)) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return cached;
      }

      const nanoResponse = await tryOfflineGeminiNano(`Explain the topic: ${topicName}. Detail level: ${detailLevel}. Language: ${language}.`);
      if (nanoResponse) {
          return nanoResponse;
      }

      const localData = searchOfflineDatabase(`${topicName} ${detailLevel}`);
      if (localData) {
          return localData;
      }
      return "### ⚠️ Synthesis Interrupted\n\nI'm unable to generate a new analysis at this moment. \n\n**Please try again in a few minutes.** \n\nIn the meantime, you can explore the 3D model manually or try another module.";
    }
    console.error("Explanation error:", error);
    
    // Final offline fallback if network completely fails
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;

    const nanoResponse = await tryOfflineGeminiNano(`Explain the topic: ${topicName}. Detail level: ${detailLevel}. Language: ${language}.`);
    if (nanoResponse) {
        return nanoResponse;
    }

    const localData = searchOfflineDatabase(`${topicName} ${detailLevel}`);
    if (localData) {
        return localData;
    }
    
    return "I'm having trouble generating the explanation right now. Please try again later.";
  }
}

export async function generateHologramConfig(prompt: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a detailed 3D hologram scene configuration for: "${prompt}".
      
      You must architect a complex 3D assembly using primitive components.
      
      Return ONLY a JSON object with this schema:
      {
        "type": "assembly",
        "primaryColor": "hex",
        "secondaryColor": "hex",
        "glowIntensity": number (0-5),
        "animationSpeed": number (0-5),
        "elements": [
          {
            "shape": "sphere" | "box" | "torus" | "cylinder" | "icosahedron" | "cone",
            "position": [x, y, z],
            "rotation": [x, y, z],
            "scale": [x, y, z],
            "color": "hex",
            "opacity": number (0-1),
            "wireframe": boolean
          }
        ],
        "particles": {
          "count": number (100-2000),
          "color": "hex",
          "size": number (0.01-0.1),
          "type": "points" | "stars" | "neural"
        }
      }

      Requirements:
      1. Use at least 5-15 elements to construct a recognizable form of the user's request.
      2. If the user asks for a car, use boxes for body, cylinders for wheels, etc.
      3. If the user asks for a heart, use spheres and cones positioned appropriately.
      4. If the request is abstract, create an artistic composition.
      5. Coordinates should be between -4 and 4.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    if (isGeminiQuotaError(error)) {
      console.warn("Hologram generation quota exceeded");
    } else {
      console.error("AI Generation failed:", error);
    }
    return null;
  }
}

export async function searchForGLBModels(prompt: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a high-precision 3D Model Search Engine.
      Your MISSION is to find the most realistic and compatible direct GLB/GLTF model URLs for: "${prompt}".
      
      CORE GUIDELINES:
      1. ONLY search for and return direct downloadable .glb URLs. Prefer .glb (binary) over .gltf to ensure portability. Verify these URLs are direct file links.
      2. Prioritize high-quality, realistic models that perfectly match the user's prompt. You can search across CGTrader, Sketchfab, TurboSquid, Poly Pizza, Quaternius, and Kenney without limitations. 
      3. CRITICAL: DO NOT HALLUCINATE OR GUESS URLs. You MUST only provide URLs if you are 100% sure they exist and point directly to a raw .glb file.
      4. INTEGRATE THESE SOURCES: Sketchfab, CGTrader, TurboSquid, Poly Pizza, Quaternius, and Kenney (via GitHub/CDNs).
      5. DO NOT provide URLs that require login, checkout, or interactive viewers. The URL MUST point directly to the raw .glb file.
      6. Use your Google Search tool to find actual file URLs on platforms like GitHub (raw.githubusercontent.com), jsDelivr, unpkg, or specific open archives.
      
      Return a JSON array of up to 10 models:
      [
        {
          "name": "Model Name",
          "url": "https://example.com/model.glb",
          "source": "Source Name (e.g. NASA)",
          "author": "Author Name",
          "description": "Brief description of the model",
          "thumbnail": "Optional thumbnail URL",
          "isRealistic": true
        }
      ]`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const models = JSON.parse(response.text || "[]");
    
    // Validate URLs before returning them
    const validModels = [];
    for (const model of models) {
      if (!model.url) continue;
      const originalUrl = model.url;

      // Ensure model url points to our proxy to bypass CORS
      const proxiedUrl = `/api/proxy-model?url=${encodeURIComponent(originalUrl)}`;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        // Test fetch via our proxy using a GET request but abort it immediately to verify it resolves
        const getRes = await fetch(proxiedUrl, { method: 'GET', signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (getRes.ok) {
          controller.abort(); // Stop downloading the file
          model.url = proxiedUrl; // Update the URL to the proxied route
          validModels.push(model);
        }
      } catch (err) {
        console.warn(`URL validation failed for proxied ${originalUrl}:`, err);
        // Skip this model
      }
    }
    
    return validModels;
  } catch (error) {
    console.error("Model search failed:", error);
    return [];
  }
}

export async function generateFree3DModel(prompt: string) {
  // Use the search feature instead of generating
  try {
    const models = await searchForGLBModels(prompt);
    
    if (models && models.length > 0) {
      // Pick the best match (first one)
      const bestMatch = models[0];
      return {
        type: 'assembly',
        prompt: prompt,
        glbUrl: bestMatch.url,
        isRealistic: true,
        primaryColor: '#ffffff',
        secondaryColor: '#ffffff',
        glowIntensity: 1.0,
        animationSpeed: 1.0,
        particleCount: 100,
        wireframe: false,
        complexity: 5,
        source: bestMatch.source,
        author: bestMatch.author
      };
    }
  } catch (e) {
    console.error("Search fallback failed:", e);
  }

  // If search fails, do NOT fall back to procedural boxes. Return null so the UI can show "Not Found".
  return null;
}

export async function generateLessonContent(prompt: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a full educational course lesson module based on this concept: "${prompt}".
      
      Return ONLY a JSON object with this schema:
      {
        "title": "Module Title",
        "description": "Short description of the module",
        "modules": [
          {
            "title": "Subtopic Title",
            "desc": "Explanation paragraph",
            "objectives": ["objective 1", "objective 2"],
            "interactiveLabel": "View 3D Model",
            "quiz": {
              "question": "A multiple choice question",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": 0
            }
          }
        ]
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    if (isGeminiQuotaError(error)) {
      console.warn("Lesson generation quota exceeded");
    } else {
      console.error("Lesson generation failed:", error);
    }
    return null;
  }
}


export async function analyzeDrawing(base64Image: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image.split(',')[1], // Remove data:image/png;base64, prefix
            },
          },
          {
            text: 'You are an AI assistant for a teacher. Look at this hand-drawn sketch on a digital whiteboard. Identify what is drawn and provide a brief, educational explanation of the concept it represents (e.g., if it is a cell, explain a cell; if it is a triangle, explain a triangle). Keep it under 3 sentences.',
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Drawing analysis error:", error);
    return "Could not identify the drawing.";
  }
}

export async function analyzeObjectFromCamera(base64Image: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: 'Identify the object in this image and provide precise, accurate, and concise information about it. Keep it scientific and educational.',
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Object analysis error:", error);
    return "Could not identify the object.";
  }
}

export async function summarizeTeacherExplanation(transcript: string) {
  if (!transcript || transcript.trim().length < 50) return null;
  
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following teacher's explanation into key takeaways and main points. 
      Use bullet points. Keep it concise and educational.
      
      Transcript:
      ${transcript}`,
      config: {
        systemInstruction: "You are an educational assistant. Your goal is to summarize spoken explanations into clear, structured notes for students."
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Summarization error:", error);
    return "Could not summarize the explanation at this time.";
  }
}

export async function generateTaskBreakdown(projectDescription: string): Promise<any[]> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down this development feature/concept into 3-5 actionable sub-tasks.
      Project description: "${projectDescription}"
      
      Respond ONLY with a raw JSON array. Do not include markdown formatting or \`\`\`json blocks.
      Schema for each object:
      {
        "title": "Short descriptive title",
        "description": "1 sentence detail",
        "priority": "low" | "medium" | "high"
      }`,
      config: {
        systemInstruction: "You are an expert technical project manager and software architect."
      }
    });

    const text = response.text?.trim() || "[]";
    let jsonStr = text;
    // Strip markdown formatting if the model still returns it
    if (jsonStr.startsWith('```')) {
      const firstNewline = jsonStr.indexOf('\n');
      const lastNewline = jsonStr.lastIndexOf('\n');
      if (firstNewline !== -1 && lastNewline > firstNewline) {
        jsonStr = jsonStr.substring(firstNewline + 1, lastNewline);
      }
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Task breakdown generation error:", error);
    return [];
  }
}

export async function summarizeChat(messages: { role: string, content: string }[]) {
  
  try {
    const ai = getAI();
    const chatContent = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following conversation between a student and an AI tutor. 
      Identify the main topics discussed, user's goals, and key information learned.
      Use a structured format with headers.
      
      Conversation:
      ${chatContent}`,
      config: {
        systemInstruction: "You are an educational assistant. Your goal is to provide a clear, concise summary of a learning session."
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Chat summarization error:", error);
    return "Could not summarize the conversation at this time.";
  }
}

export async function correctTranscription(text: string, language: string, retries = 2): Promise<string> {
  if (!text || text.trim().length < 5) return text;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const ai = getAI();
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a high-precision transcription correction engine. 
        The following text was captured via noisy speech-to-text. 
        Fix any obvious typos, capitalization, and add proper punctuation for professional display.
        Maintain the original meaning exactly. Do not add explanations or extra text.
        Language: ${language}
        
        Text: "${text}"`,
        config: {
          responseMimeType: "text/plain"
        }
      });
      return result.text?.trim() || text;
    } catch (err: any) {
      if (attempt === retries) {
        console.warn(`Transcription correction failed after ${retries} attempts. Returning original text.`);
        return text;
      }
      
      const isOverloaded = err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE";
      if (!isOverloaded) {
        // If it's not a 503, return the original text without retrying
        return text;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
  
  return text;
}

