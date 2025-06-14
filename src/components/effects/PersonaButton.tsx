
import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PersonaButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'arcana';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  arcanaGlow?: string;
}

export default function PersonaButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  arcanaGlow = '#FFD700'
}: PersonaButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'from-yellow-600 to-yellow-500',
          text: 'text-black',
          border: 'border-yellow-400',
          glow: '#FFD700'
        };
      case 'secondary':
        return {
          bg: 'from-purple-600 to-purple-500',
          text: 'text-white',
          border: 'border-purple-400',
          glow: '#8A2BE2'
        };
      case 'danger':
        return {
          bg: 'from-red-600 to-red-500',
          text: 'text-white',
          border: 'border-red-400',
          glow: '#FF4500'
        };
      case 'arcana':
        return {
          bg: 'from-slate-700 to-slate-600',
          text: 'text-white',
          border: 'border-current',
          glow: arcanaGlow
        };
      default:
        return {
          bg: 'from-yellow-600 to-yellow-500',
          text: 'text-black',
          border: 'border-yellow-400',
          glow: '#FFD700'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-lg font-bold border-2 transition-all duration-200
        ${styles.bg} ${styles.text} ${styles.border} ${getSizeStyles()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={!disabled && !loading ? {
        scale: 1.05,
        boxShadow: `0 0 25px ${styles.glow}60`,
      } : {}}
      whileTap={!disabled && !loading ? {
        scale: 0.95
      } : {}}
      animate={{
        boxShadow: isPressed 
          ? `0 0 35px ${styles.glow}80, inset 0 0 20px rgba(0,0,0,0.3)`
          : `0 0 15px ${styles.glow}40`
      }}
      style={{
        background: variant === 'arcana' 
          ? `linear-gradient(135deg, ${arcanaGlow}20, rgba(0,0,0,0.8))`
          : undefined,
        borderColor: variant === 'arcana' ? arcanaGlow : undefined
      }}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 3
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && <Loader2 className="animate-spin" size={16} />}
        {children}
      </span>
      
      {/* Pulse Effect on Press */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{ backgroundColor: `${styles.glow}30` }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}
