
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { GachaSeriesCard } from "@/types/anime";
import { Star } from "lucide-react";

// Mock gacha series cards (based on the reference image)
const mockSeries: GachaSeriesCard[] = [
  { 
    id: 1, 
    title: "Peak, period", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/80230l.jpg", 
    description: "Peak, Peak, Peak!", 
    rating: 5, 
    colorScheme: "yellow",
    coins: 85787
  },
  { 
    id: 2, 
    title: "Speedscan + Perfect Quality", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg", 
    description: "A paradox object", 
    rating: 4, 
    colorScheme: "orange" 
  },
  { 
    id: 3, 
    title: "Eye of the beholder", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1429/95946l.jpg", 
    description: "Second season... Look how they massacred my boy...", 
    rating: 3, 
    colorScheme: "purple" 
  },
  { 
    id: 4, 
    title: "Classic Romance", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/2/20668l.jpg", 
    description: "Make way! Make way!", 
    rating: 0, 
    colorScheme: "blue" 
  },
  { 
    id: 5, 
    title: "Legendary Reborn", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg", 
    description: "Due to the fall of the economy...", 
    rating: 0, 
    colorScheme: "green" 
  },
  { 
    id: 6, 
    title: "Larger is more betterer", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1411/113957l.jpg", 
    description: "Make picture BIG! very big picture much quality very yes!", 
    rating: 0, 
    colorScheme: "blue" 
  },
  { 
    id: 7, 
    title: "Me IRL", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/5/79013l.jpg", 
    description: "It's okay, you can be honest, you want this too ❤️", 
    rating: 0, 
    colorScheme: "red" 
  },
  { 
    id: 8, 
    title: "Cleaned the SFX", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1630/106551l.jpg", 
    description: "It's ok, you did well enough. *pat pat*", 
    rating: 0, 
    colorScheme: "purple" 
  },
];

