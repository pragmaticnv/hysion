
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Box, FlaskConical, Activity, Calculator, Dna, Cpu, 
  ChevronRight, ChevronLeft, RotateCcw, Send, Settings, 
  Info, AlertTriangle, BookOpen, Wrench, MousePointer2, Move, Plus,
  Captions, Ruler, Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLabStore } from '../store/useLabStore';
import { LAB_EXPERIMENTS } from '../data/labExperiments';
import { LabWorkspace } from './LabWorkspace';
import { LabToolbox } from './LabToolbox';
import { LabTutor } from './LabTutor';
import { LabReadings } from './LabReadings';
import { ExperimentDesigner } from './ExperimentDesigner';

export function VirtualLabPanel() {
  const { isVirtualLabOpen, setIsVirtualLabOpen, setIsCircuitBuilderOpen, theme, isTranscriptionOpen, setIsTranscriptionOpen, transcript, interimTranscript, isSidebarOpen, isMobile } = useStore();
  const { 
    currentExperiment, 
    setCurrentExperiment, 
    currentStepIndex, 
    nextStep, 
    prevStep,
    resetLab
  } = useLabStore();

  const [activeCategory, setActiveCategory] = useState<any>('physics');
  const [showExperimentBriefing, setShowExperimentBriefing] = useState(true);
  const [showWelcomeIntro, setShowWelcomeIntro] = useState(false);
  const [showCreator, setShowCreator] = useState(false);

  // Sync experiments with store
  useEffect(() => {
    useLabStore.setState({ experiments: LAB_EXPERIMENTS });
    // Check if the user has seen the lab introduction
    if (localStorage.getItem('holoLabAppIntroSeen') !== 'true') {
      setShowWelcomeIntro(true);
      localStorage.setItem('holoLabAppIntroSeen', 'true');
    }
  }, []);

  // When experiment changes, show its briefing
  useEffect(() => {
    if (currentExperiment) {
      setShowExperimentBriefing(true);
    }
  }, [currentExperiment]);

  if (!isVirtualLabOpen) return null;

  const categories = [
    { id: 'physics', name: 'Physics', icon: Activity, color: 'text-sky-400' },
    { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: 'text-pink-400' },
    { id: 'biology', name: 'Biology', icon: Dna, color: 'text-emerald-400' },
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'text-amber-400' },
    { id: 'circuits', name: 'Circuit Design', icon: Cpu, color: 'text-indigo-400' }
  ];

  const experiments = LAB_EXPERIMENTS.filter(e => e.department === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[75] ${theme.bg} text-white flex flex-col font-sans transition-all duration-300 ${isSidebarOpen && !isMobile ? 'left-64' : 'left-0'}`}
    >
      {/* Top Navigation Bar */}
      <div className={`h-16 border-b ${theme.border} bg-black/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Box className="text-indigo-400" size={20} />
             </div>
             <div className="hidden sm:block">
                <h1 className="text-lg font-black tracking-tighter uppercase">Holo Lab <span className="text-indigo-500">v3.0</span></h1>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Next-Gen Simulation Environment</p>
             </div>
          </div>

          {!currentExperiment && (
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10 ml-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    activeCategory === cat.id ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <cat.icon size={14} className={activeCategory === cat.id ? 'text-white' : cat.color} />
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {currentExperiment && (
             <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                <div className="h-4 w-px bg-white/10 mx-2" />
                <button 
                  onClick={() => setCurrentExperiment(null)} 
                  className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={12} /> Experiments
                </button>
                
                <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10">
                   <button 
                      onClick={() => {
                        const experiments = LAB_EXPERIMENTS.filter(e => e.department === currentExperiment.department);
                        const idx = experiments.findIndex(e => e.id === currentExperiment.id);
                        if (idx > 0) setCurrentExperiment(experiments[idx - 1].id);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-l-lg transition-colors"
                   >
                     <ChevronLeft size={14} />
                   </button>
                   <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-2">{currentExperiment.title}</span>
                   <button 
                      onClick={() => {
                        const experiments = LAB_EXPERIMENTS.filter(e => e.department === currentExperiment.department);
                        const idx = experiments.findIndex(e => e.id === currentExperiment.id);
                        if (idx < experiments.length - 1) setCurrentExperiment(experiments[idx + 1].id);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-r-lg transition-colors"
                   >
                     <ChevronRight size={14} />
                   </button>
                </div>
             </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {currentExperiment && (
             <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                   Save <span className="text-[8px] text-indigo-500/50">Cloud</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                   Share
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                   Teacher Mode
                </button>
                <button 
                  onClick={() => setIsTranscriptionOpen(!isTranscriptionOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                    isTranscriptionOpen ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  <Captions size={12} /> {isTranscriptionOpen ? 'Captions On' : 'Start Explaining'}
                </button>
                <button 
                  onClick={() => useLabStore.getState().setPrecisionMode(!useLabStore.getState().precisionMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                    useLabStore.getState().precisionMode ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400'
                  }`}
                >
                  <Ruler size={12} /> {useLabStore.getState().precisionMode ? 'Precision ON' : 'Precision UI'}
                </button>
             </div>
          )}
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-mono text-emerald-400 uppercase font-black">Environment Stable</span>
          </div>
          <button onClick={() => setIsVirtualLabOpen(false)} className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all border border-white/10">
            <X size={20} />
          </button>
        </div>
      </div>

      {!currentExperiment ? (
        /* Inventory Screen */
        <div className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.05)_0%,transparent_70%)]">
           <div className="max-w-7xl mx-auto">
              <div className="mb-12 flex justify-between items-center">
                 <div>
                    <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase italic">Select <span className="text-indigo-500">Practical</span></h2>
                    <p className="text-zinc-500 max-w-2xl font-medium">Immersive 3D simulations strictly calibrated to scientific laws. Choose a department and experiment to begin your hands-on learning experience.</p>
                 </div>
                 <button
                    onClick={() => setShowCreator(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all text-white"
                 >
                    <Plus size={16} /> Create Custom Lab
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {/* Circuit Builder Entrance */}
                 {activeCategory === 'circuits' && (
                   <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-full mb-12"
                   >
                     <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 to-zinc-900 border border-indigo-500/30 rounded-[3rem] p-12 shadow-2xl group">
                       <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Cpu size={200} />
                       </div>
                       <div className="relative z-10 max-w-2xl">
                         <div className="flex items-center gap-4 mb-6">
                           <div className="px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/40">
                             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Professional Suite</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Activity size={14} className="text-emerald-500" />
                             <span className="text-[10px] font-bold text-emerald-500/70 uppercase">Real-time Nodal Simulation</span>
                           </div>
                         </div>
                         <h2 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">Advanced <span className="text-indigo-500">Circuit</span> Lab</h2>
                         <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-10">
                           Build complex electronic systems with standard components on a 3D digital breadboard. Features live voltage/current readings and precise snapping logic.
                         </p>
                         <button 
                          onClick={() => setIsCircuitBuilderOpen(true)}
                          className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/30 active:scale-95 flex items-center gap-4"
                         >
                           Launch Workbench <ChevronRight size={20} />
                         </button>
                       </div>
                     </div>
                   </motion.div>
                 )}

                 {experiments.map((exp, i) => (
                   <motion.div
                     key={exp.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     onClick={() => { setCurrentExperiment(exp.id); setShowExperimentBriefing(true); }}
                     className="group cursor-pointer"
                   >
                     <div className="relative h-full bg-zinc-900/50 border border-white/5 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Activity size={120} />
                        </div>
                        
                        <div className="flex justify-between items-start mb-6">
                           <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${
                             exp.difficulty === 'Beginner' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                           }`}>
                             {exp.difficulty}
                           </span>
                           <span className="text-[10px] text-zinc-500 font-mono italic">{exp.estimatedTime}</span>
                        </div>

                        <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-indigo-400 transition-colors">{exp.title}</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed mb-8 line-clamp-2">{exp.objective}</p>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                           <div className="flex items-center gap-1">
                              {[1,2,3,4].map(dot => (
                                <div key={dot} className={`w-1 h-1 rounded-full ${dot === 1 ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
                              ))}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:gap-3 transition-all">
                              Start Simulation <ChevronRight size={12} />
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      ) : (
        /* Active Lab Simulation */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Toolbox */}
          <LabToolbox />

          {/* Center Panel: 3D Workspace */}
          <div className="flex-1 relative flex flex-col bg-zinc-950">
             {/* 3D Scene Controls & Stats */}
             <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 pointer-events-none">

             </div>

             <div className="absolute top-6 right-6 z-10 flex gap-2 pointer-events-auto">
                <button onClick={resetLab} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-zinc-400 transition-all" title="Reset Simulation">
                   <RotateCcw size={18} />
                </button>
             </div>

             {/* The 3D Engine */}
             <div className="flex-1 relative">
                <LabWorkspace />
             </div>

             {/* Bottom Panel: Readings & Data */}
             <LabReadings />
          </div>

          {/* Right Panel: AI Tutor & Guide */}
          <LabTutor />

          {/* Setup Modal Overlay (Intro) */}
          <AnimatePresence>
            {showCreator && <ExperimentDesigner onClose={() => setShowCreator(false)} />}
            {showWelcomeIntro && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[130] bg-black/90 backdrop-blur-md flex items-center justify-center p-8"
              >
                 <motion.div 
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   className="max-w-xl w-full bg-zinc-900 border border-emerald-500/30 rounded-[40px] p-10 shadow-[0_0_80px_rgba(16,185,129,0.15)] flex flex-col items-center text-center"
                 >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6">
                       <Sparkles className="text-emerald-400" size={32} />
                    </div>
                    
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-3">Welcome to Holo Lab v3.0</h2>
                    <p className="text-zinc-400 leading-relaxed mb-8">
                       An ultra-realistic, low-latency 3D simulation environment. Engage with strictly calibrated scientific equipment, design your own circuits, and record lab findings seamlessly.
                    </p>

                    <div className="w-full flex justify-between bg-zinc-950 p-6 rounded-3xl border border-white/5 mb-8 text-left">
                       <div>
                          <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Navigation</div>
                          <div className="text-xs text-white">Select a department to view available practicals.</div>
                       </div>
                       <div className="w-px bg-white/10 mx-6"></div>
                       <div>
                          <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Interaction</div>
                          <div className="text-xs text-white">Drag, rotate, and interact with 3D models smoothly.</div>
                       </div>
                    </div>

                    <button 
                      onClick={() => setShowWelcomeIntro(false)}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[20px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                    >
                       Acknowledge & Proceed
                    </button>
                 </motion.div>
              </motion.div>
            )}
            {showExperimentBriefing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-8"
              >
                 <motion.div 
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   className="max-w-2xl w-full bg-zinc-900 border border-indigo-500/30 rounded-[40px] p-12 shadow-[0_0_100px_rgba(99,102,241,0.2)]"
                 >
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                             <BookOpen className="text-indigo-400" size={28} />
                          </div>
                          <div>
                             <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Lab Briefing</h2>
                             <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Prerequisites & Safety</span>
                          </div>
                       </div>
                       <div className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                          <span className="text-xs font-bold text-indigo-400">{currentExperiment.difficulty}</span>
                       </div>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-4 italic tracking-tight">{currentExperiment.title}</h3>
                    <p className="text-base text-zinc-400 leading-relaxed mb-10">{currentExperiment.objective}</p>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                       <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-2 mb-3">
                             <Wrench className="text-indigo-400" size={16} />
                             <span className="text-[10px] font-black uppercase text-zinc-500">Hardware Requirements</span>
                          </div>
                          <ul className="space-y-2">
                             {currentExperiment.apparatus.slice(0, 3).map(a => (
                               <li key={a} className="text-xs text-white/80 flex items-center gap-2 capitalize">
                                  <div className="w-1 h-1 rounded-full bg-indigo-500" /> {a.replace('_', ' ')}
                               </li>
                             ))}
                             {currentExperiment.apparatus.length > 3 && <li className="text-[10px] text-zinc-600 italic">+ {currentExperiment.apparatus.length - 3} more</li>}
                          </ul>
                       </div>
                       <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10">
                          <div className="flex items-center gap-2 mb-3">
                             <AlertTriangle className="text-red-400" size={16} />
                             <span className="text-[10px] font-black uppercase text-red-500/70">Safety Protocol</span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed italic">"{currentExperiment.safetyNote}"</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => setShowExperimentBriefing(false)}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[25px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
                    >
                       Initialize Practical Environment
                    </button>
                 </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
