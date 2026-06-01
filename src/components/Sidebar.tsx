import { 
  LayoutDashboard, Calendar, Mic,
  Atom, Dna, Orbit, Settings, HelpCircle, Sparkles, Upload, Zap, FlaskConical, 
  Binary, Shapes, Landmark, Factory, Wrench, GraduationCap, Library, Heart, Activity, Car, Box, Cpu, Rocket, BookOpenText,
  Search, ChevronDown, ChevronRight, Monitor, Plus, Globe, X, Image as ImageIcon
} from 'lucide-react';
import { Topic } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { HyperVisionLogo } from './HyperVisionLogo';
import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { SMOOTH_SPRING, ULTRA_SMOOTH_SPRING } from '../constants/animations';

interface NavItem {
  id: Topic;
  label: string;
  icon: React.ReactNode;
  status?: 'Completed' | 'In Progress';
  isNew?: boolean;
}

interface NavCategory {
  label: string;
  items: NavItem[];
}

export function Sidebar() {
  const {
    activeTopic, setActiveTopic,
    setIsCourseOpen,
    setIsUploadOpen,
    setIsHelpOpen,
    setIsLibraryOpen,
    setIsSyllabusOpen,
    setIsLessonCreatorOpen,
    setIsTranscriptionOpen,
    isTranscriptionOpen,
    setIsSidebarOpen,
    progress,
    theme,
    isMobile
  } = useStore(useShallow(state => ({
    activeTopic: state.activeTopic, setActiveTopic: state.setActiveTopic,
    setIsCourseOpen: state.setIsCourseOpen,
    setIsUploadOpen: state.setIsUploadOpen,
    setIsHelpOpen: state.setIsHelpOpen,
    setIsLibraryOpen: state.setIsLibraryOpen,
    setIsSyllabusOpen: state.setIsSyllabusOpen,
    setIsLessonCreatorOpen: state.setIsLessonCreatorOpen,
    setIsTranscriptionOpen: state.setIsTranscriptionOpen,
    isTranscriptionOpen: state.isTranscriptionOpen,
    setIsSidebarOpen: state.setIsSidebarOpen,
    progress: state.progress,
    theme: state.theme,
    isMobile: state.isMobile
  })));

  const onSelectTopic = (topic: Topic) => {
    if ((topic as string) === 'Transcription') {
      setIsTranscriptionOpen(!isTranscriptionOpen);
      if (isMobile) setIsSidebarOpen(false);
      return;
    }
    setActiveTopic(topic);
    setIsCourseOpen(false);
    if (topic === 'Upload') setIsUploadOpen(true);
    if (isMobile) setIsSidebarOpen(false);
  };

  const onOpenHelp = () => setIsHelpOpen(true);
  const onOpenLibrary = () => setIsLibraryOpen(true);
  const onOpenSyllabus = () => setIsSyllabusOpen(true);
  const onOpenLessonCreator = () => setIsLessonCreatorOpen(true);
  const onClose = () => setIsSidebarOpen(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Personal': true,
    'Science & Discovery': true,
    'Engineering': true,
    'Mathematics': true,
    'History & Culture': true,
    'Geography': true,
    'Tools': true,
    'Library': true
  });

  const categories: NavCategory[] = [
    {
      label: 'Personal',
      items: [
        { id: 'Dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      label: 'Science & Discovery',
      items: [
        { id: 'Atom', label: 'Atomic Structure', icon: <Atom size={18} />, status: 'Completed' },
        { id: 'DNA', label: 'DNA Helix', icon: <Dna size={18} />, status: 'In Progress' },
        { id: 'SolarSystem', label: 'Solar System', icon: <Orbit size={18} /> },
        { id: 'QuantumPhysics', label: 'Quantum Physics', icon: <Zap size={18} />, isNew: true },
        { id: 'OrganicChemistry', label: 'Organic Chemistry', icon: <FlaskConical size={18} /> },
        { id: 'CrystalLattice', label: 'Crystal Lattice', icon: <Sparkles size={18} /> },
        { id: 'Plasma', label: 'Plasma Physics', icon: <Zap size={18} />, isNew: true },
        { id: 'HumanHeart', label: 'Human Heart', icon: <Heart size={18} />, isNew: true },
        { id: 'HumanBody', label: 'Human Body', icon: <Activity size={18} />, isNew: true },
        { id: 'AnimalCell', label: 'Animal Cell', icon: <Dna size={18} />, isNew: true },
        { id: 'Microscope', label: 'Microscope', icon: <Wrench size={18} /> },
        { id: 'Drone', label: 'Drone', icon: <Wrench size={18} /> },
        { id: 'MillikanOilDrop', label: 'Millikan Oil Drop', icon: <FlaskConical size={18} />, isNew: true },
        { id: 'Relativity', label: 'Theory of Relativity', icon: <Orbit size={18} />, isNew: true },
      ]
    },
    {
      label: 'Engineering',
      items: [
        { id: 'DysonSphere', label: 'Dyson Sphere', icon: <Orbit size={18} />, isNew: true },
        { id: 'Satellite', label: 'Satellite System', icon: <Orbit size={18} />, isNew: true },
        { id: 'FingerprintSensor', label: 'Fingerprint Sensor', icon: <Cpu size={18} />, isNew: true },
        { id: 'Missile', label: 'Missile Technology', icon: <Rocket size={18} />, isNew: true },
        { id: 'Display', label: 'LCD Display', icon: <Monitor size={18} />, isNew: true },
        { id: 'AircraftAerodynamics', label: 'Advanced Aerodynamics', icon: <Rocket size={18} />, isNew: true },
        { id: 'NuclearReactor', label: 'Nuclear Reactor', icon: <Zap size={18} />, isNew: true },
      ]
    },
    {
      label: 'Environments',
      items: [
        { id: 'Globe', label: 'Interactive Globe', icon: <Globe size={18} /> },
      ]
    },
    {
      label: 'Mathematics',
      items: [
        { id: 'Fractals', label: 'Fractal Geometry', icon: <Binary size={18} /> },
        { id: 'Geometry', label: 'Geometric Solids', icon: <Shapes size={18} /> },
        { id: 'Calculus', label: 'Calculus Lab', icon: <Binary size={18} />, isNew: true },
      ]
    },
    {
      label: 'History & Culture',
      items: [
        { id: 'AncientRome', label: 'Ancient Rome', icon: <Landmark size={18} /> },
        { id: 'Pyramid', label: 'Great Pyramid', icon: <Landmark size={18} /> },
      ]
    },
    {
      label: 'Tools',
      items: [
        { id: 'ImageTo3D', label: 'Image to 3D Model', icon: <ImageIcon size={18} />, isNew: true },
        { id: 'AIGenerator', label: 'Hologram Generator', icon: <Sparkles size={18} />, isNew: true },
        { id: 'Custom', label: 'Procedural Generator', icon: <Shapes size={18} /> },
        { id: 'Upload', label: 'Upload Model', icon: <Upload size={18} /> },
      ]
    },
    {
      label: 'Library',
      items: [
        { id: 'Saved', label: 'Saved Holograms', icon: <Library size={18} /> },
        { id: 'NCERTBooks', label: 'NCERT Books', icon: <BookOpenText size={18} />, isNew: true },
      ]
    }
  ];

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery, categories]);

  const toggleCategory = (label: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <>
      {isMobile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}
      <motion.aside 
        initial={isMobile ? { x: -280 } : { x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={isMobile ? { x: -280 } : { opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 250, restDelta: 0.001 }}
        className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 shadow-[40px_0_100px_rgba(0,0,0,0.6)]' : 'relative z-20'} w-64 crystal-glass border-r ${theme.border} flex flex-col h-full transition-colors duration-300`}
      >
        <div className={`p-6 border-b ${theme.border} space-y-6 relative ${isMobile ? 'safe-top safe-left' : ''}`}>
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }} className="flex items-center justify-start">
              <HyperVisionLogo size="sm" />
            </motion.div>
            {isMobile && (
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 border border-white/10 transition-all active:scale-90"
              >
                <X size={18} />
              </button>
            )}
          </div>

        <div className="relative group">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-all duration-300" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3 pl-10 pr-4 text-[11px] font-mono text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {['Library', 'Syllabus'].map((btn, i) => (
            <motion.button 
              key={btn}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={btn === 'Library' ? onOpenLibrary : onOpenSyllabus}
              className={`group relative flex flex-col items-center justify-center gap-1.5 p-3 liquid-glass rounded-2xl transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {btn === 'Library' ? <Library className="text-indigo-400" size={16} /> : <BookOpenText className="text-pink-400" size={16} />}
              <span className={`text-[9px] font-black ${btn === 'Library' ? 'text-indigo-400' : 'text-pink-400'} uppercase tracking-[0.1em]`}>{btn}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar scroll-smooth">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredCategories.map((category, idx) => (
            <motion.div 
              key={category.label} 
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: SMOOTH_SPRING }
              }}
              className="space-y-3 mb-7"
            >
            <button 
              onClick={() => toggleCategory(category.label)}
              className="w-full flex items-center justify-between px-2 py-1 group active:opacity-60 transition-opacity"
            >
              <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-[0.3em] group-hover:text-indigo-300 transition-all transform group-hover:translate-x-1">
                {category.label}
              </p>
              <motion.div
                animate={{ rotate: expandedCategories[category.label] ? 0 : -90 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ChevronDown size={12} className="text-zinc-600 group-hover:text-indigo-400" />
              </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
              {expandedCategories[category.label] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0, scale: 0.95 }}
                  animate={{ height: 'auto', opacity: 1, scale: 1 }}
                  exit={{ height: 0, opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="overflow-hidden space-y-1.5"
                >
                  {category.items.map((item, itemIdx) => (
                    <motion.button
                      key={item.id}
                      onClick={() => onSelectTopic(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] transition-all duration-200 relative group overflow-hidden ${
                        activeTopic === item.id || (item.id === 'Transcription' && isTranscriptionOpen)
                          ? 'text-indigo-900 dark:text-white shadow-sm dark:shadow-lg'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/10'
                      }`}
                    >
                      {(activeTopic === item.id || (item.id === 'Transcription' && isTranscriptionOpen)) && (
                        <motion.div
                          layoutId="active-nav-glow"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 dark:from-indigo-600/30 to-purple-500/10 dark:to-purple-600/30 border border-indigo-500/20 dark:border-white/20 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.1)] dark:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className={`relative z-10 transition-all duration-500 ${
                        activeTopic === item.id || (item.id === 'Transcription' && isTranscriptionOpen)
                          ? `text-indigo-600 dark:text-indigo-300 scale-125 rotate-6` 
                          : 'text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 group-hover:scale-110'
                      }`}>
                        {item.icon}
                      </span>
                      <span className={`relative z-10 font-bold tracking-normal flex-1 text-left ${(activeTopic === item.id || (item.id === 'Transcription' && isTranscriptionOpen)) ? 'dark:text-glow' : ''}`}>
                        {item.label}
                      </span>

                      {(activeTopic === item.id || (item.id === 'Transcription' && isTranscriptionOpen)) && (
                        <motion.div 
                          layoutId="active-indicator-dot"
                          className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-white shadow-[0_0_10px_rgba(79,70,229,0.5)] dark:shadow-[0_0_15px_rgba(255,255,255,1)]"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        </motion.div>
      </div>

      <div className={`p-6 border-t ${theme.border} crystal-glass space-y-3 relative rounded-t-3xl ${isMobile ? 'safe-bottom safe-left' : ''}`}>
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-200/50 dark:via-white/20 to-transparent" />
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => useStore.getState().setIsSubscriptionOpen(true)}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500/10 dark:from-indigo-600/20 to-purple-500/10 dark:to-purple-600/20 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white border border-indigo-500/20 dark:border-indigo-500/30 hover:border-indigo-500/40 dark:hover:border-indigo-500/50 transition-all shadow-[0_0_10px_rgba(99,102,241,0.05)] dark:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
        >
          <Zap size={14} className="text-indigo-600 dark:text-indigo-400" />
          Upgrade Access
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => useStore.getState().setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 border border-transparent hover:border-zinc-200/60 dark:hover:border-white/20 transition-all"
        >
          <Settings size={14} className="text-zinc-400 dark:text-zinc-500" />
          System Setup
        </motion.button>
      </div>
    </motion.aside>
    </>
  );
}
