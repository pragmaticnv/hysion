import { CircuitElement } from './types';

/**
 * A simplified Modified Nodal Analysis (MNA) solver for DC circuits.
 * Handles: Voltage Sources (Batteries), Resistors, Switches (as low/high resistance), LEDs (as diodes).
 */
export class CircuitSimulator {
  private elements: CircuitElement[];
  private nodeMap: Map<string, number>;
  private nodeCount: number = 0;

  constructor(elements: CircuitElement[]) {
    this.elements = elements;
    this.nodeMap = new Map();
  }

  /**
   * Solve the circuit for node potentials and branch currents.
   * We approximate the solution using an iterative approach for non-linear components like LEDs.
   */
  solve() {
    // Phase 1: Identify nodes from connections
    // In a breadboard, connections are actually shared pins.
    // We'll treat every unique connection string as a node.
    this.nodeMap.clear();
    this.nodeCount = 0;

    const getParentNode = (pinId: string): string => {
      if (pinId.startsWith('VCC_T')) return 'VCC_TOP';
      if (pinId.startsWith('GND_T')) return 'GND_TOP';
      if (pinId.startsWith('VCC_B')) return 'VCC_BOTTOM';
      if (pinId.startsWith('GND_B')) return 'GND_BOTTOM';
      
      const row = pinId[0];
      const col = pinId.substring(1);
      const isTopStrip = row.charCodeAt(0) <= 'E'.charCodeAt(0);
      return `${col}_${isTopStrip ? 'TOP' : 'BOTTOM'}`;
    };

    const findNodes = () => {
      this.elements.forEach(el => {
        el.connections.forEach(conn => {
          const parentId = getParentNode(conn);
          if (!this.nodeMap.has(parentId)) {
            this.nodeMap.set(parentId, this.nodeCount++);
          }
        });
      });
    };

    findNodes();

    if (this.nodeCount === 0) return { potentials: {}, currents: {} };

    const results = {
      potentials: {} as Record<string, number>,
      currents: {} as Record<string, number>
    };

    // Initialize nodes
    this.nodeMap.forEach((idx, id) => {
      results.potentials[id] = 0;
    });

    // Helper to get potential for a pin
    const getPot = (pinId: string) => results.potentials[getParentNode(pinId)] || 0;
    const setPot = (pinId: string, val: number) => {
      const p = getParentNode(pinId);
      results.potentials[p] = val;
    };
    const updatePot = (pinId: string, diff: number) => {
      const p = getParentNode(pinId);
      results.potentials[p] += diff;
    };

    // Strategy: Simple relaxation solver for real-time performance
    const MAX_ITER = 200;
    const TOLERANCE = 0.0001;

    for (let iter = 0; iter < MAX_ITER; iter++) {
      let maxChange = 0;

      // Identify ground pins (e.g., GND_T_0) and keep them at 0
      this.nodeMap.forEach((_, id) => {
        if (id.includes('GND')) {
          results.potentials[id] = 0;
        }
      });

      this.elements.forEach(el => {
        if (el.connections.length < 2) return;

        if (el.type === 'battery') {
          const p1 = getPot(el.connections[0]);
          const p2 = getPot(el.connections[1]);
          const targetDiff = el.value;
          const currentDiff = p1 - p2;
          const error = targetDiff - currentDiff;
          
          updatePot(el.connections[0], error * 0.5);
          updatePot(el.connections[1], -error * 0.5);
          maxChange = Math.max(maxChange, Math.abs(error));
        } else if (el.type === 'resistor') {
          const v1 = getPot(el.connections[0]);
          const v2 = getPot(el.connections[1]);
          const current = (v1 - v2) / (el.value || 0.0001);
          results.currents[el.id] = current;
          const shift = (v1 - v2) * 0.05;
          updatePot(el.connections[0], -shift);
          updatePot(el.connections[1], shift);
        } else if (el.type === 'led') {
          const v1 = getPot(el.connections[0]);
          const v2 = getPot(el.connections[1]);
          const diff = v1 - v2;
          if (diff > 1.8) {
            results.currents[el.id] = (diff - 1.8) / 10;
            const shift = (diff - 1.8) * 0.1;
            updatePot(el.connections[0], -shift);
            updatePot(el.connections[1], shift);
          } else {
            results.currents[el.id] = 0;
          }
        } else if (el.type === 'wire') {
           const v1 = getPot(el.connections[0]);
           const v2 = getPot(el.connections[1]);
           const error = v1 - v2;
           results.currents[el.id] = error / 0.01; // Low resistance wire
           updatePot(el.connections[0], -error * 0.5);
           updatePot(el.connections[1], error * 0.5);
           maxChange = Math.max(maxChange, Math.abs(error));
        }
      });

      if (maxChange < TOLERANCE) break;
    }

    // Final pass: Map strip results back to all active pins for HUD consumption
    const pinPotentials: Record<string, number> = {};
    const processedStrips = new Set();
    
    this.elements.forEach(el => {
      el.connections.forEach(pin => {
        const stripId = getParentNode(pin);
        pinPotentials[pin] = results.potentials[stripId] || 0;
      });
    });

    return { potentials: pinPotentials, currents: results.currents };
  }
}
