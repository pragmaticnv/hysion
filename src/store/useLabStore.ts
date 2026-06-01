
import { create } from 'zustand';
import { LabState, LabExperiment, Apparatus, CircuitConnection } from '../types/lab';

export interface LabStore extends LabState {
  experiments: LabExperiment[];
  currentExperiment: LabExperiment | null;
  setCurrentExperiment: (id: string | null) => void;
  addApparatusToInventory: (id: string) => void;
  placeApparatus: (apparatusId: string, position: [number, number, number]) => void;
  updateApparatus: (id: string, updates: any) => void;
  removeApparatus: (id: string) => void;
  addConnection: (connection: Omit<CircuitConnection, 'id'>) => void;
  removeConnection: (id: string) => void;
  evaluateLabState: () => void;
  nextStep: () => void;
  prevStep: () => void;
  addReading: (reading: any) => void;
  resetLab: () => void;
  addExperiment: (experiment: LabExperiment) => void;
  submitExperiment: () => void;
  precisionMode: boolean;
  setPrecisionMode: (mode: boolean) => void;
}

export const useLabStore = create<LabStore>((set, get) => ({
  currentExperimentId: null,
  currentExperiment: null,
  experiments: [],
  placedApparatus: [],
  connections: [],
  inventory: [],
  currentStepIndex: 0,
  readings: [],
  score: 0,
  isCompleted: false,
  stepPassed: false,
  precisionMode: false,

  setPrecisionMode: (mode) => set({ precisionMode: mode }),

  addExperiment: (experiment) => set((state) => ({
    experiments: [...state.experiments, experiment]
  })),

  setCurrentExperiment: (id) => set((state) => {
    const exp = state.experiments.find(e => e.id === id) || null;
    
    // Default inventory based on department if defined
    let inventory = [];
    if (exp?.department === 'physics') inventory = ['resistor', 'ammeter', 'voltmeter', 'battery', 'stopwatch', 'prism', 'pendulum_bob', 'support_stand', 'scale_ruler', 'ray_box', 'projection_screen', 'drawing_sheet', 'protractor', 'dynamics_cart', 'dynamics_track', 'pulley', 'hanging_mass', 'plane_mirror', 'pencil', 'measuring_cylinder', 'water_container'];
    if (exp?.department === 'chemistry') inventory = ['beaker', 'flask', 'bunsen_burner', 'burette', 'thermometer', 'test_tube', 'pipette', 'scale_ruler', 'support_stand', 'conical_flask', 'indicator', 'standard_solution', 'unknown_solution', 'reactants', 'stopwatch', 'measuring_cylinder', 'chromatography_paper', 'solvent', 'ink_sample', 'water_container', 'electrodes', 'electrolyte', 'power_supply', 'stirrer'];
    if (exp?.department === 'biology') inventory = ['microscope', 'petri_dish', 'test_tube', 'heart_model', 'measuring_cylinder', 'water_container', 'slide', 'cover_slip', 'onion_peel', 'cheek_cell', 'stain', 'potato', 'water', 'sugar_solution', 'scale', 'plant_setup', 'light_source', 'dark_chamber', 'indicator', 'blood_flow_markers', 'vessel_pathways', 'enzyme_model', 'thermometer', 'ph_control', 'reaction_chamber'];
    if (exp?.department === 'circuits') inventory = ['battery', 'led', 'motor', 'breadboard', 'resistor', 'voltmeter', 'ammeter', 'switch', 'wire_spool', 'circuit_board', 'power_supply', 'push_button', 'capacitor', 'buzzer', 'fuse', 'light_bulb', 'wires', 'board', 'bulbs', 'dc_source', 'rheostat', 'logic_gates', 'and_gate', 'or_gate', 'not_gate', 'xor_gate', 'switches', 'led_output'];
    if (exp?.department === 'math') inventory = ['protractor', 'abacus', 'scale_ruler', 'pencil', 'coordinate_grid', 'draggable_points', 'formula_panel', 'equation_editor', 'graph_board', 'sliders', 'dice', 'coin', 'spinner', 'random_generator', 'frequency_table', '3d_shapes', 'dimension_tools', 'right_triangle', 'angle_tool', 'measurement_tools', 'graph_panel'];

    return { 
      currentExperimentId: id, 
      currentExperiment: exp,
      placedApparatus: [],
      connections: [],
      inventory: inventory, // Apply default inventory
      currentStepIndex: 0,
      readings: [],
      score: 0,
      isCompleted: false,
      stepPassed: false
    };
  }),

  addApparatusToInventory: (id) => set((state) => ({
    inventory: [...state.inventory, id]
  })),

  placeApparatus: (apparatusId, position) => set((state) => {
    // Add default properties based on type for simulation
    let props: Record<string, any> = {};
    if (apparatusId === 'resistor' || apparatusId === 'rheostat') props.resistance = 100;
    if (apparatusId === 'battery' || apparatusId === 'dc_source') props.voltage = 9;
    if (apparatusId === 'ammeter') props.current = 0;
    if (apparatusId === 'voltmeter') props.voltage = 0;
    if (apparatusId === 'led' || apparatusId === 'light_bulb') { props.resistance = 10; props.active = false; }
    if (apparatusId === 'switch' || apparatusId === 'push_button') { props.closed = false; props.resistance = Infinity; }

    return {
      placedApparatus: [
        ...state.placedApparatus,
        {
          id: Math.random().toString(36).substring(2, 9),
          apparatusId,
          position,
          rotation: [0, 0, 0],
          properties: props
        }
      ]
    };
  }),

  updateApparatus: (id, updates) => set((state) => {
    const newPlaced = state.placedApparatus.map(a => a.id === id ? { ...a, properties: { ...a.properties, ...updates } } : a);
    return { placedApparatus: newPlaced };
  }),

  removeApparatus: (id) => set((state) => ({
    placedApparatus: state.placedApparatus.filter(a => a.id !== id),
    connections: state.connections.filter(c => c.fromApparatusId !== id && c.toApparatusId !== id)
  })),

  addConnection: (connection) => {
    set((state) => ({
      connections: [...state.connections, { id: Math.random().toString(36).substring(2, 9), ...connection }]
    }));
    get().evaluateLabState();
  },

  removeConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter(c => c.id !== id)
    }));
    get().evaluateLabState();
  },

  evaluateLabState: () => {
    // 1. Simulate Systems (e.g. Circuits)
    const state = get();
    const isCircuitExp = state.currentExperiment?.department === 'circuits' || state.currentExperiment?.department === 'physics';
    
    if (isCircuitExp) {
      // Basic Series Circuit Graph approximation
      let totalVoltage = 0;
      let totalResistance = 0;
      let isClosedLoop = false;
      const batteries = state.placedApparatus.filter(a => ['battery', 'dc_source', 'power_supply'].includes(a.apparatusId));
      const components = state.placedApparatus.filter(a => !['battery', 'dc_source', 'power_supply'].includes(a.apparatusId));
      
      // Graph adjacency list
      const adj: Record<string, string[]> = {};
      state.connections.forEach(c => {
         if (!adj[c.fromApparatusId]) adj[c.fromApparatusId] = [];
         if (!adj[c.toApparatusId]) adj[c.toApparatusId] = [];
         adj[c.fromApparatusId].push(c.toApparatusId);
         adj[c.toApparatusId].push(c.fromApparatusId);
      });

      // Simple graph check: does any battery have a path back to itself?
      // Since it's unstructured, we just check if every connected component has degree >= 2
      if (batteries.length > 0 && state.connections.length > 0) {
        isClosedLoop = true;
        
        // Find connected components from battery
        const visited = new Set<string>();
        const queue = [batteries[0].id];
        
        while(queue.length > 0) {
          const curr = queue.shift()!;
          if (!visited.has(curr)) {
            visited.add(curr);
            (adj[curr] || []).forEach(n => queue.push(n));
          }
        }
        
        // If there's any node in the visited set with degree < 2, the loop is broken.
        Array.from(visited).forEach(nodeId => {
          if ((adj[nodeId]?.length || 0) < 2) isClosedLoop = false;
          
          // If switch is open, it breaks the loop
          const app = state.placedApparatus.find(a => a.id === nodeId);
          if (app && ['switch', 'push_button'].includes(app.apparatusId) && app.properties.closed === false) {
             isClosedLoop = false;
          }
        });
      }

      if (isClosedLoop) {
        batteries.forEach(b => { totalVoltage += b.properties.voltage || 9; });
        components.forEach(r => { 
          totalResistance += r.properties.resistance || (
            ['resistor', 'rheostat', 'light_bulb'].includes(r.apparatusId) ? 10 : 1 // base resistance
          ); 
        });
        if (totalResistance === 0) totalResistance = 0.1; // short circuit protection
      }

      const totalCurrent = (totalResistance > 0 && isClosedLoop) ? (totalVoltage / totalResistance) : 0;

      // Update apparatus readings
      const newPlaced = state.placedApparatus.map(a => {
        let updatedProps = { ...a.properties };
        if (a.apparatusId === 'ammeter') updatedProps.current = totalCurrent;
        if (a.apparatusId === 'voltmeter') {
          updatedProps.voltage = isClosedLoop ? totalVoltage : 0;
        }
        if (a.apparatusId === 'led' || a.apparatusId === 'light_bulb' || a.apparatusId === 'led_output') {
          updatedProps.active = (totalCurrent > 0.01);
          updatedProps.glowing = (totalCurrent > 0.01);
        }
        return { ...a, properties: updatedProps };
      });
      
      set({ placedApparatus: newPlaced });
    }

    // 2. Step Validation
    const store = get();
    const exp = store.currentExperiment;
    if (!exp) return;
    const step = exp.steps[store.currentStepIndex];
    if (!step) return;

    const rules = step.validationRule;
    let stepPassed = false;
    
    // Very flexible naive validation for "all experiments make it happen"
    const hasBattery = store.placedApparatus.some(a => ['battery', 'dc_source', 'power_supply'].includes(a.apparatusId));
    const hasResistor = store.placedApparatus.some(a => ['resistor', 'rheostat'].includes(a.apparatusId));
    const hasSwitch = store.placedApparatus.some(a => ['switch', 'push_button'].includes(a.apparatusId));
    const hasAmmeter = store.placedApparatus.some(a => a.apparatusId === 'ammeter');
    const hasVoltmeter = store.placedApparatus.some(a => a.apparatusId === 'voltmeter');
    
    if (rules.includes('battery_placed') || rules.includes('track_placed') || rules.includes('stand_placed') || rules.includes('placed')) stepPassed = true;
    if (rules.includes('resistor_placed') && hasResistor) stepPassed = true;
    if (rules.includes('ammeter_series') && hasAmmeter) stepPassed = true;
    if (rules.includes('voltmeter_parallel') && hasVoltmeter) stepPassed = true;
    if (rules.includes('switch_placed') && hasSwitch) stepPassed = true;
    if (rules.includes('wired') || rules.includes('wires_connected') || rules.includes('connected')) {
      if (store.connections.length > 0) stepPassed = true;
    }
    if (rules.includes('closed') || rules.includes('circuit_closed')) {
      const sw = store.placedApparatus.find(a => a.apparatusId === 'switch' && a.properties.closed === true);
      if (sw) stepPassed = true;
    }
    if (rules.includes('observed') || rules.includes('plotted') || rules.includes('calculated') || rules.includes('recorded') || rules.includes('concluded') || rules.includes('submitted') || rules.includes('analyzed')) {
      stepPassed = true; // Auto advance read-only or manual steps for demo purposes
    }
    set({ stepPassed });
  },

  nextStep: () => set((state) => {
    if (state.stepPassed || (state.currentExperiment?.steps[state.currentStepIndex]?.validationRule === 'obs')) {
       return {
         currentStepIndex: Math.min(state.currentStepIndex + 1, (state.currentExperiment?.steps.length || 1) - 1),
         stepPassed: false
       };
    }
    return state;
  }),

  prevStep: () => set((state) => ({
    currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
  })),

  addReading: (reading) => set((state) => ({
    readings: [...state.readings, reading]
  })),

  resetLab: () => set((state) => ({
    placedApparatus: [],
    inventory: [],
    currentStepIndex: 0,
    readings: [],
    score: 0,
    isCompleted: false
  })),

  submitExperiment: () => set({ isCompleted: true })
}));
