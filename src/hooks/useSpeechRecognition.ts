import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (final: string, interim: string, latestFinal?: string, confidence?: number) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({
  language = 'en-US',
  continuous = true,
  interimResults = true,
  onResult,
  onError
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [confidence, setConfidence] = useState(1);
  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  
  // Keep track of transcripts across restarts
  const accumulatedTranscriptRef = useRef('');
  const lastSessionFinalRef = useRef('');

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  const start = useCallback(() => {
    console.log('[SpeechRecognition] start() called');
    shouldListenRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        console.log('[SpeechRecognition] Started successfully');
      } catch (e: any) {
        if (e.name !== 'InvalidStateError') {
          console.error('[SpeechRecognition] start error:', e);
        } else {
          console.log('[SpeechRecognition] Already started (InvalidStateError)');
          setIsListening(true);
        }
      }
    } else {
      console.log('[SpeechRecognition] recognitionRef is null');
    }
  }, []);

  const stop = useCallback(() => {
    console.log('[SpeechRecognition] stop() called');
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('[SpeechRecognition] Stopped successfully');
      } catch (e) {
        console.error('[SpeechRecognition] stop error:', e);
      }
      setIsListening(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = '';
    lastSessionFinalRef.current = '';
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [isListening]);

  useEffect(() => {
    console.log('[SpeechRecognition] Initializing...');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('[SpeechRecognition] Not supported in this browser');
      setIsSupported(false);
      setError('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 3; // Better precision by letting browser evaluate alternatives

    recognition.onstart = () => {
      console.log('[SpeechRecognition] onstart event fired');
      setIsListening(true);
      lastSessionFinalRef.current = '';
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let latestFinal = '';
      let currentConfidence = 1;
      
      // Use resultIndex for performance and stability
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const resultConfidence = result[0].confidence;
        
        if (result.isFinal) {
          // Higher confidence threshold for "100% precision" goal
          // A bit more lenient if it's longer (likely valid speech)
          const confidenceThreshold = transcript.length > 20 ? 0.2 : 0.4;
          
          if (resultConfidence > confidenceThreshold) {
            lastSessionFinalRef.current += transcript + ' ';
            latestFinal = transcript;
            currentConfidence = resultConfidence;
          }
        } else {
          interim += transcript;
        }
      }
      
      setConfidence(currentConfidence);
      
      // Combine accumulated transcript from previous sessions with current session segment
      const totalFinal = (accumulatedTranscriptRef.current + ' ' + lastSessionFinalRef.current).trim();
      onResultRef.current?.(totalFinal, interim, latestFinal, currentConfidence);
    };

    recognition.onerror = (event: any) => {
      const errorStr = typeof event.error === 'string' ? event.error : (event.error?.message || String(event.error));
      
      // Handle different types of errors
      if (errorStr === 'no-speech') {
        console.log('[SpeechRecognition] No speech detected');
        // If continuous is on, we don't treat no-speech as a fatal error
        if (shouldListenRef.current) {
          // Just let onend handle the restart
        }
        return;
      }

      if (errorStr === 'aborted') {
        console.log('[SpeechRecognition] Aborted');
        return;
      }
      
      console.error('[SpeechRecognition] onerror:', errorStr);
      setError(errorStr);
      onErrorRef.current?.(errorStr);
      
      // Stop attempting to restart if critical errors occur
      if (errorStr === 'not-allowed' || errorStr === 'service-not-allowed' || errorStr === 'network' || errorStr === 'language-not-supported') {
        console.warn('[SpeechRecognition] Critical error, stopping auto-restart');
        setIsListening(false);
        shouldListenRef.current = false;
      }
    };

    recognition.onend = () => {
      console.log('[SpeechRecognition] onend event fired. shouldListen:', shouldListenRef.current);
      setIsListening(false);
      
      // Save the final results of this session to the accumulator
      if (lastSessionFinalRef.current) {
        accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + lastSessionFinalRef.current).trim();
        lastSessionFinalRef.current = '';
      }
      
      // Only restart if we should still be listening and there wasn't a critical error
      if (shouldListenRef.current) {
        console.log('[SpeechRecognition] Auto-restarting...');
        // Use a small delay to prevent rapid-fire restarts in case of errors
        setTimeout(() => {
          if (shouldListenRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e: any) {
              if (e.name !== 'InvalidStateError' && !e.message?.includes('already started')) {
                console.error('[SpeechRecognition] Auto-restart error:', e);
              }
            }
          }
        }, 300); // Slightly longer delay for stability
      }
    };

    recognitionRef.current = recognition;

    if (shouldListenRef.current) {
      console.log('[SpeechRecognition] Starting on mount/update since shouldListen is true');
      try {
        recognition.start();
      } catch (e) {
        console.error('[SpeechRecognition] Start on mount error:', e);
      }
    }

    return () => {
      console.log('[SpeechRecognition] Cleanup: stopping recognition');
      recognition.onend = null;
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [language, continuous, interimResults]);

  return { isListening, error, isSupported, confidence, start, stop, clearTranscript };
}
