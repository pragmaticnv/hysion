import { useGLTF, Center, Html, useTexture } from '@react-three/drei';
import { useEffect, useRef, useMemo, Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface UploadedModelProps {
  url: string;
  showLabels?: boolean;
  explanation?: string | null;
}

function GLTFModel({ url, ...props }: { url: string }) {
  const { scene } = useGLTF(url, 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

  const copiedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Normalize scale for 100% precision regardless of original size
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim > 0) {
      const scale = 10 / maxDim; // Zoomed to optimal maximum size (10 units)
      clone.scale.setScalar(scale);
    }

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // 100% precision metrics
        if (mesh.geometry) {
           mesh.geometry.computeVertexNormals();
           mesh.geometry.computeBoundingBox();
           mesh.geometry.computeBoundingSphere();
        }
        
        // Super compatibility for non-manifold surfaces and precise rendering
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach(mat => {
            mat.side = THREE.DoubleSide; // Fixes invisible backsides
            mat.needsUpdate = true;
            mat.depthWrite = true;
          });
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    return () => {
      useGLTF.clear(url);
    };
  }, [url]);

  return <primitive object={copiedScene} {...props} />;
}

function ImageModel({ url, ...props }: { url: string }) {
  const texture = useTexture(url);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const image = texture.image as HTMLImageElement | undefined;
  const aspect = image ? image.height / image.width : 1;

  return (
    <mesh ref={meshRef} {...props} scale={8}>
      <planeGeometry args={[1, aspect]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

export function UploadedModel({ url, showLabels, explanation, ...props }: UploadedModelProps) {
  const isImage = url.startsWith('data:image/') || url.match(/\.(jpeg|jpg|gif|png)$/i) != null;

  return (
    <group {...props}>
      <Suspense fallback={null}>
        <Center>
          {isImage ? <ImageModel url={url} /> : <GLTFModel url={url} />}
        </Center>
      </Suspense>
    </group>
  );
}
