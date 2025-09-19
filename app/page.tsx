'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TetrisAnimation from '../components/TetrisAnimation';
import StudyDescription from '../components/StudyDescription';
import EngagementText from '../components/EngagementText';
import ParticipationGateway from '../components/ParticipationGateway';
import ScrollIndicator from '../components/ScrollIndicator';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splashComplete, setSplashComplete] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start', 'end']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  useEffect(() => {
    // Show splash screen for 3 seconds before allowing scroll
    const timer = setTimeout(() => {
      setSplashComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Splash Screen/Animation */}
      <motion.section 
        style={{ 
          height: '100vh', 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          opacity,
          scale,
          y
        }}
      >
        <TetrisAnimation />
        
        <motion.div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(18, 18, 18, 0.7)',
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.h1 
            className="gold-gradient-text"
            style={{
              fontSize: '3rem',
              lineHeight: '1',
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'relative'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.span
              style={{ 
                display: 'block',
                marginBottom: '1rem'
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 1.6, 
                  duration: 0.8
                }
              }}
            >
              TETRIS
            </motion.span>
            
            <motion.span 
              style={{ 
                fontSize: '1.875rem',
                display: 'block',
                paddingTop: '0.5rem'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 1.8, 
                  duration: 0.8
                }
              }}
            >
              Cognitive Study
              
              {/* Simple underline with hover effect */}
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  height: '2px',
                  background: 'rgba(255, 215, 0, 0.8)',
                  borderRadius: '1px'
                }}
                initial={{ width: 0 }}
                animate={{ 
                  width: '80%',
                  transition: { 
                    delay: 2.2, 
                    duration: 0.8
                  }
                }}
                whileHover={{ 
                  width: '100%',
                  transition: { duration: 0.3 }
                }}
              />
            </motion.span>
          </motion.h1>
        </motion.div>
        
        {splashComplete && <ScrollIndicator />}
      </motion.section>

      {/* Study Description */}
      <section style={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
        padding: '5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div className="tetris-container">
          <StudyDescription />
        </div>
      </section>

      {/* Engagement Text */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--background)',
      }}>
        <EngagementText />
      </section>

      {/* Participation Gateway */}
      <section style={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
      }}>
        <ParticipationGateway />
      </section>
    </div>
  );
}
