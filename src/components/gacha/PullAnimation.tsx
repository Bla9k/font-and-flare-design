
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Rarity } from "@/api/gachaService";

interface PullAnimationProps {
  rarity: 'standard' | 'sr' | 'ssr' | 'ur';
  onComplete: () => void;
}

export default function PullAnimation({ rarity, onComplete }: PullAnimationProps) {
  const [animationStep, setAnimationStep] = useState(1);
  
  // Animation timings
  useEffect(() => {
    // Step 1: Initial particles
    const step1 = setTimeout(() => setAnimationStep(2), 1000);
    
    // Step 2: Glowing orb
    const step2 = setTimeout(() => setAnimationStep(3), 2000);
    
    // Step 3: Crack
    const step3 = setTimeout(() => setAnimationStep(4), 3000);
    
    // Step 4: Reveal
    const step4 = setTimeout(() => {
      setAnimationStep(5);
      setTimeout(() => onComplete(), 1000);
    }, 4000);
    
    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
    };
  }, [onComplete]);
  
  // Get color scheme based on rarity
  const getColorScheme = () => {
    switch(rarity) {
      case 'ur':
        return {
          primary: 'gold',
          secondary: 'amber',
          particles: 'from-yellow-300 to-amber-600',
          glow: 'bg-yellow-500/30'
        };
      case 'ssr':
        return {
          primary: 'rainbow',
          secondary: 'purple',
          particles: 'from-purple-400 to-pink-600',
          glow: 'bg-violet-500/30'
        };
      case 'sr':
        return {
          primary: 'blue',
          secondary: 'cyan',
          particles: 'from-blue-400 to-cyan-600',
          glow: 'bg-blue-500/30'
        };
      default:
        return {
          primary: 'gray',
          secondary: 'white',
          particles: 'from-gray-300 to-slate-500',
          glow: 'bg-gray-500/20'
        };
    }
  };
  
  const colors = getColorScheme();
  
  // Generate random particles
  const particles = Array(rarity === 'ur' ? 40 : rarity === 'ssr' ? 30 : rarity === 'sr' ? 20 : 10)
    .fill(0)
    .map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 2 + 1,
    }));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <div className="relative w-72 h-80">
        {/* Background effects */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-3xl opacity-40 transition-all duration-1000",
          colors.glow,
          animationStep >= 2 && "scale-150 opacity-70",
          animationStep >= 3 && "scale-[2] opacity-90",
          animationStep >= 4 && "scale-[3] opacity-100"
        )} />
        
        {/* Floating particles */}
        {animationStep >= 1 && particles.map(particle => (
          <motion.div
            key={particle.id}
            className={cn(
              "absolute rounded-full bg-gradient-to-tr",
              colors.particles,
              rarity === 'ur' ? "mix-blend-screen" : "mix-blend-plus-lighter"
            )}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 0.5]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Central orb */}
        <motion.div 
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full",
            {
              "bg-gradient-to-r from-gray-300 to-gray-400": rarity === 'standard',
              "bg-gradient-to-r from-blue-400 to-cyan-300": rarity === 'sr',
              "bg-gradient-to-r from-purple-500 to-pink-500": rarity === 'ssr',
              "bg-gradient-to-r from-yellow-300 to-amber-500": rarity === 'ur',
            }
          )}
          animate={{
            scale: animationStep >= 2 ? [1, 1.2, 1] : 1,
            rotate: animationStep >= 2 ? [0, 180, 360] : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        >
          {/* Cracks */}
          {animationStep >= 3 && (
            <>
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-white"
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <motion.div 
                className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5 bg-white"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.div 
                className="absolute top-0 left-0 h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 1, repeat: 2 }}
              >
                <div className="absolute inset-0 rounded-full bg-white/50" />
              </motion.div>
            </>
          )}
        </motion.div>
        
        {/* Burst effect at reveal */}
        {animationStep >= 4 && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 0] }}
            transition={{ duration: 0.8 }}
          >
            <div className={cn(
              "w-40 h-40 rounded-full",
              {
                "bg-white/60": rarity === 'standard',
                "bg-blue-400/60": rarity === 'sr',
                "bg-purple-500/60": rarity === 'ssr',
                "bg-yellow-300/60": rarity === 'ur',
              }
            )} />
          </motion.div>
        )}
        
        {/* Rarity text reveal */}
        {animationStep >= 4 && (
          <motion.div
            className="absolute left-1/2 top-3/4 -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className={cn(
              "font-display text-4xl font-bold",
              {
                "text-gray-200": rarity === 'standard',
                "text-blue-400": rarity === 'sr',
                "text-purple-500": rarity === 'ssr',
                "text-yellow-300": rarity === 'ur',
              }
            )}>
              {rarity === 'ur' ? 'UR' : rarity === 'ssr' ? 'SSR' : rarity === 'sr' ? 'SR' : 'R'}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
