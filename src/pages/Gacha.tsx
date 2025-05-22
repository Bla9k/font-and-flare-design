import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Package, Star, Trophy, Sparkles } from 'lucide-react';

// Mock data for gacha cards
const mockCards = [
  {
    id: 1,
    name: "Levi Ackerman",
    rarity: "UR",
    image: "https://images.pexels.com/photos/15814000/pexels-photo-15814000.jpeg",
    series: "Attack on Titan",
    power: 95,
  },
  {
    id: 2,
    name: "Monkey D. Luffy",
    rarity: "SSR",
    image: "https://images.pexels.com/photos/15812957/pexels-photo-15812957.jpeg",
    series: "One Piece",
    power: 88,
  },
  {
    id: 3,
    name: "Naruto Uzumaki",
    rarity: "SR",
    image: "https://images.pexels.com/photos/15813012/pexels-photo-15813012.jpeg",
    series: "Naruto",
    power: 82,
  },
  // Add more mock cards as needed
];

const rarityColors = {
  UR: "from-[#FF2A45] to-[#FF9EAC]",
  SSR: "from-[#FFD700] to-[#FFA500]",
  SR: "from-[#C0C0C0] to-[#808080]",
  R: "from-[#CD7F32] to-[#8B4513]",
};

const rarityProbabilities = {
  UR: 0.01, // 1%
  SSR: 0.04, // 4%
  SR: 0.15, // 15%
  R: 0.80, // 80%
};

export default function Gacha() {
  const [coins, setCoins] = useState(1000);
  const [pityCounter, setPityCounter] = useState(0);
  const [inventory, setInventory] = useState<any[]>([]);
  const [pulling, setPulling] = useState(false);
  const [currentPull, setCurrentPull] = useState<any>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const pullCard = async () => {
    if (coins < 100) {
      toast({
        title: "Insufficient Coins",
        description: "You need 100 coins to pull a card.",
        variant: "destructive",
      });
      return;
    }

    setPulling(true);
    setCoins(prev => prev - 100);
    setPityCounter(prev => prev + 1);

    // Simulate pull animation
    setShowAnimation(true);

    // Calculate rarity based on pity system
    let rarity = "R";
    const roll = Math.random();
    
    if (pityCounter >= 89) {
      rarity = "UR"; // Guaranteed UR at 90 pulls
    } else if (roll < rarityProbabilities.UR || pityCounter >= 75) {
      rarity = "UR";
      setPityCounter(0); // Reset pity after UR
    } else if (roll < rarityProbabilities.UR + rarityProbabilities.SSR) {
      rarity = "SSR";
    } else if (roll < rarityProbabilities.UR + rarityProbabilities.SSR + rarityProbabilities.SR) {
      rarity = "SR";
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Select a random card from mock data
    const card = { ...mockCards[Math.floor(Math.random() * mockCards.length)], rarity };
    setCurrentPull(card);
    setInventory(prev => [...prev, card]);

    // Show result
    setTimeout(() => {
      setPulling(false);
      toast({
        title: `Got ${card.rarity} Card!`,
        description: `You pulled ${card.name} from ${card.series}!`,
      });
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold relative flex items-center gap-2">
            <span className="text-anime-cyberpunk-blue">[</span> 
            Gacha System
            <span className="text-anime-cyberpunk-blue">_</span>
            <span className="text-anime-red">]</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-anime-dark rounded-lg border border-anime-light-gray">
              <div className="text-sm text-gray-400">Coins</div>
              <div className="font-digital text-anime-cyberpunk-blue">{coins}</div>
            </div>
            <div className="px-4 py-2 bg-anime-dark rounded-lg border border-anime-light-gray">
              <div className="text-sm text-gray-400">Pity</div>
              <div className="font-digital text-anime-red">{pityCounter}/90</div>
            </div>
          </div>
        </div>

        {/* Gacha Animation Area */}
        <div className="relative min-h-[400px] mb-8">
          <AnimatePresence>
            {showAnimation && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 720, 0],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  onAnimationComplete={() => setShowAnimation(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-anime-cyberpunk-blue via-anime-red to-anime-cyberpunk-blue opacity-50 blur-xl animate-pulse"></div>
                  <Package className="h-32 w-32 text-white" />
                </motion.div>
              </motion.div>
            )}

            {currentPull && !showAnimation && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r ${rarityColors[currentPull.rarity]} opacity-50 blur-xl animate-pulse rounded-lg`}></div>
                  <div className="relative bg-anime-dark border-2 border-anime-light-gray rounded-lg overflow-hidden">
                    <img
                      src={currentPull.image}
                      alt={currentPull.name}
                      className="w-64 h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r ${rarityColors[currentPull.rarity]}`}>
                          {currentPull.rarity}
                        </span>
                        <span className="text-sm">{currentPull.power} PWR</span>
                      </div>
                      <h3 className="text-lg font-bold">{currentPull.name}</h3>
                      <p className="text-sm text-gray-300">{currentPull.series}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pull Button */}
        <div className="flex justify-center mb-12">
          <Button
            onClick={pullCard}
            disabled={pulling || coins < 100}
            className="bg-anime-red hover:bg-anime-red/80 text-white px-8 py-6 text-lg relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {pulling ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Package className="h-5 w-5" />
                  </motion.div>
                  Pulling...
                </>
              ) : (
                <>
                  <Package className="h-5 w-5" />
                  Pull Card (100 coins)
                </>
              )}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-anime-cyberpunk-blue/20 to-transparent"
              animate={{
                x: ["0%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </Button>
        </div>

        {/* Inventory */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-anime-cyberpunk-blue" />
            Your Collection
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {inventory.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${rarityColors[card.rarity]} opacity-30 blur-sm rounded-lg group-hover:opacity-50 transition-opacity`}></div>
                <div className="relative bg-anime-dark border border-anime-light-gray rounded-lg overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold bg-gradient-to-r ${rarityColors[card.rarity]}`}>
                        {card.rarity}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium truncate">{card.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}