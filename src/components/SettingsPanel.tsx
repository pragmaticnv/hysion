import React from 'react';
import { motion } from 'motion/react';
import { X, Settings, Monitor, Volume2, Globe, Sparkles, Activity, Smartphone, Palette } from 'lucide-react';
import { useStore } from '../store/useStore';
import { THEMES } from '../constants/themes';

export function SettingsPanel() {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen,
    theme,
    setTheme,
    language,
    setLanguage,
    graphicsQuality,
    setGraphicsQuality,
    isSoundEnabled,
    setIsSoundEnabled,
    showFPS,
    setShowFPS,
    hapticFeedback,
    setHapticFeedback,
    fpsLimit,
    setFpsLimit
  } = useStore();

  if (!isSettingsOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-2xl ${theme.uiBg} backdrop-blur-md border ${theme.border} rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] ${theme.text}`}
      >
        <div className={`p-5 border-b ${theme.border} flex items-center justify-between bg-black/20 shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-${theme.primary}/10 flex items-center justify-center text-${theme.primary} border border-${theme.primary}/20`}>
              <Settings size={20} />
            </div>
            <div>
              <h3 className={`text-xs font-display font-bold ${theme.text} uppercase tracking-wider`}>System Settings</h3>
              <p className={`text-[9px] ${theme.textMuted} font-bold uppercase tracking-widest mt-0.5`}>Advanced Configuration</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className={`p-2 rounded-full ${theme.textMuted} hover:${theme.text} hover:bg-white/10 transition-colors`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-10">
          
          {/* Graphics & Performance */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className={`text-[10px] font-bold ${theme.text} uppercase tracking-[0.2em] flex items-center gap-2 pr-4 bg-transparent`}>
                <Monitor size={12} className={`text-${theme.primary}`} />
                Performance Engine
              </h4>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`p-5 rounded-3xl bg-white/5 border ${theme.border} space-y-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <label className={`block text-[10px] ${theme.textMuted} font-bold uppercase tracking-wider`}>Graphics Engine</label>
                  <Sparkles size={12} className={graphicsQuality === 'ultra' ? 'text-amber-400' : 'text-zinc-600'} />
                </div>
                <div className="grid grid-cols-4 bg-black/40 rounded-xl p-1 border border-white/5">
                  {['low', 'mid', 'high', 'max'].map((q, idx) => {
                    const qualities = ['low', 'medium', 'high', 'ultra'];
                    return (
                      <button
                        key={q}
                        onClick={() => setGraphicsQuality(qualities[idx] as any)}
                        className={`py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                          graphicsQuality === qualities[idx] 
                            ? `bg-white/10 ${theme.text} shadow-lg shadow-black/20` 
                            : `${theme.textMuted} hover:bg-white/5`
                        }`}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`p-5 rounded-3xl bg-white/5 border ${theme.border} space-y-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <label className={`block text-[10px] ${theme.textMuted} font-bold uppercase tracking-wider`}>Refresh Frequency</label>
                  <Activity size={12} className={`text-${theme.accent}`} />
                </div>
                <div className="grid grid-cols-3 bg-black/40 rounded-xl p-1 border border-white/5">
                  {[60, 120, 165].map((fps) => (
                    <button
                      key={fps}
                      onClick={() => setFpsLimit(fps)}
                      className={`py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                        fpsLimit === fps 
                          ? `bg-white/10 ${theme.text} shadow-lg shadow-black/20 text-${theme.accent}` 
                          : `${theme.textMuted} hover:bg-white/5`
                      }`}
                    >
                      {fps}hz
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Interface */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className={`text-[10px] font-bold ${theme.text} uppercase tracking-[0.2em] flex items-center gap-2 pr-4 bg-transparent`}>
                <Palette size={12} className={`text-${theme.primary}`} />
                Visual Interface
              </h4>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 to-transparent" />
            </div>
            
            <div className="space-y-5">
              <div className={`p-5 rounded-3xl bg-white/5 border ${theme.border} space-y-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <label className={`block text-[10px] ${theme.textMuted} font-bold uppercase tracking-wider`}>System Atmosphere & Appearance</label>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      className={`group flex flex-col items-center gap-3 p-3 rounded-2xl border transition-all ${
                        theme.id === t.id 
                          ? `bg-white/10 border-${t.primary}/50 ring-1 ring-${t.primary}/20` 
                          : `bg-black/40 border-white/5 hover:border-white/10 hover:bg-white/5`
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-${t.primary} shadow-lg relative flex items-center justify-center overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/20" />
                        {theme.id === t.id && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />}
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-widest text-center h-4 line-clamp-1 ${theme.id === t.id ? theme.text : theme.textMuted}`}>
                        {t.id.replace('-', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <div className={`flex-1 p-5 rounded-3xl bg-white/5 border ${theme.border} space-y-4 shadow-sm`}>
                  <label className={`block text-[10px] ${theme.textMuted} font-bold uppercase tracking-wider flex items-center gap-2`}>
                    <Globe size={11} className="text-blue-400" /> Regional Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target?.value || 'en')}
                    className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium ${theme.text} focus:outline-none focus:ring-2 focus:ring-${theme.primary}/30 transition-all appearance-none cursor-pointer`}
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="hi">हिन्दी</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sensory Integration */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className={`text-[10px] font-bold ${theme.text} uppercase tracking-[0.2em] flex items-center gap-2 pr-4 bg-transparent`}>
                <Volume2 size={12} className={`text-${theme.primary}`} />
                Sensory Input
              </h4>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`p-5 rounded-3xl border transition-all text-left flex items-center gap-4 ${
                  isSoundEnabled 
                    ? `bg-${theme.primary}/10 border-${theme.primary}/30 shadow-lg` 
                    : `bg-white/5 border-white/5 hover:bg-white/10`
                }`}
              >
                <div className={`p-3 rounded-2xl bg-black/40 ${isSoundEnabled ? `text-${theme.primary}` : theme.textMuted}`}>
                  <Volume2 size={16} />
                </div>
                <div>
                  <h5 className={`text-[10px] font-bold ${theme.text} uppercase tracking-wider`}>Spatial Audio</h5>
                  <p className={`text-[8px] ${theme.textMuted} mt-0.5 uppercase`}>{isSoundEnabled ? 'Active' : 'Muted'}</p>
                </div>
              </button>

              <button
                onClick={() => setHapticFeedback(!hapticFeedback)}
                className={`p-5 rounded-3xl border transition-all text-left flex items-center gap-4 ${
                  hapticFeedback 
                    ? `bg-${theme.secondary}/10 border-${theme.secondary}/30 shadow-lg` 
                    : `bg-white/5 border-white/5 hover:bg-white/10`
                }`}
              >
                <div className={`p-3 rounded-2xl bg-black/40 ${hapticFeedback ? `text-${theme.secondary}` : theme.textMuted}`}>
                  <Smartphone size={16} />
                </div>
                <div>
                  <h5 className={`text-[10px] font-bold ${theme.text} uppercase tracking-wider`}>Haptic Engine</h5>
                  <p className={`text-[8px] ${theme.textMuted} mt-0.5 uppercase`}>{hapticFeedback ? 'Active' : 'Stable'}</p>
                </div>
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
