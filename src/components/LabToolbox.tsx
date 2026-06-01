
import React from 'react';
import { motion } from 'motion/react';
import { useLabStore } from '../store/useLabStore';
import { Box, Wrench, Package } from 'lucide-react';

export function LabToolbox() {
  const { currentExperiment, inventory, addApparatusToInventory, placeApparatus } = useLabStore();

  if (!currentExperiment) return null;

  return (
    <div className="w-80 border-r border-white/5 bg-black/40 backdrop-blur-md flex flex-col overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Equipment Drawer</h4>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Required Inventory</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {currentExperiment.apparatus.map((item) => {
          const isAdded = inventory.includes(item);
          return (
            <motion.div
              key={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!isAdded) {
                  addApparatusToInventory(item);
                  placeApparatus(item, [0, 1, 0]);
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                isAdded 
                  ? 'bg-indigo-500/10 border-indigo-500/30 opacity-50 grayscale' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Package className="text-zinc-600" size={24} />
                </div>
                <div className="flex-1">
                  <h5 className="text-[11px] font-bold text-white uppercase tracking-tight capitalize">{item.replace('_', ' ')}</h5>
                  <p className="text-[9px] text-zinc-500 font-mono">Standard Grade</p>
                </div>
                {isAdded ? (
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
                    <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-indigo-500 transition-colors" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        <div className="pt-8">
           <div className="p-4 rounded-3xl bg-zinc-900 border border-white/5 italic">
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Click to add apparatus to your active inventory. Once added, you can manually place them onto the workspace to begin assembly.
              </p>
           </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/5">
         <div className="flex items-center justify-between text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-3">
            <span>Inventory Status</span>
            <span>{inventory.length} / {currentExperiment.apparatus.length}</span>
         </div>
         <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
               animate={{ width: `${(inventory.length / currentExperiment.apparatus.length) * 100}%` }}
               className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
            />
         </div>
      </div>
    </div>
  );
}
