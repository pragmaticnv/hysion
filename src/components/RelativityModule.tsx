import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Sparkles, Volume2, StopCircle, BrainCircuit } from 'lucide-react';
import { RelativityVisualization } from './RelativityVisualization';
import { NeuralIntelligenceSection } from './NeuralIntelligenceSection';
import { relativityCourseContent } from '../data/relativityCourseContent';
import { useHoloAudio } from '../hooks/useHoloAudio';
import { useStore } from '../store/useStore';

export const RelativityModule = () => {
  const { setActiveTopic } = useStore();
  const onBack = () => setActiveTopic('Atom');
  const [showCourse, setShowCourse] = React.useState(true);
  const { play, stop, isPlaying, currentText } = useHoloAudio();

  React.useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      const { action, setting, value } = e.detail;
      if (action === 'RELATIVITY_CONTROL' && setting === 'showCourse') {
        setShowCourse(value === 'true');
      }
    };

    window.addEventListener('app-voice-command', handleVoiceCommand);
    return () => window.removeEventListener('app-voice-command', handleVoiceCommand);
  }, []);

  return (
    <div className="w-full h-screen bg-[#050505] text-white p-6 flex flex-col overflow-hidden font-sans">
      {/* Top Header - Microscope Style */}
      <div className="flex items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="p-2.5 bg-zinc-900/50 border border-white/10 hover:bg-zinc-800 hover:border-cyan-500/50 rounded-xl transition-all group"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Theory of Relativity</h1>
              <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[8px] font-bold text-cyan-400 uppercase tracking-widest">Experimental</div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Neural Spacetime Synthesis v4.0</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[8px] text-zinc-600 uppercase tracking-[0.2em] font-bold">System Status</span>
            <span className="text-[10px] text-cyan-500 font-mono">CORE_SYNC_ACTIVE</span>
          </div>
          <button 
            onClick={() => setShowCourse(!showCourse)}
            className={`px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border ${
              showCourse 
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {showCourse ? 'Full Screen Hologram' : 'Show Neural Analysis'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className={`${showCourse ? 'lg:w-1/2' : 'w-full'} h-full relative transition-all duration-300 group rounded-2xl overflow-hidden border border-white/5`}>
          <RelativityVisualization />
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Active Simulation</span>
          </div>
        </div>
        
        {showCourse && (
          <div className="lg:w-1/2 bg-zinc-900 border-l border-cyan-500/30 backdrop-blur-md p-8 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent space-y-8">
              {/* Audio Synthesis Header */}
              <div className="flex items-center justify-between p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                    <BrainCircuit className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Neural Synthesis</h3>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Audio Explanation Active</p>
                  </div>
                </div>
                <button 
                  onClick={() => isPlaying && currentText === relativityCourseContent ? stop() : play(relativityCourseContent)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border ${
                    isPlaying && currentText === relativityCourseContent
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-zinc-800 text-zinc-400 border-white/10 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {isPlaying && currentText === relativityCourseContent ? <StopCircle size={14} /> : <Volume2 size={14} />}
                  {isPlaying && currentText === relativityCourseContent ? 'Stop Synthesis' : 'Play Synthesis'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-5 bg-black/40 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                    <Sparkles className="text-cyan-400" size={22} />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Field Equations</h2>
                    <div className="font-mono text-xs text-cyan-400">
                      G<sub>μν</sub> + Λg<sub>μν</sub> = (8πG/c⁴)T<sub>μν</sub>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-5 bg-black/40 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                    <Sparkles className="text-cyan-400" size={22} />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Mass-Energy</h2>
                    <div className="font-mono text-lg text-cyan-400 tracking-tighter">
                      E = mc<sup>2</sup>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="markdown-body text-zinc-400 text-sm leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {relativityCourseContent}
                </ReactMarkdown>
              </div>
              <NeuralIntelligenceSection />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
