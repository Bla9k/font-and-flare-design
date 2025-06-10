
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GameAdBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;

  return (
    <motion.div 
      className="relative bg-gradient-to-r from-amber-900/20 via-orange-800/20 to-red-900/20 border border-amber-500/30 rounded-lg overflow-hidden mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
      
      {/* Banner Content */}
      <div className="flex items-center p-4 md:p-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">EoE</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-amber-400">
                Eye of Existence
              </h3>
              <p className="text-sm text-gray-400">Coming 2026</p>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm max-w-2xl">
            Immerse yourself in a revolutionary gaming experience where reality bends and existence itself becomes your playground. 
            Prepare for the ultimate adventure that will redefine what you thought was possible.
          </p>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn More
            </Button>
            <div className="text-xs text-gray-400">
              • Epic Fantasy Adventure • Revolutionary Gameplay • Coming Soon
            </div>
          </div>
        </div>
        
        {/* Game Logo/Artwork */}
        <div className="hidden md:block ml-6">
          <div className="w-32 h-24 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg border border-amber-500/30 flex items-center justify-center">
            <img 
              src="/lovable-uploads/4326439a-1b86-4f7b-8be8-bae4478358df.png" 
              alt="Eye of Existence"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 opacity-50 animate-pulse pointer-events-none" />
    </motion.div>
  );
}
