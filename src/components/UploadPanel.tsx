import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, X, FileBox, CheckCircle, AlertCircle, Save, Loader2 } from 'lucide-react';
import { saveHologram } from '../services/storageService';
import { Theme } from '../types';

interface UploadPanelProps {
  onUpload: (url: string, explanation: string) => void;
  onClose: () => void;
  theme: Theme;
}

import { useStore } from '../store/useStore';

export function UploadPanel() {
  const { 
    setUploadedModel, 
    setUploadedModelExplanation, 
    setActiveTopic, 
    setIsUploadOpen, 
    theme 
  } = useStore();

  const onClose = () => setIsUploadOpen(false);

  const onUpload = (url: string, explanation: string) => {
    setUploadedModel(url);
    setUploadedModelExplanation(explanation);
    setActiveTopic('Upload');
    setIsUploadOpen(false);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveToLibrary, setSaveToLibrary] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validExtensions = ['.glb', '.gltf'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Invalid file format. Please upload a .glb or .gltf file.');
      return;
    }

    if (file.size > 200 * 1024 * 1024) { // 200MB limit
      setError('File size too large. Maximum size is 200MB.');
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      const url = URL.createObjectURL(file);
      const explanation = `Uploaded 3D model: ${file.name}. Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB. This model has been initialized for holographic visualization.`;
      
      if (saveToLibrary) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          await saveHologram({
            id: `upload-${Date.now()}`,
            name: file.name,
            type: 'uploaded',
            timestamp: Date.now(),
            fileData: arrayBuffer,
            fileName: file.name,
            fileType: file.type || 'model/gltf-binary'
          });
        } catch (err) {
          console.error("Failed to save to library:", err);
        }
      }
      onUpload(url, explanation);
      setIsUploading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className={`${theme.uiBg} border ${theme.border} rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors duration-500`}>
        <div className={`p-5 border-b ${theme.border} flex items-center justify-between bg-black/60`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${theme.primaryHex}1A`, color: theme.primaryHex, borderColor: `${theme.primaryHex}33` }}>
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-xs font-display font-bold text-zinc-100 uppercase tracking-wider">Asset Importer</h3>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">3D Model Pipeline</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-current'
                : file
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
            }`}
            style={isDragging ? { borderColor: theme.primaryHex, backgroundColor: `${theme.primaryHex}1A`, color: theme.primaryHex } : {}}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".glb,.gltf"
              className="hidden"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-3 text-emerald-400">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">{file.name}</p>
                  <p className="text-[10px] text-emerald-500/60 font-mono mt-1 uppercase tracking-wider">{(file.size / (1024 * 1024)).toFixed(2)} MB • Verified</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-zinc-500">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5">
                  <FileBox size={32} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-300 tracking-tight">Drop model to initialize</p>
                  <p className="text-[10px] text-zinc-600 mt-2 font-medium uppercase tracking-widest leading-relaxed">Supports GLB, GLTF formats<br/>Maximum payload 200MB</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-rose-400 text-[11px] font-bold bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 uppercase tracking-wider"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: `${theme.primaryHex}1A`, color: theme.primaryHex, borderColor: `${theme.primaryHex}33` }}>
                <Save size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Save to Library</p>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest mt-0.5">Persistent storage</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={saveToLibrary}
                onChange={(e) => setSaveToLibrary(e.target?.checked ?? true)}
                className="sr-only peer" 
              />
              <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm" style={{ backgroundColor: saveToLibrary ? theme.primaryHex : undefined }}></div>
            </label>
          </div>

          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full py-4 disabled:bg-zinc-900 disabled:text-zinc-700 text-white text-[11px] font-bold rounded-2xl shadow-xl disabled:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
            style={{ backgroundColor: theme.primaryHex }}
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {isUploading ? 'Initializing...' : 'Initialize Simulation'}
          </button>
        </div>
      </div>
    </div>
  );
}
