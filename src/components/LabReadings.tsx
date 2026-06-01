
import React from 'react';
import { motion } from 'motion/react';
import { useLabStore } from '../store/useLabStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, Activity, Download } from 'lucide-react';

export function LabReadings() {
  const { readings, currentExperiment } = useLabStore();

  if (!currentExperiment) return null;

  return (
    <div className="h-64 border-t border-white/5 bg-black/60 backdrop-blur-md flex overflow-hidden">
      {/* Observation Table */}
      <div className="flex-1 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Table size={14} className="text-zinc-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Observation Register</span>
           </div>
           <button className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
              Export Report <Download size={12} />
           </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           <table className="w-full text-[11px] text-zinc-400 font-mono">
              <thead className="bg-white/5 sticky top-0 z-10">
                 <tr>
                    <th className="p-3 text-left border-b border-white/5 uppercase tracking-tighter">Trial</th>
                    <th className="p-3 text-left border-b border-white/5 uppercase tracking-tighter">Value A (X)</th>
                    <th className="p-3 text-left border-b border-white/5 uppercase tracking-tighter">Value B (Y)</th>
                    <th className="p-3 text-left border-b border-white/5 uppercase tracking-tighter">Timestamp</th>
                 </tr>
              </thead>
              <tbody>
                 {readings.length > 0 ? readings.map((r, i) => (
                   <tr key={i} className="hover:bg-white/5 border-b border-white/5 transition-colors">
                      <td className="p-3">0{i + 1}</td>
                      <td className="p-3 text-white font-bold">{r.x}</td>
                      <td className="p-3 text-white font-bold">{r.y}</td>
                      <td className="p-3 text-zinc-600 text-[9px]">{new Date(r.timestamp).toLocaleTimeString()}</td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan={4} className="p-10 text-center text-zinc-700 italic font-sans uppercase tracking-[0.3em] text-[9px]">Awaiting experimental data points...</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Real-time Analysis Graph */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
           <Activity size={14} className="text-zinc-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Neural Graph Analysis</span>
        </div>
        <div className="flex-1 p-4">
           {readings.length > 1 ? (
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={readings}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                   <XAxis dataKey="x" stroke="#444" fontSize={10} tick={{ fill: '#444' }} />
                   <YAxis stroke="#444" fontSize={10} tick={{ fill: '#444' }} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '10px' }}
                   />
                   <Line type="monotone" dataKey="y" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                </LineChart>
             </ResponsiveContainer>
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="flex gap-1 items-end h-8">
                   {[4, 8, 12, 16, 20, 16, 12, 8, 4].map((h, i) => (
                     <motion.div 
                        key={i} 
                        animate={{ height: [`${h}px`, `${h + 10}px`, `${h}px`] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-zinc-800 rounded-full" 
                     />
                   ))}
                </div>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em]">Calibrating Spectrum</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
