import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GestureHandlerProps {
  controlsRef: React.RefObject<any>;
}

// Stable exponential dampening to avoid bobbling/overshoot
class DampFilter {
  state: number;

  constructor(initial: number) {
    this.state = initial;
  }

  update(target: number, dt: number) {
    if (dt <= 0) return this.state;
    // lambda controls the speed of convergence (higher = faster)
    this.state = THREE.MathUtils.damp(this.state, target, 15, dt);
    return this.state;
  }
}

const vOffset = new THREE.Vector3();
const vRight = new THREE.Vector3();
const vUp = new THREE.Vector3();
const vDirection = new THREE.Vector3();

export function GestureHandler({ controlsRef }: GestureHandlerProps) {
  const { camera } = useThree();
  const gestureRef = useRef({ rotateX: 0, rotateY: 0, zoom: 0, panX: 0, panY: 0 });
  const targetZoom = useRef<number | null>(null);
  const targetRotation = useRef({ azimuthal: 0, polar: 0 });
  const targetPan = useRef({ x: 0, y: 0, z: 0 });
  const isInteracting = useRef(false);
  
  const zoomDamp = useRef<DampFilter | null>(null);
  const azimuthalDamp = useRef<DampFilter | null>(null);
  const polarDamp = useRef<DampFilter | null>(null);
  const panDampX = useRef<DampFilter | null>(null);
  const panDampY = useRef<DampFilter | null>(null);
  const panDampZ = useRef<DampFilter | null>(null);

  useEffect(() => {
    const handleGesture = (e: any) => {
      const { rotateX, rotateY, zoom, panX, panY, reset } = e.detail;
      
      if (reset) {
        if (controlsRef.current) {
          controlsRef.current.reset();
          targetZoom.current = null;
          isInteracting.current = false;
          zoomDamp.current = null;
          azimuthalDamp.current = null;
          polarDamp.current = null;
          panDampX.current = null;
          panDampY.current = null;
          panDampZ.current = null;
        }
        return;
      }

      // 100% Precision: Direct accumulation
      gestureRef.current.rotateX += rotateX || 0;
      gestureRef.current.rotateY += rotateY || 0;
      gestureRef.current.zoom += zoom || 0;
      gestureRef.current.panX += panX || 0;
      gestureRef.current.panY += panY || 0;
      isInteracting.current = true;
    };
    window.addEventListener('gesture-update', handleGesture);
    return () => window.removeEventListener('gesture-update', handleGesture);
  }, [controlsRef]);

  useFrame((state, delta) => {
    // Clamp delta to prevent instabilities after backgrounding
    const dt = Math.min(delta, 0.1);
    const { rotateX, rotateY, zoom, panX, panY } = gestureRef.current;

    if (controlsRef.current) {
      if (targetZoom.current === null) {
        const initialTarget = controlsRef.current.target.clone();
        const initialDist = camera.position.distanceTo(initialTarget);
        const initialAzimuthal = controlsRef.current.getAzimuthalAngle();
        const initialPolar = controlsRef.current.getPolarAngle();
        
        targetZoom.current = initialDist;
        targetRotation.current.azimuthal = initialAzimuthal;
        targetRotation.current.polar = initialPolar;
        targetPan.current.x = initialTarget.x;
        targetPan.current.y = initialTarget.y;
        targetPan.current.z = initialTarget.z;
        
        zoomDamp.current = new DampFilter(initialDist);
        azimuthalDamp.current = new DampFilter(initialAzimuthal);
        polarDamp.current = new DampFilter(initialPolar);
        panDampX.current = new DampFilter(initialTarget.x);
        panDampY.current = new DampFilter(initialTarget.y);
        panDampZ.current = new DampFilter(initialTarget.z);
      }

      // 100% Precision: Clamp deltas to prevent sudden jumps
      const maxRotPerFrame = 0.5;
      const maxZoomPerFrame = 0.2;
      const maxPanPerFrame = 0.5;

      const clampedRotateX = Math.max(-maxRotPerFrame, Math.min(maxRotPerFrame, rotateX));
      const clampedRotateY = Math.max(-maxRotPerFrame, Math.min(maxRotPerFrame, rotateY));
      const clampedZoom = Math.max(-maxZoomPerFrame, Math.min(maxZoomPerFrame, zoom));

      if (clampedZoom !== 0) {
        const zoomFactor = Math.exp(-clampedZoom);
        targetZoom.current = Math.max(controlsRef.current.minDistance, Math.min(controlsRef.current.maxDistance, targetZoom.current * zoomFactor));
      }

      if (clampedRotateX !== 0 || clampedRotateY !== 0) {
        targetRotation.current.azimuthal += clampedRotateY;
        targetRotation.current.polar += clampedRotateX;
        targetRotation.current.polar = Math.max(0.1, Math.min(Math.PI - 0.1, targetRotation.current.polar));
      }

      if (panX !== 0 || panY !== 0) {
        const clampedPanX = Math.max(-maxPanPerFrame, Math.min(maxPanPerFrame, panX));
        const clampedPanY = Math.max(-maxPanPerFrame, Math.min(maxPanPerFrame, panY));
        
        vOffset.set(0, 0, 0);
        vRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
        vUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
        
        vOffset.add(vRight.multiplyScalar(clampedPanX));
        vOffset.add(vUp.multiplyScalar(clampedPanY));
        
        targetPan.current.x += vOffset.x;
        targetPan.current.y += vOffset.y;
        targetPan.current.z += vOffset.z;
      }

      if (isInteracting.current && zoomDamp.current && azimuthalDamp.current && polarDamp.current && panDampX.current && panDampY.current && panDampZ.current) {
        // Ultra-Smooth reactive dampening
        const filteredZoom = zoomDamp.current.update(targetZoom.current, dt);
        const filteredAzimuthal = azimuthalDamp.current.update(targetRotation.current.azimuthal, dt);
        const filteredPolar = polarDamp.current.update(targetRotation.current.polar, dt);
        const filteredPanX = panDampX.current.update(targetPan.current.x, dt);
        const filteredPanY = panDampY.current.update(targetPan.current.y, dt);
        const filteredPanZ = panDampZ.current.update(targetPan.current.z, dt);

        controlsRef.current.target.set(filteredPanX, filteredPanY, filteredPanZ);

        vDirection.subVectors(camera.position, controlsRef.current.target).normalize();
        camera.position.copy(controlsRef.current.target).add(vDirection.multiplyScalar(filteredZoom));
        camera.updateProjectionMatrix();

        controlsRef.current.setAzimuthalAngle(filteredAzimuthal);
        controlsRef.current.setPolarAngle(filteredPolar);
        
        controlsRef.current.update();
      } else {
        const currentTarget = controlsRef.current.target;
        const currentDist = camera.position.distanceTo(currentTarget);
        const currentAzimuthal = controlsRef.current.getAzimuthalAngle();
        const currentPolar = controlsRef.current.getPolarAngle();
        
        targetZoom.current = currentDist;
        targetRotation.current.azimuthal = currentAzimuthal;
        targetRotation.current.polar = currentPolar;
        targetPan.current.x = currentTarget.x;
        targetPan.current.y = currentTarget.y;
        targetPan.current.z = currentTarget.z;
        
        if (zoomDamp.current) { zoomDamp.current.state = currentDist; }
        if (azimuthalDamp.current) { azimuthalDamp.current.state = currentAzimuthal; }
        if (polarDamp.current) { polarDamp.current.state = currentPolar; }
        if (panDampX.current) { panDampX.current.state = currentTarget.x; }
        if (panDampY.current) { panDampY.current.state = currentTarget.y; }
        if (panDampZ.current) { panDampZ.current.state = currentTarget.z; }
      }
    }

    // Reset accumulated deltas after applying to targets
    gestureRef.current = { rotateX: 0, rotateY: 0, zoom: 0, panX: 0, panY: 0 };
    
    // Auto-reset interaction state if no gestures received recently
    if (rotateX === 0 && rotateY === 0 && zoom === 0 && panX === 0 && panY === 0) {
       // We don't immediately set false to allow the lerp to finish settling
       if (targetZoom.current !== null && 
           Math.abs(targetZoom.current - camera.position.distanceTo(controlsRef.current!.target)) < 0.01 &&
           Math.abs(targetRotation.current.azimuthal - controlsRef.current!.getAzimuthalAngle()) < 0.001 &&
           Math.abs(targetPan.current.x - controlsRef.current!.target.x) < 0.01 &&
           Math.abs(targetPan.current.y - controlsRef.current!.target.y) < 0.01 &&
           Math.abs(targetPan.current.z - controlsRef.current!.target.z) < 0.01) {
           isInteracting.current = false;
       }
    }
  });

  return null;
}
