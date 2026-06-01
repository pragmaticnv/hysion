import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Topic, User, Task, ClassSchedule } from '../types';
import { Theme, DEFAULT_THEME } from '../constants/themes';
import { AdvancedConfig } from '../models/CustomModel';
import { StudentProgress } from '../services/progressService';

interface StoreState {
  isAppStarted: boolean;
  setIsAppStarted: (val: boolean) => void;
  activeTopic: Topic;
  setActiveTopic: (topic: Topic | ((prev: Topic) => Topic)) => void;
  ncertSubject: 'physics' | 'physics12' | 'chemistry' | 'chemistry12' | 'maths' | 'maths12' | 'biology' | 'biology12' | 'cs';
  setNcertSubject: (subject: any) => void;
  ncertChapter: number | null;
  setNcertChapter: (chapter: number | null) => void;
  isAIPanelOpen: boolean;
  setIsAIPanelOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isAttendanceOpen: boolean;
  setIsAttendanceOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isGestureActive: boolean;
  setIsGestureActive: (val: boolean | ((prev: boolean) => boolean)) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (val: boolean | ((prev: boolean) => boolean)) => void;
  isTranscriptionOpen: boolean;
  setIsTranscriptionOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isTranscriptHistoryOpen: boolean;
  setIsTranscriptHistoryOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  transcript: string;
  setTranscript: (val: string) => void;
  interimTranscript: string;
  setInterimTranscript: (val: string) => void;
  latestFinalTranscript: string;
  setLatestFinalTranscript: (val: string) => void;
  isAirDrawOpen: boolean;
  setIsAirDrawOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  isNotesOpen: boolean;
  setIsNotesOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isProgressOpen: boolean;
  setIsProgressOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isCourseOpen: boolean;
  setIsCourseOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isQuizOpen: boolean;
  setIsQuizOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isTeachersDeskOpen: boolean;
  setIsTeachersDeskOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
  setIsMobile: (val: boolean | ((prev: boolean) => boolean)) => void;
  isLibraryOpen: boolean;
  setIsLibraryOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isSyllabusOpen: boolean;
  setIsSyllabusOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isLessonCreatorOpen: boolean;
  setIsLessonCreatorOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isUploadOpen: boolean;
  setIsUploadOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isLiveTutorOpen: boolean;
  setIsLiveTutorOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isARMode: boolean;
  setIsARMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleARMode: () => void;
  detailLevel: 'basic' | 'detailed' | 'expert';
  setDetailLevel: (level: 'basic' | 'detailed' | 'expert') => void;
  language: string;
  setLanguage: (lang: string) => void;
  topicExplanation: string | null;
  setTopicExplanation: (explanation: string | null) => void;
  uploadedModel: string | null;
  setUploadedModel: (url: string | null) => void;
  uploadedModelExplanation: string | null;
  setUploadedModelExplanation: (explanation: string | null) => void;
  hologramConfig: AdvancedConfig;
  setHologramConfig: (config: AdvancedConfig) => void;
  setCustomConfig: (config: AdvancedConfig) => void;
  progress: StudentProgress | null;
  setProgress: (progress: StudentProgress | null) => void;
  needsApiKey: boolean;
  setNeedsApiKey: (val: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
  userData: User | null;
  setUserData: (data: User | null) => void;
  userRole: 'student' | 'teacher' | null;
  setUserRole: (role: 'student' | 'teacher' | null) => void;
  isAuthReady: boolean;
  setIsAuthReady: (val: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isSubscriptionOpen: boolean;
  setIsSubscriptionOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isClassScheduleOpen: boolean;
  setIsClassScheduleOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isTaskManagerOpen: boolean;
  setIsTaskManagerOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isVirtualLabOpen: boolean;
  setIsVirtualLabOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isCircuitBuilderOpen: boolean;
  setIsCircuitBuilderOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  simulationCameraPosition: [number, number, number];
  setSimulationCameraPosition: (pos: [number, number, number]) => void;
  isMultiplayer: boolean;
  setIsMultiplayer: (val: boolean | ((prev: boolean) => boolean)) => void;
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  graphicsQuality: 'low' | 'medium' | 'high' | 'ultra';
  setGraphicsQuality: (quality: 'low' | 'medium' | 'high' | 'ultra') => void;
  showFPS: boolean;
  setShowFPS: (val: boolean | ((prev: boolean) => boolean)) => void;
  hapticFeedback: boolean;
  setHapticFeedback: (val: boolean | ((prev: boolean) => boolean)) => void;
  fpsLimit: number;
  setFpsLimit: (limit: number) => void;
  lastSoundTrigger: { soundType: string | null, timestamp: number };
  triggerSound: (soundType: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  classSchedule: ClassSchedule;
  setClassSchedule: (schedule: ClassSchedule) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      isAppStarted: false,
      setIsAppStarted: (val) => set({ isAppStarted: val }),
      activeTopic: 'Dashboard',
      setActiveTopic: (topic) => set((state) => ({ activeTopic: typeof topic === 'function' ? topic(state.activeTopic) : topic })),
      ncertSubject: 'physics',
      setNcertSubject: (subject) => set({ ncertSubject: subject }),
      ncertChapter: null,
      setNcertChapter: (chapter) => set({ ncertChapter: chapter }),
      isAIPanelOpen: false,
      setIsAIPanelOpen: (val) => set((state) => ({ isAIPanelOpen: typeof val === 'function' ? val(state.isAIPanelOpen) : val })),
      isAttendanceOpen: false,
      setIsAttendanceOpen: (val) => set((state) => ({ isAttendanceOpen: typeof val === 'function' ? val(state.isAttendanceOpen) : val })),
      isGestureActive: false,
      setIsGestureActive: (val) => set((state) => ({ isGestureActive: typeof val === 'function' ? val(state.isGestureActive) : val })),
      isVoiceActive: false,
      setIsVoiceActive: (val) => set((state) => ({ isVoiceActive: typeof val === 'function' ? val(state.isVoiceActive) : val })),
      isTranscriptionOpen: false,
      setIsTranscriptionOpen: (val) => set((state) => ({ isTranscriptionOpen: typeof val === 'function' ? val(state.isTranscriptionOpen) : val })),
      isTranscriptHistoryOpen: false,
      setIsTranscriptHistoryOpen: (val) => set((state) => ({ isTranscriptHistoryOpen: typeof val === 'function' ? val(state.isTranscriptHistoryOpen) : val })),
      transcript: '',
      setTranscript: (val) => set({ transcript: val }),
      interimTranscript: '',
      setInterimTranscript: (val) => set({ interimTranscript: val }),
      latestFinalTranscript: '',
      setLatestFinalTranscript: (val) => set({ latestFinalTranscript: val }),
      isAirDrawOpen: false,
      setIsAirDrawOpen: (val) => set((state) => ({ isAirDrawOpen: typeof val === 'function' ? val(state.isAirDrawOpen) : val })),
      isSoundEnabled: true,
      setIsSoundEnabled: (val) => set((state) => ({ isSoundEnabled: typeof val === 'function' ? val(state.isSoundEnabled) : val })),
      isNotesOpen: false,
      setIsNotesOpen: (val) => set((state) => ({ isNotesOpen: typeof val === 'function' ? val(state.isNotesOpen) : val })),
      isProgressOpen: false,
      setIsProgressOpen: (val) => set((state) => ({ isProgressOpen: typeof val === 'function' ? val(state.isProgressOpen) : val })),
      isCourseOpen: false,
      setIsCourseOpen: (val) => set((state) => ({ isCourseOpen: typeof val === 'function' ? val(state.isCourseOpen) : val })),
      isQuizOpen: false,
      setIsQuizOpen: (val) => set((state) => ({ isQuizOpen: typeof val === 'function' ? val(state.isQuizOpen) : val })),
      isTeachersDeskOpen: false,
      setIsTeachersDeskOpen: (val) => set((state) => ({ isTeachersDeskOpen: typeof val === 'function' ? val(state.isTeachersDeskOpen) : val })),
      isProfileOpen: false,
      setIsProfileOpen: (val) => set((state) => ({ isProfileOpen: typeof val === 'function' ? val(state.isProfileOpen) : val })),
      isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 1024 : true,
      setIsSidebarOpen: (val) => set((state) => ({ isSidebarOpen: typeof val === 'function' ? val(state.isSidebarOpen) : val })),
      isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
      setIsMobile: (val) => set((state) => ({ isMobile: typeof val === 'function' ? val(state.isMobile) : val })),
      isLibraryOpen: false,
      setIsLibraryOpen: (val) => set((state) => ({ isLibraryOpen: typeof val === 'function' ? val(state.isLibraryOpen) : val })),
      isSyllabusOpen: false,
      setIsSyllabusOpen: (val) => set((state) => ({ isSyllabusOpen: typeof val === 'function' ? val(state.isSyllabusOpen) : val })),
      isLessonCreatorOpen: false,
      setIsLessonCreatorOpen: (val) => set((state) => ({ isLessonCreatorOpen: typeof val === 'function' ? val(state.isLessonCreatorOpen) : val })),
      isHelpOpen: false,
      setIsHelpOpen: (val) => set((state) => ({ isHelpOpen: typeof val === 'function' ? val(state.isHelpOpen) : val })),
      isUploadOpen: false,
      setIsUploadOpen: (val) => set((state) => ({ isUploadOpen: typeof val === 'function' ? val(state.isUploadOpen) : val })),
      isLiveTutorOpen: false,
      setIsLiveTutorOpen: (val) => set((state) => ({ isLiveTutorOpen: typeof val === 'function' ? val(state.isLiveTutorOpen) : val })),
      isARMode: false,
      setIsARMode: (val) => set((state) => ({ isARMode: typeof val === 'function' ? val(state.isARMode) : val })),
      toggleARMode: () => set((state) => ({ isARMode: !state.isARMode })),
      detailLevel: 'basic',
      setDetailLevel: (level) => set({ detailLevel: level }),
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      topicExplanation: null,
      setTopicExplanation: (explanation) => set({ topicExplanation: explanation }),
      uploadedModel: null,
      setUploadedModel: (url) => set({ uploadedModel: url }),
      uploadedModelExplanation: null,
      setUploadedModelExplanation: (explanation) => set({ uploadedModelExplanation: explanation }),
      hologramConfig: { type: 'geometric', shape: 'torus', primaryColor: '#6366f1', secondaryColor: '#ec4899', complexity: 5, animationSpeed: 1, particleCount: 1000, glowIntensity: 1, wireframe: false },
      setHologramConfig: (config) => set({ hologramConfig: config }),
      setCustomConfig: (config) => set({ hologramConfig: config }),
      progress: null,
      setProgress: (progress) => set({ progress: progress }),
      needsApiKey: false,
      setNeedsApiKey: (val) => set({ needsApiKey: val }),
      user: null,
      setUser: (user) => set({ user: user }),
      userData: null,
      setUserData: (data) => set({ userData: data }),
      userRole: null,
      setUserRole: (role) => set({ userRole: role }),
      isAuthReady: false,
      setIsAuthReady: (val) => set({ isAuthReady: val }),
      isSettingsOpen: false,
      setIsSettingsOpen: (val) => set((state) => ({ isSettingsOpen: typeof val === 'function' ? val(state.isSettingsOpen) : val })),
      isSubscriptionOpen: false,
      setIsSubscriptionOpen: (val) => set((state) => ({ isSubscriptionOpen: typeof val === 'function' ? val(state.isSubscriptionOpen) : val })),
      isClassScheduleOpen: false,
      setIsClassScheduleOpen: (val) => set((state) => ({ isClassScheduleOpen: typeof val === 'function' ? val(state.isClassScheduleOpen) : val })),
      isTaskManagerOpen: false,
      setIsTaskManagerOpen: (val) => set((state) => ({ isTaskManagerOpen: typeof val === 'function' ? val(state.isTaskManagerOpen) : val })),
      isVirtualLabOpen: false,
      setIsVirtualLabOpen: (val) => set((state) => ({ isVirtualLabOpen: typeof val === 'function' ? val(state.isVirtualLabOpen) : val })),
      isCircuitBuilderOpen: false,
      setIsCircuitBuilderOpen: (val) => set((state) => ({ isCircuitBuilderOpen: typeof val === 'function' ? val(state.isCircuitBuilderOpen) : val })),
      simulationCameraPosition: [0, 5, 11],
      setSimulationCameraPosition: (pos) => set({ simulationCameraPosition: pos }),
      isMultiplayer: false,
      setIsMultiplayer: (val) => set((state) => ({ isMultiplayer: typeof val === 'function' ? val(state.isMultiplayer) : val })),
      tasks: [],
      setTasks: (val) => set((state) => ({ tasks: typeof val === 'function' ? val(state.tasks) : val })),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, updates) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
      graphicsQuality: 'ultra',
      setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),
      showFPS: false,
      setShowFPS: (val) => set((state) => ({ showFPS: typeof val === 'function' ? val(state.showFPS) : val })),
      hapticFeedback: true,
      setHapticFeedback: (val) => set((state) => ({ hapticFeedback: typeof val === 'function' ? val(state.hapticFeedback) : val })),
      fpsLimit: 165,
      setFpsLimit: (limit) => set({ fpsLimit: limit }),
      lastSoundTrigger: { soundType: null, timestamp: 0 },
      triggerSound: (soundType) => set({ lastSoundTrigger: { soundType, timestamp: Date.now() } }),
      theme: DEFAULT_THEME,
      setTheme: (theme) => set({ theme: theme }),
      classSchedule: {},
      setClassSchedule: (schedule) => set({ classSchedule: schedule }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        classSchedule: state.classSchedule,
      }),
    }
  )
);
