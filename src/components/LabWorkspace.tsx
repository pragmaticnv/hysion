
import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, PerspectiveCamera, Environment, 
  ContactShadows, Float, Grid, Text, Html, 
  TransformControls, useCursor, Gltf, Stars, Box, Line
} from '@react-three/drei';
import { Physics, useBox, usePlane, useCylinder } from '@react-three/cannon';
import { useLabStore } from '../store/useLabStore';
import * as THREE from 'three';
import { 
  ResistorModel, Battery9VModel, LedHighDetail, MotorAdvanced, 
  BeakerModel, FlaskModel, MicroscopeModel, AmmeterAdvanced,
  BunsenBurnerModel, PetriDishModel, PrismModel, BreadboardModel, BuretteModel,
  ProtractorModel, AbacusModel, VoltmeterModel, StopwatchModel, 
  ThermometerModel, TestTubeModel, HeartModel, PipetteModel,
  SwitchModel, WireSpoolModel, CircuitBoardModel, PendulumBobModel,
  SupportStandModel, ScaleRulerModel, RayBoxModel, ProjectionScreenModel,
  DrawingSheetModel, DynamicsCartModel, DynamicsTrackModel, PulleyModel,
  HangingMassModel, PlaneMirrorModel, PencilModel, IndicatorBottleModel,
  SolutionBottleModel, MeasuringCylinderModel, ChromatographyPaperModel,
  InkSampleVialModel, WaterContainerModel, ElectrodesModel, PowerSupplyModel,
  GlassStirrerModel, SlideModel, CoverSlipModel, OnionPeelModel, CheekCellModel,
  PotatoModel, PlantSetupModel, LightSourceLampModel, DarkChamberModel,
  EnzymeModel, PhControlModel, ReactionChamberModel, CoordinateGridModel,
  DraggablePointModel, FormulaPanelModel, GraphBoardModel, DiceModel, CoinModel,
  SpinnerModel, ThreeDShapesModel, RightTriangleModel, AngleToolModel,
  BloodFlowMarkersModel, VesselPathwaysModel,
  PushButtonModel, CapacitorModel, BuzzerModel, FuseModel, LightBulbModel,
  RheostatModel, LogicGateModel, AndGateModel, OrGateModel, NotGateModel, XorGateModel,
  AdvancedWireModel, AdvancedDCSourceModel, RealisticModel
} from './ApparatusModels';

import { EquipmentInventoryDrawer } from './EquipmentInventoryDrawer';

// Experiment Simulations
import { OhmsLawScene } from './experiments/OhmsLawScene';
import { PendulumScene } from './experiments/PendulumScene';
import { ReactionRateScene } from './experiments/ReactionRateScene';
import { TitrationScene } from './experiments/TitrationScene';
import { CellObservationScene } from './experiments/CellObservationScene';
import { CircuitDesignerScene } from './experiments/CircuitDesignerScene';
import { ReflectionScene } from './experiments/ReflectionScene';

