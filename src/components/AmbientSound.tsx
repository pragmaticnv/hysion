import { useEffect, useRef } from 'react';
import { Topic } from '../types';

const createNoiseBuffer = (ctx: AudioContext, duration: number = 2) => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
};

interface AmbientSoundProps {
  activeTopic: Topic;
  isEnabled: boolean;
}

export function AmbientSound({ activeTopic, isEnabled }: AmbientSoundProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);

  // Handle Enable/Disable and Topic Changes
  useEffect(() => {
    const setup = async () => {
      if (isEnabled) {
        // Initialize if not exists
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Master Gain
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0, ctx.currentTime);
          masterGain.connect(ctx.destination);
          masterGainRef.current = masterGain;

          // Create Synthetic Reverb
          const reverb = ctx.createConvolver();
          reverb.buffer = createImpulseResponse(ctx, 2, 2.0);
          reverb.connect(masterGain);
          reverbNodeRef.current = reverb;
        }

        const ctx = audioCtxRef.current;
        const masterGain = masterGainRef.current;

        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // Fade in - High volume
        masterGain.gain.setTargetAtTime(1.0, ctx.currentTime, 0.5);
        
        // Setup new sound
        cleanup();
        setupSoundForTopic(activeTopic, ctx, masterGain, reverbNodeRef.current);
      } else {
        if (masterGainRef.current && audioCtxRef.current) {
          masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.3);
          setTimeout(cleanup, 400);
        }
      }
    };

    setup();

    return () => {
      // We don't close the context here to allow quick toggling, 
      // but we do cleanup nodes.
      cleanup();
    };
  }, [isEnabled, activeTopic]);

  // Separate cleanup effect for unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const cleanup = () => {
    nodesRef.current.forEach(node => {
      if (node instanceof AudioScheduledSourceNode) {
        try { node.stop(); } catch (e) { /* ignore */ }
      }
      try { node.disconnect(); } catch (e) { /* ignore */ }
    });
    nodesRef.current = [];
  };

  const registerNode = (node: AudioNode) => {
    nodesRef.current.push(node);
    return node;
  };

  const createImpulseResponse = (ctx: AudioContext, duration: number, decay: number) => {
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      // Exponential decay
      const e = Math.pow(1 - n, decay);
      left[i] = (Math.random() * 2 - 1) * e;
      right[i] = (Math.random() * 2 - 1) * e;
    }
    return impulse;
  };

  const setupSoundForTopic = (
    topic: Topic, 
    ctx: AudioContext, 
    destination: AudioNode, 
    reverb: AudioNode | null
  ) => {
    const output = reverb || destination; // Route through reverb if available

    switch (topic) {
      case 'HumanHeart': {
        const bpm = 72;
        const duration = 60 / bpm; // ~0.833s
        const sampleRate = ctx.sampleRate;
        const buffer = ctx.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
          const t = i / sampleRate;
          
          // Lub (S1) - Closure of AV valves
          const lubT = 0.0;
          if (t >= lubT && t < lubT + 0.2) {
            const dt = t - lubT;
            const env = Math.pow(Math.sin(Math.PI * dt / 0.2), 2) * Math.exp(-dt * 12);
            // Ultra-realistic low thump
            data[i] += env * Math.sin(2 * Math.PI * 40 * (1 + dt * 0.3)) * 1.5;
            data[i] += env * Math.sin(2 * Math.PI * 80 * (1 + dt * 0.5)) * 0.6;
            data[i] += env * Math.sin(2 * Math.PI * 120 * (1 + dt)) * 0.2;
            // Fluid turbulence
            data[i] += env * (Math.random() * 2 - 1) * 0.3;
          }
          
          // Dub (S2) - Closure of semilunar valves
          const dubT = 0.28;
          if (t >= dubT && t < dubT + 0.15) {
            const dt = t - dubT;
            const env = Math.pow(Math.sin(Math.PI * dt / 0.15), 2) * Math.exp(-dt * 15);
            // Sharper, slightly higher pitch
            data[i] += env * Math.sin(2 * Math.PI * 60 * (1 + dt * 0.5)) * 1.2;
            data[i] += env * Math.sin(2 * Math.PI * 110 * (1 + dt * 0.8)) * 0.5;
            data[i] += env * Math.sin(2 * Math.PI * 180 * (1 + dt)) * 0.15;
            // Valve snap
            data[i] += env * (Math.random() * 2 - 1) * 0.4;
          }

          // Deep visceral rumble (blood flow)
          data[i] += (Math.random() * 2 - 1) * 0.02;
        }
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200; // Keep it muffled for realism
        
        const gain = ctx.createGain();
        gain.gain.value = 3.0; // Boosted for visceral feel

        source.connect(filter).connect(gain).connect(output);
        source.start();
        registerNode(source); registerNode(filter); registerNode(gain);
        break;
      }
      case 'BlackHole': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 40;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 100;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.1;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 20;
        lfo.connect(lfoGain).connect(osc.frequency);
        const gain = ctx.createGain();
        gain.gain.value = 0.8;
        osc.connect(filter).connect(gain).connect(output);
        osc.start(); lfo.start();
        registerNode(osc); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'Drone': {
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.value = 180;
        const osc2 = ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.value = 182;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        const gain = ctx.createGain();
        gain.gain.value = 0.2;
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain).connect(output);
        osc1.start(); osc2.start();
        registerNode(osc1); registerNode(osc2); registerNode(filter); registerNode(gain);
        break;
      }
      case 'Atom': {
        // Nucleus hum + electron whirs
        const nucleus = ctx.createOscillator();
        nucleus.type = 'triangle';
        nucleus.frequency.value = 40;
        const nucGain = ctx.createGain(); nucGain.gain.value = 0.5;
        nucleus.connect(nucGain).connect(output);

        // Electron cloud (high frequency phasey noise)
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        noise.loop = true;

        const phaser = ctx.createBiquadFilter();
        phaser.type = 'allpass';
        phaser.frequency.value = 1000;

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.5;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 800;
        lfo.connect(lfoGain).connect(phaser.frequency);

        const cloudGain = ctx.createGain(); cloudGain.gain.value = 0.15;
        noise.connect(phaser).connect(cloudGain).connect(output);

        nucleus.start(); noise.start(); lfo.start();
        registerNode(nucleus); registerNode(nucGain); registerNode(noise); registerNode(phaser); registerNode(lfo); registerNode(lfoGain); registerNode(cloudGain);
        break;
      }
      case 'DNA': {
        // Watery / Organic
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 110;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // Slow breathing
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain).connect(filter.frequency);

        const gain = ctx.createGain();
        gain.gain.value = 0.5; // Increased

        osc.connect(filter).connect(gain).connect(output);
        osc.start(); lfo.start();
        registerNode(osc); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'AnimalCell': {
        // Watery / Organic
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        
        // Slow modulation like fluid
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 100;
        lfo.connect(lfoGain).connect(filter.frequency);

        const gain = ctx.createGain();
        gain.gain.value = 0.4;

        noise.connect(filter).connect(gain).connect(output);
        noise.start(); lfo.start();
        registerNode(noise); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'SolarSystem': {
        // Vast, majestic, slightly eerie deep space
        const drone1 = ctx.createOscillator(); drone1.type = 'sine'; drone1.frequency.value = 32.7; // C1
        const drone2 = ctx.createOscillator(); drone2.type = 'sine'; drone2.frequency.value = 49.0; // G1

        const droneGain = ctx.createGain(); droneGain.gain.value = 0.5;
        drone1.connect(droneGain).connect(output);
        drone2.connect(droneGain).connect(output);

        // Solar wind (sweeping bandpass noise)
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        noise.loop = true;

        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 200;
        windFilter.Q.value = 0.5;

        const windLfo = ctx.createOscillator();
        windLfo.type = 'sine';
        windLfo.frequency.value = 0.05;
        const windLfoGain = ctx.createGain(); windLfoGain.gain.value = 150;
        windLfo.connect(windLfoGain).connect(windFilter.frequency);

        const windGain = ctx.createGain(); windGain.gain.value = 0.3;
        noise.connect(windFilter).connect(windGain).connect(output);

        drone1.start(); drone2.start(); noise.start(); windLfo.start();
        registerNode(drone1); registerNode(drone2); registerNode(droneGain);
        registerNode(noise); registerNode(windFilter); registerNode(windLfo); registerNode(windLfoGain); registerNode(windGain);
        break;
      }
      case 'QuantumPhysics': {
        // Ethereal, probabilistic quantum foam
        const createQuantumParticle = (freq: number, rate: number) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const gain = ctx.createGain();
            gain.gain.value = 0;

            // Use a slow square wave to trigger "particles"
            const lfo = ctx.createOscillator();
            lfo.type = 'square';
            lfo.frequency.value = rate;

            // Smooth the square wave slightly
            const lfoFilter = ctx.createBiquadFilter();
            lfoFilter.type = 'lowpass';
            lfoFilter.frequency.value = 10;

            lfo.connect(lfoFilter).connect(gain.gain);

            const panner = ctx.createStereoPanner();
            panner.pan.value = Math.random() * 2 - 1;

            osc.connect(gain).connect(panner).connect(output);
            osc.start(); lfo.start();
            registerNode(osc); registerNode(gain); registerNode(lfo); registerNode(lfoFilter); registerNode(panner);
        };

        createQuantumParticle(880, 0.5);
        createQuantumParticle(1200, 0.73);
        createQuantumParticle(2400, 0.31);
        createQuantumParticle(440, 0.19);

        // Background void
        const voidOsc = ctx.createOscillator();
        voidOsc.type = 'sine';
        voidOsc.frequency.value = 50;
        const voidGain = ctx.createGain(); voidGain.gain.value = 0.2;
        voidOsc.connect(voidGain).connect(output);
        voidOsc.start();
        registerNode(voidOsc); registerNode(voidGain);
        break;
      }
      case 'OrganicChemistry': {
         // Bubbling
         const bufferSize = ctx.sampleRate * 2;
         const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
         const data = buffer.getChannelData(0);
         for (let i = 0; i < bufferSize; i++) {
             data[i] = Math.random() * 2 - 1;
         }
         const noise = ctx.createBufferSource();
         noise.buffer = buffer;
         noise.loop = true;

         const filter = ctx.createBiquadFilter();
         filter.type = 'peaking';
         filter.Q.value = 10;
         filter.frequency.value = 600;
         
         // Sample and Hold style modulation (approximated with fast LFOs)
         const lfo = ctx.createOscillator();
         lfo.type = 'sawtooth';
         lfo.frequency.value = 8;
         const lfoGain = ctx.createGain();
         lfoGain.gain.value = 400;
         lfo.connect(lfoGain).connect(filter.frequency);

         const gain = ctx.createGain();
         gain.gain.value = 0.25; // Increased

         noise.connect(filter).connect(gain).connect(output);
         noise.start(); lfo.start();
         registerNode(noise); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
         break;
      }
      case 'CrystalLattice': {
        // Glassy / Crystalline
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C major chord
        freqs.forEach((f) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = f;
            
            const gain = ctx.createGain();
            gain.gain.value = 0.15 / freqs.length; // Increased
            
            osc.connect(gain).connect(output);
            osc.start();
            registerNode(osc); registerNode(gain);
        });
        break;
      }
      case 'Fractals': {
        // Recursive delays
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 300;
        
        const delay = ctx.createDelay();
        delay.delayTime.value = 0.3;
        
        const feedback = ctx.createGain();
        feedback.gain.value = 0.6;
        
        delay.connect(feedback).connect(delay);
        
        const gain = ctx.createGain();
        gain.gain.value = 0.3; // Increased
        
        // LFO to modulate frequency for "movement"
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.05;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 50;
        lfo.connect(lfoGain).connect(osc.frequency);

        osc.connect(delay).connect(gain).connect(output);
        osc.connect(gain); // Direct signal too
        
        osc.start(); lfo.start();
        registerNode(osc); registerNode(delay); registerNode(feedback); registerNode(gain); registerNode(lfo); registerNode(lfoGain);
        break;
      }
      case 'Geometry': {
        // Pure Harmony
        [261.63, 329.63, 392.00].forEach(f => { // C Major
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = f;
            const gain = ctx.createGain();
            gain.gain.value = 0.15; // Increased
            osc.connect(gain).connect(output);
            osc.start();
            registerNode(osc); registerNode(gain);
        });
        break;
      }
      case 'AncientRome': {
        // Wind
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        // Modulate filter for wind gusts
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain).connect(filter.frequency);
        
        const gain = ctx.createGain();
        gain.gain.value = 0.3; // Increased
        
        noise.connect(filter).connect(gain).connect(output);
        noise.start(); lfo.start();
        registerNode(noise); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'Missile': {
        // Jet propulsion roar
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        noise.loop = true;

        // Deep roar
        const lowFilter = ctx.createBiquadFilter();
        lowFilter.type = 'lowpass';
        lowFilter.frequency.value = 200;
        const lowGain = ctx.createGain(); lowGain.gain.value = 0.8;

        // High hiss
        const highFilter = ctx.createBiquadFilter();
        highFilter.type = 'highpass';
        highFilter.frequency.value = 2000;
        const highGain = ctx.createGain(); highGain.gain.value = 0.3;

        // Modulate the roar for turbulence
        const turbLfo = ctx.createOscillator();
        turbLfo.type = 'sine';
        turbLfo.frequency.value = 12;
        const turbGain = ctx.createGain();
        turbGain.gain.value = 50;
        turbLfo.connect(turbGain).connect(lowFilter.frequency);

        noise.connect(lowFilter).connect(lowGain).connect(output);
        noise.connect(highFilter).connect(highGain).connect(output);

        // Sub rumble
        const sub = ctx.createOscillator();
        sub.type = 'triangle';
        sub.frequency.value = 35;
        const subGain = ctx.createGain(); subGain.gain.value = 0.6;
        sub.connect(subGain).connect(output);

        noise.start(); turbLfo.start(); sub.start();
        registerNode(noise); registerNode(lowFilter); registerNode(lowGain); registerNode(highFilter); registerNode(highGain);
        registerNode(turbLfo); registerNode(turbGain); registerNode(sub); registerNode(subGain);
        break;
      }
      case 'Engine': {
        // V12 Engine Idle
        const baseFreq = 45; // ~900 RPM for a V12
        const osc1 = ctx.createOscillator(); osc1.type = 'sawtooth'; osc1.frequency.value = baseFreq;
        const osc2 = ctx.createOscillator(); osc2.type = 'sawtooth'; osc2.frequency.value = baseFreq * 1.5; // Perfect fifth for V12 growl
        const osc3 = ctx.createOscillator(); osc3.type = 'square'; osc3.frequency.value = baseFreq * 2; // Octave

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        filter.Q.value = 2;

        // Engine pulse (RPM)
        const pulseLfo = ctx.createOscillator();
        pulseLfo.type = 'sine';
        pulseLfo.frequency.value = baseFreq / 3; // Firing rate
        const pulseGain = ctx.createGain();
        pulseGain.gain.value = 0.5;
        pulseLfo.connect(pulseGain.gain);

        const masterEngineGain = ctx.createGain();
        masterEngineGain.gain.value = 0.6;

        osc1.connect(filter); osc2.connect(filter); osc3.connect(filter);
        filter.connect(pulseGain).connect(masterEngineGain).connect(output);

        // Exhaust hiss
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        noise.loop = true;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 800;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.1;
        pulseLfo.connect(noiseGain.gain); // Pulse the exhaust hiss too
        noise.connect(noiseFilter).connect(noiseGain).connect(output);

        osc1.start(); osc2.start(); osc3.start(); pulseLfo.start(); noise.start();
        registerNode(osc1); registerNode(osc2); registerNode(osc3); registerNode(filter); registerNode(pulseLfo); registerNode(pulseGain); registerNode(masterEngineGain);
        registerNode(noise); registerNode(noiseFilter); registerNode(noiseGain);
        break;
      }
      case 'Pyramid': {
        // Desert wind
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 300;
        filter.Q.value = 0.5;
        
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.1;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 150;
        lfo.connect(lfoGain).connect(filter.frequency);
        
        const gain = ctx.createGain();
        gain.gain.value = 0.3;
        
        noise.connect(filter).connect(gain).connect(output);
        noise.start(); lfo.start();
        registerNode(noise); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'Cell':
      case 'Microscope': {
        // Fluid / microscopic ambient
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 150;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 50;
        lfo.connect(lfoGain).connect(filter.frequency);

        const gain = ctx.createGain();
        gain.gain.value = 0.4;

        osc.connect(filter).connect(gain).connect(output);
        osc.start(); lfo.start();
        registerNode(osc); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'AircraftAerodynamics': {
        // High-speed wind tunnel
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        noise.loop = true;

        // Multiple sweeping bandpass filters for swirling wind
        const createWindLayer = (baseFreq: number, lfoRate: number, lfoDepth: number, gainVal: number) => {
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = baseFreq;
            filter.Q.value = 1.5;

            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = lfoRate;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = lfoDepth;
            lfo.connect(lfoGain).connect(filter.frequency);

            const gain = ctx.createGain();
            gain.gain.value = gainVal;

            noise.connect(filter).connect(gain).connect(output);
            lfo.start();
            registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        };

        createWindLayer(400, 0.1, 200, 0.4);
        createWindLayer(1200, 0.15, 600, 0.2);
        createWindLayer(3000, 0.05, 1000, 0.1);

        noise.start();
        registerNode(noise);
        break;
      }
      case 'Plasma': {
        // 60Hz hum + aggressive crackle
        const hum = ctx.createOscillator();
        hum.type = 'sawtooth';
        hum.frequency.value = 60;
        const humFilter = ctx.createBiquadFilter();
        humFilter.type = 'lowpass';
        humFilter.frequency.value = 150;
        const humGain = ctx.createGain(); humGain.gain.value = 0.3;
        hum.connect(humFilter).connect(humGain).connect(output);

        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        noise.loop = true;

        const crackleFilter = ctx.createBiquadFilter();
        crackleFilter.type = 'bandpass';
        crackleFilter.frequency.value = 4000;
        crackleFilter.Q.value = 5;

        // Erratic LFO for crackle
        const lfo1 = ctx.createOscillator(); lfo1.type = 'square'; lfo1.frequency.value = 12;
        const lfo2 = ctx.createOscillator(); lfo2.type = 'sawtooth'; lfo2.frequency.value = 17;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 0; // Base is 0

        // Combine LFOs to make it erratic
        lfo1.connect(lfoGain.gain);
        lfo2.connect(lfoGain.gain);

        const crackleMasterGain = ctx.createGain();
        crackleMasterGain.gain.value = 0.8;

        noise.connect(crackleFilter).connect(lfoGain).connect(crackleMasterGain).connect(output);

        hum.start(); noise.start(); lfo1.start(); lfo2.start();
        registerNode(hum); registerNode(humFilter); registerNode(humGain);
        registerNode(noise); registerNode(crackleFilter); registerNode(lfo1); registerNode(lfo2); registerNode(lfoGain); registerNode(crackleMasterGain);
        break;
      }
      case 'MillikanOilDrop':
      case 'Display':
      case 'FingerprintSensor': {
        // High-tech lab hum
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 120;
        
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 240;

        const gain = ctx.createGain();
        gain.gain.value = 0.1;

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(output);
        
        osc.start(); osc2.start();
        registerNode(osc); registerNode(osc2); registerNode(gain);
        break;
      }
      case 'JetEngine': {
        // Massive roar and high-pitched whine
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        noise.loop = true;
        
        const roarFilter = ctx.createBiquadFilter();
        roarFilter.type = 'lowpass';
        roarFilter.frequency.value = 300;
        const roarGain = ctx.createGain(); roarGain.gain.value = 0.8;
        
        const whineOsc = ctx.createOscillator();
        whineOsc.type = 'sawtooth';
        whineOsc.frequency.value = 3500;
        const whineFilter = ctx.createBiquadFilter();
        whineFilter.type = 'bandpass';
        whineFilter.frequency.value = 3500;
        const whineGain = ctx.createGain(); whineGain.gain.value = 0.1;

        noise.connect(roarFilter).connect(roarGain).connect(output);
        whineOsc.connect(whineFilter).connect(whineGain).connect(output);
        
        noise.start(); whineOsc.start();
        registerNode(noise); registerNode(roarFilter); registerNode(roarGain);
        registerNode(whineOsc); registerNode(whineFilter); registerNode(whineGain);
        break;
      }
      case 'JamesWebb': {
        // Deep space silence with ethereal hum
        const osc1 = ctx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 43.65; // F1
        const osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = 65.41; // C2
        
        const gain = ctx.createGain(); gain.gain.value = 0.3;
        
        const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.05;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.1;
        lfo.connect(lfoGain.gain);
        
        osc1.connect(gain); osc2.connect(gain);
        gain.connect(output);
        
        osc1.start(); osc2.start(); lfo.start();
        registerNode(osc1); registerNode(osc2); registerNode(gain); registerNode(lfo); registerNode(lfoGain);
        break;
      }
      case 'NuclearReactor': {
        // Deep, powerful 60Hz hum and water flow
        const hum = ctx.createOscillator(); hum.type = 'sawtooth'; hum.frequency.value = 60;
        const humFilter = ctx.createBiquadFilter(); humFilter.type = 'lowpass'; humFilter.frequency.value = 120;
        const humGain = ctx.createGain(); humGain.gain.value = 0.4;
        
        const noise = ctx.createBufferSource(); noise.buffer = createNoiseBuffer(ctx); noise.loop = true;
        const waterFilter = ctx.createBiquadFilter(); waterFilter.type = 'lowpass'; waterFilter.frequency.value = 800;
        const waterGain = ctx.createGain(); waterGain.gain.value = 0.15;

        hum.connect(humFilter).connect(humGain).connect(output);
        noise.connect(waterFilter).connect(waterGain).connect(output);
        
        hum.start(); noise.start();
        registerNode(hum); registerNode(humFilter); registerNode(humGain);
        registerNode(noise); registerNode(waterFilter); registerNode(waterGain);
        break;
      }
      case 'MarsRover': {
        // Martian wind and servo whines
        const noise = ctx.createBufferSource(); noise.buffer = createNoiseBuffer(ctx); noise.loop = true;
        const windFilter = ctx.createBiquadFilter(); windFilter.type = 'bandpass'; windFilter.frequency.value = 400; windFilter.Q.value = 1;
        const windGain = ctx.createGain(); windGain.gain.value = 0.2;
        
        const servo = ctx.createOscillator(); servo.type = 'square'; servo.frequency.value = 1200;
        const servoFilter = ctx.createBiquadFilter(); servoFilter.type = 'bandpass'; servoFilter.frequency.value = 1200;
        const servoGain = ctx.createGain(); servoGain.gain.value = 0.02;
        
        const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.5;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 200;
        lfo.connect(lfoGain).connect(servo.frequency);

        noise.connect(windFilter).connect(windGain).connect(output);
        servo.connect(servoFilter).connect(servoGain).connect(output);
        
        noise.start(); servo.start(); lfo.start();
        registerNode(noise); registerNode(windFilter); registerNode(windGain);
        registerNode(servo); registerNode(servoFilter); registerNode(servoGain); registerNode(lfo); registerNode(lfoGain);
        break;
      }
      case 'Tornado': {
        // Violent rushing wind
        const noise = ctx.createBufferSource(); noise.buffer = createNoiseBuffer(ctx); noise.loop = true;
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 300;
        
        const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.8;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 200;
        lfo.connect(lfoGain).connect(filter.frequency);
        
        const gain = ctx.createGain(); gain.gain.value = 0.8;
        
        noise.connect(filter).connect(gain).connect(output);
        noise.start(); lfo.start();
        registerNode(noise); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'Volcano': {
        // Deep, explosive rumble
        const noise = ctx.createBufferSource(); noise.buffer = createNoiseBuffer(ctx); noise.loop = true;
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 80;
        
        const lfo = ctx.createOscillator(); lfo.type = 'sawtooth'; lfo.frequency.value = 2;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 40;
        lfo.connect(lfoGain).connect(filter.frequency);
        
        const gain = ctx.createGain(); gain.gain.value = 0.9;
        
        noise.connect(filter).connect(gain).connect(output);
        noise.start(); lfo.start();
        registerNode(noise); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'Rainforest': {
        // High-frequency insect/bird-like chirps and wind
        const noise = ctx.createBufferSource(); noise.buffer = createNoiseBuffer(ctx); noise.loop = true;
        const windFilter = ctx.createBiquadFilter(); windFilter.type = 'bandpass'; windFilter.frequency.value = 1500; windFilter.Q.value = 0.5;
        const windGain = ctx.createGain(); windGain.gain.value = 0.1;
        
        const chirpOsc = ctx.createOscillator(); chirpOsc.type = 'sine'; chirpOsc.frequency.value = 3000;
        const chirpLfo = ctx.createOscillator(); chirpLfo.type = 'sawtooth'; chirpLfo.frequency.value = 4;
        const chirpLfoGain = ctx.createGain(); chirpLfoGain.gain.value = 1000;
        chirpLfo.connect(chirpLfoGain).connect(chirpOsc.frequency);
        
        const chirpGain = ctx.createGain(); chirpGain.gain.value = 0.05;
        
        noise.connect(windFilter).connect(windGain).connect(output);
        chirpOsc.connect(chirpGain).connect(output);
        
        noise.start(); chirpOsc.start(); chirpLfo.start();
        registerNode(noise); registerNode(windFilter); registerNode(windGain);
        registerNode(chirpOsc); registerNode(chirpLfo); registerNode(chirpLfoGain); registerNode(chirpGain);
        break;
      }
      case 'Desert': {
        // Dry, sweeping wind
        const noise = ctx.createBufferSource(); noise.buffer = createNoiseBuffer(ctx); noise.loop = true;
        const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 600; filter.Q.value = 0.8;
        
        const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.15;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 300;
        lfo.connect(lfoGain).connect(filter.frequency);
        
        const gain = ctx.createGain(); gain.gain.value = 0.25;
        
        noise.connect(filter).connect(gain).connect(output);
        noise.start(); lfo.start();
        registerNode(noise); registerNode(filter); registerNode(lfo); registerNode(lfoGain); registerNode(gain);
        break;
      }
      case 'Custom':
      case 'Upload':
      case 'Saved': {
        // Ethereal Pad
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 220;
        
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 222; // Detuned

        const gain = ctx.createGain();
        gain.gain.value = 0.3; // Increased

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(output);
        
        osc.start(); osc2.start();
        registerNode(osc); registerNode(osc2); registerNode(gain);
        break;
      }
      default:
        break;
    }
  };

  return null;
}
