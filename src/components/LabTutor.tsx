
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLabStore } from '../store/useLabStore';
import { 
  GraduationCap, MessageSquare, ChevronRight, CheckCircle2, 
  HelpCircle, Lightbulb, PlayCircle, Send, Mic, Volume2
} from 'lucide-react';
import { generateExplanation } from '../services/geminiService';

export function LabTutor() {
  const { currentExperiment, currentStepIndex, nextStep, prevStep, score, stepPassed } = useLabStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showWarning, setShowWarning] = useState(false);

  // ... (inside handleNext)
  const handleNext = () => {
    if (!stepPassed && currentExperiment?.steps[currentStepIndex]?.validationRule !== 'obs') {
       setShowWarning(true);
       setTimeout(() => setShowWarning(false), 2000);
       return;
    }
    nextStep();
  }

  useEffect(() => {
    if (currentExperiment && messages.length === 0) {
      setMessages([{
        role: 'ai',
        content: `Welcome to the ${currentExperiment.department} lab. Today we're working on ${currentExperiment.title}. To start, please select the required apparatus from the toolbox on your left.`
      }]);
    }
  }, [currentExperiment]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || !currentExperiment) return;
    
    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const prompt = `You are a strict but helpful lab instructor for the experiment: "${currentExperiment.title}". 
      Current objective: ${currentExperiment.objective}. 
      The student is at step ${currentStepIndex + 1}: "${currentExperiment.steps[currentStepIndex]?.title}".
      Instructions for this step: ${currentExperiment.steps[currentStepIndex]?.instruction}.
      The student says: "${inputValue}".
      Respond as the AI Tutor. Be concise, point out mistakes if any, and give hints. Do not perform the work for them.`;
      
      const response = await generateExplanation(prompt, 'detailed', 'en');
      setMessages(prev => [...prev, { role: 'ai', content: response || "I'm having trouble processing that. Take a look at your circuit connections again." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Communication error with neural core. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!currentExperiment) return null;

  const currentStep = currentExperiment.steps[currentStepIndex];

  return (
    <div className="w-96 border-l border-white/5 bg-black/40 backdrop-blur-md flex flex-col overflow-hidden">
      {/* AI Header */}
      <div className="p-6 border-b border-white/5 bg-indigo-500/5">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <GraduationCap className="text-indigo-400" size={20} />
           </div>
           <div>
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Instructional AI</h4>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">AI Lab Instructor</h3>
           </div>
        </div>

        {/* Global Progress */}
        <div className="flex items-center gap-4">
           <div className="flex-1">
              <div className="flex items-center justify-between text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1.5">
                 <span>Experiment Progress</span>
                 <span>{Math.round(((currentStepIndex + 1) / currentExperiment.steps.length) * 100)}%</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-2">
                 <motion.div 
                    animate={{ width: `${((currentStepIndex + 1) / currentExperiment.steps.length) * 100}%` }}
                    className="h-full bg-indigo-500" 
                 />
              </div>
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded-sm bg-yellow-500/10 border border-yellow-500/20 text-[8px] font-black text-yellow-500 uppercase">First Step Badge</span>
                {score > 0 && <span className="px-1.5 py-0.5 rounded-sm bg-purple-500/10 border border-purple-500/20 text-[8px] font-black text-purple-400 uppercase">Precision Maker</span>}
              </div>
           </div>
           <div className="shrink-0 text-center bg-black/40 p-2 rounded-xl border border-white/5 shadow-inner">
              <p className="text-[8px] text-zinc-600 uppercase font-black mb-0.5">XP Points</p>
              <p className="text-xl font-mono font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                {score * 10 || 0}<span className="text-[10px] text-indigo-600 ml-0.5">XP</span>
              </p>
           </div>
        </div>
      </div>

      {/* Steps Guide */}
      <div className="flex-1 flex flex-col overflow-hidden">
         <div className="p-6 border-b border-white/5">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Step-by-Step Guide</h4>
            
            <div className="space-y-4">
               {currentExperiment.steps.map((step, idx) => {
                 const isDone = idx < currentStepIndex;
                 const isCurrent = idx === currentStepIndex;
                 return (
                   <div 
                    key={step.id} 
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent 
                        ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                        : isDone ? 'bg-emerald-500/5 border-emerald-500/20 opacity-50' : 'bg-transparent border-white/5 opacity-30 truncate'
                    }`}
                   >
                     <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border text-[10px] font-black ${
                          isCurrent ? 'bg-indigo-500 border-indigo-400 text-white' : 
                          isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                        }`}>
                           {isDone ? <CheckCircle2 size={12} /> : idx + 1}
                        </div>
                        <div>
                           <h5 className={`text-[11px] font-bold uppercase mb-1 ${isCurrent ? 'text-white' : 'text-zinc-500'}`}>{step.title}</h5>
                           {isCurrent && (
                             <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-zinc-400 leading-relaxed">
                               {step.instruction}
                             </motion.p>
                           )}
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>

            <div className="flex items-center gap-2 mt-6">
               <button onClick={prevStep} disabled={currentStepIndex === 0} className="flex-1 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all border border-white/5">
                  Previous
               </button>
               <button onClick={nextStep} disabled={currentStepIndex >= currentExperiment.steps.length - 1} className="flex-[2] py-3 bg-indigo-500/20 hover:bg-indigo-500/30 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all border border-indigo-500/30 flex items-center justify-center gap-2">
                  Validate & Next <ChevronRight size={14} />
               </button>
            </div>
         </div>

         {/* Chat Interaction */}
         <div className="flex-1 flex flex-col bg-black/20 overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500 text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none'
                    }`}>
                       {msg.content}
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none flex gap-1">
                       {[0, 1, 2].map(i => (
                         <motion.div key={i} animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} className="w-1 h-1 rounded-full bg-zinc-600" />
                       ))}
                    </div>
                 </div>
               )}
            </div>

            <div className="p-4 bg-zinc-900/50 border-t border-white/5 flex gap-2">
               <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-zinc-500 transition-colors">
                  <Mic size={18} />
               </button>
               <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for clarification or hint..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500/50 text-white placeholder:text-zinc-700"
               />
               <button onClick={handleSend} className="p-3 bg-indigo-500 hover:bg-indigo-400 rounded-2xl text-white transition-all shadow-lg active:scale-95">
                  <Send size={18} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
