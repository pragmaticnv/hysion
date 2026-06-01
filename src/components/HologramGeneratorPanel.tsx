import { useState } from 'react';
import { Sparkles, X, Globe } from 'lucide-react';
import { saveHologram } from '../services/storageService';
import { generateHologramConfig, generateFree3DModel, generateLessonContent } from '../services/geminiService';
import { fetchModelsFromAllSources } from '../services/modelFetcherService';
import { generateMeshy3DModel } from '../services/meshyService';
import { db } from '../services/firebaseService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { AISynthesisSection } from './generator/AISynthesisSection';
import { ImageSynthesisSection } from './generator/ImageSynthesisSection';
import { PresetConstructsSection } from './generator/PresetConstructsSection';
import { GeometrySection } from './generator/GeometrySection';
import { ColorPaletteSection } from './generator/ColorPaletteSection';
import { NeuralParametersSection } from './generator/NeuralParametersSection';
import { PrecisionToolsSection } from './generator/PrecisionToolsSection';
import { ModelSearchResults } from './generator/ModelSearchResults';

export function HologramGeneratorPanel() {
  const { 
    hologramConfig: config, 
    setHologramConfig: onConfigChange, 
    setActiveTopic,
    theme,
    user
  } = useStore();
  const onClose = () => setActiveTopic('Atom');
  const [prompt, setPrompt] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFreeGenerating, setIsFreeGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);

  const handleImageLoad = () => {
    if (!imageUrlInput.trim()) return;
    onConfigChange({ 
      ...config, 
      imageUrl: imageUrlInput.trim(),
      glbUrl: undefined, // Clear GLB if image is set
      prompt: "Image-based Hologram" 
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const targetConfig = config;
      const hologramId = `custom-${Date.now()}`;
      // Save the hologram
      await saveHologram({
        id: hologramId,
        name: prompt.trim() || generatedLesson?.title || `${config.type} Hologram`,
        type: 'custom',
        timestamp: Date.now(),
        config: targetConfig
      });

      // Save the generated lesson module if there is one
      if (generatedLesson && user) {
        const { contentService } = await import('../services/contentService');
        await contentService.saveCourse(hologramId, {
             title: generatedLesson.title || 'Generated Module',
             subtitle: 'AI Synthesized Construct',
             intro: generatedLesson.description || 'Module generated from AI construct.',
             modules: generatedLesson.modules || [],
             sections: [],
        });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to save hologram/module:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedLesson(null);

    try {
      const [result, lesson] = await Promise.all([
        generateHologramConfig(prompt),
        generateLessonContent(prompt)
      ]);

      if (result) {
        onConfigChange({ ...config, ...result });
      }
      if (lesson) {
        setGeneratedLesson(lesson);
      }
      setPrompt('');
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModelSearch = async () => {
    if (!prompt.trim() || isSearching) return;
    setIsSearching(true);
    setSearchResults([]);
    setGeneratedLesson(null);

    try {
      const [results, lesson] = await Promise.all([
        fetchModelsFromAllSources(prompt),
        generateLessonContent(prompt)
      ]);

      if (results && results.length > 0) {
        setSearchResults(results);
        // Automatically select first result
        const model = results[0];
        onConfigChange({
          ...config,
          type: 'assembly',
          glbUrl: model.url,
          isRealistic: true,
          prompt: prompt
        });
      }
      if (lesson) {
        setGeneratedLesson(lesson);
      }
    } catch (error) {
      console.error("Model search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectModel = (model: any) => {
    onConfigChange({
      ...config,
      type: 'assembly',
      glbUrl: model.url,
      isRealistic: true
    });
  };

  const handleMeshyGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedLesson(null);

    try {
      const result = await generateMeshy3DModel(prompt);

      if (result && result.glb) {
        onConfigChange({
          ...config,
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
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    "Red Blood Cell",
    "Mars Rover Curiosity",
    "Great Pyramid of Giza",
    "Human Skeleton",
    "Space Shuttle"
  ];

  return (
    <aside className={`fixed right-0 top-0 bottom-0 z-[70] w-full md:w-[450px] ${theme.uiBg} backdrop-blur-md border-l ${theme.border} flex flex-col shadow-2xl transition-all duration-300 ease-in-out overflow-hidden`}>
      <div className={`p-5 border-b ${theme.border} flex items-center justify-between ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-zinc-100/60' : 'bg-black/60'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-zinc-200/50' : 'bg-zinc-800/50'} flex items-center justify-center text-${theme.primary} border ${theme.border} shadow-sm`}>
            <Globe size={20} />
          </div>
          <div>
            <h3 className={`text-xs font-display font-bold ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-900' : 'text-zinc-100'} uppercase tracking-wider`}>Model Library</h3>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Global Repository Search</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className={`p-2 ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-200/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'} rounded-xl transition-all`}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        <AISynthesisSection
          theme={theme}
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          isFreeGenerating={isSearching}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          generatedLesson={generatedLesson}
          suggestions={suggestions}
          onAIGenerate={handleAIGenerate}
          onFreeGenerate={handleModelSearch}
          onMeshyGenerate={handleMeshyGenerate}
          onSave={handleSave}
        />

        {searchResults.length > 0 && (
          <ModelSearchResults 
            theme={theme} 
            results={searchResults} 
            onSelect={handleSelectModel}
            selectedUrl={config.glbUrl}
          />
        )}

        <div className="h-px bg-white/5" />

        <ImageSynthesisSection
          theme={theme}
          imageUrlInput={imageUrlInput}
          setImageUrlInput={setImageUrlInput}
          onImageLoad={handleImageLoad}
        />

        <div className="h-px bg-white/5" />

        <PresetConstructsSection theme={theme} onConfigChange={onConfigChange} />

        <div className="h-px bg-white/5" />

        <GeometrySection theme={theme} config={config} onConfigChange={onConfigChange} />

        <ColorPaletteSection theme={theme} config={config} onConfigChange={onConfigChange} />

        <NeuralParametersSection theme={theme} config={config} onConfigChange={onConfigChange} />

        <PrecisionToolsSection theme={theme} config={config} onConfigChange={onConfigChange} />

      </div>
    </aside>
  );
}
