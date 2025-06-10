
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface GachaCardProps {
  anime: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        large_image_url: string;
      };
    };
    score?: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isRevealed?: boolean;
}

const rarityColors = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B'
};

const rarityGlow = {
  common: 'rgba(156, 163, 175, 0.3)',
  rare: 'rgba(59, 130, 246, 0.5)',
  epic: 'rgba(139, 92, 246, 0.5)',
  legendary: 'rgba(245, 158, 11, 0.7)'
};

export default function GachaCard({ anime, rarity, isRevealed = false }: GachaCardProps) {
  const rarityStars = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4
  };

  return (
    <motion.div
      className="relative w-48 h-64 rounded-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateY: isRevealed ? 0 : 180 
      }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
      style={{
        boxShadow: `0 0 20px ${rarityGlow[rarity]}`,
        border: `2px solid ${rarityColors[rarity]}`
      }}
    >
      {/* Card Back (when not revealed) */}
      {!isRevealed && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'var(--theme-card)' }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: `var(--theme-primary)` }}>
              <span className="text-2xl font-bold" style={{ color: 'var(--theme-background)' }}>?</span>
            </div>
            <div className="text-sm font-digital" style={{ color: 'var(--theme-text-muted)' }}>
              MYSTERY
            </div>
          </div>
        </div>
      )}

      {/* Card Front (when revealed) */}
      {isRevealed && (
        <div className="relative w-full h-full">
          {/* Anime Cover Art */}
          <img 
            src={anime.images.jpg.large_image_url} 
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          
          {/* Rarity Indicator */}
          <div className="absolute top-2 right-2 flex space-x-1">
            {[...Array(rarityStars[rarity])].map((_, i) => (
              <Star 
                key={i} 
                className="h-4 w-4 fill-current" 
                style={{ color: rarityColors[rarity] }}
              />
            ))}
          </div>
          
          {/* Title and Score */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
              {anime.title}
            </h3>
            {anime.score && (
              <div className="flex items-center text-xs text-gray-300">
                <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                {anime.score.toFixed(1)}
              </div>
            )}
          </div>
          
          {/* Rarity Badge */}
          <div 
            className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold uppercase"
            style={{ 
              backgroundColor: rarityColors[rarity],
              color: 'white'
            }}
          >
            {rarity}
          </div>
        </div>
      )}
    </motion.div>
  );
}
