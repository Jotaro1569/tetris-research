import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

export default function ScrollIndicator() {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for the text
  const textVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      }
    }
  };

  // Animation variants for the chevron
  const chevronVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.34, 1.56, 0.64, 1] 
      }
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      bottom: '2.5rem', 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      pointerEvents: 'none'
    }}>
      <motion.div 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          width: 'fit-content',
          pointerEvents: 'auto'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ 
          y: -3, 
          transition: { duration: 0.2, ease: "easeOut" } 
        }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
      >
        <motion.span 
          variants={textVariants}
          style={{ 
            color: 'var(--gold)', 
            fontSize: '0.875rem', 
            marginBottom: '0.5rem', 
            fontWeight: 'medium',
            letterSpacing: '0.025em',
            textShadow: '0px 0px 15px rgba(255, 215, 0, 0.3)',
            textAlign: 'center'
          }}
        >
          Scroll to Continue
        </motion.span>
        <motion.div
          variants={chevronVariants}
          animate={{ 
            y: [0, 10, 0],
            filter: ["drop-shadow(0px 0px 0px rgba(255, 215, 0, 0.5))", "drop-shadow(0px 0px 8px rgba(255, 215, 0, 0.7))", "drop-shadow(0px 0px 0px rgba(255, 215, 0, 0.5))"],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            times: [0, 0.5, 1],
            ease: "easeInOut" 
          }}
          whileHover={{ 
            scale: 1.2, 
            transition: { duration: 0.2 } 
          }}
        >
          <FaChevronDown style={{ 
            color: 'var(--gold)', 
            fontSize: '1.5rem',
            filter: 'drop-shadow(0px 0px 4px rgba(255, 215, 0, 0.4))'
          }} />
        </motion.div>
      </motion.div>
    </div>
  );
} 