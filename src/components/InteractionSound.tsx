import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export function InteractionSound() {
  const { lastSoundTrigger, isSoundEnabled } = useStore();
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!isSoundEnabled) return;
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const playSound = (type: string) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'click') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'toggle') {
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    };

    if (lastSoundTrigger.soundType) {
      playSound(lastSoundTrigger.soundType);
    }
  }, [lastSoundTrigger, isSoundEnabled]);

  return null;
}
