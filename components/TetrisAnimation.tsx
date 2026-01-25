import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

// Optimized Tetris shapes - reduced complexity
const SHAPES = [
  {
    blocks: [[0, 0], [0, 1], [0, 2], [0, 3]],
    color: '#00f0f0',
  },
  {
    blocks: [[0, 0], [1, 0], [1, 1], [1, 2]],
    color: '#0000f0',
  },
  {
    blocks: [[0, 2], [1, 0], [1, 1], [1, 2]],
    color: '#f0a000',
  },
  {
    blocks: [[0, 0], [0, 1], [1, 0], [1, 1]],
    color: '#f0f000',
  },
  {
    blocks: [[0, 1], [0, 2], [1, 0], [1, 1]],
    color: '#00f000',
  },
  {
    blocks: [[0, 1], [1, 0], [1, 1], [1, 2]],
    color: '#a000f0',
  },
  {
    blocks: [[0, 0], [0, 1], [1, 1], [1, 2]],
    color: '#f00000',
  },
];

export default function TetrisAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Reduce pieces on mobile
    const isMobile = containerWidth < 768;
    const pieceCount = isMobile ? 6 : 10;

    container.innerHTML = '';

    const blockSize = Math.min(containerWidth, containerHeight) / 20;
    const timeline = gsap.timeline({ repeat: -1 });
    animationRef.current = timeline;

    // Simplified background
    const bgGradient = document.createElement('div');
    bgGradient.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top center, rgba(18, 18, 18, 0.6) 0%, #121212 100%);
      opacity: 0.8;
    `;
    container.appendChild(bgGradient);

    // Optimized grid lines
    const gridLines = document.createElement('div');
    gridLines.style.cssText = `
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: ${blockSize * 2}px ${blockSize * 2}px;
      opacity: 0.3;
    `;
    container.appendChild(gridLines);

    // Create optimized falling pieces
    for (let i = 0; i < pieceCount; i++) {
      const shapeIndex = Math.floor(Math.random() * SHAPES.length);
      const shape = SHAPES[shapeIndex];
      
      const piece = document.createElement('div');
      piece.style.cssText = `
        position: absolute;
        will-change: transform;
      `;
      
      shape.blocks.forEach(([row, col]) => {
        const block = document.createElement('div');
        block.style.cssText = `
          position: absolute;
          width: ${blockSize}px;
          height: ${blockSize}px;
          background-color: ${shape.color};
          border: 1px solid rgba(255, 255, 255, 0.2);
          left: ${col * blockSize}px;
          top: ${row * blockSize}px;
          border-radius: 2px;
        `;
        piece.appendChild(block);
      });
      
      container.appendChild(piece);
      
      const startX = Math.random() * (containerWidth - blockSize * 4);
      const startY = -blockSize * 4 - (Math.random() * containerHeight * 0.3);
      const rotation = Math.random() * 360;
      
      gsap.set(piece, { 
        x: startX, 
        y: startY,
        rotation: rotation,
        opacity: 0.85
      });
      
      const fallDuration = 5 + Math.random() * 4;
      const rotationAmount = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 120 + 60);
      
      timeline.to(
        piece,
        {
          y: containerHeight + blockSize * 4,
          rotation: rotation + rotationAmount,
          ease: "power1.in",
          duration: fallDuration,
          delay: i * 0.5,
          opacity: 0.85,
          onComplete: () => {
            const newStartX = Math.random() * (containerWidth - blockSize * 4);
            const newRotation = Math.random() * 360;
            gsap.set(piece, {
              x: newStartX,
              y: startY,
              rotation: newRotation,
              opacity: 0.85
            });
          },
        },
        i * 0.5
      );
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isLoaded]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#121212',
      }}
    />
  );
} 