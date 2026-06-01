import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars, Html, Float, Grid, Stats, TransformControls, Text, RoundedBox, AdaptiveDpr, AdaptiveEvents, Preload, PerformanceMonitor, Detailed, Bounds } from '@react-three/drei';;
import React, { Suspense, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpring, animated, useTransition } from '@react-spring/three';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration, DepthOfField, BrightnessContrast } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { XR, createXRStore, useXR, useXRSessionModeSupported, XROrigin, TeleportTarget, DefaultXRController, DefaultXRHand } from '@react-three/xr';
import Webcam from 'react-webcam';
import { Topic, Theme } from '../types';
import { RenderLimiter } from './RenderLimiter';
import { GestureHandler } from './GestureHandler';
import { Physics, useSphere, usePlane } from '@react-three/cannon';
import { AtomModel } from '../models/AtomModel';
import { GlobeModel, COUNTRIES, latLonToVector3 } from '../models/GlobeModel';
import { DNAModel } from '../models/DNAModel';
import { SolarSystemModel } from '../models/SolarSystemModel';
import { CustomModel, AdvancedConfig } from '../models/CustomModel';
import { UploadedModel } from '../models/UploadedModel';
import { CrystalLattice } from '../models/CrystalLattice';
import { QuantumPhysicsModel } from '../models/QuantumPhysicsModel';
import { OrganicChemistryModel } from '../models/OrganicChemistryModel';
import { ColosseumModel } from '../models/ColosseumModel';
import { GeometryModel } from '../models/GeometryModel';
import { CalculusModel } from '../models/CalculusModel';
import { FractalModel } from '../models/FractalModel';
import { HeartModel } from '../models/HeartModel';
import { MicroscopeModel } from '../models/MicroscopeModel';
import { DroneModel } from '../models/DroneModel';
import { PyramidModel } from '../models/PyramidModel';
import { BlackHoleModel } from '../models/BlackHoleModel';
import { CellModel } from '../models/CellModel';
import { EngineModel } from '../models/EngineModel';
import { MillikanOilDrop } from '../models/MillikanOilDrop';
import { MissileModel } from '../models/MissileModel';
import { AnimalCellModel } from '../models/AnimalCellModel';
import { DisplayModel } from '../models/DisplayModel';
import { AircraftAerodynamicsModel } from '../models/AircraftAerodynamicsModel';
import { PlasmaBallModel } from '../models/PlasmaBallModel';
import { FingerprintModel } from '../models/FingerprintModel';
import { JetEngineModel } from '../models/JetEngineModel';
import { JamesWebbModel } from '../models/JamesWebbModel';
import { NuclearReactorModel } from '../models/NuclearReactorModel';
import { MarsRoverModel } from '../models/MarsRoverModel';
import { VolcanoModel } from '../models/VolcanoModel';
import { SatelliteModel } from '../models/SatelliteModel';
import { DysonSphereModel } from '../models/DysonSphereModel';
import { AdvancedMedicalBody } from '../models/AdvancedMedicalBody';
import { useHoloAudio } from '../hooks/useHoloAudio';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ErrorBoundary } from './ErrorBoundary';
import { io, Socket } from 'socket.io-client';
import { analyzeObjectFromCamera } from '../services/geminiService';
import { NeuralIntelligencePanel } from './NeuralIntelligencePanel';
import { CoursePanel } from './CoursePanel';
import { AerodynamicsPanel } from './AerodynamicsPanel';
import { DEFAULT_THEME } from '../constants/themes';
import { Maximize, ChevronDown, ChevronUp, Scan, BookOpen, Hand, Play, Square, Pause, Settings2, Globe, Glasses, Mic, Bot, Sparkles, BrainCircuit, Box, Captions, BarChart, ArrowLeft, X } from 'lucide-react';


import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Line, Trail } from './SafeLine';
import { SpatialMathService } from '../services/spatialMathService';

function LaserPointer({ enabled, theme }: { enabled: boolean, theme: Theme }) {
  const { raycaster, mouse, camera, scene } = useThree();
  const laserRef = useRef<THREE.Group>(null);
  const lineRef = useRef<any>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const [intersectPoint, setIntersectPoint] = useState<THREE.Vector3 | null>(null);

  const lastRaycastTime = useRef(0);
  const raycastInterval = 32; // ~30fps raycasting for laser

  useFrame((state) => {
    if (!enabled) {
      if (intersectPoint) setIntersectPoint(null);
      return;
    }

    const now = state.clock.getElapsedTime() * 1000;
    if (now - lastRaycastTime.current < raycastInterval) return;
    lastRaycastTime.current = now;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Filter out the laser itself and other UI elements
    const validIntersects = intersects.filter(hit => 
      hit.object.type === 'Mesh' && 
      hit.object !== dotRef.current && 
      hit.object.name !== 'laser-line' &&
      !hit.object.name.includes('Grid') &&
      !hit.object.name.includes('Stars')
    );

    if (validIntersects.length > 0) {
      const hit = validIntersects[0];
      setIntersectPoint(hit.point);
    } else {
      setIntersectPoint(null);
    }
  });

  if (!enabled || !intersectPoint) return null;

  // Calculate laser start position (offset from camera in world space)
  const laserStart = new THREE.Vector3(0.2, -0.2, -0.5);
  laserStart.applyMatrix4(camera.matrixWorld);

  // Ensure we have valid points for Line
  const points = [laserStart, intersectPoint];

  return (
    <group ref={laserRef}>
      <Line
        points={points}
        color={theme.primary === 'amber-500' ? '#f59e0b' : '#ef4444'}
        lineWidth={1.5}
        transparent
        opacity={0.6}
        name="laser-line"
      />
      <mesh position={intersectPoint} ref={dotRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial 
          color={theme.primary === 'amber-500' ? '#fbbf24' : '#ff0000'} 
          toneMapped={false}
        />
        <pointLight 
          color={theme.primary === 'amber-500' ? '#fbbf24' : '#ff0000'} 
          intensity={2} 
          distance={2} 
        />
      </mesh>
    </group>
  );
}

function DrawingSystem({ theme }: { theme: Theme }) {
  const { camera } = useThree();
  const [strokes, setStrokes] = useState<THREE.Vector3[][]>([]);
  const [currentPoint, setCurrentPoint] = useState<THREE.Vector3 | null>(null);
  const currentStroke = useRef<THREE.Vector3[]>([]);
  const anchorRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const handleDraw = (e: any) => {
      const { x, y, isPinching } = e.detail;
      
      // Map normalized coordinates to 3D space
      const vector = new THREE.Vector3(
        (x * 2 - 1),
        -(y * 2 - 1),
        0.5
      );
      
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = 12; 
      const point = camera.position.clone().add(dir.multiplyScalar(distance));

      if (isPinching) {
        setCurrentPoint(point);
        // Throttle points to avoid excessive geometry
        if (currentStroke.current.length === 0 || 
            currentStroke.current[currentStroke.current.length - 1].distanceTo(point) > 0.1) {
          currentStroke.current.push(point);
        }
      } else {
        if (currentStroke.current.length > 1) {
          setStrokes(prev => [...prev, [...currentStroke.current]]);
        }
        currentStroke.current = [];
        setCurrentPoint(null);
      }
    };

    const handleClear = () => {
      setStrokes([]);
      currentStroke.current = [];
      setCurrentPoint(null);
    };

    window.addEventListener('gesture-draw', handleDraw as EventListener);
    window.addEventListener('gesture-draw-clear', handleClear as EventListener);
    return () => {
      window.removeEventListener('gesture-draw', handleDraw as EventListener);
      window.removeEventListener('gesture-draw-clear', handleClear as EventListener);
    };
  }, [camera]);

  useFrame(() => {
    if (currentPoint && anchorRef.current) {
      anchorRef.current.position.copy(currentPoint);
    }
  });

  return (
    <group>
      {strokes.filter(s => s.length >= 2).map((stroke, i) => (
        <Line
          key={i}
          points={stroke}
          color={theme.primary === 'amber-500' ? '#f59e0b' : '#22d3ee'}
          lineWidth={2.5}
          transparent
          opacity={0.7}
        />
      ))}
      {currentPoint && (
        <Trail
          width={4}
          color={theme.primary === 'amber-500' ? '#fbbf24' : '#00ffff'}
          length={8}
          decay={1}
          local={false}
        >
          <mesh ref={anchorRef} visible={false}>
            <sphereGeometry args={[0.01]} />
          </mesh>
        </Trail>
      )}
    </group>
  );
}

