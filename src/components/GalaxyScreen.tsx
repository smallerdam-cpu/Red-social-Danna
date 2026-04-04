import React, { useEffect, useRef } from 'react';
import { MusicPlayer } from './MusicPlayer';

const texts = [
  "Smith 🌍", "Mi sol ☀️", "eterno ❤️", "Estrella ⭐", 
  "Mi vida 🥰", "Siempre tú ✨", "Mi razón 🎁", "Contigo 💞", 
  "Libertad 🦋", "Mi universo 🌌", "Mi cielo ☁️", "Eres todo 💎",
  "Preciosa 💕", "Danna 😊", "Brillas 🌟", "Mi sueño 💭",
  "Universo 💫", "Perfección 🤍", "Hermosa 💖", "Paola 🪄"
];

export const GalaxyScreen: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showInstructions, setShowInstructions] = React.useState(true);
  const [showMusicBar, setShowMusicBar] = React.useState(false);

  // Interaction states for 3D Camera
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotationX = useRef(Math.PI / 8); // Initial slight tilt down
  const rotationY = useRef(0);
  const zoom = useRef(1);

  // Pinch-to-zoom state
  const initialPinchDist = useRef<number | null>(null);
  const initialZoom = useRef<number>(1);
  
  // Event throttling
  const lastMoveTime = useRef(0);
  const moveThrottleMs = 16; // ~60fps throttle

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D canvas context');
      return;
    }

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Generate Galaxy Nodes (Texts)
    const numNodes = 75;
    const nodes = Array.from({ length: numNodes }).map(() => {
      // Distance from the center (sun)
      const orbitRadius = 150 + Math.random() * 800; 
      const orbitAngle = Math.random() * Math.PI * 2;
      // Y-axis thickness of the galaxy disk
      const yOffset = (Math.random() - 0.5) * 100; 
      
      return {
        text: texts[Math.floor(Math.random() * texts.length)],
        orbitAngle,
        orbitRadius,
        yOffset,
        baseScale: 0.6 + Math.random() * 1.4,
        speed: (0.0003 + Math.random() * 0.0008) * (Math.random() > 0.5 ? 1 : -1),
        // Pre-allocate rendering properties
        screenX: 0, screenY: 0, depth: 0, renderScale: 0, alpha: 0
      };
    });

    // Generate 3D Starfield
    const stars = Array.from({ length: 800 }).map(() => {
      const radius = 400 + Math.random() * 2000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return {
        baseX: radius * Math.sin(phi) * Math.cos(theta),
        baseY: radius * Math.sin(phi) * Math.sin(theta),
        baseZ: radius * Math.cos(phi),
        size: Math.random() * 2.5,
        opacity: Math.random(),
        screenX: 0, screenY: 0, depth: 0, renderScale: 0
      };
    });

    let time = 0;
    const fontCache = new Map<number, string>(); // Cache font strings

    const render = () => {
      time += 1;
      
      // Clear background
      ctx.fillStyle = '#020008';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const currentZoom = zoom.current;
      const fov = 800;
      const viewportPadding = 200; // Culling threshold
      
      // Pre-calculate rotation matrices for performance
      const cosX = Math.cos(rotationX.current);
      const sinX = Math.sin(rotationX.current);
      const cosY = Math.cos(rotationY.current);
      const sinY = Math.sin(rotationY.current);

      // ----------------------------
      // 1. Process and Draw Stars (with culling)
      // ----------------------------
      const renderedStars = [];
      for (const star of stars) {
        // Optimized rotation: apply Y then X in one pass
        const x1 = star.baseX * cosY + star.baseZ * sinY;
        const z1 = -star.baseX * sinY + star.baseZ * cosY;
        const y2 = star.baseY * cosX - z1 * sinX;
        const z2 = star.baseY * sinX + z1 * cosX;
        
        const zPos = z2 + fov;
        if (zPos < 50) continue; // Skip if behind the camera

        const scale = (fov / zPos) * currentZoom;
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;
        
        // Culling: Skip stars outside viewport with padding
        if (screenX < -viewportPadding || screenX > canvas.width + viewportPadding ||
            screenY < -viewportPadding || screenY > canvas.height + viewportPadding) {
          continue;
        }
        
        star.screenX = screenX;
        star.screenY = screenY;
        star.depth = z2;
        star.renderScale = scale;
        renderedStars.push(star);
      }

      // Draw all background stars (limit to 500 visible)
      const maxVisibleStars = Math.min(renderedStars.length, 500);
      for (let i = 0; i < maxVisibleStars; i++) {
        const star = renderedStars[i];
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * Math.min(1, star.renderScale)})`;
        ctx.beginPath();
        ctx.arc(star.screenX, star.screenY, star.size * star.renderScale, 0, Math.PI * 2);
        ctx.fill();
      }

      // ----------------------------
      // 2. Process Nodes (Texts) - Optimized with better culling
      // ----------------------------
      const renderedNodes = [];
      for (const node of nodes) {
        node.orbitAngle += node.speed;
        
        // Base 3D position (Orbiting around Y-axis)
        const baseX = Math.cos(node.orbitAngle) * node.orbitRadius;
        const baseY = node.yOffset + Math.sin(time * 0.02 + node.orbitAngle) * 15; // Hovering effect
        const baseZ = Math.sin(node.orbitAngle) * node.orbitRadius;

        // Apply 3D Camera Rotations (optimized)
        const x1 = baseX * cosY + baseZ * sinY;
        const z1 = -baseX * sinY + baseZ * cosY;
        const y2 = baseY * cosX - z1 * sinX;
        const z2 = baseY * sinX + z1 * cosX;

        const zPos = z2 + fov;
        if (zPos < 50) continue; // Behind camera

        const scale = (fov / zPos) * currentZoom;
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;
        
        // Early culling: Skip nodes far outside viewport
        if (screenX < -100 || screenX > canvas.width + 100 ||
            screenY < -100 || screenY > canvas.height + 100) {
          continue;
        }
        
        node.screenX = screenX;
        node.screenY = screenY;
        node.depth = z2;
        node.renderScale = scale * node.baseScale;
        
        // Fade out objects that are too far or too close
        node.alpha = Math.min(1, Math.max(0.1, 1 - (zPos - fov) / 1500));
        
        renderedNodes.push(node);
      }

      // Sort nodes by depth descending (furthest ones first) -> Painter's Algorithm
      renderedNodes.sort((a, b) => b.depth - a.depth);

      // Helper to draw a text node with cached font strings
      const renderNode = (node: typeof nodes[0]) => {
        // Culling: Skip nodes outside viewport
        if (node.screenX < -50 || node.screenX > canvas.width + 50 ||
            node.screenY < -50 || node.screenY > canvas.height + 50) {
          return;
        }
        
        const fontSize = Math.max(8, 16 * node.renderScale);
        // Use cached font or create it
        const fontKey = Math.round(fontSize * 10); // Round to nearest 0.1
        if (!fontCache.has(fontKey)) {
          fontCache.set(fontKey, `600 ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`);
        }
        
        ctx.font = fontCache.get(fontKey)!;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillStyle = `rgba(255, 255, 255, ${node.alpha})`;
        ctx.shadowBlur = 15 * node.renderScale;
        ctx.shadowColor = '#d946ef'; // Fuchsia glow
        ctx.fillText(node.text, node.screenX, node.screenY);
      };

      // ----------------------------
      // 3. Render Nodes Behind Sun (depth > 0)
      // ----------------------------
      let i = 0;
      while (i < renderedNodes.length && renderedNodes[i].depth > 0) {
        renderNode(renderedNodes[i]);
        i++;
      }

      // ----------------------------
      // 4. Render Central Sun (at origin 0,0,0)
      // ----------------------------
      ctx.shadowBlur = 0; // Reset shadow for sun glows
      const sunZ = 0 + fov;
      
      if (sunZ > 50) {
        const sunScale = (fov / sunZ) * currentZoom;
        const sunScreenX = centerX;
        const sunScreenY = centerY;

        const glowPulse = Math.sin(time * 0.05) * 10;
        
        const drawGlow = (radius: number, color: string) => {
          const r = (radius + glowPulse) * sunScale;
          const gradient = ctx.createRadialGradient(sunScreenX, sunScreenY, 0, sunScreenX, sunScreenY, r);
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(sunScreenX, sunScreenY, r, 0, Math.PI * 2);
          ctx.fill();
        };

        // Outer fuchsia glow
        drawGlow(350, 'rgba(255, 0, 136, 0.12)');
        // Middle orange glow
        drawGlow(180, 'rgba(255, 51, 0, 0.3)');
        
        // Solid core
        ctx.fillStyle = '#ffea00';
        ctx.shadowBlur = 50 * sunScale;
        ctx.shadowColor = '#ffaa00';
        ctx.beginPath();
        ctx.arc(sunScreenX, sunScreenY, (45 + glowPulse * 0.2) * sunScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // ----------------------------
      // 5. Render Nodes In Front Of Sun (depth <= 0)
      // ----------------------------
      while (i < renderedNodes.length) {
        renderNode(renderedNodes[i]);
        i++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // ----------------------------
    // Interaction Handlers
    // ----------------------------
    const getPinchDistance = (e: TouchEvent) => {
      return Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    };

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      if ('touches' in e) {
        if (e.touches.length === 2) {
          initialPinchDist.current = getPinchDistance(e);
          initialZoom.current = zoom.current;
        } else if (e.touches.length === 1) {
          dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      } else {
        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      
      // Throttle movement events
      const now = Date.now();
      if (now - lastMoveTime.current < moveThrottleMs) return;
      lastMoveTime.current = now;
      
      let clientX, clientY;
      
      if ('touches' in e) {
        if (e.touches.length === 2 && initialPinchDist.current !== null) {
          // Handle Pinch-to-Zoom
          const currentDist = getPinchDistance(e);
          const newZoom = initialZoom.current * (currentDist / initialPinchDist.current);
          zoom.current = Math.max(0.2, Math.min(newZoom, 5));
          return;
        } else if (e.touches.length === 1) {
          // Handle Single Touch Drag
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          return;
        }
      } else {
        // Handle Mouse Drag
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;

      // Update Rotation Angles (Sensitivity)
      rotationY.current -= deltaX * 0.005; // Negative to follow finger direction
      rotationX.current += deltaY * 0.005; 
      
      // Limit vertical rotation (Pitch) to prevent flipping upside down
      rotationX.current = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, rotationX.current));

      // Reset drag start for continuous movement
      dragStart.current = { x: clientX, y: clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      initialPinchDist.current = null;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Scroll to zoom
      const zoomAmount = e.deltaY * -0.0015;
      zoom.current = Math.max(0.2, Math.min(zoom.current + zoomAmount, 5));
    };

    // Attach Listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleMouseDown, { passive: false });
    canvas.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Hide instructions and show music bar after 10 seconds, start music immediately
  React.useEffect(() => {
    // Start music when galaxy screen mounts
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Auto-play policy might prevent it
      });
    }

    // Hide instructions and show music bar after 10 seconds
    const timer = setTimeout(() => {
      setShowInstructions(false);
      setShowMusicBar(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Audio Player - Always in DOM, starts playing immediately */}
      <audio
        ref={audioRef}
        src="https://files.catbox.moe/4ihj5h.wav"
        loop
        crossOrigin="anonymous"
      />

      <canvas 
        ref={canvasRef} 
        className="block touch-none cursor-grab active:cursor-grabbing w-full h-full"
      />
      
      {/* Overlay Instructions - Fade out after 10 seconds */}
      {showInstructions && (
        <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none z-10 animate-fade-out">
          <div className="inline-block bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-[0_0_20px_rgba(255,0,136,0.2)]">
            <p className="text-white/90 text-sm md:text-base font-medium tracking-wide drop-shadow-md">
              Desliza para rotar en 3D, pellizca para acercar ✨
            </p>
          </div>
        </div>
      )}
      
      {/* Music Player - Appears after instructions disappear */}
      <MusicPlayer isVisible={showMusicBar} audioRef={audioRef as React.RefObject<HTMLAudioElement>} />
    </div>
  );
};
