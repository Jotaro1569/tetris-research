'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedClientWrapperProps {
  children: React.ReactNode;
}

export default function AnimatedClientWrapper({ children }: AnimatedClientWrapperProps) {
  // Enhanced page transition animation
  const pageVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1.0],
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.05
      } 
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: { 
        duration: 0.5, 
        ease: [0.43, 0.13, 0.23, 0.96] 
      } 
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'relative',
        height: '100%',
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
} 