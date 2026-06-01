import { useState, useEffect, useRef } from 'react';
import { Topic } from '../types';
import { 
  Menu, Bot, Maximize, Minimize, Bell, Hand, Volume2, VolumeX, FileText, 
  Mic, MicOff, Trophy, BookOpen, BrainCircuit, ChevronDown, Settings2,
  Monitor, GraduationCap, Info, Captions, Pencil, Calendar, PenTool, CheckSquare, FlaskConical, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { DEFAULT_THEME, WHITE_THEME } from '../constants/themes';

export function Topbar() {
  const {
    activeTopic,
    isAIPanelOpen,
    setIsAIPanelOpen,
    isGestureActive,
    setIsGestureActive,
    isVoiceActive,
    setIsVoiceActive,
    isTranscriptionOpen,
    setIsTranscriptionOpen,
    isTranscriptHistoryOpen,
    setIsTranscriptHistoryOpen,
    isAirDrawOpen,
    setIsAirDrawOpen,
    isSoundEnabled,
    setIsSoundEnabled,
    isNotesOpen,
    setIsNotesOpen,
    setIsProgressOpen,
    setIsCourseOpen,
    setIsQuizOpen,
    setIsAttendanceOpen,
    setIsTeachersDeskOpen,
    setIsSidebarOpen,
    setIsAppStarted,
    user,
    userRole,
    setIsProfileOpen,
    setUser,
    setUserRole,
    triggerSound,
    theme,
    setTheme
  } = useStore();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const toggleAIPanel = () => {
    triggerSound('toggle');
    setIsAIPanelOpen(!isAIPanelOpen);
    if (isMobile && !isAIPanelOpen) setIsSidebarOpen(false);
  };

  const toggleGesture = () => { triggerSound('toggle'); setIsGestureActive(!isGestureActive); };
  const toggleVoice = () => { triggerSound('toggle'); setIsVoiceActive(!isVoiceActive); };
  const toggleTranscription = () => { triggerSound('toggle'); setIsTranscriptionOpen(!isTranscriptionOpen); };
  const toggleTeacherVoice = () => {
    triggerSound('toggle');
    const newState = !isTranscriptionOpen;
    setIsTranscriptionOpen(newState);
    if (newState) {
      setIsTranscriptHistoryOpen(false);
      setIsTeachersDeskOpen(false);
    }
  };
  const toggleTranscriptHistory = () => { triggerSound('toggle'); setIsTranscriptHistoryOpen(!isTranscriptHistoryOpen); };
  const toggleAirDraw = () => { triggerSound('toggle'); setIsAirDrawOpen(!isAirDrawOpen); };
  const toggleSound = () => { triggerSound('toggle'); setIsSoundEnabled(!isSoundEnabled); };
  const toggleTheme = () => { triggerSound('toggle'); setTheme(theme.id === 'white' ? DEFAULT_THEME : WHITE_THEME); };
  const toggleNotes = () => { triggerSound('toggle'); setIsNotesOpen(!isNotesOpen); };
  const toggleProgress = () => { triggerSound('toggle'); useStore.getState().setIsProgressOpen(prev => !prev); };
  const toggleCourse = () => { triggerSound('toggle'); useStore.getState().setIsCourseOpen(prev => !prev); };
  const toggleQuiz = () => { triggerSound('toggle'); useStore.getState().setIsQuizOpen(prev => !prev); };
  const toggleAttendance = () => { triggerSound('toggle'); useStore.getState().setIsAttendanceOpen(prev => !prev); };
  const toggleTeachersDesk = () => { 
    triggerSound('toggle'); 
    const newState = !useStore.getState().isTeachersDeskOpen;
    setIsTeachersDeskOpen(newState);
    if (newState) {
      setIsTranscriptionOpen(false);
    }
  };
  const toggleSidebar = () => { triggerSound('toggle'); setIsSidebarOpen(prev => !prev); };
  const onExit = () => { triggerSound('click'); setIsAppStarted(false); };
  const toggleProfile = () => { triggerSound('toggle'); setIsProfileOpen(prev => !prev); };
  const toggleSubscription = () => { triggerSound('click'); useStore.getState().setIsSubscriptionOpen(true); };

  const onLogout = async () => {
    const { logOut } = await import('../services/firebaseService');
    await logOut();
    setUser(null);
    setUserRole(null);
    setIsAppStarted(false);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  const [isLearningMenuOpen, setIsLearningMenuOpen] = useState(false);
  
  const systemMenuRef = useRef<HTMLDivElement>(null);
  const learningMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (systemMenuRef.current && !systemMenuRef.current.contains(event.target as Node)) {
        setIsSystemMenuOpen(false);
      }
      if (learningMenuRef.current && !learningMenuRef.current.contains(event.target as Node)) {
        setIsLearningMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getTopicTitle = (topic: Topic) => {
    switch (topic) {
      case 'Atom': return 'Atomic Structure';
      case 'Globe': return 'Interactive Political Globe';
      case 'DNA': return 'DNA Double Helix';
      case 'SolarSystem': return 'Solar System Dynamics';
      case 'QuantumPhysics': return 'Quantum Physics';
      case 'OrganicChemistry': return 'Organic Chemistry';
      case 'CrystalLattice': return 'Crystal Lattices';
      case 'HumanHeart': return 'Human Heart Anatomy';
      case 'Microscope': return 'Optical Microscope';
      case 'Fractals': return 'Fractal Geometry';
      case 'Geometry': return 'Platonic Solids';
      case 'AncientRome': return 'Ancient Rome: Colosseum';
      case 'Pyramid': return 'Great Pyramid of Giza';
      case 'Custom': return 'AI Generated Hologram';
      case 'MillikanOilDrop': return 'Millikan Oil Drop Experiment';
      case 'FingerprintSensor': return 'Biometric Fingerprint Sensor';
      case 'AircraftAerodynamics': return 'Advanced Aerodynamics';
      case 'Plasma': return 'Plasma Physics';
      case 'Satellite': return 'Satellite System';
      case 'DysonSphere': return 'Dyson Sphere Megastructure';
      case 'Calculus': return 'Calculus Lab';
      default: return 'Module';
    }
  };

  return (
    <header className={`h-22 border-b ${theme.border} crystal-glass flex items-end pb-3 justify-between ${isMobile ? 'px-4' : 'px-8'} z-40 relative rounded-b-3xl shadow-[0_10px_50px_rgba(0,0,0,0.4)] safe-top`}>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-[scan_4s_linear_infinite] pointer-events-none" />
      
      <div className="flex items-center gap-3 sm:gap-6">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar} 
          className="p-2.5 rounded-2xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all shadow-lg"
        >
          <Menu size={18} />
        </motion.button>
        <div className="flex flex-col max-w-[120px] sm:max-w-none">
          <h2 className="text-[12px] sm:text-[14px] font-display font-bold text-white tracking-widest truncate text-glow uppercase">
            {getTopicTitle(activeTopic)}
          </h2>
          {!isMobile && isAIPanelOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mt-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)] animate-pulse"></span>
              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.3em]">AI Synthesis Active</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Exit Button */}
        {!isMobile && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass text-[10px] font-black uppercase tracking-[0.2em] transition-all text-zinc-300 hover:text-white group"
          >
            <Monitor size={14} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            <span>Terminal</span>
          </motion.button>
        )}
        
        {/* Learning Tools Dropdown */}
        <div className="relative" ref={learningMenuRef}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLearningMenuOpen(!isLearningMenuOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-xl ${
              isLearningMenuOpen 
                ? 'bg-indigo-500/20 text-white border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.3)]' 
                : 'bg-white/5 text-zinc-400 hover:text-zinc-100 border-white/5 hover:border-white/20'
            }`}
          >
            <GraduationCap size={14} className={isLearningMenuOpen ? 'text-white' : 'text-zinc-500'} />
            <span className="hidden sm:inline">Modules</span>
            <motion.div animate={{ rotate: isLearningMenuOpen ? 180 : 0 }}>
              <ChevronDown size={12} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isLearningMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute right-0 mt-4 w-64 crystal-glass rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.7)] p-3 z-50 border border-white/20"
              >
                {[
                  { icon: BookOpen, label: 'Course Material', color: 'text-blue-400', action: toggleCourse },
                  { icon: BrainCircuit, label: 'Knowledge Quiz', color: 'text-purple-400', action: toggleQuiz },
                  { icon: Calendar, label: 'Attendance', color: 'text-emerald-400', action: toggleAttendance },
                  { icon: Pencil, label: "Teacher's Desk", color: 'text-cyan-400', action: toggleTeachersDesk, role: 'teacher' },
                  { icon: FileText, label: 'Lecture Notes', color: 'text-amber-400', action: toggleNotes },
                  { icon: CheckSquare, label: 'Task Manager', color: 'text-emerald-400', action: () => useStore.getState().setIsTaskManagerOpen(curr => !curr) },
                  { icon: FlaskConical, label: 'Virtual Lab', color: 'text-pink-400', action: () => useStore.getState().setIsVirtualLabOpen(curr => !curr) },
                  { icon: Trophy, label: 'Student Progress', color: 'text-yellow-400', action: toggleProgress, border: true },
                ].map((item, i) => {
                  if (item.role && userRole !== item.role) return null;
                  return (
                    <div key={item.label}>
                      {item.border && <div className="h-px bg-white/10 my-2 mx-4" />}
                      <motion.button 
                        whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        onClick={() => { item.action(); setIsLearningMenuOpen(false); }} 
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] font-bold text-zinc-300 hover:text-white transition-all`}
                      >
                        <item.icon size={16} className={item.color} />
                        {item.label}
                      </motion.button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Controls Dropdown */}
        <div className="relative" ref={systemMenuRef}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-xl ${
              isSystemMenuOpen 
                ? 'bg-emerald-500/20 text-white border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 text-zinc-400 hover:text-zinc-100 border-white/5 hover:border-white/20'
            }`}
          >
            <Monitor size={14} className={isSystemMenuOpen ? 'text-white' : 'text-zinc-500'} />
            <span className="hidden sm:inline">Engine</span>
            <motion.div animate={{ rotate: isSystemMenuOpen ? 180 : 0 }}>
              <ChevronDown size={12} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isSystemMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute right-0 mt-4 w-64 crystal-glass rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.7)] p-3 z-50 border border-white/20"
              >
                {[
                  { id: 'gesture', icon: Hand, label: 'Gesture Mesh', active: isGestureActive, action: toggleGesture, color: 'text-emerald-400' },
                  { id: 'voice', icon: isVoiceActive ? Mic : MicOff, label: 'Voice Processor', active: isVoiceActive, action: toggleVoice, color: 'text-rose-400' },
                  { id: 'air', icon: PenTool, label: 'Air Drawing', active: isAirDrawOpen, action: toggleAirDraw, color: 'text-sky-400' },
                  { id: 'sound', icon: isSoundEnabled ? Volume2 : VolumeX, label: 'Haptic Audio', active: isSoundEnabled, action: toggleSound, color: 'text-indigo-400' },
                  { id: 'transcription', icon: Captions, label: 'Voice to Text', active: isTranscriptionOpen, action: toggleTranscription, color: 'text-cyan-400' },
                  { id: 'theme', icon: theme.id === 'white' ? Moon : Sun, label: `Switch to ${theme.id === 'white' ? 'Dark' : 'Light'}`, active: false, action: toggleTheme, color: 'text-amber-400' },
                ].map((item) => (
                  <motion.button 
                    key={item.id}
                    whileHover={{ x: 5 }}
                    onClick={item.action} 
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${item.active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={16} className={item.active ? item.color : 'text-zinc-600'} />
                      {item.label}
                    </div>
                    <div className={`w-2 h-2 rounded-full shadow-lg ${item.active ? `bg-${item.color.split('-')[1]}-400 animate-pulse` : 'bg-zinc-800'}`} />
                  </motion.button>
                ))}
                <div className="h-px bg-white/10 my-2 mx-4" />
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={toggleFullscreen} 
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  {isFullscreen ? 'Exit Flux' : 'Enter Flux'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5 px-1.5 py-1.5 liquid-glass rounded-full border border-white/10 shadow-2xl">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAIPanel}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              isAIPanelOpen 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot size={14} className={isAIPanelOpen ? 'animate-bounce' : 'text-indigo-400'} />
            <span className={isMobile ? 'hidden' : 'inline'}>Neural AI</span>
          </motion.button>
        </div>

        {!isMobile && user && (
          <div className="flex items-center gap-4 pl-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 p-1 rounded-full liquid-glass cursor-pointer border border-white/10"
              onClick={toggleProfile}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-2xl">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={onLogout}
              className="p-3 rounded-full bg-white/5 text-zinc-500 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all shadow-inner"
              title="Terminate Session"
            >
              <Monitor size={16} />
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
}
