
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star, AlertCircle } from "lucide-react";
import { GachaCard as GachaCardType } from "@/api/gachaService";
import { toast } from "@/components/ui/use-toast";

interface GachaCardProps {
  card: GachaCardType;
  isNew?: boolean;
  onClick?: () => void;
}

export default function GachaCard({ card, isNew, onClick }: GachaCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Rarity colors
  const rarityColors = {
    R: "border-gray-400",
    SR: "border-blue-400",
    SSR: "border-purple-500",
    UR: "border-yellow-400",
  };
  
  // Fallback image to use when there's an error
  const fallbackImage = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809";
  
  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
    console.error(`Failed to load image for card: ${card.title}`);
  };
  
  return (
    <motion.div
      className={cn(
        "relative flex flex-col rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300",
        "hover:scale-105 hover:shadow-xl hover:z-10",
        "border-2",
        rarityColors[card.rarity]
      )}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      onClick={onClick}
      layout
    >
      {/* Image container */}
      <div className="relative w-full h-48 overflow-hidden bg-anime-dark">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-anime-gray animate-pulse">
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-anime-gray">
            <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-xs text-gray-400">Image unavailable</p>
          </div>
        ) : (
          <img
            src={card.imageUrl || fallbackImage}
            alt={card.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              !imageLoaded && "opacity-0",
              "bg-anime-gray"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        )}
        
        {/* Rarity badge */}
        <div className={cn(
          "absolute top-2 right-2 px-2 py-0.5 text-xs font-bold text-white rounded",
          {
            "bg-gray-500": card.rarity === 'R',
            "bg-blue-500": card.rarity === 'SR',
            "bg-purple-500": card.rarity === 'SSR',
            "bg-yellow-500": card.rarity === 'UR',
          }
        )}>
          {card.rarity}
        </div>
        
        {/* New badge */}
        {isNew && (
          <div className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded">
            NEW
          </div>
        )}
        
        {/* Power level */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
          PL: {card.powerLevel}
        </div>
        
        {/* Limited badge */}
        {card.limited && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded">
            LIMITED
          </div>
        )}
      </div>
      
      {/* Card details */}
      <div className={cn(
        "p-3 flex-grow bg-gradient-to-b from-anime-dark to-anime-gray"
      )}>
        <h3 className="font-medium text-sm mb-1 line-clamp-1 text-white">{card.title}</h3>
        
        {card.originalTitle && (
          <p className="text-xs text-gray-400 mb-2 line-clamp-1 font-digital">{card.originalTitle}</p>
        )}
        
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={cn(
                "w-3 h-3", 
                i < Math.round(card.rating / 2) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
              )}
            />
          ))}
          <span className="ml-1 text-xs text-gray-400">{card.rating.toFixed(1)}</span>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{card.specialty}</span>
          <span>{card.universe}</span>
        </div>
      </div>
    </motion.div>
  );
}
