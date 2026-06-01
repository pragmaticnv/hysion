import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

/**
 * SpatialMathService provides utility functions for advanced 3D spatial transformations
 * using Three.js Vector3, Quaternion, and Matrix4.
 */

export const SpatialMathService = {
  /**
   * Linearly interpolates between two vectors and returns a new Vector3 instance.
   */
  lerpVectors: (start: [number, number, number], end: [number, number, number], alpha: number): [number, number, number] => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    vStart.lerp(vEnd, alpha);
    return [vStart.x, vStart.y, vStart.z];
  },

  /**
   * Performs Spherical Linear Interpolation (SLERP) between two quaternions.
   * Useful for smooth rotation transitions.
   */
  slerpQuaternions: (start: THREE.Quaternion, end: THREE.Quaternion, alpha: number): THREE.Quaternion => {
    return start.clone().slerp(end, alpha);
  },

  /**
   * Calculates a target camera position relative to an object, maintaining a specific offset
   * but taking the object's current rotation into account.
   */
  getOffsetPosition: (objectPos: THREE.Vector3, rotation: THREE.Euler, offset: THREE.Vector3): THREE.Vector3 => {
    const quaternion = new THREE.Quaternion().setFromEuler(rotation);
    const rotatedOffset = offset.clone().applyQuaternion(quaternion);
    return objectPos.clone().add(rotatedOffset);
  },

  /**
   * Converts a degree-based rotation to a Quaternion.
   */
  degToQuaternion: (x: number, y: number, z: number): THREE.Quaternion => {
    return new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        THREE.MathUtils.degToRad(x),
        THREE.MathUtils.degToRad(y),
        THREE.MathUtils.degToRad(z)
      )
    );
  },

  /**
   * Checks if a point is within a bounding box.
   */
  isPointInBox: (point: THREE.Vector3, min: THREE.Vector3, max: THREE.Vector3): boolean => {
    const box = new THREE.Box3(min, max);
    return box.containsPoint(point);
  },

  /**
   * Smoothes a vector's movement towards a target using a spring-like dampening function.
   * This provides more natural motion than simple LERP.
   */
  dampVector: (current: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number): THREE.Vector3 => {
    const result = new THREE.Vector3().copy(current);
    // Simple exponential smoothing
    // v = v + (target - v) * (1 - exp(-lambda * dt))
    const factor = 1 - Math.exp(-lambda * dt);
    result.lerp(target, factor);
    return result;
  }
};

/**
 * Custom hook for components that need to smooth a vector position.
 * Automatically handles the three-fiber frame loop.
 */
export function useSmoothedVector(target: THREE.Vector3, lambda: number = 4) {
  const current = useRef(new THREE.Vector3().copy(target));
  
  useFrame((_, delta) => {
    current.current.copy(
      SpatialMathService.dampVector(current.current, target, lambda, delta)
    );
  });

  return current.current;
}

/**
 * Custom hook for components that need to smooth rotation using Quaternions (SLERP).
 */
export function useSmoothedQuaternion(target: THREE.Quaternion, lambda: number = 4) {
  const current = useRef(new THREE.Quaternion().copy(target));
  
  useFrame((_, delta) => {
    const factor = 1 - Math.exp(-lambda * delta);
    current.current.slerp(target, factor);
  });

  return current.current;
}
