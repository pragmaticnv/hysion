import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Topic, Theme, User as UserInterface } from './types';
import { DEFAULT_THEME } from './constants/themes';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Viewer3D } from './components/Viewer3D';
import { AIPanel } from './components/AIPanel';
import { CoursePanel } from './components/CoursePanel';
import { ProgressDashboard } from './components/ProgressDashboard';
import { NCERTBooksPanel } from './components/NCERTBooksPanel';
import { ModuleLibrary } from './components/ModuleLibrary';
import { SavedHologramsPanel } from './components/SavedHologramsPanel';
import { SyllabusManager } from './components/SyllabusManager';
import { LessonCreatorPanel } from './components/LessonCreatorPanel';
import { HologramGeneratorPanel } from './components/HologramGeneratorPanel';
import { AIGeneratorPanel } from './components/AIGeneratorPanel';
import { ImageTo3DPanel } from './components/ImageTo3DPanel';
import { HelpModal } from './components/HelpModal';
import { UploadPanel } from './components/UploadPanel';
import { RelativityModule } from './components/RelativityModule';
import { AerodynamicsModule } from './components/AerodynamicsModule';
import { FingerprintSensorCourse } from './components/FingerprintSensorCourse';
import { progressService, StudentProgress } from './services/progressService';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LiveTutor } from './components/LiveTutor';
import { QuizPanel } from './components/QuizPanel';
import { LectureNotesPanel } from './components/LectureNotesPanel';
import { GestureOverlay } from './components/GestureOverlay';
import { getPreloadedExplanation } from './data/preloadedExplanations';
import { generateExplanation } from './services/geminiService';
import { AmbientSound } from './components/AmbientSound';
import { InteractionSound } from './components/InteractionSound';
import { AdvancedConfig } from './models/CustomModel';
import { VoiceController } from './components/VoiceController';
import { TeacherVoiceToTextPanel } from './components/TeacherVoiceToTextPanel';
import { TranscriptPanel } from './components/TranscriptPanel';
import { LiveCaptions } from './components/LiveCaptions';
import { ClassroomSubtitles } from './components/ClassroomSubtitles';
import { TeachersDeskPanel } from './components/TeachersDeskPanel';
import { CircuitBuilder } from './components/circuits/CircuitBuilder';
import { AirDrawPanel } from './components/AirDrawPanel';
import { AttendancePanel } from './components/AttendancePanel';
import { ProfilePanel } from './components/ProfilePanel';
import { SettingsPanel } from './components/SettingsPanel';
import { SubscriptionPanel } from './components/SubscriptionPanel';
import { ClassSchedulePanel } from './components/ClassSchedulePanel';
import { TaskManagerPanel } from './components/TaskManagerPanel';
import { VirtualLabPanel } from './components/VirtualLabPanel';
import { useStore } from './store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { PANEL_TRANSITION, SMOOTH_SPRING, ULTRA_SMOOTH_SPRING } from './constants/animations';
import { auth, db, handleFirestoreError, OperationType } from './services/firebaseService';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

