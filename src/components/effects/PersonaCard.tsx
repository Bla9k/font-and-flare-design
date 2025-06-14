
import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { Eye, Shield, Zap } from 'lucide-react';

interface PersonaCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hover3D?: boolean;
  arcanaType?: 'fool' | 'magician' | 'priestess' | 'emperor' | 'hierophant' | 'lovers' | 'chariot' | 'strength' | 'hermit' | 'wheel' | 'justice' | 'hanged' | 'death' | 'temperance' | 'devil' | 'tower' | 'star' | 'moon' | 'sun' | 'judgement' | 'world';
}

const arcanaColors = {
  fool: '#FFD700',
  magician: '#FF4500',
  priestess: '#8A2BE2',
  emperor: '#DC143C',
  hierophant: '#4169E1',
  lovers: '#FF69B4',
  chariot: '#FF8C00',
  strength: '#32CD32',
  hermit: '#8B4513',
  wheel: '#9932CC',
  justice: '#FFD700',
  hanged: '#4682B4',
  death: '#000000',
  temperance: '#00CED1',
  devil: '#8B0000',
  tower: '#696969',
  star: '#87CEEB',
  moon: '#C0C0C0',
  sun: '#FFD700',
  judgement: '#FFFFFF',
  world: '#9370DB'
};

const arcanaIcons = {
  fool: Eye,
  magician: Zap,
  priestess: Shield,
  emperor: Shield,
  hierophant: Eye,
  lovers: Eye,
  chariot: Zap,
  strength: Shield,
  hermit: Eye,
  wheel: Zap,
  justice: Shield,
  hanged: Eye,
  death: Zap,
  temperance: Shield,
  devil: Zap,
  tower: Zap,
  star: Eye,
  moon: Eye,
  sun: Zap,
  judgement: Shield,
  world: Eye
};

export default function PersonaCard({ 
  children, 
  className = '', 
  glowColor,
  hover3D = true,
  arcanaType = 'fool'
}: PersonaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardGlow = glowColor || arcanaColors[arcanaType];
  const IconComponent = arcanaIcons[arcanaType];

  return (
    <motion.div
      className={`relative group ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hover3D ? {
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        z: 50
      } : { scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card Background with Glow */}
      <div 
        className="absolute inset-0 rounded-xl opacity-20 blur-xl transition-all duration-500"
        style={{
          background: `radial-gradient(circle at center, ${cardGlow}, transparent 70%)`,
          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          opacity: isHovered ? 0.4 : 0.2
        }}
      />
      
      {/* Main Card */}
      <div 
        className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300"
        style={{
          borderColor: cardGlow,
          boxShadow: isHovered 
            ? `0 0 30px ${cardGlow}40, inset 0 1px 0 ${cardGlow}30`
            : `0 0 15px ${cardGlow}20, inset 0 1px 0 ${cardGlow}20`
        }}
      >
        {/* Arcana Symbol */}
        <div className="absolute top-3 right-3 opacity-30">
          <IconComponent 
            size={20} 
            style={{ color: cardGlow }}
          />
        </div>
        
        {/* Scan Lines Effect */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-current animate-pulse"
              style={{
                top: `${i * 10}%`,
                color: cardGlow,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 0.1 : 0,
            background: `linear-gradient(45deg, ${cardGlow}20, transparent, ${cardGlow}20)`
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Floating Elements */}
      {isHovered && (
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
          style={{ backgroundColor: cardGlow }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}
