import React, { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const PlasmaVolumeMaterial = shaderMaterial(
  { uTime: 0, uRadius: 2.0 },
  // Vertex Shader
  `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform float uTime;
  uniform float uRadius;
  varying vec3 vPosition;

  // 3D Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vec3 pos = vPosition;
    float d = length(pos);
    float normalizedD = d / uRadius;
    
    vec3 dir = normalize(pos);
    float t = uTime * 0.8;
    
    // Add some twist based on distance to make tendrils curve
    float angle = d * 0.5;
    float s = sin(angle);
    float c = cos(angle);
    mat3 twist = mat3(
      c, 0.0, s,
      0.0, 1.0, 0.0,
      -s, 0.0, c
    );
    vec3 twistedDir = twist * dir;
    
    // Create tendrils using 3D crease noise
    float n1 = snoise(twistedDir * 2.5 - t * 1.5);
    float n2 = snoise(twistedDir * 5.0 + t * 1.0);
    float n3 = snoise(twistedDir * 10.0 - t * 0.5);
    
    float noiseSum = abs(n1) * 0.5 + abs(n2) * 0.25 + abs(n3) * 0.125;
    
    // Invert and power to create sharp, thin tendrils
    float tendrils = 1.0 - noiseSum;
    tendrils = pow(tendrils, 12.0);
    
    // Colors: Purple/blue inner, Pink/red outer
    vec3 colorInner = vec3(0.2, 0.3, 1.0);
    vec3 colorOuter = vec3(1.0, 0.1, 0.4);
    vec3 color = mix(colorInner, colorOuter, normalizedD);
    
    // Fade out near the core and the glass edge
    float intensity = tendrils * smoothstep(0.05, 0.2, normalizedD) * smoothstep(1.0, 0.8, normalizedD);
    
    // Boost brightness
    gl_FragColor = vec4(color * 4.0, intensity * 0.8);
  }
  `
);

extend({ PlasmaVolumeMaterial });

export function PlasmaBallModel({ showLabels = false }: { showLabels?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const material = useMemo(() => {
    return new PlasmaVolumeMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      uRadius: 2.0
    });
  }, []);
  
  useFrame((state) => {
    if (material && material.uniforms && material.uniforms.uTime) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  // Number of concentric spheres to simulate volume
  const layers = 25;
  const radius = 2.0;
  const coreRadius = 0.3;

  return (
    <group ref={groupRef}>
      {/* Volumetric Plasma Tendrils */}
      {[...Array(layers)].map((_, i) => {
        const r = coreRadius + (i / layers) * (radius - coreRadius);
        return (
          <mesh key={i} material={material}>
            <sphereGeometry args={[r, 32, 32]} />
          </mesh>
        );
      })}
      
      {/* Outer Glass Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhysicalMaterial 
          color="#2244ff" 
          transparent 
          opacity={0.05} 
          roughness={0.0} 
          transmission={0.9} 
          thickness={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner Core (Glowing Red/Pink) */}
      <mesh>
        <sphereGeometry args={[coreRadius, 32, 32]} />
        <meshBasicMaterial color="#ff1155" />
      </mesh>
      
      {/* Inner Core Glow */}
      <mesh>
        <sphereGeometry args={[coreRadius * 1.5, 32, 32]} />
        <meshBasicMaterial color="#ff1155" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      {/* Stalk */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 2.0, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
}
