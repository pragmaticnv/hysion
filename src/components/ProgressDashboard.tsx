import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Clock, Target, Calendar, CheckCircle2, Circle, Star, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StudentProgress, ModuleProgress } from '../services/progressService';
import { Topic, Theme } from '../types';

interface ProgressDashboardProps {
  progress: StudentProgress;
  onClose: () => void;
  onSelectTopic: (topic: Topic) => void;
  theme: Theme;
}

import { useStore } from '../store/useStore';

export function ProgressDashboard() {
  const { progress, setIsProgressOpen, setActiveTopic: onSelectTopic, theme } = useStore();
  const onClose = () => setIsProgressOpen(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const modules = progress?.modules || {};
  const completedCount = Object.values(modules).filter(m => m.isCompleted).length;
  const totalModules = 15; // Approximate number of educational modules
  const completionRate = Math.round((completedCount / totalModules) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const getTopicTitle = (topic: string) => {
    switch (topic) {
      case 'Atom': return 'Atomic Structure';
      case 'DNA': return 'DNA Double Helix';
      case 'SolarSystem': return 'Solar System';
      case 'QuantumPhysics': return 'Quantum Physics';
      case 'OrganicChemistry': return 'Organic Chemistry';
      case 'CrystalLattice': return 'Crystal Lattices';
      case 'HumanHeart': return 'Human Heart';
      case 'Microscope': return 'Microscope';
      case 'Fractals': return 'Fractal Geometry';
      case 'Geometry': return 'Platonic Solids';
      case 'AncientRome': return 'Ancient Rome';
      case 'IndustrialRev': return 'Industrial Revolution';
      case 'Pyramid': return 'Great Pyramid';
      default: return topic;
    }
  };

  const chartData = Object.values(modules).map(m => ({
    name: getTopicTitle(m.topic),
    timeSpent: Math.round(m.timeSpent / 60), // in minutes
    score: m.quizScore !== undefined ? Math.round((m.quizScore / m.quizTotal) * 100) : 0
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`${theme.uiBg} border ${theme.border} ${isMobile ? 'rounded-none h-full' : 'rounded-[32px] max-h-[90vh]'} shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col backdrop-blur-md transition-all duration-200`}
      >
        {/* Header */}
        <div className={`${isMobile ? 'p-6' : 'p-8'} border-b ${theme.border} flex justify-between items-center bg-gradient-to-r from-${theme.primary}/10 to-transparent`}>
          <div className="flex items-center gap-4">
            <div className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} rounded-2xl bg-${theme.primary}/20 flex items-center justify-center text-${theme.primary} border border-${theme.primary}/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]`}>
              <Trophy size={isMobile ? 20 : 28} />
            </div>
            <div>
              <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-display font-bold text-white tracking-tight`}>Student Achievement</h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Academic Progress Tracking</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-full transition-all text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={`${isMobile ? 'p-6' : 'p-8'} flex-1 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent`}>
          {/* Stats Grid */}
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{completedCount}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Modules Done</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-xl bg-${theme.primary}/20 flex items-center justify-center text-${theme.primary} mb-4`}>
                <Clock size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{formatTime(progress.totalTimeSpent)}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Learning Time</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-xl bg-${theme.accent}/20 flex items-center justify-center text-${theme.accent} mb-4`}>
                <Target size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{progress.overallScore}%</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Avg. Quiz Score</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <Calendar size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{progress.streak} Days</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Learning Streak</p>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6">Module Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="timeSpent" name="Time (min)" fill={theme.primary === 'indigo-500' ? '#6366f1' : '#8b5cf6'} />
                  <Bar dataKey="score" name="Score (%)" fill={theme.accent === 'amber-400' ? '#fbbf24' : '#f472b6'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Bar Section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Overall Curriculum Completion</h3>
                <p className="text-sm text-zinc-500">You've completed {completedCount} out of {totalModules} core modules.</p>
              </div>
              <p className={`text-3xl font-bold text-${theme.primary}`}>{completionRate}%</p>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                className={`h-full bg-gradient-to-r from-${theme.primary} to-${theme.secondary} shadow-[0_0_20px_rgba(99,102,241,0.4)]`}
              />
            </div>
          </div>

          {/* Module List */}
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Star size={14} className="text-amber-400" /> Recent Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(modules).length === 0 ? (
                <div className="col-span-2 py-12 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                  <p className="text-zinc-500 italic">No activity recorded yet. Start exploring modules to track your progress!</p>
                </div>
              ) : (
                Object.values(modules)
                  .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
                  .map((module) => (
                    <div 
                      key={module.topic}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/[0.08] transition-all group cursor-pointer"
                      onClick={() => onSelectTopic(module.topic as Topic)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                          {module.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </div>
                        <div>
                          <h4 className={`font-bold text-white group-hover:text-${theme.primary} transition-colors`}>{getTopicTitle(module.topic)}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                              <Clock size={10} /> {formatTime(module.timeSpent)}
                            </span>
                            {module.quizScore !== undefined && (
                              <span className={`text-[10px] text-${theme.primary} font-bold flex items-center gap-1`}>
                                <Award size={10} /> Score: {module.quizScore}/{module.quizTotal}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Last Active</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {new Date(module.lastAccessed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/50 text-center">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
            Academic Record System • Verified Learning Path
          </p>
        </div>
      </motion.div>
    </div>
  );
}
