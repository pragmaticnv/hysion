import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Vector2, AdditiveBlending, DoubleSide, Group } from 'three';
import { Html, Float, Text } from '@react-three/drei';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fingerprintFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uScanColor;
  uniform float uScanY;
  uniform float uOpacity;
  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 pos = vUv * 6.0;
    float n = snoise(pos * 0.8);
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    
    float ridgePattern = sin(dist * 40.0 + angle * 2.0 + n * 5.0);
    float ridges = smoothstep(0.2, 0.5, ridgePattern);
    
    float scanBeamWidth = 0.05;
    float distToScan = abs(vUv.y - uScanY);
    float scanBeam = smoothstep(scanBeamWidth, 0.0, distToScan);
    
    vec3 color = uColor * ridges * 0.8;
    color += uScanColor * scanBeam * ridges * 2.0;
    color += uScanColor * scanBeam * 0.2;

    float mask = smoothstep(0.5, 0.48, dist);
    gl_FragColor = vec4(color, ridges * mask * uOpacity);
  }
`;

const circuitFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 grid = fract(vUv * 20.0);
    float dots = smoothstep(0.1, 0.05, length(grid - 0.5));
    
    float pulse = sin(uTime * 2.0 + vUv.x * 10.0 + vUv.y * 10.0) * 0.5 + 0.5;
    vec3 color = uColor * dots * pulse;
    
    float border = step(0.98, vUv.x) + step(0.98, vUv.y) + step(vUv.x, 0.02) + step(vUv.y, 0.02);
    color += uColor * border * 0.5;

    gl_FragColor = vec4(color, (dots * pulse + border * 0.2) * 0.8);
  }
`;

const dataStreamFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float wave = sin(vUv.x * 10.0 - uTime * 5.0) * 0.1;
    float line = smoothstep(0.02, 0.0, abs(vUv.y - 0.5 + wave));
    
    float segments = step(0.5, fract(vUv.x * 5.0 - uTime * 2.0));
    vec3 color = uColor * line * segments;
    
    gl_FragColor = vec4(color, line * segments);
  }
`;

export const FingerprintModel: React.FC = () => {
  const groupRef = useRef<Group>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [separation, setSeparation] = useState(1.0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.0);

  useEffect(() => {
    const handleGesture = (e: any) => {
      const { rotateX, rotateY, zoom: z, reset } = e.detail;
      if (reset) {
        setRotation({ x: 0, y: 0 });
        setZoom(1.0);
        setSeparation(1.0);
      } else {
        setRotation(prev => ({
          x: prev.x + rotateX * 0.5,
          y: prev.y + rotateY * 0.5
        }));
        setZoom(prev => Math.max(0.5, Math.min(2.0, prev + z)));
        // Use zoom or a specific gesture for separation? 
        // Let's use zoom for separation too for dramatic effect
        setSeparation(prev => Math.max(0.2, Math.min(3.0, prev + z * 2)));
      }
    };

    window.addEventListener('gesture-update', handleGesture);
    return () => window.removeEventListener('gesture-update', handleGesture);
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScanY: { value: 0 },
    uOpacity: { value: 1.0 },
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scan = (Math.sin(time * 0.8) + 1.0) / 2.0;
    setScanProgress(scan);
    
    uniforms.uTime.value = time;
    uniforms.uScanY.value = scan;
    
    if (groupRef.current) {
      groupRef.current.rotation.x = rotation.x;
      groupRef.current.rotation.y = rotation.y;
      groupRef.current.scale.setScalar(zoom);
    }
  });

  const layers = [
    { id: 'surface', title: 'SENSOR SURFACE', color: '#3b82f6', offset: 1.5, shader: fingerprintFragmentShader },
    { id: 'capture', title: 'IMAGE CAPTURE MECHANISM', color: '#10b981', offset: 0.5, shader: circuitFragmentShader },
    { id: 'processing', title: 'PROCESSING UNIT', color: '#8b5cf6', offset: -0.5, shader: circuitFragmentShader },
    { id: 'output', title: 'ENCRYPTED DATA OUTPUT', color: '#ec4899', offset: -1.5, shader: circuitFragmentShader },
  ];

  return (
    <group ref={groupRef} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
      {layers.map((layer, i) => (
        <group key={layer.id} position={[0, layer.offset * separation, 0]}>
          {/* Layer Plate */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 4]} />
            <meshPhysicalMaterial 
              color={layer.color} 
              transparent 
              opacity={0.1} 
              transmission={0.5} 
              thickness={0.1}
              roughness={0.1}
            />
          </mesh>

          {/* Layer Content (Shader) */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.8, 3.8]} />
            <shaderMaterial
              transparent
              blending={AdditiveBlending}
              depthWrite={false}
              side={DoubleSide}
              uniforms={{
                ...uniforms,
                uColor: { value: new Color(layer.color) },
                uScanColor: { value: new Color('#ffffff') },
              }}
              vertexShader={vertexShader}
              fragmentShader={layer.shader}
            />
          </mesh>

          {/* Label */}
          <Html position={[-2.5, 0, 0]} center>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-8 h-[1px] bg-white/30" />
              <span className="text-[10px] font-mono text-white/70 tracking-tighter uppercase">{layer.title}</span>
            </div>
          </Html>
        </group>
      ))}

      {/* Connecting Lines (Simulated with thin cylinders or lines) */}
      <group>
        {[
          [1.8, 1.8], [1.8, -1.8], [-1.8, 1.8], [-1.8, -1.8]
        ].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0, pos[1]]}>
            <cylinderGeometry args={[0.005, 0.005, 4 * separation, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
        ))}
      </group>

      {/* Data Stream Effect (Wavy lines from the side) */}
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[2.5, -1.5 * separation, 0]}>
          {[...Array(3)].map((_, i) => (
            <mesh key={i} position={[0, i * 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[3, 0.5]} />
              <shaderMaterial
                transparent
                blending={AdditiveBlending}
                uniforms={{
                  ...uniforms,
                  uColor: { value: new Color('#ec4899') },
                }}
                vertexShader={vertexShader}
                fragmentShader={dataStreamFragmentShader}
              />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Central Core (Processing Unit Base) */}
      <mesh position={[0, -2 * separation, 0]}>
        <boxGeometry args={[4.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Floating Status UI */}
      <Html position={[3, 2, 0]} className="pointer-events-none w-64">
        <div className="bg-black/60 backdrop-blur-md border border-blue-500/30 p-4 rounded-lg text-xs font-mono text-blue-400 shadow-xl">
          <div className="flex justify-between items-center mb-2 border-b border-blue-500/20 pb-1">
            <span className="font-bold">NEURAL LINK</span>
            <span className="animate-pulse text-blue-300">GESTURE_CTRL</span>
          </div>
          <div className="space-y-1 text-white/70 text-[10px]">
            <div className="flex justify-between">
              <span>SEPARATION</span>
              <span>{separation.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between">
              <span>ROTATION_X</span>
              <span>{(rotation.x * 180 / Math.PI).toFixed(0)}°</span>
            </div>
            <div className="flex justify-between">
              <span>ROTATION_Y</span>
              <span>{(rotation.y * 180 / Math.PI).toFixed(0)}°</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 text-emerald-400">
              {scanProgress > 0.9 ? "MATCH_CONFIRMED" : "SCANNING_EPIDERMIS..."}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

export default FingerprintModel;

