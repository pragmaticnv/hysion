import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, Line, Trail, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from 'motion/react';

// Detailed descriptions for calculus elements
const CALCULUS_DETAILS: Record<string, string> = {
  '∇f(x,y) Normal': 'The gradient vector (nabla) represents the direction and magnitude of the steepest increase of a function. The normal vector at a point on the surface is orthogonal to the tangent plane.',
  'Tangent Plane': 'A first-order linear approximation of the surface at a specific point. It represents the behavior of the function in the immediate neighborhood of the point.',
  'Equation': 'Represented by (∂f/∂x)(x-x₀) + (∂f/∂y)(y-y₀), this linear equation defines the orientation of the tangent plane in 3D space.',
  'Derivative Limit': 'The fundamental definition of a derivative: the limit of the average rate of change as the interval approaches zero.',
  'Stoke\'s Theorem': 'A fundamental theorem in vector calculus that relates the line integral of a vector field over a closed curve to the surface integral of its curl.',
  'Manifold Analysis': 'The study of the local and global geometry of the multivariable surface (manifold) using differential calculus tools.',
  'Double Integral': 'The volume under the surface over a region D in the xy-plane, calculated by summing infinitesimal volume elements f(x,y)dA.',
  'Volume Projection': 'Visualizing the 3D volume enclosed between the surface manifold and the coordinate plane through projection techniques.'
};

