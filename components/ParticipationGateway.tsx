import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation';
import './participation.css';

export default function ParticipationGateway() {
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();

  const controls = useAnimation();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const gifRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const componentRootRef = useRef<HTMLDivElement>(null);
  const helperTextRef = useRef<HTMLParagraphElement>(null);

  const isCardsContainerInView = useInView(cardsContainerRef, { once: true, amount: 0.1 });
  const isComponentRootInView = useInView(componentRootRef, { once: true, amount: 0.1 });
  const isHelperTextInView = useInView(helperTextRef, { once: true, amount: 0.8 });

  useEffect(() => {
    if (isComponentRootInView) controls.start("visible");
  }, [isComponentRootInView, controls]);

  // Debug logging - remove in production
  useEffect(() => {
    console.log('reCAPTCHA site key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
    console.log('Site key length:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.length);
  }, []);

  const groups = [
    { code: 'US', label: 'American', desc: 'Participants from the United States' },
    { code: 'IN', label: 'Indian', desc: 'Participants from India' },
    { code: 'ID', label: 'Indonesia', desc: 'Participants from Indonesia' },
    { code: 'NL', label: 'Dutch', desc: 'Participants from the Netherlands' }
  ];

  // ===== CAPTCHA Verification (Client-side only) =====
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    setCaptchaVerified(!!token);
    
    if (!token) {
      // Reset when captcha is cleared/expired
      setError(null);
    } else {
      setError(null);
      console.log('CAPTCHA completed successfully');
    }
  };

  // ===== Handle group selection =====
  const handleGroupSelection = async (code: string) => {
    if (!captchaVerified || !captchaToken) {
      setError('Please complete CAPTCHA verification first.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch('/api/verify-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          selectedGroup: code, 
          captchaToken: captchaToken 
        })
      });

      const data = await res.json();
      console.log('Location verification response:', data);

      if (data.error) {
        // CAPTCHA token was consumed and failed - need to reset
        if (data.error.includes('CAPTCHA') || data.error.includes('verification failed')) {
          setCaptchaVerified(false);
          setCaptchaToken(null);
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
        }
        setError(data.error);
      } else if (data.allowed) {
        router.push(`/group/${code.toLowerCase()}`);
      } else {
        // Location verification failed but CAPTCHA was consumed
        // Reset CAPTCHA so user can try again
        setCaptchaVerified(false);
        setCaptchaToken(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setError(data.message || `You can only participate in the study group for your country. Your detected country: ${data.userCountry || 'unknown'}`);
      }
    } catch (err) {
      console.error('Location verification error:', err);
      // Reset CAPTCHA on network errors too
      setCaptchaVerified(false);
      setCaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setError('Error verifying location. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // ===== Animation variants =====
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.1, 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1.0] 
      } 
    }
  };

  const cardVariants = { 
    hidden: { opacity: 0, y: 40 }, 
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: [0.25, 0.1, 0.25, 1.0] 
      } 
    } 
  };

  const headingVariants = { 
    hidden: { opacity: 0, x: -50 }, 
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    } 
  };

  const gifVariants = { 
    hidden: { opacity: 0, y: -30, scale: 0.95 }, 
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1.2, 
      transition: { 
        duration: 0.8, 
        ease: [0.34, 1.56, 0.64, 1] 
      } 
    }
  };

  const successVariants = { 
    hidden: { opacity: 0, scale: 0.9 }, 
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      } 
    }
  };

  return (
    <motion.div
      ref={componentRootRef}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            when: "beforeChildren",
            staggerChildren: 0.2
          }
        }
      }}
      className="container"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 0' }}
    >
      {/* GIF */}
      <motion.div 
        ref={gifRef} 
        className="glass-panel" 
        style={{
          height: '250px',
          maxWidth: '450px',
          margin: '0 auto 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          backgroundColor: 'rgba(18, 18, 18, 0.7)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0.75rem'
        }}
        variants={gifVariants}
      >
        <motion.img 
          src="/Participate-in-Research.gif" 
          alt="Participant Group Demo" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '0.75rem'
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.div>

      <motion.h2 
        ref={headingRef} 
        className="participant-header" 
        variants={headingVariants}
      >
        Select Your Participant Group
      </motion.h2>

      <AnimatePresence mode="wait">
        {!captchaVerified ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="captcha-container"
          >
            <motion.div
              className="glass-panel"
              style={{
                padding: '2rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}
              whileHover={{ boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3
                style={{
                  fontSize: '1.25rem',
                  marginBottom: '1.5rem',
                  color: 'var(--gold)'
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Please verify you&apos;re human
              </motion.h3>
              <motion.div
                style={{ display: 'flex', justifyContent: 'center' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="recaptcha-wrapper">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={handleCaptchaChange}
                    theme="dark"
                  />
                </div>
              </motion.div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#ff6b6b',
                  textAlign: 'center'
                }}
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={successVariants} 
            initial="hidden" 
            animate="visible" 
            className="verification-success"
          >
            <motion.div
              className="glass-panel"
              style={{
                padding: '0.75rem 1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                maxWidth: 'fit-content',
                margin: '0 auto 2rem auto',
                borderColor: 'rgba(0, 200, 0, 0.4)'
              }}
              whileHover={{
                boxShadow: "0px 0px 10px rgba(0, 200, 0, 0.3)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: '#00c800' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: [0, 15, -5, 0] }}
                transition={{ duration: 0.5, times: [0, 0.6, 0.8, 1], ease: "easeOut" }}
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </motion.svg>
              <motion.span
                style={{ color: '#00c800' }}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Verification successful
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state for group selection */}
      {isVerifying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '0.5rem',
            color: 'var(--gold)',
            textAlign: 'center'
          }}
        >
          Verifying your location...
        </motion.div>
      )}

      {/* Error display for group selection */}
      {error && captchaVerified && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '0.5rem',
            color: '#ff6b6b',
            textAlign: 'center'
          }}
        >
          {error}
        </motion.div>
      )}

      {/* Group cards */}
      <motion.div
        ref={cardsContainerRef}
        className="participant-container"
        variants={containerVariants}
        initial="hidden"
        animate={isCardsContainerInView ? "visible" : "hidden"}
      >
        {groups.map(({ code, label, desc }, index) => (
          <motion.div
            key={code}
            className="participant-card"
            variants={cardVariants}
            custom={index}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
              boxShadow: "0px 0px 20px rgba(250, 204, 21, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="participant-card-inner">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <motion.h2
                  className="participant-code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                >
                  {code}
                </motion.h2>
                <motion.p
                  className="participant-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                >
                  {label}
                </motion.p>
                <motion.p
                  className="participant-desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                >
                  {desc}
                </motion.p>
              </motion.div>
              <motion.button
                onClick={() => handleGroupSelection(code)}
                className={`participant-button ${!captchaVerified ? 'disabled' : ''}`}
                disabled={!captchaVerified || isVerifying}
                aria-disabled={!captchaVerified || isVerifying}
                whileHover={!captchaVerified || isVerifying ? {} : {
                  scale: 1.05,
                  boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.5)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={!captchaVerified || isVerifying ? {} : { scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
              >
                {isVerifying ? 'Verifying...' : 'Begin Study'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!captchaVerified && (
        <motion.p
          ref={helperTextRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHelperTextInView ? {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
          } : { opacity: 0, y: 20 }}
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.5)',
            fontStyle: 'italic'
          }}
        >
          Complete the CAPTCHA verification to enable participation options
        </motion.p>
      )}
    </motion.div>
  );
}