import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CFDPlaneProps {
  machNumber?: number;
  angleOfAttack?: number;
}

export function CFDPlane({ machNumber = 0.85, angleOfAttack = 2.5 }: CFDPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 3.0 },
      uMach: { value: machNumber },
      uAoA: { value: angleOfAttack },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current && materialRef.current.uniforms) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMach.value = machNumber;
      materialRef.current.uniforms.uAoA.value = angleOfAttack;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uMach;
    uniform float uAoA;

    // Pseudo-random noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * uSpeed;
      float aoaRad = uAoA * 3.14159 / 180.0;

      // Rotate UVs slightly based on AoA to simulate flow direction change
      vec2 center = vec2(0.5, 0.5);
      float s = sin(aoaRad * 0.5);
      float c = cos(aoaRad * 0.5);
      mat2 rot = mat2(c, -s, s, c);
      uv = rot * (uv - center) + center;

      // Aircraft part anchors
      vec2 nosePos = vec2(0.75, 0.5);
      vec2 canopyPos = vec2(0.6, 0.55);
      vec2 wingPos = vec2(0.4, 0.5);
      vec2 tailPos = vec2(0.2, 0.6);

      // Mach cone slope (Mach Angle alpha = arcsin(1/M))
      // Simplified: higher mach = sharper angle
      float machAngle = 0.5 / max(1.0, uMach); 
      float shockIntensity = smoothstep(0.7, 1.2, uMach); // Shocks only appear near/above Mach 1

      // Calculate shockwaves
      float shock1 = smoothstep(0.0, 0.015, abs(abs(uv.y - nosePos.y) - machAngle * (nosePos.x - uv.x))) * step(uv.x, nosePos.x);
      float shock2 = smoothstep(0.0, 0.02, abs(abs(uv.y - canopyPos.y) - machAngle * 1.2 * (canopyPos.x - uv.x))) * step(uv.x, canopyPos.x);
      float shock3 = smoothstep(0.0, 0.025, abs(abs(uv.y - wingPos.y) - machAngle * 1.5 * (wingPos.x - uv.x))) * step(uv.x, wingPos.x);
      float shock4 = smoothstep(0.0, 0.02, abs(abs(uv.y - tailPos.y) - machAngle * 1.1 * (tailPos.x - uv.x))) * step(uv.x, tailPos.x);

      // Pressure calculation
      float pressureBase = (1.0 - shock1) * 1.2 + (1.0 - shock2) * 0.9 + (1.0 - shock3) * 0.8 + (1.0 - shock4) * 0.7;
      float pressure = pressureBase * shockIntensity;

      // Lift contribution to pressure (Low pressure on top, high on bottom)
      float liftPressure = (uv.y - 0.5) * uAoA * 0.05;
      pressure += liftPressure;

      // Add base flow lines
      float flowSpeed = uMach * 10.0;
      float flow = sin(uv.y * 120.0 + t * flowSpeed) * 0.05;
      pressure += flow;

      // Add turbulence behind the aircraft
      float wakeArea = smoothstep(0.6, 0.1, uv.x) * smoothstep(0.35, 0.0, abs(uv.y - 0.5));
      float noise = (hash(uv * 15.0 + vec2(t * flowSpeed * 0.1, 0.0)) - 0.5) * 0.5;
      pressure += noise * wakeArea * (1.0 + uAoA * 0.1);

      // Color mapping
      vec3 colorLow = vec3(0.0, 0.2, 0.8);    // Extremely low pressure (Deep Blue)
      vec3 colorSafe = vec3(0.1, 0.4, 0.7);   // Ambient (Blue-Cyan)
      vec3 colorHigh = vec3(0.9, 0.5, 0.1);   // High pressure (Orange)
      vec3 colorShock = vec3(1.0, 0.1, 0.1);  // Critical pressure (Red)

      vec3 finalColor = colorSafe;
      
      if (pressure > 0.05) {
        finalColor = mix(colorSafe, colorHigh, smoothstep(0.05, 0.4, pressure));
        finalColor = mix(finalColor, colorShock, smoothstep(0.4, 1.0, pressure));
      } else if (pressure < -0.05) {
        finalColor = mix(colorSafe, colorLow, smoothstep(-0.05, -0.4, pressure));
      }

      // Scanline effect
      float scanline = sin(uv.y * 500.0) * 0.03;
      finalColor -= scanline;

      // Edge fading
      float edgeFade = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x) * 
                       smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);

      gl_FragColor = vec4(finalColor, 0.8 * edgeFade);
    }
  `;

  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[14, 8]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
