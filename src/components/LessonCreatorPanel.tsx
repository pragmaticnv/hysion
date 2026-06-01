import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Save, BookOpen, Mic, MicOff } from 'lucide-react';
import { Theme } from '../types';
import { useStore } from '../store/useStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { db } from '../services/firebaseService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Module {
  title: string;
  desc: string;
  objectives: string[];
  interactiveLabel: string;
  quiz: { question: string; options: string[]; correctAnswer: number };
}

export function LessonCreatorPanel() {
  const { setIsLessonCreatorOpen, theme, user } = useStore();
  const onClose = () => setIsLessonCreatorOpen(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDictatingIndex, setIsDictatingIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addModule = () => {
    setModules([...modules, { title: '', desc: '', objectives: [''], interactiveLabel: '', quiz: { question: '', options: [''], correctAnswer: 0 } }]);
  };

  const updateModule = (index: number, field: string, value: any) => {
    const updatedModules = [...modules];
    // @ts-ignore
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const onResult = useCallback((final: string) => {
      if (isDictatingIndex !== null) {
          updateModule(isDictatingIndex, 'desc', final);
      }
  }, [isDictatingIndex]);

  const { start, stop } = useSpeechRecognition({
      onResult
  });

  const toggleDictation = (index: number) => {
      if (isDictatingIndex === index) {
          stop();
          setIsDictatingIndex(null);
      } else {
          if (isDictatingIndex !== null) stop();
          setIsDictatingIndex(index);
          start();
      }
  };

  const saveLesson = async () => {
      if (!user) return;
      try {
          await addDoc(collection(db, 'lessons'), {
              title,
              description,
              teacherUid: user.uid,
              modules,
              createdAt: serverTimestamp()
          });
          onClose();
      } catch (e) {
          console.error("Error saving lesson: ", e);
      }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-6">
      <div className={`w-full max-w-4xl ${isMobile ? 'h-full rounded-none' : 'h-[80vh] rounded-2xl'} bg-zinc-950 border border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <BookOpen className={`text-${theme.primary}`} />
            {isMobile ? 'Lesson Creator' : 'Educator Studio: Create Lesson'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white"><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <input placeholder="Lesson Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-lg border border-white/5 text-white text-base" />
          <textarea placeholder="Lesson Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-lg border border-white/5 text-white h-24 text-base" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Modules</h3>
            {modules.map((module, index) => (
              <div key={index} className="bg-zinc-900 p-4 rounded-lg border border-white/5 space-y-2">
                <input placeholder="Module Title" value={module.title} onChange={e => updateModule(index, 'title', e.target.value)} className="w-full bg-black p-2 rounded border border-white/5 text-white" />
                <div className="flex gap-2">
                    <input placeholder="Module Description" value={module.desc} onChange={e => updateModule(index, 'desc', e.target.value)} className="flex-1 bg-black p-2 rounded border border-white/5 text-white" />
                    <button onClick={() => toggleDictation(index)} className={`p-2 rounded ${isDictatingIndex === index ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'} hover:bg-zinc-700`}>
                        {isDictatingIndex === index ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                </div>
                <button onClick={() => setModules(modules.filter((_, i) => i !== index))} className="text-red-400 text-sm flex items-center gap-1"><Trash2 size={14} /> Remove Module</button>
              </div>
            ))}
            <button onClick={addModule} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg flex items-center gap-2 text-white">
              <Plus size={18} /> Add Module
            </button>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/10 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
          <button onClick={saveLesson} className={`bg-${theme.primary} text-white px-6 py-2 rounded-lg flex items-center gap-2`}>
            <Save size={18} /> Save Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