const SidebarMemo = React.memo(Sidebar);
const TopbarMemo = React.memo(Topbar);
const Viewer3DMemo = React.memo(Viewer3D);
const AIPanelMemo = React.memo(AIPanel);
const CoursePanelMemo = React.memo(CoursePanel);
const ProgressDashboardMemo = React.memo(ProgressDashboard);
const NCERTBooksPanelMemo = React.memo(NCERTBooksPanel);
const ModuleLibraryMemo = React.memo(ModuleLibrary);
const SavedHologramsPanelMemo = React.memo(SavedHologramsPanel);
const SyllabusManagerMemo = React.memo(SyllabusManager);
const LessonCreatorPanelMemo = React.memo(LessonCreatorPanel);
const HologramGeneratorPanelMemo = React.memo(HologramGeneratorPanel);
const AIGeneratorPanelMemo = React.memo(AIGeneratorPanel);
const ImageTo3DPanelMemo = React.memo(ImageTo3DPanel);
const HelpModalMemo = React.memo(HelpModal);
const UploadPanelMemo = React.memo(UploadPanel);
const RelativityModuleMemo = React.memo(RelativityModule);
const AerodynamicsModuleMemo = React.memo(AerodynamicsModule);
const FingerprintSensorCourseMemo = React.memo(FingerprintSensorCourse);
const LiveTutorMemo = React.memo(LiveTutor);
const QuizPanelMemo = React.memo(QuizPanel);
const LectureNotesPanelMemo = React.memo(LectureNotesPanel);
const GestureOverlayMemo = React.memo(GestureOverlay);
const VoiceControllerMemo = React.memo(VoiceController);
const TeacherVoiceToTextPanelMemo = React.memo(TeacherVoiceToTextPanel);
const TranscriptPanelMemo = React.memo(TranscriptPanel);
const LiveCaptionsMemo = React.memo(LiveCaptions);
const TeachersDeskPanelMemo = React.memo(TeachersDeskPanel);
const AirDrawPanelMemo = React.memo(AirDrawPanel);
const TaskManagerPanelMemo = React.memo(TaskManagerPanel);
const VirtualLabPanelMemo = React.memo(VirtualLabPanel);
const CircuitBuilderMemo = React.memo(CircuitBuilder);

const AttendancePanelMemo = React.memo(AttendancePanel);
const ProfilePanelMemo = React.memo(ProfilePanel);
const SettingsPanelMemo = React.memo(SettingsPanel);

import { MainDashboard } from './components/MainDashboard';
const MainDashboardMemo = React.memo(MainDashboard);

import { NetworkStatusAlert } from './components/NetworkStatusAlert';
import { TeacherTranscriptionBar } from './components/TeacherTranscriptionBar';
import { TeacherExplanationPanel } from './components/voice/TeacherExplanationPanel';

const TeacherTranscriptionBarMemo = React.memo(TeacherTranscriptionBar);
const TeacherExplanationPanelMemo = React.memo(TeacherExplanationPanel);
const ClassroomSubtitlesMemo = React.memo(ClassroomSubtitles);

