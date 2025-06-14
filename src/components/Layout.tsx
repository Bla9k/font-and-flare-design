
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import BootAnimation from "./BootAnimation";
import VelvetRoom from "./effects/VelvetRoom";
import ParticleSystem from "./effects/ParticleSystem";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isMobile = useIsMobile();
  const [showLogo, setShowLogo] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('dark');
  
  // Detect current theme
  useEffect(() => {
    const detectTheme = () => {
      const bodyClasses = document.body.className;
      const themeMatch = bodyClasses.match(/theme-(\w+)/);
      if (themeMatch) {
        setCurrentTheme(themeMatch[1]);
      }
    };
    
    detectTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);
  
  const isPersonaTheme = currentTheme === 'persona';
  
  // Hide logo on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowLogo(false);
      } else {
        setShowLogo(true);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
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

  const LayoutContent = ({ children }: { children: ReactNode }) => {
    if (isPersonaTheme) {
      return (
        <VelvetRoom intensity="medium" className="min-h-screen">
          {children}
        </VelvetRoom>
      );
    }
    return <>{children}</>;
  };

  return (
    <motion.div 
      id="main-container" 
      className="min-h-screen flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BootAnimation />
      
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
      
      {/* Casper Logo in top left - Hide on scroll */}
      {isHomePage && (
        <AnimatePresence>
          {showLogo && (
            <motion.div 
              className="fixed top-5 left-5 z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" title="CASPER v1.0.0">
                  <div className={`font-display text-2xl tracking-[0.3em] ${
                    isPersonaTheme ? 'text-anime-red font-persona-title persona-text-glow' : 'text-anime-red animate-text-flicker'
                  }`}>
                    CASPER
                  </div>
                  <div className="absolute top-full left-0 w-full bg-anime-dark/80 p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <span className={`text-xs text-anime-cyberpunk-blue ${
                      isPersonaTheme ? 'font-persona-ui' : 'font-digital'
                    }`}>
                      v1.0.0
                    </span>
                  </div>
                </div>
                <div className="h-0.5 w-full bg-anime-red/50 mt-1"></div>
                <div className={`text-xs text-gray-400 tracking-[0.2em] mt-1 ${
                  isPersonaTheme ? 'font-persona-ui' : 'font-digital font-jp'
                }`}>
                  {isPersonaTheme ? 'ペルソナ・ユニバース' : 'アニメパラダイス'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Enhanced Japanese Typography Elements - Different for Persona */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {isPersonaTheme ? (
          // Persona-specific floating elements
          <>
            <motion.div 
              className="absolute top-1/4 right-8 writing-vertical text-anime-red/15 font-persona-title font-black text-9xl tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4, y: [0, -30, 0], rotateY: [0, 5, 0] }}
              transition={{ 
                opacity: { delay: 1.3, duration: 1 },
                y: { repeat: Infinity, duration: 15, ease: "easeInOut" },
                rotateY: { repeat: Infinity, duration: 20, ease: "easeInOut" }
              }}
            >
              ペルソナ
            </motion.div>
            
            <motion.div 
              className="absolute bottom-1/3 left-12 writing-vertical text-purple-500/20 font-persona-title font-black text-8xl tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5, y: [0, 25, 0], scale: [1, 1.1, 1] }}
              transition={{ 
                opacity: { delay: 1.5, duration: 1 },
                y: { repeat: Infinity, duration: 18, ease: "easeInOut" },
                scale: { repeat: Infinity, duration: 12, ease: "easeInOut" }
              }}
            >
              アルカナ
            </motion.div>

            <motion.div 
              className="absolute top-16 left-1/2 transform -translate-x-1/2 text-yellow-500/15 font-persona-title font-black text-7xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6, scale: [1, 1.15, 1], rotateZ: [0, 2, 0] }}
              transition={{ 
                opacity: { delay: 0.7, duration: 1 },
                scale: { repeat: Infinity, duration: 14, ease: "easeInOut" },
                rotateZ: { repeat: Infinity, duration: 25, ease: "easeInOut" }
              }}
            >
              CASPER
            </motion.div>
          </>
        ) : (
          // Original cyberpunk elements
          <>
            <motion.div 
              className="absolute top-1/3 right-5 writing-vertical text-anime-red/20 font-jp font-black text-8xl tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, y: [0, -20, 0] }}
              transition={{ 
                opacity: { delay: 1.3, duration: 1 },
                y: { repeat: Infinity, duration: 10, ease: "easeInOut" }
              }}
            >
              サイバー
            </motion.div>
            
            <motion.div 
              className="absolute bottom-1/4 left-10 writing-vertical text-anime-cyberpunk-blue/20 font-jp font-black text-8xl tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, y: [0, 20, 0] }}
              transition={{ 
                opacity: { delay: 1.5, duration: 1 },
                y: { repeat: Infinity, duration: 12, ease: "easeInOut" }
              }}
            >
              パンク
            </motion.div>

            <motion.div 
              className="absolute top-10 left-1/2 transform -translate-x-1/2 text-anime-red/10 font-jp font-black text-9xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3, scale: [1, 1.05, 1] }}
              transition={{ 
                opacity: { delay: 0.7, duration: 1 },
                scale: { repeat: Infinity, duration: 8, ease: "easeInOut" }
              }}
            >
              アニメ
            </motion.div>

            <motion.div 
              className="absolute bottom-20 right-1/4 text-anime-cyberpunk-blue/15 font-jp font-black text-7xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5, rotate: [-1, 1, -1] }}
              transition={{ 
                opacity: { delay: 1.2, duration: 1 },
                rotate: { repeat: Infinity, duration: 15, ease: "easeInOut" }
              }}
            >
              カスパー
            </motion.div>
          </>
        )}
      </div>
      
      <main className="flex-1 min-h-screen pb-20 z-10">
        <LayoutContent>
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
        </LayoutContent>
      </main>
      
      <BottomNav />
    </motion.div>
  );
}
