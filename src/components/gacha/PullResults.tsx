
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PullResult } from "@/api/gachaService";
import GachaCard from "./GachaCard";

interface PullResultsProps {
  results: PullResult[];
  onClose: () => void;
}

export default function PullResults({ results, onClose }: PullResultsProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  
  // Sort results by rarity (UR > SSR > SR > R)
  const sortedResults = [...results].sort((a, b) => {
    const rarityOrder = { UR: 0, SSR: 1, SR: 2, R: 3 };
    return rarityOrder[a.card.rarity] - rarityOrder[b.card.rarity];
  });
  
  // Count of each rarity
  const rarityCount = {
    UR: results.filter(r => r.card.rarity === 'UR').length,
    SSR: results.filter(r => r.card.rarity === 'SSR').length,
    SR: results.filter(r => r.card.rarity === 'SR').length,
    R: results.filter(r => r.card.rarity === 'R').length,
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <div className="text-lg font-medium text-white">
          Pull Results
        </div>
        
        <button 
          onClick={onClose}
          className="rounded-full p-1 bg-anime-gray text-gray-300 hover:bg-anime-red hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Rarity summary */}
      <div className="w-full max-w-3xl flex justify-center gap-4 mb-6">
        {Object.entries(rarityCount).map(([rarity, count]) => (
          count > 0 && (
            <div 
              key={rarity}
              className={`px-3 py-1 rounded text-white text-sm font-bold ${
                rarity === 'UR' ? 'bg-yellow-600' :
                rarity === 'SSR' ? 'bg-purple-600' :
                rarity === 'SR' ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              {rarity}: {count}
            </div>
          )
        ))}
      </div>
      
      {/* Cards grid */}
      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 overflow-y-auto max-h-[60vh] p-2">
        {sortedResults.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GachaCard 
              card={result.card} 
              isNew={true}
              onClick={() => setSelectedCard(index)}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Close button */}
      <Button 
        className="mt-6 bg-anime-red hover:bg-anime-red/80"
        onClick={onClose}
      >
        Close
      </Button>
      
      {/* Selected card details */}
      <AnimatePresence>
        {selectedCard !== null && (
          <motion.div
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-lg bg-anime-dark rounded-lg overflow-hidden">
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 rounded-full p-1 bg-black/50 text-white hover:bg-anime-red transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="h-64 relative">
                <img 
                  src={sortedResults[selectedCard].card.imageUrl} 
                  alt={sortedResults[selectedCard].card.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anime-dark to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white">{sortedResults[selectedCard].card.title}</h2>
                  <div className={`px-3 py-1 rounded text-white text-sm font-bold ${
                    sortedResults[selectedCard].card.rarity === 'UR' ? 'bg-yellow-600' :
                    sortedResults[selectedCard].card.rarity === 'SSR' ? 'bg-purple-600' :
                    sortedResults[selectedCard].card.rarity === 'SR' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {sortedResults[selectedCard].card.rarity}
                  </div>
                </div>
                
                {sortedResults[selectedCard].card.originalTitle && (
                  <p className="text-sm text-gray-400 mb-4 font-digital">
                    {sortedResults[selectedCard].card.originalTitle}
                  </p>
                )}
                
                <p className="text-gray-300 mb-4 text-sm">
                  {sortedResults[selectedCard].card.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Universe</div>
                    <div className="text-sm text-white">{sortedResults[selectedCard].card.universe}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Specialty</div>
                    <div className="text-sm text-white">{sortedResults[selectedCard].card.specialty}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Power Level</div>
                    <div className="text-sm text-white">{sortedResults[selectedCard].card.powerLevel}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Rating</div>
                    <div className="text-sm text-white">{sortedResults[selectedCard].card.rating.toFixed(1)}/10</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-2 bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/80"
                  onClick={() => setSelectedCard(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
