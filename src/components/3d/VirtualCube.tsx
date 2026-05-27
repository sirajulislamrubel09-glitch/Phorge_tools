/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";

export default function VirtualCube() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cubeRef = useRef<HTMLDivElement | null>(null);

  // High performance refs for interactive coordinates to bypass React component re-renders
  const globalMouseRef = useRef({ x: 0, y: 0 }); // normalized screen coords: -1 to 1
  const localMouseRef = useRef({ x: 150, y: 150 });
  const isHoveredRef = useRef(false);

  // Throttled visual display state for real-time coordinate label readout
  const [hudCoords, setHudCoords] = useState({ x: 150, y: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 400);
    let height = (canvas.height = canvas.offsetHeight || 300);

    // Particle nodes for high-tech HUD grid network
    const maxParticles = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      pulse: number;
    }> = [];

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 400;
      height = canvas.height = canvas.offsetHeight || 300;
    };

    window.addEventListener("resize", handleResize);

    // Interactive 3D variables - Position (Translation) and Rotation
    let currentRotX = 0;
    let currentRotY = 0;
    let baseSpinY = 0;

    let currentTransX = 0;
    let currentTransY = 0;
    let currentTransZ = 0;

    // Canvas draw loop running at maximum refresh rate (60Hz / 120Hz)
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 3D physics computations
      baseSpinY += 0.35; // Gentle constant self-spinning loop vector of cube

      // Calculate Target Rotation angles based on normalized global mouse coordinate (-1 to 1)
      const targetRotX = -globalMouseRef.current.y * 55; // tilt vertically based on screen Y
      const targetRotY = globalMouseRef.current.x * 55;  // pivot horizontally based on screen X

      // Calculate Target Physical Positions – actual 3D translation!
      let targetTransX = 0;
      let targetTransY = 0;
      let targetTransZ = 0;

      if (isHoveredRef.current) {
        const cxNorm = width / 2;
        const cyNorm = height / 2;
        // Glide directly to local cursor location with bounds control (limit max range slightly to keep it in container layout)
        targetTransX = (localMouseRef.current.x - cxNorm) * 0.75;
        targetTransY = (localMouseRef.current.y - cyNorm) * 0.75;
        targetTransZ = 80; // dynamic 3D depth pop towards container viewport
      } else {
        // Global perpetual float: follows mouse cursor anywhere on user's monitor!
        targetTransX = globalMouseRef.current.x * 35;
        targetTransY = globalMouseRef.current.y * 25 + Math.sin(Date.now() / 800) * 8; // combined with periodic float breath
        targetTransZ = -15; // sink slightly into deep deck
      }

      // Smooth interpolation using a buttery slide factor for flawless visual luxury
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      currentTransX += (targetTransX - currentTransX) * 0.08;
      currentTransY += (targetTransY - currentTransY) * 0.08;
      currentTransZ += (targetTransZ - currentTransZ) * 0.08;

      // Draw high-tech coordinate visual mesh shifting under deep parallax
      ctx.strokeStyle = "rgba(0, 255, 136, 0.04)";
      ctx.lineWidth = 1;
      
      const gridShiftX = currentTransX * 0.15;
      const gridShiftY = currentTransY * 0.15;

      for (let i = -40; i < width + 40; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i + gridShiftX, 0);
        ctx.lineTo(i + gridShiftX, height);
        ctx.stroke();
      }
      for (let j = -40; j < height + 40; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j + gridShiftY);
        ctx.lineTo(width, j + gridShiftY);
        ctx.stroke();
      }

      // Live target visual reticle tracker overlay
      if (isHoveredRef.current) {
        ctx.strokeStyle = "rgba(0, 255, 136, 0.18)";
        ctx.lineWidth = 1.5;
        
        // Reticle target brackets around the cursor position
        const mx = localMouseRef.current.x;
        const my = localMouseRef.current.y;
        
        ctx.beginPath();
        // Top-Left L
        ctx.moveTo(mx - 15, my - 5); ctx.lineTo(mx - 15, my - 15); ctx.lineTo(mx - 5, my - 15);
        // Top-Right L
        ctx.moveTo(mx + 15, my - 5); ctx.lineTo(mx + 15, my - 15); ctx.lineTo(mx + 5, my - 15);
        // Bottom-Left L
        ctx.moveTo(mx - 15, my + 5); ctx.lineTo(mx - 15, my + 15); ctx.lineTo(mx - 5, my + 15);
        // Bottom-Right L
        ctx.moveTo(mx + 15, my + 5); ctx.lineTo(mx + 15, my + 15); ctx.lineTo(mx + 5, my + 15);
        ctx.stroke();

        // Laser pointer lines tracking the physical box
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.moveTo(mx, my);
        ctx.lineTo(width / 2 + currentTransX, height / 2 + currentTransY);
        ctx.strokeStyle = "rgba(0, 255, 136, 0.25)";
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw neon rings representing local base radar pedestal following the cube coordinates
      const cx = width / 2 + currentTransX * 0.35; // slight lag creates amazing multi-layered vector distance
      const cy = height / 2 + 35 + currentTransY * 0.35;

      for (let r = 1; r <= 3; r++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, 0.35); // compression ellipse perspective
        ctx.beginPath();
        ctx.arc(0, 0, r * 40, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.3 / r})`;
        ctx.lineWidth = 3 - r * 0.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00ff88";
        ctx.stroke();
        ctx.restore();
      }

      // Dynamic Holographic plasma beam connecting base pedestal directly to real-time cube frame position
      ctx.beginPath();
      const beamGrad = ctx.createLinearGradient(cx, cy, width / 2 + currentTransX, height / 2 + currentTransY);
      beamGrad.addColorStop(0, "rgba(0, 255, 136, 0.15)");
      beamGrad.addColorStop(0.5, "rgba(0, 210, 106, 0.05)");
      beamGrad.addColorStop(1, "rgba(0, 255, 136, 0.01)");
      ctx.fillStyle = beamGrad;
      
      const targetObjX = width / 2 + currentTransX;
      const targetObjY = height / 2 + currentTransY;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.lineTo(cx + 20, cy);
      ctx.lineTo(targetObjX + 15, targetObjY);
      ctx.lineTo(targetObjX - 15, targetObjY);
      ctx.closePath();
      ctx.fill();

      // Update and Connect HUD Floating Nodes
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        // Bounce from border boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node points
        const curSize = p.size + Math.sin(p.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, curSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${0.35 + Math.sin(p.pulse) * 0.2})`;
        ctx.shadowBlur = 3;
        ctx.shadowColor = "#00ff88";
        ctx.fill();

        // Connect nodes to neighboring particles for digital sensory mesh
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.08 * (1 - dist / 85)})`;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }

        // Draw connection lines from nodes directly to the cursor if hover-active
        if (isHoveredRef.current) {
          const mouseX = localMouseRef.current.x;
          const mouseY = localMouseRef.current.y;
          const mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
          if (mouseDist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.24 * (1 - mouseDist / 120)})`;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "#00ff88";
            ctx.stroke();
          }
        }
      });

      if (cubeRef.current) {
        // Completely override style with dynamic translate3d and rotation parameters
        cubeRef.current.style.animation = "none";
        cubeRef.current.style.transform = `translate3d(${currentTransX}px, ${currentTransY}px, ${currentTransZ}px) rotateX(${currentRotX}deg) rotateY(${baseSpinY + currentRotY}deg)`;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Global cursor event listener
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // 1. Map viewport coordinate normalized from -1.0 to 1.0 (origin is exact center)
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      
      globalMouseRef.current = { x: nx, y: ny };

      // 2. Map coordinates relative to local layout bounding rectangle
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const lx = e.clientX - rect.left;
        const ly = e.clientY - rect.top;
        
        localMouseRef.current = { x: lx, y: ly };

        // Card connection is active if cursor is on page, and stronger if hovering inside boundaries
        const padding = 160; 
        const inside = e.clientX >= rect.left && 
                       e.clientX <= rect.right && 
                       e.clientY >= rect.top && 
                       e.clientY <= rect.bottom;

        isHoveredRef.current = inside;

        // Safely trigger HUD indicator values
        setHudCoords({ x: lx, y: ly });
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] rounded-2xl bg-[#030604]/90 border border-[#00ff88]/15 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-[#00ff88]/45 shadow-[0_0_30px_rgba(0,255,136,0.03)] group/cube-panel"
    >
      {/* HUD Radar Laser Grid background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      
      {/* 3D Render Perspective Frame */}
      <div className="relative z-10 perspective-container">
        <div ref={cubeRef} className="cube-3d scale-110">
          <div className="cube-face cube-front">
            <span className="text-[10px] font-mono tracking-widest text-[#00ff88]">P H O R G E</span>
          </div>
          <div className="cube-face cube-back">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400">O F F L I N E</span>
          </div>
          <div className="cube-face cube-right">
            <span className="text-xs font-mono text-[#00ff88]">#00FF88</span>
          </div>
          <div className="cube-face cube-left">
            <span className="text-xs font-mono text-emerald-400">100+ CODES</span>
          </div>
          <div className="cube-face cube-top">
            <div className="w-5 h-5 border-2 border-[#00ff88] rounded-sm animate-pulse" />
          </div>
          <div className="cube-face cube-bottom">
            <div className="w-6 h-6 border border-[#00ff88] rotate-45" />
          </div>
        </div>
      </div>

      {/* Interactive cursor alignment warning overlays */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-[#00ff88]/40 pointer-events-none select-none tracking-widest uppercase flex items-center gap-1.5 transition-all group-hover/cube-panel:text-[#00ff88] group-hover/cube-panel:opacity-80">
        <span className="inline-block w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
        CURSOR TRACE: ACTIVE
      </div>

      {/* Floating telemetry metadata panels */}
      <div className="absolute bottom-3 left-4 font-mono text-[8px] text-emerald-500/60 tracking-wider flex flex-col gap-0.5 pointer-events-none select-none">
        <div>SYS_OPERATIONAL: ACTIVE</div>
        <div>VECTOR_DRIVE: DYNAMIC_FLY</div>
        <div>ROTATION_EASE: HIGH_INERTIA</div>
      </div>
      
      <div className="absolute bottom-3 right-4 font-mono text-[8px] text-emerald-500/80 tracking-wider flex flex-col items-end gap-0.5 pointer-events-none select-none">
        <div>X_POS: {Math.round(hudCoords.x)}px ({(globalMouseRef.current.x).toFixed(2)})</div>
        <div>Y_POS: {Math.round(hudCoords.y)}px ({(globalMouseRef.current.y).toFixed(2)})</div>
        <div>MATRIX: TRANSLATE_3D_MAGNETIC</div>
      </div>

      {/* Pedestal ambient horizontal glare */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88]/40 to-transparent blur-[2px]" />
    </div>
  );
}