export default function Gacha() {
  const [currency, setCurrency] = useState(1000);  // Starting currency
  const [showCollection, setShowCollection] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<GachaSeriesCard | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ownedSeries, setOwnedSeries] = useState<{[id: number]: boolean}>({});

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("gacha_currency");
    const savedOwned = localStorage.getItem("gacha_owned_series");
    
    if (savedCurrency) setCurrency(parseInt(savedCurrency));
    if (savedOwned) setOwnedSeries(JSON.parse(savedOwned));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gacha_currency", currency.toString());
    localStorage.setItem("gacha_owned_series", JSON.stringify(ownedSeries));
  }, [currency, ownedSeries]);

  // Get currency by watching an ad (would actually integrate with ad network in a real app)
  const getCurrency = () => {
    toast({
      title: "Daily Reward!",
      description: "You've received 300 gems!",
    });
    
    setCurrency(prev => prev + 300);
  };

  // Pull for a series
  const pullSeries = (series: GachaSeriesCard) => {
    if (isAnimating) return;
    
    const cost = 500;
    if (currency < cost) {
      toast({
        title: "Not Enough Gems",
        description: `You need ${cost} gems to pull for this series.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsAnimating(true);
    setSelectedSeries(series);
    
    setTimeout(() => {
      setCurrency(prev => prev - cost);
      
      // Add to owned series
      setOwnedSeries(prev => ({
        ...prev,
        [series.id]: true
      }));
      
      toast({
        title: "Series Unlocked!",
        description: `You've unlocked ${series.title}!`,
      });
      
      setIsAnimating(false);
    }, 1500);
  };

  // Function to get background gradient based on colorScheme
  const getGradient = (colorScheme: string) => {
    switch (colorScheme) {
      case "yellow":
        return "bg-gradient-to-b from-yellow-300/40 via-yellow-100/30 to-yellow-400/40";
      case "orange":
        return "bg-gradient-to-b from-orange-500/40 via-red-400/30 to-orange-300/40";
      case "purple":
        return "bg-gradient-to-b from-purple-500/40 via-purple-300/30 to-purple-400/40";
      case "green":
        return "bg-gradient-to-b from-green-500/40 via-green-300/30 to-green-400/40";
      case "blue":
        return "bg-gradient-to-b from-blue-500/40 via-blue-300/30 to-blue-400/40";
      case "red":
        return "bg-gradient-to-b from-red-500/40 via-red-300/30 to-red-400/40";
      default:
        return "bg-gradient-to-b from-gray-500/40 via-gray-300/30 to-gray-400/40";
    }
  };

  const getBorderColor = (colorScheme: string) => {
    switch (colorScheme) {
      case "yellow":
        return "border-yellow-400";
      case "orange":
        return "border-orange-400";
      case "purple":
        return "border-purple-400";
      case "green":
        return "border-green-400";
      case "blue":
        return "border-blue-400";
      case "red":
        return "border-red-400";
      default:
        return "border-gray-400";
    }
  };

  // Render star rating
  const renderRating = (rating: number, colorScheme: string) => {
    const getStarColor = () => {
      switch (colorScheme) {
        case "yellow": return "text-yellow-400";
        case "orange": return "text-orange-400";
        case "purple": return "text-purple-400";
        case "green": return "text-green-400";
        case "blue": return "text-blue-400";
        case "red": return "text-red-400";
        default: return "text-gray-400";
      }
    };

    return (
      <div className="flex mt-3 mb-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`mr-1 ${getStarColor()}`}>
            {i < rating ? (
              <div className="w-5 h-5 rotate-[18deg] transform scale-110">
                ◆
              </div>
            ) : (
              <div className="w-5 h-5 rotate-[18deg] text-gray-600">
                ◇
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-display font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-anime-cyberpunk-blue">[</span> 
          <span className="text-anime-red">Series</span>システム
          <span className="text-anime-cyberpunk-blue">]</span>
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Unlock complete manga and anime series in our gacha system!
          Each series contains multiple characters and special rewards.
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left column - Currency info */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Currency display */}
            <div className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-anime-red flex items-center justify-center mr-3">
                    <span className="text-white font-bold">💎</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">CURRENCY</div>
                    <div className="text-xl font-display font-bold">{currency.toLocaleString()}</div>
                  </div>
                </div>
                <button 
                  onClick={getCurrency}
                  className="px-3 py-1 bg-anime-gray hover:bg-anime-light-gray rounded text-sm transition-colors"
                >
                  Get Daily
                </button>
              </div>
            </div>
            
            {/* Coming soon - Casper AI */}
            <div className="bg-anime-gray/60 backdrop-blur-sm border border-anime-red/40 rounded-lg p-4 mb-6">
              <div className="font-digital text-xs text-anime-red mb-2">
                // COMING_SOON
              </div>
              <h3 className="text-lg font-display font-medium mb-2">CASPER AI</h3>
              <p className="text-sm text-gray-400">
                Our advanced AI system will soon be available to help you navigate the anime universe,
                provide recommendations, and enhance your gacha experience.
              </p>
              <div className="mt-3 h-1.5 w-full bg-anime-dark rounded-full overflow-hidden">
                <div className="h-full bg-anime-red w-[35%]"></div>
              </div>
              <div className="mt-1 text-xs text-right text-gray-400">
                Development: 35%
              </div>
            </div>
            
            {/* Collection stats */}
            <div className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-4 mb-6">
              <h3 className="text-lg font-display font-medium mb-3 flex items-center">
                <span className="text-anime-cyberpunk-blue mr-2">◉</span> 
                Collection
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-anime-dark rounded-lg">
                  <div className="text-2xl font-display font-bold">
                    {Object.keys(ownedSeries).length}
                  </div>
                  <div className="text-xs text-gray-400">OWNED SERIES</div>
                </div>
                <div className="text-center p-3 bg-anime-dark rounded-lg">
                  <div className="text-2xl font-display font-bold">
                    {mockSeries.length}
                  </div>
                  <div className="text-xs text-gray-400">TOTAL SERIES</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowCollection(true)} 
                className="w-full mt-4 py-2 bg-anime-cyberpunk-blue/20 hover:bg-anime-cyberpunk-blue/30 border border-anime-cyberpunk-blue/40 rounded text-sm transition-colors"
              >
                View Collection
              </button>
            </div>
          </motion.div>
          
          {/* Series cards */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSeries.map((series) => (
                <motion.div 
                  key={series.id}
                  className={`rounded-lg overflow-hidden relative ${getGradient(series.colorScheme)} border-2 ${getBorderColor(series.colorScheme)}`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Series image */}
                  <div className="h-56 relative">
                    <img 
                      src={series.imageUrl} 
                      alt={series.title} 
                      className="w-full h-full object-cover"
                    />
                    {/* Series title */}
                    <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent">
                      <h3 className="text-white font-display font-bold">{series.title}</h3>
                    </div>
                    {/* Owned badge */}
                    {ownedSeries[series.id] && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-anime-cyberpunk-blue text-black text-xs font-digital rounded">
                        OWNED
                      </div>
                    )}
                    {/* Coins display */}
                    {series.coins && (
                      <div className="absolute bottom-3 right-3 px-3 py-2 bg-black/60 backdrop-blur-sm rounded text-center">
                        <div className="text-lg font-digital text-yellow-300">{series.coins.toLocaleString()}</div>
                        <div className="text-xs text-gray-300">DexCoins</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Series info */}
                  <div className="p-4 bg-black/40 backdrop-blur-sm">
                    {renderRating(series.rating, series.colorScheme)}
                    <p className="text-sm text-white/80 mb-3">{series.description}</p>
                    
                    <button 
                      onClick={() => pullSeries(series)}
                      disabled={ownedSeries[series.id]}
                      className={`w-full py-2 rounded text-center text-sm ${
                        ownedSeries[series.id]
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/80 text-black'
                      }`}
                    >
                      {ownedSeries[series.id] ? 'Owned' : 'Unlock Series (500 gems)'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Collection Modal */}
      {showCollection && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-anime-gray border border-anime-light-gray rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col"
          >
            <div className="p-6 border-b border-anime-light-gray flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold">Your Collection</h2>
              <button 
                onClick={() => setShowCollection(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-anime-dark text-white hover:bg-opacity-70 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {Object.keys(ownedSeries).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mockSeries.filter(s => ownedSeries[s.id]).map((series) => (
                    <div 
                      key={series.id}
                      className={`rounded-lg overflow-hidden border-2 ${getBorderColor(series.colorScheme)}`}
                    >
                      <div className="h-32 relative">
                        <img 
                          src={series.imageUrl} 
                          alt={series.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-2">
                            <h3 className="text-sm font-medium text-white">{series.title}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-anime-cyberpunk-blue text-lg mb-2">No Series Unlocked</p>
                  <p className="text-gray-400">Unlock your first series to start your collection!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
