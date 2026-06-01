import React, { useState, useEffect } from 'react';
import { X, BookOpen, FileText, ExternalLink, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme } from '../types';
import { ncertPhysicsData } from '../data/ncertPhysics';
import { ncertPhysics12Data } from '../data/ncertPhysics12';
import { ncertChemistryData } from '../data/ncertChemistry';
import { ncertChemistry12Data } from '../data/ncertChemistry12';
import { ncertMathsData } from '../data/ncertMaths';
import { ncertMaths12Data } from '../data/ncertMaths12';
import { ncertBiologyData } from '../data/ncertBiology';
import { ncertBiology12Data } from '../data/ncertBiology12';
import { ncertComputerScienceData } from '../data/ncertComputerScience';
import { PDFViewer } from './PDFViewer';

interface NCERTBooksPanelProps {
  onClose: () => void;
  theme: Theme;
  initialSubject?: 'physics' | 'physics12' | 'chemistry' | 'chemistry12' | 'maths' | 'maths12' | 'biology' | 'biology12' | 'cs';
  initialChapter?: number | null;
}

import { useStore } from '../store/useStore';

export function NCERTBooksPanel() {
  const { 
    setActiveTopic, 
    theme, 
    ncertSubject: initialSubject = 'physics', 
    ncertChapter: initialChapter = null,
    isSidebarOpen,
    isMobile,
    isTranscriptionOpen,
    setIsTranscriptionOpen
  } = useStore();
  
  const onClose = () => setActiveTopic('Atom');
  const toggleTranscription = () => setIsTranscriptionOpen(!isTranscriptionOpen);
  const [activeSubject, setActiveSubject] = useState<'physics' | 'physics12' | 'chemistry' | 'chemistry12' | 'maths' | 'maths12' | 'biology' | 'biology12' | 'cs'>(initialSubject);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    if (initialChapter !== null) {
      const currentData = activeSubject === 'physics' ? ncertPhysicsData 
        : activeSubject === 'physics12' ? ncertPhysics12Data
        : activeSubject === 'chemistry' ? ncertChemistryData 
        : activeSubject === 'chemistry12' ? ncertChemistry12Data
        : activeSubject === 'maths' ? ncertMathsData
        : activeSubject === 'maths12' ? ncertMaths12Data
        : activeSubject === 'biology' ? ncertBiologyData
        : activeSubject === 'biology12' ? ncertBiology12Data
        : ncertComputerScienceData;
      
      const chapterData = currentData.find(c => c.id === `ch${initialChapter}`);
      if (chapterData) {
        setSelectedPdf(chapterData.pdfUrl);
      }
    }
  }, [initialChapter, activeSubject]);

  const activeData = activeSubject === 'physics' 
    ? ncertPhysicsData 
    : activeSubject === 'physics12'
      ? ncertPhysics12Data
      : activeSubject === 'chemistry' 
        ? ncertChemistryData 
        : activeSubject === 'chemistry12'
          ? ncertChemistry12Data
          : activeSubject === 'maths'
            ? ncertMathsData
            : activeSubject === 'maths12'
              ? ncertMaths12Data
              : activeSubject === 'biology'
                ? ncertBiologyData
                : activeSubject === 'biology12'
                  ? ncertBiology12Data
                  : ncertComputerScienceData;

  const subjectTitle = activeSubject === 'physics' 
    ? 'Class 11 Physics' 
    : activeSubject === 'physics12'
      ? 'Class 12 Physics'
      : activeSubject === 'chemistry' 
        ? 'Class 11 Chemistry' 
        : activeSubject === 'chemistry12'
          ? 'Class 12 Chemistry'
          : activeSubject === 'maths'
            ? 'Class 11 Mathematics'
            : activeSubject === 'maths12'
              ? 'Class 12 Mathematics'
              : activeSubject === 'biology'
                ? 'Class 11 Biology'
                : activeSubject === 'biology12'
                  ? 'Class 12 Biology'
                  : 'Class 11 Computer Science';

  return (
    <>
      <div className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6 transition-all duration-300 ${isSidebarOpen && !isMobile ? 'left-64' : 'left-0'}`}>
        <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-2xl h-[80vh] bg-zinc-950 border border-${theme.primary}/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden will-change-transform`}
      >
        {/* Header */}
        <div className={`p-4 border-b border-${theme.primary}/20 bg-gradient-to-r from-${theme.primary}/10 to-transparent`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${theme.primary}/20 text-${theme.primary}`}>
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">NCERT Books</h2>
                <p className="text-xs text-zinc-400">{subjectTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTranscription}
                className={`p-2 rounded-lg transition-all border ${
                  isTranscriptionOpen 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/10 border-transparent'
                }`}
                title="Toggle Live Transcription"
              >
                <Mic size={20} className={isTranscriptionOpen ? 'animate-pulse' : ''} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Subject Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubject('physics')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'physics'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Physics 11
            </button>
            <button
              onClick={() => setActiveSubject('physics12')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'physics12'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Physics 12
            </button>
            <button
              onClick={() => setActiveSubject('chemistry')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'chemistry'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Chemistry 11
            </button>
            <button
              onClick={() => setActiveSubject('chemistry12')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'chemistry12'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Chemistry 12
            </button>
            <button
              onClick={() => setActiveSubject('maths')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'maths'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Mathematics 11
            </button>
            <button
              onClick={() => setActiveSubject('maths12')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'maths12'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Mathematics 12
            </button>
            <button
              onClick={() => setActiveSubject('biology')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'biology'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Biology 11
            </button>
            <button
              onClick={() => setActiveSubject('biology12')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'biology12'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Biology 12
            </button>
            <button
              onClick={() => setActiveSubject('cs')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === 'cs'
                  ? `bg-${theme.primary} text-white`
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Computer Science
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid gap-3">
            {activeData.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-${theme.primary}/10 text-${theme.primary}`}>
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-medium group-hover:text-white">{chapter.title}</span>
                    {(chapter as any).explanation && (
                      <span className="text-sm text-zinc-400 mt-1 max-w-[400px] leading-relaxed line-clamp-3">
                        {(chapter as any).explanation}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedPdf(chapter.pdfUrl)}
                    className={`p-2 rounded-lg bg-${theme.primary}/10 text-${theme.primary} hover:bg-${theme.primary}/20 transition-colors flex items-center gap-2`}
                    title="Read in 3D Viewer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">Read</span>
                  </button>
                  <button
                    onClick={() => window.open(chapter.pdfUrl, '_blank')}
                    className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                    title="Open PDF directly"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>

    {selectedPdf && (
      <PDFViewer 
        url={selectedPdf} 
        onClose={() => setSelectedPdf(null)} 
      />
    )}
    </>
  );
}
