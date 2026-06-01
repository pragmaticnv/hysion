import { useState, useRef, useEffect, useCallback } from 'react';

export function useHoloAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<{ stop: () => void } | null>(null);

  // Initialize AudioContext on user interaction if needed (left for compatibility)
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setIsGenerating(false);
    setCurrentText(null);
    window.speechSynthesis.cancel();
  }, []);

  const pause = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      await audioContextRef.current.suspend();
      setIsPaused(true);
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
      setIsPaused(false);
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const play = useCallback(async (text: string) => {
    if (!text) return;
    
    // If already playing the same text, stop it (toggle behavior)
    if (isPlaying && currentText === text) {
      stop();
      return;
    }

    // Stop any current playback
    stop();
    window.dispatchEvent(new CustomEvent('app:stop-audio', { detail: { source: 'useHoloAudio' } }));

    setIsPlaying(true);
    setIsGenerating(false);
    setCurrentText(text);

    // Clean markdown for audio
    const cleanText = text
      .replace(/#/g, '')      // Remove all hash markers
      .replace(/\*\*/g, '')   // Remove bold markers
      .replace(/\*/g, '')     // Remove italic markers
      .replace(/_/g, '')      // Remove underscore markers
      .replace(/`/g, '')      // Remove code markers
      .replace(/~/g, '')      // Remove strikethrough
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
      .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters (emojis, etc.)

    try {
      const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
      let currentSentence = 0;

      const speakNext = () => {
        return new Promise<void>((resolve) => {
          if (currentSentence >= sentences.length) {
            resolve();
            return;
          }

          const utterance = new SpeechSynthesisUtterance(sentences[currentSentence].trim());
          const voices = window.speechSynthesis.getVoices();
          
          let voice = voices.find(v => v.name.includes('Google') && v.name.includes('English') && v.name.includes('US'));
          if (!voice) voice = voices.find(v => v.lang.startsWith('en-US'));
          if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
          if (!voice) voice = voices[0];
          
          if (voice) utterance.voice = voice;
          utterance.rate = 1.0;
          utterance.pitch = 1.0;

          utterance.onend = async () => {
            currentSentence++;
            await speakNext();
            resolve();
          };
          
          utterance.onerror = (e) => {
            console.error('SpeechSynthesis error:', e);
            resolve();
          };
          
          audioSourceRef.current = {
            stop: () => {
              window.speechSynthesis.cancel();
              currentSentence = sentences.length; // Stop the loop
              resolve();
            }
          };
          
          window.speechSynthesis.speak(utterance);
        });
      };

      await speakNext();
    } catch (err) {
      console.error("Audio playback error:", err);
    } finally {
      setIsPlaying(false);
      setIsGenerating(false);
      setCurrentText(null);
      audioSourceRef.current = null;
    }
  }, [isPlaying, currentText, stop]);

  const prefetch = useCallback((text: string) => {
    // browser synthesis doesn't need pre-fetching in the same way as APIs
    return;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const handleGlobalStop = (e: any) => {
      if (e.detail?.source !== 'useHoloAudio') {
        stop();
      }
    };
    window.addEventListener('app:stop-audio', handleGlobalStop);

    return () => {
      window.removeEventListener('app:stop-audio', handleGlobalStop);
      stop();
    };
  }, [stop]);

  return {
    isPlaying,
    isPaused,
    isGenerating,
    play,
    pause,
    resume,
    stop,
    prefetch,
    init: initAudioContext,
    currentText
  };
}