export default function App() {
  const {
    isAppStarted, setIsAppStarted,
    activeTopic, setActiveTopic,
    ncertSubject, setNcertSubject,
    ncertChapter, setNcertChapter,
    isAIPanelOpen, setIsAIPanelOpen,
    isAttendanceOpen, setIsAttendanceOpen,
    isGestureActive, setIsGestureActive,
    isVoiceActive, setIsVoiceActive,
    isTranscriptionOpen, setIsTranscriptionOpen,
    isTranscriptHistoryOpen, setIsTranscriptHistoryOpen,
    isAirDrawOpen, setIsAirDrawOpen,
    isSoundEnabled, setIsSoundEnabled,
    isNotesOpen, setIsNotesOpen,
    isProgressOpen, setIsProgressOpen,
    isCourseOpen, setIsCourseOpen,
    isQuizOpen, setIsQuizOpen,
    isTeachersDeskOpen, setIsTeachersDeskOpen,
    isProfileOpen, setIsProfileOpen,
    isSettingsOpen, setIsSettingsOpen,
    isSubscriptionOpen, setIsSubscriptionOpen,
    isClassScheduleOpen, setIsClassScheduleOpen,
    isSidebarOpen, setIsSidebarOpen,
    isMobile, setIsMobile,
    isLibraryOpen, setIsLibraryOpen,
    isSyllabusOpen, setIsSyllabusOpen,
    isLessonCreatorOpen, setIsLessonCreatorOpen,
    isTaskManagerOpen, setIsTaskManagerOpen,
    isVirtualLabOpen, setIsVirtualLabOpen,
    isCircuitBuilderOpen, setIsCircuitBuilderOpen,
    isHelpOpen, setIsHelpOpen,
    isUploadOpen, setIsUploadOpen,
    isLiveTutorOpen, setIsLiveTutorOpen,
    detailLevel, setDetailLevel,
    language, setLanguage,
    topicExplanation, setTopicExplanation,
    uploadedModel, setUploadedModel,
    uploadedModelExplanation, setUploadedModelExplanation,
    hologramConfig, setHologramConfig,
    progress, setProgress,
    needsApiKey, setNeedsApiKey,
    user, setUser,
    userData, setUserData,
    userRole, setUserRole,
    isAuthReady, setIsAuthReady,
    theme, setTheme
  } = useStore(useShallow(state => ({
    isAppStarted: state.isAppStarted, setIsAppStarted: state.setIsAppStarted,
    activeTopic: state.activeTopic, setActiveTopic: state.setActiveTopic,
    ncertSubject: state.ncertSubject, setNcertSubject: state.setNcertSubject,
    ncertChapter: state.ncertChapter, setNcertChapter: state.setNcertChapter,
    isAIPanelOpen: state.isAIPanelOpen, setIsAIPanelOpen: state.setIsAIPanelOpen,
    isAttendanceOpen: state.isAttendanceOpen, setIsAttendanceOpen: state.setIsAttendanceOpen,
    isGestureActive: state.isGestureActive, setIsGestureActive: state.setIsGestureActive,
    isVoiceActive: state.isVoiceActive, setIsVoiceActive: state.setIsVoiceActive,
    isTranscriptionOpen: state.isTranscriptionOpen, setIsTranscriptionOpen: state.setIsTranscriptionOpen,
    isTranscriptHistoryOpen: state.isTranscriptHistoryOpen, setIsTranscriptHistoryOpen: state.setIsTranscriptHistoryOpen,
    isAirDrawOpen: state.isAirDrawOpen, setIsAirDrawOpen: state.setIsAirDrawOpen,
    isSoundEnabled: state.isSoundEnabled, setIsSoundEnabled: state.setIsSoundEnabled,
    isNotesOpen: state.isNotesOpen, setIsNotesOpen: state.setIsNotesOpen,
    isProgressOpen: state.isProgressOpen, setIsProgressOpen: state.setIsProgressOpen,
    isCourseOpen: state.isCourseOpen, setIsCourseOpen: state.setIsCourseOpen,
    isQuizOpen: state.isQuizOpen, setIsQuizOpen: state.setIsQuizOpen,
    isTeachersDeskOpen: state.isTeachersDeskOpen, setIsTeachersDeskOpen: state.setIsTeachersDeskOpen,
    isProfileOpen: state.isProfileOpen, setIsProfileOpen: state.setIsProfileOpen,
    isSettingsOpen: state.isSettingsOpen, setIsSettingsOpen: state.setIsSettingsOpen,
    isSubscriptionOpen: state.isSubscriptionOpen, setIsSubscriptionOpen: state.setIsSubscriptionOpen,
    isClassScheduleOpen: state.isClassScheduleOpen, setIsClassScheduleOpen: state.setIsClassScheduleOpen,
    isSidebarOpen: state.isSidebarOpen, setIsSidebarOpen: state.setIsSidebarOpen,
    isMobile: state.isMobile, setIsMobile: state.setIsMobile,
    isLibraryOpen: state.isLibraryOpen, setIsLibraryOpen: state.setIsLibraryOpen,
    isSyllabusOpen: state.isSyllabusOpen, setIsSyllabusOpen: state.setIsSyllabusOpen,
    isLessonCreatorOpen: state.isLessonCreatorOpen, setIsLessonCreatorOpen: state.setIsLessonCreatorOpen,
    isTaskManagerOpen: state.isTaskManagerOpen, setIsTaskManagerOpen: state.setIsTaskManagerOpen,
    isVirtualLabOpen: state.isVirtualLabOpen, setIsVirtualLabOpen: state.setIsVirtualLabOpen,
    isCircuitBuilderOpen: state.isCircuitBuilderOpen, setIsCircuitBuilderOpen: state.setIsCircuitBuilderOpen,
    isHelpOpen: state.isHelpOpen, setIsHelpOpen: state.setIsHelpOpen,
    isUploadOpen: state.isUploadOpen, setIsUploadOpen: state.setIsUploadOpen,
    isLiveTutorOpen: state.isLiveTutorOpen, setIsLiveTutorOpen: state.setIsLiveTutorOpen,
    detailLevel: state.detailLevel, setDetailLevel: state.setDetailLevel,
    language: state.language, setLanguage: state.setLanguage,
    topicExplanation: state.topicExplanation, setTopicExplanation: state.setTopicExplanation,
    uploadedModel: state.uploadedModel, setUploadedModel: state.setUploadedModel,
    uploadedModelExplanation: state.uploadedModelExplanation, setUploadedModelExplanation: state.setUploadedModelExplanation,
    hologramConfig: state.hologramConfig, setHologramConfig: state.setHologramConfig,
    progress: state.progress, setProgress: state.setProgress,
    needsApiKey: state.needsApiKey, setNeedsApiKey: state.setNeedsApiKey,
    user: state.user, setUser: state.setUser,
    userData: state.userData, setUserData: state.setUserData,
    userRole: state.userRole, setUserRole: state.setUserRole,
    isAuthReady: state.isAuthReady, setIsAuthReady: state.setIsAuthReady,
    theme: state.theme, setTheme: state.setTheme
  })));

  useEffect(() => {
    const isDark = !['white', 'ios-light'].includes(theme.id);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
  }, [theme.id]);

  useEffect(() => {
    if (isTranscriptionOpen) {
      setIsTranscriptHistoryOpen(false);
    }
  }, [isTranscriptionOpen, setIsTranscriptHistoryOpen]);

  useEffect(() => {
    if (isLiveTutorOpen) {
      setIsAIPanelOpen(false);
    }
  }, [isLiveTutorOpen, setIsAIPanelOpen]);

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check for redirect errors
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect sign-in error:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsOffline(false);
        // Fetch user role with retries
        const fetchRole = async (attempts = 3) => {
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            // Use getDocFromServer for important initial auth state to confirm role
            const userSnap = await getDocFromServer(userRef);
            if (userSnap.exists()) {
              const data = userSnap.data() as UserInterface;
              setUserData(data);
              setUserRole(data.role);
            } else {
              // If user exists in Auth but not in Firestore, default to student role
              console.log("User record not found in Firestore, defaulting to Student role.");
              setUserRole('student');
            }
          } catch (err: any) {
            console.error(`Attempt ${4 - attempts} failed fetching role:`, err.message);
            if (attempts > 1) {
               await new Promise(resolve => setTimeout(resolve, 3000));
               return fetchRole(attempts - 1);
            } else {
               // Final fallback: allow access as student if auth is valid but DB is unreachable
               console.warn("DB unreachable, granting temporary Student access.");
               setUserRole('student');
               setIsOffline(true);
            }
          }
        };

        fetchRole().catch(error => {
          console.error("Final error fetching user role:", error);
        });
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setNeedsApiKey(true);
        }
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = useCallback(async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setNeedsApiKey(false);
    }
  }, []);

  const handleGenerateExplanation = useCallback(async () => {
    // 1. Try preloaded
    let explanation = getPreloadedExplanation(activeTopic, detailLevel);
    
    // 2. If not found, try Gemini
    if (!explanation) {
      explanation = await generateExplanation(activeTopic, detailLevel, language);
    }
    
    setTopicExplanation(explanation || 'No explanation available.');
  }, [activeTopic, detailLevel, language]);

  useEffect(() => {
    // Automatically re-generate explanation if one is already visible
    if (topicExplanation) {
      handleGenerateExplanation();
    }
  }, [detailLevel, language, handleGenerateExplanation]);

  useEffect(() => {
    // Reset explanation when topic changes so it only appears after clicking "Analyze Synthesis"
    setTopicExplanation(null);
  }, [activeTopic]);

  useEffect(() => {
    setProgress(progressService.getProgress());
  }, []);

  useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      const { action, module, panel } = e.detail;
      
      if (action === 'CHANGE_MODULE' && module) {
        const topicMap: Record<string, Topic> = {
          'relativity': 'Relativity',
          'calculus': 'Calculus',
          'atom': 'Atom',
          'aerodynamics': 'AircraftAerodynamics',
          'fingerprint': 'FingerprintSensor',
          'neural': 'NeuralNetwork',
          'dna': 'DNA',
          'engine': 'Engine',
          'virus': 'Virus',
          'solar': 'SolarSystem'
        };
        const targetTopic = topicMap[module.toLowerCase()] || module;
        setActiveTopic(targetTopic as Topic);
      } else if (action === 'ENTER_FULLSCREEN') {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
      } else if (action === 'TOGGLE_PANEL' && panel) {
        const p = panel.toLowerCase();
        if (p.includes('ai')) setIsAIPanelOpen(prev => !prev);
        if (p.includes('course')) setIsCourseOpen(prev => !prev);
        if (p.includes('progress')) setIsProgressOpen(prev => !prev);
        if (p.includes('library')) setIsLibraryOpen(prev => !prev);
        if (p.includes('notes')) setIsNotesOpen(prev => !prev);
        if (p.includes('quiz')) setIsQuizOpen(prev => !prev);
        if (p.includes('sidebar')) setIsSidebarOpen(prev => !prev);
        if (p.includes('gesture')) setIsGestureActive(prev => !prev);
        if (p.includes('neural')) setIsAIPanelOpen(prev => !prev);
        if (p.includes('transcription')) {
          setIsTranscriptionOpen(prev => {
            const next = !prev;
            if (next) setIsTranscriptHistoryOpen(false);
            return next;
          });
        }
      } else if (action === 'OPEN_PANEL' && panel) {
        const p = panel.toLowerCase();
        if (p.includes('ai')) setIsAIPanelOpen(true);
        if (p.includes('course')) setIsCourseOpen(true);
        if (p.includes('progress')) setIsProgressOpen(true);
        if (p.includes('library')) setIsLibraryOpen(true);
        if (p.includes('notes')) setIsNotesOpen(true);
        if (p.includes('quiz')) setIsQuizOpen(true);
        if (p.includes('sidebar')) setIsSidebarOpen(true);
        if (p.includes('gesture')) setIsGestureActive(true);
        if (p.includes('neural')) setIsAIPanelOpen(true);
        if (p.includes('transcription')) {
          setIsTranscriptionOpen(true);
          setIsTranscriptHistoryOpen(false);
        }
        if (p.includes('ncert')) setActiveTopic('NCERTBooks');
      } else if (action === 'CLOSE_PANEL' && panel) {
        const p = panel.toLowerCase();
        if (p.includes('ai')) setIsAIPanelOpen(false);
        if (p.includes('course')) setIsCourseOpen(false);
        if (p.includes('progress')) setIsProgressOpen(false);
        if (p.includes('library')) setIsLibraryOpen(false);
        if (p.includes('notes')) setIsNotesOpen(false);
        if (p.includes('quiz')) setIsQuizOpen(false);
        if (p.includes('sidebar')) setIsSidebarOpen(false);
        if (p.includes('gesture')) setIsGestureActive(false);
        if (p.includes('neural')) setIsAIPanelOpen(false);
        if (p.includes('transcription')) setIsTranscriptionOpen(false);
        if (p.includes('viewer')) setActiveTopic(prev => prev === 'NCERTBooks' ? 'Atom' : prev);
        if (p.includes('ncert')) setActiveTopic(prev => prev === 'NCERTBooks' ? 'Atom' : prev);
      } else if (action === 'EXIT_APP') {
        setIsAppStarted(false);
      } else if (action === 'OPEN_BOOK') {
        const s = (e.detail.subject || '').toLowerCase();
        if (s.includes('physics')) setNcertSubject(s.includes('12') ? 'physics12' : 'physics');
        else if (s.includes('chemistry')) setNcertSubject(s.includes('12') ? 'chemistry12' : 'chemistry');
        else if (s.includes('math')) setNcertSubject(s.includes('12') ? 'maths12' : 'maths');
        else if (s.includes('biology')) setNcertSubject(s.includes('12') ? 'biology12' : 'biology');
        else if (s.includes('computer') || s.includes('cs')) setNcertSubject('cs');
        setActiveTopic('NCERTBooks');
      } else if (action === 'CHANGE_DETAIL_LEVEL' && e.detail.level) {
        setDetailLevel(e.detail.level);
      } else if (action === 'TOGGLE_AUDIO') {
        setIsSoundEnabled(prev => !prev);
      } else if (action === 'READ_CHAPTER') {
        setNcertChapter(e.detail.chapter);
        setActiveTopic('NCERTBooks');
      }
    };

    window.addEventListener('app-voice-command', handleVoiceCommand);
    return () => window.removeEventListener('app-voice-command', handleVoiceCommand);
  }, []);

  if (!isAuthReady) {
    return (
      <div className={`flex h-screen w-full items-center justify-center bg-zinc-950 text-white relative overflow-hidden`}>
        {/* Futuristic background for loader */}
        <div className="absolute inset-0 bg-grid-holo opacity-20 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-[scan_3s_linear_infinite]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8 relative z-10"
        >
          <div className="relative">
            <div className={`w-20 h-20 border-2 border-indigo-500/20 rounded-full`} />
            <div className={`absolute inset-0 border-t-2 border-indigo-400 rounded-full animate-spin`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={24} className="text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold tracking-[0.3em] uppercase text-glow">HYPERVISION</h2>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Initializing Neural Core...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className={`flex h-screen w-full items-center justify-center ${theme.bg} ${theme.text}`}>
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-8 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-400">Connection Lost</h2>
          <p className={theme.textMuted}>We couldn't connect to the server. Please check your internet connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className={`mt-4 px-6 py-2 bg-${theme.primary} hover:opacity-80 text-white rounded-lg transition-colors font-medium`}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!user || !userRole) {
    return (
      <AuthScreen 
        initialPendingUser={user}
        onLogin={(loggedInUser, role) => {
          setUser(loggedInUser);
          setUserRole(role);
        }} 
      />
    );
  }

  if (!isAppStarted) {
    return (
      <LandingPage 
        onStart={() => {
          setIsAppStarted(true);
          setActiveTopic('Dashboard');
        }} 
        needsApiKey={needsApiKey}
        onSelectKey={handleSelectKey}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className={`flex h-screen w-full overflow-hidden ${theme.bg} ${theme.text} font-sans selection:bg-indigo-500/30 relative`}>
        <NetworkStatusAlert />

        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              layout
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={SMOOTH_SPRING}
              className="z-[100]"
            >
              <SidebarMemo />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <TopbarMemo />

          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTopic}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99, transition: { duration: 0.05 } }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full h-full absolute inset-0 will-change-transform"
              >
                {activeTopic === 'Dashboard' ? (
                  <MainDashboardMemo />
                ) : activeTopic === 'AircraftAerodynamics' ? (
                  <AerodynamicsModuleMemo />
                ) : activeTopic === 'Relativity' ? (
                  <RelativityModuleMemo />
                ) : activeTopic === 'FingerprintSensor' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="text-zinc-500 animate-pulse font-mono text-sm">INITIALIZING BIOMETRIC INTERFACE...</div>
                  </div>
                ) : (isVirtualLabOpen || isProgressOpen || isLibraryOpen || isSyllabusOpen || isLessonCreatorOpen || isTaskManagerOpen || activeTopic === 'NCERTBooks') ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="text-zinc-500 animate-pulse font-mono text-sm uppercase tracking-[0.3em]">Holo-Engine Suspended (Resource Optimization)</div>
                  </div>
                ) : (
                  <Viewer3DMemo />
                )}
              </motion.div>
            </AnimatePresence>

            <AmbientSound activeTopic={activeTopic} isEnabled={isSoundEnabled} />
            <InteractionSound />

            {/* Panels */}
            <AnimatePresence>
              {isAIPanelOpen && (
                <motion.div
                  key="ai-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-y-0 right-0 z-50 will-change-transform"
                >
                  <AIPanelMemo />
                </motion.div>
              )}

              {activeTopic === 'Custom' && (
                <motion.div
                  key="hologram-generator"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <HologramGeneratorPanelMemo />
                </motion.div>
              )}

              {activeTopic === 'AIGenerator' && (
                <motion.div
                  key="ai-generator"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <AIGeneratorPanelMemo />
                </motion.div>
              )}

              {activeTopic === 'ImageTo3D' && (
                <motion.div
                  key="image-to-3d"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <ImageTo3DPanelMemo />
                </motion.div>
              )}

              {isCourseOpen && (
                <motion.div
                  key="course-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-y-0 right-0 z-50 will-change-transform"
                >
                  <CoursePanelMemo />
                </motion.div>
              )}

              {isProgressOpen && (
                <motion.div
                  key="progress-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <ProgressDashboardMemo />
                </motion.div>
              )}

              {isLibraryOpen && (
                <motion.div
                  key="library-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <ModuleLibraryMemo />
                </motion.div>
              )}

              {activeTopic === 'Saved' && (
                <motion.div
                  key="saved-holograms"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <SavedHologramsPanelMemo />
                </motion.div>
              )}

              {isSyllabusOpen && (
                <motion.div
                  key="syllabus-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <SyllabusManagerMemo />
                </motion.div>
              )}

              {isLessonCreatorOpen && (
                <motion.div
                  key="lesson-creator"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <LessonCreatorPanelMemo />
                </motion.div>
              )}

              {isHelpOpen && (
                <motion.div
                  key="help-modal"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <HelpModalMemo />
                </motion.div>
              )}

              {isUploadOpen && (
                <motion.div
                  key="upload-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <UploadPanelMemo />
                </motion.div>
              )}

              {isLiveTutorOpen && (
                <motion.div
                  key="live-tutor"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <LiveTutorMemo />
                </motion.div>
              )}

              {isTeachersDeskOpen && (
                <motion.div
                  key="teachers-desk"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <TeachersDeskPanelMemo />
                </motion.div>
              )}

              {isQuizOpen && (
                <motion.div
                  key="quiz-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <QuizPanelMemo />
                </motion.div>
              )}

              {isAttendanceOpen && (
                <motion.div
                  key="attendance-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <AttendancePanelMemo />
                </motion.div>
              )}

              {isProfileOpen && (
                <motion.div
                  key="profile-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <ProfilePanelMemo />
                </motion.div>
              )}

              {isSettingsOpen && (
                <motion.div
                  key="settings-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <SettingsPanelMemo />
                </motion.div>
              )}
              
              {isTaskManagerOpen && (
                <motion.div
                  key="task-manager"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <TaskManagerPanelMemo />
                </motion.div>
              )}

              {isVirtualLabOpen && (
                <motion.div
                  key="virtual-lab"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <VirtualLabPanelMemo />
                </motion.div>
              )}

              {isSubscriptionOpen && (
                <motion.div
                  key="subscription-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <SubscriptionPanel />
                </motion.div>
              )}
              
              {isClassScheduleOpen && (
                <motion.div
                  key="class-schedule-panel"
                  {...PANEL_TRANSITION}
                  className="absolute inset-0 z-50"
                >
                  <ClassSchedulePanel />
                </motion.div>
              )}

              {isNotesOpen && (
                <motion.div
                  key="notes-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-50"
                >
                  <LectureNotesPanelMemo />
                </motion.div>
              )}
            </AnimatePresence>

            <GestureOverlayMemo />

            <AirDrawPanelMemo />

            <AnimatePresence>
              {activeTopic === 'NCERTBooks' && (
                <motion.div
                  key="ncert-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-50"
                >
                  <NCERTBooksPanelMemo />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {activeTopic === 'FingerprintSensor' && (
                <motion.div
                  key="biometric-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-50"
                >
                  <FingerprintSensorCourseMemo />
                </motion.div>
              )}
            </AnimatePresence>
            
            <VoiceControllerMemo />

            <AnimatePresence>
              {isTranscriptionOpen && (
                <TeacherVoiceToTextPanelMemo key="teacher-voice-to-text-panel" />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isTranscriptHistoryOpen && (
                <TranscriptPanelMemo />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isCircuitBuilderOpen && <CircuitBuilderMemo key="circuit-builder" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
