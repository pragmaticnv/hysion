import { useState, useEffect, useRef } from 'react';
import { Topic, Theme } from '../types';
import { X, Upload, Save, FileText, Download } from 'lucide-react';

interface LectureNotesPanelProps {
  activeTopic: Topic;
  onClose: () => void;
  theme: Theme;
}

import { useStore } from '../store/useStore';

export function LectureNotesPanel() {
  const { activeTopic, setIsNotesOpen, theme } = useStore();
  const onClose = () => setIsNotesOpen(false);
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load notes from local storage when topic changes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`holo-notes-${activeTopic}`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes('');
    }
    setLastSaved(null);
  }, [activeTopic]);

  const handleSave = () => {
    localStorage.setItem(`holo-notes-${activeTopic}`, notes);
    setLastSaved(new Date());
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setNotes(prev => prev + (prev ? '\n\n' : '') + text);
      };
      reader.readAsText(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTopic}-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-96 ${theme.uiBg} backdrop-blur-md border-l ${theme.border} flex flex-col h-full shadow-2xl z-20 transition-colors duration-200`}>
      <div className={`p-6 border-b ${theme.border} flex justify-between items-center bg-gradient-to-r from-${theme.primary}/10 to-transparent`}>
        <div className="flex items-center gap-3">
          <FileText className={`text-${theme.primary}`} size={24} />
          <h2 className="font-bold text-lg tracking-wide text-white">Lecture Notes</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-wider font-medium">
            <span>{activeTopic} Notes</span>
            <div className="flex items-center gap-2">
                {lastSaved && <span className="text-zinc-500">Saved {lastSaved.toLocaleTimeString()}</span>}
                <span className="text-emerald-500/80">{notes.length} chars</span>
            </div>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target?.value || '')}
          placeholder="Type your lecture notes here..."
          className={`flex-1 bg-black/50 border ${theme.border} rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-${theme.primary}/50 focus:ring-1 focus:ring-${theme.primary}/50 resize-none font-mono leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent`}
        />
        
        <div className="grid grid-cols-3 gap-2">
            <button
                onClick={handleSave}
                className={`flex items-center justify-center gap-2 p-3 bg-${theme.primary}/20 hover:bg-${theme.primary}/30 border border-${theme.primary}/30 rounded-xl text-${theme.primary} text-sm font-medium transition-colors`}
            >
                <Save size={16} />
                Save
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-black/40 hover:bg-zinc-700 border border-white/10 rounded-xl text-zinc-300 text-sm font-medium transition-colors"
            >
                <Upload size={16} />
                Import
            </button>
            <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 p-3 bg-black/40 hover:bg-zinc-700 border border-white/10 rounded-xl text-zinc-300 text-sm font-medium transition-colors"
            >
                <Download size={16} />
                Export
            </button>
        </div>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".txt,.md" 
            className="hidden" 
        />
      </div>
    </div>
  );
}
