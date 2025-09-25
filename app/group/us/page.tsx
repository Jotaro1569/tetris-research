'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function USParticipantPage() {
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
          Welcome, US Participant
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
          To participate in the study, please click the below link
        </motion.p>
        
        {/* Research Page Button */}
        <motion.div
          style={{ marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        >
          <a 
            href="https://survey.alchemer.com/s3/8364376/2f0e95c27f8e" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <motion.button
              style={{
                padding: '1rem 2.5rem',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 179, 71, 0.1) 100%)',
                border: '2px solid rgba(255, 215, 0, 0.6)',
                borderRadius: '0.5rem',
                color: '#ffd700',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0px 8px 25px rgba(255, 215, 0, 0.3)",
                borderColor: 'rgba(255, 215, 0, 0.8)'
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 179, 71, 0.2) 100%)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 179, 71, 0.1) 100%)';
              }}
            >
              <span>Participate</span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </motion.button>
          </a>
        </motion.div>
        
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