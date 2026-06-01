import { useState, useRef, useEffect, useCallback } from 'react';
import { Topic, Theme } from '../types';
import { X, Send, Bot, User, Sparkles, Loader2, Wand2, Play, Square, Volume2, Mic, Waves, Pause, ChevronDown, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AdvancedConfig } from '../models/CustomModel';
import { chatWithAI, chatWithAIStream, generateSpeechStream, summarizeChat } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

import { useStore } from '../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export function AIPanel() {
  const { 
    activeTopic, 
    setIsAIPanelOpen, 
    theme, 
    setHologramConfig, 
    setActiveTopic, 
    setIsLiveTutorOpen 
  } = useStore();

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (messages.length < 2) return;
    setIsSummarizing(true);
    const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
    const result = await summarizeChat(chatHistory);
    if (result) {
      const summaryMsg: Message = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10),
        role: 'ai',
        content: `### 📝 Session Summary\n\n${result}`
      };
      setMessages(prev => [...prev, summaryMsg]);
    }
    setIsSummarizing(false);
  };

  const onClose = () => setIsAIPanelOpen(false);
  const onGenerateHologram = (config: any) => setHologramConfig(config);
  const onSwitchTopic = (topic: Topic) => setActiveTopic(topic);
  const onStartLiveTutor = () => setIsLiveTutorOpen(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hello! I'm your AI tutor. I can help explain concepts, answer any questions you have, or generate custom 3D holograms for your lessons. What would you like to explore today?`
    }
  ]);
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const isStoppingRef = useRef(false);
  const audioQueue = useRef<Float32Array[]>([]);
  const isPlayingAudio = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioGenerationQueue = useRef<Promise<void>>(Promise.resolve());
  const ttsQuotaExhausted = useRef(false);
  const stopAudio = useCallback(() => {
    console.log("Stopping audio...");
    isStoppingRef.current = true;
    
    // Stop any current source immediately
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {}
      currentSourceRef.current = null;
    }

    // Cancel browser TTS
    window.speechSynthesis.cancel();
    
    isPlayingAudio.current = false;
    setIsPaused(false);
    setPlayingMessageId(null);
    setIsGeneratingAudio(null);
    
    // Small timeout to ensure all async operations see the stopping flag
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 10);
  }, []);

  const pauseAudio = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeAudio = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    stopAudio();
  }, [stopAudio]);

  const speakText = useCallback((text: string) => {
    if (isStoppingRef.current) return;

    const cleanText = text
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/`/g, '')
      .replace(/~/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[^\x00-\x7F]/g, '');

    if (cleanText.trim().length === 0) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) || 
                           voices.find(v => v.lang.includes('en')) || 
                           voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.1; 
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (!isStoppingRef.current) {
        setIsPaused(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    const handleGlobalStop = (e: any) => {
      if (e.detail?.source !== 'AIPanel') {
        stopAudio();
      }
    };
    window.addEventListener('app:stop-audio', handleGlobalStop);

    return () => {
      console.log("AIPanel unmounting, stopping audio...");
      window.removeEventListener('app:stop-audio', handleGlobalStop);
      stopAudio();
    };
  }, [stopAudio]);

  const handlePlayAudio = async (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      if (isPaused) {
        resumeAudio();
      } else {
        pauseAudio();
      }
      return;
    }

    // Stop others
    window.dispatchEvent(new CustomEvent('app:stop-audio', { detail: { source: 'AIPanel' } }));
    stopAudio();

    setPlayingMessageId(messageId);
    speakText(text);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processAIResponse = async (prompt: string) => {
    if (isLoading) return;

    // Stop any currently playing audio
    window.dispatchEvent(new CustomEvent('app:stop-audio', { detail: { source: 'AIPanel' } }));
    await stopAudio();
    
    abortControllerRef.current = new AbortController();
    
    const userMsg: Message = { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10), role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiMsgId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10);
    const aiMsg: Message = {
      id: aiMsgId,
      role: 'ai',
      content: ''
    };
    setMessages(prev => [...prev, aiMsg]);
    setPlayingMessageId(aiMsgId); // Set as playing immediately

    try {
      const history = messagesRef.current.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      const stream = chatWithAIStream(history, prompt, getTopicName(activeTopic));
      
      let fullText = "";
      let sentenceBuffer = "";
      
      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) break;
        fullText += chunk;
        sentenceBuffer += chunk;
        
        // Update UI with partial text
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: fullText } : m));

        // Advanced Sentence/Phrase Detection
        // We scan for punctuation to split chunks for faster audio feedback
        const punctuationRegex = /[.!?,,;:]/g;
        let match;
        let splitIndex = -1;

        while ((match = punctuationRegex.exec(sentenceBuffer)) !== null) {
          const index = match.index;
          const char = match[0];
          
          // Check if followed by space or end of string (to avoid splitting numbers like 3.14)
          if (index + 1 < sentenceBuffer.length) {
            const nextChar = sentenceBuffer[index + 1];
            if (!/\s/.test(nextChar)) {
              continue; 
            }
          }

          const segment = sentenceBuffer.substring(0, index + 1);
          
          // Check 1: Abbreviation protection (only for dot)
          if (char === '.') {
            const lastWord = segment.slice(0, -1).trim().split(/\s+/).pop();
            if (lastWord && ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'St', 'Vs', 'e.g', 'i.e', 'etc'].includes(lastWord)) {
              continue;
            }
          }
          
          // Check 2: Weak punctuation (comma, semicolon, colon)
          // Only split if the segment is long enough to be a coherent phrase
          if ([',', ';', ':'].includes(char)) {
            if (segment.length < 15) { 
              continue;
            }
          }
          
          // Check 3: Strong punctuation (. ! ?)
          // Allow short answers like "Yes." but avoid noise
          if (['.', '!', '?'].includes(char)) {
             if (segment.trim().length < 2) { 
                 continue; 
             }
          }
          
          // If we pass all checks, this is a valid split point
          splitIndex = index + 1;
          break; // Stop at the first valid split to preserve order
        }

        if (splitIndex !== -1) {
          const sentence = sentenceBuffer.substring(0, splitIndex);
          // Remove the processed sentence from buffer
          sentenceBuffer = sentenceBuffer.substring(splitIndex).trimStart();
          
          // Speak this sentence using local TTS
          speakText(sentence);
        }
      }

      // Process any remaining text in buffer as the final sentence
      if (sentenceBuffer.trim()) {
        speakText(sentenceBuffer);
      }
      
      // Check for generation command in the full text
      const genMatch = fullText.match(/\[GENERATE:\s*(\{.*?\})\s*\]/s);
      if (genMatch) {
        try {
          const parsedConfig = JSON.parse(genMatch[1]);
          
          if (parsedConfig.prompt) {
            // Generate full config
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: m.content + "\n\n*Initializing Gemini Hologram API...*" } : m));
            
            import('../services/geminiService').then(async ({ generateHologramConfig }) => {
              const fullConfig = await generateHologramConfig(parsedConfig.prompt);
              
              onGenerateHologram({
                ...fullConfig,
                prompt: parsedConfig.prompt
              });
              onSwitchTopic('Custom');
            });
          } else {
            onGenerateHologram(parsedConfig);
            onSwitchTopic('Custom');
          }
          
          // Optional: Clean up the text to remove the JSON command
          const cleanText = fullText.replace(/\[GENERATE:\s*\{.*?\}\s*\]/s, "").trim();
          if (cleanText) {
             setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: cleanText } : m));
          }
        } catch (e) {
          console.error("Failed to parse generation config", e);
        }
      }

    } catch (error) {
      console.error("Failed to generate AI response:", error);
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: m.content + "\n\n(Connection interrupted)" } : m));
    } finally {
      setIsLoading(false);
      // We don't clear playingMessageId here because audio might still be draining from queue
    }
  };

  const handleGeneratePrompt = (prompt: string) => {
    processAIResponse(prompt);
  };

  const handleGeneratePromptRef = useRef(handleGeneratePrompt);
  useEffect(() => {
    handleGeneratePromptRef.current = handleGeneratePrompt;
  });

  // Listen for guided lesson event
  useEffect(() => {
    const handleStartGuidedLesson = () => {
      handleGeneratePromptRef.current("Start a guided lesson on this topic. Teach me step-by-step and ask me questions to test my understanding.");
    };
    window.addEventListener('start-guided-lesson', handleStartGuidedLesson);
    return () => window.removeEventListener('start-guided-lesson', handleStartGuidedLesson);
  }, []);

  // Reset chat when topic changes
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10),
        role: 'ai',
        content: `I see you're now looking at the ${getTopicName(activeTopic)}. What specific part would you like me to explain, or would you like me to generate a custom hologram related to this? You can also ask me anything else!`
      }
    ]);
  }, [activeTopic]);

  const handleSend = () => {
    if (!input.trim()) return;
    processAIResponse(input);
  };

  function getTopicName(topic: Topic) {
    switch (topic) {
      case 'Atom': return 'Atomic Structure';
      case 'DNA': return 'DNA Double Helix';
      case 'SolarSystem': return 'Solar System';
      case 'QuantumPhysics': return 'Quantum Physics';
      case 'OrganicChemistry': return 'Organic Chemistry';
      case 'CrystalLattice': return 'Crystal Lattice';
      case 'Drone': return 'Drone Mechanics';
      case 'BlackHole': return 'Black Holes';
      case 'Cell': return 'Cell Biology';
      case 'Engine': return 'Combustion Engine';
      case 'JetEngine': return 'Turbofan Jet Engine';
      case 'JamesWebb': return 'James Webb Space Telescope';
      case 'NuclearReactor': return 'Nuclear Reactor';
      case 'MarsRover': return 'Mars Rover';
      case 'Tornado': return 'Tornado Dynamics';
      case 'Volcano': return 'Volcanic Eruption';
      default: return 'current module';
    }
  }

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setInput(finalTranscript);
          handleGeneratePromptRef.current(finalTranscript);
        } else if (interimTranscript) {
          setInput(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        const errorStr = typeof event.error === 'string' ? event.error : (event.error?.message || String(event.error));
        if (errorStr === 'network') {
          console.warn("Speech recognition network error. The browser's speech service may be unavailable or blocked.");
        } else if (errorStr === 'not-allowed' || errorStr === 'service-not-allowed') {
          console.warn("Microphone permission denied.");
        } else if (errorStr !== 'aborted' && errorStr !== 'no-speech') {
          console.error("Speech recognition error", errorStr);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e: any) {
        if (e.name === 'InvalidStateError' || e.message.includes('already started')) {
          setIsListening(true);
        } else {
          console.error("Failed to start recognition", e);
          alert("Failed to start voice input. Please check microphone permissions.");
          setIsListening(false);
        }
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className={`fixed inset-y-0 right-0 w-full sm:w-[400px] crystal-glass border-l ${theme.border} flex flex-col h-full z-50 shadow-[-40px_0_100px_rgba(0,0,0,0.6)] transition-all duration-300 rounded-l-[3.5rem] safe-right`}>
      <div className={`p-6 border-b ${theme.border} flex items-center justify-between bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent mb-2 safe-top`}>
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse group-hover:scale-150 transition-transform" />
            <Bot size={24} className="relative z-10" />
          </motion.div>
          <div>
            <h3 className={`text-[12px] font-black ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-900' : 'text-white'} uppercase tracking-[0.2em] ${theme.id === 'white' || theme.id === 'ios-light' ? '' : 'text-glow'}`}>Neural Tutor v5</h3>
            <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-2 mt-1 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,1)] animate-pulse"></span>
              Quantum Sync Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSummarize}
            disabled={isSummarizing || messages.length < 2}
            className={`p-2.5 rounded-xl transition-all ${isSummarizing ? 'text-indigo-400 animate-pulse' : 'text-zinc-400 hover:text-indigo-400 border border-white/5'}`}
            title="Summarize Session"
          >
            <Sparkles size={18} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-white/5"
          >
            <X size={18} />
          </motion.button>
        </div>
      </div>

      <div 
        onScroll={handleScroll}
        className="flex-1 relative overflow-y-auto p-6 space-y-7 custom-scrollbar scroll-smooth"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: msg.role === 'user' ? 40 : -40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                type: 'spring',
                damping: 30,
                stiffness: 200,
                delay: idx === messages.length - 1 ? 0 : idx * 0.05
              }}
              key={msg.id} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center shrink-0 mt-1 shadow-2xl border ${
                msg.role === 'user' 
                  ? 'liquid-glass border-white/20 text-indigo-400' 
                  : 'bg-gradient-to-br from-indigo-600/20 to-purple-800/20 text-white border-white/10'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
            <div className={`relative group max-w-[85%]`}>
                <div className={`px-5 py-4 rounded-[1.8rem] text-[13px] leading-relaxed shadow-2xl border transition-all duration-300 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-tr-none border-white/30'
                    : `crystal-glass text-zinc-200 rounded-tl-none border-white/10 group-hover:border-indigo-500/30`
                }`}>
                  {msg.role === 'ai' ? (
                    <div className={`markdown-body prose prose-invert prose-sm max-w-none prose-headings:text-glow prose-strong:text-indigo-400 whitespace-pre-wrap font-medium`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-bold tracking-tight">{msg.content}</p>
                  )}
                </div>
              
                {msg.role === 'ai' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-0 flex gap-2 opacity-0 transition-opacity"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePlayAudio(msg.id, msg.content)}
                      disabled={isGeneratingAudio !== null && isGeneratingAudio !== msg.id}
                      className="px-4 py-2 rounded-full liquid-glass text-zinc-400 hover:text-white border border-white/10 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest shadow-2xl"
                    >
                      {isGeneratingAudio === msg.id ? (
                        <Loader2 size={12} className="animate-spin text-indigo-400" />
                      ) : playingMessageId === msg.id ? (
                        isPaused ? <><Play size={10} className="text-emerald-400" fill="currentColor" /> Resume</> : <><Pause size={10} className="text-indigo-400" fill="currentColor" /> Pause</>
                      ) : <><Volume2 size={12} className="text-indigo-400" /> Read Aloud</>}
                    </motion.button>
                  </motion.div>
                )}
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className={`w-7 h-7 rounded-lg bg-${theme.primary}/10 text-${theme.primary} border border-${theme.primary}/20 flex items-center justify-center shrink-0 mt-1`}>
              <Bot size={14} />
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/[0.02] rounded-tl-sm border border-white/5 flex items-center gap-2">
              <Loader2 size={14} className={`animate-spin text-${theme.primary}`} />
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Neural Processing...</span>
              <button 
                onClick={stopGeneration}
                className="ml-2 p-1 hover:bg-white/10 rounded-md text-rose-400 transition-colors"
                title="Stop generation"
              >
                <StopCircle size={14} />
              </button>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={scrollToBottom}
              className={`absolute bottom-6 right-6 p-2 rounded-full bg-${theme.primary} text-white shadow-lg shadow-${theme.primary}/20 z-50 hover:scale-110 transition-transform`}
            >
              <ChevronDown size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="p-7 crystal-glass border-t border-white/10 rounded-t-[3.5rem] mt-auto safe-bottom">
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { id: 'live', label: 'Live Voice', icon: Waves, action: onStartLiveTutor, color: 'indigo-500' },
            { id: 'guided', label: 'Step-by-Step', icon: Bot, action: () => handleGeneratePromptRef.current("Start a guided lesson on this topic."), color: 'emerald-500' },
            { id: 'holo', label: 'Create Hologram', icon: Wand2, action: () => handleGeneratePromptRef.current("Generate a 3D hologram of this concept."), color: 'purple-500' }
          ].map((chip) => (
            <motion.button
              key={chip.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={chip.action}
              className={`px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black text-zinc-300 transition-all uppercase tracking-widest flex items-center gap-2`}
            >
              <chip.icon size={12} className={chip.id === 'live' ? 'animate-pulse text-indigo-400' : `text-${chip.color}`} />
              {chip.label}
            </motion.button>
          ))}
        </div>

        <div className="relative flex items-center gap-3 liquid-glass p-2 rounded-[2.5rem] border-white/20 shadow-2xl">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            className={`p-4 rounded-full transition-all border ${
              isListening 
                ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.6)]' 
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
          </motion.button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target?.value || '')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Query Neural Tutor..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white text-[14px] font-bold py-3 px-3 placeholder:text-white/20 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em]"
            disabled={isLoading}
          />

          <motion.button
            whileHover={{ scale: 1.08, rotate: -45 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-4 rounded-full transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl'
                : 'bg-white/5 text-zinc-700 pointer-events-none'
            }`}
          >
            <Send size={20} />
          </motion.button>
        </div>
        <p className="text-center text-[8px] text-zinc-600 mt-4 font-black uppercase tracking-[0.3em]">
          Powered by Gemini Quantum Forge • v5.0.2
        </p>
      </div>
    </aside>
  );
}
