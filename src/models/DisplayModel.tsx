import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';;
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { useStore } from '../store/useStore';
import { Captions, Play } from 'lucide-react';
import { Line, Trail } from '../components/SafeLine';

interface DisplayModelProps {
  showLabels?: boolean;
}

export function DisplayModel({ showLabels = true }: DisplayModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  const { isTranscriptionOpen, transcript, interimTranscript } = useStore();
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    // Use Big Buck Bunny as the primary source as requested by user
    video.src = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    
    let fallbackAttempted = 0;
    let playPromise: Promise<void> | undefined;

    video.onerror = () => {
      if (fallbackAttempted === 0) {
        fallbackAttempted = 1;
        console.warn('Big Buck Bunny failed, falling back to local video');
        video.src = '/chip_manufacturing_process.mp4';
        video.load();
      } else if (fallbackAttempted === 1) {
        fallbackAttempted = 2;
        console.warn('Local video failed, falling back to oceans.mp4');
        video.src = 'https://vjs.zencdn.net/v/oceans.mp4';
        video.load();
      } else {
        console.error('All video sources failed to load.');
      }
    };

    video.load();
    
    video.addEventListener('loadedmetadata', () => {
      console.log('Video metadata loaded');
    });
    
    video.addEventListener('canplay', () => {
      if (video.paused) {
        playPromise = video.play();
        playPromise.catch(e => console.warn('Video play failed:', e));
      }
    });
    
    video.addEventListener('playing', () => {
      console.log('Video is playing');
    });

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    setVideoTexture(texture);

    return () => {
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.pause();
          video.removeAttribute('src');
          video.load();
        }).catch((error) => {
          console.warn('Video play was interrupted:', error);
        });
      } else {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      texture.dispose();
    };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 - 0.5;
      groupRef.current.rotation.x = 0.1;
    }
    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }
  });

  const width = 6.8;
  const height = 4;
  const spacing = 0.5;

  const textures = useMemo(() => {
    const createColorFilterTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      const stripeWidth = 512 / 60; 
      for (let i = 0; i < 60; i++) {
        if (i % 3 === 0) ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        else if (i % 3 === 1) ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        else ctx.fillStyle = 'rgba(0, 0, 255, 0.7)';
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, 512);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createTFTTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(200, 200, 200, 0.1)';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 2;
      const gridSize = 32;
      for (let i = 0; i <= 512; i += gridSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
        for (let j = 0; j <= 512; j += gridSize) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
          ctx.fillRect(i - 4, j - 4, 8, 8);
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createPolarizerTexture = (horizontal: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 256; i += 4) {
        ctx.beginPath();
        if (horizontal) {
          ctx.moveTo(0, i); ctx.lineTo(256, i);
        } else {
          ctx.moveTo(i, 0); ctx.lineTo(i, 256);
        }
        ctx.stroke();
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createLiquidCrystalTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(200, 255, 200, 0.3)';
      ctx.fillRect(0, 0, 256, 256);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createPrismTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 256; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, 256);
        ctx.stroke();
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    return {
      colorFilter: createColorFilterTexture(),
      tft: createTFTTexture(),
      polarizerH: createPolarizerTexture(true),
      polarizerV: createPolarizerTexture(false),
      liquidCrystal: createLiquidCrystalTexture(),
      prism: createPrismTexture(),
    };
  }, []);

  const layers = [
    { id: 'top-chassis', name: 'Top Chassis', z: 7 * spacing, type: 'frame', color: '#888888', labelX: -width/2 - 2, labelY: height/2 + 1.2, targetX: -width/2, targetY: height/2 },
    { id: 'top-polarizer', name: 'Top Polarizer', z: 6 * spacing, type: 'sheet', map: textures.polarizerV, transparent: true, opacity: 0.8, labelX: -width/2 - 2, labelY: height/2 + 0.8, targetX: -width/2, targetY: height/2 - 0.2 },
    { id: 'glass-substrate-1', name: 'Glass Substrate', z: 5 * spacing, type: 'glass', labelX: -width/2 - 2, labelY: height/2 + 0.4, targetX: -width/2, targetY: height/2 - 0.4 },
    { id: 'color-filter', name: 'Color Filter (RGB)', z: 4 * spacing, type: 'sheet', map: textures.colorFilter, transparent: true, opacity: 0.9, labelX: -width/2 - 2, labelY: height/2 + 0.0, targetX: -width/2, targetY: height/2 - 0.6 },
    { id: 'common-electrode', name: 'Common Electrode', z: 3 * spacing, type: 'glass', color: '#e0f7fa', opacity: 0.4, labelX: -width/2 - 2, labelY: height/2 - 0.4, targetX: -width/2, targetY: height/2 - 0.8 },
    { id: 'liquid-crystal', name: 'Liquid Crystal', z: 2 * spacing, type: 'sheet', map: textures.liquidCrystal, transparent: true, opacity: 0.8, labelX: -width/2 - 2, labelY: height/2 - 0.8, targetX: -width/2, targetY: height/2 - 1.0 },
    { id: 'tft', name: 'Thin Film Transistor', z: 1 * spacing, type: 'sheet', map: textures.tft, transparent: true, opacity: 0.9, labelX: -width/2 - 2, labelY: height/2 - 1.2, targetX: -width/2, targetY: height/2 - 1.2 },
    
    { id: 'glass-substrate-2', name: 'Glass Substrate', z: 0 * spacing, type: 'glass', labelX: 0, labelY: height/2 + 1.2, targetX: 0, targetY: height/2 },
    { id: 'bottom-polarizer', name: 'Bottom Polarizer', z: -1 * spacing, type: 'sheet', map: textures.polarizerH, transparent: true, opacity: 0.8, labelX: 0.5, labelY: height/2 + 1.5, targetX: 0.5, targetY: height/2 },
    { id: 'prism-sheet', name: 'Prism Sheet', z: -2 * spacing, type: 'sheet', map: textures.prism, transparent: true, opacity: 0.6, labelX: 1.0, labelY: height/2 + 1.8, targetX: 1.0, targetY: height/2 },
    { id: 'diffuser-sheet', name: 'Diffuser Sheet', z: -3 * spacing, type: 'glass', color: '#ffffff', opacity: 0.8, roughness: 0.8, labelX: 1.5, labelY: height/2 + 2.1, targetX: 1.5, targetY: height/2 },
    { id: 'light-guide-plate', name: 'Light Guide Plate', z: -4 * spacing, type: 'thick-glass', labelX: 2.0, labelY: height/2 + 2.4, targetX: 2.0, targetY: height/2 },
    { id: 'reflector-sheet', name: 'Reflector Sheet', z: -5 * spacing, type: 'sheet', color: '#dddddd', metalness: 0.8, roughness: 0.2, labelX: 2.5, labelY: height/2 + 2.7, targetX: 2.5, targetY: height/2 },
    { id: 'bottom-chassis', name: 'Bottom Chassis', z: -6 * spacing, type: 'solid', color: '#666666', labelX: 3.0, labelY: height/2 + 3.0, targetX: 3.0, targetY: height/2 },
  ];

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <group position={[0, 0, 0]}>
        {layers.map((layer, index) => {
          const isHovered = hoveredLayer === layer.id;
          const zOffset = isHovered ? layer.z + 0.3 : layer.z;
          
          return (
            <LayerGroup 
              key={layer.id} 
              layer={layer} 
              zOffset={zOffset} 
              isHovered={isHovered}
              setHoveredLayer={setHoveredLayer}
              videoTexture={videoTexture}
              width={width}
              height={height}
              showLabels={showLabels}
              transcript={transcript}
              interimTranscript={interimTranscript}
              isTranscriptionOpen={isTranscriptionOpen}
            />
          );
        })}
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} />
    </group>
  );
}

