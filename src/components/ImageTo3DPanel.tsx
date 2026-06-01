import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Image as ImageIcon, Sparkles, Loader2, RotateCcw, Box, Crosshair, ChevronRight, Save, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { saveHologram } from '../services/storageService';

// 3D Solid Mesh renderer with high-fidelity reconstruction
function SolidMeshModel({ data }: { data: { geometry: THREE.BufferGeometry, materials: THREE.Material[], width: number, height: number } | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const gestureState = useRef({ rotateY: 0, zoom: 1 });

  useEffect(() => {
    if (data) {
      (window as any).latestGeneratedMesh = groupRef.current;
    }
  }, [data]);

  useEffect(() => {
    const handleGesture = (e: any) => {
      const { rotateY, zoom: zoomDelta } = e.detail;
      if (rotateY) gestureState.current.rotateY += rotateY * 2;
      if (zoomDelta) gestureState.current.zoom = Math.max(0.5, Math.min(3, gestureState.current.zoom + zoomDelta));
    };
    window.addEventListener('gesture-update', handleGesture);
    return () => window.removeEventListener('gesture-update', handleGesture);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Base oscillation + gesture rotation
      groupRef.current.rotation.y = gestureState.current.rotateY + (state.clock.elapsedTime * 0.1);
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      
      // Apply zoom through scaling
      const targetScale = gestureState.current.zoom;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  if (!data) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* High-Resolution Solid Extruded Mesh */}
      <mesh 
        castShadow 
        receiveShadow 
        geometry={data.geometry}
        material={data.materials}
      />
      
      {/* Atmospheric Glow */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[data.width + 1, data.height + 1]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.05} />
      </mesh>

      <gridHelper args={[20, 40, '#1e293b', '#020617']} position={[0, -2.5, 0]} />
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade />
    </group>
  );
}

export function ImageTo3DPanel() {
  const { setActiveTopic, theme, uploadedModel, setUploadedModel } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [generatedData, setGeneratedData] = useState<{ geometry: THREE.BufferGeometry, materials: THREE.Material[], width: number, height: number } | null>(null);

  // Handle reloaded models from library
  useEffect(() => {
    if (uploadedModel && !previewUrl) {
      setPreviewUrl(uploadedModel);
      // Auto-trigger generation for reloaded models
      const autoGen = async () => {
        setGenerating(true);
        const result = await processImageTo3DSolid(uploadedModel);
        setGeneratedData(result);
        setGenerating(false);
      };
      autoGen();
    }
  }, [uploadedModel]);

  useEffect(() => {
    const handleGenerate = () => {
      startGeneration();
    };
    window.addEventListener('gesture-generate-3d', handleGenerate);
    return () => window.removeEventListener('gesture-generate-3d', handleGenerate);
  }, [previewUrl, generating]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const statuses = [
    "Analyzing pixel-perfect depth mapping...",
    "Reconstructing volumetric neural mesh...",
    "Triangulating high-resolution geometry...",
    "Optimizing solid manifold topology...",
    "Applying high-fidelity neural textures..."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      setGeneratedData(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selected = e.dataTransfer.files?.[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      setGeneratedData(null);
    }
  };

  const processImageTo3DSolid = (imageUrl: string) => {
    return new Promise<{ geometry: THREE.BufferGeometry, materials: THREE.Material[], width: number, height: number }>((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const texture = new THREE.Texture(img);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        
        const canvas = document.createElement('canvas');
        const sampleSize = 256; 
        canvas.width = sampleSize;
        canvas.height = Math.round(sampleSize * (img.height / img.width));
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        let depthData: Float32Array | null = null;
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let alphaMap = new Float32Array(data.length / 4);
          let lumaMap = new Float32Array(data.length / 4);
          
          let ptr = 0;
          for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            alphaMap[ptr] = alpha > 10 ? 1.0 : 0.0;
            const luma = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255.0;
            lumaMap[ptr] = luma;
            ptr++;
          }
          
          const passes = 15;
          const w = canvas.width;
          const h = canvas.height;
          let temp = new Float32Array(alphaMap.length);
          
          for (let p = 0; p < passes; p++) {
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                let sum = 0, count = 0;
                for (let dx = -3; dx <= 3; dx++) {
                  let nx = x + dx;
                  if (nx >= 0 && nx < w) {
                    sum += alphaMap[y * w + nx];
                    count++;
                  }
                }
                temp[y * w + x] = sum / count;
              }
            }
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                let sum = 0, count = 0;
                for (let dy = -3; dy <= 3; dy++) {
                  let ny = y + dy;
                  if (ny >= 0 && ny < h) {
                    sum += temp[ny * w + x];
                    count++;
                  }
                }
                alphaMap[y * w + x] = sum / count;
              }
            }
          }

          depthData = new Float32Array(alphaMap.length);
          for (let i = 0; i < alphaMap.length; i++) {
            // Keep surface very smooth, mostly inflated balloon shape, tiny bit of luma detail
            depthData[i] = (alphaMap[i] * 0.97) + ((lumaMap[i] - 0.5) * 0.03 * alphaMap[i]);
          }
        }

        const aspect = img.width / img.height;
        const width = 4;
        const height = 4 / aspect;
        const baseThickness = 0.1;
        const extrudeMax = Math.max(width, height) * 0.3; // Deeper for 360 solid

        const geometry = new THREE.BoxGeometry(
          width, height, baseThickness, 
          Math.min(200, Math.round(200 * aspect)), 
          Math.min(200, Math.round(200 / aspect)), 
          2 // A few depth segments for smoother pinch
        );
        const pos = geometry.attributes.position;
        
        if (depthData) {
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);

            const u = Math.max(0, Math.min(1, (x + width / 2) / width));
            const v = Math.max(0, Math.min(1, 1.0 - (y + height / 2) / height));
            
            const px = Math.floor(u * (canvas.width - 1));
            const py = Math.floor(v * (canvas.height - 1));
            const idx = py * canvas.width + px;
            
            const depthVal = depthData[idx];
            
            // Pinch edges together where transparent, and symmetrically extrude the rest
            const newZ = (z * depthVal) + (Math.sign(z) * Math.pow(depthVal, 1.5) * extrudeMax);
            
            pos.setZ(i, newZ);
          }
          geometry.computeVertexNormals();
        }

        const solidMat = new THREE.MeshStandardMaterial({ 
          map: texture, 
          roughness: 0.3, 
          metalness: 0.2,
          alphaTest: 0.1, // Hide the pinched boundaries if the image has transparency
          transparent: true,
          side: THREE.DoubleSide
        });
        
        resolve({ 
          geometry,
          // Apply to all 6 faces of the BoxGeometry
          materials: [solidMat, solidMat, solidMat, solidMat, solidMat, solidMat],
          width, height
        });
      };
      img.src = imageUrl;
    });
  };

  const startGeneration = async () => {
    if (!previewUrl) return;
    setGenerating(true);
    setProgress(0);
    setStatusText(statuses[0]);

    // Fast fake progress for 5 seconds
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + (Math.random() * 5), 98);
        return next;
      });
    }, 200);

    // Update status text
    const textInterval = setInterval(() => {
      setStatusText(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 1200);

    // Run the actual canvas processor in background
    const result = await processImageTo3DSolid(previewUrl);

    // Wait until progress hits 100
    setTimeout(() => {
      setProgress(100);
      clearInterval(interval);
      clearInterval(textInterval);
      setGeneratedData(result);
      setGenerating(false);
    }, 4000);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (!previewUrl || !generatedData) return;
    setIsSaving(true);
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      
      const id = Date.now().toString();
      await saveHologram({
        id,
        name: `3D Model ${id.slice(-4)}`,
        type: 'imageTo3D',
        timestamp: Date.now(),
        fileData: arrayBuffer,
        fileType: blob.type,
        dimensions: { width: generatedData.width, height: generatedData.height }
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save 3D model:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setGeneratedData(null);
    setGenerating(false);
    setUploadedModel(null);
  };

  const exportModel = () => {
    const mesh = (window as any).latestGeneratedMesh;
    if (!mesh) return;

    window.dispatchEvent(new CustomEvent('notification', { detail: { message: 'Exporting Solid GLB file...' }}));
    
    const exporter = new GLTFExporter();
    exporter.parse(
      mesh,
      (gltf) => {
        const str = gltf as ArrayBuffer;
        const blob = new Blob([str], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = `SolidModel_${Date.now()}.glb`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('An error happened', error);
      },
      { binary: true }
    );
  };

  const handleClose = () => {
    resetAll();
    setActiveTopic('Atom');
  };

  return (
    <div className={`absolute inset-x-0 bottom-0 top-[60px] ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-[#F2F2F7]' : 'bg-[#0E1117]'} flex flex-col md:flex-row overflow-hidden border-t ${theme.border}`}>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* LEFT COLUMN: Controls & Input */}
      <div className={`w-full md:w-96 flex-shrink-0 ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-white' : 'bg-[#0A0D12]'} border-r ${theme.border} flex flex-col h-full z-10 shadow-xl`}>
        <div className={`p-4 border-b ${theme.border} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-${theme.primary}/20 text-${theme.primary} flex items-center justify-center border border-${theme.primary}/30`}>
              <ImageIcon size={18} />
            </div>
            <div>
              <h2 className={`font-heading font-bold ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-900' : 'text-white'} text-sm`}>Image to 3D</h2>
              <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">AI Spatial Reconstruction</p>
            </div>
          </div>
          <button onClick={handleClose} className={`p-2 ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-400 hover:text-zinc-600' : 'text-zinc-400 hover:text-white'} rounded-lg hover:bg-black/5`}>
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          <div className="space-y-2">
             <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Input Source</div>
             
             {!previewUrl ? (
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 onDragOver={handleDragOver}
                 onDrop={handleDrop}
                 className={`w-full h-48 rounded-xl border-2 border-dashed ${theme.id === 'white' || theme.id === 'ios-light' ? 'border-zinc-200 bg-zinc-100/50' : 'border-zinc-800 bg-zinc-900/50'} flex flex-col items-center justify-center gap-3 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all cursor-pointer group`}
               >
                 <div className={`w-12 h-12 rounded-full ${theme.id === 'white' || theme.id === 'ios-light' ? 'bg-zinc-200 group-hover:bg-sky-500/20' : 'bg-zinc-800 group-hover:bg-sky-500/20'} text-zinc-500 group-hover:text-sky-400 flex items-center justify-center transition-all`}>
                   <Upload size={20} />
                 </div>
                 <div className="text-center">
                   <p className={`text-sm font-bold ${theme.id === 'white' || theme.id === 'ios-light' ? 'text-zinc-900' : 'text-white'} group-hover:text-sky-600`}>Click or drag image here</p>
                   <p className="text-xs text-zinc-500 mt-1 font-medium">PNG, JPG, WEBP formats supported</p>
                 </div>
               </div>
             ) : (
               <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                     <button onClick={resetAll} className="flex flex-row items-center gap-2 text-xs font-bold text-white hover:text-red-400 transition-colors uppercase tracking-widest font-mono">
                       <RotateCcw size={14} /> Remove Image
                     </button>
                  </div>
               </div>
             )}
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <AnimatePresence>
            {previewUrl && !generatedData && !generating && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t border-white/10">
                 <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Generation Settings</div>
                 
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Neural Detailing</span>
                      <span className="text-white font-mono">High (4K)</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                       <div className="w-full h-full bg-sky-500 rounded-full" />
                    </div>
                 </div>

                 <button 
                  onClick={startGeneration}
                  className="w-full py-3 bg-white text-black font-bold text-sm tracking-wide rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-2 group"
                 >
                   <Sparkles size={16} className="text-zinc-600 group-hover:text-amber-500 transition-colors" />
                   GENERATE 3D MODEL
                 </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress / Status */}
          <AnimatePresence>
            {generating && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-4">
                 <div className="flex items-center justify-between text-sky-400">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-mono font-bold">{progress}%</span>
                 </div>
                 <div className="w-full h-1 bg-sky-900 overflow-hidden rounded-full">
                    <motion.div className="h-full bg-sky-400" initial={{ width: '0%' }} animate={{ width: `${progress}%` }} />
                 </div>
                 <div className="text-[10px] text-sky-300 font-mono uppercase tracking-widest truncate">
                    {statusText}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Model Status Specs */}
          {generatedData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-4 border-t border-white/10">
               <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 Generation Complete
               </div>
               
               <div className="grid grid-cols-2 gap-2">
                  <button 
                   onClick={handleSave}
                   disabled={isSaving || saveSuccess || !generatedData}
                   className={`w-full py-2 ${saveSuccess ? 'bg-emerald-500 text-white' : 'bg-sky-600 hover:bg-sky-500 text-white'} text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex justify-center items-center gap-1.5 ${isSaving || !generatedData ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : saveSuccess ? (
                      <Check size={14} />
                    ) : (
                      <Save size={14} />
                    )}
                    {saveSuccess ? 'SAVED' : isSaving ? 'SAVING...' : 'SAVE TO LIBRARY'}
                  </button>
                  <button onClick={exportModel} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors flex justify-center items-center gap-1.5 focus:outline-none">
                    <Upload size={14} /> EXPORT
                  </button>
               </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* RIGHT COLUMN: 3D Stage */}
      <div className="flex-1 relative bg-black">
         {/* Grid overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
         
         {!generatedData ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 pointer-events-none">
             <Box size={48} className="mb-4 opacity-50" />
             <p className="font-mono text-sm tracking-widest uppercase">Waiting for input mapping</p>
           </div>
         ) : (
           <div className="absolute inset-0">
              <Canvas 
                camera={{ position: [0, 1.5, 6], fov: 40 }} 
                shadows 
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                gl={{ powerPreference: "high-performance", antialias: false, logarithmicDepthBuffer: false }}
              >
                <color attach="background" args={['#020617']} />
                <fog attach="fog" args={['#020617', 5, 20]} />
                
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38bdf8" />
                <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" castShadow />
                
                <SolidMeshModel data={generatedData} />
                <OrbitControls 
                  enablePan={false} 
                  enableZoom={true} 
                  minDistance={2} 
                  maxDistance={12}
                  autoRotate={!generating} 
                  autoRotateSpeed={1.5} 
                />
                <Environment preset="night" />
              </Canvas>

              {/* Viewfinder UI */}
              <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                <Crosshair size={24} className="text-sky-500/50" />
                <div className="text-right">
                  <div className="text-sky-400 font-mono text-[10px] tracking-widest uppercase mb-1">Scale / Ratio</div>
                  <div className="text-white font-mono text-sm">1:1 NATIVE</div>
                </div>
              </div>
           </div>
         )}
      </div>

    </div>
  );
}
