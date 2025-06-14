
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlitchText from './GlitchText';
import ParticleSystem from './ParticleSystem';

interface ThemeChangeAnimationProps {
  themeName: string;
  show: boolean;
  onComplete: () => void;
}

const themeDisplayNames: { [key: string]: string } = {
  'persona': 'PERSONA UNIVERSE',
  'dark': 'DARK CYBERPUNK',
  'light': 'LIGHT MODE',
  'sakura': '桜 SAKURA',
  'neon': 'NEON CITY',
  'sunset': 'ANIME SUNSET'
};

export default function ThemeChangeAnimation({ 
  themeName, 
  show, 
  onComplete 
}: ThemeChangeAnimationProps) {
  const [stage, setStage] = useState(0);
  const displayName = themeDisplayNames[themeName] || themeName.toUpperCase();
  const isPersona = themeName === 'persona';

  useEffect(() => {
    if (!show) return;

    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 800),
      setTimeout(() => setStage(3), 1500),
      setTimeout(() => {
        setStage(0);
        onComplete();
      }, 2500)
    ];

    return () => timers.forEach(clearTimeout);
  }, [show, onComplete]);

  if (!show && stage === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background Overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ 
              background: isPersona 
                ? 'radial-gradient(ellipse at center, rgba(138, 43, 226, 0.8), rgba(10, 10, 15, 0.9))'
                : 'rgba(0, 0, 0, 0.8)' 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Persona Particles */}
          {isPersona && stage >= 1 && (
            <div className="absolute inset-0">
              <ParticleSystem
                particleCount={150}
                colors={['#FFD700', '#FF4500', '#8A2BE2', '#4B0082']}
                speed={2}
                size={4}
              />
            </div>
          )}

          {/* Scan Lines */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px w-full"
                style={{
                  top: `${12.5 * i}%`,
                  background: isPersona 
                    ? 'linear-gradient(90deg, transparent, #FFD700, transparent)'
                    : 'linear-gradient(90deg, transparent, #00F0FF, transparent)'
                }}
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ 
                  x: stage >= 1 ? '100%' : '-100%',
                  opacity: stage >= 1 ? 0.6 : 0
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.1,
                  ease: 'linear'
                }}
              />
            ))}
          </div>

          {/* Central Content */}
          <div className="relative z-10 text-center">
            {/* Theme Name */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: stage >= 2 ? 1 : 0,
                opacity: stage >= 2 ? 1 : 0
              }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="mb-4"
            >
              <h1 
                className={`text-6xl font-bold ${
                  isPersona ? 'font-persona-title' : 'font-display'
                } tracking-wider`}
                style={{ 
                  color: isPersona ? '#FFD700' : '#00F0FF',
                  textShadow: isPersona 
                    ? '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)'
                    : '0 0 30px rgba(0, 240, 255, 0.8)'
                }}
              >
                <GlitchText intensity={isPersona ? 0.1 : 0.05}>
                  {displayName}
                </GlitchText>
              </h1>
            </motion.div>

            {/* Subtitle for Persona */}
            {isPersona && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: stage >= 2 ? 1 : 0,
                  y: stage >= 2 ? 0 : 20
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl font-persona-ui text-purple-300 tracking-widest"
              >
                The Ultimate Supernatural Experience
              </motion.div>
            )}

            {/* Activation Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: stage >= 3 ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="mt-8 text-sm font-mono tracking-wider"
              style={{ 
                color: isPersona ? '#A0A0B0' : '#888888'
              }}
            >
              THEME ACTIVATED
            </motion.div>
          </div>

          {/* Persona Mystic Symbols */}
          {isPersona && stage >= 2 && (
            <div className="absolute inset-0 pointer-events-none">
              {['♠', '♦', '♣', '♥'].map((symbol, i) => (
                <motion.div
                  key={symbol}
                  className="absolute text-4xl opacity-30"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    color: '#FFD700'
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [0, 180, 360],
                    opacity: [0, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2
                  }}
                >
                  {symbol}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
