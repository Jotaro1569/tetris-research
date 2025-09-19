'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DutchParticipantPage() {
  return (
    <div className="container" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '4rem 1rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div 
        className="glass-panel"
        style={{
          padding: '3rem',
          width: '100%',
          maxWidth: '800px',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          backgroundColor: 'rgba(18, 18, 18, 0.7)',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h1 
          style={{ 
            fontSize: '2.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(to right, #ffd700, #ffb347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          Welcome, Dutch Participant
        </motion.h1>
        
        <motion.p 
          style={{ 
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '3rem',
            lineHeight: '1.6'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          This page will contain study instructions and your Tetris test soon.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        >
          <Link href="/">
            <motion.button
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'rgba(18, 18, 18, 0.8)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                borderRadius: '0.375rem',
                color: 'var(--gold, #ffd700)',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Homepage
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
} 