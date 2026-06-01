import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Sparkles, Trash2, X, Loader2 } from 'lucide-react';
import { Theme } from '../types';
import { GoogleGenAI } from '@google/genai';
import { useStore } from '../store/useStore';
import { getStroke } from 'perfect-freehand';

const getSvgPathFromStroke = (stroke: number[][]) => {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc: any[], [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
};

export const AirDrawPanel: React.FC = () => {
  const { isAirDrawOpen: isActive, setIsAirDrawOpen, theme } = useStore();
  const onClose = () => setIsAirDrawOpen(false);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  const isDrawingRef = useRef(false);
  const strokesRef = useRef<number[][][]>([]);
  const currentStrokeRef = useRef<number[][]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add glow effect
    ctx.fillStyle = '#818cf8'; // Indigo 400
    ctx.shadowColor = '#6366f1'; // Indigo 500
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const allStrokes = [...strokesRef.current];
    if (currentStrokeRef.current.length > 0) {
      allStrokes.push(currentStrokeRef.current);
    }

    for (const points of allStrokes) {
      if (points.length === 0) continue;
      const strokeOutline = getStroke(points, {
        size: 16,
        thinning: 0.6,
        smoothing: 0.8,
        streamline: 0.8,
      });
      const pathData = getSvgPathFromStroke(strokeOutline as number[][]);
      const path = new Path2D(pathData);
      ctx.fill(path);
    }
    
    // Reset shadow for other operations
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctxRef.current = ctx;
      }
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctxRef.current = ctx;
          redrawCanvas();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !isCameraReady || !webcamRef.current?.video) return;

    let isStopped = false;
    
    const hands = new Hands({
      locateFile: (file) => {
        return `https://unpkg.com/@mediapipe/hands@0.4.1675469240/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8,
      selfieMode: true
    });

    hands.onResults((results: Results) => {
      if (isStopped) return;
      
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Finger landmarks
        const indexTip = landmarks[8];
        const indexPip = landmarks[6];
        const middleTip = landmarks[12];
        const middlePip = landmarks[10];
        const ringTip = landmarks[16];
        const ringPip = landmarks[14];
        const pinkyTip = landmarks[20];
        const pinkyPip = landmarks[18];

        // Finger states
        const isIndexUp = indexTip.y < indexPip.y;
        const isMiddleDown = middleTip.y > middlePip.y;
        const isMiddleUp = middleTip.y < middlePip.y;
        const isRingUp = ringTip.y < ringPip.y;
        const isPinkyUp = pinkyTip.y < pinkyPip.y;

        const isErasing = isIndexUp && isMiddleUp && isRingUp && isPinkyUp;

        if (isErasing) {
          if (strokesRef.current.length > 0 || currentStrokeRef.current.length > 0) {
            strokesRef.current = [];
            currentStrokeRef.current = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
          setAiResult(prev => prev !== null ? null : prev);
          
          if (isDrawingRef.current) {
            isDrawingRef.current = false;
            setIsDrawing(false);
            lastPos.current = null;
          }
        } else if (isIndexUp && isMiddleDown) {
          if (!isDrawingRef.current) {
            isDrawingRef.current = true;
            setIsDrawing(true);
          }
          
          // Coordinates are normalized [0, 1]. Multiply by canvas dimensions.
          // Since selfieMode is true, x is flipped.
          const rawX = (1 - indexTip.x) * canvas.width;
          const rawY = indexTip.y * canvas.height;

          // Apply Exponential Moving Average (EMA) for super smooth tracking
          const alpha = 0.25; // Smoothing factor - reduced for more stability
          let smoothedX = rawX;
          let smoothedY = rawY;

          if (lastPos.current) {
            smoothedX = lastPos.current.x + alpha * (rawX - lastPos.current.x);
            smoothedY = lastPos.current.y + alpha * (rawY - lastPos.current.y);
          }
          
          lastPos.current = { x: smoothedX, y: smoothedY };
          
          // Use z coordinate for pressure simulation (depth)
          // Z is negative when closer to camera. We can map it to a pressure value.
          // Typical z range is roughly -0.1 to 0.1
          const pressure = Math.max(0.1, Math.min(1, 0.5 - indexTip.z * 5));

          currentStrokeRef.current.push([smoothedX, smoothedY, pressure]);
          redrawCanvas();
        } else {
          if (isDrawingRef.current) {
            isDrawingRef.current = false;
            setIsDrawing(false);
            if (currentStrokeRef.current.length > 0) {
              strokesRef.current.push([...currentStrokeRef.current]);
              currentStrokeRef.current = [];
            }
            lastPos.current = null;
          }
        }
      } else {
        if (isDrawingRef.current) {
          isDrawingRef.current = false;
          setIsDrawing(false);
          if (currentStrokeRef.current.length > 0) {
            strokesRef.current.push([...currentStrokeRef.current]);
            currentStrokeRef.current = [];
          }
          lastPos.current = null;
        }
      }
    });

    handsRef.current = hands;

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        const video = webcamRef.current?.video;
        if (video && video.readyState >= 2 && handsRef.current && !isStopped) {
          try {
            await handsRef.current.send({ image: video });
          } catch (e) {
            console.error("Error sending frame to MediaPipe:", e);
          }
        }
      },
      width: 640,
      height: 480
    });

    camera.start();

    return () => {
      isStopped = true;
      camera.stop();
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [isActive, isCameraReady]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      strokesRef.current = [];
      currentStrokeRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setAiResult(null);
    }
  };

  const recognizeDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    setAiResult(null);

    try {
      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      
      const apiKey = process.env['API_KEY'] || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg'
            }
          },
          "Analyze this drawing. Identify the shape, letter, or diagram. Return ONLY a valid SVG code that represents a perfect, precise, and accurate version of what the user drew. The SVG should have a transparent background, viewBox=\"0 0 800 600\", and use stroke=\"#6366f1\" with stroke-width=\"5\" and fill=\"none\". Do not include any markdown formatting or explanations, just the raw <svg> tag and its contents."
        ]
      });

      let svgCode = response.text?.trim() || '';
      // Remove markdown code blocks if present
      if (svgCode.startsWith('```')) {
        svgCode = svgCode.replace(/```xml\n?|```svg\n?|```html\n?|```\n?/g, '').replace(/```$/g, '');
      }

      setAiResult(svgCode);
      
      // Clear the canvas to show the perfect SVG instead
      const ctx = ctxRef.current;
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
    } catch (error) {
      console.error('Error recognizing drawing:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm"
    >
      <Webcam
        ref={webcamRef}
        className="hidden"
        onUserMedia={() => setIsCameraReady(true)}
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair pointer-events-none"
      />

      {aiResult && (
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
          dangerouslySetInnerHTML={{ __html: aiResult }}
        />
      )}

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 rounded-2xl glass-dark border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2 px-4 border-r border-white/10">
          <div className={`w-3 h-3 rounded-full ${isDrawing ? 'bg-green-500 animate-pulse' : 'bg-zinc-500'}`} />
          <span className="text-sm font-mono text-zinc-300">
            {isDrawing ? 'Drawing...' : 'Raise Index Finger'}
          </span>
        </div>

        <button
          onClick={clearCanvas}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
          title="Clear Canvas"
        >
          <Trash2 size={20} />
        </button>

        <button
          onClick={recognizeDrawing}
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Sparkles size={20} />
          )}
          <span>AI Perfect Shape</span>
        </button>

        <button
          onClick={onClose}
          className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors ml-4"
        >
          <X size={20} />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full glass-dark border border-white/10 text-zinc-300 text-sm font-medium flex items-center gap-3">
        <PenTool size={16} className="text-indigo-400" />
        Draw: Index finger up. Erase: Full open hand.
      </div>
    </motion.div>
  );
};
