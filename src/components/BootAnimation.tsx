
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BootAnimation() {
  const [showAnimation, setShowAnimation] = useState(true);
  
  useEffect(() => {
    // Check if we've shown the animation before
    const hasSeenAnimation = localStorage.getItem('seen-boot-animation');
    
    if (hasSeenAnimation) {
      setShowAnimation(false);
      return;
    }
    
    // Hide animation after 4 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
      localStorage.setItem('seen-boot-animation', 'true');
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!showAnimation) return null;
  
  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed inset-0 z-[100] bg-anime-dark flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 3.5 }}
        >
          <div className="relative">
            {/* Glitch lines */}
            <motion.div 
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={`h-line-${i}`}
                  className="absolute h-[1px] w-full bg-anime-cyberpunk-blue/60"
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 1, delay: 1 + (i * 0.2), ease: 'linear' }}
                  style={{ top: `${20 * i}%` }}
                />
              ))}
            </motion.div>
            
            {/* Logo animation */}
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div 
                className="text-anime-red font-display text-4xl tracking-[0.3em] mb-2"
                animate={{ 
                  opacity: [0, 1, 0.5, 1],
                  textShadow: [
                    "0 0 5px rgba(239,68,68,0)", 
                    "0 0 15px rgba(239,68,68,0.7)", 
                    "0 0 5px rgba(239,68,68,0.3)", 
                    "0 0 20px rgba(239,68,68,0.8)"
                  ]
                }}
                transition={{ duration: 2, times: [0, 0.4, 0.5, 1] }}
              >
                CASPER
              </motion.div>
              
              <motion.div 
                className="h-0.5 w-full bg-anime-red/50 mb-2"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 1 }}
              />
              
              <motion.div 
                className="text-sm font-digital text-gray-400 tracking-[0.2em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ duration: 1.5, delay: 1.5, times: [0, 0.4, 0.6, 1] }}
              >
                アニメパラダイス
              </motion.div>
              
              <motion.div 
                className="mt-8 text-xs font-digital text-anime-cyberpunk-blue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.3 }}
              >
                INITIALIZING SYSTEMS...
              </motion.div>
              
              <motion.div 
                className="mt-2 h-1 w-40 bg-anime-gray overflow-hidden rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 2.5 }}
              >
                <motion.div 
                  className="h-full bg-anime-cyberpunk-blue"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 2.5 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
