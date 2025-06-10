
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PullAnimationProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function PullAnimation({ isActive, onComplete }: PullAnimationProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowText(true);
      const timer = setTimeout(() => {
        setShowText(false);
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'var(--theme-background)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--theme-primary)' }}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  opacity: 0
                }}
                animate={{
                  y: -50,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Pull Text */}
          <AnimatePresence>
            {showText && (
              <motion.div
                className="text-center z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <motion.h2
                  className="text-6xl font-display font-bold mb-4"
                  style={{ color: 'var(--theme-primary)' }}
                  animate={{
                    scale: [1, 1.1, 1],
                    textShadow: [
                      '0 0 10px var(--theme-primary)',
                      '0 0 30px var(--theme-primary)',
                      '0 0 10px var(--theme-primary)'
                    ]
                  }}
                  transition={{ duration: 1, repeat: 1 }}
                >
                  SUMMONING...
                </motion.h2>
                <motion.div
                  className="text-xl font-digital"
                  style={{ color: 'var(--theme-text-muted)' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  準備中...
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
