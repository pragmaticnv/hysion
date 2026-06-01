import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, Play, Clock, BookOpen, Star, Sparkles, Atom, Dna, Orbit, Zap, FlaskConical, Heart, Wrench, Car, Factory, Binary, Shapes, Landmark, Library, Cpu, CircleDot, Globe, Cog, Bug, Monitor, Rocket, Wind, Mountain, Satellite, ShieldAlert, Flame, Calendar } from 'lucide-react';
import { Topic, Theme } from '../types';
import { useState } from 'react';
import { SMOOTH_SPRING } from '../constants/animations';

interface ModuleLibraryProps {
  onSelectTopic: (topic: Topic) => void;
  onClose: () => void;
  theme: Theme;
}

interface ModuleCard {
  id: Topic;
  title: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  icon: React.ReactNode;
  color: string;
  isNew?: boolean;
}

const MODULES: ModuleCard[] = [
  { id: 'HumanBody', title: 'Human Body', category: 'Anatomy', description: 'Ultra-realistic advanced full 3D human body model with nervous and cardiovascular systems.', difficulty: 'Advanced', duration: '35 min', icon: <Heart />, color: 'red', isNew: true },
  { id: 'ClassSchedule', title: 'Class Schedule', category: 'Management', description: 'Interactive editable class schedule board.', difficulty: 'Beginner', duration: '5 min', icon: <Calendar />, color: 'blue', isNew: true },
  { id: 'DysonSphere', title: 'Dyson Sphere', category: 'Engineering', description: 'Advanced megastructure for stellar energy harvesting. Explore the swarm, shell, and hub.', difficulty: 'Advanced', duration: '50 min', icon: <Orbit />, color: 'amber', isNew: true },
  { id: 'Satellite', title: 'Satellite System', category: 'Engineering', description: 'Explore orbital mechanics, communication arrays, and satellite subsystems.', difficulty: 'Advanced', duration: '35 min', icon: <Satellite />, color: 'blue', isNew: true },
  { id: 'Atom', title: 'Atomic Structure', category: 'Science', description: 'Explore the fundamental building blocks of matter.', difficulty: 'Beginner', duration: '15 min', icon: <Atom />, color: 'cyan' },
  { id: 'Globe', title: 'Interactive Globe', category: 'Geography', description: 'Advanced 3D hologram of the Earth with country labels.', difficulty: 'Beginner', duration: '20 min', icon: <Globe />, color: 'blue', isNew: true },
  { id: 'DNA', title: 'DNA Double Helix', category: 'Science', description: 'Understand the molecular structure of life.', difficulty: 'Intermediate', duration: '20 min', icon: <Dna />, color: 'indigo' },
  { id: 'SolarSystem', title: 'Solar System', category: 'Science', description: 'Journey through our local star system.', difficulty: 'Beginner', duration: '25 min', icon: <Orbit />, color: 'amber' },
  { id: 'BlackHole', title: 'Black Holes', category: 'Science', description: 'Event horizons, singularities, and spacetime curvature.', difficulty: 'Advanced', duration: '45 min', icon: <CircleDot />, color: 'purple', isNew: true },
  { id: 'QuantumPhysics', title: 'Quantum Physics', category: 'Science', description: 'Dive into wave-particle duality and superposition.', difficulty: 'Advanced', duration: '40 min', icon: <Zap />, color: 'cyan' },
  { id: 'OrganicChemistry', title: 'Organic Chemistry', category: 'Science', description: 'Study carbon-based molecules and bonds.', difficulty: 'Intermediate', duration: '30 min', icon: <FlaskConical />, color: 'pink' },
  { id: 'HumanHeart', title: 'Human Heart', category: 'Anatomy', description: 'Explore cardiac anatomy and blood flow.', difficulty: 'Intermediate', duration: '20 min', icon: <Heart />, color: 'red' },
  { id: 'Cell', title: 'Cell Biology', category: 'Biology', description: 'Organelles, membranes, and cellular processes.', difficulty: 'Intermediate', duration: '25 min', icon: <Bug />, color: 'green', isNew: true },
  { id: 'Engine', title: 'Combustion Engine', category: 'Engineering', description: 'Pistons, crankshafts, and the 4-stroke cycle.', difficulty: 'Intermediate', duration: '30 min', icon: <Cog />, color: 'zinc', isNew: true },
  { id: 'Microscope', title: 'Microscopy', category: 'Equipment', description: 'Learn the principles of optical microscopy.', difficulty: 'Beginner', duration: '15 min', icon: <Wrench />, color: 'slate' },
  { id: 'Drone', title: 'Drone', category: 'Equipment', description: 'Explore the mechanics of a quadcopter drone.', difficulty: 'Intermediate', duration: '20 min', icon: <Wrench />, color: 'slate' },
  { id: 'Fractals', title: 'Fractal Geometry', category: 'Mathematics', description: 'Explore infinite complexity and self-similarity.', difficulty: 'Advanced', duration: '30 min', icon: <Binary />, color: 'emerald' },
  { id: 'Geometry', title: 'Geometric Solids', category: 'Mathematics', description: 'Study Platonic solids and spatial geometry.', difficulty: 'Beginner', duration: '15 min', icon: <Shapes />, color: 'blue' },
  { id: 'Calculus', title: 'Calculus Lab', category: 'Mathematics', description: 'Differential and integral calculus with interactive 3D manifold visualization.', difficulty: 'Advanced', duration: '40 min', icon: <Binary />, color: 'emerald', isNew: true },
  { id: 'AncientRome', title: 'Ancient Rome', category: 'History', description: 'Explore the engineering of the Colosseum.', difficulty: 'Intermediate', duration: '25 min', icon: <Landmark />, color: 'yellow' },
  { id: 'Pyramid', title: 'Great Pyramid', category: 'History', description: 'Analyze the construction of Giza.', difficulty: 'Intermediate', duration: '20 min', icon: <Landmark />, color: 'yellow' },
  { id: 'FingerprintSensor', title: 'Fingerprint Sensor', category: 'Engineering', description: 'Interactive 3D simulation of biometric fingerprint scanning and minutiae extraction.', difficulty: 'Intermediate', duration: '25 min', icon: <Cpu />, color: 'emerald', isNew: true },
  { id: 'Display', title: 'LCD Display', category: 'Engineering', description: 'Exploded view of LCD display layers and components.', difficulty: 'Intermediate', duration: '20 min', icon: <Monitor />, color: 'blue', isNew: true },
  { id: 'AircraftAerodynamics', title: 'Advanced Aerodynamics', category: 'Engineering', description: 'Rigorous analysis of fluid dynamics, CFD, and next-gen airframes.', difficulty: 'Advanced', duration: '40 min', icon: <Rocket />, color: 'blue', isNew: true },
  { id: 'CrystalLattice', title: 'Crystal Lattice', category: 'Science', description: 'Explore atomic arrangements in crystals.', difficulty: 'Advanced', duration: '25 min', icon: <Shapes />, color: 'cyan' },
  { id: 'AnimalCell', title: 'Animal Cell', category: 'Biology', description: 'Detailed 3D structure of an animal cell.', difficulty: 'Intermediate', duration: '20 min', icon: <Bug />, color: 'green' },
  { id: 'Missile', title: 'Missile Guidance', category: 'Engineering', description: 'Aerodynamics and guidance systems of a missile.', difficulty: 'Advanced', duration: '30 min', icon: <Rocket />, color: 'red' },
  { id: 'MillikanOilDrop', title: 'Millikan Oil Drop', category: 'Physics', description: 'Classic experiment to measure electron charge.', difficulty: 'Advanced', duration: '35 min', icon: <FlaskConical />, color: 'indigo' },
  { id: 'Plasma', title: 'Plasma Physics', category: 'Physics', description: 'Magnetic confinement and plasma dynamics.', difficulty: 'Advanced', duration: '45 min', icon: <Zap />, color: 'purple' },
  { id: 'JetEngine', title: 'Turbofan Engine', category: 'Engineering', description: 'Super realistic 3D turbofan jet engine with airflow dynamics.', difficulty: 'Advanced', duration: '45 min', icon: <Cog />, color: 'slate', isNew: true },
  { id: 'JamesWebb', title: 'James Webb Telescope', category: 'Space', description: 'Detailed deployment and optics of the JWST.', difficulty: 'Advanced', duration: '40 min', icon: <Satellite />, color: 'amber', isNew: true },
  { id: 'NuclearReactor', title: 'Nuclear Reactor', category: 'Engineering', description: 'Fission process, control rods, and cooling systems.', difficulty: 'Advanced', duration: '50 min', icon: <ShieldAlert />, color: 'emerald', isNew: true },
  { id: 'MarsRover', title: 'Mars Rover', category: 'Space', description: 'Robotics, suspension, and instruments of a Mars rover.', difficulty: 'Intermediate', duration: '35 min', icon: <Car />, color: 'orange', isNew: true },
  { id: 'Tornado', title: 'Tornado Dynamics', category: 'Earth Science', description: 'Fluid dynamics and thermodynamics of a supercell tornado.', difficulty: 'Advanced', duration: '30 min', icon: <Wind />, color: 'slate', isNew: true },
  { id: 'Volcano', title: 'Volcanic Eruption', category: 'Earth Science', description: 'Magma chambers, tectonic plates, and eruption mechanics.', difficulty: 'Intermediate', duration: '25 min', icon: <Mountain />, color: 'red', isNew: true },
  { id: 'Rainforest', title: 'Tropical Rainforest', category: 'Earth Science', description: 'Explore the biodiversity and canopy layers of a rainforest.', difficulty: 'Beginner', duration: '20 min', icon: <Globe />, color: 'emerald', isNew: true },
  { id: 'Desert', title: 'Arid Desert', category: 'Earth Science', description: 'Discover the harsh climate and resilient life of a desert ecosystem.', difficulty: 'Beginner', duration: '20 min', icon: <Flame />, color: 'orange', isNew: true },
];

