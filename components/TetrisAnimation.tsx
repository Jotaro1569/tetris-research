import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, useAnimation } from 'framer-motion';

// Define Tetris block shapes and colors with enhanced styling
const SHAPES = [
  {
    // I-shape
    blocks: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    color: '#00f0f0', // cyan
    glow: '0 0 15px rgba(0, 240, 240, 0.7)'
  },
  {
    // J-shape
    blocks: [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    color: '#0000f0', // blue
    glow: '0 0 15px rgba(0, 0, 240, 0.7)'
  },
  {
    // L-shape
    blocks: [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    color: '#f0a000', // orange
    glow: '0 0 15px rgba(240, 160, 0, 0.7)'
  },
  {
    // O-shape
    blocks: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    color: '#f0f000', // yellow
    glow: '0 0 15px rgba(240, 240, 0, 0.7)'
  },
  {
    // S-shape
    blocks: [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
    ],
    color: '#00f000', // green
    glow: '0 0 15px rgba(0, 240, 0, 0.7)'
  },
  {
    // T-shape
    blocks: [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    color: '#a000f0', // purple
    glow: '0 0 15px rgba(160, 0, 240, 0.7)'
  },
  {
    // Z-shape
    blocks: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    color: '#f00000', // red
    glow: '0 0 15px rgba(240, 0, 0, 0.7)'
  },
];

export default function TetrisAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const animationControls = useAnimation();
  const [isLoaded, setIsLoaded] = useState(false);

  // Add a subtle pulse animation to the container
  useEffect(() => {
    animationControls.start({
      opacity: [0, 1],
      scale: [0.98, 1],
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }
    });
    setIsLoaded(true);
  }, [animationControls]);

  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Clear any existing blocks
    container.innerHTML = '';

    // Block size is relative to container size
    const blockSize = Math.min(containerWidth, containerHeight) / 20;

    // Create the Tetris grid
    const grid = document.createElement('div');
    grid.style.position = 'absolute';
    grid.style.inset = '0';
    grid.style.display = 'grid';

    // Create falling pieces
    const timeline = gsap.timeline({ repeat: -1 });
    animationRef.current = timeline;

    // Add subtle background gradients
    const bgGradient = document.createElement('div');
    bgGradient.style.position = 'absolute';
    bgGradient.style.inset = '0';
    bgGradient.style.background = 'radial-gradient(circle at top center, rgba(18, 18, 18, 0.6) 0%, rgba(18, 18, 18, 0.9) 70%, #121212 100%)';
    bgGradient.style.opacity = '0.8';
    container.appendChild(bgGradient);

    // Add a subtle grid effect in the background
    const gridLines = document.createElement('div');
    gridLines.style.position = 'absolute';
    gridLines.style.inset = '0';
    gridLines.style.backgroundImage = `
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
    `;
    gridLines.style.backgroundSize = `${blockSize * 1.5}px ${blockSize * 1.5}px`;
    gridLines.style.opacity = '0.3';
    container.appendChild(gridLines);

    // Create multiple falling pieces with random shapes, positions, and timing
    for (let i = 0; i < 15; i++) { // Increased number of pieces
      // Pick a random shape
      const shapeIndex = Math.floor(Math.random() * SHAPES.length);
      const shape = SHAPES[shapeIndex];
      
      // Create a piece container
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.transformStyle = 'preserve-3d';
      
      // Create blocks for the piece
      shape.blocks.forEach(([row, col]) => {
        const block = document.createElement('div');
        block.style.position = 'absolute';
        block.style.width = `${blockSize}px`;
        block.style.height = `${blockSize}px`;
        block.style.backgroundColor = shape.color;
        block.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        block.style.boxShadow = shape.glow;
        block.style.left = `${col * blockSize}px`;
        block.style.top = `${row * blockSize}px`;
        block.style.borderRadius = '2px';
        block.style.transform = 'translateZ(0)';
        
        // Add inner gradient to blocks for 3D effect
        const innerLight = document.createElement('div');
        innerLight.style.position = 'absolute';
        innerLight.style.inset = '0';
        innerLight.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)';
        innerLight.style.borderRadius = '2px';
        block.appendChild(innerLight);
        
        piece.appendChild(block);
      });
      
      // Add the piece to the container
      container.appendChild(piece);
      
      // Random horizontal position
      const startX = Math.random() * (containerWidth - blockSize * 4);
      const startY = -blockSize * 4 - (Math.random() * containerHeight * 0.5); // Start at varying heights above
      
      // Random rotation
      const rotation = Math.random() * 360;
      
      // Set initial position
      gsap.set(piece, { 
        x: startX, 
        y: startY,
        rotation: rotation,
        transformOrigin: 'center center',
        opacity: 0.9 // Slightly transparent for effect
      });
      
      // Random fall speed
      const fallDuration = 6 + Math.random() * 6; // Longer duration for slower fall (4-10 seconds)
      
      // Random rotation during fall
      const rotationAmount = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 180 + 90);
      
      // Animate falling with improved physics
      timeline.to(
        piece,
        {
          y: containerHeight + blockSize * 4,
          rotation: rotation + rotationAmount,
          ease: "power1.in", // Acceleration for more realistic physics
          duration: fallDuration,
          delay: i * 0.4, // Staggered start times
          opacity: (i % 3 === 0) ? 0.7 : 0.9, // Vary opacity for depth effect
          onComplete: () => {
            // Once a piece reaches the bottom, reset its position to the top
            const newStartX = Math.random() * (containerWidth - blockSize * 4);
            const newRotation = Math.random() * 360;
            gsap.set(piece, {
              x: newStartX,
              y: startY,
              rotation: newRotation,
              opacity: 0.9
            });
          },
        },
        i * 0.4
      );
      
      // Add a slight horizontal drift for some pieces
      if (i % 3 === 0) {
        const driftAmount = (Math.random() - 0.5) * blockSize * 8;
        timeline.to(
          piece,
          {
            x: `+=${driftAmount}`,
            duration: fallDuration,
            ease: "sine.inOut",
          },
          i * 0.4
        );
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isLoaded]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <motion.div
      ref={containerRef} 
      variants={containerVariants}
      initial="hidden"
      animate={animationControls}
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