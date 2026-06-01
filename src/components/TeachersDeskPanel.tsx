import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { X, Trash2, Wand2, Palette, Eraser, Loader2, Mic, Pen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeDrawing } from '../services/geminiService';
import { useStore } from '../store/useStore';

export function TeachersDeskPanel() {
  const { 
    setIsTeachersDeskOpen, 
    theme,
    isTranscriptionOpen,
    setIsTranscriptionOpen
  } = useStore();

  const onClose = () => setIsTeachersDeskOpen(false);
  const webcamRef = useRef<Webcam>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(true);
  const [color, setColor] = useState('#06b6d4'); // cyan-500
  const [lineWidth, setLineWidth] = useState(5);
  
  const colorRef = useRef(color);
  const lineWidthRef = useRef(lineWidth);
  const isDrawingEnabledRef = useRef(isDrawingEnabled);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    lineWidthRef.current = lineWidth;
  }, [lineWidth]);

  useEffect(() => {
    isDrawingEnabledRef.current = isDrawingEnabled;
  }, [isDrawingEnabled]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  const lastPos = useRef<{ x: number, y: number } | null>(null);
  const isDrawing = useRef(false);

  // Simple low-pass filter for smoothing
  const smoothedPos = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    if (!webcamRef.current?.video) return;

    const hands = new Hands({
      locateFile: (file) => `https://unpkg.com/@mediapipe/hands@0.4.1675469240/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0, // Lower complexity for better performance
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
      selfieMode: true
    });

    let isStopped = false;

    hands.onResults((results: Results) => {
      if (isStopped) return;
      
      const drawingCtx = drawingCanvasRef.current?.getContext('2d');
      if (!drawingCtx || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        isDrawing.current = false;
        lastPos.current = null;
        smoothedPos.current = null;
        return;
      }

      const landmarks = results.multiHandLandmarks[0];
      const indexTip = landmarks[8];
      
      const rawX = (1 - indexTip.x) * drawingCanvasRef.current!.width; // Mirroring
      const rawY = indexTip.y * drawingCanvasRef.current!.height;

      // Smoothing logic - increased smoothing for better precision
      if (!smoothedPos.current) {
        smoothedPos.current = { x: rawX, y: rawY };
      } else {
        const alpha = 0.2; // Increased smoothing factor (lower = more smoothing)
        smoothedPos.current.x = smoothedPos.current.x + alpha * (rawX - smoothedPos.current.x);
        smoothedPos.current.y = smoothedPos.current.y + alpha * (rawY - smoothedPos.current.y);
      }

      const x = smoothedPos.current.x;
      const y = smoothedPos.current.y;

      if (isDrawingEnabledRef.current) {
        if (!isDrawing.current || !lastPos.current) {
          isDrawing.current = true;
          drawingCtx.beginPath();
          drawingCtx.moveTo(x, y);
        } else {
          drawingCtx.lineTo(x, y);
          drawingCtx.strokeStyle = colorRef.current;
          drawingCtx.lineWidth = lineWidthRef.current;
          drawingCtx.lineCap = 'round';
          drawingCtx.lineJoin = 'round';
          drawingCtx.stroke();
        }
        lastPos.current = { x, y };
      } else {
        isDrawing.current = false;
        lastPos.current = null;
      }
    });

    handsRef.current = hands;

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        if (webcamRef.current?.video && handsRef.current && !isStopped) {
          try {
            await handsRef.current.send({ image: webcamRef.current.video });
          } catch (err) {
            if (!isStopped) console.error("MediaPipe send error:", err);
          }
        }
      },
      width: 640,  // Reduced resolution for better performance
      height: 480,
    });
    
    camera.start().catch(err => console.error("Teacher Camera Error:", err));

    return () => {
      isStopped = true;
      camera.stop();
      hands.close();
      handsRef.current = null;
    };
  }, [isCameraReady]);

  const handleAnalyze = async () => {
    if (!drawingCanvasRef.current) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    // Create a temporary canvas with a black background to send to Gemini
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = drawingCanvasRef.current.width;
    tempCanvas.height = drawingCanvasRef.current.height;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.drawImage(drawingCanvasRef.current, 0, 0);
    }

    const base64Image = tempCanvas.toDataURL('image/png');
    const result = await analyzeDrawing(base64Image);
    setAnalysisResult(result || "Could not analyze drawing.");
    setIsAnalyzing(false);
  };

  const clearCanvas = () => {
    const ctx = drawingCanvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, drawingCanvasRef.current!.width, drawingCanvasRef.current!.height);
    setAnalysisResult(null);
  };

  const colors = [
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'White', value: '#ffffff' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col"
    >
      <div className="absolute inset-0">
        <Webcam
          ref={webcamRef}
          className="w-full h-full object-cover opacity-20"
          onUserMedia={() => setIsCameraReady(true)}
        />
        <canvas
          ref={drawingCanvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          width={1280}
          height={720}
        />
      </div>

      {/* Top Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-2 rounded-2xl z-[101]">
        <div className="flex items-center gap-2 px-2 border-r border-white/10">
          <Palette size={16} className="text-zinc-400" />
          {colors.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c.value ? 'scale-110 border-white' : 'border-transparent hover:scale-110'}`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-3 px-2 border-r border-white/10">
          <span className="text-xs font-medium text-zinc-400">Size</span>
          <input 
            type="range" 
            min="2" 
            max="20" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(parseInt(e.target?.value || '5'))}
            className="w-24 accent-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 px-2">
          <button 
            onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors text-xs font-medium ${isDrawingEnabled ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
          >
            <Pen size={14} />
            {isDrawingEnabled ? 'Drawing' : 'Paused'}
          </button>
          <button 
            onClick={() => setIsTranscriptionOpen(!isTranscriptionOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors text-xs font-medium ${isTranscriptionOpen ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
          >
            <Mic size={14} />
            Voice
          </button>
          <button 
            onClick={clearCanvas}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors text-xs font-medium"
          >
            <Eraser size={14} />
            Clear
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl transition-colors text-xs font-medium"
          >
            {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
            {isAnalyzing ? 'Analyzing...' : 'AI Recognize'}
          </button>
        </div>
      </div>

      {/* Close Button */}
      <div className="absolute top-4 right-4 z-[101]">
        <button 
          onClick={onClose}
          className="p-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 hover:bg-zinc-800 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Analysis Result Panel */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-24 left-4 w-80 bg-zinc-900/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-4 shadow-2xl z-[101]"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <Wand2 size={16} />
                AI Analysis
              </h3>
              <button onClick={() => setAnalysisResult(null)} className="text-zinc-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {analysisResult}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
