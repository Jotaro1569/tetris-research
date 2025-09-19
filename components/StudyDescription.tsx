import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function StudyDescription() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
        when: "beforeChildren",
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, rotateY: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: { 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1],
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + (custom * 0.03),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10, scale: 0.96 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: custom * 0.06,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleText = "The Effects of Emotionally Sensitive Content on Tetris Performance";
  const titleLetters = titleText.split("");

  return (
    <motion.div 
      ref={ref}
      className="glass-panel"
      style={{
        padding: '2rem',
        maxWidth: '48rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '0.75rem',
        position: 'relative',
        overflow: 'visible',
        marginBottom: '1.5rem'
      }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{
        boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.15)",
        transition: { duration: 0.5 }
      }}
    >
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.08), transparent 60%)',
          opacity: 0,
          borderRadius: '0.75rem',
        }}
        animate={{ 
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0.8
        }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />
      
      <motion.h2 
        variants={titleVariants}
        style={{
          fontSize: '1.2rem',
          lineHeight: '2rem',
          fontWeight: 'bold',
          marginBottom: '1.8rem',
          transformOrigin: 'left',
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
          paddingBottom: '0.3rem'
        }}
      >
        {titleLetters.map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={letterVariants}
            className={char !== ' ' ? 'gold-gradient-text' : ''}
            style={{ 
              display: 'inline-block', 
              marginRight: char === ' ' ? '0.4em' : '0em',
              position: 'relative',
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)'
            }}
            whileHover={{ 
              y: -2, 
              scale: 1.2,
              transition: { duration: 0.2 } 
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
        
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            height: '2px', 
            background: 'linear-gradient(to right, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0.3))'
          }}
          initial={{ width: 0 }}
          animate={isInView ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.h2>
      
      <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '0.875rem', lineHeight: '1.25rem' }}>
        <motion.p 
          variants={itemVariants}
          whileHover={{ 
            x: 3, 
            transition: { duration: 0.2 } 
          }}
          style={{ lineHeight: '1.4rem' }}
        >
          <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>ABSTRACT:</span> This research study aims to understand how emotional stimuli affect performance in video games. More specifically, this study investigates how exposure to emotionally sensitive written content, such as depictions of violent intent, influence a player’s ability to perform in Tetris. 

        </motion.p>
        
        <motion.p 
          variants={itemVariants}
          whileHover={{ 
            x: 3, 
            transition: { duration: 0.2 } 
          }}
          style={{ lineHeight: '1.4rem' }}
        >
          This research is being conducted under the supervision of Prof. Thomas A. Daniel, Ph.D and Lydia Flagg.
          The researchers are interested in measuring whether these emotional interruptions impact reaction time, accuracy, or overall gameplay efficiency. By examining these effects, the study hopes to contribute to a better understanding of how emotional distractions influence cognitive and motor performance in gaming contexts.
        </motion.p>
        
        <motion.div 
          variants={itemVariants} 
          style={{ 
            marginTop: '1rem', 
            borderTop: '1px solid rgba(255, 215, 0, 0.3)', 
            paddingTop: '1rem',
            position: 'relative'
          }}
        >
          <motion.h3 
            variants={titleVariants}
            style={{ 
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              fontWeight: 'bold',
              color: 'var(--gold-light)',
              marginBottom: '0.75rem',
            }}
          >
            Study Participation Includes:
          </motion.h3>
          <motion.ul variants={itemVariants} style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Non-invasive cognitive assessment', 
              'Pattern recognition evaluation', 
              'Spatial reasoning challenges', 
              'Decision-making under time constraints'].map((item, index) => (
              <motion.li 
                key={index} 
                custom={index}
                variants={listItemVariants}
                whileHover={{ 
                  x: 3, 
                  color: 'rgba(255, 255, 255, 0.9)',
                  transition: { duration: 0.2 } 
                }}
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        
        <motion.div 
          variants={footerVariants} 
          style={{ 
            marginTop: '1rem', 
            fontSize: '0.75rem', 
            lineHeight: '1.2rem',
            color: '#9ca3af', 
            fontStyle: 'italic',
            position: 'relative'
          }}
        >
     
          <motion.p 
            style={{ marginTop: '0.5rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            * No mention of publication places as it hasnt been finalised yet.
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 