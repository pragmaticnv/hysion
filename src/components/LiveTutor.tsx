import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Bot, Sparkles, Loader2, Waves, MessageSquare, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Theme } from '../types';

import { useStore } from '../store/useStore';

export function LiveTutor() {
  const { activeTopic, setIsLiveTutorOpen, theme } = useStore();
  const onClose = () => setIsLiveTutorOpen(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlayingAudio = useRef(false);

  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const stopAudio = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch (e) {}
      activeSourceRef.current = null;
    }
    audioQueue.current = [];
    isPlayingAudio.current = false;
  }, []);

  const playNextChunk = useCallback(() => {
    if (audioQueue.current.length === 0 || isPlayingAudio.current || !audioContextRef.current) {
      return;
    }

    isPlayingAudio.current = true;
    const chunk = audioQueue.current.shift()!;
    
    const buffer = audioContextRef.current.createBuffer(1, chunk.length, 16000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < chunk.length; i++) {
      channelData[i] = chunk[i] / 32768;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    activeSourceRef.current = source;
    
    source.onended = () => {
      activeSourceRef.current = null;
      isPlayingAudio.current = false;
      playNextChunk();
    };
    source.start();
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const apiKey = process.env['API_KEY'] || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      
      sessionRef.current = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are a helpful and engaging AI Tutor in a 3D holographic classroom. 
          The current topic is ${activeTopic}. 
          Provide personalized, clear, and encouraging explanations. 
          Keep your responses conversational and concise for real-time voice interaction. 
          If the student seems confused, offer simpler analogies. 
          Ask follow-up questions to ensure they understand.
          CRITICAL: Do NOT attempt to trigger hologram generation or use the [GENERATE:] tag in this voice session. Focus entirely on auditory instruction.`,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            startMic();
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              // Stop other colliding audios when AI starts talking
              window.dispatchEvent(new CustomEvent('app:stop-audio', { detail: { source: 'LiveTutor' } }));
              
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  const binaryString = atob(part.inlineData.data);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  const pcmData = new Int16Array(bytes.buffer);
                  audioQueue.current.push(pcmData);
                  playNextChunk();
                }
              }
            }

            if (message.serverContent?.interrupted) {
              stopAudio();
            }

            // Handle transcriptions
            const text = message.serverContent?.modelTurn?.parts?.find(p => p.text)?.text;
            if (text) {
              if (message.serverContent?.modelTurn?.role === 'user') {
                setTranscript(text);
              } else if (message.serverContent?.modelTurn?.role === 'model') {
                setAiResponse(text);
              }
            }
          },
          onclose: () => {
            setIsConnected(false);
            stopMic();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setIsConnecting(false);
          }
        }
      });
    } catch (err) {
      console.error("Failed to connect to Live API:", err);
      setIsConnecting(false);
    }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      sourceRef.current = audioContextRef.current!.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        if (isMuted || !isConnected) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        sessionRef.current?.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
    } catch (err) {
      console.error("Mic access failed:", err);
    }
  };

  const stopMic = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  const endSession = () => {
    sessionRef.current?.close();
    setIsConnected(false);
    stopMic();
    onClose();
  };

  useEffect(() => {
    const handleGlobalStop = (e: any) => {
      if (e.detail?.source !== 'LiveTutor') {
        stopAudio();
      }
    };
    window.addEventListener('app:stop-audio', handleGlobalStop);

    // Pre-initialize AudioContext
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    
    startSession();
    return () => {
      window.removeEventListener('app:stop-audio', handleGlobalStop);
      endSession();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`${theme.uiBg} border border-${theme.primary}/30 rounded-[40px] shadow-[0_0_100px_rgba(99,102,241,0.2)] w-full max-w-2xl overflow-hidden flex flex-col aspect-video relative backdrop-blur-md transition-colors duration-200`}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary-color)_0%,transparent_70%)]`} style={{ '--primary-color': theme.primary === 'indigo-500' ? '#4f46e5' : theme.primary === 'cyan-400' ? '#22d3ee' : theme.primary === 'emerald-400' ? '#34d399' : theme.primary === 'amber-400' ? '#fbbf24' : '#4f46e5' } as any} />
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${theme.primary} to-transparent`} />
        </div>

        {/* Header */}
        <div className="p-8 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-${theme.primary}/20 border border-${theme.primary}/30 flex items-center justify-center text-${theme.primary} shadow-[0_0_30px_rgba(99,102,241,0.3)]`}>
              <BrainCircuit size={28} className={isConnected ? 'animate-pulse' : ''} />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-white tracking-tight">Live AI Tutor</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-600'} animate-pulse`} />
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                  {isConnecting ? 'Establishing Neural Link...' : isConnected ? 'Real-time Session Active' : 'Disconnected'}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={endSession}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Visualization Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
          <div className="relative mb-12">
            {/* Pulsing Rings */}
            <AnimatePresence>
              {isConnected && (
                <>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.1 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className={`absolute inset-0 rounded-full border-2 border-${theme.primary}`}
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0.05 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeOut", delay: 0.5 }}
                    className={`absolute inset-0 rounded-full border-2 border-${theme.primary}`}
                  />
                </>
              )}
            </AnimatePresence>

            <div className="w-48 h-48 rounded-full bg-black/90 border-4 border-white/5 flex items-center justify-center relative overflow-hidden shadow-2xl">
              {isConnecting ? (
                <Loader2 size={64} className={`text-${theme.primary} animate-spin`} />
              ) : (
                <div className="flex items-center gap-1 h-12">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isConnected && !isMuted ? [10, 40, 10] : 10,
                        opacity: isConnected ? 1 : 0.3
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5 + Math.random() * 0.5,
                        delay: i * 0.1
                      }}
                      className={`w-2 bg-${theme.primary} rounded-full`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-center max-w-md">
            <h3 className="text-zinc-400 text-sm font-medium mb-2 uppercase tracking-widest">
              {isConnecting ? 'Syncing with Knowledge Base' : 'Listening for your questions'}
            </h3>
            <p className="text-white text-lg font-medium leading-relaxed italic opacity-80">
              {aiResponse || transcript || "Try asking: \"How does the DNA double helix stay together?\""}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-10 flex justify-center items-center gap-8 relative z-10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border ${
              isMuted 
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                : `bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-${theme.primary}`
            }`}
          >
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          <div className={`px-8 py-4 bg-${theme.primary} rounded-3xl flex items-center gap-4 shadow-[0_0_30px_rgba(79,70,229,0.4)]`}>
            <Waves size={24} className="text-white animate-pulse" />
            <span className="text-white font-bold text-sm uppercase tracking-widest">Live Voice Link</span>
          </div>

          <button
            className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-${theme.primary} transition-all`}
          >
            <Volume2 size={28} />
          </button>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
            Interactive NLP Session • Gemini 2.5 Multimodal Engine
          </p>
        </div>
      </motion.div>
    </div>
  );
}
