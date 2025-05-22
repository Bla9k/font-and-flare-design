
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GachaSeriesCard } from '@/types/anime';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullAnimationProps {
  card: GachaSeriesCard;
  isRevealed: boolean;
  isSSR: boolean;
  isSR: boolean;
  isFeatured: boolean;
  onFinish: () => void;
}

const PullAnimation = ({ 
  card, 
  isRevealed, 
  isSSR, 
  isSR, 
  isFeatured,
  onFinish 
}: PullAnimationProps) => {
  const [animationStage, setAnimationStage] = useState(0);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (isRevealed) {
      // Start animation sequence
      const sequence = async () => {
        // Initial flash
        setAnimationStage(1);
        await new Promise(r => setTimeout(r, 1000));
        
        // Rising animation
        setAnimationStage(2);
        await new Promise(r => setTimeout(r, 1500));
        
        // Show card
        setShowCard(true);
        setAnimationStage(3);
        await new Promise(r => setTimeout(r, 2000));
        
        // Complete animation
        setAnimationStage(4);
        await new Promise(r => setTimeout(r, 1000));
        
        onFinish();
      };
      
      sequence();
    }
  }, [isRevealed, onFinish]);

  // Different animations based on rarity
  const getBackground = () => {
    if (isSSR) {
      return "bg-gradient-to-br from-yellow-300 to-amber-600";
    } else if (isSR) {
      return "bg-gradient-to-br from-purple-500 to-pink-600";
    } else {
      return "bg-gradient-to-br from-blue-500 to-sky-600";
    }
  };

  // Animation for SSR pulls - much more elaborate
  if (isSSR && animationStage > 0) {
    return (
      <motion.div className="fixed inset-0 flex items-center justify-center z-50">
        <AnimatePresence>
          {/* Stage 1: Initial flash */}
          {animationStage === 1 && (
            <motion.div 
              className="absolute inset-0 bg-yellow-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 1] }}
              transition={{ duration: 0.8 }}
            />
          )}
          
          {/* Stage 2: Rising stars */}
          {animationStage === 2 && (
            <motion.div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600">
              {/* Multiple star particles */}
              {[...Array(40)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute text-yellow-200"
                  initial={{ 
                    x: `${Math.random() * 100}%`, 
                    y: "100%", 
                    opacity: 0.7,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    y: "-100%", 
                    rotate: Math.random() * 360,
                    opacity: [0.7, 1, 0]  
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    ease: "easeOut" 
                  }}
                >
                  <Star className="h-4 w-4" fill="currentColor" />
                </motion.div>
              ))}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 3, 2], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5 }}
              >
                <Star className="h-20 w-20 text-yellow-200" fill="currentColor" />
              </motion.div>
            </motion.div>
          )}
          
          {/* Stage 3: Card Reveal */}
          {animationStage >= 3 && (
            <motion.div className="flex flex-col items-center justify-center relative z-10">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
              />
              <motion.div
                className="mb-4 text-center"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                  SSR PULL!
                </h2>
                {isFeatured && (
                  <p className="text-yellow-200 font-semibold">Featured Character!</p>
                )}
              </motion.div>
              
              <motion.div
                className={cn(
                  "relative rounded-lg overflow-hidden shadow-[0_0_20px_rgba(255,204,0,0.8)]",
                  "w-72 h-96 flex flex-col bg-gradient-to-b from-yellow-400 to-amber-600 border-4 border-yellow-300"
                )}
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  duration: 1,
                  type: "spring",
                  stiffness: 150
                }}
              >
                <div className="h-3/5 overflow-hidden bg-black">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      // Fallback image if loading fails
                      (e.target as HTMLImageElement).src = "https://i.imgur.com/RDTCOR1.jpg";
                    }} 
                  />
                </div>
                <div className="p-3 bg-gradient-to-b from-yellow-400 to-amber-600 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white truncate drop-shadow-md">{card.title}</h3>
                    <p className="text-xs text-yellow-100 line-clamp-2">{card.description}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-white font-semibold flex items-center">
                      {card.rarity}
                      <span className="ml-1 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-3 w-3 text-yellow-300" 
                            fill="currentColor" 
                          />
                        ))}
                      </span>
                    </span>
                    <span className="bg-yellow-200 text-amber-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                      Power: {card.powerLevel}
                    </span>
                  </div>
                </div>
                
                {/* Animated shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                  style={{ width: "50%" }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
  
  // Simpler animation for SR/R pulls
  if ((isSR || !isSSR) && animationStage > 0) {
    return (
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={cn(
          "absolute inset-0",
          getBackground(),
          "opacity-60"
        )} />
        
        {showCard && (
          <motion.div
            className={cn(
              "relative rounded-lg overflow-hidden",
              "w-64 h-80 flex flex-col bg-gradient-to-b",
              isSR ? "from-purple-400 to-pink-600 border-2 border-purple-300"
                : "from-blue-400 to-sky-600 border border-blue-300"
            )}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="h-3/5 overflow-hidden bg-black">
              <img 
                src={card.imageUrl} 
                alt={card.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://i.imgur.com/XnT03eP.jpg";
                }} 
              />
            </div>
            <div className="p-3 flex-grow flex flex-col justify-between">
              <h3 className="font-bold text-white truncate">{card.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">{card.rarity}</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return null;
};

export default PullAnimation;
