import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Sparkles, User, ArrowRight } from 'lucide-react';
import { signInWithGoogle, db, handleFirestoreError, OperationType } from '../services/firebaseService';
import { doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';

interface AuthScreenProps {
  onLogin: (user: any, role: 'student' | 'teacher') => void;
  initialPendingUser?: any;
}

export function AuthScreen({ onLogin, initialPendingUser }: AuthScreenProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [pendingUser, setPendingUser] = useState<any>(initialPendingUser || null);

  // Update pendingUser if initialPendingUser changes
  React.useEffect(() => {
    if (initialPendingUser && !pendingUser) {
      setPendingUser(initialPendingUser);
    }
  }, [initialPendingUser]);

  const handleGoogleSignIn = async () => {
    try {
      // Call signInWithGoogle immediately to preserve the user gesture context
      // which helps prevent the browser from blocking the popup.
      const user = await signInWithGoogle();
      
      if (!user) return; // Handle redirect fallback
      
      setIsLoggingIn(true);
      setError(null);
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      let userSnap;
      try {
        userSnap = await getDocFromServer(userRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        throw err; // Re-throw to be caught by the outer catch
      }
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        onLogin(user, userData.role);
      } else {
        // User doesn't exist, need to select role
        setPendingUser(user);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRoleSelection = async (role: 'student' | 'teacher') => {
    if (!pendingUser) return;
    
    try {
      setIsLoggingIn(true);
      const userRef = doc(db, 'users', pendingUser.uid);
      try {
        await setDoc(userRef, {
          uid: pendingUser.uid,
          email: pendingUser.email || '',
          displayName: pendingUser.displayName || '',
          photoURL: pendingUser.photoURL || '',
          role: role,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${pendingUser.uid}`);
        throw err;
      }
      
      onLogin(pendingUser, role);
    } catch (err: any) {
      console.error(err);
      setError('Failed to save user role. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 overflow-hidden font-sans safe-top safe-bottom">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-holo opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md p-10 glass-dark rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 before:absolute before:inset-0 before:rounded-[2rem] before:border before:border-white/5 before:pointer-events-none overflow-hidden"
      >
        {/* Decorative top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

        <div className="text-center mb-10 relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6 relative shadow-[0_0_30px_rgba(99,102,241,0.2)]"
          >
            <div className="absolute inset-0 rounded-full border border-indigo-400/20 border-t-indigo-400/60" />
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </motion.div>
          <h1 className="text-5xl font-display font-bold text-white mb-3 tracking-tighter text-glow">NEURAL CORE</h1>
          <p className="text-indigo-300/60 text-sm uppercase tracking-[0.3em] font-mono">Authentication Portal</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-mono text-center">
            [ERROR]: {error}
          </motion.div>
        )}

        {!pendingUser ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-medium transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300" />
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="tracking-wide text-sm">Initialize Secure Link</span>
                </>
              )}
            </button>
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs uppercase tracking-wider font-mono">System Ready</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Premium Local Sandbox Trial Launchers */}
            <div className="space-y-3">
              <div className="text-center text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">
                Local Sandbox Clearance
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onLogin({ uid: 'offline_student', email: 'student@hypervision.ai', displayName: 'Sandbox Scholar' }, 'student')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400 text-[10px] font-black tracking-widest uppercase transition-all active:scale-[0.98]"
                >
                  Student Sandbox
                </button>
                <button
                  onClick={() => onLogin({ uid: 'offline_teacher', email: 'teacher@hypervision.ai', displayName: 'Sandbox Instructor' }, 'teacher')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-2xl text-cyan-400 text-[10px] font-black tracking-widest uppercase transition-all active:scale-[0.98]"
                >
                  Teacher Sandbox
                </button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-6">Select Operational Clearance</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelection('student')}
                  disabled={isLoggingIn}
                  className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all duration-200 overflow-hidden ${
                    selectedRole === 'student' 
                      ? 'bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.25)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onMouseEnter={() => setSelectedRole('student')}
                  onMouseLeave={() => setSelectedRole(null)}
                >
                  {selectedRole === 'student' && (
                    <motion.div 
                      layoutId="role-scan"
                      className="absolute inset-0 z-0 pointer-events-none"
                    >
                      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-indigo-400/50 animate-[scan_2s_linear_infinite]" />
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
                    </motion.div>
                  )}
                  <div className={`p-3 rounded-xl transition-all duration-500 relative z-10 ${selectedRole === 'student' ? 'bg-indigo-500/30 text-indigo-300 scale-110' : 'bg-white/5 text-zinc-400 group-hover:text-white'}`}>
                    <User size={24} />
                  </div>
                  <div className="text-center relative z-10">
                    <div className={`text-xl font-bold tracking-tight transition-all duration-500 ${selectedRole === 'student' ? 'text-indigo-200 text-glow' : 'text-zinc-400 group-hover:text-white'}`}>Student</div>
                    <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-[0.2em] font-mono">Standard Access</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelection('teacher')}
                  disabled={isLoggingIn}
                  className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all duration-500 overflow-hidden ${
                    selectedRole === 'teacher' 
                      ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.25)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onMouseEnter={() => setSelectedRole('teacher')}
                  onMouseLeave={() => setSelectedRole(null)}
                >
                  {selectedRole === 'teacher' && (
                    <motion.div 
                      layoutId="role-scan"
                      className="absolute inset-0 z-0 pointer-events-none"
                    >
                      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-cyan-400/50 animate-[scan_2s_linear_infinite]" />
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
                    </motion.div>
                  )}
                  <div className={`p-3 rounded-xl transition-all duration-500 relative z-10 ${selectedRole === 'teacher' ? 'bg-cyan-500/30 text-cyan-300 scale-110' : 'bg-white/5 text-zinc-400 group-hover:text-white'}`}>
                    <GraduationCap size={24} />
                  </div>
                  <div className="text-center relative z-10">
                    <div className={`text-xl font-bold tracking-tight transition-all duration-500 ${selectedRole === 'teacher' ? 'text-cyan-200 text-glow' : 'text-zinc-400 group-hover:text-white'}`}>Teacher</div>
                    <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-[0.2em] font-mono">Elevated Access</div>
                  </div>
                </button>
              </div>
            </div>
            
            {isLoggingIn && (
              <div className="flex items-center justify-center gap-3 text-indigo-400 text-xs font-mono uppercase tracking-widest mt-4">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Configuring Access...
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
