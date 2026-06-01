import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebaseService';
import { preloadedCourses } from '../data/preloadedCourses';

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface VivaQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Module {
  title: string;
  desc: string;
  completed: boolean;
  objectives: string[];
  interactiveLabel: string;
  interactiveType?: 'simulation' | '3d-viewer' | 'calculator' | 'quiz-only';
  simulationId?: string;
  quiz: Quiz;
  vivaQuestions?: VivaQuestion[];
}

export interface RichSection {
  title: string;
  content: string;
  icon: string; // Store icon name as string
  color: string;
}

export interface MathSection {
  title: string;
  intro: string;
  formula: string; // Store as string (could be HTML/LaTeX)
  variables: { symbol: string; definition: string }[];
}

export interface ConclusionSection {
  title: string;
  content: string;
  highlight: string;
  highlightNote: string;
}

export interface CourseData {
  id?: string;
  title: string;
  subtitle: string;
  intro: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  iconName?: string;
  color?: string;
  sections: RichSection[];
  math?: MathSection;
  conclusion?: ConclusionSection;
  modules: Module[];
}

const COLLECTION_NAME = 'courses';

export const contentService = {
  async getAllCourses(): Promise<CourseData[]> {
    if (!db) return Object.values(preloadedCourses);
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CourseData));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      console.warn("Firestore fetch failed, using preloaded content:", error);
      return Object.values(preloadedCourses);
    }
  },

  async getCourse(id: string): Promise<CourseData | null> {
    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as CourseData;
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
        console.warn("Firebase fetch failed, falling back to preloaded content:", error);
      }
    }
    
    // Fallback to preloaded content
    return preloadedCourses[id] || null;
  },

  async saveCourse(id: string, courseData: Omit<CourseData, 'id'>): Promise<void> {
    if (!db) {
      console.warn("Firebase not configured, cannot save course.");
      return;
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    try {
      await setDoc(docRef, courseData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
    }
  },

  async deleteCourse(id: string): Promise<void> {
    if (!db) {
      console.warn("Firebase not configured, cannot delete course.");
      return;
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    }
  }
};
