"use client"

import React, { useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  initialSize: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 2; // Smaller size for less density
    this.speedX = Math.random() * 2 - 1;
    this.speedY = -Math.random() * 3 - 1;
    this.life = 100;
    this.initialSize = this.size;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 2.5; // Faster fade out
    this.size = Math.max(0, this.initialSize * (this.life / 100));
  }
}

const SmokeEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles
      particlesRef.current = particlesRef.current
        .filter(particle => particle.life > 0 && particle.size > 0)
        .map(particle => {
          particle.update();
          
          // Draw particle
          if (particle.size > 0) {
            const opacity = particle.life / 100;
            // Chilli pepper tint color matching --color-rojo (#bd2025 -> 189, 32, 37)
            ctx.fillStyle = `rgba(189, 32, 37, ${opacity * 0.3})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          return particle;
        });

      // Add new particles near mouse position
      if (mousePosRef.current.x !== -1000 && mousePosRef.current.y !== -1000) {
        // Generate fewer particles per frame for less density
        for (let i = 0; i < 1; i++) {
          if (Math.random() > 0.2) { // 80% chance to spawn a particle
            particlesRef.current.push(
              new Particle(
                mousePosRef.current.x + (Math.random() * 10 - 5),
                mousePosRef.current.y + (Math.random() * 10 - 5)
              )
            );
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Set initial canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1000, y: -1000 };
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export { SmokeEffect };
