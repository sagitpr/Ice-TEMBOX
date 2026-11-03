'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroAtmosphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let isDisposed = false;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initThree = () => {
      if (isDisposed || !canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.z = 18;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Subtle undulating depth wave mesh
      const waveGeometry = new THREE.PlaneGeometry(38, 14, 32, 24);
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: 0x7DDCE8,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
      });
      const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
      waveMesh.rotation.x = -Math.PI * 0.38;
      waveMesh.position.y = -6.5;
      waveMesh.position.z = -2;
      scene.add(waveMesh);

      // Smooth mouse parallax lerp damping
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        if (prefersReducedMotion) return;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        targetX = nx * 0.65;
        targetY = ny * 0.45;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      const handleResize = () => {
        if (!container || !renderer) return;
        const newW = container.clientWidth || window.innerWidth;
        const newH = container.clientHeight || window.innerHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      // Animation Loop
      let clock = 0;
      const animate = () => {
        if (isDisposed || !renderer) return;
        clock += 0.01;

        currentX += (targetX - currentX) * 0.035;
        currentY += (targetY - currentY) * 0.035;
        camera.position.x = currentX;
        camera.position.y = currentY;
        camera.lookAt(0, 0, 0);

        if (!prefersReducedMotion) {
          const wavePos = waveGeometry.attributes.position;
          const waveArray = wavePos.array as Float32Array;
          for (let i = 0; i < wavePos.count; i++) {
            const u = waveArray[i * 3];
            const v = waveArray[i * 3 + 1];
            waveArray[i * 3 + 2] = Math.sin(u * 0.32 + clock * 1.1) * 0.35 + Math.cos(v * 0.38 + clock) * 0.25;
          }
          wavePos.needsUpdate = true;
        }

        if (renderer) {
          renderer.render(scene, camera);
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        waveGeometry.dispose();
        waveMaterial.dispose();
      };
    };

    const cleanup = initThree();

    return () => {
      isDisposed = true;
      if (cleanup) cleanup();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div
      className="hero-canvas-container"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};

export default HeroAtmosphere;