function XRLighting() {
  const theme = useStore(state => state.theme);
  const isLight = ['white', 'ios-light'].includes(theme.id);

  return (
    <>
      <ambientLight intensity={isLight ? 1.2 : 0.5} />
      <spotLight 
        position={[10, 15, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={isLight ? 100 : 60} 
        castShadow 
        shadow-bias={-0.0001}
        color={isLight ? "#ffffff" : "#ffffff"}
      />
      <pointLight position={[-10, 5, -10]} intensity={isLight ? 30 : 20} color={isLight ? "#4f46e5" : "#00ffff"} distance={30} />
      <pointLight position={[10, -5, 10]} intensity={isLight ? 20 : 10} color={isLight ? "#ec4899" : "#ff00ff"} distance={30} />
      <directionalLight position={[0, 10, 5]} intensity={isLight ? 3 : 2} color={isLight ? "#fff4e0" : "#ffffff"} />
      <hemisphereLight intensity={isLight ? 0.8 : 0.5} groundColor="black" />
    </>
  );
}
function XREnvironment() {
  return <Environment preset="city" environmentIntensity={0.3} />;
}

function XRBackgroundHandler({ theme, isMobile }: { theme: Theme, isMobile: boolean }) {
  const session = useXR(state => state.session);
  const isAR = (session as any)?.mode === 'immersive-ar' || useStore(state => state.isARMode);

  if (isAR) return null;

  const isLightTheme = theme.id === 'white' || theme.id === 'ios-light';

  return (
    <>
      <color attach="background" args={[
        isLightTheme ? '#F2F2F7' : 
        theme.bg.includes('black') ? '#000000' : 
        theme.bg.includes('zinc-950') ? '#09090b' : 
        '#020203'
      ]} />
      <ContactShadows 
        position={[0, -6, 0]} 
        opacity={isLightTheme ? 0.15 : 0.4} 
        scale={30} 
        blur={2.5} 
        far={10} 
        resolution={isMobile ? 256 : 512} 
        color={isLightTheme ? "#000000" : "#000000"} 
      />
      {theme.pattern === 'grid' && (
        <Grid 
          position={[0, -6.01, 0]} 
          args={[60, 60]} 
          sectionColor={theme.glow} 
          cellColor={isLightTheme ? "#d1d1d6" : "#0a0a0a"} 
          sectionSize={5} 
          cellSize={1} 
          fadeDistance={40} 
          infiniteGrid 
        />
      )}
      {theme.pattern === 'hex' && (
        <Grid 
          position={[0, -6.01, 0]} 
          args={[60, 60]} 
          sectionColor={theme.glow} 
          cellColor={isLightTheme ? "#d1d1d6" : "#0a0a0a"} 
          sectionSize={10} 
          cellSize={2} 
          fadeDistance={40} 
          infiniteGrid 
        />
      )}
    </>
  );
}

function DynamicBackground({ activeTopic, theme, isMobile }: { activeTopic: Topic, theme: Theme, isMobile: boolean }) {
  const starsRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const session = useXR(state => state.session);
  const isARMode = useStore(state => state.isARMode);
  const isAR = (session as any)?.mode === 'immersive-ar' || isARMode;

  useFrame((state) => {
    if (isAR) return;
    // Throttling: Only update background every 2 frames
    if (state.clock.elapsedTime % 0.032 > 0.016) return;

    const time = state.clock.getElapsedTime();

    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.01;
      starsRef.current.rotation.x = Math.sin(time * 0.05) * 0.02;
      
      starsRef.current.children.forEach((child, index) => {
        const parallaxFactor = (index + 1) * 0.15;
        child.position.x = THREE.MathUtils.lerp(child.position.x, state.camera.position.x * -parallaxFactor, 0.1);
        child.position.y = THREE.MathUtils.lerp(child.position.y, state.camera.position.y * -parallaxFactor, 0.1);
        child.position.z = THREE.MathUtils.lerp(child.position.z, state.camera.position.z * -parallaxFactor, 0.1);
      });
    }

    if (glowRef.current) {
      const scale = 15 + Math.sin(time * 0.5) * 1.5;
      glowRef.current.scale.set(scale, scale, scale);
      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = 0.03 + Math.sin(time * 0.5) * 0.01;
      }
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02;
    }
  });

  const isLightTheme = theme.id === 'white' || theme.id === 'ios-light';
  if (isAR || isLightTheme) return null;

  return (
    <group>
      {activeTopic === 'SolarSystem' && !isLightTheme && (
        <group ref={starsRef}>
          <Stars radius={50} depth={50} count={isMobile ? 500 : 2500} factor={4} saturation={0} fade speed={1} />
          <Stars radius={100} depth={50} count={isMobile ? 500 : 2500} factor={6} saturation={0} fade speed={1.5} />
          <Stars radius={150} depth={50} count={isMobile ? 500 : 2000} factor={8} saturation={0} fade speed={2} />
        </group>
      )}

      {(activeTopic === 'Atom' || theme.id !== 'deep-space') && (
        <mesh ref={glowRef} visible={false}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial 
            color={theme.glow} 
            transparent 
            opacity={0} 
            side={THREE.BackSide} 
          />
        </mesh>
      )}

      {(activeTopic === 'DNA' || activeTopic === 'Custom' || activeTopic.startsWith('custom-') || theme.pattern === 'dots') && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={isMobile ? 200 : 500}
              array={new Float32Array(Array.from({ length: isMobile ? 600 : 1500 }, () => (Math.random() - 0.5) * 40))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            size={0.05} 
            color={theme.glow} 
            transparent 
            opacity={0.15} 
            sizeAttenuation 
          />
        </points>
      )}
    </group>
  );
}

interface Viewer3DProps {
  activeTopic: Topic;
  customConfig?: AdvancedConfig;
  uploadedModel?: string | null;
  uploadedModelExplanation?: string | null;
  topicExplanation?: string | null;
  toggleCourse: () => void;
  toggleQuiz: () => void;
  detailLevel: 'basic' | 'detailed' | 'expert';
  setDetailLevel: (level: 'basic' | 'detailed' | 'expert') => void;
  language: string;
  setLanguage: (lang: string) => void;
  onGenerateExplanation: () => void;
  onSelectTopic: (topic: Topic) => void;
  isVoiceActive: boolean;
  isAppStarted: boolean;
  isSoundEnabled: boolean;
  theme: Theme;
  isMobile?: boolean;
}

