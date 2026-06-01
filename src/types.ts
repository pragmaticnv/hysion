export type Topic = 
  | 'Dashboard' | 'Atom' | 'Globe' | 'DNA' | 'SolarSystem' | 'QuantumPhysics' | 'OrganicChemistry' | 'CrystalLattice' | 'BlackHole' // Science
  | 'HumanHeart' | 'Cell' | 'AnimalCell' | 'HumanBody' // Anatomy/Biology
  | 'Microscope' | 'Drone' // Equipment
  | 'Engine' | 'Missile' | 'Display' // Automotive/Engineering
  | 'Fractals' | 'Geometry' | 'Calculus' // Math
  | 'AncientRome' | 'Pyramid' // History
  | 'Custom' | 'Upload' | 'AIGenerator' | 'ImageTo3D' // Tools
  | 'FingerprintSensor' | 'MillikanOilDrop' | 'AircraftAerodynamics' | 'Plasma' // New Topic
  | 'JetEngine' | 'JamesWebb' | 'NuclearReactor' | 'MarsRover' | 'Tornado' | 'Volcano' // Advanced Super Realistic
  | 'Satellite' // Satellite Module
  | 'DysonSphere' // Dyson Sphere Module
  | 'Rainforest' | 'Desert' // Environments
  | 'NCERTBooks' // Books
  | 'Relativity' // Relativity Module
  | 'NeuralNetwork' | 'Virus' // Biology/AI
  | 'ClassSchedule' // Schedule
  | 'Saved' // Library
  | (string & {});

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  fullName?: string;
  photoURL?: string;
  role: 'student' | 'teacher';
  rollNo?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: any;
  idCardData?: string;
  idCardUploadedAt?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export interface Attendance {
  id?: string;
  studentUid: string;
  studentName: string;
  rollNo: string;
  date: any;
  status: 'present' | 'absent';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  dueDate?: string; // YYYY-MM-DD
}

export type ClassSchedule = Record<string, string>;

export type { Theme } from './constants/themes';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
