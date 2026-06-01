import React, { useState, useEffect, useRef } from 'react';
import { Theme } from '../types';
import { X, Sparkles, Loader2, Save, UploadCloud, Mic, MicOff, Box, Globe } from 'lucide-react';
import { generateFree3DModel, searchForGLBModels } from '../services/geminiService';
import { generateMeshy3DModel } from '../services/meshyService';
import { useStore } from '../store/useStore';
import { ModelSearchResults } from './generator/ModelSearchResults';

export function AIGeneratorPanel() {
  const { 
    setHologramConfig, 
    hologramConfig, 
    setActiveTopic,
    theme 
  } = useStore();
  const onClose = () => setActiveTopic('Atom');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFreeGenerating, setIsFreeGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setPrompt(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === 'aborted' || event.error === 'no-speech') return;
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setPrompt('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleMeshyGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setSearchResults([]);

    try {
      const result = await generateMeshy3DModel(prompt, (prog) => {
        setProgress(prog);
      });

      if (result && result.glb) {
        setHologramConfig({
          ...hologramConfig,
          type: 'organic',
          glbUrl: result.glb,
          prompt: prompt,
          source: 'Meshy AI',
          author: 'AI Generated'
        });
        setActiveTopic('Custom');
      }
    } catch (err: any) {
      console.error("Meshy Generation failed:", err);
      setError(err.message || 'AI Generation failed.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleFreeGenerate = async () => {
    if (!prompt.trim() || isFreeGenerating) return;
    setIsFreeGenerating(true);
    setError(null);
    setSearchResults([]);

      try {
      // 1. First, check Poly Haven for an immediate high-quality match
      const { searchPolyHaven } = await import('../services/polyhavenService');
      const polyHavenUrl = await searchPolyHaven(prompt);
      
      const results: any[] = [];
      if (polyHavenUrl) {
        results.push({
          name: `${prompt} (Poly Haven)`,
          url: polyHavenUrl,
          source: 'Poly Haven',
          isRealistic: true,
          author: 'Poly Haven Community'
        });
      }

      // 2. Use neural search to find more sources (NASA, Smithsonian, Sketchfab CC0, etc)
      const neuralResults = await searchForGLBModels(prompt);
      if (neuralResults && neuralResults.length > 0) {
        // Filter out duplicates if any
        const filteredNeural = neuralResults.filter((nr: any) => !results.some(r => r.url === nr.url));
        results.push(...filteredNeural);
      }

      if (results.length > 0) {
        setSearchResults(results);
        // Automatically select the first best match
        const bestMatch = results[0];
        setHologramConfig({ 
          ...hologramConfig, 
          type: 'organic',
          glbUrl: bestMatch.url,
          prompt: prompt,
          source: bestMatch.source,
          author: bestMatch.author
        });
        setActiveTopic('Custom');
      } else {
        throw new Error('No high-fidelity models found. Try generic scientific terms like "Apollo", "Satellite", "Virus", or "Skull".');
      }
    } catch (err: any) {
      console.error("Realistic 3D Source search failed:", err);
      setError(err.message || 'Search service is temporarily unavailable.');
    } finally {
      setIsFreeGenerating(false);
    }
  };

  const handleSelectModel = (model: any) => {
    setHologramConfig({
      ...hologramConfig,
      type: 'organic',
      glbUrl: model.url,
      source: model.source,
      author: model.author
    });
  };

  const suggestions = [
    "Red Blood Cell",
    "Curiosity Mars Rover",
    "Giza Pyramid",
    "Human Heart",
    "International Space Station"
  ];

  return (
    <aside className={`fixed right-0 top-0 bottom-0 z-[70] w-full md:w-[450px] ${theme.uiBg} backdrop-blur-md border-l ${theme.border} flex flex-col shadow-2xl transition-all duration-300 ease-in-out overflow-hidden`}>
      <div className={`p-5 border-b ${theme.border} flex items-center justify-between ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-zinc-100/60' : 'bg-black/60'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${theme.primary}/10 flex items-center justify-center text-${theme.primary} border border-${theme.primary}/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]`}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className={`text-xs font-display font-bold ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-900' : 'text-zinc-100'} uppercase tracking-wider`}>Synthesis Workbench</h3>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">High-Fidelity Model Sourcing</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className={`p-2 ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-200/50' : 'text-zinc-500 hover:text-zinc-300' } rounded-xl transition-all`}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <UploadCloud size={14} className={`text-${theme.primary}`} />
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Search Prompt</h4>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target?.value || '')}
                placeholder="E.g., 'Realistic Red Blood Cell', 'Apollo 11 Lander'..."
                className={`w-full ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-zinc-100 border-zinc-200 text-zinc-900 placeholder:text-zinc-400' : 'bg-black/40 border-white/5 text-zinc-200 placeholder:text-zinc-600'} rounded-xl p-4 pr-12 text-base focus:outline-none focus:border-${theme.primary}/30 focus:ring-1 focus:ring-${theme.primary}/30 transition-all resize-none h-32 font-medium`}
              />
              <button
                onClick={toggleListening}
                className={`absolute right-3 bottom-3 p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500/20 text-red-400 animate-pulse' 
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className={`px-2 py-1 ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-zinc-200/50 text-zinc-500 hover:bg-zinc-200' : 'bg-white/5 text-zinc-400 hover:bg-white/10'} border border-white/5 rounded-lg text-[9px] hover:text-${theme.primary} transition-colors`}
                >
                  {s}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleFreeGenerate}
              disabled={!prompt.trim() || isGenerating || isFreeGenerating}
              className={`w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 uppercase tracking-wider border border-indigo-400/30 relative overflow-hidden`}
            >
              {isFreeGenerating ? (
                <span className="relative z-10 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Neural Synthesis Search...
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <Globe size={16} />
                  Fetch Real-World Model (FREE)
                </span>
              )}
            </button>

            <button
              onClick={handleMeshyGenerate}
              disabled={!prompt.trim() || isGenerating || isFreeGenerating}
              className={`w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/20 uppercase tracking-wider border border-fuchsia-400/30 relative overflow-hidden mt-2`}
            >
              {isGenerating ? (
                <span className="relative z-10 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Generating AI Model ({progress}%)
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={16} />
                  Generate AI 3D Model (MESHY)
                </span>
              )}
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <ModelSearchResults 
            theme={theme} 
            results={searchResults} 
            onSelect={handleSelectModel}
            selectedUrl={hologramConfig.glbUrl}
          />
        )}

        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={14} className="text-cyan-400" />
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Global Repository Access</h4>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            The <strong>Real-World Fetch</strong> system utilizes AI to source hyper-realistic .glb files from verified scientific and educational archives (NASA, Smithsonian, Khronos).
          </p>
          <p className="text-[10px] text-zinc-500 leading-relaxed mt-2 font-bold text-indigo-400">
            Note: All fetched assets are high-fidelity PBR models compatible with the holographic viewer.
          </p>
        </div>

      </div>
    </aside>
  );
}