function VRButton({ 
  label, 
  onClick, 
  isActive, 
  position, 
  args = [0.9, 0.2, 0.02] 
}: { 
  label: string, 
  onClick: (e: any) => void, 
  isActive?: boolean, 
  position: [number, number, number],
  args?: [number, number, number]
}) {
  const [hovered, setHovered] = useState(false);
  
  const springs = useSpring({
    scale: hovered ? 1.05 : 1,
    color: isActive ? "#4f46e5" : hovered ? "#374151" : "#1f2937",
    emissive: isActive ? "#4f46e5" : hovered ? "#1f2937" : "#000000",
    emissiveIntensity: isActive ? 0.5 : hovered ? 0.3 : 0.1,
    config: { mass: 1, tension: 300, friction: 30 }
  });
  
  return (
    <animated.group 
      position={position} 
      scale={springs.scale}
      onClick={(e: any) => {
        e.stopPropagation();
        onClick(e);
      }}
      onPointerEnter={(e: any) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={(e: any) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <RoundedBox args={args} radius={0.02}>
        <animated.meshStandardMaterial 
          color={springs.color}
          emissive={springs.emissive}
          emissiveIntensity={springs.emissiveIntensity}
        />
      </RoundedBox>
      <Text 
        position={[0, 0, args[2] / 2 + 0.005]} 
        fontSize={args[1] * 0.4} 
        color={isActive || hovered ? "#ffffff" : "#9ca3af"} 
        anchorX="center" 
        anchorY="middle"
      >
        {label}
      </Text>
    </animated.group>
  );
}

function VRMenu({ 
  activeTopic, 
  onSelectTopic,
  onResetModel
}: { 
  activeTopic: Topic, 
  onSelectTopic: (topic: Topic) => void,
  onResetModel: () => void
}) {
  const mode = useXR(state => state.mode);
  const isVR = mode === 'immersive-vr';
  if (!isVR) return null;

  const topics: Topic[] = ['Atom', 'SolarSystem', 'DNA', 'Pyramid', 'HumanHeart', 'QuantumPhysics', 'Drone'];

  return (
    <group position={[0, 1.2, -1.5]} rotation={[-0.1, 0, 0]}>
      {/* Main Menu Panel */}
      <RoundedBox args={[2.2, 1.8, 0.05]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.85} roughness={0.2} metalness={0.8} />
      </RoundedBox>
      
      {/* Header */}
      <Text position={[0, 0.7, 0.03]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
        HOLO-DECK
      </Text>
      
      <Text position={[0, 0.55, 0.03]} fontSize={0.05} color="#818cf8" anchorX="center" anchorY="middle">
        SYSTEM ONLINE
      </Text>

      {/* Topic Grid */}
      <group position={[-0.5, 0.3, 0.03]}>
        {topics.map((topic, i) => {
          const x = (i % 2) * 1.0;
          const y = -Math.floor(i / 2) * 0.25;
          return (
            <VRButton 
              key={topic}
              label={topic}
              position={[x, y, 0]}
              isActive={activeTopic === topic}
              onClick={() => onSelectTopic(topic)}
            />
          );
        })}
        
        {/* Reset Button */}
        <VRButton 
          label="Reset Model"
          position={[0.5, -1.0, 0]}
          args={[2.0, 0.2, 0.02]}
          onClick={onResetModel}
        />
      </group>

      {/* Footer Instructions */}
      <Text position={[0, -0.7, 0.03]} fontSize={0.04} color="#71717a" anchorX="center" anchorY="middle">
        GESTURE CONTROL ACTIVE • VOICE COMMAND READY
      </Text>
      <Text position={[0, -0.78, 0.03]} fontSize={0.035} color="#818cf8" anchorX="center" anchorY="middle">
        Use Trigger to Select • Use Thumbstick to Teleport
      </Text>
    </group>
  );
}

function CameraAnimator({ 
  focusTarget, 
  controlsRef 
}: { 
  focusTarget: { position: THREE.Vector3, target: THREE.Vector3 } | null, 
  controlsRef: React.RefObject<any> 
}) {
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (focusTarget && controlsRef.current) {
      // Use professional dampening for camera transitions
      // This provides a much smoother 'settling' effect than simple LERP
      camera.position.copy(
        SpatialMathService.dampVector(camera.position, focusTarget.position, 4, delta)
      );
      
      controlsRef.current.target.copy(
        SpatialMathService.dampVector(controlsRef.current.target, focusTarget.target, 4, delta)
      );
      
      controlsRef.current.update();
    }
  });

  return null;
}

function PhysicsFloor() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -6, 0] }), useRef<THREE.Mesh>(null));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}

