
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calendar, Gift, AlertCircle } from "lucide-react";
import { GachaBanner as GachaBannerType } from "@/api/gachaService";

interface GachaBannerProps {
  banner: GachaBannerType;
  isActive: boolean;
  onClick: () => void;
}

export default function GachaBanner({ banner, isActive, onClick }: GachaBannerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Banner type styling
  const bannerTypeStyles = {
    standard: {
      badge: "bg-blue-500",
      border: "border-blue-500",
      glow: "shadow-blue-500/20"
    },
    limited: {
      badge: "bg-red-500",
      border: "border-red-500",
      glow: "shadow-red-500/20"
    },
    seasonal: {
      badge: "bg-green-500",
      border: "border-green-500",
      glow: "shadow-green-500/20"
    },
    collaboration: {
      badge: "bg-purple-500",
      border: "border-purple-500", 
      glow: "shadow-purple-500/20"
    }
  };
  
  const styles = bannerTypeStyles[banner.bannerType];

  // Fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809";

  return (
    <motion.div
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer group transition-all duration-300",
        "bg-anime-dark border-2",
        isActive ? styles.border : "border-anime-dark",
        isActive && "shadow-lg",
        isActive && styles.glow
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      {/* Banner image */}
      <div className="relative w-full h-32 overflow-hidden">
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
            src={banner.imageUrl || fallbackImage}
            alt={banner.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              !imageLoaded && "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-transparent to-transparent"></div>
        
        {/* Banner type badge */}
        <div className={cn(
          "absolute top-2 right-2 px-2 py-0.5 text-xs font-bold text-white rounded",
          styles.badge
        )}>
          {banner.bannerType}
        </div>
      </div>
      
      {/* Banner details */}
      <div className="p-3">
        <h3 className="font-medium text-white mb-1">{banner.title}</h3>
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{banner.description}</p>
        
        <div className="flex items-center justify-between text-xs">
          {/* End date */}
          <div className="flex items-center text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Ends: {banner.endDate}</span>
          </div>
          
          {/* Bonus items */}
          {banner.bonusItems && banner.bonusItems.length > 0 && (
            <div className="flex items-center text-anime-cyberpunk-blue">
              <Gift className="w-3 h-3 mr-1" />
              <span>Bonuses</span>
            </div>
          )}
        </div>
        
        {/* Boost rate if applicable */}
        {banner.boost && (
          <div className="mt-2 text-xs px-2 py-0.5 bg-anime-cyberpunk-blue/20 text-anime-cyberpunk-blue rounded inline-block">
            {banner.boost}x Rate Up!
          </div>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-anime-cyberpunk-blue to-anime-red"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>
    </motion.div>
  );
}
