
import React, { useState } from 'react';
import { useLabStore } from '../store/useLabStore';
import { useStore } from '../store/useStore';
import { LucideIcon, Beaker, Zap, Microscope, Boxes, FlaskConical, TestTube, Cpu, DraftingCompass, Calculator, Timer, Thermometer, Heart, Activity, ToggleLeft, Disc, Ruler, LayoutTemplate, Monitor, File, Truck, GripHorizontal, Circle, Database, Square, Edit3, Droplets, PaintBucket, Power, Wand2, RotateCcw, Link, Lightbulb, Server } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  resistor: Cpu,
  battery: Zap,
  led: Zap,
  motor: Zap,
  ammeter: Activity,
  voltmeter: Activity,
  stopwatch: Timer,
  beaker: Beaker,
  flask: FlaskConical,
  microscope: Microscope,
  bunsen_burner: TestTube,
  petri_dish: TestTube,
  prism: Beaker,
  breadboard: Cpu,
  burette: TestTube,
  protractor: DraftingCompass,
  abacus: Calculator,
  thermometer: Thermometer,
  test_tube: TestTube,
  test_tubes: TestTube,
  heart_model: Heart,
  pipette: Beaker,
  switch: ToggleLeft,
  wire_spool: Disc,
  circuit_board: LayoutTemplate,
  pendulum_bob: Circle,
  support_stand: GripHorizontal,
  scale_ruler: Ruler,
  ray_box: Database,
  projection_screen: Monitor,
  drawing_sheet: File,
  dynamics_cart: Truck,
  dynamics_track: GripHorizontal,
  pulley: Circle,
  hanging_mass: Database,
  plane_mirror: Square,
  pencil: Edit3,
  conical_flask: FlaskConical,
  indicator: Droplets,
  standard_solution: Beaker,
  unknown_solution: Beaker,
  reactants: Beaker,
  measuring_cylinder: TestTube,
  chromatography_paper: File,
  solvent: Droplets,
  ink_sample: PaintBucket,
  water_container: Database,
  electrodes: Zap,
  electrolyte: Droplets,
  power_supply: Power,
  stirrer: Wand2,
  slide: Square,
  cover_slip: Square,
  onion_peel: Circle,
  cheek_cell: Circle,
  stain: Droplets,
  potato: Circle,
  water: Droplets,
  sugar_solution: Droplets,
  scale: Ruler,
  plant_setup: TestTube,
  light_source: Zap,
  dark_chamber: Square,
  blood_flow_markers: Activity,
  vessel_pathways: Activity,
  enzyme_model: Boxes,
  ph_control: Thermometer,
  reaction_chamber: Database,
  coordinate_grid: LayoutTemplate,
  draggable_points: Circle,
  formula_panel: File,
  equation_editor: Edit3,
  graph_board: LayoutTemplate,
  sliders: GripHorizontal,
  dice: Square,
  coin: Circle,
  spinner: Circle,
  random_generator: Database,
  frequency_table: File,
  '3d_shapes': Boxes,
  dimension_tools: Ruler,
  right_triangle: DraftingCompass,
  angle_tool: DraftingCompass,
  measurement_tools: Ruler,
  graph_panel: LayoutTemplate,
  push_button: Circle,
  capacitor: Database,
  buzzer: Zap,
  fuse: RotateCcw,
  light_bulb: Lightbulb,
  wires: Link,
  board: LayoutTemplate,
  bulbs: Lightbulb,
  dc_source: Power,
  rheostat: Server,
  logic_gates: Cpu,
  and_gate: Cpu,
  or_gate: Cpu,
  not_gate: Cpu,
  xor_gate: Cpu,
  switches: ToggleLeft,
  led_output: Lightbulb
};

export function EquipmentInventoryDrawer() {
  const [isOpen, setIsOpen] = useState(true);
  const { inventory, placeApparatus } = useLabStore();
  const { isSidebarOpen, isMobile } = useStore();

  const handlePlace = (id: string) => {
    // Random position on the table for now, maybe improve this to raycast?
    placeApparatus(id, [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2]);
  };

  return (
    <div className={`fixed top-20 z-40 transition-all duration-300 ${isSidebarOpen && !isMobile ? 'left-68' : 'left-4'} ${isOpen ? 'w-72' : 'w-16'}`}>
      <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between border-b border-white/10 hover:bg-white/5"
        >
          <span className={`font-black text-[10px] uppercase tracking-widest ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Inventory</span>
          <Boxes size={16} className="text-white" />
        </button>

        {isOpen && (
          <div className="p-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {inventory.length === 0 ? (
              <p className="text-[10px] text-zinc-500 italic p-2">Empty Inventory</p>
            ) : (
              inventory.map((id, index) => {
                const Icon = icons[id] || Boxes;
                return (
                  <button 
                    key={`${id}-${index}`}
                    onClick={() => handlePlace(id)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/50 transition-all"
                  >
                    <Icon size={16} className="text-indigo-400" />
                    <span className="text-xs text-white capitalize">{id.replace('_', ' ')}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