function MouseSphere() {
  const { viewport, mouse, raycaster, camera } = useThree();
  const [ref, api] = useSphere(() => ({ type: 'Kinematic', args: [1.5], position: [0, 0, 0] }), useRef<THREE.Mesh>(null));
  
  useFrame(() => {
    // Project mouse onto a plane at z=0
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    api.position.set(x, y, 0);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial transparent opacity={0.1} color="#3b82f6" />
    </mesh>
  );
}

function VRFloor() {
  const mode = useXR(state => state.mode);
  const isVR = mode === 'immersive-vr';
  if (!isVR) return null;

  return (
    <group position={[0, -6, 0]}>
      <Grid 
        args={[100, 100]} 
        sectionColor="#4f46e5" 
        cellColor="#1e1b4b" 
        sectionSize={5} 
        cellSize={1} 
        fadeDistance={50} 
        infiniteGrid 
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[20, 64]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

// --- Multiplayer ---
let socket: Socket | null = null;
if (typeof window !== 'undefined') {
  socket = io(window.location.origin);
}

function MultiplayerSync({ 
  activeTopic, 
  onSelectTopic 
}: { 
  activeTopic: Topic, 
  onSelectTopic: (topic: Topic) => void 
}) {
  const { camera } = useThree();
  const [users, setUsers] = useState<Record<string, { id: string, position: [number, number, number], rotation: [number, number, number] }>>({});
  const lastEmitTime = useRef(0);
  const emitInterval = 50; // 20fps sync is plenty for smooth movement with interpolation
  
  useEffect(() => {
    if (!socket) return;

    socket.on("init", (data) => {
      if (data && typeof data === 'object') {
        if (data.users && typeof data.users === 'object' && data.users !== null) {
          setUsers(data.users);
        }
        if (data.currentTopic && data.currentTopic !== activeTopic) {
          onSelectTopic(data.currentTopic as Topic);
        }
      }
    });

    socket.on("user:joined", (user) => {
      setUsers(prev => ({ ...prev, [user.id]: user }));
    });

    socket.on("user:moved", (user) => {
      setUsers(prev => ({ ...prev, [user.id]: user }));
    });

    socket.on("user:left", (id) => {
      setUsers(prev => {
        const newUsers = { ...prev };
        delete newUsers[id];
        return newUsers;
      });
    });

    socket.on("topic:changed", (topic) => {
      if (topic !== activeTopic) {
        onSelectTopic(topic as Topic);
      }
    });

    return () => {
      socket?.off("init");
      socket?.off("user:joined");
      socket?.off("user:moved");
      socket?.off("user:left");
      socket?.off("topic:changed");
    };
  }, [activeTopic, onSelectTopic]);

  const lastPos = useRef(new THREE.Vector3());
  const lastRot = useRef(new THREE.Euler());
  
  // Sync our camera position
  useFrame((state) => {
    if (!socket) return;
    const now = state.clock.getElapsedTime() * 1000;
    if (now - lastEmitTime.current < emitInterval) return;

    // Only emit if moved significantly
    const dist = camera.position.distanceTo(lastPos.current);
    const rotDist = Math.abs(camera.rotation.x - lastRot.current.x) + 
                    Math.abs(camera.rotation.y - lastRot.current.y) + 
                    Math.abs(camera.rotation.z - lastRot.current.z);

    if (dist < 0.01 && rotDist < 0.01) return;

    lastEmitTime.current = now;
    lastPos.current.copy(camera.position);
    lastRot.current.copy(camera.rotation);

    socket.emit("user:move", {
      position: [camera.position.x, camera.position.y, camera.position.z],
      rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z]
    });
  });

  return (
    <group>
      {Object.values(users || {}).map(user => {
        if (user.id === socket?.id) return null; // Don't render ourselves
        return (
          <group key={user.id} position={user.position} rotation={user.rotation}>
            {/* Simple Avatar */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#4f46e5" />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.4, 16]} />
              <meshStandardMaterial color="#818cf8" />
            </mesh>
            <Html position={[0, 0.4, 0]} center>
              <div className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                User {user.id.substring(0, 4)}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
// -------------------

function VRManager({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const mode = useXR((state: any) => state.mode);
  const isPresenting = mode === 'immersive-vr';
  
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isPresenting;
    }
  }, [isPresenting, controlsRef]);
  return null;
}

function PostProcessing({ isMobile, theme }: { isMobile: boolean, theme?: Theme }) {
  const isLightTheme = theme?.id === 'white' || theme?.id === 'ios-light';
  const bloomIntensity = isLightTheme ? 0.2 : 0.4;
  const vignetteDarkness = isLightTheme ? 0.3 : 0.5;

  if (isMobile) {
    return null;
  }

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom 
        luminanceThreshold={0.8} 
        mipmapBlur={false}
        intensity={bloomIntensity} 
      />
      <Vignette eskil={false} offset={0.1} darkness={vignetteDarkness} />
    </EffectComposer>
  );
}

function VRGrabber({ 
  children, 
  physicsEnabled,
  resetTrigger,
  activeTopic
}: { 
  children: React.ReactNode, 
  physicsEnabled: boolean,
  resetTrigger?: number,
  activeTopic: Topic
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointerId, setDragPointerId] = useState<number | null>(null);
  const dragStartObjPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const dragPlane = useRef<THREE.Plane>(new THREE.Plane());
  const dragStartIntersection = useRef<THREE.Vector3>(new THREE.Vector3());

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, 0);
    }
  }, [resetTrigger, activeTopic]); 

  // Sync model position from server
  useEffect(() => {
    if (!socket) return;
    
    const handleModelMoved = (transform: { position: [number, number, number], rotation: [number, number, number] }) => {
      if (!isDragging && groupRef.current) {
        groupRef.current.position.set(transform.position[0], transform.position[1], transform.position[2]);
        groupRef.current.rotation.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
      }
    };

    socket.on("model:moved", handleModelMoved);
    
    // Also handle initial state
    socket.on("init", (data) => {
      if (!isDragging && groupRef.current && data.modelTransform) {
        groupRef.current.position.set(data.modelTransform.position[0], data.modelTransform.position[1], data.modelTransform.position[2]);
        groupRef.current.rotation.set(data.modelTransform.rotation[0], data.modelTransform.rotation[1], data.modelTransform.rotation[2]);
      }
    });

    return () => {
      socket?.off("model:moved", handleModelMoved);
    };
  }, [isDragging]);

  return (
    <group 
      ref={groupRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (physicsEnabled) return; // Physics handles its own interactions
        (e.target as any).setPointerCapture(e.pointerId);
        setIsDragging(true);
        setDragPointerId(e.pointerId);
        
        if (groupRef.current) {
          dragStartObjPos.current.copy(groupRef.current.position);
          // Create a plane facing the camera, passing through the object's center
          dragPlane.current.setFromNormalAndCoplanarPoint(
            e.camera.getWorldDirection(new THREE.Vector3()).negate(),
            groupRef.current.position
          );
          // Find where the ray intersects this plane
          e.ray.intersectPlane(dragPlane.current, dragStartIntersection.current);
        }
      }}
      onPointerUp={(e) => {
        if (dragPointerId === e.pointerId) {
          e.stopPropagation();
          (e.target as any).releasePointerCapture(e.pointerId);
          setIsDragging(false);
          setDragPointerId(null);
        }
      }}
      onPointerMove={(e) => {
        if (isDragging && dragPointerId === e.pointerId && groupRef.current) {
          e.stopPropagation();
          const currentIntersection = new THREE.Vector3();
          e.ray.intersectPlane(dragPlane.current, currentIntersection);
          
          if (currentIntersection) {
            const delta = currentIntersection.sub(dragStartIntersection.current);
            groupRef.current.position.copy(dragStartObjPos.current).add(delta);
            
            // Emit model move
            if (socket) {
              socket.emit("model:move", {
                position: [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z],
                rotation: [groupRef.current.rotation.x, groupRef.current.rotation.y, groupRef.current.rotation.z]
              });
            }
          }
        }
      }}
    >
      {children}
    </group>
  );
}

function ModelTransition({ 
  activeTopic, 
  isAppStarted, 
  isMobile,
  customConfig, 
  uploadedModel, 
  uploadedModelExplanation, 
  physicsEnabled,
  isSoundEnabled,
  voltage,
  setVoltage,
  analysis,
  setFocusTarget,
  controlsRef
}: { 
  activeTopic: Topic,
  isAppStarted: boolean,
  isMobile: boolean,
  customConfig?: AdvancedConfig,
  uploadedModel?: string | null,
  uploadedModelExplanation?: string | null,
  physicsEnabled: boolean,
  isSoundEnabled: boolean,
  voltage: number,
  setVoltage: (v: number) => void,
  analysis: string | null,
  setFocusTarget: (target: { position: THREE.Vector3, target: THREE.Vector3 } | null) => void,
  controlsRef: React.RefObject<any>
}) {
  const transitions = useTransition(activeTopic, {
    from: { scale: 0, opacity: 0, position: [0, -5, 0], rotation: [0, Math.PI, 0] },
    enter: { scale: 1, opacity: 1, position: [0, 0, 0], rotation: [0, 0, 0] },
    leave: { scale: 0, opacity: 0, position: [0, 5, 0], rotation: [0, -Math.PI, 0] },
    config: { 
      mass: 1, 
      tension: 280, 
      friction: 20, 
      precision: 0.001,
      clamp: true 
    }
  });

  return transitions((style, item) => (
    <animated.group 
      scale={style.scale} 
      position={style.position as any}
      rotation={style.rotation as any}
    >
      <group>
        <ModelContainer 
          activeTopic={item} 
          isAppStarted={isAppStarted} 
          isMobile={isMobile}
          customConfig={customConfig} 
          uploadedModel={uploadedModel} 
          uploadedModelExplanation={uploadedModelExplanation}
          physicsEnabled={physicsEnabled}
          isSoundEnabled={isSoundEnabled}
          voltage={voltage}
          setVoltage={setVoltage}
          analysis={analysis}
          setFocusTarget={setFocusTarget}
          controlsRef={controlsRef}
        />
      </group>
    </animated.group>
  ));

}

function ModelContainer({ 
  activeTopic, 
  isAppStarted, 
  isMobile,
  customConfig, 
  uploadedModel, 
  uploadedModelExplanation, 
  physicsEnabled,
  isSoundEnabled,
  voltage,
  setVoltage,
  analysis,
  setFocusTarget,
  controlsRef
}: {
  activeTopic: Topic,
  isAppStarted: boolean,
  isMobile: boolean,
  customConfig?: AdvancedConfig,
  uploadedModel?: string | null,
  uploadedModelExplanation?: string | null,
  physicsEnabled: boolean,
  isSoundEnabled: boolean,
  voltage: number,
  setVoltage: (v: number) => void,
  analysis: string | null,
  setFocusTarget: (target: { position: THREE.Vector3, target: THREE.Vector3 } | null) => void,
  controlsRef: React.RefObject<any>
}) {
  console.log("ModelContainer rendering topic:", activeTopic);
  return (
    <>
      {activeTopic === 'Atom' && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <AtomModel showLabels={isAppStarted} detail="high" />
        </Float>
      )} 
      {activeTopic === 'Globe' && (
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <Detailed distances={[0, 20]}>
            <GlobeModel showLabels={isAppStarted} setFocusTarget={setFocusTarget} controlsRef={controlsRef} detail="high" />
            <GlobeModel showLabels={isAppStarted} setFocusTarget={setFocusTarget} controlsRef={controlsRef} detail="low" />
          </Detailed>
        </Float>
      )}
      {activeTopic === 'DNA' && (
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.4}>
          <DNAModel showLabels={isAppStarted} isMobile={isMobile} setFocusTarget={setFocusTarget} />
        </Float>
      )} 
      {activeTopic === 'SolarSystem' && (
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
          <Detailed distances={[0, 25]}>
            <SolarSystemModel showLabels={isAppStarted} isMobile={isMobile} detail="high" />
            <SolarSystemModel showLabels={isAppStarted} isMobile={isMobile} detail="low" />
          </Detailed>
        </Float>
      )} 
      {activeTopic === 'QuantumPhysics' && <QuantumPhysicsModel showLabels={isAppStarted} />}
      {activeTopic === 'OrganicChemistry' && <OrganicChemistryModel showLabels={isAppStarted} />}
      {activeTopic === 'BlackHole' && <BlackHoleModel />}
      {activeTopic === 'Cell' && <CellModel />}
      {activeTopic === 'AnimalCell' && <AnimalCellModel showLabels={isAppStarted} />}
      {activeTopic === 'Engine' && <EngineModel />}
      {activeTopic === 'MillikanOilDrop' && <MillikanOilDrop showLabels={isAppStarted} voltage={voltage} setVoltage={setVoltage} />}
      {(activeTopic === 'Custom' || activeTopic.startsWith('custom-')) && customConfig && (
        <ErrorBoundary fallback={<Html center><div className="text-red-500 bg-black/80 px-4 py-2 text-sm rounded shadow-lg border border-red-500/50">Failed to load AI model.<br/>Please try regenerating.</div></Html>}>
          <CustomModel {...customConfig} showLabels={isAppStarted} />
        </ErrorBoundary>
      )}
      {activeTopic === 'Upload' && uploadedModel && (
        <ErrorBoundary fallback={<Html center><div className="text-red-500 bg-black/80 p-2 rounded">Failed to load model</div></Html>}>
          <UploadedModel url={uploadedModel} showLabels={isAppStarted} explanation={uploadedModelExplanation} />
        </ErrorBoundary>
      )}
      {activeTopic === 'CrystalLattice' && <CrystalLattice showLabels={isAppStarted} physicsEnabled={physicsEnabled} />}
      {activeTopic === 'HumanHeart' && <HeartModel showLabels={isAppStarted} />}
      {activeTopic === 'HumanBody' && <AdvancedMedicalBody showLabels={isAppStarted} />}
      {activeTopic === 'Microscope' && <MicroscopeModel showLabels={isAppStarted} />}
      {activeTopic === 'Drone' && <DroneModel showLabels={isAppStarted} isSoundEnabled={isSoundEnabled} physicsEnabled={physicsEnabled} />}
      {activeTopic === 'Display' && <DisplayModel showLabels={isAppStarted} />}
      {activeTopic === 'AircraftAerodynamics' && <AircraftAerodynamicsModel showLabels={isAppStarted} />}
      {activeTopic === 'Plasma' && <PlasmaBallModel showLabels={isAppStarted} />}
      {activeTopic === 'FingerprintSensor' && <FingerprintModel />}
      
      {/* Advanced Super Realistic Modules */}
      {activeTopic === 'JetEngine' && <JetEngineModel showLabels={isAppStarted} />}
      {activeTopic === 'JamesWebb' && <JamesWebbModel showLabels={isAppStarted} />}
      {activeTopic === 'NuclearReactor' && <NuclearReactorModel showLabels={isAppStarted} />}
      {activeTopic === 'MarsRover' && <MarsRoverModel showLabels={isAppStarted} />}
      {activeTopic === 'Volcano' && <VolcanoModel showLabels={isAppStarted} />}
      {activeTopic === 'Satellite' && <SatelliteModel />}
      {activeTopic === 'DysonSphere' && <DysonSphereModel showLabels={isAppStarted} isMobile={isMobile} />}
      
      {/* Automotive Modules */}
      {activeTopic === 'Missile' && <MissileModel isSoundEnabled={isSoundEnabled} />}
      
      {/* Mathematics Modules */}
      {activeTopic === 'Fractals' && <FractalModel showLabels={isAppStarted} />}
      {activeTopic === 'Geometry' && <GeometryModel showLabels={isAppStarted} />}
      {activeTopic === 'Calculus' && <CalculusModel showLabels={isAppStarted} />}

      {/* History Modules */}
      {activeTopic === 'AncientRome' && <ColosseumModel showLabels={isAppStarted} />}
      {activeTopic === 'Pyramid' && <PyramidModel showLabels={isAppStarted} />}
    </>
  );
}

