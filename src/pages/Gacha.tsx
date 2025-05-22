
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { GachaSeriesCard } from "@/types/anime";
import { Star } from "lucide-react";

// Reliable image URLs to prevent loading issues
const reliableImageUrls = [
  "https://cdn.myanimelist.net/images/anime/13/80230l.jpg",
  "https://cdn.myanimelist.net/images/anime/9/9453l.jpg", 
  "https://cdn.myanimelist.net/images/anime/1429/95946l.jpg",
  "https://cdn.myanimelist.net/images/anime/2/20668l.jpg",
  "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
  "https://cdn.myanimelist.net/images/anime/1411/113957l.jpg",
  "https://cdn.myanimelist.net/images/anime/5/79013l.jpg", 
  "https://cdn.myanimelist.net/images/anime/1630/106551l.jpg"
];

// Enhanced mock series cards with fallback images
const mockSeries: GachaSeriesCard[] = [
  { 
    id: 1, 
    title: "Peak, period", 
    imageUrl: reliableImageUrls[0], 
    description: "Peak, Peak, Peak!", 
    rating: 5, 
    colorScheme: "yellow",
    coins: 85787,
    rarity: "SSR"
  },
  { 
    id: 2, 
    title: "Speedscan + Perfect Quality", 
    imageUrl: reliableImageUrls[1], 
    description: "A paradox object", 
    rating: 4, 
    colorScheme: "orange",
    rarity: "SR" 
  },
  { 
    id: 3, 
    title: "Eye of the beholder", 
    imageUrl: reliableImageUrls[2], 
    description: "Second season... Look how they massacred my boy...", 
    rating: 3, 
    colorScheme: "purple",
    rarity: "SR" 
  },
  { 
    id: 4, 
    title: "Classic Romance", 
    imageUrl: reliableImageUrls[3], 
    description: "Make way! Make way!", 
    rating: 3, 
    colorScheme: "blue",
    rarity: "R" 
  },
  { 
    id: 5, 
    title: "Legendary Reborn", 
    imageUrl: reliableImageUrls[4], 
    description: "Due to the fall of the economy...", 
    rating: 4, 
    colorScheme: "green",
    rarity: "SR" 
  },
  { 
    id: 6, 
    title: "Larger is more betterer", 
    imageUrl: reliableImageUrls[5], 
    description: "Make picture BIG! very big picture much quality very yes!", 
    rating: 2, 
    colorScheme: "blue",
    rarity: "R" 
  },
  { 
    id: 7, 
    title: "Me IRL", 
    imageUrl: reliableImageUrls[6], 
    description: "It's okay, you can be honest, you want this too ❤️", 
    rating: 5, 
    colorScheme: "red",
    rarity: "SSR" 
  },
  { 
    id: 8, 
    title: "Cleaned the SFX", 
    imageUrl: reliableImageUrls[7], 
    description: "It's ok, you did well enough. *pat pat*", 
    rating: 3, 
    colorScheme: "purple",
    rarity: "SR" 
  },
];

// Featured banner series with guaranteed rates
const featuredBanners = [
  {
    id: 1,
    title: "SUMMER COLLECTION",
    description: "Limited time summer-themed series with special bonus content!",
    imageUrl: "https://cdn.myanimelist.net/images/anime/1223/121007l.jpg",
    featuredSeries: [1, 7], // IDs of featured series with higher pull rates
    endDate: "2025-08-15",
    colorScheme: "blue"
  },
  {
    id: 2,
    title: "CLASSICS REVIVAL",
    description: "A collection of timeless classics with enhanced editions",
    imageUrl: "https://cdn.myanimelist.net/images/anime/11/39717l.jpg",
    featuredSeries: [2, 4],
    endDate: "2025-09-01",
    colorScheme: "green"
  },
  {
    id: 3,
    title: "SCI-FI SPECTACULAR",
    description: "The best science fiction series across all dimensions",
    imageUrl: "https://cdn.myanimelist.net/images/anime/1904/121060l.jpg",
    featuredSeries: [3, 5],
    endDate: "2025-07-30",
    colorScheme: "purple"
  }
];

