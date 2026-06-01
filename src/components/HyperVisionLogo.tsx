import { motion } from 'motion/react';
import { useStore } from '../store/useStore';

interface HyperVisionLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HyperVisionLogo({ className = '', size = 'md' }: HyperVisionLogoProps) {
  const iconSize = size === 'sm' ? 32 : size === 'md' ? 64 : 120;
  const fontSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-4xl' : 'text-6xl';
  const theme = useStore((state) => state.theme);
  const isLight = theme.id === 'white' || theme.id === 'ios-light';
  
  // High-density parametric geometry
  const linesLeft = 50;
  const leftPillar = Array.from({length: linesLeft}).map((_, i) => {
    const t = i / (linesLeft - 1);
    const startX = 40 + t * 30;
    const startY = 80 + t * 40;
    const endX = 40 + t * 30;
    const endY = 320 - t * 40;
    const cpX = 40 + t * 140;
    const cpY = 200;
    return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
  });

  const linesMid = 50;
  const middlePillar = Array.from({length: linesMid}).map((_, i) => {
    const t = i / (linesMid - 1);
    const startX = 180 + t * 30;
    const startY = 120 - t * 40;
    const endX = 180 + t * 30;
    const endY = 280 + t * 40;
    const cpX = 180 - (1 - t) * 90;
    const cpY = 200;
    return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
  });

  const linesSwoop = 80;
  const swoop = Array.from({length: linesSwoop}).map((_, i) => {
    const t = i / (linesSwoop - 1);
    const startX = 100 + t * 60;
    const startY = 190 - t * 20;
    
    // Bottom point of the V
    const dipX = 240 + t * 40;
    const dipY = 320 - t * 25;
    
    // Top right point of the V
    const endX = 360 - t * 50;
    const endY = 80 + t * 50;

    const cp1x = 180 + t * 50;
    const cp1y = 200 + t * 30;
    
    const cp2x = 220 + t * 60;
    const cp2y = 300 - t * 10;

    return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${dipX} ${dipY} L ${endX} ${endY}`;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex items-center gap-4 sm:gap-6 ${className}`}
    >
      <div className="relative group shrink-0">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: isLight ? 0.1 : 0.3 }}
           transition={{ duration: 2 }}
           className={`absolute inset-0 blur-3xl rounded-full bg-gradient-to-r from-cyan-500 via-violet-600 to-fuchsia-600 scale-[1.3]`}
        />
        
        {/* Neon Wireframe Logo */}
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 400 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative block transform-gpu will-change-transform"
        >
          <defs>
            <linearGradient id="wire-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />  {/* Cyan 500 */}
              <stop offset="45%" stopColor="#8b5cf6" /> {/* Violet 500 */}
              <stop offset="100%" stopColor="#d946ef" /> {/* Fuchsia 500 */}
            </linearGradient>

            <linearGradient id="highlight-grad" x1="0%" y1="0%" x2="200%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor={isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.8)"} />
              <stop offset="100%" stopColor="transparent" />
              <animate attributeName="x1" values="-100%;200%" dur="3s" repeatCount="indefinite" />
              <animate attributeName="x2" values="0%;300%" dur="3s" repeatCount="indefinite" />
            </linearGradient>
            
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={isLight ? "1" : "2"} result="blur1" />
              <feGaussianBlur stdDeviation={isLight ? "2" : "6"} result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#neon-glow)">
            {/* Left Pillar */}
            {leftPillar.map((d, i) => (
              <motion.path
                key={`left-${i}`}
                d={d}
                stroke="url(#wire-grad)"
                strokeWidth={isLight ? "1.5" : "1"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 2, delay: i * 0.015, ease: "easeOut" }}
              />
            ))}

            {/* Middle Pillar */}
            {middlePillar.map((d, i) => (
              <motion.path
                key={`mid-${i}`}
                d={d}
                stroke="url(#wire-grad)"
                strokeWidth={isLight ? "1.5" : "1"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 2, delay: 0.2 + i * 0.015, ease: "easeOut" }}
              />
            ))}

            {/* Swoop (Crossbar + V) */}
            {swoop.map((d, i) => (
              <motion.path
                key={`swoop-${i}`}
                d={d}
                stroke="url(#wire-grad)"
                strokeWidth={isLight ? "1" : "0.8"}
                initial={{ pathLength: 0, opacity: 0, scale: 0.95 }}
                animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                transition={{ duration: 2.2, delay: 0.5 + i * 0.015, ease: "easeInOut" }}
                style={{ transformOrigin: 'center' }}
              />
            ))}

            {/* Moving Highlight Overlay */}
            <path
              d={swoop[Math.floor(swoop.length / 2)]}
              stroke="url(#highlight-grad)"
              strokeWidth="3"
              className="opacity-50"
            />
          </g>
        </svg>
      </div>
      
      <div className="flex flex-col justify-center translate-y-[2px]">
        <motion.h1 
          className={`${fontSize} font-display tracking-tighter flex items-center ${isLight ? 'drop-shadow-sm' : 'drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]'}`}
        >
          <span className={`${isLight ? 'text-zinc-900' : 'text-white'} font-bold`}>Hyper</span>
          <span className="font-bold text-white pr-1">
            Vision
          </span>
        </motion.h1>
        {size !== 'sm' && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex items-center gap-3 mt-1"
          >
            <div className={`h-[1px] w-8 ${isLight ? 'bg-zinc-300' : 'bg-zinc-700/80 shadow-[0_0_8px_rgba(139,92,246,0.4)]'}`} />
            <p className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.35em] ${isLight ? 'text-zinc-500' : 'text-zinc-400'} font-semibold`}>
              Holographic Intelligence
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

