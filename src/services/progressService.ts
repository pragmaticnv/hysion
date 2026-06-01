import { Topic } from '../types';

export interface ModuleProgress {
  topic: string;
  isCompleted: boolean;
  quizScore?: number;
  quizTotal?: number;
  timeSpent: number; // in seconds
  lastAccessed: string; // ISO date
}

export interface StudentProgress {
  modules: Record<string, ModuleProgress>;
  totalTimeSpent: number;
  overallScore: number;
  streak: number;
  lastActive: string;
}

const STORAGE_KEY = 'holo_class_student_progress';

const INITIAL_PROGRESS: StudentProgress = {
  modules: {},
  totalTimeSpent: 0,
  overallScore: 0,
  streak: 1,
  lastActive: new Date().toISOString(),
};

export const progressService = {
  getProgress(): StudentProgress {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...INITIAL_PROGRESS };
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object') return { ...INITIAL_PROGRESS };
      
      return { 
        ...INITIAL_PROGRESS, 
        ...parsed, 
        modules: (parsed.modules && typeof parsed.modules === 'object') ? parsed.modules : {} 
      };
    } catch (e) {
      console.error('Failed to parse progress', e);
      return { ...INITIAL_PROGRESS };
    }
  },

  saveProgress(progress: StudentProgress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  },

  updateModuleProgress(topic: string, updates: Partial<ModuleProgress>) {
    const progress = this.getProgress();
    const modules = (progress.modules && typeof progress.modules === 'object') ? progress.modules : {};
    
    const currentModule = modules[topic] || {
      topic,
      isCompleted: false,
      timeSpent: 0,
      lastAccessed: new Date().toISOString(),
    };

    const updatedModule = {
      ...currentModule,
      ...updates,
      lastAccessed: new Date().toISOString(),
    };

    const updatedModules = {
      ...modules,
      [topic]: updatedModule
    };

    const updatedProgress = {
      ...progress,
      modules: updatedModules,
      lastActive: new Date().toISOString()
    };

    // Recalculate overall score
    let totalScore = 0;
    let totalPossible = 0;
    Object.values(updatedModules).forEach((m: ModuleProgress) => {
      if (m.quizScore !== undefined && m.quizTotal !== undefined) {
        totalScore += m.quizScore;
        totalPossible += m.quizTotal;
      }
    });
    updatedProgress.overallScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

    this.saveProgress(updatedProgress);
    return updatedProgress;
  },

  addTimeSpent(topic: string, seconds: number) {
    const progress = this.getProgress();
    const modules = (progress.modules && typeof progress.modules === 'object') ? progress.modules : {};
    
    const currentModule = modules[topic] || {
      topic,
      isCompleted: false,
      timeSpent: 0,
      lastAccessed: new Date().toISOString(),
    };

    const updatedModule = {
      ...currentModule,
      timeSpent: currentModule.timeSpent + seconds,
      lastAccessed: new Date().toISOString()
    };

    const updatedModules = {
      ...modules,
      [topic]: updatedModule
    };

    const updatedProgress = {
      ...progress,
      modules: updatedModules,
      totalTimeSpent: progress.totalTimeSpent + seconds
    };
    
    this.saveProgress(updatedProgress);
    return updatedProgress;
  },

  markCompleted(topic: string) {
    return this.updateModuleProgress(topic, { isCompleted: true });
  }
};
