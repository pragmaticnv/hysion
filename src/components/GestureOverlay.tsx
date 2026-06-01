import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands, Results, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera as CameraIcon, Hand, ZoomIn, RotateCw, X, Settings2, Trash2 } from 'lucide-react';

// Kalman Filter for ultra-precise state estimation
class KalmanFilter {
  x: number; // state (position)
  v: number; // velocity
  p: number[][]; // error covariance
  q: number; // process noise
  r: number; // measurement noise
  lastT: number;

  constructor(processNoise = 0.01, measurementNoise = 0.005) {
    this.x = 0;
    this.v = 0;
    this.p = [[1, 0], [0, 1]];
    this.q = processNoise;
    this.r = measurementNoise;
    this.lastT = -1;
  }

  update(z: number, t: number) {
    if (this.lastT < 0) {
      this.x = z;
      this.lastT = t;
      return z;
    }

    const dt = t - this.lastT;
    if (dt <= 0) return this.x;
    this.lastT = t;

    // 1. Predict
    // x = F * x
    const nextX = this.x + this.v * dt;
    const nextV = this.v;

    // P = F * P * F' + Q
    // F = [[1, dt], [0, 1]]
    const p00 = this.p[0][0] + dt * (this.p[1][0] + this.p[0][1]) + dt * dt * this.p[1][1] + this.q;
    const p01 = this.p[0][1] + dt * this.p[1][1];
    const p10 = this.p[1][0] + dt * this.p[1][1];
    const p11 = this.p[1][1] + this.q;

    // 2. Update
    // y = z - H * x (H = [1, 0])
    const y = z - nextX;
    
    // S = H * P * H' + R
    const s = p00 + this.r;
    
    // K = P * H' * S^-1
    const k0 = p00 / s;
    const k1 = p10 / s;

    // x = x + K * y
    this.x = nextX + k0 * y;
    this.v = nextV + k1 * y;

    // P = (I - K * H) * P
    this.p[0][0] = (1 - k0) * p00;
    this.p[0][1] = (1 - k0) * p01;
    this.p[1][0] = p10 - k1 * p00;
    this.p[1][1] = p11 - k1 * p01;

    return this.x;
  }
}

import { useStore } from '../store/useStore';