export function LabWorkspace() {
  const { currentExperiment, placedApparatus, connections, addConnection, removeConnection, updateApparatus, removeApparatus, precisionMode } = useLabStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wiringStart, setWiringStart] = useState<{ id: string, terminal: number, pos: THREE.Vector3 } | null>(null);

  const handleTerminalClick = (e: any, apparatusId: string, terminalIdx: number, worldPos: THREE.Vector3) => {
    e.stopPropagation();
    if (!wiringStart) {
      setWiringStart({ id: apparatusId, terminal: terminalIdx, pos: worldPos });
    } else {
      if (wiringStart.id !== apparatusId) {
        addConnection({
          fromApparatusId: wiringStart.id,
          fromTerminal: wiringStart.terminal,
          toApparatusId: apparatusId,
          toTerminal: terminalIdx
        });
      }
      setWiringStart(null);
    }
  };

  const renderWires = () => {
    return connections.map(conn => {
      const fromApp = placedApparatus.find(a => a.id === conn.fromApparatusId);
      const toApp = placedApparatus.find(a => a.id === conn.toApparatusId);
      
      if (!fromApp || !toApp) return null;
      
      const fromOffset = ApparatusConnectors[fromApp.apparatusId]?.[conn.fromTerminal];
      const toOffset = ApparatusConnectors[toApp.apparatusId]?.[conn.toTerminal];

      if (!fromOffset || !toOffset) return null;
      
      const p1 = new THREE.Vector3(...fromApp.position).add(new THREE.Vector3(...fromOffset));
      const p2 = new THREE.Vector3(...toApp.position).add(new THREE.Vector3(...toOffset));
      
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += 0.5;

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(20);

      return (
        <Line 
          key={conn.id} 
          points={points} 
          color="#ef4444" 
          lineWidth={3} 
          onClick={(e) => { e.stopPropagation(); removeConnection(conn.id); }}
        />
      );
    });
  };

  const renderExperiment = () => {
    switch (currentExperiment?.id) {
      case 'phys-ohm':
        return <OhmsLawScene />;
      case 'phys-pendulum':
        return <PendulumScene />;
      case 'phys-reflection':
        return <ReflectionScene />;
      case 'chem-rate':
        return <ReactionRateScene />;
      case 'chem-titration':
        return <TitrationScene />;
      case 'bio-cells':
        return <CellObservationScene />;
      case 'circuit-led':
      case 'circuit-parallel':
        return <CircuitDesignerScene />;
      default:
        // Generic Department Renderers
        switch (currentExperiment?.department) {
            case 'physics':
                return (
                    <group>
                        <Text position={[0, 2, -2]} fontSize={0.5} color="#60a5fa" anchorX="center">
                            PHYSICS ENGINE ACTIVE
                        </Text>
                        <Grid infiniteGrid followCamera fadeDistance={50} cellSize={1} sectionSize={2} sectionColor="#1e3a8a" sectionThickness={2} />
                    </group>
                );
            case 'chemistry':
                return (
                    <group>
                        <Text position={[0, 2, -2]} fontSize={0.5} color="#f472b6" anchorX="center">
                            CHEMISTRY ENGINE ACTIVE
                        </Text>
                        <Grid infiniteGrid followCamera fadeDistance={50} cellSize={1} sectionSize={2} sectionColor="#831843" sectionThickness={2} />
                    </group>
                );
            case 'biology':
                return (
                    <group>
                        <Text position={[0, 2, -2]} fontSize={0.5} color="#34d399" anchorX="center">
                            BIOLOGY ENGINE ACTIVE
                        </Text>
                        <Grid infiniteGrid followCamera fadeDistance={50} cellSize={1} sectionSize={2} sectionColor="#064e3b" sectionThickness={2} />
                    </group>
                );
            case 'math':
                return (
                    <group>
                        <Text position={[0, 2, -2]} fontSize={0.5} color="#fbbf24" anchorX="center">
                            MATHEMATICS ENGINE ACTIVE
                        </Text>
                        <Grid infiniteGrid followCamera fadeDistance={50} cellSize={1} sectionSize={2} sectionColor="#78350f" sectionThickness={2} />
                    </group>
                );
            case 'circuits':
                return (
                    <group>
                        <Text position={[0, 2, -2]} fontSize={0.5} color="#818cf8" anchorX="center">
                            CIRCUIT DESIGN ENGINE ACTIVE
                        </Text>
                        <Grid infiniteGrid followCamera fadeDistance={50} cellSize={1} sectionSize={2} sectionColor="#312e81" sectionThickness={2} />
                    </group>
                );
            default:
                return (
                  <group>
                     <Text position={[0, 2, 0]} fontSize={0.5} color="white">
                        EXPERIMENT CORE INITIALIZING...
                     </Text>
                     <Grid infiniteGrid followCamera fadeDistance={50} cellSize={1} sectionSize={2} sectionColor="#4338ca" sectionThickness={2} />
                  </group>
                );
        }
    }
  };

  const getTableMaterial = () => {
      switch (currentExperiment?.department) {
          case 'chemistry': return { color: "#fafafa", roughness: 0.1, metalness: 0.1 }; // Clean white tile look
          case 'biology': return { color: "#111827", roughness: 0.4, metalness: 0.1 }; // Dark sterile
          case 'math': return { color: "#000000", roughness: 0.8, metalness: 0.9 }; // Abstract void
          case 'circuits': return { color: "#075985", roughness: 0.8, metalness: 0.1 }; // ESD Mat blue
          case 'physics': default: return { color: "#111", roughness: 0.1, metalness: 0.9 }; // Default tech
      }
  };

  const tableMats = getTableMaterial();

  return (
    <div className="w-full h-full cursor-crosshair relative">
      <Canvas 
        shadows 
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ powerPreference: "high-performance", antialias: false, logarithmicDepthBuffer: false }}
      >
        <PerspectiveCamera makeDefault position={[0, 10, 20]} fov={50} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <spotLight position={[20, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} color="#4338ca" intensity={1} />
          
          {precisionMode && (
            <>
              <gridHelper args={[100, 100, 0x444444, 0x222222]} rotation={[0, 0, 0]} position={[0, 0.01, 0]} />
              <axesHelper args={[5]} />
            </>
          )}

          <Physics gravity={[0, -9.81, 0]}>
             {/* The Interactive Lab Surface */}
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial 
                   color={tableMats.color} 
                   roughness={tableMats.roughness} 
                   metalness={tableMats.metalness} 
                />
             </mesh>
             
             {/* Experiment Specific Scene Container */}
             <group>
                {renderExperiment()}
             </group>

             {/* Placed Generic Apparatus (Handled by user) */}
             {placedApparatus.map((app) => (
                <DraggableApparatus 
                   key={app.id} 
                   item={app} 
                   isSelected={selectedId === app.id}
                   onSelect={() => setSelectedId(app.id)}
                   onUpdate={(updates: any) => updateApparatus(app.id, updates)}
                   onTerminalClick={(idx: number, pos: any) => handleTerminalClick({ stopPropagation: () => {} }, app.id, idx, pos)}
                   isWiring={wiringStart?.id === app.id}
                />
             ))}

             {/* Render connectable wires */}
             {renderWires()}
          </Physics>

          <ContactShadows opacity={0.4} scale={20} blur={24} far={4.5} />
        </Suspense>
      </Canvas>

      {/* Manual Controls Overlay */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
         <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500" />
               <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Controls</span>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-1">
                  <div className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-bold text-white">Left Click</div>
                  <span className="text-[8px] text-zinc-600 uppercase">Select</span>
               </div>
               <div className="flex items-center gap-1">
                  <div className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-bold text-white">Space</div>
                  <span className="text-[8px] text-zinc-600 uppercase">Focus</span>
               </div>
               <div className="flex items-center gap-1">
                  <div className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-bold text-white">F</div>
                  <span className="text-[8px] text-zinc-600 uppercase">Fullview</span>
               </div>
            </div>
         </div>
      </div>

      <EquipmentInventoryDrawer />
    </div>
  );
}

