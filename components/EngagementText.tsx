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
  const [isChanging, setIsChanging] = useState(false);

  const componentRef = useRef(null);
  const isInView = useInView(componentRef, { once: true, amount: 0.3 });

  useEffect(() => {
    // Switch between taglines automatically
    const interval = setInterval(() => {
      setIsChanging(true);
      
      setTimeout(() => {
        setCurrentTagline(prev => 
          prev.id === taglines[0].id ? taglines[1] : taglines[0]
        );
        setIsChanging(false);
      }, 650); // Extended to allow for more complete exit animation
      
    }, 6000); // Switch every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Enhanced component animation variants with more fluid motion
  const componentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smoother motion
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };

  // Text animation variants for individual lines
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.7, 
        delay: custom * 0.2, 
        ease: [0.16, 1, 0.3, 1] // Spring-like curve for smoother text entrance
      }
    }),
    exit: { 
      opacity: 0, 
      y: -25, 
      filter: "blur(3px)",
      transition: { 
        duration: 0.6, 
        ease: [0.43, 0.13, 0.23, 0.96] 
      }
    }
  };

  // Container animation variants for when each tagline changes
  const taglineContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.12,
        delayChildren: 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      filter: "blur(4px)",
      transition: { 
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96] 
      }
    }
  };

  return (
    <motion.div 
      ref={componentRef}
      variants={componentVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{
        padding: '4rem 0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden' // Prevent any animation overflow
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTagline.id}
            variants={taglineContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
          >
            {currentTagline.lines.map((line, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={textVariants}
                className="gold-gradient-text"
                style={{
                  fontSize: '1.875rem',
                  lineHeight: '2.25rem',
                  fontWeight: 'bold',
                  transform: "perspective(1000px)", // Add perspective for 3D effects
                }}
                whileHover={{ 
                  scale: 1.03, 
                  transition: { duration: 0.2 },
                  textShadow: "0px 0px 8px rgba(255, 215, 0, 0.5)"
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