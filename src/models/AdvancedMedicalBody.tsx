import React, { useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Camera, 
  Smartphone, 
  Scan, 
  QrCode, 
  Sparkles, 
  X, 
  ShieldAlert, 
  Compass, 
  Play, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Info,
  CheckCircle2,
  AlertCircle,
  Mic,
  MicOff
} from 'lucide-react';
import { useStore } from '../store/useStore';

declare global {
  interface Window {
    Sketchfab: any;
  }
}

export function AdvancedMedicalBody({ showLabels = true }: { showLabels?: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [api, setApi] = useState<any>(null);

  // Extract shared state and actions for voice-to-text integration
  const { 
    isTranscriptionOpen, 
    transcript, 
    interimTranscript, 
    setIsTranscriptionOpen 
  } = useStore();

  // AR settings, variables, and state hooks
  const [isARHubOpen, setIsARHubOpen] = useState(false);
  const [arMode, setArMode] = useState<'none' | 'simulated' | 'webxr'>('none');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [arTrackingStatus, setArTrackingStatus] = useState<'initializing' | 'tracking' | 'unstable'>('initializing');
  const [showQrInstructions, setShowQrInstructions] = useState(false);
  const [arScalePercent, setArScalePercent] = useState(100);
  const [simulatedDistance, setSimulatedDistance] = useState(1.45);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // High Precision Gesture Tuner settings
  const [isTuningOpen, setIsTuningOpen] = useState(false);
  const [sensitivityMultiplier, setSensitivityMultiplier] = useState(3.0);
  const [smoothingPercent, setSmoothingPercent] = useState(100); // 100 represents max smoothing (fluid liquid)
  const [adaptiveZoomSpeed, setAdaptiveZoomSpeed] = useState(true);
  const [kineticInertia, setKineticInertia] = useState(true);

  // Derived smoothing factor (100% smoothing -> 0.02, 10% smoothing -> 0.32)
  const smoothingFactor = 0.32 - ((smoothingPercent - 10) / 90) * 0.30;

  // Diagnostic states
  const [diagVelX, setDiagVelX] = useState(0);
  const [diagVelY, setDiagVelY] = useState(0);
  const [diagVelZoom, setDiagVelZoom] = useState(0);

  // Synchronize dynamic references for the animation frame loops (to prevent stale closures)
  const sensitivityRef = useRef(sensitivityMultiplier);
  const smoothingRef = useRef(smoothingFactor);
  const adaptiveRef = useRef(adaptiveZoomSpeed);
  const inertiaRef = useRef(kineticInertia);

  useEffect(() => { sensitivityRef.current = sensitivityMultiplier; }, [sensitivityMultiplier]);
  useEffect(() => { smoothingRef.current = smoothingFactor; }, [smoothingFactor]);
  useEffect(() => { adaptiveRef.current = adaptiveZoomSpeed; }, [adaptiveZoomSpeed]);
  useEffect(() => { inertiaRef.current = kineticInertia; }, [kineticInertia]);

  // Handle throttled high-performance diagnostics dispatching
  useEffect(() => {
    const handleDiag = (e: any) => {
      if (e.detail) {
        setDiagVelX(e.detail.velX);
        setDiagVelY(e.detail.velY);
        setDiagVelZoom(e.detail.velZ);
      }
    };
    window.addEventListener('update-diagnostics', handleDiag);
    return () => window.removeEventListener('update-diagnostics', handleDiag);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (arMode !== 'simulated') return;
    setArTrackingStatus('initializing');
    const t = setTimeout(() => {
      setArTrackingStatus('tracking');
    }, 1500);
    return () => clearTimeout(t);
  }, [arMode]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Webcam video load error:", e));
    }
  }, [stream, arMode]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const triggerGesture = (detail: { rotateX?: number; rotateY?: number; zoom?: number; panX?: number; panY?: number }) => {
    window.dispatchEvent(new CustomEvent('gesture-update', { detail }));
  };

  const handleStartAR = () => {
    setIsARHubOpen(true);
  };

  const handleNativeWebXR = () => {
    if (api) {
      api.startAR(
        () => {
          console.log('AR Started successfully');
          setArMode('webxr');
          setIsARHubOpen(false);
        }, 
        (err: any) => {
          console.error('AR Load Error', err);
          alert("Native WebXR could not initialize immediately. Checking device credentials or launching simulated backup...");
          startSimulatedAR();
        }
      );
    }
  };

  const startSimulatedAR = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      setArMode('simulated');
      setWebcamEnabled(true);
      setIsARHubOpen(false);
    } catch (err) {
      console.warn("webcam access blocked/unavailable, running simulated fallback with neural cyber background", err);
      setArMode('simulated');
      setWebcamEnabled(false);
      setIsARHubOpen(false);
    }
  };

  const stopSimulatedAR = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setArMode('none');
    setWebcamEnabled(false);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl || 'https://ai.studio/build')}`;


  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.message === "Script error." || 
        (event.filename && event.filename.includes('sketchfab')) || 
        (event.error && event.error.stack && event.error.stack.includes('sketchfab'))
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason && 
        (event.reason.message === "Script error." || 
         String(event.reason).includes('sketchfab') || 
         (event.reason.stack && event.reason.stack.includes('sketchfab')))
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleRejection, true);

    return () => {
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleRejection, true);
    };
  }, []);

  useEffect(() => {
    let sketchfabClient: any;
    let isMounted = true;

    const initSketchfab = () => {
      if (!isMounted || !iframeRef.current || !window.Sketchfab) return;
      
      sketchfabClient = new window.Sketchfab(iframeRef.current);
      sketchfabClient.init('9b0b079953b840bc9a13f524b60041e4', {
        success: (apiInstance: any) => {
          if (!isMounted) return;
          apiInstance.start();
          apiInstance.addEventListener('viewerready', () => {
             if (!isMounted) return;
             setApi(apiInstance);
          });
        },
        error: () => console.error("Sketchfab API error"),
        autostart: 1,
        transparent: 1,
        ui_theme: 'dark'
      });
    };

    if (!window.Sketchfab) {
      if (!document.getElementById('sketchfab-api-script')) {
        const script = document.createElement('script');
        script.id = 'sketchfab-api-script';
        script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
        script.async = true;
        script.onload = initSketchfab;
        document.body.appendChild(script);
      } else {
        const script = document.getElementById('sketchfab-api-script') as HTMLScriptElement;
        script.addEventListener('load', initSketchfab);
      }
    } else {
      initSketchfab();
    }

    return () => {
      isMounted = false;
      // Cleanup api if needed, Sketchfab doesn't have a direct destroy usually, 
      // but the iframe gets unmounted anyway.
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    let rafId: number;
    let cameraState: { eye: THREE.Vector3, target: THREE.Vector3 } | null = null;
    let targetState: { eye: THREE.Vector3, target: THREE.Vector3 } | null = null;
    const initialEye = new THREE.Vector3();
    const initialTarget = new THREE.Vector3();
    
    // Physical Inertia Velocities
    let velRotateX = 0;
    let velRotateY = 0;
    let velZoom = 0;
    let velPanX = 0;
    let velPanY = 0;

    let lastGestureTime = 0;
    let frameCount = 0;

    // Get original configuration coordinates for perfect recalibration
    api.getCameraLookAt((err: any, camera: any) => {
      if (!err && camera) {
        const eye = new THREE.Vector3(camera.position[0], camera.position[1], camera.position[2]);
        const target = new THREE.Vector3(camera.target[0], camera.target[1], camera.target[2]);
        
        initialEye.copy(eye);
        initialTarget.copy(target);

        cameraState = { eye: eye.clone(), target: target.clone() };
        targetState = { eye: eye.clone(), target: target.clone() };
      }
    });

    const loop = () => {
      if (cameraState && targetState) {
        const curInertia = inertiaRef.current;
        const curSensitivity = sensitivityRef.current;
        const curAdaptive = adaptiveRef.current;
        const curSmoothing = smoothingRef.current;

        // 1. Process kinetic flight velocities if inertia momentum is checked
        if (curInertia && (Math.abs(velRotateX) > 0.0001 || Math.abs(velRotateY) > 0.0001 || Math.abs(velZoom) > 0.0001 || Math.abs(velPanX) > 0.0001 || Math.abs(velPanY) > 0.0001)) {
          const eye = targetState.eye;
          const target = targetState.target;
          const dir = new THREE.Vector3().subVectors(eye, target);

          // Physiological distance scaling (slowing rotation proportional to zoom depth)
          const distanceScale = curAdaptive ? Math.max(0.15, Math.min(1.5, dir.length() / 15.0)) : 1.0;

          // Apply kinetic Zoom
          if (Math.abs(velZoom) > 0.0001) {
            const zoomFact = 1 - velZoom * 0.12 * curSensitivity;
            dir.multiplyScalar(Math.max(0.05, zoomFact));
          }

          // Apply kinetic rotational orbit
          if (Math.abs(velRotateX) > 0.0001 || Math.abs(velRotateY) > 0.0001) {
            const rotScalar = distanceScale * curSensitivity;
            if (velRotateY) {
              dir.applyAxisAngle(new THREE.Vector3(0, 0, 1), velRotateY * 0.08 * rotScalar);
            }
            if (velRotateX) {
              const right = new THREE.Vector3(0, 0, 1).cross(dir).normalize();
              if (right.lengthSq() > 0.01) {
                dir.applyAxisAngle(right, velRotateX * 0.08 * rotScalar);
              }
            }
          }

          // Apply panning kinetic velocity
          if (Math.abs(velPanX) > 0.0001 || Math.abs(velPanY) > 0.0001) {
            const right = new THREE.Vector3(0, 0, 1).cross(dir).normalize();
            const up = new THREE.Vector3().crossVectors(dir, right).normalize();
            
            const panScalar = dir.length() * 0.01 * curSensitivity;
            const panVec = right.multiplyScalar(velPanX * panScalar).add(up.multiplyScalar(velPanY * panScalar));
            target.add(panVec);
          }

          targetState.eye.copy(target).add(dir);

          // Graceful friction drag decay
          const decay = 0.92;
          velRotateX *= decay;
          velRotateY *= decay;
          velZoom *= decay;
          velPanX *= decay;
          velPanY *= decay;
        }

        // 2. Linear Double-Buffered target tracking interpolation
        if (cameraState.eye.distanceTo(targetState.eye) > 0.0002 || cameraState.target.distanceTo(targetState.target) > 0.0002) {
          cameraState.eye.lerp(targetState.eye, curSmoothing);
          cameraState.target.lerp(targetState.target, curSmoothing);

          api.setCameraLookAt(
            [cameraState.eye.x, cameraState.eye.y, cameraState.eye.z],
            [cameraState.target.x, cameraState.target.y, cameraState.target.z],
            0
          );
        }

        // 3. Dispatch high-performance throttled motion diagnostic telemetry
        frameCount++;
        if (frameCount % 6 === 0) {
          window.dispatchEvent(new CustomEvent('update-diagnostics', {
            detail: { velX: velRotateX, velY: velRotateY, velZ: velZoom }
          }));
        }

        // 4. Background Standby Sync. Absorbs native Sketchfab mouse drags & wheels to avoid physical snapbacks!
        if (frameCount % 18 === 0 && (Date.now() - lastGestureTime > 1150)) {
          api.getCameraLookAt((err: any, camera: any) => {
            if (!err && camera && cameraState && targetState) {
              const eyeX = camera.position[0];
              const eyeY = camera.position[1];
              const eyeZ = camera.position[2];
              const targetX = camera.target[0];
              const targetY = camera.target[1];
              const targetZ = camera.target[2];

              const currentLocalEye = new THREE.Vector3(eyeX, eyeY, eyeZ);
              const currentLocalTarget = new THREE.Vector3(targetX, targetY, targetZ);

              // Update coordinates in-place only if they diverged noticeably
              if (cameraState.eye.distanceTo(currentLocalEye) > 0.01 || cameraState.target.distanceTo(currentLocalTarget) > 0.01) {
                targetState.eye.copy(currentLocalEye);
                targetState.target.copy(currentLocalTarget);
                cameraState.eye.copy(currentLocalEye);
                cameraState.target.copy(currentLocalTarget);
              }
            }
          });
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const handleGesture = (e: any) => {
      if (!targetState) return;
      if (!e.detail) return;

      lastGestureTime = Date.now();
      const { rotateX, rotateY, zoom, panX, panY, reset } = e.detail;

      // Handle Full Recenter System Calls
      if (reset) {
        velRotateX = 0;
        velRotateY = 0;
        velZoom = 0;
        velPanX = 0;
        velPanY = 0;

        targetState.eye.copy(initialEye);
        targetState.target.copy(initialTarget);
        return;
      }

      if (!rotateX && !rotateY && !zoom && !panX && !panY) return;

      const curInertia = inertiaRef.current;
      const curSensitivity = sensitivityRef.current;
      const curAdaptive = adaptiveRef.current;

      const eye = targetState.eye;
      const target = targetState.target;
      const dir = new THREE.Vector3().subVectors(eye, target);
      const distanceScale = curAdaptive ? Math.max(0.15, Math.min(1.5, dir.length() / 15.0)) : 1.0;

      if (!curInertia) {
        // DIRECT HIGH-PRECISION LOCK (Zero latency translation matching)
        if (zoom) {
          const zoomFactor = 1 - zoom * 0.65 * curSensitivity;
          dir.multiplyScalar(Math.max(0.05, zoomFactor));
        }

        if (rotateX || rotateY) {
          const scale = distanceScale * curSensitivity;
          if (rotateY) {
            dir.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotateY * 1.4 * scale);
          }
          if (rotateX) {
            const right = new THREE.Vector3(0, 0, 1).cross(dir).normalize();
            if (right.lengthSq() > 0.01) {
              dir.applyAxisAngle(right, rotateX * 1.4 * scale);
            }
          }
        }

        if (panX || panY) {
          const right = new THREE.Vector3(0, 0, 1).cross(dir).normalize();
          const up = new THREE.Vector3().crossVectors(dir, right).normalize();

          const panDist = dir.length() * 0.045 * curSensitivity;
          const panVec = right.multiplyScalar(panX * panDist).add(up.multiplyScalar(panY * panDist));
          target.add(panVec);
        }

        targetState.eye.copy(target).add(dir);

        // Immediate override of active inertias
        velRotateX = 0;
        velRotateY = 0;
        velZoom = 0;
        velPanX = 0;
        velPanY = 0;
      } else {
        // SPACIOUS FLUID MOMENTUM (Smooth incremental cumulative acceleration)
        if (rotateX) velRotateX += rotateX * 0.18;
        if (rotateY) velRotateY += rotateY * 0.18;
        if (zoom) velZoom += zoom * 0.18;
        if (panX) velPanX += panX * 0.18;
        if (panY) velPanY += panY * 0.18;

        // Velocity boundaries capping
        const maxRot = 0.7;
        const maxZoom = 0.5;
        const maxPan = 0.4;

        velRotateX = Math.max(-maxRot, Math.min(maxRot, velRotateX));
        velRotateY = Math.max(-maxRot, Math.min(maxRot, velRotateY));
        velZoom = Math.max(-maxZoom, Math.min(maxZoom, velZoom));
        velPanX = Math.max(-maxPan, Math.min(maxPan, velPanX));
        velPanY = Math.max(-maxPan, Math.min(maxPan, velPanY));
      }
    };

    window.addEventListener('gesture-update', handleGesture);
    return () => {
      window.removeEventListener('gesture-update', handleGesture);
      cancelAnimationFrame(rafId);
    };
  }, [api]);

  const handleCloseARHub = () => {
    setIsARHubOpen(false);
  };

  return (
    <Html fullscreen zIndexRange={[100, 0]}>
      <div 
        className={`w-full h-full pointer-events-auto flex flex-col relative transition-colors duration-500 overflow-hidden ${
          arMode === 'simulated' ? 'bg-zinc-950/20' : 'bg-black'
        }`}
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* WEBCAM VIDEO STREAM FOR SIMULATED AR */}
        {arMode === 'simulated' && (
          <>
            {webcamEnabled ? (
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover -z-10"
              />
            ) : (
              // Cybernetic Background fallback if user has no camera/blocked permission
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(9,9,11,0.95),rgba(4,4,5,0.97))] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent)]" />
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />
              </div>
            )}

            {/* CYBER SCANNING HUD LINE */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-[bounce_5s_infinite_ease-in-out] pointer-events-none z-10 opacity-70" />

            {/* SIMULATED AR SYSTEM HUD OVERLAY */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-20 font-mono">
              
              {/* TOP HUD ROW */}
              <div className="flex justify-between items-start">
                <div className="bg-black/80 border border-cyan-500/30 text-cyan-400 py-3 px-5 rounded-lg flex flex-col gap-1 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                    <span className="text-[10px] font-bold tracking-widest uppercase">DESKTOP SIMULATED AR ACTIVE</span>
                  </div>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider">PROJECTOR ENGAGEMENT SYSTEM</span>
                </div>

                <button 
                  onClick={stopSimulatedAR}
                  className="pointer-events-auto bg-rose-600/90 hover:bg-rose-500 hover:text-white text-white text-[10px] font-bold py-2.5 px-5 rounded-lg border border-rose-500/50 shadow-lg tracking-widest uppercase transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Minimize2 size={13} />
                  Exit AR Simulation
                </button>
              </div>

              {/* RETICLE AND TARGET TRACKING GRID */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64 border border-cyan-500/10 rounded-full animate-[spin_40s_linear_infinite] flex items-center justify-center">
                  <div className="absolute w-44 h-44 border-2 border-dashed border-cyan-500/20 rounded-full" />
                  <div className="absolute w-20 h-20 border border-cyan-400/40 rounded-full animate-pulse" />
                  
                  {/* Cyber angles */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-cyan-400/80" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-cyan-400/80" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[2px] bg-cyan-400/80" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-[2px] bg-cyan-400/80" />
                </div>
                
                {/* Status indicator tag */}
                <div className="absolute mt-72 px-4 py-1.5 bg-cyan-950/80 border border-cyan-400/40 text-[9px] uppercase tracking-[0.2em] text-cyan-300 rounded font-bold backdrop-blur-sm animate-pulse shadow-lg flex items-center gap-2">
                  <Compass size={11} className="animate-spin" />
                  AR Plane Stabilized: {arTrackingStatus === 'tracking' ? '100% Locked' : 'Calibrating...'}
                </div>
              </div>

              {/* BOTTOM ROW: AR MANUAL NAVIGATION CONTROLS */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
                {/* Left Telemetry card */}
                <div className="bg-black/80 border border-cyan-500/20 p-4 rounded-xl backdrop-blur-md text-[10px] text-zinc-300 flex flex-col gap-2 min-w-[220px] shadow-2xl">
                  <div className="text-cyan-400 font-bold uppercase tracking-widest text-[9px] border-b border-white/10 pb-1.5">AR Telemetry Output</div>
                  <div className="flex justify-between"><span>Tracking Source:</span> <span className="text-cyan-300 font-bold">{webcamEnabled ? "Physical Video" : "Neural Pattern"}</span></div>
                  <div className="flex justify-between"><span>Active System:</span> <span className="text-white">Anatomy Pro 1.1</span></div>
                  <div className="flex justify-between"><span>Scale Multiplier:</span> <span className="text-cyan-300 font-bold">{arScalePercent}%</span></div>
                  <div className="flex justify-between"><span>Distance Ratio:</span> <span className="text-white">{simulatedDistance.toFixed(2)}m</span></div>
                  <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-white/5">
                    <span>Quality Index:</span>
                    <span className="bg-emerald-500/15 text-emerald-400 text-[8px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wider">High Stability</span>
                  </div>
                </div>

                {/* Interactive controller card */}
                <div className="pointer-events-auto bg-black/90 border border-indigo-500/30 p-4 rounded-2xl backdrop-blur-md flex flex-wrap gap-2.5 max-w-md items-center shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                  <div className="w-full text-indigo-400 font-bold uppercase tracking-widest text-[9px] border-b border-white/10 pb-1.5 flex items-center gap-1.5">
                    <Sparkles size={11} className="animate-pulse" />
                    Interactive AR Modifiers
                  </div>

                  <button 
                    onClick={() => {
                      triggerGesture({ rotateY: -0.15 });
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-colors hover:border-indigo-500/50"
                    title="Rotate Left"
                  >
                    <RefreshCw size={13} className="scale-x-[-1]" />
                    Rot L
                  </button>
                  
                  <button 
                    onClick={() => {
                      triggerGesture({ rotateY: 0.15 });
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-colors hover:border-indigo-500/50"
                    title="Rotate Right"
                  >
                    <RefreshCw size={13} />
                    Rot R
                  </button>

                  <button 
                    onClick={() => {
                      triggerGesture({ zoom: 0.1 });
                      setArScalePercent(prev => Math.min(250, prev + 10));
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-colors hover:border-indigo-500/50"
                    title="Scale Up"
                  >
                    <ZoomIn size={13} />
                    Scale +
                  </button>
                  
                  <button 
                    onClick={() => {
                      triggerGesture({ zoom: -0.1 });
                      setArScalePercent(prev => Math.max(30, prev - 10));
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-colors hover:border-indigo-500/50"
                    title="Scale Down"
                  >
                    <ZoomOut size={13} />
                    Scale -
                  </button>

                  <button 
                    onClick={() => {
                      setSimulatedDistance(prev => Math.min(3.5, prev + 0.15));
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center text-[10px] uppercase font-bold tracking-wider transition-colors"
                    title="Adjust Depth Push"
                  >
                    Push Away
                  </button>

                  <button 
                    onClick={() => {
                      setSimulatedDistance(prev => Math.max(0.5, prev - 0.15));
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center text-[10px] uppercase font-bold tracking-wider transition-colors"
                    title="Adjust Depth Pull"
                  >
                    Pull Near
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* LOADING SCREEN */}
        {!api && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 z-20 font-mono text-zinc-500 text-sm backdrop-blur-md">
            <div className="flex flex-col items-center gap-6">
              <div className="relative flex items-center justify-center w-16 h-16">
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-400 animate-[spin_1.5s_linear_infinite_reverse]"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="text-white font-bold tracking-widest text-xs">SYNCHRONIZING</div>
                <div className="text-[9px] uppercase tracking-[0.3em] opacity-50">Neuro-Haptic Hologram Engine</div>
              </div>
            </div>
          </div>
        )}
        
        {/* TOP STATUS ROW FOR REGULAR MODE */}
        {api && arMode !== 'simulated' && (
          <>
            <div className="absolute top-6 left-6 z-20 pointer-events-none bg-black/60 text-emerald-400 text-[10px] font-mono py-2 px-4 border border-emerald-500/20 rounded-full flex items-center gap-3 backdrop-blur-md shadow-2xl">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex items-center justify-center"></div>
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="font-bold tracking-widest uppercase">Hand Tracking Synced</span>
            </div>
            
            <div className="absolute top-6 right-6 z-20 flex gap-3 pointer-events-auto">
              {/* VOICE CAPTION MIC ACTION TOGGLE */}
              <button
                onClick={() => setIsTranscriptionOpen(!isTranscriptionOpen)}
                className={`text-[10px] font-bold font-mono py-2.5 px-5 rounded-full border transition-all flex items-center gap-2 tracking-widest uppercase hover:scale-105 active:scale-95 ${
                  isTranscriptionOpen 
                    ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] animate-pulse' 
                    : 'bg-zinc-900/90 border-white/10 text-indigo-400 hover:text-white shadow-xl'
                }`}
              >
                {isTranscriptionOpen ? <Mic className="w-3.5 h-3.5 text-indigo-200" /> : <MicOff className="w-3.5 h-3.5 text-zinc-400" />}
                {isTranscriptionOpen ? 'Mic Active' : 'Voice Captions'}
              </button>

              {/* PRECISION TUNER ACTION TOGGLE */}
              <button
                onClick={() => setIsTuningOpen(!isTuningOpen)}
                className={`text-[10px] font-bold font-mono py-2.5 px-5 rounded-full border transition-all flex items-center gap-2 tracking-widest uppercase hover:scale-105 active:scale-95 ${
                  isTuningOpen 
                    ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]' 
                    : 'bg-zinc-900/90 border-white/10 text-cyan-400 hover:text-white shadow-xl'
                }`}
              >
                <Compass className={`w-3.5 h-3.5 ${isTuningOpen ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                Precision Tuner
              </button>

              <button 
                onClick={handleStartAR}
                className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-[10px] font-bold font-mono py-2.5 px-5 rounded-full border border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center gap-2 tracking-widest uppercase hover:scale-105 active:scale-95"
              >
                <Scan className="w-4 h-4 animate-pulse" />
                Enter AR Hub
              </button>
            </div>

            {/* FLOATING GESTURE CALIBRATION HUD OVERLAY */}
            {isTuningOpen && (
              <div className="absolute right-6 top-20 z-20 w-80 bg-zinc-950/95 border border-emerald-500/35 p-5 rounded-2xl text-white font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-lg animate-[fadeIn_0.15s_ease-out] pointer-events-auto flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
                    <span className="font-bold tracking-wider uppercase text-[10px]">Neural Precision Tuner</span>
                  </div>
                  <button 
                    onClick={() => setIsTuningOpen(false)}
                    className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Live Diagnostic Activity Stream */}
                <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
                  <span className="text-[9px] text-zinc-400 tracking-wider uppercase font-bold block">Live Velocity Stream</span>
                  
                  {/* Pitch Activity Row */}
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500">Angle Pitch:</span>
                    <div className="flex items-center gap-1.5 w-2/3">
                      <div className="flex-1 bg-zinc-950 h-1.5 rounded-full overflow-hidden flex justify-start">
                        <div 
                          className="bg-cyan-500 h-full transition-all duration-75"
                          style={{ width: `${Math.min(100, Math.abs(diagVelX) * 200)}%` }}
                        />
                      </div>
                      <span className="text-zinc-300 w-8 text-right font-mono text-[9px]">{(diagVelX * 10).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Yaw Activity Row */}
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500">Angle Yaw:</span>
                    <div className="flex items-center gap-1.5 w-2/3">
                      <div className="flex-1 bg-zinc-950 h-1.5 rounded-full overflow-hidden flex justify-start">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-75"
                          style={{ width: `${Math.min(100, Math.abs(diagVelY) * 200)}%` }}
                        />
                      </div>
                      <span className="text-zinc-300 w-8 text-right font-mono text-[9px]">{(diagVelY * 10).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Zoom Activity Row */}
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500">Zoom Force:</span>
                    <div className="flex items-center gap-1.5 w-2/3">
                      <div className="flex-1 bg-zinc-950 h-1.5 rounded-full overflow-hidden flex justify-start">
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-75"
                          style={{ width: `${Math.min(100, Math.abs(diagVelZoom) * 200)}%` }}
                        />
                      </div>
                      <span className="text-zinc-300 w-8 text-right font-mono text-[9px]">{(diagVelZoom * 10).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Slider 1: Sensitivity multiplier */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300 font-bold uppercase text-[10px] tracking-wide">Sensitivity multiplier</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 py-0.5 px-2 rounded-full border border-emerald-500/20 text-[10px]">{sensitivityMultiplier.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={sensitivityMultiplier}
                    onChange={(e) => setSensitivityMultiplier(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-[9px] text-zinc-500 leading-normal">Calibrates standard tracking scale ratios from gestures.</span>
                </div>

                {/* Slider 2: Dampening (Smoothing factor) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300 font-bold uppercase text-[10px] tracking-wide">Smoothing (Dampening)</span>
                    <span className="text-cyan-400 font-bold bg-cyan-500/10 py-0.5 px-2 rounded-full border border-cyan-500/20 text-[10px]">
                      {smoothingPercent >= 85 ? "Fluid Liquid (Max)" : smoothingPercent <= 25 ? "Active Snap (Direct)" : "Balanced Elastic"}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={smoothingPercent}
                    onChange={(e) => setSmoothingPercent(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-[9px] text-zinc-500 leading-normal">Optimizes gesture interpolations. Higher values slide smoothly (maximum default), lower values target directly.</span>
                </div>

                {/* Toggle 1: Adaptive Depth Scaling */}
                <div className="flex items-center justify-between py-2 border-t border-white/5">
                  <div className="flex flex-col gap-0.5 pr-3">
                    <span className="text-zinc-300 font-bold uppercase text-[10px] tracking-wide">Distance Adaption</span>
                    <span className="text-[9px] text-zinc-500 leading-tight">Decreases orbital angle speed as you zoom-in close for surgical microscopic detail.</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={adaptiveZoomSpeed}
                    onChange={(e) => setAdaptiveZoomSpeed(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-zinc-900 border-zinc-700 cursor-pointer accent-emerald-500 shrink-0"
                  />
                </div>

                {/* Toggle 2: Kinetic Momentum */}
                <div className="flex items-center justify-between py-2 border-t border-white/5 col-span-2">
                  <div className="flex flex-col gap-0.5 pr-3">
                    <span className="text-zinc-300 font-bold uppercase text-[10px] tracking-wide">Kinetic Inertia (Momentum)</span>
                    <span className="text-[9px] text-zinc-500 leading-tight">Adds spatial momentum to gestures, letting model spin gracefully with decay when swiped.</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={kineticInertia}
                    onChange={(e) => setKineticInertia(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-zinc-900 border-zinc-700 cursor-pointer accent-emerald-500 shrink-0"
                  />
                </div>

                {/* Reset Trigger */}
                <button
                  onClick={() => {
                    setSensitivityMultiplier(3.0);
                    setSmoothingPercent(100);
                    setAdaptiveZoomSpeed(true);
                    setKineticInertia(true);
                    window.dispatchEvent(new CustomEvent('gesture-update', {
                      detail: { rotateX: 0, rotateY: 0, zoom: 0, panX: 0, panY: 0, reset: true }
                    }));
                  }}
                  className="mt-1 w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-emerald-500/30 text-[10px] uppercase font-bold py-2.5 rounded-xl transition-all tracking-wider text-center"
                >
                  Recenter Model Viewport
                </button>
              </div>
            )}

            {/* REAL-TIME TEACHER EXPLANATION SUBTITLE OVERLAY */}
            {isTranscriptionOpen && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-3xl bg-zinc-950/90 border border-indigo-500/30 p-5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-md animate-[slideUp_0.2s_ease-out] font-mono pointer-events-auto flex flex-col gap-2">
                <div className="flex items-center justify-between text-[9px] text-zinc-400 border-b border-white/10 pb-1.5 mb-1 bg-transparent">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                    <Mic className="w-3 h-3 animate-pulse text-indigo-200" />
                    <span>CLASSROOM EXPLANATION FEED TRANSMITTER</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 text-indigo-300 font-bold">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                    <span>SPEECH CAPTIONS ACTIVE</span>
                  </div>
                </div>
                
                {/* Transcript text container */}
                <div className="text-sm md:text-base font-bold text-white text-center leading-relaxed h-12 flex items-center justify-center overflow-y-auto px-4">
                  {transcript ? (
                    <span className="text-zinc-100">{transcript}</span>
                  ) : (
                    <span className="text-zinc-500 italic text-xs">Speak into your microphone. Your real-time medical instructions will stream here instantly.</span>
                  )}
                  {interimTranscript && (
                    <span className="text-indigo-400 ml-1.5 italic">{interimTranscript}</span>
                  )}
                </div>

                <div className="flex justify-between items-center text-[8px] text-zinc-600 font-bold mt-1 shadow-none">
                  <span>SYSTEM ACCESSIBILITY TRANSLATION HUD</span>
                  <span>SYNC STATE: ONLINE</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* MAIN EMBED IFRAME (TRANSPARENT BACKGROUND) */}
        <iframe 
          ref={iframeRef}
          id="api-frame"
          title="Animated Full Human Body Anatomy" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking; web-share" 
          className={`w-full flex-1 touch-none outline-none border-none transition-opacity duration-300 relative z-10 ${
            arMode === 'simulated' ? 'opacity-[0.88]' : 'opacity-100'
          }`}
        />

        {/* BOTTOM ATTRIBUTION TRAIL */}
        {arMode !== 'simulated' && (
          <div className="bg-black text-[11px] text-zinc-500 py-3 px-4 shadow-xl border-t border-white/5 flex justify-center items-center gap-2 font-mono z-10 relative pointer-events-auto">
            <span>MODEL PROVIDED BY:</span>
            <a href="https://sketchfab.com/AVRcontent" target="_blank" rel="noreferrer" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              AVRcontent
            </a>
            <span>ON SKETCHFAB</span>
          </div>
        )}

        {/* INTERACTIVE AR HUB INSTRUCTIONAL MODAL */}
        {isARHubOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
            <div className="relative w-full max-w-2xl bg-zinc-900 border border-indigo-500/40 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.15)] flex flex-col overflow-hidden text-white">
              
              {/* Modal header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-zinc-950/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Scan size={20} className="animate-[pulse_2s_infinite]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wider font-mono">AUGMENTED REALITY (AR) HUB</h3>
                    <p className="text-[10px] text-zinc-400 font-mono tracking-wide mt-0.5">CHOOSE YOUR MULTI-DEVICE OR WEBXR VIEWPORT</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleCloseARHub}
                  className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6 font-mono text-xs">
                
                {/* Options grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* OPTION 1: SIMULATED ENVIRONMENT */}
                  <div className="bg-zinc-950/60 border border-white/5 hover:border-cyan-500/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 group">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
                          <Camera size={18} />
                        </div>
                        <span className="bg-cyan-400/10 text-cyan-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">PROJECTOR</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">Simulated Desk AR</h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed mt-2">
                          Utilize client-side target camera feeds to overlay the human anatomy diagram cleanly in your classroom or workspace background. Perfect for desktops.
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={startSimulatedAR}
                      className="mt-6 w-full bg-cyan-600/90 hover:bg-cyan-500 text-white font-bold py-2 px-3 rounded-lg text-center tracking-widest text-[9px] uppercase transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play size={11} /> Start Workspace
                    </button>
                  </div>

                  {/* OPTION 2: NATIVE WEBXR */}
                  <div className="bg-zinc-950/60 border border-white/5 hover:border-indigo-500/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 group">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                          <Sparkles size={18} />
                        </div>
                        <span className="bg-indigo-400/10 text-indigo-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">WEBXR</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">Native WebXR API</h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed mt-2">
                          Launches standard spatial head tracking if supported by your browser or headsets, putting the organs and muscles at real world 1:1 scale ratios.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={handleNativeWebXR}
                      className="mt-6 w-full bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-lg text-center tracking-widest text-[9px] uppercase transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={11} /> Launch Stereoscopic
                    </button>
                  </div>

                  {/* OPTION 3: SCAN QR FOR MOBILE */}
                  <div className="bg-zinc-950/60 border border-white/5 hover:border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 group">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                          <Smartphone size={18} />
                        </div>
                        <span className="bg-emerald-400/10 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">MOBILE</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">ARKit / ARCore Link</h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed mt-2">
                          Project the anatomical skeleton onto your exact room floor using Safari Quick Look (.usdz) or Android Scene Viewer (.glb) directly via mobile.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowQrInstructions(prev => !prev)}
                      className="mt-6 w-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-center tracking-widest text-[9px] uppercase transition-all flex items-center justify-center gap-1.5"
                    >
                      <QrCode size={11} /> {showQrInstructions ? "Hide Scan Code" : "Show QR Code"}
                    </button>
                  </div>

                </div>

                {/* DYNAMIC QR CODE INSTRUCTION OVERLAY */}
                {showQrInstructions && (
                  <div className="mt-4 p-5 bg-zinc-950 border border-emerald-500/30 rounded-xl flex flex-col md:flex-row gap-5 items-center animate-[slideDown_0.25s_ease-out]">
                    
                    {/* QR Code Graphic wrapper */}
                    <div className="p-3 bg-white rounded-lg flex items-center justify-center relative shadow-xl min-w-[150px] min-h-[150px]">
                      <img 
                        src={qrCodeUrl} 
                        alt="Mobile Scan QR code" 
                        referrerPolicy="no-referrer"
                        className="w-36 h-36 border-2 border-zinc-100"
                      />
                    </div>

                    {/* Step Instructions */}
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                        <Smartphone size={13} className="animate-bounce" />
                        Cast to Mobile Room instructions:
                      </div>

                      <ol className="list-decimal pl-4 space-y-1.5 text-zinc-300 text-[10px] leading-relaxed">
                        <li>Scan the QR code with your iPad, iPhone, or Android camera app.</li>
                        <li>Open the browser prompt link to open hyperVision on that device.</li>
                        <li>Inside the 3D viewer, tap the <span className="font-bold text-indigo-400">"Enter AR"</span> button.</li>
                        <li>Point your device at a flat surface (floor, tabletop) to lock ARKit/ARCore room scale.</li>
                      </ol>

                      <div className="flex items-center gap-2 p-2 bg-emerald-950/40 border border-emerald-500/20 text-[9px] text-emerald-400 rounded-lg">
                        <Info size={11} className="shrink-0" />
                        Safari on iOS 13+ support native USDZ Quick Look; and Chrome on Android integrates Google Scene Viewer placement.
                      </div>
                    </div>

                  </div>
                )}

                {/* Web container disclaimer */}
                <div className="p-4 bg-zinc-950/40 border border-white/5 text-[10px] text-zinc-400 rounded-xl leading-relaxed flex gap-2.5 items-start">
                  <AlertCircle size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-400 block mb-0.5 uppercase tracking-wider">CONTAINER IFRAME NOTICE</span>
                    WebXR spatial tracking require absolute hardware secure origin (HTTPS) and camera pipeline access. If experiencing limits in the sandbox preview mode, make sure to click <span className="font-bold text-white uppercase italic">"Open in New Tab"</span> in the settings bar to enable full hardware acceleration.
                  </div>
                </div>

              </div>

              {/* Modal footer */}
              <div className="bg-zinc-950/60 p-4 border-t border-white/10 text-center text-[10px] text-zinc-500 font-mono flex justify-between items-center px-6">
                <span>HYPERVISION SYSTEM AUTOMATION</span>
                <span className="text-indigo-400">Ver 2.50xr</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </Html>
  );
}