const scale = 2.0;

export const ApparatusConnectors: Record<string, [number, number, number][]> = {
  resistor: [[-0.55 * scale, 0, 0], [0.55 * scale, 0, 0]],
  battery: [[-0.2 * scale, 0.65 * scale, 0], [0.2 * scale, 0.65 * scale, 0]],
  led: [[0, 0, 0]],
  motor: [[0, 0.6 * scale, 0]],
  beaker: [[0, 0, 0]],
  flask: [[0, 0, 0]],
  microscope: [[0, 0, 0]],
  bunsen_burner: [[0, 0, 0]],
  petri_dish: [[0, 0, 0]],
  prism: [[0, 0, 0]],
  breadboard: [[0,0,0]],
  burette: [[0,0,0]],
  protractor: [[0,0,0]],
  abacus: [[0,0,0]],
  stopwatch: [[0,0,0]],
  thermometer: [[0,0,0]],
  test_tube: [[0,0,0]],
  test_tubes: [[0,0,0]],
  heart_model: [[0,0,0]],
  pipette: [[0,0,0]],
  switch: [[-0.5 * scale, 0.1 * scale, 0], [0.5 * scale, 0.1 * scale, 0]],
  wire_spool: [[0,0,0]],
  circuit_board: [[0,0,0]],
  pendulum_bob: [[0,0,0]],
  support_stand: [[0,0,0]],
  scale_ruler: [[0,0,0]],
  ray_box: [[0,0,0]],
  projection_screen: [[0,0,0]],
  drawing_sheet: [[0,0,0]],
  dynamics_cart: [[0,0,0]],
  dynamics_track: [[0,0,0]],
  pulley: [[0,0,0]],
  hanging_mass: [[0,0,0]],
  plane_mirror: [[0,0,0]],
  pencil: [[0,0,0]],
  conical_flask: [[0,0,0]],
  indicator: [[0,0,0]],
  standard_solution: [[0,0,0]],
  unknown_solution: [[0,0,0]],
  reactants: [[0,0,0]],
  measuring_cylinder: [[0,0,0]],
  chromatography_paper: [[0,0,0]],
  solvent: [[0,0,0]],
  ink_sample: [[0,0,0]],
  water_container: [[0,0,0]],
  electrodes: [[0,0,0]],
  electrolyte: [[0,0,0]],
  power_supply: [[0,0,0]],
  stirrer: [[0,0,0]],
  slide: [[0,0,0]],
  cover_slip: [[0,0,0]],
  onion_peel: [[0,0,0]],
  cheek_cell: [[0,0,0]],
  stain: [[0,0,0]],
  potato: [[0,0,0]],
  water: [[0,0,0]],
  sugar_solution: [[0,0,0]],
  scale: [[0,0,0]],
  plant_setup: [[0,0,0]],
  light_source: [[0,0,0]],
  dark_chamber: [[0,0,0]],
  blood_flow_markers: [[0,0,0]],
  vessel_pathways: [[0,0,0]],
  enzyme_model: [[0,0,0]],
  ph_control: [[0,0,0]],
  reaction_chamber: [[0,0,0]],
  coordinate_grid: [[0,0,0]],
  draggable_points: [[0,0,0]],
  formula_panel: [[0,0,0]],
  equation_editor: [[0,0,0]],
  graph_board: [[0,0,0]],
  sliders: [[0,0,0]],
  dice: [[0,0,0]],
  coin: [[0,0,0]],
  spinner: [[0,0,0]],
  random_generator: [[0,0,0]],
  frequency_table: [[0,0,0]],
  '3d_shapes': [[0,0,0]],
  dimension_tools: [[0,0,0]],
  right_triangle: [[0,0,0]],
  angle_tool: [[0,0,0]],
  measurement_tools: [[0,0,0]],
  graph_panel: [[0,0,0]],
  push_button: [[0,0,0]],
  capacitor: [[0,0,0]],
  buzzer: [[0,0,0]],
  fuse: [[0,0,0]],
  light_bulb: [[0,0,0]],
  wires: [[0,0,0]],
  board: [[0,0,0]],
  bulbs: [[0,0,0]],
  dc_source: [[0,0,0]],
  rheostat: [[0,0,0]],
  logic_gates: [[0,0,0]],
  and_gate: [[-0.45 * scale, 0.1 * scale, 0.25 * scale], [0.45 * scale, 0.1 * scale, -0.25 * scale]],
  or_gate: [[-0.45 * scale, 0.1 * scale, 0.25 * scale], [0.45 * scale, 0.1 * scale, -0.25 * scale]],
  not_gate: [[-0.45 * scale, 0.1 * scale, 0.25 * scale], [0.45 * scale, 0.1 * scale, -0.25 * scale]],
  xor_gate: [[-0.45 * scale, 0.1 * scale, 0.25 * scale], [0.45 * scale, 0.1 * scale, -0.25 * scale]],
  switches: [[0,0,0]],
  led_output: [[0,0,0]],
  ammeter: [[0,0,0]],
  voltmeter: [[0,0,0]]
};

