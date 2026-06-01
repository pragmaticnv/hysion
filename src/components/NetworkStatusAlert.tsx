import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';

export function NetworkStatusAlert() {
  const { theme } = useStore();
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-amber-500/20 backdrop-blur-md border border-amber-500/50 rounded-full flex items-center gap-2 shadow-lg"
        >
          <WifiOff size={16} className="text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Offline Mode Active
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
