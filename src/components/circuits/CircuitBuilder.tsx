import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float, Stars, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Battery as BatteryIcon, Zap, RotateCcw, Plus, Trash2, Cpu, Activity, Play, Info, Layers, X, GripHorizontal, MousePointer2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Breadboard } from './Breadboard';
import { CircuitElement, ComponentType } from './types';
import { getPinPosition } from './constants';
import { Resistor, LED, Battery, Switch, Multimeter } from './ElectronicComponents';
import { Wire } from './WireGenerator';
import { CircuitSimulator } from './CircuitSimulator';

export const CircuitBuilder: React.FC = () => {
  const { isCircuitBuilderOpen, setIsCircuitBuilderOpen, theme } = useStore();
  const [elements, setElements] = useState<CircuitElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<ComponentType | null>(null);
  const [simulationResults, setSimulationResults] = useState<any>({ potentials: {}, currents: {} });
  
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [wiringStart, setWiringStart] = useState<string | null>(null);

  // Simulation Loop
  useEffect(() => {
    const simulator = new CircuitSimulator(elements);
    const results = simulator.solve();
    setSimulationResults(results);
  }, [elements]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        removeElement(selectedId);
      }
      if (e.key === 'r' && selectedId) {
        const el = elements.find(el => el.id === selectedId);
        if (el) {
          const newRot: [number, number, number] = [
            el.rotation[0],
            el.rotation[1] + Math.PI / 2,
            el.rotation[2]
          ];
          updateElement(selectedId, { rotation: newRot });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements]);

  const snapToGrid = useCallback((position: [number, number, number]) => {
    // Basic snapping to pin spacing (0.5)
    return [
      Math.round(position[0] / 0.5) * 0.5,
      position[1],
      Math.round(position[2] / 0.5) * 0.5
    ] as [number, number, number];
  }, []);

  const addElement = useCallback((type: ComponentType) => {
    const id = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement: CircuitElement = {
      id,
      type,
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      value: type === 'resistor' ? 220 : type === 'battery' ? 9 : 0,
      connections: [],
      color: type === 'led' ? '#ef4444' : undefined
    };
    setElements([...elements, newElement]);
    setSelectedId(id);
  }, [elements]);

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateElement = (id: string, updates: Partial<CircuitElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  if (!isCircuitBuilderOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* 3D Scene */}
      <div className="flex-1 bg-[#020617] relative">
        <Canvas 
          shadows
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{ powerPreference: "high-performance", antialias: false, alpha: false }}
        >
          <PerspectiveCamera makeDefault position={[0, 8, 10]} />
          <OrbitControls 
            makeDefault 
            enableDamping 
            dampingFactor={0.05}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.1}
          />
          
          <color attach="background" args={["#020617"]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="city" />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={1} />

          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <Breadboard 
              onPinHover={setHoveredPin}
              onPinClick={(pinId) => {
                if ( wiringStart && wiringStart !== pinId) {
                  const id = `wire-${Math.random().toString(36).substr(2, 9)}`;
                  setElements([...elements, {
                    id,
                    type: 'wire',
                    position: [0,0,0],
                    rotation: [0,0,0],
                    value: 0,
                    connections: [wiringStart, pinId]
                  }]);
                  setWiringStart(null);
                } else if (selectedId) {
                  // Precise placement logic
                  const el = elements.find(e => e.id === selectedId);
                  if (el) {
                    const pinPos = getPinPosition(pinId);
                    const newConns = [...el.connections, pinId].slice(-2); // Max 2 connections
                    
                    // Center the component between pins if 2 connections
                    let newPos: [number, number, number] = [pinPos[0], 0.5, pinPos[2]];
                    if (newConns.length === 2) {
                      const p1 = getPinPosition(newConns[0]);
                      const p2 = getPinPosition(newConns[1]);
                      newPos = [(p1[0] + p2[0]) / 2, 0.4, (p1[2] + p2[2]) / 2];
                    }
                    
                    updateElement(selectedId, { 
                      connections: newConns,
                      position: newPos
                    });
                  }
                }
              }}
            />
          </Float>

          {/* Render Elements */}
          {elements.map(el => {
            const commonProps = {
              element: el,
              isSelected: selectedId === el.id,
              onSelect: () => setSelectedId(el.id),
              simulationResults
            };

            if (el.type === 'wire') {
              const startPos = getPinPosition(el.connections[0]);
              const endPos = getPinPosition(el.connections[1]);
              const wireCurrent = simulationResults?.currents?.[el.id] || 0;
              return <Wire key={el.id} start={startPos} end={endPos} color="#6366f1" current={wireCurrent} />;
            }

            switch (el.type) {
              case 'resistor': return <Resistor key={el.id} {...commonProps} />;
              case 'led': return <LED key={el.id} {...commonProps} />;
              case 'battery': return <Battery key={el.id} {...commonProps} />;
              case 'switch': return <Switch key={el.id} {...commonProps} />;
              default: return null;
            }
          })}

          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.4} far={10} color="#000000" />
          
          {/* Multimeter Overlay logic */}
          <Multimeter potentials={simulationResults.potentials} currents={simulationResults.currents} hoveredPin={hoveredPin} />
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute inset-x-0 top-0 p-8 flex justify-between items-start pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 pointer-events-auto"
          >
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex items-center gap-6">
              <div className={`p-4 rounded-2xl bg-${theme.primary}/20 text-${theme.primary}`}>
                <Cpu size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic">Virtual Circuit Lab</h1>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1 opacity-60">High-Fidelity Nodal Simulation</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-black">Solver Active</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">Elements: {elements.length}</span>
              </div>
            </div>
          </motion.div>

          <button 
            onClick={() => setIsCircuitBuilderOpen(false)}
            className="pointer-events-auto p-4 bg-white/5 hover:bg-red-500/20 rounded-2xl border border-white/10 text-white transition-all group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Shortcuts / Help Tooltip */}
        <div className="absolute left-8 bottom-8 flex flex-col gap-3 pointer-events-none">
          {[
            { key: 'R', action: 'Rotate Component' },
            { key: 'DEL', action: 'Remove Selected' },
            { key: 'CLICK', action: 'Place / Select' },
            { key: 'WIRE', action: 'Click 2 pins to connect' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3"
            >
              <kbd className="px-2 py-1 bg-white/10 rounded-md text-[9px] font-mono text-indigo-400 border border-white/10">{item.key}</kbd>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.action}</span>
            </motion.div>
          ))}
        </div>

        {/* Live Pin Feedback */}
        <AnimatePresence>
          {hoveredPin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute pointer-events-none"
              style={{ left: '50%', top: '20%', transform: 'translateX(-50%)' }}
            >
              <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-[10px] font-mono text-white tracking-[0.2em] font-black flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[8px]">PIN ADDRESS</span>
                  <span>{hoveredPin}</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[8px]">POTENTIAL</span>
                  <span className="text-emerald-400">{simulationResults.potentials[hoveredPin]?.toFixed(3) || '0.000'}V</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Sidebar */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-96 bg-[#020617] border-l border-white/5 p-8 flex flex-col gap-8 shadow-[-64px_0_128px_rgba(0,0,0,0.5)] z-10"
      >
        <div className="space-y-1">
          <h2 className="text-xs font-display font-black text-zinc-500 uppercase tracking-widest">Component Deck</h2>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Drag or click to spawn</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { type: 'battery', icon: BatteryIcon, label: '9V Battery', color: 'amber' },
            { type: 'resistor', icon: Zap, label: 'Resistor', color: 'blue' },
            { type: 'led', icon: Activity, label: 'LED (RED)', color: 'red' },
            { type: 'switch', icon: GripHorizontal, label: 'Switch', color: 'zinc' },
            { type: 'wire', icon: MousePointer2, label: wiringStart ? 'Click target pin' : 'Wire Tool', color: 'indigo' },
          ].map((comp) => (
            <button
              key={comp.type}
              onClick={() => comp.type === 'wire' ? setWiringStart(hoveredPin) : addElement(comp.type as ComponentType)}
              className={`p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col items-center gap-4 ${wiringStart && comp.type === 'wire' ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''}`}
            >
              <div className={`p-4 rounded-2xl bg-${comp.color}-500/20 text-${comp.color}-400 group-hover:scale-110 transition-transform`}>
                <comp.icon size={24} />
              </div>
              <span className="text-[10px] font-display font-black text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">{comp.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-[10px] font-display font-black text-white uppercase tracking-widest">Selected Component</h3>
               {selectedId && (
                 <button onClick={() => removeElement(selectedId)} className="text-red-400 hover:text-red-300 transition-colors">
                   <Trash2 size={14} />
                 </button>
               )}
             </div>
             
             {selectedId ? (
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-mono text-xs text-white">
                     ID
                   </div>
                   <div className="text-sm font-mono text-zinc-400">{selectedId.split('-')[0]}</div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Property Adjust</label>
                   <input 
                    type="range" 
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    onChange={(e) => updateElement(selectedId, { value: parseFloat(e.target.value) })}
                   />
                 </div>
               </div>
             ) : (
               <div className="py-8 text-center text-zinc-600">
                 <Info size={32} className="mx-auto mb-4 opacity-20" />
                 <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">No component selected for inspection</p>
               </div>
             )}
          </div>

          <button 
            onClick={() => setElements([])}
            className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw size={14} />
            Total Reset
          </button>
        </div>
      </motion.div>
    </div>
  );
};
