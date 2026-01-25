import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

type Tagline = {
  id: number;
  lines: string[];
};

const taglines: Tagline[] = [
  {
    id: 1,
    lines: [
      "Challenge your focus.",
      "Test your limits.",
      "Contribute to science."
    ]
  },
  {
    id: 2,
    lines: [
      "Want to see how you stack up?",
      "Play. React. Discover."
    ]
  }
];

export default function EngagementText() {
  const [currentTagline, setCurrentTagline] = useState<Tagline>(taglines[0]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [revealedBlocks, setRevealedBlocks] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef(null);
  const isInView = useInView(componentRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline(prev => 
        prev.id === taglines[0].id ? taglines[1] : taglines[0]
      );
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    
    // Calculate which block is being revealed
    const blockX = Math.floor(x / 60);
    const blockY = Math.floor(y / 60);
    const blockKey = `${blockX}-${blockY}`;
    
    setRevealedBlocks(prev => new Set(prev).add(blockKey));
  };

  const componentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1.0],
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: custom * 0.2, ease: [0.16, 1, 0.3, 1] }
    }),
    exit: { 
      opacity: 0, 
      y: -25, 
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  const taglineContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1, duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  // Generate grid of tetris blocks
  const generateBlocks = () => {
    if (!containerRef.current) return [];
    
    const blocks = [];
    const cols = Math.ceil(window.innerWidth / 60);
    const rows = Math.ceil(window.innerHeight / 60);
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const blockKey = `${x}-${y}`;
        const isRevealed = revealedBlocks.has(blockKey);
        
        // Calculate distance from mouse for reveal effect
        const blockCenterX = x * 60 + 30;
        const blockCenterY = y * 60 + 30;
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - blockCenterX, 2) + 
          Math.pow(mousePosition.y - blockCenterY, 2)
        );
        const revealRadius = 150;
        const opacity = isRevealed || distance < revealRadius 
          ? Math.max(0, 1 - distance / revealRadius) * 0.25
          : 0;
        
        blocks.push(
          <div
            key={blockKey}
            style={{
              position: 'absolute',
              left: x * 60,
              top: y * 60,
              width: 50,
              height: 50,
              opacity: opacity,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          >
            <svg width="50" height="50" viewBox="0 0 50 50">
              <defs>
                <linearGradient id={`grad-${blockKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ffed4e', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#b8860b', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              
              {/* Main block */}
              <rect
                width="48"
                height="48"
                x="1"
                y="1"
                fill={`url(#grad-${blockKey})`}
                stroke="#ffd700"
                strokeWidth="1"
                rx="3"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))'
                }}
              />
              
              {/* Simple highlight */}
              <rect
                width="20"
                height="20"
                x="6"
                y="6"
                fill="rgba(255, 255, 255, 0.3)"
                rx="2"
              />
            </svg>
          </div>
        );
      }
    }
    
    return blocks;
  };

  return (
    <motion.div 
      ref={componentRef}
      variants={componentVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{
        padding: '0',
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        background: '#121212',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Interactive background */}
      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#121212',
        }}
      >
        {generateBlocks()}
      </div>
      
      {/* Content */}
      <div style={{ textAlign: 'center', maxWidth: '90%', position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTagline.id}
            variants={taglineContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.8rem, 3vw, 1.2rem)' }}
          >
            {currentTagline.lines.map((line, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={textVariants}
                style={{
                  fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                  lineHeight: '1.3',
                  fontWeight: '700',
                  color: '#ffd700',
                  textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                  letterSpacing: '-0.02em',
                }}
              >
                {line}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