function LayerGroup({ layer, zOffset, isHovered, setHoveredLayer, videoTexture, width, height, showLabels, transcript, interimTranscript, isTranscriptionOpen }: any) {
  const { z } = useSpring({
    z: zOffset,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return (
    <animated.group 
      position-z={z}
      onPointerOver={(e) => { e.stopPropagation(); setHoveredLayer(layer.id); }}
      onPointerOut={(e) => { e.stopPropagation(); setHoveredLayer(null); }}
    >
      {layer.type === 'frame' && (
        <group>
          {/* Top */}
          <mesh position={[0, height/2 - 0.1, 0]}>
            <boxGeometry args={[width, 0.2, 0.1]} />
            <meshStandardMaterial color={layer.color} />
          </mesh>
          {/* Bottom */}
          <mesh position={[0, -height/2 + 0.1, 0]}>
            <boxGeometry args={[width, 0.2, 0.1]} />
            <meshStandardMaterial color={layer.color} />
          </mesh>
          {/* Left */}
          <mesh position={[-width/2 + 0.1, 0, 0]}>
            <boxGeometry args={[0.2, height - 0.4, 0.1]} />
            <meshStandardMaterial color={layer.color} />
          </mesh>
          {/* Right */}
          <mesh position={[width/2 - 0.1, 0, 0]}>
            <boxGeometry args={[0.2, height - 0.4, 0.1]} />
            <meshStandardMaterial color={layer.color} />
          </mesh>
          {/* Video Surface inside Top Chassis */}
          {layer.id === 'top-chassis' && videoTexture && (
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[width - 0.4, height - 0.4]} />
              <meshBasicMaterial 
                map={videoTexture} 
                color={videoTexture ? "#ffffff" : "#333333"}
                side={THREE.DoubleSide} 
                toneMapped={false} 
              />
              {isTranscriptionOpen && (
                <Html
                  position={[0, 0, 0.01]}
                  transform
                  distanceFactor={2.5}
                  portal={{ current: document.body }}
                >
                  <div className="w-[600px] p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl text-white font-sans">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Captions size={16} className="animate-pulse" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400/80">Live Transcription</span>
                    </div>
                    <p className="text-2xl font-medium leading-relaxed">
                      {transcript}
                      <span className="text-indigo-400/70 italic ml-2">{interimTranscript}</span>
                    </p>
                  </div>
                </Html>
              )}
              {!isTranscriptionOpen && (
                <Html
                  position={[0, 0, 0.01]}
                  transform
                  distanceFactor={2.5}
                  portal={{ current: document.body }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <button 
                      onClick={() => {
                        const video = videoTexture?.image;
                        if (video) video.play().catch(console.error);
                      }}
                      className="p-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30 transition-all group"
                    >
                      <Play size={32} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Click to Play Video</span>
                  </div>
                </Html>
              )}
            </mesh>
          )}
        </group>
      )}

      {layer.type === 'sheet' && (
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial 
            color={layer.color || '#ffffff'} 
            map={layer.map} 
            transparent={layer.transparent} 
            opacity={layer.opacity || 1}
            roughness={layer.roughness || 0.5}
            metalness={layer.metalness || 0}
          />
        </mesh>
      )}

      {layer.type === 'glass' && (
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshPhysicalMaterial 
            color={layer.color || "#ffffff"} 
            transmission={0.9} 
            transparent 
            roughness={0.1} 
            ior={1.5} 
            thickness={0.5}
          />
        </mesh>
      )}

      {layer.type === 'thick-glass' && (
        <mesh>
          <boxGeometry args={[width, height, 0.5]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={0.9} 
            transparent 
            roughness={0.1} 
            ior={1.5} 
            thickness={0.5}
          />
        </mesh>
      )}

      {layer.type === 'solid' && (
        <mesh>
          <boxGeometry args={[width, height, 0.1]} />
          <meshStandardMaterial color={layer.color} />
        </mesh>
      )}

      {/* LED Strip for Light Guide Plate */}
      {layer.id === 'light-guide-plate' && (
        <group position={[0, -height/2 - 0.1, 0]}>
          <mesh>
            <boxGeometry args={[width, 0.1, 0.2]} />
            <meshStandardMaterial color="#aaaaaa" />
          </mesh>
          {/* LEDs */}
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh key={i} position={[-width/2 + 0.2 + i * (width - 0.4)/14, 0.05, 0]}>
              <boxGeometry args={[0.1, 0.05, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
              <pointLight color="#ffffff" intensity={0.5} distance={2} />
            </mesh>
          ))}
          {showLabels && (
            <>
              <Line 
                points={[[width/2 + 1, -height/2, 0], [width/2, -height/2, 0]]} 
                color={isHovered ? '#22d3ee' : '#ffffff'} 
                lineWidth={1}
                transparent
                opacity={isHovered ? 1 : 0.4}
              />
              <Html position={[width/2 + 1, -height/2, 0]} center className="pointer-events-none">
                <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all duration-300 ${isHovered ? 'bg-blue-500/20 border border-blue-400/50 text-blue-200 scale-110 shadow-[0_0_15px_rgba(96,165,250,0.4)]' : 'bg-black/40 border border-white/20 text-white/90'}`}>
                  LED Strip
                </div>
              </Html>
            </>
          )}
        </group>
      )}

      {/* Labels */}
      {showLabels && layer.labelX !== undefined && (
        <>
          <Line 
            points={[[layer.labelX + (layer.labelX < 0 ? 0.5 : -0.5), layer.labelY, 0], [layer.targetX, layer.targetY, 0]]} 
            color={isHovered ? '#22d3ee' : '#ffffff'} 
            lineWidth={1}
            transparent
            opacity={isHovered ? 1 : 0.4}
          />
          <Html 
            position={[layer.labelX, layer.labelY, 0]} 
            center 
            className="pointer-events-none"
          >
            <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all duration-300 ${isHovered ? 'bg-blue-500/20 border border-blue-400/50 text-blue-200 scale-110 shadow-[0_0_15px_rgba(96,165,250,0.4)]' : 'bg-black/40 border border-white/20 text-white/90'}`}>
              {layer.name}
            </div>
          </Html>
        </>
      )}
    </animated.group>
  );
}
