export type ComponentType = 'resistor' | 'led' | 'battery' | 'switch' | 'wire' | 'capacitor';

export interface CircuitElement {
  id: string;
  type: ComponentType;
  position: [number, number, number];
  rotation: [number, number, number];
  value: number; // Resistance, Voltage, etc.
  connections: string[]; // Pin IDs it's connected to
  color?: string;
  state?: any; // For switches (on/off) or LEDs (lit)
}

export interface BreadboardPin {
  id: string;
  x: number;
  y: number;
  connectedTo: string[]; // List of pin IDs in the same row/column strip
  occupiedBy?: string; // Element ID
}

export interface SimulationResult {
  nodes: Record<string, number>; // Potentials at each node
  currents: Record<string, number>; // Currents through each component
  errors?: string[];
}
