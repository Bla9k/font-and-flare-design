
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: number;
  speed?: number;
}

export default function GlitchText({ 
  children, 
  className = '', 
  intensity = 0.1, 
  speed = 100 
}: GlitchTextProps) {
  const [glitchedText, setGlitchedText] = useState(children);
  const [isGlitching, setIsGlitching] = useState(false);

  const glitchChars = '!@#$%^&*()[]{}|;:,.<>?';
  
  const createGlitch = (text: string) => {
    return text
      .split('')
      .map(char => {
        if (/^[0-9a-zA-Z]+$/.test(char) && Math.random() < intensity) {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      })
      .join('');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const startGlitch = () => {
      setIsGlitching(true);
      let glitchCount = 0;
      
      interval = setInterval(() => {
        setGlitchedText(createGlitch(children));
        glitchCount++;
        
        if (glitchCount > Math.random() * 10 + 5) {
          setGlitchedText(children);
          setIsGlitching(false);
          clearInterval(interval);
          
          // Schedule next glitch
          setTimeout(startGlitch, Math.random() * 5000 + 2000);
        }
      }, speed);
    };

    // Initial delay before first glitch
    const initialTimeout = setTimeout(startGlitch, Math.random() * 3000 + 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [children, intensity, speed]);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={isGlitching ? {
        x: [0, -2, 2, -1, 1, 0],
        textShadow: [
          '0 0 0 transparent',
          '2px 0 0 #ff0000, -2px 0 0 #00ffff',
          '-2px 0 0 #ff0000, 2px 0 0 #00ffff',
          '0 0 0 transparent'
        ]
      } : {}}
      transition={{ duration: 0.1, repeat: isGlitching ? Infinity : 0 }}
    >
      {glitchedText}
      {isGlitching && (
        <>
          <span 
            className="absolute top-0 left-0 text-red-500 opacity-70"
            style={{ transform: 'translate(-1px, 0)' }}
          >
            {glitchedText}
          </span>
          <span 
            className="absolute top-0 left-0 text-cyan-500 opacity-70"
            style={{ transform: 'translate(1px, 0)' }}
          >
            {glitchedText}
          </span>
        </>
      )}
    </motion.span>
  );
}
