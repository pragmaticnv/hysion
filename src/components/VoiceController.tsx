import React, { useEffect, useRef, useState } from 'react';
import { parseVoiceCommand } from '../services/geminiService';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceControllerProps {
  isActive: boolean;
  onClose: () => void;
}

import { useStore } from '../store/useStore';

export const VoiceController: React.FC = () => {
  const { isVoiceActive: isActive, setIsVoiceActive: onClose, isTranscriptionOpen } = useStore();
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const isActiveRef = useRef(isActive);
  const isProcessingRef = useRef(isProcessing);
  const isListeningRef = useRef(isListening);
  const isTranscriptionOpenRef = useRef(isTranscriptionOpen);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isTranscriptionOpenRef.current = isTranscriptionOpen;
    // If transcription is opened, stop voice controller
    if (isTranscriptionOpen && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isTranscriptionOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback('Voice recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback('Listening...');
    };

    recognition.onresult = async (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
      setIsProcessing(true);
      setFeedback('Processing command...');

      window.dispatchEvent(new CustomEvent('app-voice-transcript', { detail: result.toLowerCase().trim() }));

      try {
        const command = await parseVoiceCommand(result);
        if (command) {
          setFeedback(`Executed: ${command.action}`);
          window.dispatchEvent(new CustomEvent('app-voice-command', { detail: command }));
        } else {
          setFeedback("Couldn't understand the command.");
        }
      } catch (error) {
        console.error("Voice command error:", error);
        setFeedback("Error processing command.");
      } finally {
        setIsProcessing(false);
        if (isActiveRef.current && !isTranscriptionOpenRef.current) {
          setTimeout(() => {
            try { 
              if (isActiveRef.current && !isListeningRef.current && !isTranscriptionOpenRef.current) {
                recognition.start(); 
              }
            } catch(e: any) {
              if (e.name !== 'InvalidStateError' && !e.message?.includes('already started')) {
                console.error("Failed to start recognition after processing", e);
              }
            }
          }, 500);
        }
      }
    };

    recognition.onerror = (event: any) => {
      const errorStr = typeof event.error === 'string' ? event.error : (event.error?.message || String(event.error));
      if (errorStr !== 'aborted' && errorStr !== 'no-speech') {
        if (errorStr === 'network') {
          console.warn("Speech recognition network error. The browser's speech service may be unavailable or blocked.");
        } else {
          console.error("Speech recognition error", errorStr);
        }
      }
      setIsListening(false);
      if (errorStr === 'not-allowed') {
        setFeedback('Microphone access denied.');
      } else if (errorStr !== 'aborted' && errorStr !== 'no-speech') {
        setFeedback('Error listening. Try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isActiveRef.current && !isProcessingRef.current && !isTranscriptionOpenRef.current) {
          setTimeout(() => {
            try { 
              if (isActiveRef.current && !isProcessingRef.current && !isTranscriptionOpenRef.current) {
                recognition.start(); 
              }
            } catch(e: any) {
              if (e.name !== 'InvalidStateError' && !e.message?.includes('already started')) {
                console.error("Failed to restart recognition", e);
              }
            }
          }, 500);
      }
    };

    recognitionRef.current = recognition;

    if (isActive && !isTranscriptionOpen) {
      try {
        recognition.start();
      } catch (e: any) {
        if (e.name !== 'InvalidStateError' && !e.message?.includes('already started')) {
          console.error("Failed to start recognition", e);
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isActive]); // Re-run when isActive changes to start/stop cleanly

  if (!isActive) return null;

  return null; // Hide the UI panel as requested
};
