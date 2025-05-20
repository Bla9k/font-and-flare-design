
import { ReactNode, useEffect } from "react";
import BottomNav from "./BottomNav";

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
    <div id="main-container" className="min-h-screen flex flex-col relative overflow-hidden">
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
      
      <main className="flex-1 min-h-screen pb-24">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