export default function Gacha() {
  const [currency, setCurrency] = useState(1000);  // Starting currency
  const [showCollection, setShowCollection] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<GachaSeriesCard | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ownedSeries, setOwnedSeries] = useState<{[id: number]: boolean}>({});
  const [activeBanner, setActiveBanner] = useState<number>(1);
  const [pityCounter, setPityCounter] = useState(0);
  const [showPullResult, setShowPullResult] = useState(false);
  const [pullResult, setPullResult] = useState<GachaSeriesCard | null>(null);
  const [showBanners, setShowBanners] = useState(false);
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("gacha_currency");
    const savedOwned = localStorage.getItem("gacha_owned_series");
    const savedPity = localStorage.getItem("gacha_pity_counter");
    
    if (savedCurrency) setCurrency(parseInt(savedCurrency));
    if (savedOwned) setOwnedSeries(JSON.parse(savedOwned));
    if (savedPity) setPityCounter(parseInt(savedPity));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gacha_currency", currency.toString());
    localStorage.setItem("gacha_owned_series", JSON.stringify(ownedSeries));
    localStorage.setItem("gacha_pity_counter", pityCounter.toString());
  }, [currency, ownedSeries, pityCounter]);

  // Get currency by watching an ad (would actually integrate with ad network in a real app)
  const getCurrency = () => {
    toast({
      title: "Daily Reward!",
      description: "You've received 300 gems!",
    });
    
    setCurrency(prev => prev + 300);
  };

  // Single pull function with pity system
  const singlePull = () => {
    if (isAnimating) return;
    
    const cost = 200;
    if (currency < cost) {
      toast({
        title: "Not Enough Gems",
        description: `You need ${cost} gems to pull once.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsAnimating(true);
    setCurrency(prev => prev - cost);
    
    // Increase pity counter
    setPityCounter(prev => prev + 1);
    
    setTimeout(() => {
      let pullRates = [0.01, 0.09, 0.3, 0.6]; // SSR, SR, R, N rates
      
      // If pity counter is at 90 or above, guaranteed SSR
      if (pityCounter >= 89) {
        pullRates = [1, 0, 0, 0];
        setPityCounter(0); // Reset pity after getting SSR
        toast({
          title: "Pity Activated!",
          description: "Your pity counter reached 90 - guaranteed SSR pull!",
        });
      }
      
      // Get all series of each rarity
      const ssrSeries = mockSeries.filter(s => s.rarity === "SSR");
      const srSeries = mockSeries.filter(s => s.rarity === "SR");
      const rSeries = mockSeries.filter(s => s.rarity === "R");
      
      // Determine which rarity is pulled based on rates
      const roll = Math.random();
      let result: GachaSeriesCard | null = null;
      
      if (roll < pullRates[0]) {
        // SSR pull - select random SSR series
        result = ssrSeries[Math.floor(Math.random() * ssrSeries.length)];
      } else if (roll < pullRates[0] + pullRates[1]) {
        // SR pull
        result = srSeries[Math.floor(Math.random() * srSeries.length)];
      } else {
        // R pull
        result = rSeries[Math.floor(Math.random() * rSeries.length)];
      }
      
      if (result) {
        setPullResult(result);
        setShowPullResult(true);
        
        // Add to owned series
        setOwnedSeries(prev => ({
          ...prev,
          [result!.id]: true
        }));
      }
      
      setIsAnimating(false);
    }, 1000);
  };

  // Multi-pull function (10x pull)
  const multiPull = () => {
    if (isAnimating) return;
    
    const cost = 2000; // 10% discount on 10 pulls
    if (currency < cost) {
      toast({
        title: "Not Enough Gems",
        description: `You need ${cost} gems for a 10x pull.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsAnimating(true);
    setCurrency(prev => prev - cost);
    
    // Increase pity counter
    setPityCounter(prev => prev + 10);
    
    setTimeout(() => {
      // For 10x pull, guarantee at least one SR or above
      let results: GachaSeriesCard[] = [];
      let hasHighRarity = false;
      
      // Check if pity should activate
      const pityShouldActivate = pityCounter >= 89;
      if (pityShouldActivate) {
        setPityCounter(0);
        toast({
          title: "Pity Activated!",
          description: "Your pity counter reached 90 - guaranteed SSR pull!",
        });
      }
      
      // Fill results array with 10 pulls
      for (let i = 0; i < 10; i++) {
        let pullRates = [0.01, 0.09, 0.3, 0.6]; // SSR, SR, R, N rates
        
        // First pull uses pity if applicable
        if (i === 0 && pityShouldActivate) {
          pullRates = [1, 0, 0, 0]; // 100% SSR
        }
        
        // Get all series of each rarity
        const ssrSeries = mockSeries.filter(s => s.rarity === "SSR");
        const srSeries = mockSeries.filter(s => s.rarity === "SR");
        const rSeries = mockSeries.filter(s => s.rarity === "R");
        
        // Determine which rarity is pulled based on rates
        const roll = Math.random();
        let result: GachaSeriesCard | null = null;
        
        if (roll < pullRates[0]) {
          // SSR pull
          result = ssrSeries[Math.floor(Math.random() * ssrSeries.length)];
          hasHighRarity = true;
        } else if (roll < pullRates[0] + pullRates[1]) {
          // SR pull
          result = srSeries[Math.floor(Math.random() * srSeries.length)];
          hasHighRarity = true;
        } else {
          // R pull
          result = rSeries[Math.floor(Math.random() * rSeries.length)];
        }
        
        if (result) {
          results.push(result);
          // Add to owned series
          setOwnedSeries(prev => ({
            ...prev,
            [result!.id]: true
          }));
        }
      }
      
      // Guarantee at least one SR+ if none was pulled
      if (!hasHighRarity) {
        // Replace last pull with an SR
        const srSeries = mockSeries.filter(s => s.rarity === "SR");
        results[9] = srSeries[Math.floor(Math.random() * srSeries.length)];
        
        setOwnedSeries(prev => ({
          ...prev,
          [results[9].id]: true
        }));
      }
      
      // Show the highest rarity result
      const bestResult = results.reduce((best, current) => {
        const rarityValue = (series: GachaSeriesCard) => 
          series.rarity === "SSR" ? 3 : series.rarity === "SR" ? 2 : 1;
        
        return rarityValue(current) > rarityValue(best) ? current : best;
      }, results[0]);
      
      setPullResult(bestResult);
      setShowPullResult(true);
      
      toast({
        title: "10x Pull Complete!",
        description: `You obtained ${results.filter(r => r.rarity === "SSR").length} SSR, ${results.filter(r => r.rarity === "SR").length} SR, and ${results.filter(r => r.rarity === "R").length} R series!`,
      });
      
      setIsAnimating(false);
    }, 1500);
  };
  
  // Pull for a specific series
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
  
  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "SSR":
        return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black";
      case "SR":
        return "bg-gradient-to-r from-purple-300 to-purple-600 text-white";
      case "R":
        return "bg-gradient-to-r from-blue-300 to-blue-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
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
        
        {/* Featured Banner Section */}
        <motion.div
          className="w-full mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display font-bold">
              <span className="text-anime-cyberpunk-blue">⟦</span> Featured Banners <span className="text-anime-cyberpunk-blue">⟧</span>
            </h2>
            <button 
              onClick={() => setShowBanners(true)}
              className="px-3 py-1 bg-anime-cyberpunk-blue/20 hover:bg-anime-cyberpunk-blue/30 border border-anime-cyberpunk-blue/40 rounded text-sm text-anime-cyberpunk-blue transition-colors"
            >
              View All
            </button>
          </div>
          
          {/* Current featured banner */}
          <div className="relative h-60 md:h-80 rounded-lg overflow-hidden">
            <img 
              src={featuredBanners[activeBanner - 1].imageUrl} 
              alt={featuredBanners[activeBanner - 1].title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                  {featuredBanners[activeBanner - 1].title}
                </h3>
                <p className="text-gray-300 mb-4 max-w-3xl">
                  {featuredBanners[activeBanner - 1].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredBanners[activeBanner - 1].featuredSeries.map(seriesId => {
                    const series = mockSeries.find(s => s.id === seriesId);
                    if (!series) return null;
                    return (
                      <div key={seriesId} className="flex items-center bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="w-5 h-5 rounded-full overflow-hidden mr-2">
                          <img src={series.imageUrl} alt={series.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-white">{series.title}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={singlePull}
                    className="px-4 py-2 bg-anime-cyberpunk-blue/80 hover:bg-anime-cyberpunk-blue text-black font-semibold rounded transition-colors"
                    disabled={isAnimating}
                  >
                    Single Pull (200 gems)
                  </button>
                  <button
                    onClick={multiPull}
                    className="px-4 py-2 bg-anime-red/80 hover:bg-anime-red text-white font-semibold rounded transition-colors"
                    disabled={isAnimating}
                  >
                    10x Pull (2000 gems)
                  </button>
                </div>
              </div>
            </div>
            
            {/* Banner navigation dots */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-1">
              {featuredBanners.map((banner, idx) => (
                <button
                  key={banner.id}
                  onClick={() => setActiveBanner(banner.id)}
                  className={`w-2 h-2 rounded-full ${
                    activeBanner === banner.id ? 'bg-anime-cyberpunk-blue' : 'bg-gray-400/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Pity counter display */}
          <div className="mt-4 flex items-center">
            <div className="text-xs text-gray-400">PITY COUNTER:</div>
            <div className="ml-2 h-1.5 bg-anime-dark rounded-full overflow-hidden flex-1">
              <div 
                className="h-full bg-gradient-to-r from-anime-cyberpunk-blue to-anime-red"
                style={{ width: `${Math.min(pityCounter / 90 * 100, 100)}%` }}
              ></div>
            </div>
            <div className="ml-2 text-xs font-digital">
              <span className={pityCounter >= 80 ? "text-anime-red animate-pulse" : "text-gray-300"}>
                {pityCounter}/90
              </span>
            </div>
          </div>
        </motion.div>
        
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
            <h2 className="text-xl font-display font-bold mb-4">
              <span className="text-anime-red">⟦</span> Series Shop <span className="text-anime-red">⟧</span>
            </h2>
            
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
                    {/* Rarity badge */}
                    <div className="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded font-digital shadow-lg transform -rotate-3 ${
                      getRarityBadgeColor(series.rarity || 'R')}">
                      {series.rarity || "R"}
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
                            <div className="mt-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityBadgeColor(series.rarity || 'R')}`}>
                                {series.rarity || "R"}
                              </span>
                            </div>
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
      
      {/* All Banners Modal */}
      {showBanners && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-anime-gray border border-anime-light-gray rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col"
          >
            <div className="p-6 border-b border-anime-light-gray flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold">Featured Banners</h2>
              <button 
                onClick={() => setShowBanners(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-anime-dark text-white hover:bg-opacity-70 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {featuredBanners.map((banner) => (
                  <div 
                    key={banner.id}
                    className="rounded-lg overflow-hidden border border-anime-light-gray"
                  >
                    <div className="h-40 relative">
                      <img 
                        src={banner.imageUrl} 
                        alt={banner.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                        <p className="text-sm text-gray-300">{banner.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-400">
                            Ends: {banner.endDate}
                          </div>
                          <button 
                            onClick={() => {
                              setActiveBanner(banner.id);
                              setShowBanners(false);
                            }}
                            className="px-3 py-1 bg-anime-cyberpunk-blue/70 hover:bg-anime-cyberpunk-blue text-black text-sm rounded"
                          >
                            Select Banner
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Pull Result Modal */}
      {showPullResult && pullResult && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              {/* Rarity rays background */}
              <div className={`absolute inset-0 -z-10 ${
                pullResult.rarity === "SSR" ? "animate-pulse" : ""
              }`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-full h-full ${
                    pullResult.rarity === "SSR" 
                      ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300/30 via-yellow-500/20 to-transparent"
                      : pullResult.rarity === "SR"
                        ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400/30 via-purple-500/20 to-transparent"
                        : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/30 via-blue-500/20 to-transparent"
                  }`}></div>
                </div>
              </div>
              
              {/* Card content */}
              <motion.div 
                className={`rounded-lg overflow-hidden border-4 ${getBorderColor(pullResult.colorScheme)} shadow-2xl`}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="relative">
                  <img 
                    src={pullResult.imageUrl} 
                    alt={pullResult.title}
                    className="w-full h-80 object-cover"
                  />
                  
                  {/* Rarity badge */}
                  <motion.div
                    className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 text-sm font-bold rounded-full shadow-xl z-10 ${getRarityBadgeColor(pullResult.rarity || 'R')}`}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {pullResult.rarity || "R"}
                  </motion.div>
                  
                  {/* Title and info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 text-white">
                    <motion.h3 
                      className="text-2xl font-display font-bold text-center mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {pullResult.title}
                    </motion.h3>
                    
                    <motion.div
                      className="flex justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {renderRating(pullResult.rating, pullResult.colorScheme)}
                    </motion.div>
                  </div>
                  
                  {/* Sparkle effects for SSR */}
                  {pullResult.rarity === "SSR" && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                          initial={{ 
                            x: Math.random() * 100 - 50 + "%", 
                            y: Math.random() * 100 - 50 + "%",
                            opacity: 0
                          }}
                          animate={{ 
                            x: Math.random() * 100 - 50 + "%", 
                            y: Math.random() * 100 - 50 + "%",
                            opacity: [0, 1, 0]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5 + Math.random() * 2,
                            delay: Math.random() * 1 
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-anime-dark p-4">
                  <p className="text-gray-300 text-center mb-4">{pullResult.description}</p>
                  
                  <button
                    onClick={() => setShowPullResult(false)}
                    className="w-full py-2 bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/80 text-black rounded font-medium"
                  >
                    Awesome!
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