function ApparatusModel({ apparatusId, properties, onTerminalClick }: { apparatusId: string, properties?: Record<string, any>, onTerminalClick?: (idx: number, pos: THREE.Vector3) => void }) {
  const renderConnectors = () => {
    return (ApparatusConnectors[apparatusId] || []).map((pos, i) => (
      <mesh 
        key={i} 
        position={new THREE.Vector3(...pos)} 
        onClick={(e) => {
          e.stopPropagation();
          if (onTerminalClick) {
            onTerminalClick(i, new THREE.Vector3(...pos));
          }
        }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'crosshair'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={properties?.wiringActive ? "red" : "yellow"} transparent opacity={0.6} />
      </mesh>
    ));
  };

  const model = (() => {
    const baseModel = (() => {
      switch (apparatusId) {
        case 'resistor': return <ResistorModel />;
        case 'battery':
        case '9v_battery': return <Battery9VModel />;
        case 'led': return <LedHighDetail active={properties?.active} color="red" />;
        case 'motor': return <MotorAdvanced />;
        case 'beaker': return <BeakerModel />;
        case 'flask': return <FlaskModel />;
        case 'microscope': return <MicroscopeModel />;
        case 'bunsen_burner': return <BunsenBurnerModel active={true} />;
        case 'petri_dish': return <PetriDishModel />;
        case 'prism': return <PrismModel />;
        case 'breadboard': return <BreadboardModel />;
        case 'burette': return <BuretteModel />;
        case 'protractor': return <ProtractorModel />;
        case 'abacus': return <AbacusModel />;
        case 'stopwatch': return <StopwatchModel />;
        case 'thermometer': return <ThermometerModel />;
        case 'test_tube':
        case 'test_tubes': return <TestTubeModel />;
        case 'heart_model': return <HeartModel />;
        case 'pipette': return <PipetteModel />;
        case 'switch': return <SwitchModel closed={properties?.closed || false} />;
        case 'wire_spool': return <WireSpoolModel />;
        case 'circuit_board': return <CircuitBoardModel />;
        case 'pendulum_bob': return <PendulumBobModel />;
        case 'support_stand': return <SupportStandModel />;
        case 'scale_ruler': return <ScaleRulerModel />;
        case 'ray_box': return <RayBoxModel />;
        case 'projection_screen': return <ProjectionScreenModel />;
        case 'drawing_sheet': return <DrawingSheetModel />;
        case 'dynamics_cart': return <DynamicsCartModel />;
        case 'dynamics_track': return <DynamicsTrackModel />;
        case 'pulley': return <PulleyModel />;
        case 'hanging_mass': return <HangingMassModel />;
        case 'plane_mirror': return <PlaneMirrorModel />;
        case 'pencil': return <PencilModel />;
        case 'conical_flask': return <FlaskModel liquidColor="#10b981" />;
        case 'indicator': return <IndicatorBottleModel />;
        case 'standard_solution': return <SolutionBottleModel labelText="Standard" color="#fcd34d" />;
        case 'unknown_solution': return <SolutionBottleModel labelText="Unknown" color="#a78bfa" />;
        case 'reactants': return <SolutionBottleModel labelText="Reactants" color="#f43f5e" />;
        case 'measuring_cylinder': return <MeasuringCylinderModel />;
        case 'chromatography_paper': return <ChromatographyPaperModel />;
        case 'solvent': return <SolutionBottleModel labelText="Solvent" color="#0ea5e9" />;
        case 'ink_sample': return <InkSampleVialModel />;
        case 'water_container': return <WaterContainerModel />;
        case 'electrodes': return <ElectrodesModel />;
        case 'electrolyte': return <BeakerModel liquidColor="#6366f1" volume={500} />;
        case 'power_supply': return <PowerSupplyModel />;
        case 'stirrer': return <GlassStirrerModel />;
        case 'slide': return <SlideModel />;
        case 'cover_slip': return <CoverSlipModel />;
        case 'onion_peel': return <OnionPeelModel />;
        case 'cheek_cell': return <CheekCellModel />;
        case 'stain': return <SolutionBottleModel labelText="Stain" color="#ec4899" />;
        case 'potato': return <PotatoModel />;
        case 'water': return <SolutionBottleModel labelText="Water" color="#eff6ff" />;
        case 'sugar_solution': return <SolutionBottleModel labelText="Sugar Sol." color="#f3f4f6" />;
        case 'scale': return <ScaleRulerModel />;
        case 'plant_setup': return <PlantSetupModel />;
        case 'light_source': return <LightSourceLampModel />;
        case 'dark_chamber': return <DarkChamberModel />;
        case 'blood_flow_markers': return <BloodFlowMarkersModel />;
        case 'vessel_pathways': return <VesselPathwaysModel />;
        case 'enzyme_model': return <EnzymeModel />;
        case 'ph_control': return <PhControlModel />;
        case 'reaction_chamber': return <ReactionChamberModel />;
        case 'coordinate_grid': return <CoordinateGridModel />;
        case 'draggable_points': return <DraggablePointModel />;
        case 'formula_panel': return <FormulaPanelModel />;
        case 'equation_editor': return <FormulaPanelModel />; /* Using FormulaPanel for Equation Editor */
        case 'graph_board': return <GraphBoardModel />;
        case 'sliders': return <GraphBoardModel />; /* Using GraphBoard for sliders visual placeholder */
        case 'dice': return <DiceModel />;
        case 'coin': return <CoinModel />;
        case 'spinner': return <SpinnerModel />;
        case 'random_generator': return <DiceModel />; /* Fallback */
        case 'frequency_table': return <FormulaPanelModel />; /* Fallback */
        case '3d_shapes': return <ThreeDShapesModel />;
        case 'dimension_tools': return <AngleToolModel />; /* Fallback */
        case 'right_triangle': return <RightTriangleModel />;
        case 'angle_tool': return <AngleToolModel />;
        case 'measurement_tools': return <ScaleRulerModel />; /* Fallback */
        case 'graph_panel': return <GraphBoardModel />;
        case 'push_button': return <PushButtonModel pressed={properties?.closed || false} />;
        case 'capacitor': return <CapacitorModel />;
        case 'buzzer': return <BuzzerModel />;
        case 'fuse': return <FuseModel />;
        case 'light_bulb': return <LightBulbModel glowing={properties?.glowing || false} />;
        case 'wires': return <AdvancedWireModel />;
        case 'board': return <CircuitBoardModel />; /* Better visually as board */
        case 'bulbs': return <LightBulbModel glowing={properties?.glowing || false} />;
        case 'dc_source': return <AdvancedDCSourceModel />;
        case 'rheostat': return <RheostatModel />;
        case 'logic_gates': return <LogicGateModel />;
        case 'and_gate': return <AndGateModel />;
        case 'or_gate': return <OrGateModel />;
        case 'not_gate': return <NotGateModel />;
        case 'xor_gate': return <XorGateModel />;
        case 'switches': return <SwitchModel closed={properties?.closed || false} />;
        case 'led_output': return <LedHighDetail active={properties?.active} />;
        case 'ammeter': return <AmmeterAdvanced reading={properties?.current || 0} />;
        case 'voltmeter': return <VoltmeterModel reading={properties?.voltage || 0} />;
        default:
          return (
            <Box args={[0.8, 0.8, 0.8]}>
              <meshStandardMaterial color="#555" metalness={0.6} roughness={0.2} />
            </Box>
          );
      }
    })();

    return (
      <RealisticModel apparatusId={apparatusId}>
        {baseModel}
      </RealisticModel>
    );
  })();

  return (
    <group scale={scale}>
      {model}
      {renderConnectors()}
    </group>
  );
}


function DraggableApparatus({ item, isSelected, onSelect, onUpdate, onTerminalClick, isWiring }: any) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const { currentExperiment, precisionMode } = useLabStore();
  const isCircuit = currentExperiment?.department === 'circuits' || currentExperiment?.department === 'physics';
  useCursor(hovered);

  // ... (inside return group)
  const renderPrecisionUI = () => {
    if (!precisionMode || !isSelected || !meshRef.current) return null;
    
    return (
       <group position={[0, 1.5, 0]}>
          <Html center>
             <div className="bg-indigo-600/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-400/50 flex flex-col items-center shadow-xl min-w-[120px]">
                <div className="text-[10px] font-black text-white uppercase tracking-tighter">Coordinates</div>
                <div className="text-[9px] font-mono text-indigo-200">
                  X: {item.position[0].toFixed(2)} Y: {item.position[1].toFixed(2)} Z: {item.position[2].toFixed(2)}
                </div>
             </div>
          </Html>
       </group>
    );
  };

  // We add a double click interaction to toggle switches etc
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    if (item.apparatusId === 'switch' || item.apparatusId === 'push_button') {
      onUpdate({ properties: { ...item.properties, closed: !item.properties?.closed } });
      useLabStore.getState().evaluateLabState();
    }
  };

  const content = (
    <ApparatusModel 
      apparatusId={item.apparatusId} 
      properties={{ ...item.properties, wiringActive: isWiring }} 
      onTerminalClick={onTerminalClick} 
    />
  );

  return (
    <group 
      position={item.position} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
    >
       {isSelected && (
          <TransformControls 
            object={meshRef} 
            mode="translate"
            translationSnap={0.05} // Ultra precise 5mm snapping
            onMouseUp={() => {
              if (meshRef.current) {
                // Snap y to a consistent level for table surface if near 0
                const y = Math.abs(meshRef.current.position.y) < 0.1 ? 0 : meshRef.current.position.y;
                onUpdate({ position: [meshRef.current.position.x, y, meshRef.current.position.z] });
                useLabStore.getState().evaluateLabState();
              }
            }}
          />
       )}
       <group ref={meshRef}>
         {renderPrecisionUI()}
         {isCircuit ? content : (
           <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
             {content}
           </Float>
         )}
         <Text position={[0, 0.6, 0]} fontSize={0.15} color="white" anchorX="center" anchorY="bottom">
           {item.apparatusId.replace(/_/g, ' ')}
         </Text>
       </group>
    </group>
  );
}
