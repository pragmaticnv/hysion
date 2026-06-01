
export type Department = 'physics' | 'chemistry' | 'biology' | 'math' | 'circuits';

export interface Apparatus {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  description: string;
}

export interface ExperimentStep {
  id: number;
  title: string;
  instruction: string;
  hint: string;
  validationRule: string; // Describes what state defines completion
}

export interface LabExperiment {
  id: string;
  department: Department;
  title: string;
  objective: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  safetyNote: string;
  apparatus: string[]; // IDs of required apparatus
  steps: ExperimentStep[];
  vivaQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface CircuitConnection {
  id: string;
  fromApparatusId: string;
  fromTerminal: number;
  toApparatusId: string;
  toTerminal: number;
}

export interface LabState {
  currentExperimentId: string | null;
  placedApparatus: {
    id: string;
    apparatusId: string;
    position: [number, number, number];
    rotation: [number, number, number];
    properties: Record<string, any>;
  }[];
  connections: CircuitConnection[];
  inventory: string[];
  currentStepIndex: number;
  readings: Record<string, any>[];
  score: number;
  isCompleted: boolean;
  stepPassed: boolean;
}
