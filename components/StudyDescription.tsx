import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function StudyDescription() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: custom * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <motion.div 
      ref={ref}
      style={{
        padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)',
        maxWidth: '48rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '1rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(26, 26, 26, 0.9) 100%)',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
      }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Accent line */}
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      
      {/* Subtle background pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 215, 0, 0.1) 10px, rgba(255, 215, 0, 0.1) 11px)`,
          pointerEvents: 'none'
        }}
      />
      
      <motion.div variants={itemVariants}>
        <h2 
          style={{
            fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)',
            lineHeight: '1.4',
            fontWeight: '600',
            marginBottom: '2rem',
            color: '#ffd700',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-inter)',
          }}
        >
          The Effects of Emotionally Sensitive Content on Tetris Performance
        </h2>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          fontSize: 'clamp(0.938rem, 2vw, 1rem)', 
          lineHeight: '1.7',
          color: 'rgba(255, 255, 255, 0.85)'
        }}
      >
        <motion.p variants={itemVariants}>
          <span style={{ 
            color: '#ffd700', 
            fontWeight: '600',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '0.5rem'
          }}>
            ABSTRACT
          </span>
          <br />
          This research study aims to understand how emotional stimuli affect performance in video games. More specifically, this study investigates how exposure to emotionally sensitive written content, such as depictions of violent intent, influence a player's ability to perform in Tetris.
        </motion.p>
        
        <motion.p variants={itemVariants}>
          This research is being conducted under the supervision of Prof. Thomas A. Daniel, Ph.D and Lydia Flagg. The researchers are interested in measuring whether these emotional interruptions impact reaction time, accuracy, or overall gameplay efficiency. By examining these effects, the study hopes to contribute to a better understanding of how emotional distractions influence cognitive and motor performance in gaming contexts.
        </motion.p>
        
        <motion.div 
          variants={itemVariants} 
          style={{ 
            marginTop: '1rem', 
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 215, 0, 0.2)',
          }}
        >
          <h3 
            style={{ 
              fontSize: 'clamp(1.063rem, 2.5vw, 1.188rem)',
              fontWeight: '600',
              color: '#ffd700',
              marginBottom: '1rem',
              letterSpacing: '-0.01em'
            }}
          >
            Study Participation Includes
          </h3>
          <ul style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '0.75rem',
            paddingLeft: 0,
            listStyle: 'none'
          }}>
            {['Non-invasive cognitive assessment', 
              'Pattern recognition evaluation', 
              'Spatial reasoning challenges', 
              'Decision-making under time constraints'].map((item, index) => (
              <motion.li 
                key={index} 
                custom={index}
                variants={listItemVariants}
                style={{
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '0.5em',
                  width: '6px',
                  height: '6px',
                  background: '#ffd700',
                  borderRadius: '50%',
                }} />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          style={{ 
            marginTop: '1rem', 
            fontSize: 'clamp(0.75rem, 1.8vw, 0.813rem)', 
            lineHeight: '1.5',
            color: 'rgba(255, 255, 255, 0.5)', 
            fontStyle: 'italic',
          }}
        >
          <p>
            * No mention of publication places as it hasn't been finalised yet.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