const LaserPointerMemo = React.memo(LaserPointer);
const DrawingSystemMemo = React.memo(DrawingSystem);
const XRLightingMemo = XRLighting;
const XREnvironmentMemo = XREnvironment;
const XRBackgroundHandlerMemo = XRBackgroundHandler;
const DynamicBackgroundMemo = DynamicBackground;
const VRMenuMemo = VRMenu;
const MultiplayerSyncMemo = MultiplayerSync;

// FpsLimiter removed for native ultra-smooth rendering

export function Viewer3D() {
  const { 
    activeTopic, 
    hologramConfig: customConfig, 
    uploadedModel, 
    uploadedModelExplanation, 
    topicExplanation, 
    setIsCourseOpen, 
    setIsQuizOpen, 
    detailLevel, 
    setDetailLevel, 
    language, 
    setLanguage, 
    isVoiceActive, 
    isAppStarted, 
    isSoundEnabled, 
    theme, 
    userRole,
    isTranscriptionOpen,
    setIsTranscriptionOpen,
    setHologramConfig,
    setActiveTopic: onSelectTopic,
    setTopicExplanation,
    fpsLimit,
    showFPS,
    graphicsQuality,
    isARMode,
    toggleARMode
  } = useStore(useShallow(state => ({
    activeTopic: state.activeTopic,
    hologramConfig: state.hologramConfig,
    uploadedModel: state.uploadedModel,
    uploadedModelExplanation: state.uploadedModelExplanation,
    topicExplanation: state.topicExplanation,
    setIsCourseOpen: state.setIsCourseOpen,
    setIsQuizOpen: state.setIsQuizOpen,
    detailLevel: state.detailLevel,
    setDetailLevel: state.setDetailLevel,
    language: state.language,
    setLanguage: state.setLanguage,
    isVoiceActive: state.isVoiceActive,
    isAppStarted: state.isAppStarted,
    isSoundEnabled: state.isSoundEnabled,
    theme: state.theme,
    userRole: state.userRole,
    isTranscriptionOpen: state.isTranscriptionOpen,
    setIsTranscriptionOpen: state.setIsTranscriptionOpen,
    setHologramConfig: state.setHologramConfig,
    setActiveTopic: state.setActiveTopic,
    setTopicExplanation: state.setTopicExplanation,
    fpsLimit: state.fpsLimit,
    showFPS: state.showFPS,
    graphicsQuality: state.graphicsQuality,
    isARMode: state.isARMode,
    toggleARMode: state.toggleARMode
  })));

  const toggleCourse = () => setIsCourseOpen(prev => !prev);
  const toggleQuiz = () => setIsQuizOpen(prev => !prev);
  const toggleTranscription = () => setIsTranscriptionOpen(prev => !prev);
  const onConfigChange = (config: any) => setHologramConfig(config);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  const onGenerateExplanation = async () => {
    setIsGeneratingExplanation(true);
    try {
      const { getPreloadedExplanation } = await import('../data/preloadedExplanations');
      const { generateExplanation } = await import('../services/geminiService');
      
      let explanation = getPreloadedExplanation(activeTopic as Topic, detailLevel as any);
      
      if (!explanation) {
        explanation = await generateExplanation(activeTopic, detailLevel, language);
      }
      
      setTopicExplanation(explanation || 'No explanation available.');
    } catch (e) {
      console.error("Failed to generate explanation:", e);
      setTopicExplanation('Failed to generate analysis.');
    } finally {
      setIsGeneratingExplanation(false);
    }
  };
  const isMobile = false;

  const handleResetView = () => {
    setFocusTarget(null);
    window.dispatchEvent(new CustomEvent('gesture-update', {
      detail: { rotateX: 0, rotateY: 0, zoom: 0, panX: 0, panY: 0, reset: true }
    }));
  };

  const store = useMemo(() => createXRStore({
    hand: DefaultXRHand,
    controller: DefaultXRController,
  }), []);
  const isVRSupported = useXRSessionModeSupported('immersive-vr');
  const isWebXRARSupported = useXRSessionModeSupported('immersive-ar');
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const orbitControlsRef = useRef<any>(null);
  const webcamRef = useRef<Webcam>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const [voltage, setVoltage] = useState(0);
  const [focusTarget, setFocusTarget] = useState<{ position: THREE.Vector3, target: THREE.Vector3 } | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [vrResetCounter, setVrResetCounter] = useState(0);
  
  const { isPlaying: isPlayingAudio, isPaused: isPausedAudio, isGenerating: isGeneratingAudio, play, pause, resume, stop, prefetch, init, currentText } = useHoloAudio();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const toggleNeuralPanel = () => {
    if (!isPanelOpen) init(); // Initialize on user gesture
    setIsPanelOpen(!isPanelOpen);
  };

  const captureAndAnalyze = async () => {
    if (!webcamRef.current) return;
    setIsAnalyzing(true);
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      setIsAnalyzing(false);
      return;
    }
    const base64Image = screenshot.split(',')[1];
    
    const result = await analyzeObjectFromCamera(base64Image);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    setExplanation("AI analysis is currently disabled.");
  }, [activeTopic, uploadedModel]);

  // Sync activeTopic to server
  useEffect(() => {
    if (socket && activeTopic) {
      socket.emit("topic:change", activeTopic);
    }
  }, [activeTopic]);

  // Pre-fetch audio for faster playback
  useEffect(() => {
    const text = activeTopic === 'Upload' ? uploadedModelExplanation : topicExplanation;
    const isValidText = text && 
                        text !== "Analyzing holographic construct..." && 
                        text !== "Analyzing model structure..." && 
                        text !== 'Model loaded. Click "Analyze Synthesis" for AI analysis.' &&
                        text !== 'Click "Analyze Synthesis" to learn more.';

    if (isValidText) {
      prefetch(text);
    }
  }, [topicExplanation, uploadedModelExplanation, activeTopic, prefetch]);

  const [prevTopic, setPrevTopic] = useState(activeTopic);
  const [prevPhysics, setPrevPhysics] = useState(physicsEnabled);

  const handleVoiceCommand = (command: string) => {
    console.log("Voice command:", command);
    let targetPos = null;
    let cameraPos = null;

    // Global Commands
    if (command.includes('enable physics') || command.includes('activate gravity')) {
      setPhysicsEnabled(true);
      return;
    }

    if (command.includes('disable physics') || command.includes('turn off gravity')) {
      setPhysicsEnabled(false);
      return;
    }

    if (command.includes('explain') || command.includes('what is this') || command.includes('tell me more')) {
      if (!topicExplanation && !uploadedModelExplanation) {
        onGenerateExplanation();
      } else {
        handlePlayAudio();
      }
      return;
    }

    if (activeTopic === 'Atom') {
      if (command.includes('nucleus') || command.includes('proton') || command.includes('neutron')) {
        targetPos = new THREE.Vector3(0, 0, 0);
        cameraPos = new THREE.Vector3(0, 2, 5);
      } else if (command.includes('electron')) {
        targetPos = new THREE.Vector3(3, 0, 0);
        cameraPos = new THREE.Vector3(3, 1, 3);
      }
    } else if (activeTopic === 'SolarSystem') {
      if (command.includes('sun')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,5,15); }
      else if (command.includes('mercury')) { targetPos = new THREE.Vector3(4,0,0); cameraPos = new THREE.Vector3(4,2,4); }
      else if (command.includes('venus')) { targetPos = new THREE.Vector3(6,0,0); cameraPos = new THREE.Vector3(6,2,4); }
      else if (command.includes('earth')) { targetPos = new THREE.Vector3(8,0,0); cameraPos = new THREE.Vector3(8,2,4); }
      else if (command.includes('mars')) { targetPos = new THREE.Vector3(10,0,0); cameraPos = new THREE.Vector3(10,2,4); }
      else if (command.includes('jupiter')) { targetPos = new THREE.Vector3(15,0,0); cameraPos = new THREE.Vector3(15,5,10); }
      else if (command.includes('saturn')) { targetPos = new THREE.Vector3(20,0,0); cameraPos = new THREE.Vector3(20,5,10); }
      else if (command.includes('uranus')) { targetPos = new THREE.Vector3(25,0,0); cameraPos = new THREE.Vector3(25,5,10); }
      else if (command.includes('neptune')) { targetPos = new THREE.Vector3(30,0,0); cameraPos = new THREE.Vector3(30,5,10); }
    } else if (activeTopic === 'OrganicChemistry') {
      if (command.includes('carbon')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,2,5); }
      else if (command.includes('hydrogen')) { targetPos = new THREE.Vector3(1,1,1); cameraPos = new THREE.Vector3(1,2,4); }
      else if (command.includes('oxygen')) { targetPos = new THREE.Vector3(-1,1,-1); cameraPos = new THREE.Vector3(-1,2,4); }
    } else if (activeTopic === 'QuantumPhysics') {
      if (command.includes('wave') || command.includes('function')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,2,6); }
      else if (command.includes('particle')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,1,3); }
    } else if (activeTopic === 'CrystalLattice') {
      if (command.includes('atom') || command.includes('ion')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,1,4); }
      else if (command.includes('bond') || command.includes('lattice')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,3,8); }
    } else if (activeTopic === 'HumanHeart') {
      if (command.includes('atrium')) { targetPos = new THREE.Vector3(0,1.5,0); cameraPos = new THREE.Vector3(0,2,5); }
      else if (command.includes('ventricle')) { targetPos = new THREE.Vector3(0,-0.5,0); cameraPos = new THREE.Vector3(0,-0.5,5); }
      else if (command.includes('aorta') || command.includes('valve')) { targetPos = new THREE.Vector3(0,3.5,0); cameraPos = new THREE.Vector3(0,4,5); }
    } else if (activeTopic === 'Microscope') {
      if (command.includes('eyepiece') || command.includes('lens')) { targetPos = new THREE.Vector3(0,5.5,0); cameraPos = new THREE.Vector3(0,6,4); }
      else if (command.includes('objective')) { targetPos = new THREE.Vector3(0,2,0); cameraPos = new THREE.Vector3(0,2,4); }
      else if (command.includes('stage')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,1,5); }
      else if (command.includes('light') || command.includes('source')) { targetPos = new THREE.Vector3(0,-3,0); cameraPos = new THREE.Vector3(0,-2,5); }
    } else if (activeTopic === 'Fractals') {
      if (command.includes('mandelbrot')) { targetPos = new THREE.Vector3(-2,0,0); cameraPos = new THREE.Vector3(-2,0,5); }
      else if (command.includes('julia')) { targetPos = new THREE.Vector3(2,0,0); cameraPos = new THREE.Vector3(2,0,5); }
    } else if (activeTopic === 'Geometry') {
      if (command.includes('icosahedron')) { targetPos = new THREE.Vector3(-4,0,0); cameraPos = new THREE.Vector3(-4,0,5); }
      else if (command.includes('dodecahedron')) { targetPos = new THREE.Vector3(-1.5,0,0); cameraPos = new THREE.Vector3(-1.5,0,5); }
      else if (command.includes('octahedron')) { targetPos = new THREE.Vector3(1.5,0,0); cameraPos = new THREE.Vector3(1.5,0,5); }
      else if (command.includes('tetrahedron')) { targetPos = new THREE.Vector3(4,0,0); cameraPos = new THREE.Vector3(4,0,5); }
    } else if (activeTopic === 'AncientRome') {
      if (command.includes('arena') || command.includes('center')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,2,5); }
      else if (command.includes('seating') || command.includes('tier')) { targetPos = new THREE.Vector3(0,2,3); cameraPos = new THREE.Vector3(0,4,8); }
      else if (command.includes('hypogeum') || command.includes('underground')) { targetPos = new THREE.Vector3(0,-1,0); cameraPos = new THREE.Vector3(0,-1,4); }
    } else if (activeTopic === 'Pyramid') {
      if (command.includes('apex') || command.includes('top')) { targetPos = new THREE.Vector3(0,3,0); cameraPos = new THREE.Vector3(0,4,5); }
      else if (command.includes('chamber') || command.includes('tomb')) { targetPos = new THREE.Vector3(0,0,0); cameraPos = new THREE.Vector3(0,0,4); }
      else if (command.includes('entrance') || command.includes('door')) { targetPos = new THREE.Vector3(0,-1,2); cameraPos = new THREE.Vector3(0,-1,5); }
    } else if (activeTopic === 'Globe') {
      if (command.includes('zoom')) {
        const country = COUNTRIES.find(c => command.includes(c.name.toLowerCase()));
        if (country) return; // Let GlobeModel handle its specific country zoom
      }
    }

    if (targetPos && cameraPos) {
      setFocusTarget({ position: cameraPos, target: targetPos });
    } else if (command.includes('reset') || command.includes('center')) {
      setFocusTarget(null);
      handleResetView();
    } else if (command.includes('zoom in')) {
      setFocusTarget(null);
      handleZoom(0.5);
    } else if (command.includes('zoom out')) {
      setFocusTarget(null);
      handleZoom(-0.5);
    } else if (command.includes('rotate left')) {
      setFocusTarget(null);
      window.dispatchEvent(new CustomEvent('gesture-update', {
        detail: { rotateX: 0, rotateY: -0.5, zoom: 0, panX: 0, panY: 0 }
      }));
    } else if (command.includes('rotate right')) {
      setFocusTarget(null);
      window.dispatchEvent(new CustomEvent('gesture-update', {
        detail: { rotateX: 0, rotateY: 0.5, zoom: 0, panX: 0, panY: 0 }
      }));
    } else if (command.includes('rotate up')) {
      setFocusTarget(null);
      window.dispatchEvent(new CustomEvent('gesture-update', {
        detail: { rotateX: -0.5, rotateY: 0, zoom: 0, panX: 0, panY: 0 }
      }));
    } else if (command.includes('rotate down')) {
      setFocusTarget(null);
      window.dispatchEvent(new CustomEvent('gesture-update', {
        detail: { rotateX: 0.5, rotateY: 0, zoom: 0, panX: 0, panY: 0 }
      }));
    }
  };

  const handleVoiceCommandRef = useRef(handleVoiceCommand);
  useEffect(() => {
    handleVoiceCommandRef.current = handleVoiceCommand;
  });

  useEffect(() => {
    const handleTranscript = (e: any) => {
      handleVoiceCommandRef.current(e.detail);
    };
    window.addEventListener('app-voice-transcript', handleTranscript);
    return () => window.removeEventListener('app-voice-transcript', handleTranscript);
  }, []);
  
  if (activeTopic !== prevTopic || physicsEnabled !== prevPhysics) {
    setSelectedObject(null);
    setPrevTopic(activeTopic);
    setPrevPhysics(physicsEnabled);
  }

  useEffect(() => {
    stop();
  }, [activeTopic, physicsEnabled, stop]);

  useEffect(() => {
    handleResetView();
  }, [activeTopic]);

  const handleZoom = (delta: number) => {
    window.dispatchEvent(new CustomEvent('gesture-update', {
      detail: { rotateX: 0, rotateY: 0, zoom: delta, panX: 0, panY: 0 }
    }));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      if (isPausedAudio) {
        resume();
      } else {
        pause();
      }
      return;
    }

    let textToRead = activeTopic === 'Upload' ? uploadedModelExplanation : topicExplanation;
    
    // If no explanation is currently displayed, try to get the preloaded one
    if (!textToRead && activeTopic !== 'Upload' && activeTopic !== 'Custom' && !activeTopic.startsWith('custom-')) {
      const { getPreloadedExplanation } = await import('../data/preloadedExplanations');
      textToRead = getPreloadedExplanation(activeTopic as Topic, detailLevel as any);
    }

    if (!textToRead) return;

    play(textToRead);
  };

  const displayExplanation = activeTopic === 'Upload' 
    ? (uploadedModel ? (uploadedModelExplanation || `Displaying your uploaded model. Enjoy exploring your custom creation!`) : 'No model uploaded yet. Use the Upload Model feature to load your own 3D content.')
    : (topicExplanation || 'Click "Analyze Synthesis" to learn more.');

  return (
    <div className={`absolute inset-0 ${isARMode ? 'bg-transparent' : theme.bg} overflow-hidden transition-colors duration-500`}>
      {/* Professional Studio Background */}
      {isARMode && (
        <div className="absolute inset-0 -z-50 pointer-events-none">
          <Webcam 
            ref={webcamRef}
            audio={false} 
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      <div className={`absolute inset-0 ${isARMode ? 'bg-transparent opacity-0' : theme.bg + ' opacity-80'} pointer-events-none transition-all duration-500`}></div>
      {theme.pattern === 'hex' && <div className={`absolute inset-0 bg-hex opacity-30 pointer-events-none ${isARMode ? 'hidden' : ''}`}></div>}
      {theme.pattern === 'grid' && <div className={`absolute inset-0 bg-grid-holo text-${theme.primary}/5 pointer-events-none ${isARMode ? 'hidden' : ''}`}></div>}
      {theme.pattern === 'dots' && <div className={`absolute inset-0 bg-dots-holo text-${theme.primary}/5 pointer-events-none ${isARMode ? 'hidden' : ''}`}></div>}

      {/* AI Teacher Subtitles */}
      <AnimatePresence>
        {isPlayingAudio && currentText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-40 pointer-events-none"
          >
            <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl text-center">
              <p className="text-white text-lg font-medium leading-relaxed">
                {currentText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-50">
      </div>

      <Canvas 
        shadows={graphicsQuality !== 'low' && !isMobile} 
        camera={{ position: [0, 2, 20], fov: 40 }} 
        dpr={graphicsQuality === 'low' ? [0.5, 0.75] : graphicsQuality === 'medium' ? [1, 1] : [1, 1.5]} 
        frameloop="always"
        performance={{ current: 1, min: 0.5, max: 1 }}
        gl={{ 
          alpha: true, 
          antialias: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
          outputColorSpace: THREE.SRGBColorSpace,
          stencil: false,
          depth: true,
          precision: "highp",
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false
        }}
      >
        <XR store={store}>
            <PerformanceMonitor 
              onDecline={() => setDetailLevel('basic')} 
              onIncline={() => setDetailLevel('expert')}
              flipflops={3}
              bounds={(fps) => (fps < 50 ? [0, 1] : [1, 1])}
            />
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <Preload all />
            <VRManager controlsRef={orbitControlsRef} />
            <VRFloor />
          
          <MultiplayerSyncMemo activeTopic={activeTopic} onSelectTopic={onSelectTopic} />
          
          <XROrigin position={[0, 0, 20]}>
            <VRMenuMemo 
              activeTopic={activeTopic} 
              onSelectTopic={onSelectTopic} 
              onResetModel={() => setVrResetCounter(prev => prev + 1)}
            />
          </XROrigin>
          
          <TeleportTarget>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.02, 0]}>
              <planeGeometry args={[100, 100]} />
              <meshBasicMaterial visible={false} />
            </mesh>
          </TeleportTarget>
          
          <XRBackgroundHandlerMemo theme={theme} isMobile={isMobile} />
          
          <XRLightingMemo />
          
          <Suspense fallback={null}>
            <XREnvironmentMemo />
          </Suspense>

          <Suspense fallback={null}>
            <Physics gravity={[0, physicsEnabled ? -9.81 : 0, 0]}>
              {/* Mouse Interaction removed for static behavior */}
              {physicsEnabled && <PhysicsFloor />}
              
              <LaserPointerMemo 
                enabled={(activeTopic === 'Custom' || activeTopic.startsWith('custom-')) && !!customConfig?.laserPointerEnabled} 
                theme={theme} 
              />

              <DrawingSystemMemo theme={theme} />

              <group 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (e.object instanceof THREE.Mesh) {
                    setSelectedObject(e.object); 
                  }
                }} 
                onPointerMissed={() => setSelectedObject(null)}
              >
                <VRGrabber physicsEnabled={physicsEnabled} resetTrigger={vrResetCounter} activeTopic={activeTopic}>
                  {activeTopic === 'Upload' && !uploadedModel ? (
                    <Html center>
                      <div className="text-zinc-500 font-mono text-sm border border-zinc-800 p-4 rounded-lg bg-black/50">
                        Waiting for model upload...
                      </div>
                    </Html>
                  ) : (
                    <ModelTransition 
                      activeTopic={activeTopic} 
                      isAppStarted={isAppStarted} 
                      isMobile={isMobile}
                      customConfig={customConfig} 
                      uploadedModel={uploadedModel} 
                      uploadedModelExplanation={uploadedModelExplanation}
                      physicsEnabled={physicsEnabled}
                      isSoundEnabled={isSoundEnabled}
                      voltage={voltage}
                      setVoltage={setVoltage}
                      analysis={analysis}
                      setFocusTarget={setFocusTarget}
                      controlsRef={orbitControlsRef}
                    />
                  )}
                </VRGrabber>
              </group>
            </Physics>
            
            <DynamicBackgroundMemo activeTopic={activeTopic} theme={theme} isMobile={isMobile} />
          </Suspense>
          
          <OrbitControls 
            ref={orbitControlsRef}
            makeDefault 
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={false}
            autoRotateSpeed={2.0} 
            enablePan={!isMobile}
            enableZoom={true}
            zoomSpeed={1.2}
            minDistance={0.1}
            maxDistance={100}
            minPolarAngle={-Infinity}
            maxPolarAngle={Infinity}
            onStart={() => setFocusTarget(null)}
          />
          <GestureHandler controlsRef={orbitControlsRef} />
          <CameraAnimator focusTarget={focusTarget} controlsRef={orbitControlsRef} />

          {selectedObject && selectedObject.parent && !isMobile && (
            <TransformControls
              key={selectedObject.uuid}
              object={selectedObject}
              onChange={() => {
                if (orbitControlsRef.current) {
                  orbitControlsRef.current.enabled = false;
                }
              }}
              onMouseUp={() => {
                if (orbitControlsRef.current) {
                  orbitControlsRef.current.enabled = true;
                }
              }}
            />
          )}

          <PostProcessing isMobile={isMobile} theme={theme} />
          <Preload all />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </XR>
      </Canvas>
      
      {/* UI Overlay */}
      
      <div className={`absolute ${isMobile ? 'bottom-2 left-2 right-2' : 'bottom-4 left-8 right-8'} flex justify-between items-end pointer-events-none`}>
        <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-4'} items-start`}>
          {activeTopic === 'MillikanOilDrop' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${isMobile ? 'w-48 p-2' : 'w-64 p-4'} bg-zinc-950/90 rounded-2xl border border-indigo-500/30 backdrop-blur-md flex flex-col gap-3 shadow-2xl pointer-events-auto`} 
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Settings2 size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">HV Supply Control</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
              </div>
              
              <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center gap-1">
                <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Current Potential</span>
                <div className="font-mono text-2xl font-bold text-white tracking-tighter">
                  {voltage > 0 ? '+' : ''}{voltage.toFixed(2)}<span className="text-xs text-indigo-400 ml-1">kV</span>
                </div>
              </div>

              <div className="space-y-2">
                <input 
                  type="range" 
                  min="-10" 
                  max="10" 
                  step="0.01" 
                  value={voltage} 
                  onChange={(e) => setVoltage(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                />
                <div className="flex justify-between text-[8px] text-zinc-500 font-mono uppercase tracking-tighter">
                  <span>Reverse</span>
                  <span>Neutral</span>
                  <span>Forward</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button onClick={() => setVoltage(0)} className="py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold text-zinc-400 hover:text-white transition-all">Reset</button>
                <button onClick={() => setVoltage(v => Math.sign(v) * 5)} className="py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-[9px] font-bold text-indigo-400 transition-all">Max Power</button>
              </div>
            </motion.div>
          )}

          {activeTopic === 'MillikanOilDrop' && !isMobile && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-950/90 p-4 rounded-2xl border border-emerald-500/30 backdrop-blur-xl w-64 flex flex-col gap-3 shadow-2xl pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <BrainCircuit size={14} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Experiment Guide</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">Observe droplets falling under gravity (Terminal Velocity).</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">Adjust HV Supply to suspend a droplet in mid-air.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">Calculate charge (q) using the balance of forces.</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-start pointer-events-auto"
          >
            <div className="flex gap-2">
              <button 
                onClick={toggleNeuralPanel}
                className={`px-5 py-2.5 ${theme.uiBg} backdrop-blur-md border ${theme.border} rounded-t-2xl text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl transition-all hover:text-white group`}
              >
                <div className="relative">
                  <BrainCircuit size={14} className={`transition-all duration-500 ${isPanelOpen ? 'text-indigo-400 rotate-12' : 'text-zinc-500'}`} />
                  {isPanelOpen && <motion.div layoutId="glow" className="absolute inset-0 bg-indigo-500/20 blur-sm rounded-full" />}
                </div>
                Neural Intelligence
              </button>
            </div>
            {isPanelOpen && (
              <NeuralIntelligencePanel 
                onClose={() => setIsPanelOpen(false)}
                onOpenCourse={toggleCourse}
                theme={theme}
                topic={activeTopic as Topic}
              />
            )}
          </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
          className={`flex flex-col ${isMobile ? 'gap-1.5' : 'gap-3'} pointer-events-auto`}
        >
          {isVRSupported && !isMobile && (
            <button 
              onClick={() => store.enterVR()}
              className="px-4 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
            >
              <Glasses size={16} />
              Enter VR
            </button>
          )}

          <button 
            onClick={toggleCourse}
            className={`${isMobile ? 'p-3' : 'px-4 py-3'} ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-white/80 text-zinc-600' : 'bg-zinc-900/80 text-zinc-400'} hover:bg-zinc-800 hover:text-white border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl`}
          >
            <BookOpen size={16} />
            <span className={isMobile ? 'hidden' : 'inline'}>Course</span>
          </button>

          <button 
            onClick={() => toggleARMode()}
            className={`${isMobile ? 'p-3' : 'px-4 py-3'} ${isARMode ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : theme.id === 'white' || theme.id === 'ios-light' ? 'bg-white/80 text-zinc-600' : 'bg-zinc-900/80 text-zinc-400'} hover:bg-emerald-400 hover:text-white border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl`}
          >
            <Scan size={16} />
            <span className={isMobile ? 'hidden' : 'inline'}>{isARMode ? 'Exit AR' : 'Enter AR'}</span>
          </button>

          {userRole === 'teacher' && (
            <button 
              onClick={toggleTranscription}
              className={`${isMobile ? 'p-3' : 'px-4 py-3'} rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl ${
                isTranscriptionOpen 
                  ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                  : theme.id === 'white' || theme.id === 'ios-light' ? 'bg-white/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-black/5' : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/10'
              }`}
            >
              <Mic size={16} />
              <span className={isMobile ? 'hidden' : 'inline'}>{isTranscriptionOpen ? 'Stop Transcription' : 'Start Transcription'}</span>
            </button>
          )}
        </motion.div>
      </div>
    </div>
  </div>
  );
}
