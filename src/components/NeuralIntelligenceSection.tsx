import React from 'react';
import { Volume2, StopCircle } from 'lucide-react';
import { useHoloAudio } from '../hooks/useHoloAudio';

const levels = {
  beginner: {
    title: "Beginner: Neural Intelligence & Relativity",
    text: "Neural Intelligence in the context of relativity refers to the use of advanced machine learning models to simulate and understand the complex behavior of spacetime. At this level, we look at how neural networks can learn to predict the motion of objects in gravitational fields, effectively 'learning' the laws of physics from data rather than being explicitly programmed with them. This approach allows us to model complex systems where traditional analytical solutions might be too computationally expensive or mathematically intractable. For example, a neural network can be trained on the trajectories of planets and stars to predict their future positions with high accuracy, even in systems with multiple interacting bodies where the three-body problem makes exact solutions impossible. This 'data-driven' physics is revolutionizing how we approach celestial mechanics and orbital dynamics.",
  },
  intermediate: {
    title: "Intermediate: Modeling Spacetime Curvature",
    text: "Moving to the intermediate level, we explore how neural networks can be trained to approximate the solutions to Einstein's field equations. By training on large datasets of known spacetime geometries—such as those around black holes or neutron stars—these models can learn to map the distribution of mass and energy to the curvature of spacetime. This is particularly useful for visualizing how gravity bends light and affects the fabric of spacetime in real-time, providing a powerful tool for both research and education. These models, often referred to as 'Physics-Informed Neural Networks' (PINNs), incorporate the actual physical laws into their loss functions, ensuring that their predictions don't just 'look' right, but actually satisfy the underlying differential equations of general relativity. This allows for the rapid generation of complex gravitational lensing simulations that would otherwise take hours on a supercomputer, enabling interactive exploration of extreme gravitational environments.",
  },
  advanced: {
    title: "Advanced: Solving Field Equations & Gravitational Waves",
    text: "At the advanced level, Neural Intelligence is used to solve the most challenging problems in general relativity, such as predicting the precise gravitational wave signatures from binary black hole mergers. These neural models can process massive amounts of numerical relativity data to identify patterns that are invisible to traditional methods. Furthermore, they are being used to explore quantum gravity, attempting to bridge the gap between general relativity and quantum mechanics by learning the underlying structure of spacetime at the Planck scale. This represents the cutting edge of computational physics. In the field of multi-messenger astronomy, deep learning algorithms are now essential for the real-time detection of gravitational wave events by LIGO and Virgo, filtering out noise from environmental sources to find the faint signals of cosmic collisions. Beyond detection, these networks are helping to perform 'parameter estimation,' instantly calculating the masses and spins of the merging objects, a task that previously required weeks of intensive computation. This is paving the way for a new era of 'AI-assisted' discovery in the deepest reaches of the universe.",
  }
};

export const NeuralIntelligenceSection = () => {
  const [playingText, setPlayingText] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlayAudio = (text: string) => {
    if (playingText === text) {
      window.speechSynthesis.cancel();
      setPlayingText(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    // Clean text for speech
    const cleanText = text.trim();
    
    // Split text into smaller chunks for more reliable speech synthesis in some browsers
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    
    setPlayingText(text);

    let currentSentence = 0;

    const speakNext = () => {
      if (currentSentence >= sentences.length) {
        setPlayingText(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[currentSentence].trim());
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) || 
                             voices.find(v => v.lang.includes('en')) || 
                             voices[0];
      
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        currentSentence++;
        speakNext();
      };

      utterance.onerror = () => {
        setPlayingText(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  return (
    <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-300 mb-6">Neural Intelligence in Relativity</h2>
      <div className="space-y-6">
        {Object.entries(levels).map(([key, level]) => (
          <div key={key} className="p-4 bg-black/40 rounded-lg border border-cyan-500/10 group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">{level.title}</h3>
              <button
                onClick={() => handlePlayAudio(level.text)}
                className={`p-2 rounded-lg transition-all ${playingText === level.text ? 'bg-cyan-500 text-white' : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}`}
                title={playingText === level.text ? "Stop Audio" : "Play Audio Explanation"}
              >
                {playingText === level.text ? <StopCircle size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{level.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