function Hoverable({ children, text, description }: { children: React.ReactNode, text: string, description: string }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div 
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      className="relative pointer-events-auto"
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black/95 backdrop-blur-xl border border-indigo-500/50 p-4 rounded-2xl w-64 shadow-2xl z-50 pointer-events-none"
          >
            <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">{text}</h4>
            <p className="text-white/80 text-[10px] leading-relaxed font-sans">{description}</p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/90 border-r border-b border-indigo-500/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SmartHtml({ position, text, color, symbol, description }: { position: [number, number, number], text: string, color: string, symbol?: string, description?: string }) {
  return (
    <Html position={position} center distanceFactor={10}>
      <Hoverable text={text} description={description || CALCULUS_DETAILS[text] || ''}>
        <div className="flex items-center gap-2 group cursor-help">
          <div 
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-white/20 backdrop-blur-md"
            style={{ backgroundColor: `${color}44` }}
          >
            <span className="text-[10px] font-bold" style={{ color }}>{symbol || text[0]}</span>
          </div>
          <div className="px-2 py-1 rounded-md bg-black/20 border border-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="text-[8px] font-bold whitespace-nowrap uppercase tracking-tighter" style={{ color }}>{text}</span>
          </div>
        </div>
      </Hoverable>
    </Html>
  );
}

// Color palette
const COLORS = {
  surface: "#4f46e5", // indigo
  wireframe: "#818cf8",
  tangent: "#ec4899", // pink
  normal: "#10b981", // emerald
  vector1: "#06b6d4", // cyan
  vector2: "#3b82f6", // blue
  integral: "#f59e0b", // amber
};

// Generates an advanced 3D Calculus surface and analytical elements
export function CalculusModel({ showLabels = true }: { showLabels?: boolean }) {
  const surfaceRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const tangentPlaneRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Mathematical function for our primary manifold Z = f(X,Y)
  // f(x,y) = sin(x * frequency) * cos(y * frequency) * amplitude
  const gridSize = 150;
  const extent = 5;

  // Generate vertices and indices for the parametric surface
  const { positions, indices, vectors, lineIntegralPath } = useMemo(() => {
    const pos = [];
    const ind = [];
    const vecs = [];
    const path = [];

    // Riemann sum boxes (Integral approximation)
    const step = (extent * 2) / gridSize;

    const f = (x: number, y: number) => {
      let r = Math.sqrt(x * x + y * y);
      return Math.sin(x * 1.5) * Math.cos(y * 1.5) * 0.8 + (Math.sin(r * 2) / (r + 1)) * 0.5;
    };

    for (let i = 0; i <= gridSize; i++) {
      const x = -extent + i * step;
      for (let j = 0; j <= gridSize; j++) {
        const y = -extent + j * step;
        const z = f(x, y);
        pos.push(x, z, y);

        // Add vector field arrows (gradient field)
        if (i % 6 === 0 && j % 6 === 0) {
          const h = 0.01;
          const dzdx = (f(x + h, y) - z) / h;
          const dzdy = (f(x, y + h) - z) / h;
          const len = Math.sqrt(dzdx * dzdx + dzdy * dzdy);
          
          if (len > 0.1) {
            vecs.push({
              start: new THREE.Vector3(x, z, y),
              end: new THREE.Vector3(x + dzdx * 0.3, z + 0.2, y + dzdy * 0.3),
            });
          }
        }
      }
    }

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const a = i * (gridSize + 1) + j;
        const b = i * (gridSize + 1) + j + 1;
        const c = (i + 1) * (gridSize + 1) + j + 1;
        const d = (i + 1) * (gridSize + 1) + j;
        ind.push(a, b, d);
        ind.push(b, c, d);
      }
    }

    // Generate a line integral path (spiral on the surface)
    for (let t = 0; t < Math.PI * 4; t += 0.1) {
       const px = Math.cos(t) * (t / 4) * 1.5;
       const py = Math.sin(t) * (t / 4) * 1.5;
       path.push(new THREE.Vector3(px, f(px, py) + 0.05, py));
    }

    return {
      positions: new Float32Array(pos),
      indices: new Uint16Array(ind),
      vectors: vecs,
      lineIntegralPath: path
    };
  }, []);

  // Decoration particles
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const char = ["∂", "∫", "∑", "∇", "∞"][Math.floor(Math.random() * 5)];
      return {
        id: i,
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 + 1,
          (Math.random() - 0.5) * 6,
        ] as [number, number, number],
        speed: 1 + Math.random() * 2,
        char: char === "∂" ? "∂x" : char,
      };
    });
  }, []);

  // Geometry computation
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  }, [positions, indices]);

  // Edges for wireframe overlay
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(geometry),
    [geometry],
  );

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = state.clock.elapsedTime * 0.4;

    // Animate the tangent plane moving along the surface
    if (tangentPlaneRef.current) {
      // Parametric path for an orbiting point (x,y)
      const paramX = Math.cos(t) * 2;
      const paramY = Math.sin(t * 1.5) * 2;

      let r = Math.sqrt(paramX * paramX + paramY * paramY);
      // Recalculate exact Z
      const z =
        Math.sin(paramX * 1.5) * Math.cos(paramY * 1.5) * 0.8 +
        (Math.sin(r * 2) / (r + 1)) * 0.5;

      // Compute partial derivatives for tangent plane orientation
      const h = 0.01;
      const rdx = Math.sqrt((paramX + h) ** 2 + paramY ** 2);
      const zx =
        Math.sin((paramX + h) * 1.5) * Math.cos(paramY * 1.5) * 0.8 +
        (Math.sin(rdx * 2) / (rdx + 1)) * 0.5;
      const dzdx = (zx - z) / h;

      const rdy = Math.sqrt(paramX ** 2 + (paramY + h) ** 2);
      const zy =
        Math.sin(paramX * 1.5) * Math.cos((paramY + h) * 1.5) * 0.8 +
        (Math.sin(rdy * 2) / (rdy + 1)) * 0.5;
      const dzdy = (zy - z) / h;

      tangentPlaneRef.current.position.set(paramX, z + 0.02, paramY);

      // Calculate tangent vectors and cross product for normal
      const vx = new THREE.Vector3(1, dzdx, 0).normalize();
      const vy = new THREE.Vector3(0, dzdy, 1).normalize();
      const normal = new THREE.Vector3().crossVectors(vy, vx).normalize();

      // Create quaternion from normal pointing "up"
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normal,
      );
      tangentPlaneRef.current.quaternion.slerp(quaternion, 0.1);
    }

    // Make surface breathe/pulsate slightly based on wave equations
    if (surfaceRef.current && wireframeRef.current) {
      surfaceRef.current.rotation.y = Math.sin(timeRef.current * 0.1) * 0.05;
      wireframeRef.current.rotation.y = surfaceRef.current.rotation.y;
    }
  });

  return (
    <group scale={[0.8, 0.8, 0.8]} position={[0, -0.5, 0]}>
      {/* Primary Mathematical Surface */}
      <mesh ref={surfaceRef} geometry={geometry}>
        <meshStandardMaterial
          color={COLORS.surface}
          side={THREE.DoubleSide}
          roughness={0.1}
          metalness={0.3}
          wireframe={false}
        />
      </mesh>

      {/* Analytical Wireframe Overlay */}
      <lineSegments ref={wireframeRef} geometry={edgesGeometry}>
        <lineBasicMaterial color={COLORS.wireframe} transparent opacity={0.3} />
      </lineSegments>

      {/* Dynamic Tangent Plane & Normal Vector */}
      <group ref={tangentPlaneRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 2, 8, 8]} />
          <meshBasicMaterial
            color={COLORS.tangent}
            transparent
            opacity={0.3}
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshPhysicalMaterial
            color={COLORS.tangent}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Normal Vector Arrow */}
        <group position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshBasicMaterial color={COLORS.normal} />
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1]} />
            <meshBasicMaterial color={COLORS.normal} />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <coneGeometry args={[0.08, 0.2]} />
            <meshBasicMaterial color={COLORS.normal} />
          </mesh>
          {showLabels && (
            <SmartHtml
              position={[0, 1.2, 0]}
              text="∇f(x,y) Normal"
              color={COLORS.normal}
              symbol="∇"
            />
          )}
        </group>
        {/* Tangent point indicator */}
        <mesh>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        {showLabels && (
          <group position={[1.2, 0.2, 0]}>
            <SmartHtml
              position={[0, 0, 0]}
              text="Tangent Plane"
              color={COLORS.tangent}
              symbol="T"
            />
            <SmartHtml
              position={[0, -0.3, 0]}
              text="Equation"
              color="#ffffff"
              symbol="f"
              description="Represented by (∂f/∂x)(x-x₀) + (∂f/∂y)(y-y₀), this linear equation defines the orientation of the tangent plane in 3D space."
            />
          </group>
        )}
      </group>

      {/* Vector Field Representation (Gradient field indicators) */}
      <group>
        {vectors.map((vec, idx) => (
          <group key={idx} position={vec.start.toArray()}>
            <Line
              points={[
                [0, 0, 0],
                [
                  vec.end.x - vec.start.x,
                  vec.end.y - vec.start.y,
                  vec.end.z - vec.start.z,
                ],
              ]}
              color={COLORS.vector1}
              lineWidth={1}
              transparent
              opacity={0.4}
            />
            <mesh
              position={[
                vec.end.x - vec.start.x,
                vec.end.y - vec.start.y,
                vec.end.z - vec.start.z,
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial
                color={COLORS.vector1}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Line Integral Trail Implementation */}
      <Trail
        width={2}
        color={COLORS.integral}
        length={20}
        decay={1}
        local={false}
        stride={0.2}
        interval={1}
      >
        <group>
          {lineIntegralPath.map((p, i) => (
             <mesh key={i} position={p}>
                <sphereGeometry args={[0.02]} />
                <meshBasicMaterial color={COLORS.integral} />
             </mesh>
          ))}
        </group>
      </Trail>

      {/* Numerical Analysis Guides (Precision indicators) */}
      <group position={[0, -2.5, 0]}>
        <gridHelper args={[10, 20, 0x4f46e5, 0x1e1b4b]} position={[0, 0, 0]} />
        {showLabels && (
          <group position={[0, 0.5, 5]}>
            <SmartHtml
              position={[-4, 0, 0]}
              text="Derivative Limit"
              color="#ffffff"
              symbol="lim"
            />
            <SmartHtml
              position={[4, 0, 0]}
              text="Stoke's Theorem"
              color="#ffffff"
              symbol="∮"
            />
            <SmartHtml
               position={[0, 0.5, 0]}
               text="Manifold Analysis"
               color={COLORS.wireframe}
               symbol="M"
            />
          </group>
        )}
      </group>

      {/* Floating Integral Equation */}
      <group position={[0, -2.5, 0]}>
        {showLabels && (
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
            <SmartHtml
              position={[0, -0.5, 3]}
              text="Double Integral"
              color="#ffffff"
              symbol="∫∫"
            />
            <SmartHtml
              position={[0, -0.9, 3]}
              text="Volume Projection"
              color={COLORS.vector2}
              symbol="V"
            />
          </Float>
        )}
      </group>

      {/* Decorative math particles */}
      {particles.map((p) => (
        <group key={`particle-${p.id}`} position={p.position}>
          <Float speed={p.speed} floatIntensity={2} rotationIntensity={1}>
            <Text fontSize={0.2} color={COLORS.wireframe} fillOpacity={0.4}>
              {p.char}
            </Text>
          </Float>
        </group>
      ))}
    </group>
  );
}