import { useStore } from '../store/useStore';
import { preloadedCourses } from '../data/preloadedCourses';
import * as LucideIcons from 'lucide-react';

const getLucideIcon = (name: string) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon /> : <Zap />;
};

export function ModuleLibrary() {
  const { setActiveTopic: onSelectTopic, setIsLibraryOpen, setIsClassScheduleOpen, theme, isSidebarOpen, isMobile } = useStore();
  const onClose = () => setIsLibraryOpen(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const preloadedModules: ModuleCard[] = Object.entries(preloadedCourses).map(([id, course]) => ({
    id: id as Topic,
    title: course.title,
    category: course.category || 'Science',
    description: course.intro,
    difficulty: course.difficulty || 'Intermediate',
    duration: course.duration || '30 min',
    icon: course.iconName ? getLucideIcon(course.iconName) : <Sparkles />,
    color: course.color || 'indigo',
    isNew: true
  }));

  // Merge preloaded with static modules, avoiding duplicates by ID
  const allModules = [...preloadedModules];
  MODULES.forEach(m => {
    if (!allModules.find(pm => pm.id === m.id)) {
      allModules.push(m);
    }
  });

  const categories = Array.from(new Set(allModules.map(m => m.category)));

  const filteredModules = allModules.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[80] ${theme.uiBg} backdrop-blur-md flex flex-col transition-all duration-300 safe-top safe-bottom ${isSidebarOpen && !isMobile ? 'left-64' : 'left-0'}`}
    >
      {/* Header */}
      <div className={`p-6 border-b ${theme.border} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${theme.primary}/20 border border-${theme.primary}/30 flex items-center justify-center`}>
            <Library className={`text-${theme.primary}`} size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Module Library</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Browse and select from our high-fidelity holographic modules.</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Filters & Search */}
      <div className={`px-6 py-4 border-b ${theme.border} flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${!selectedCategory ? `bg-${theme.primary} text-white shadow-md shadow-${theme.primary}/20` : 'bg-white/5 text-zinc-500 hover:text-zinc-300'}`}
          >
            All Modules
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${selectedCategory === cat ? `bg-${theme.primary} text-white shadow-md shadow-${theme.primary}/20` : 'bg-white/5 text-zinc-500 hover:text-zinc-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search modules..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-[13px] text-zinc-200 focus:outline-none focus:border-${theme.primary}/50 transition-all`}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
        <motion.div 
          layout
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredModules.map((module) => (
              <motion.div
                key={module.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 15, scale: 0.98 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: SMOOTH_SPRING }
                }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                onClick={() => {
                  if (module.id === 'ClassSchedule') {
                    setIsClassScheduleOpen(true);
                    onClose();
                  } else {
                    onSelectTopic(module.id);
                    onClose();
                  }
                }}
                whileHover={{ y: -5, transition: SMOOTH_SPRING }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer overflow-hidden"
              >
                {/* Background Glow */}
                <div className={`absolute -right-8 -top-8 w-24 h-24 bg-${module.color}-500/10 blur-2xl group-hover:bg-${module.color}-500/20 transition-all`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${module.color}-500/20 border border-${module.color}-500/30 flex items-center justify-center text-${module.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                      {module.icon}
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-widest text-${module.color}-400`}>{module.category}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{module.difficulty}</span>
                    </div>
                    <h3 className={`text-lg font-bold text-white group-hover:text-${theme.primary} transition-colors leading-tight`}>{module.title}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{module.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={10} />
                        Lessons
                      </span>
                    </div>
                    <div className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-${theme.primary} group-hover:text-white transition-all`}>
                      <Play size={12} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredModules.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Search className="text-zinc-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-300 mb-2">No modules found</h3>
            <p className="text-zinc-500 max-w-xs">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
