import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Hand, RotateCw, ZoomIn, Move, RefreshCw, Info, MousePointer2, Mic, Command } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useStore } from '../store/useStore';

export function HelpModal() {
  const { isHelpOpen: isOpen, setIsHelpOpen } = useStore();
  const onClose = () => setIsHelpOpen(false);
  const gestures = [
    {
      action: 'Rotate',
      gesture: 'Open Palm',
      description: 'Show an open palm and move it to rotate the hologram 360 degrees in any direction.',
      icon: <RotateCw size={20} className="text-indigo-400" />,
      color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      cue: 'Indigo palm indicator'
    },
    {
      action: 'Pan',
      gesture: 'Wrist Movement',
      description: 'Move your wrist while holding a natural hand position to slide the hologram across the viewport.',
      icon: <Move size={20} className="text-zinc-400" />,
      color: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400',
      cue: 'Wrist tracking active'
    },
    {
      action: 'Zoom',
      gesture: 'Pinch or Two Hands',
      description: 'Pinch your thumb and index finger, or use two hands and move them apart/together to scale.',
      icon: <ZoomIn size={20} className="text-amber-400" />,
      color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      cue: 'Amber pinch points'
    },
    {
      action: 'Reset',
      gesture: 'Closed Fist',
      description: 'Make a firm fist to instantly reset the hologram to its original position and scale.',
      icon: <RefreshCw size={20} className="text-rose-400" />,
      color: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      cue: 'Rose fist detection'
    }
  ];

  const standardControls = [
    { action: 'Rotate', input: 'Left Click + Drag', icon: <RotateCw size={16} /> },
    { action: 'Pan', input: 'Right Click + Drag', icon: <Move size={16} /> },
    { action: 'Zoom', input: 'Scroll Wheel', icon: <ZoomIn size={16} /> },
  ];

  const voiceCommands = [
    { command: '"Explain this"', desc: 'Generates an AI explanation of the current topic' },
    { command: '"Zoom in / out"', desc: 'Adjusts the camera distance' },
    { command: '"Reset view"', desc: 'Returns the camera to the default position' },
    { command: '"Show [Topic]"', desc: 'Switches to a specific topic (e.g., "Show DNA")' },
    { command: '"Enable physics"', desc: 'Turns on the physics engine for supported models' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white tracking-tight">Interactive Tutorial</h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Navigation & Controls Guide</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-12">
              
              {/* Standard Navigation Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <MousePointer2 size={20} className="text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Standard 3D Navigation</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {standardControls.map((ctrl) => (
                    <div key={ctrl.action} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center text-center">
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-3">
                        {ctrl.icon}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{ctrl.action}</h4>
                      <p className="text-xs text-zinc-400">{ctrl.input}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gesture Controls Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Hand size={20} className="text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Webcam Gesture Controls</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Enable the webcam in the bottom-left corner to interact with holograms using natural hand gestures. Ensure your hand is clearly visible to the camera.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gestures.map((g) => (
                    <div key={g.action} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl border ${g.color}`}>
                          {g.icon}
                        </div>
                        <div className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                          {g.cue}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{g.action}</h4>
                      <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider mb-3">{g.gesture}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {g.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-4 items-start">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-1 shrink-0">
                    <Info size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Pro Tip: Sensitivity</h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      You can adjust the tracking sensitivity in the Gesture Overlay settings panel to match your environment and preference.
                    </p>
                  </div>
                </div>
              </section>

              {/* Voice Commands Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Mic size={20} className="text-rose-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Voice Commands</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Enable the microphone in the bottom-left corner to control the environment using your voice. Try saying these commands:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {voiceCommands.map((vc) => (
                    <div key={vc.command} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-3">
                      <Command size={16} className="text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-white mb-1">{vc.command}</p>
                        <p className="text-xs text-zinc-500">{vc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="p-6 bg-zinc-950/50 border-t border-white/5 flex justify-center shrink-0">
              <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-[0.3em]">
                Interactive Documentation &copy; 2026
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
