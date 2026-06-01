import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

export function RenderLimiter({ fpsLimit }: { fpsLimit: number }) {
  const { gl, scene, camera } = useThree();
  const clock = useRef(0);

  useFrame((state, delta) => {
    if (fpsLimit >= 165) {
      gl.render(scene, camera);
      return;
    }
    
    clock.current += delta;
    const frameTime = 1 / fpsLimit;
    if (clock.current >= frameTime) {
      gl.render(scene, camera);
      clock.current = clock.current % frameTime;
    }
  }, 1);

  return null;
}
