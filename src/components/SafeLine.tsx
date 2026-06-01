import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

export function Line({ points, color = 'white', lineWidth = 1, opacity = 1, transparent = false, blending = THREE.NormalBlending, dashed = false, dashSize = 3, gapSize = 1, ...props }: any) {
  const lineRef = useRef<THREE.Line>(null);
  const geometry = useMemo(() => {
    let pts: THREE.Vector3[] = [];
    if (points) {
      pts = points.map((p: any) => {
        if (p instanceof THREE.Vector3) return p;
        if (Array.isArray(p)) return new THREE.Vector3(...p);
        return new THREE.Vector3(p.x || 0, p.y || 0, p.z || 0);
      });
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [points]);

  const material = useMemo(() => {
    const opts: any = {
      color,
      linewidth: lineWidth,
      opacity,
      transparent: transparent || opacity < 1,
      blending,
    };
    if (dashed) {
      opts.dashSize = dashSize;
      opts.gapSize = gapSize;
      return new THREE.LineDashedMaterial(opts);
    }
    return new THREE.LineBasicMaterial(opts);
  }, [color, lineWidth, opacity, transparent, blending, dashed, dashSize, gapSize]);

  useEffect(() => {
    if (dashed && lineRef.current) {
      lineRef.current.computeLineDistances();
    }
  }, [geometry, dashed]);

  return <primitive ref={lineRef} object={new THREE.Line(geometry, material)} {...props} />;
}

export function Trail({ children, ...props }: any) {
  return <>{children}</>;
}
