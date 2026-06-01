import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrainCircuit, X, Loader2, BookOpen, Sparkles, Volume2, Square } from 'lucide-react';
import { generateExplanation } from '../services/geminiService';
import { getPreloadedExplanation } from '../data/preloadedExplanations';
import { Theme } from '../constants/themes';
import { Topic } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useHoloAudio } from '../hooks/useHoloAudio';
import { useStore } from '../store/useStore';

interface NeuralIntelligencePanelProps {
  onClose: () => void;
  onOpenCourse: () => void;
  theme: Theme;
  topic: Topic;
}

export function NeuralIntelligencePanel({ onClose, onOpenCourse, theme, topic }: NeuralIntelligencePanelProps) {
  const { language, isSidebarOpen, isMobile: storeIsMobile, isSoundEnabled } = useStore();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [level, setLevel] = useState<'basic' | 'detailed' | 'expert'>('detailed');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const { stop, init } = useHoloAudio();

  const handleAnalyze = useCallback(async (selectedLevel: 'basic' | 'detailed' | 'expert') => {
    init(); // Initialize audio context on user gesture
    setLoading(true);
    stop(); // Stop any currently playing audio
    try {
      // 1. Try preloaded first
      let result = getPreloadedExplanation(topic, selectedLevel);
      
      // 2. If not found, fall back to Gemini
      if (!result) {
        result = await generateExplanation(topic, selectedLevel, language || 'English');
      }
      
      if (result) {
        setAnalysis(result);
      }
    } catch (e) {
      setAnalysis('Failed to generate analysis.');
    } finally {
      setLoading(false);
    }
  }, [topic, stop, language, init]);

  useEffect(() => {
    if (analysis && !loading) {
      handleAnalyze(level);
    }
  }, [level, topic]); // Only trigger when level or topic changes, and if we already have an analysis

  const [isLocalPlaying, setIsLocalPlaying] = useState(false);

  const handlePlayAudio = () => {
    if (isLocalPlaying) {
      window.speechSynthesis.cancel();
      setIsLocalPlaying(false);
      return;
    }

    if (analysis) {
      // Clean analysis text for speech (remove markdown)
      const cleanText = analysis
        .replace(/#+\s/g, '') // Remove headers
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '')   // Remove italics
        .replace(/`[^`]*`/g, '') // Remove code blocks
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Handle links
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) || 
                             voices.find(v => v.lang.includes('en')) || 
                             voices[0];
      
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 1.0;
      
      utterance.onstart = () => setIsLocalPlaying(true);
      utterance.onend = () => setIsLocalPlaying(false);
      utterance.onerror = () => setIsLocalPlaying(false);

      window.speechSynthesis.cancel(); // Stop any pending speech
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className={`fixed transition-all duration-300 ${isMobile ? 'inset-0 z-50' : `top-20 z-[85] w-96 rounded-2xl left-6`} ${theme.bg} backdrop-blur-md border ${theme.border} p-6 shadow-2xl max-h-[90vh] flex flex-col`}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-indigo-500/10' : `bg-${theme.primary}/20`} rounded-lg`}>
            <BrainCircuit className={theme.id === 'white' || theme.id === 'ios-light' ? 'text-indigo-600' : `text-${theme.primary}`} size={18} />
          </div>
          <h3 className={`text-sm font-bold ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-900' : 'text-white'} uppercase tracking-wider`}>Neural Intelligence</h3>
        </div>
        <button onClick={() => {
          window.speechSynthesis.cancel();
          stop();
          onClose();
        }} className="p-2 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {!analysis && (
          <div className="space-y-4">
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Core Synthesis</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Advanced aerodynamic analysis powered by the Neural Intelligence core. This module provides real-time insights into airflow, pressure distribution, and structural integrity of the aircraft model.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleAnalyze(level)}
                disabled={loading}
                className={`flex-1 py-3 bg-${theme.primary} text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : (
                  <>
                    <BrainCircuit size={14} />
                    Analyze Synthesis
                  </>
                )}
              </button>
              <button 
                onClick={onOpenCourse}
                className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen size={14} />
                Course
              </button>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10">
              <div className="flex gap-1">
                {(['basic', 'detailed', 'expert'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                      level === l ? 'bg-indigo-500 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePlayAudio}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isLocalPlaying 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30'
                }`}
              >
                {isLocalPlaying ? (
                  <>
                    <Square size={12} className="fill-current" /> Stop
                  </>
                ) : (
                  <>
                    <Volume2 size={12} /> Play
                  </>
                )}
              </button>
            </div>

            <div className={`prose ${theme.id === 'white' || theme.id === 'ios-light' ? 'prose-zinc' : 'prose-invert'} prose-xs max-w-none`}>
              <div className={`${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-700' : 'text-zinc-300'} text-xs leading-relaxed markdown-body`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t border-white/5">
              <button 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsLocalPlaying(false);
                  stop();
                  setAnalysis(null);
                }} 
                className="flex-1 py-2 bg-white/5 text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Reset Analysis
              </button>
              <button 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsLocalPlaying(false);
                  stop();
                  onOpenCourse();
                }}
                className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <BookOpen size={12} />
                Full Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
