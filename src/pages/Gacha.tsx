import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GachaSeriesCard, GachaBanner } from "@/types/anime";
import { Package, Star, Gift, CircleCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { fetchRealSeriesData, createBanners, calculatePull } from "@/api/gachaService";
import PullAnimation from "@/components/PullAnimation";
import { Plus } from "lucide-react";

const Gacha = () => {
  // State for series data
  const [seriesData, setSeriesData] = useState<GachaSeriesCard[]>([]);
  const [banners, setBanners] = useState<GachaBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<GachaBanner | null>(null);
  const [showBanners, setShowBanners] = useState(false);
  const [unlockedSeries, setUnlockedSeries] = useState<number[]>([]);
  
  // Gacha system state
  const [userCoins, setUserCoins] = useState(10000);
  const [pityCount, setPityCount] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullResults, setPullResults] = useState<{
    card: GachaSeriesCard;
    isSSR: boolean;
    isSR: boolean;
    isFeatured: boolean;
  } | null>(null);
  const [multiPullResults, setMultiPullResults] = useState<{
    card: GachaSeriesCard;
    isSSR: boolean;
    isSR: boolean;
    isFeatured: boolean;
  }[]>([]);
  const [showMultiResults, setShowMultiResults] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [revealPull, setRevealPull] = useState(false);
  
  // Refs for scrolling
  const seriesRef = useRef<HTMLDivElement>(null);
  const bannersRef = useRef<HTMLDivElement>(null);

  // Load data from Jikan API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch real anime data
        const series = await fetchRealSeriesData();
        
        if (series.length > 0) {
          setSeriesData(series);
          
          // Create banners from the series data
          const allBanners = createBanners(series);
          setBanners(allBanners);
          
          // Set the default selected banner
          setSelectedBanner(allBanners[0]);
          
          // Unlock a few starter cards
          const starterUnlocks = series
            .filter(s => s.rarity === "R")
            .slice(0, 5)
            .map(s => s.id);
          setUnlockedSeries(starterUnlocks);
        }
      } catch (error) {
        console.error("Error loading gacha data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load gacha data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Helper function to check if a series is unlocked
  const isUnlocked = (id: number) => unlockedSeries.includes(id);
  
  // Function to render rating stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star 
            key={`full-${i}`} 
            className={cn("h-3 w-3 text-yellow-400")} 
            fill="currentColor" 
          />
        ))}
        {hasHalfStar && (
          <Star 
            className={cn("h-3 w-3 text-yellow-400")} 
            fill="currentColor"
            strokeWidth={0}
            style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star 
            key={`empty-${i}`} 
            className={cn("h-3 w-3 text-gray-400")} 
          />
        ))}
      </div>
    );
  };
  
  // Function to handle single pull
  const handlePull = () => {
    if (userCoins < 160) {
      toast({
        title: "Not enough coins",
        description: "You need 160 coins to pull",
        variant: "destructive"
      });
      return;
    }

    setUserCoins(prev => prev - 160);
    setIsPulling(true);
    setAnimating(true);
    
    // Calculate pull result with pity system
    const { result, newPityCount, isSSR, isSR, isFeatured } = calculatePull(
      pityCount,
      seriesData,
      selectedBanner?.featuredSeries
    );
    
    // Add pulled card to unlocked series if not already
    if (!isUnlocked(result.id)) {
      setUnlockedSeries(prev => [...prev, result.id]);
    }
    
    // Update pity counter
    setPityCount(newPityCount);
    
    // Set pull results for animation
    setPullResults({
      card: result,
      isSSR,
      isSR,
      isFeatured
    });
    
    // Wait a bit then reveal
    setTimeout(() => {
      setRevealPull(true);
    }, 1000);
  };
  
  // Function to handle multi pull (10 pulls)
  const handleMultiPull = () => {
    if (userCoins < 1600) {
      toast({
        title: "Not enough coins",
        description: "You need 1600 coins for a 10x pull",
        variant: "destructive"
      });
      return;
    }
    
    setUserCoins(prev => prev - 1600);
    setIsPulling(true);
    
    let currentPity = pityCount;
    const results = [];
    
    // Calculate 10 pulls
    for (let i = 0; i < 10; i++) {
      const { result, newPityCount, isSSR, isSR, isFeatured } = calculatePull(
        currentPity,
        seriesData,
        selectedBanner?.featuredSeries
      );
      
      currentPity = newPityCount;
      
      // Add to unlocked series
      if (!isUnlocked(result.id)) {
        setUnlockedSeries(prev => [...prev, result.id]);
      }
      
      results.push({ card: result, isSSR, isSR, isFeatured });
    }
    
    // Update pity counter
    setPityCount(currentPity);
    
    // Sort results (SSR first, then SR, then R)
    const sortedResults = [...results].sort((a, b) => {
      if (a.isSSR && !b.isSSR) return -1;
      if (!a.isSSR && b.isSSR) return 1;
      if (a.isSR && !b.isSR) return -1;
      if (!a.isSR && b.isSR) return 1;
      return 0;
    });
    
    setMultiPullResults(sortedResults);
    setShowMultiResults(true);
  };
  
  // Reset pull state when done
  const handleAnimationComplete = () => {
    setRevealPull(false);
    setPullResults(null);
    setIsPulling(false);
    setAnimating(false);
  };
  
  // Close the multi-pull results modal
  const closeMultiResults = () => {
    setShowMultiResults(false);
    setMultiPullResults([]);
    setIsPulling(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-anime-dark pb-20">
        {/* Gacha header with animated backdrop */}
        <motion.div 
          className="relative overflow-hidden"
          initial={{ height: "10rem" }}
          animate={{ height: "16rem" }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-anime-cyberpunk-blue/20 to-anime-dark/90">
            {/* Animated particles */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-anime-cyberpunk-blue rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Banner image */}
          {selectedBanner && (
            <div className="absolute inset-0 z-0">
              <img
                src={selectedBanner.imageUrl}
                alt={selectedBanner.title}
                className="w-full h-full object-cover opacity-30"
                onError={(e) => {
                  // Fallback to a solid gradient if image fails
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/80 to-transparent" />
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-10 pt-6 px-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-anime-cyberpunk-blue" />
              <h1 className="text-2xl font-bold">Gacha</h1>
            </div>
            
            {/* User coins display */}
            <div className="mt-4 p-3 rounded-lg bg-anime-gray/30 backdrop-blur-sm border border-anime-light-gray/20">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-digital text-anime-cyberpunk-blue text-sm">YOUR BALANCE</h2>
                  <p className="text-2xl font-bold flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-yellow-400" fill="currentColor" />
                    {userCoins.toLocaleString()} Coins
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-anime-cyberpunk-blue text-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/20"
                >
                  <Plus className="h-4 w-4 mr-1" /> Get Coins
                </Button>
              </div>
            </div>
            
            {/* Selected Banner Info */}
            {selectedBanner && (
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold">{selectedBanner.title}</h2>
                  <p className="text-sm text-gray-400">{selectedBanner.description}</p>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-anime-cyberpunk-blue"
                  onClick={() => setShowBanners(true)}
                >
                  Change
                </Button>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Loading state */}
        {loading ? (
          <div className="px-4 py-10">
            <div className="h-40 bg-anime-gray/30 rounded-lg animate-pulse"></div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-52 bg-anime-gray/30 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 pt-4">
            {/* Pity Counter */}
            <div className="mb-4 bg-anime-gray/20 rounded-lg p-3 border border-anime-light-gray/20">
              <h3 className="text-sm font-digital text-anime-cyberpunk-blue">PITY COUNTER</h3>
              <div className="mt-1 flex items-center">
                <div className="flex-1 h-2 bg-anime-gray/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-anime-cyberpunk-blue" 
                    style={{ width: `${(pityCount / 90) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-gray-400">{pityCount}/90</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {pityCount >= 75 ? (
                  <span className="text-yellow-400">Soft pity active! SSR rate increased!</span>
                ) : (
                  <>Guaranteed SSR at 90 pulls</>
                )}
              </p>
            </div>
            
            {/* Pull Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                variant="outline"
                className="bg-anime-gray/30 border border-anime-light-gray/20 h-16"
                disabled={isPulling || userCoins < 160}
                onClick={handlePull}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm">Single Pull</span>
                  <span className="flex items-center text-xs text-yellow-400">
                    <Gift className="h-3 w-3 mr-1" fill="currentColor" />
                    160
                  </span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-anime-gray/30 border border-anime-light-gray/20 h-16"
                disabled={isPulling || userCoins < 1600}
                onClick={handleMultiPull}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm">Pull 10x</span>
                  <span className="flex items-center text-xs text-yellow-400">
                    <Gift className="h-3 w-3 mr-1" fill="currentColor" />
                    1600
                  </span>
                </div>
              </Button>
            </div>
            
            {/* Tabs for different views */}
            <div className="border-b border-anime-light-gray/20 mb-4">
              <div className="flex space-x-8">
                <button
                  className={`pb-2 relative ${
                    seriesRef.current ? 'text-anime-cyberpunk-blue font-medium' : 'text-gray-400'
                  }`}
                  onClick={() => seriesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Collection
                  {seriesRef.current && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-anime-cyberpunk-blue"
                    />
                  )}
                </button>
                <button
                  className={`pb-2 relative ${
                    bannersRef.current ? 'text-anime-cyberpunk-blue font-medium' : 'text-gray-400'
                  }`}
                  onClick={() => bannersRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Banners
                  {bannersRef.current && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-anime-cyberpunk-blue"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Series Collection */}
            <div ref={seriesRef} className="mb-8">
              <h2 className="text-xl font-bold mb-4">Your Collection ({unlockedSeries.length}/{seriesData.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {seriesData.map((series) => (
                  <motion.div
                    key={series.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: (series.id % 20) * 0.05
                    }}
                  >
                    <Card className={cn(
                      "overflow-hidden bg-anime-gray/20 border-anime-light-gray/20",
                      "transition-all duration-300",
                      isUnlocked(series.id)
                        ? `bg-gradient-to-br ${series.colorScheme || "from-blue-500/20 to-purple-600/20"} hover:shadow-lg hover:-translate-y-1`
                        : "grayscale opacity-60"
                    )}>
                      <CardContent className="p-0">
                        <div className="aspect-[3/4] relative overflow-hidden">
                          {isUnlocked(series.id) ? (
                            <>
                              <img
                                src={series.imageUrl}
                                alt={series.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  // Replace with backup image on error
                                  const backupImages = [
                                    "https://i.imgur.com/RDTCOR1.jpg",
                                    "https://i.imgur.com/XnT03eP.jpg",
                                    "https://i.imgur.com/bZISp9m.jpg",
                                    "https://i.imgur.com/nYyNBiL.jpg"
                                  ];
                                  (e.target as HTMLImageElement).src = backupImages[series.id % backupImages.length];
                                }}
                              />
                              {/* Card info overlay */}
                              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-sm font-medium truncate">{series.title}</h3>
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-white/80">{series.rarity}</div>
                                  {renderRating(series.rating)}
                                </div>
                              </div>
                              {/* Rarity badge */}
                              <div className={cn(
                                "absolute top-2 right-2 px-1.5 py-0.5 rounded-sm text-xs font-bold",
                                series.rarity === "SSR" ? "bg-yellow-500 text-yellow-900" :
                                series.rarity === "SR" ? "bg-purple-500 text-purple-900" : 
                                "bg-blue-500 text-blue-900"
                              )}>
                                {series.rarity}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-anime-dark/60">
                              <div className="text-center p-4">
                                <Package className="h-8 w-8 mx-auto opacity-50" />
                                <p className="mt-2 text-xs text-gray-400">Locked</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* All available banners */}
            <div ref={bannersRef} className="mb-12">
              <h2 className="text-xl font-bold mb-4">Available Banners</h2>
              <div className="space-y-4">
                {banners.map((banner) => (
                  <motion.div
                    key={banner.id}
                    className={cn(
                      "rounded-lg overflow-hidden relative h-40",
                      "border border-anime-light-gray/20",
                      selectedBanner?.id === banner.id ? "ring-2 ring-anime-cyberpunk-blue" : ""
                    )}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedBanner(banner)}
                  >
                    {/* Banner image */}
                    <div className="absolute inset-0">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const backupImages = [
                            "https://i.imgur.com/wXfnlUd.jpg",
                            "https://i.imgur.com/RDTCOR1.jpg",
                            "https://i.imgur.com/XnT03eP.jpg",
                            "https://i.imgur.com/bZISp9m.jpg"
                          ];
                          (e.target as HTMLImageElement).src = backupImages[banner.id % backupImages.length];
                        }}
                      />
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r",
                        `from-black/80 via-black/50 to-transparent`
                      )} />
                    </div>
                    
                    {/* Banner content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                        <p className="text-sm text-gray-300">{banner.description}</p>
                        
                        {/* Banner type badge */}
                        {banner.bannerType !== 'standard' && (
                          <span className={cn(
                            "mt-2 inline-block px-2 py-0.5 text-xs font-bold rounded-full",
                            banner.bannerType === 'limited' ? "bg-red-500 text-white" :
                            banner.bannerType === 'seasonal' ? "bg-cyan-500 text-white" :
                            "bg-purple-500 text-white"
                          )}>
                            {banner.bannerType.toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="text-sm text-gray-300">
                          {banner.endDate === "Permanent" ? (
                            <span>Always Available</span>
                          ) : (
                            <span>Ends: {banner.endDate}</span>
                          )}
                        </div>
                        
                        {selectedBanner?.id === banner.id && (
                          <CircleCheck className="h-6 w-6 text-anime-cyberpunk-blue" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Pull Animation */}
        <AnimatePresence>
          {isPulling && pullResults && (
            <PullAnimation
              card={pullResults.card}
              isRevealed={revealPull}
              isSSR={pullResults.isSSR}
              isSR={pullResults.isSR}
              isFeatured={pullResults.isFeatured}
              onFinish={handleAnimationComplete}
            />
          )}
        </AnimatePresence>
        
        {/* Multi Pull Results Modal */}
        <AnimatePresence>
          {showMultiResults && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="w-full max-w-md max-h-[80vh] bg-anime-gray/20 rounded-lg border border-anime-light-gray/20 overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="p-4 border-b border-anime-light-gray/20">
                  <h2 className="text-lg font-bold">Pull Results (10)</h2>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {multiPullResults.map((result, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "rounded-md overflow-hidden",
                          result.isSSR ? "bg-gradient-to-br from-yellow-500/30 to-amber-700/30 border border-yellow-500/50" :
                          result.isSR ? "bg-gradient-to-br from-purple-500/30 to-pink-700/30 border border-purple-500/50" : 
                          "bg-gradient-to-br from-blue-500/20 to-sky-700/20 border border-blue-500/30"
                        )}
                      >
                        <div className="h-24 relative">
                          <img 
                            src={result.card.imageUrl} 
                            alt={result.card.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const backupImages = [
                                "https://i.imgur.com/RDTCOR1.jpg",
                                "https://i.imgur.com/XnT03eP.jpg",
                                "https://i.imgur.com/bZISp9m.jpg"
                              ];
                              (e.target as HTMLImageElement).src = backupImages[index % backupImages.length];
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-1">
                            <p className="text-xs truncate font-medium">{result.card.title}</p>
                            <div className="flex justify-between items-center">
                              <span className={cn(
                                "text-xs font-bold",
                                result.isSSR ? "text-yellow-400" :
                                result.isSR ? "text-purple-400" : 
                                "text-blue-400"
                              )}>
                                {result.card.rarity}
                              </span>
                              {result.isFeatured && (
                                <span className="text-xs bg-red-500 px-1 rounded-sm">Featured</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t border-anime-light-gray/20">
                  <Button 
                    className="w-full bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/80"
                    onClick={closeMultiResults}
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Gacha;
