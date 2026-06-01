import { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Trophy, ArrowRight, HelpCircle, BrainCircuit } from 'lucide-react';
import { Topic, Theme } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface QuizPanelProps {
  activeTopic: Topic;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
  theme: Theme;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_DATA: Record<string, Question[]> = {
  Atom: [
    {
      id: 1,
      text: "What is the central part of an atom called?",
      options: ["Electron Cloud", "Nucleus", "Orbital", "Quark"],
      correctAnswer: 1,
      explanation: "The nucleus is the small, dense region consisting of protons and neutrons at the center of an atom."
    },
    {
      id: 2,
      text: "Which particle has a negative charge?",
      options: ["Proton", "Neutron", "Electron", "Photon"],
      correctAnswer: 2,
      explanation: "Electrons are subatomic particles with a negative elementary electric charge."
    },
    {
      id: 3,
      text: "What determines the atomic number of an element?",
      options: ["Number of neutrons", "Number of electrons", "Number of protons", "Total mass"],
      correctAnswer: 2,
      explanation: "The atomic number is defined by the number of protons in the nucleus of an atom."
    }
  ],
  DNA: [
    {
      id: 1,
      text: "What is the shape of a DNA molecule?",
      options: ["Single Helix", "Double Helix", "Triple Helix", "Circular"],
      correctAnswer: 1,
      explanation: "DNA is structured as a double helix, formed by two nucleotide strands twisted around each other."
    },
    {
      id: 2,
      text: "Which base pairs with Adenine?",
      options: ["Cytosine", "Guanine", "Thymine", "Uracil"],
      correctAnswer: 2,
      explanation: "In DNA, Adenine (A) always pairs with Thymine (T) via two hydrogen bonds."
    },
    {
      id: 3,
      text: "What forms the backbone of DNA?",
      options: ["Sugar and Phosphate", "Nitrogenous Bases", "Hydrogen Bonds", "Amino Acids"],
      correctAnswer: 0,
      explanation: "The DNA backbone is made of alternating sugar (deoxyribose) and phosphate groups."
    }
  ],
  SolarSystem: [
    {
      id: 1,
      text: "Which planet is closest to the Sun?",
      options: ["Venus", "Mars", "Mercury", "Earth"],
      correctAnswer: 2,
      explanation: "Mercury is the smallest and innermost planet in the Solar System."
    },
    {
      id: 2,
      text: "What is the largest planet in our solar system?",
      options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
      correctAnswer: 1,
      explanation: "Jupiter is a gas giant and the largest planet in the Solar System."
    },
    {
      id: 3,
      text: "What is the Sun primarily composed of?",
      options: ["Oxygen and Carbon", "Hydrogen and Helium", "Nitrogen and Oxygen", "Iron and Nickel"],
      correctAnswer: 1,
      explanation: "The Sun is composed primarily of hydrogen (~73%) and helium (~25%)."
    }
  ],
  PeriodicTable: [
    {
      id: 1,
      text: "Which group of elements is known for being highly unreactive?",
      options: ["Alkali Metals", "Halogens", "Noble Gases", "Transition Metals"],
      correctAnswer: 2,
      explanation: "Noble gases have a full outer electron shell, making them very stable and unreactive."
    },
    {
      id: 2,
      text: "What does the atomic number of an element represent?",
      options: ["Number of neutrons", "Total mass", "Number of protons", "Number of isotopes"],
      correctAnswer: 2,
      explanation: "The atomic number is defined by the number of protons in the nucleus of an atom."
    },
    {
      id: 3,
      text: "Which of the following is an alkali metal?",
      options: ["Calcium", "Sodium", "Iron", "Chlorine"],
      correctAnswer: 1,
      explanation: "Sodium (Na) is in Group 1 of the periodic table, which consists of the alkali metals."
    },
    {
      id: 4,
      text: "Which element is the most electronegative on the periodic table?",
      options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"],
      correctAnswer: 2,
      explanation: "Fluorine is the most electronegative element, meaning it has the strongest tendency to attract electrons."
    },
    {
      id: 5,
      text: "What is the only metal that is liquid at room temperature?",
      options: ["Gallium", "Mercury", "Bromine", "Cesium"],
      correctAnswer: 1,
      explanation: "Mercury (Hg) is a transition metal that remains liquid at standard temperature and pressure."
    },
    {
      id: 6,
      text: "Which group contains elements like Fluorine, Chlorine, and Iodine?",
      options: ["Noble Gases", "Alkali Metals", "Halogens", "Alkaline Earth Metals"],
      correctAnswer: 2,
      explanation: "Group 17 elements are known as Halogens, which are highly reactive nonmetals."
    }
  ],
  // Fallback for other topics
  default: [
    {
      id: 1,
      text: "What is the primary purpose of this holographic simulation?",
      options: ["Entertainment", "Education & Visualization", "Gaming", "Social Networking"],
      correctAnswer: 1,
      explanation: "The platform is designed to provide immersive educational visualizations of complex subjects."
    },
    {
      id: 2,
      text: "Which technology powers the 3D rendering?",
      options: ["WebGL", "Flash", "Java Applet", "Silverlight"],
      correctAnswer: 0,
      explanation: "The application uses WebGL (via React Three Fiber) to render high-fidelity 3D graphics in the browser."
    }
  ]
};

import { useStore } from '../store/useStore';

export function QuizPanel() {
  const { activeTopic, setIsQuizOpen, theme } = useStore();
  const onClose = () => setIsQuizOpen(false);
  const onComplete = (score: number, total: number) => {
    console.log(`Quiz complete: ${score}/${total}`);
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = QUIZ_DATA[activeTopic] || QUIZ_DATA['default'];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      onComplete(score, questions.length);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`${theme.uiBg} border ${theme.border} rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] backdrop-blur-md`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${theme.border} flex justify-between items-center bg-gradient-to-r from-${theme.primary}/10 to-transparent`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-${theme.primary}/20 flex items-center justify-center text-${theme.primary} border border-${theme.primary}/30`}>
              <BrainCircuit size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Knowledge Check</h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{activeTopic} Module</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {!showResults ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-${theme.primary}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-white leading-relaxed mb-6">
                    {currentQuestion.text}
                  </h3>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      let buttonClass = "w-full p-4 rounded-xl text-left text-sm font-medium transition-all border ";
                      
                      if (isAnswered) {
                        if (index === currentQuestion.correctAnswer) {
                          buttonClass += "bg-emerald-500/20 border-emerald-500/50 text-emerald-200";
                        } else if (index === selectedOption) {
                          buttonClass += "bg-rose-500/20 border-rose-500/50 text-rose-200";
                        } else {
                          buttonClass += "bg-white/5 border-white/5 text-zinc-500 opacity-50";
                        }
                      } else {
                        buttonClass += "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20 hover:pl-5";
                      }

                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
                          whileTap={!isAnswered ? { scale: 0.99 } : {}}
                          onClick={() => handleAnswer(index)}
                          disabled={isAnswered}
                          className={buttonClass}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {isAnswered && index === currentQuestion.correctAnswer && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <CheckCircle2 size={16} className="text-emerald-400" />
                              </motion.div>
                            )}
                            {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <XCircle size={16} className="text-rose-400" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Explanation & Next Button */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-white/10"
                  >
                    <div className={`bg-${theme.primary}/10 border border-${theme.primary}/20 rounded-xl p-4 mb-4`}>
                      <div className="flex items-start gap-3">
                        <HelpCircle size={16} className={`text-${theme.primary} mt-0.5 shrink-0`} />
                        <p className={`text-xs text-${theme.primary} leading-relaxed opacity-80`}>
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={nextQuestion}
                      className={`w-full py-3 bg-${theme.primary} hover:bg-${theme.primary}/80 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-${theme.primary}/20`}
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                      <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-${theme.primary} to-${theme.secondary} mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]`}>
                <Trophy size={40} className="text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h3>
              <p className="text-zinc-400 mb-8">You demonstrated excellent understanding of the material.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Score</p>
                  <p className="text-3xl font-bold text-white">{score} / {questions.length}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Accuracy</p>
                  <p className={`text-3xl font-bold ${score === questions.length ? 'text-emerald-400' : `text-${theme.primary}`}`}>
                    {Math.round((score / questions.length) * 100)}%
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={restartQuiz}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
                >
                  Retry Quiz
                </button>
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 bg-${theme.primary} hover:bg-${theme.primary}/80 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-${theme.primary}/20 transition-all`}
                >
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
