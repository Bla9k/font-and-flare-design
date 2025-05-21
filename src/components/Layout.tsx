
import { ReactNode, useEffect } from "react";
import BottomNav from "./BottomNav";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Add a random glitch effect to the page occasionally
  useEffect(() => {
    const createGlitchEffect = () => {
      const glitchChance = Math.random();
      if (glitchChance > 0.995) {  // Very rare glitch
        const container = document.getElementById('main-container');
        if (container) {
          container.classList.add('animate-glitch');
          setTimeout(() => {
            container.classList.remove('animate-glitch');
          }, 150);
        }
      }
    };
    
    const glitchInterval = setInterval(createGlitchEffect, 500);
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <motion.div 
      id="main-container" 
      className="min-h-screen flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Visual effects for cyberpunk feel */}
      <div className="scanline"></div>
      <div className="noise"></div>
      
      {/* Enhanced animated starry background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-anime-dark">
          <div id="stars-container" className="h-full w-full opacity-70">
            {/* Grid overlay for cyberpunk effect */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            {/* Horizontal scan lines */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={`h-line-${i}`}
                  className="absolute h-[1px] w-full bg-anime-cyberpunk-blue/20"
                  style={{ 
                    top: `${10 * i}%`, 
                    animationDelay: `${0.5 * i}s`,
                    opacity: 0.1 + (i * 0.01)
                  }}
                ></div>
              ))}
            </div>
            
            {/* Vertical scan lines */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={`v-line-${i}`}
                  className="absolute w-[1px] h-full bg-anime-red/20"
                  style={{ 
                    left: `${10 * i}%`, 
                    animationDelay: `${0.3 * i}s`,
                    opacity: 0.1 + (i * 0.01)
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Casper Logo in top left */}
      <div className="fixed top-5 left-5 z-50">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative">
            <div className="text-anime-red font-display text-2xl tracking-[0.3em] glitch-effect">CASPER</div>
            <div className="absolute -top-1 -left-1 text-anime-cyberpunk-blue opacity-70 text-2xl tracking-[0.3em] glitch-text">CASPER</div>
          </div>
          <div className="h-0.5 w-full bg-anime-red/50 mt-1"></div>
          <div className="text-xs font-digital text-gray-400 tracking-[0.2em] mt-1">アニメパラダイス</div>
        </motion.div>
      </div>

      {/* Japanese Typography Elements */}
      <div className="fixed top-0 right-0 w-16 h-full flex flex-col justify-between items-center z-10 pointer-events-none">
        <motion.div 
          className="writing-vertical text-anime-red/30 font-digital text-lg tracking-widest mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          カスパー
        </motion.div>
        <motion.div 
          className="writing-vertical text-anime-cyberpunk-blue/30 font-digital text-lg tracking-widest mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          アニメ
        </motion.div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-16 h-full flex flex-col justify-between items-center z-10 pointer-events-none">
        <motion.div 
          className="writing-vertical text-anime-cyberpunk-blue/30 font-digital text-lg tracking-widest mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          日本語
        </motion.div>
        <motion.div 
          className="writing-vertical text-anime-red/30 font-digital text-lg tracking-widest mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          漫画
        </motion.div>
      </div>
      
      <main className="flex-1 min-h-screen pb-20 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <BottomNav />
    </motion.div>
  );
}
