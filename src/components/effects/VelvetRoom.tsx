
import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import ParticleSystem from './ParticleSystem';

interface VelvetRoomProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export default function VelvetRoom({ 
  children, 
  intensity = 'medium',
  className = '' 
}: VelvetRoomProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getIntensityConfig = () => {
    switch (intensity) {
      case 'low':
        return { particles: 30, glowOpacity: 0.1, parallaxStrength: 2 };
      case 'high':
        return { particles: 120, glowOpacity: 0.4, parallaxStrength: 8 };
      default:
        return { particles: 60, glowOpacity: 0.2, parallaxStrength: 5 };
    }
  };

  const config = getIntensityConfig();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 animate-velvet-room-glow"
          style={{
            transform: `translate(${mousePosition.x / config.parallaxStrength}px, ${mousePosition.y / config.parallaxStrength}px)`
          }}
        />
        
        {/* Floating Geometric Shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 12)}%`,
              width: '80px',
              height: '80px',
              background: `linear-gradient(45deg, var(--theme-primary), var(--theme-tertiary))`,
              clipPath: i % 2 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 20 + (i * 2),
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Particle Effects */}
        <ParticleSystem
          particleCount={config.particles}
          colors={['#FFD700', '#8A2BE2', '#FF4500', '#4B0082']}
          speed={1}
          size={2}
        />
        
        {/* Mystical Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, var(--theme-primary) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, var(--theme-tertiary) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px, 150px 150px'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Floating Tarot Cards */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-12 h-20 rounded-md opacity-20"
            style={{
              background: 'linear-gradient(135deg, var(--theme-card), var(--theme-accent))',
              border: '1px solid var(--theme-primary)',
              left: `${20 + (i * 30)}%`,
              top: `${30 + (i * 20)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotateY: [0, 15, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 6 + (i * 2),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs font-persona-ui">
              {i === 0 && '♠'}
              {i === 1 && '♦'}
              {i === 2 && '♣'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
