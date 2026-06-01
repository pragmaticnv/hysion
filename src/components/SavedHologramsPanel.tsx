import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Library, Trash2, Play, Box, Upload as UploadIcon, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { SavedHologram, getSavedHolograms, deleteHologram, getHologramData } from '../services/storageService';
import { Topic, Theme } from '../types';
import { AdvancedConfig } from '../models/CustomModel';

interface SavedHologramsPanelProps {
  onLoadCustom: (config: AdvancedConfig) => void;
  onLoadUploaded: (url: string, name: string) => void;
  onSwitchTopic: (topic: Topic) => void;
  onClose: () => void;
  theme: Theme;
}

import { useStore } from '../store/useStore';
import * as THREE from 'three';

export function SavedHologramsPanel() {
  const { 
    setCustomConfig: onLoadCustom, 
    setUploadedModel, 
    setUploadedModelExplanation, 
    setActiveTopic: onSwitchTopic, 
    theme 
  } = useStore();
  
  const onClose = () => onSwitchTopic('Atom');

  const onLoadUploaded = (url: string, name: string) => {
    setUploadedModel(url);
    setUploadedModelExplanation(`Analysis of uploaded model: ${name}`);
  };

  const onLoadImageTo3D = (url: string, name: string, dimensions?: { width: number; height: number }) => {
    // Currently ImageTo3DPanel handles its own state, but we can reuse the Upload topic or a specialized one
    // For now, let's just use Upload logic if we want to show it in the primary viewer, 
    // but the request was specifically for "Image to 3D Model" saving.
    // Let's stick to the topic switching.
    setUploadedModel(url);
    setUploadedModelExplanation(`Reloaded reconstruction: ${name}`);
  };

  const [holograms, setHolograms] = useState<SavedHologram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHolograms();
  }, []);

  const loadHolograms = async () => {
    setIsLoading(true);
    try {
      const saved = await getSavedHolograms();
      setHolograms(saved);
    } catch (error) {
      console.error("Failed to load holograms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHologram(id);
      setHolograms(holograms.filter(h => h.id !== id));
    } catch (error) {
      console.error("Failed to delete hologram:", error);
    }
  };

  const handleLoad = async (hologram: SavedHologram) => {
    if (hologram.type === 'custom' && hologram.config) {
      onLoadCustom(hologram.config);
      onSwitchTopic(hologram.id as any);
      useStore.getState().setIsCourseOpen(true);
    } else if (hologram.type === 'imageTo3D' || hologram.type === 'uploaded') {
      try {
        const fullData = await getHologramData(hologram.id);
        if (fullData && fullData.fileData && fullData.fileType) {
          const blob = new Blob([fullData.fileData], { type: fullData.fileType });
          const url = URL.createObjectURL(blob);
          if (hologram.type === 'imageTo3D') {
            onLoadImageTo3D(url, hologram.name, hologram.dimensions);
            onSwitchTopic('ImageTo3D');
          } else {
            onLoadUploaded(url, fullData.fileName || hologram.name);
            onSwitchTopic('Upload');
          }
        }
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  };

  return (
    <div className={`absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col p-8 pl-72 transition-colors duration-200`}>
      <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: `${theme.primaryHex}1A`, color: theme.primaryHex, borderColor: `${theme.primaryHex}33` }}>
              <Library size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Saved Holograms</h2>
              <p className="text-zinc-500 text-sm mt-1">Your personal collection of AI-generated and uploaded constructs.</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-white transition-all text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Viewer
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : holograms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 border-2 border-dashed border-white/5 rounded-3xl">
              <Library size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium text-zinc-400">Your library is empty</p>
              <p className="text-sm mt-2">Save holograms from the AI Generator or Upload Panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {holograms.map((hologram) => (
                <motion.div
                  key={hologram.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-zinc-900/50 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:bg-white/[0.02] transition-all group`}
                  style={{ '--hover-color': theme.primaryHex } as any}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.primaryHex}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        hologram.type === 'custom' 
                          ? 'border-white/10'
                          : 'border-white/10'
                      }`} style={hologram.type === 'custom' ? { backgroundColor: `${theme.primaryHex}1A`, color: theme.primaryHex, borderColor: `${theme.primaryHex}33` } : (hologram.type === 'imageTo3D' ? { backgroundColor: '#38bdf81A', color: '#38bdf8', borderColor: '#38bdf833' } : { backgroundColor: `${theme.secondaryHex}1A`, color: theme.secondaryHex, borderColor: `${theme.secondaryHex}33` })}>
                        {hologram.type === 'custom' ? <Box size={20} /> : (hologram.type === 'imageTo3D' ? <ImageIcon size={20} /> : <UploadIcon size={20} />)}
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-200 truncate max-w-[140px]">{hologram.name}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                          {new Date(hologram.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(hologram.id)}
                      className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {hologram.type === 'custom' && hologram.config && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: hologram.config.primaryColor }} />
                      <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: hologram.config.secondaryColor }} />
                    </div>
                  )}

                  <button
                    onClick={() => handleLoad(hologram)}
                    className="mt-auto w-full py-2.5 bg-white/5 text-zinc-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    style={{ transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.primaryHex; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#d4d4d8'; }}
                  >
                    <Play size={14} />
                    Load Hologram
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