export function GestureOverlay() {
  const { isGestureActive: isActive, setIsGestureActive } = useStore();
  const onClose = () => setIsGestureActive(false);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const lastHandPos = useRef<{ x: number; y: number } | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const scanLinePos = useRef(0);

  useEffect(() => {
    if (!isActive || !isCameraReady || !webcamRef.current?.video) return;

    let isStopped = false;
    
    const hands = new Hands({
      locateFile: (file) => {
        return `https://unpkg.com/@mediapipe/hands@0.4.1675469240/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1, // High precision hand tracking
      minDetectionConfidence: 0.7, 
      minTrackingConfidence: 0.7, 
      selfieMode: true
    });

    hands.onResults((results: Results) => {
      if (!isStopped) {
        onResults(results);
      }
    });

    handsRef.current = hands;

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        // Run on every frame for ultra-smooth 60fps tracking
        const video = webcamRef.current?.video;
        if (video && video.readyState >= 2 && handsRef.current && !isStopped) {
          try {
            await handsRef.current.send({ image: video });
          } catch (err) {
            if (!isStopped) console.error("MediaPipe hands error:", err);
          }
        }
      },
      width: 640,
      height: 480,
    });
    
    camera.start().catch(err => console.error("Gesture Camera Error:", err));

    return () => {
      isStopped = true;
      camera.stop();
      hands.close();
      handsRef.current = null;
    };
  }, [isActive, isCameraReady]);

  const lastPinchDist = useRef<number | null>(null);
  const lastTwoHandDist = useRef<number | null>(null);
  const generateHoldTime = useRef<number>(0);
  const lastTimestamp = useRef<number>(0);
  
  // OneEuro Filter parameters for ultra-precise/smooth tracking
  const minCutoff = 0.5;
  const beta = 0.7;
  
  const landmarkFilters = useRef<any[]>([]); // Stores Kalman filters for each landmark

  const gestureHistory = useRef<string[]>([]); // For debouncing gestures

  const [activeGesture, setActiveGesture] = useState<string>('None');
  const [showSettings, setShowSettings] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const isDrawModeRef = useRef(isDrawMode);
  useEffect(() => {
    isDrawModeRef.current = isDrawMode;
  }, [isDrawMode]);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingPath, setDrawingPath] = useState<{x: number, y: number}[]>([]);
  
  // Initialize state from local storage or use defaults
  const [sensitivity, setSensitivity] = useState(() => {
    const saved = localStorage.getItem('gestureSensitivity');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved gesture settings", e);
      }
    }
    return {
      rotation: 100, // Maximum responsiveness
      zoom: 100, 
      pan: 100,
      threshold: 0.0001, // Extreme precision threshold
      palmThreshold: 0.6,
      fistThreshold: 1000.0,
      pinchThreshold: 0.05
    };
  });

  // Save to local storage whenever sensitivity changes
  const sensitivityRef = useRef(sensitivity);
  useEffect(() => {
    sensitivityRef.current = sensitivity;
    localStorage.setItem('gestureSensitivity', JSON.stringify(sensitivity));
  }, [sensitivity]);

  // Vector Math Helpers for 3D Kinematics
  const getVector = (p1: any, p2: any) => ({ x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z });
  const magnitude = (v: any) => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

  const onResults = (results: Results) => {
    if (!results || !results.image || !canvasRef.current || !webcamRef.current?.video) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    const drawingCtx = drawingCanvasRef.current?.getContext('2d');
    if (!canvasCtx || !drawingCtx) return;

    // Drawing code
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw video with slightly higher opacity for better visibility
    canvasCtx.globalAlpha = 0.6; 
    canvasCtx.drawImage(
      results.image, 0, 0, canvasRef.current.width, canvasRef.current.height
    );
    canvasCtx.globalAlpha = 1.0;

    // HUD: Scanning Line
    scanLinePos.current = (scanLinePos.current + 5) % canvasRef.current.height; // Faster scan
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, scanLinePos.current);
    canvasCtx.lineTo(canvasRef.current.width, scanLinePos.current);
    canvasCtx.strokeStyle = 'rgba(99, 102, 241, 0.4)'; // Slightly more transparent
    canvasCtx.lineWidth = 2;
    canvasCtx.stroke();
    
    // Corner Accents
    const cornerSize = 40;
    canvasCtx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
    canvasCtx.lineWidth = 3;
    
    // Top Left
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, cornerSize); canvasCtx.lineTo(0, 0); canvasCtx.lineTo(cornerSize, 0);
    canvasCtx.stroke();
    // Top Right
    canvasCtx.beginPath();
    canvasCtx.moveTo(canvasRef.current.width - cornerSize, 0); canvasCtx.lineTo(canvasRef.current.width, 0); canvasCtx.lineTo(canvasRef.current.width, cornerSize);
    canvasCtx.stroke();
    // Bottom Left
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, canvasRef.current.height - cornerSize); canvasCtx.lineTo(0, canvasRef.current.height); canvasCtx.lineTo(cornerSize, canvasRef.current.height);
    canvasCtx.stroke();
    // Bottom Right
    canvasCtx.beginPath();
    canvasCtx.moveTo(canvasRef.current.width - cornerSize, canvasRef.current.height); canvasCtx.lineTo(canvasRef.current.width, canvasRef.current.height); canvasCtx.lineTo(canvasRef.current.width, canvasRef.current.height - cornerSize);
    canvasCtx.stroke();

    // Drawing Logic
    if (!isDrawModeRef.current) {
        drawingCtx.clearRect(0, 0, drawingCanvasRef.current!.width, drawingCanvasRef.current!.height);
    }


    let rotateX = 0;
    let rotateY = 0;
    let zoom = 0;
    let panX = 0;
    let panY = 0;
    let reset = false;
    let currentGesture = 'None';

    // Map results to multiHandLandmarks
    const multiHandLandmarks: any[][] = results.multiHandLandmarks || [];

    if (multiHandLandmarks.length > 0) {
      const now = performance.now();
      const t = now / 1000;
      lastTimestamp.current = now;

      // Initialize filters if needed
      if (landmarkFilters.current.length === 0) {
        landmarkFilters.current = multiHandLandmarks.map(hand => 
          hand.map(() => ({
            x: new KalmanFilter(),
            y: new KalmanFilter(),
            z: new KalmanFilter()
          }))
        );
      }

      const processedLandmarks = multiHandLandmarks.map((hand, handIdx) => {
        if (!landmarkFilters.current[handIdx]) {
          landmarkFilters.current[handIdx] = hand.map(() => ({
            x: new KalmanFilter(),
            y: new KalmanFilter(),
            z: new KalmanFilter()
          }));
        }

        return hand.map((landmark, i) => {
          const filters = landmarkFilters.current[handIdx][i];
          const fx = filters.x.update(landmark.x, t);
          const fy = filters.y.update(landmark.y, t);
          const fz = filters.z.update(landmark.z || 0, t);
          return { x: fx, y: fy, z: fz };
        });
      });

      // Drawing Logic
      if (isDrawModeRef.current && processedLandmarks.length > 0) {
          const landmarks = processedLandmarks[0];
          const indexTip = landmarks[8];
          const thumbTip = landmarks[4];
          const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y, thumbTip.z - indexTip.z);
          
          const x = indexTip.x * drawingCanvasRef.current!.width;
          const y = indexTip.y * drawingCanvasRef.current!.height;

          const isPinching = pinchDist < 0.05;

          if (isPinching) {
              drawingCtx.lineTo(x, y);
              drawingCtx.strokeStyle = 'cyan';
              drawingCtx.lineWidth = 5;
              drawingCtx.stroke();
          } else {
              drawingCtx.beginPath();
              drawingCtx.moveTo(x, y);
          }

          // Dispatch 3D drawing event
          window.dispatchEvent(new CustomEvent('gesture-draw', {
            detail: { 
              x: indexTip.x, 
              y: indexTip.y, 
              z: indexTip.z, 
              isPinching 
            }
          }));
      }

      // Adaptive Sensitivity Calculations - Simplified for 1:1 mapping
      const getAdaptiveMultiplier = (wrist: { x: number, y: number }) => {
        // Slight increase at edges to maintain reachability, but linear speed
        const distFromCenter = Math.hypot(wrist.x - 0.5, wrist.y - 0.5);
        return 1.0 + (distFromCenter * 0.5); // 1.0x to 1.3x max
      };

      // Draw landmarks with Stark-Tech neon glow
      canvasCtx.lineCap = 'round';
      canvasCtx.lineJoin = 'round';
      
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      for (const landmarks of processedLandmarks) {
        // Base hand wireframe
        canvasCtx.shadowBlur = 15;
        canvasCtx.shadowColor = 'rgba(0, 255, 255, 0.8)';
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: 'rgba(0, 255, 255, 0.6)', lineWidth: 2 });
        drawLandmarks(canvasCtx, landmarks, { color: '#ffffff', lineWidth: 1, radius: 2 });
        canvasCtx.shadowBlur = 0;

        // Stark-Tech HUD Elements
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];

        // 1. Data Matrix Overlay
        canvasCtx.font = "12px monospace";
        canvasCtx.fillStyle = "rgba(0, 255, 255, 0.9)";
        canvasCtx.fillText(`SYS.TRACK: [${wrist.x.toFixed(2)}, ${wrist.y.toFixed(2)}]`, wrist.x * width + 20, wrist.y * height - 10);
        canvasCtx.fillText(`Z-DEPTH: ${wrist.z.toFixed(3)}`, wrist.x * width + 20, wrist.y * height + 5);

        // 2. Velocity Vector
        if (lastHandPos.current) {
          const vx = wrist.x - lastHandPos.current.x;
          const vy = wrist.y - lastHandPos.current.y;
          canvasCtx.beginPath();
          canvasCtx.moveTo(wrist.x * width, wrist.y * height);
          canvasCtx.lineTo((wrist.x + vx * 15) * width, (wrist.y + vy * 15) * height);
          canvasCtx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
          canvasCtx.lineWidth = 2;
          canvasCtx.stroke();
        }

        // 3. Dynamic Pinch Reticle
        const handSize = Math.hypot(landmarks[9].x - wrist.x, landmarks[9].y - wrist.y, landmarks[9].z - wrist.z);
        const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y, thumbTip.z - indexTip.z);
        const normalizedPinch = pinchDist / handSize;
        
        if (normalizedPinch < 0.6) { // Show reticle as fingers get close
           const midX = (thumbTip.x + indexTip.x) / 2;
           const midY = (thumbTip.y + indexTip.y) / 2;
           
           // Outer ring
           canvasCtx.beginPath();
           canvasCtx.arc(midX * width, midY * height, Math.max(5, 25 * normalizedPinch), 0, 2 * Math.PI);
           canvasCtx.strokeStyle = normalizedPinch < 0.25 ? 'rgba(0, 255, 100, 0.9)' : 'rgba(0, 255, 255, 0.5)';
           canvasCtx.lineWidth = 2;
           canvasCtx.stroke();
           
           // Crosshairs
           canvasCtx.beginPath();
           canvasCtx.moveTo(midX * width - 25, midY * height);
           canvasCtx.lineTo(midX * width + 25, midY * height);
           canvasCtx.moveTo(midX * width, midY * height - 25);
           canvasCtx.lineTo(midX * width, midY * height + 25);
           canvasCtx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
           canvasCtx.lineWidth = 1;
           canvasCtx.stroke();
        }
      }

      // 4. Dual-Hand Quantum Tether
      if (processedLandmarks.length === 2) {
        const w1 = processedLandmarks[0][0];
        const w2 = processedLandmarks[1][0];
        
        canvasCtx.beginPath();
        canvasCtx.moveTo(w1.x * width, w1.y * height);
        canvasCtx.lineTo(w2.x * width, w2.y * height);
        canvasCtx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
        canvasCtx.lineWidth = 2;
        canvasCtx.setLineDash([5, 10]);
        canvasCtx.stroke();
        canvasCtx.setLineDash([]);
        
        // Midpoint data
        const midX = (w1.x + w2.x) / 2;
        const midY = (w1.y + w2.y) / 2;
        const dist = Math.hypot(w1.x - w2.x, w1.y - w2.y);
        canvasCtx.fillStyle = "rgba(0, 255, 255, 0.9)";
        canvasCtx.textAlign = "center";
        canvasCtx.fillText(`TETHER: ${dist.toFixed(3)}`, midX * width, midY * height - 10);
        canvasCtx.textAlign = "left"; // reset
      }

      // Enhanced Gesture Logic using processed landmarks
      if (processedLandmarks.length === 2) {
        currentGesture = 'Dual-Scale Matrix';
        const hand1 = processedLandmarks[0];
        const hand2 = processedLandmarks[1];
        
        const wrist1 = hand1[0];
        const wrist2 = hand2[0];
        const dist = Math.hypot(wrist1.x - wrist2.x, wrist1.y - wrist2.y, wrist1.z - wrist2.z);

        if (lastTwoHandDist.current !== null) {
          const dDist = dist - lastTwoHandDist.current;
          // Apply a stricter deadzone to prevent bobbling/flickering
          if (Math.abs(dDist) > 0.005) {
            const zoomSens = (sensitivityRef.current.zoom / 50) * 3.0;
            zoom = dDist * zoomSens;
          }
        }
        lastTwoHandDist.current = dist;
        lastHandPos.current = null;
      } 
      else if (processedLandmarks.length === 1) {
        const landmarks = processedLandmarks[0];
        const wrist = landmarks[0];
        
        // 1. Hand Size Normalization (Wrist to Middle Finger MCP)
        const handSize = Math.hypot(landmarks[9].x - wrist.x, landmarks[9].y - wrist.y, landmarks[9].z - wrist.z);

        // 2. Robust Finger Extension Check (Tip further than PIP from wrist)
        const isFingerExtended = (tipIdx: number) => {
          const tip = landmarks[tipIdx];
          const pip = landmarks[tipIdx - 2];
          const tipDist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y, tip.z - wrist.z);
          const pipDist = Math.hypot(pip.x - wrist.x, pip.y - wrist.y, pip.z - wrist.z);
          return tipDist > pipDist;
        };

        const extendedFingers = [8, 12, 16, 20].map(isFingerExtended);
        const extendedThumb = isFingerExtended(4);
        const extendedCount = extendedFingers.filter(Boolean).length;

        // 3. Forgiving State Detection
        const isOpenPalm = extendedCount >= 4; // At least 4 fingers extended
        const isTwoFingers = extendedCount === 2 || extendedCount === 3; // 2 or 3 fingers for panning
        const isFist = extendedCount === 0 && handSize > (0.15 / sensitivityRef.current.fistThreshold);
        const isGenerateGesture = extendedCount === 4 && extendedThumb && handSize > 0.15;

        // 4. Normalized Pinch Detection
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y, thumbTip.z - indexTip.z);
        const normalizedPinch = pinchDist / handSize;
        
        // Hysteresis: If we were already pinching, make it easier to stay pinching
        const wasPinching = gestureHistory.current[gestureHistory.current.length - 1] === 'Precision Zoom';
        const pinchThreshold = wasPinching ? 0.25 : 0.18; // Much tighter threshold (was 0.45/0.35)
        
        // Only allow pinch if middle, ring, and pinky are closed to avoid accidental triggers during rotation
        const isOtherFingersClosed = !extendedFingers[1] && !extendedFingers[2] && !extendedFingers[3];
        const isPinching = normalizedPinch < pinchThreshold && isOtherFingersClosed && !isFist;

        // Use One Euro filtered wrist position directly for 1:1 tracking
        let dx = 0;
        let dy = 0;
        if (!lastHandPos.current) {
          lastHandPos.current = { x: wrist.x, y: wrist.y };
        } else {
          dx = wrist.x - lastHandPos.current.x;
          dy = wrist.y - lastHandPos.current.y;
          lastHandPos.current = { x: wrist.x, y: wrist.y }; // Instant update, no lag
        }

        if (isPinching) {
          currentGesture = 'Precision Zoom';
          // Use direct position delta for zoom (y-axis movement while pinching is more reliable than z-velocity)
          const zoomSens = (sensitivityRef.current.zoom / 50) * 3.0;
          // Add deadzone and smoothing specifically to prevent bobbling
          let rawZoom = dy * zoomSens;
          if (Math.abs(dy) < 0.003) {
            rawZoom = 0;
          }
          zoom = rawZoom; // Moving hand up/down zooms in/out
          
          lastPinchDist.current = pinchDist;
          generateHoldTime.current = 0;
        } else if (isOpenPalm) {
          currentGesture = 'Holographic Rotate';
          
          // Use direct position deltas (dx, dy) for 100% accurate, instant 1:1 rotation
          // Multipliers scaled up because dx/dy are per-frame deltas
          const rotSensX = (sensitivityRef.current.rotation / 50) * 4.0;
          const rotSensY = (sensitivityRef.current.rotation / 50) * 6.0; 
          
          rotateY = -dx * rotSensY; // Inverted for natural left/right rotation
          rotateX = -dy * rotSensX;
          
          lastPinchDist.current = null;
          generateHoldTime.current = 0;
        } else if (isTwoFingers) {
          currentGesture = 'Spatial Pan';
          
          // Use direct position deltas for instant 1:1 panning
          const panSens = (sensitivityRef.current.pan / 50) * 5.0;
          panX = -dx * panSens;
          panY = dy * panSens; // Positive dy for natural up/down panning
          
          lastPinchDist.current = null;
          generateHoldTime.current = 0;
        } else if (isGenerateGesture) {
          currentGesture = 'Generate 3D (Hold)';
          generateHoldTime.current += 1/60;
          if (generateHoldTime.current > 1.5) {
             window.dispatchEvent(new CustomEvent('gesture-generate-3d'));
             generateHoldTime.current = 0;
          }
          lastPinchDist.current = null;
        } else if (isFist) {
          currentGesture = 'System Reset (Hold)';
          lastPinchDist.current = null;
          generateHoldTime.current = 0;
        } else {
          currentGesture = 'Tracking...';
          lastPinchDist.current = null;
          generateHoldTime.current = 0;
        }
      }
    } else {
      // Clear smoothed landmarks and filters when no hands detected
      landmarkFilters.current = [];
      lastTimestamp.current = 0;
    }

    // Debounce Gesture Display - Stark-Tech responsive yet stable
    gestureHistory.current.push(currentGesture);
    if (gestureHistory.current.length > 6) gestureHistory.current.shift(); // 6 frames (~100ms) for ultra responsiveness
    
    const gestureCounts = gestureHistory.current.reduce((acc, g) => {
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentGesture = Object.entries(gestureCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    
    // Only trigger System Reset if held for a short duration (e.g. 4/6 frames)
    if (mostFrequentGesture === 'System Reset (Hold)' && gestureCounts['System Reset (Hold)'] >= 4) {
      reset = true;
      setActiveGesture('SYSTEM RESET');
    } else {
      setActiveGesture(mostFrequentGesture === 'System Reset (Hold)' ? 'Tracking...' : mostFrequentGesture);
    }

    // Dispatch Event with Category Filtering to prevent accidental mode switching (e.g. zoom during rotate)
    const finalRotateX = (mostFrequentGesture === 'Holographic Rotate') ? rotateX : 0;
    const finalRotateY = (mostFrequentGesture === 'Holographic Rotate') ? rotateY : 0;
    const finalZoom = (mostFrequentGesture === 'Precision Zoom' || mostFrequentGesture === 'Dual-Scale Matrix') ? zoom : 0;
    const finalPanX = (mostFrequentGesture === 'Spatial Pan') ? panX : 0;
    const finalPanY = (mostFrequentGesture === 'Spatial Pan') ? panY : 0;

    const hasMovement = Math.abs(finalRotateX) > sensitivityRef.current.threshold || 
                        Math.abs(finalRotateY) > sensitivityRef.current.threshold || 
                        Math.abs(finalZoom) > sensitivityRef.current.threshold ||
                        Math.abs(finalPanX) > sensitivityRef.current.threshold ||
                        Math.abs(finalPanY) > sensitivityRef.current.threshold;

    if (reset || hasMovement) {
      window.dispatchEvent(new CustomEvent('gesture-update', {
        detail: { 
          rotateX: finalRotateX, 
          rotateY: finalRotateY, 
          zoom: finalZoom, 
          panX: finalPanX, 
          panY: finalPanY, 
          reset 
        }
      }));
    }

    canvasCtx.restore();
  };

  if (!isActive) return null;

  return (
    <div className="fixed -top-[9999px] -left-[9999px] w-1 aspect-video opacity-0 pointer-events-none z-0">
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
        {!isCameraReady && (
          <div className="flex flex-col items-center gap-2">
            <CameraIcon className="text-zinc-700 animate-pulse" size={32} />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Initializing...</span>
          </div>
        )}
        <Webcam
          ref={webcamRef}
          className="opacity-0 absolute"
          onUserMedia={() => setIsCameraReady(true)}
          videoConstraints={{ 
            width: 640, 
            height: 480, 
            facingMode: 'user',
            frameRate: { ideal: 60, max: 60 }
          }}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover scale-x-[-1]"
          width={640}
          height={480}
        />
        <canvas
          ref={drawingCanvasRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          width={640}
          height={480}
        />
      </div>
      
      <div className="absolute top-2 right-2 flex gap-1">
        {isDrawMode && (
          <button 
            onClick={() => {
              const ctx = drawingCanvasRef.current?.getContext('2d');
              ctx?.clearRect(0, 0, drawingCanvasRef.current!.width, drawingCanvasRef.current!.height);
              window.dispatchEvent(new CustomEvent('gesture-draw-clear'));
            }}
            className="p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors"
            title="Clear Drawing"
          >
            <Trash2 size={14} />
          </button>
        )}
        <button 
          onClick={() => setIsDrawMode(!isDrawMode)}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${isDrawMode ? 'bg-cyan-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
          title="Air Draw"
        >
          {isDrawMode ? 'Drawing' : 'Air Draw'}
        </button>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1 rounded-full transition-colors ${showSettings ? 'bg-indigo-500 text-white' : 'bg-black/50 hover:bg-black/80 text-white'}`}
          title="Gesture Settings"
        >
          <Settings2 size={14} />
        </button>
        <button 
          onClick={onClose}
          className="p-1 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {showSettings && (
        <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm p-4 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Sensitivity Settings</h3>
            <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white">
              <X size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] text-zinc-400 uppercase">
                <span>Rotation</span>
                <span>{sensitivity.rotation.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="1" max="200" step="0.5"
                value={sensitivity.rotation} 
                onChange={(e) => setSensitivity({...sensitivity, rotation: parseFloat(e.target?.value || '100')})}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] text-zinc-400 uppercase">
                <span>Zoom</span>
                <span>{sensitivity.zoom.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="1" max="200" step="0.5"
                value={sensitivity.zoom} 
                onChange={(e) => setSensitivity({...sensitivity, zoom: parseFloat(e.target?.value || '100')})}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] text-zinc-400 uppercase">
                <span>Panning</span>
                <span>{sensitivity.pan.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="1" max="200" step="0.5"
                value={sensitivity.pan} 
                onChange={(e) => setSensitivity({...sensitivity, pan: parseFloat(e.target?.value || '100')})}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] text-zinc-400 uppercase">
                <span>Threshold</span>
                <span>{sensitivity.threshold.toFixed(4)}</span>
              </div>
              <input 
                type="range" min="0.0001" max="0.05" step="0.0001"
                value={sensitivity.threshold} 
                onChange={(e) => setSensitivity({...sensitivity, threshold: parseFloat(e.target?.value || '0.0001')})}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <button 
            onClick={() => setSensitivity({ rotation: 100, zoom: 100, pan: 100, threshold: 0.0001, palmThreshold: 0.6, fistThreshold: 1000.0, pinchThreshold: 0.05 })}
            className="mt-auto py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] text-zinc-400 uppercase font-bold transition-all"
          >
            Reset to Defaults
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${activeGesture !== 'None' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-zinc-600'} transition-all`} />
              <span className="text-[10px] font-medium text-cyan-400 uppercase tracking-wider">J.A.R.V.I.S. Neural Link</span>
            </div>
            <div className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-[9px] text-cyan-300 font-bold uppercase tracking-tighter">
              {activeGesture}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
