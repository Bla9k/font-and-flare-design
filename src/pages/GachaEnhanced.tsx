
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

// Card rarities
type Rarity = "R" | "SR" | "SSR" | "UR";

interface GachaCard {
  id: string;
  title: string;
  imageUrl: string;
  rarity: Rarity;
  series: string;
  description?: string;
  tagline: string; // Funny tagline shown below the card
  stars: number; // 1-5 rating displayed as stars
  type: "anime" | "manga";
  backgroundColor?: string; // Optional custom background color
}

// Mock gacha cards - now focused on series rather than characters
const mockCards: GachaCard[] = [
  // UR Cards (1% drop rate)
  { 
    id: "ur-1", 
    title: "The Wolf of Ball Street", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/17405.jpg", 
    rarity: "UR", 
    series: "Basketball Prodigies", 
    description: "A financial thriller about a basketball team that trades points on the stock market.",
    tagline: "Peak, period", 
    stars: 5,
    type: "anime",
    backgroundColor: "#FFD700"
  },
  { 
    id: "ur-2", 
    title: "My Neighbor's Garden: Ultra Deluxe Edition", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/11460.jpg", 
    rarity: "UR", 
    series: "Studio Nibli Collection", 
    description: "The grass is always greener, and sometimes it tries to eat you.",
    tagline: "Gardening was never this dangerous", 
    stars: 5,
    type: "anime",
    backgroundColor: "#9370DB"
  },
  
  // SSR Cards (5% drop rate)
  { 
    id: "ssr-1", 
    title: "A Paradox Object", 
    imageUrl: "https://cdn.myanimelist.net/images/characters/9/310307.jpg", 
    rarity: "SSR", 
    series: "Quantum Psychology",
    tagline: "Speedscan + Perfect Quality", 
    stars: 4,
    type: "manga",
    backgroundColor: "#FF6347"
  },
  { 
    id: "ssr-2", 
    title: "Eye of the Beholder", 
    imageUrl: "https://cdn.myanimelist.net/images/characters/3/100516.jpg", 
    rarity: "SSR", 
    series: "Medieval Fantasy Reborn",
    tagline: "Second season... Look how they massacred my boy...", 
    stars: 4,
    type: "anime",
    backgroundColor: "#8A2BE2"
  },
  { 
    id: "ssr-3", 
    title: "Transmigrated as a Door Handle in Another World", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1958/126269.jpg", 
    rarity: "SSR", 
    series: "Isekai Disasters",
    tagline: "At least I'm getting touched daily", 
    stars: 5,
    type: "manga",
    backgroundColor: "#20B2AA"
  },
  
  // SR Cards (15% drop rate)
  { 
    id: "sr-1", 
    title: "Make Picture Big!", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg", 
    rarity: "SR", 
    series: "Digital Photography Club",
    tagline: "Larger is more betterer", 
    stars: 3,
    type: "anime",
    backgroundColor: "#3CB371"
  },
  { 
    id: "sr-2", 
    title: "Me IRL", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1416/100620.jpg", 
    rarity: "SR", 
    series: "Social Media Chronicles",
    tagline: "It's okay, you can be honest, you want this too ❤️", 
    stars: 3,
    type: "manga",
    backgroundColor: "#4682B4"
  },
  { 
    id: "sr-3", 
    title: "My Boss is Secretly a Magical Girl", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1981/113348.jpg", 
    rarity: "SR", 
    series: "Corporate Fantasy",
    tagline: "The quarterly report is full of glitter", 
    stars: 4,
    type: "anime",
    backgroundColor: "#FF69B4"
  },
  { 
    id: "sr-4", 
    title: "I Was Transported to Another World With My Refrigerator", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1085/114792.jpg", 
    rarity: "SR", 
    series: "Appliance Adventures",
    tagline: "At least my yogurt is still fresh", 
    stars: 3,
    type: "manga",
    backgroundColor: "#1E90FF"
  },
  
  // R Cards (79% drop rate)
  { 
    id: "r-1", 
    title: "Watermark Coming Through!", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1015/96368.jpg", 
    rarity: "R", 
    series: "Digital Rights Disaster",
    tagline: "Make way! Make way!", 
    stars: 2,
    type: "manga",
    backgroundColor: "#708090"
  },
  { 
    id: "r-2", 
    title: "Due to the Fall of the Economy...", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/7/76014.jpg", 
    rarity: "R", 
    series: "Recession Blues",
    tagline: "Due to the fall of the economy...", 
    stars: 2,
    type: "anime",
    backgroundColor: "#696969"
  },
  { 
    id: "r-3", 
    title: "Cleaned the SFX", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/73245.jpg", 
    rarity: "R", 
    series: "Scanlation Struggles",
    tagline: "Cleaned the SFX except the hard ones", 
    stars: 2,
    type: "manga",
    backgroundColor: "#A9A9A9"
  },
  { 
    id: "r-4", 
    title: "My Cat Is Actually The Reincarnation Of My Math Teacher", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1443/111828.jpg", 
    rarity: "R", 
    series: "Feline Education",
    tagline: "He still gives me homework", 
    stars: 2,
    type: "anime",
    backgroundColor: "#778899"
  },
  { 
    id: "r-5", 
    title: "It's Ok You Did Well Enough", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg", 
    rarity: "R", 
    series: "Mediocrity Celebration",
    tagline: "It's ok, you did well enough. *pat pat*", 
    stars: 1,
    type: "manga",
    backgroundColor: "#808080"
  },
  { 
    id: "r-6", 
    title: "Subscribe To Our Patreon", 
    imageUrl: "https://cdn.myanimelist.net/images/anime/1259/110227.jpg", 
    rarity: "R", 
    series: "Crowdfunding Crisis",
    tagline: "Please support our work", 
    stars: 1,
    type: "anime",
    backgroundColor: "#D3D3D3"
  },
];

// Fill with more R cards to reach our distribution
const filler_titles = [
  "Why Is This Taking So Long To Translate?",
  "I Colored This Panel Myself",
  "My First Attempt at Typesetting",
  "Will Be Fixed In The Volume Release",
  "Notes Longer Than The Chapter",
  "Hiatus Announcement",
  "Sorry For The Delay",
  "Quality Dropped Due To Deadline",
  "We Need More Redrawers",
  "Release Delayed Due To Exams",
  "Comment Section War",
  "TL Note: Keikaku Means Plan",
  "Alternate Translation Available",
  "Discontinued Due To DMCA",
  "Join Our Discord"
];

// Add more R cards to reach desired distribution
for (let i = 0; i < filler_titles.length; i++) {
  mockCards.push({
    id: `r-extra-${i}`,
    title: filler_titles[i],
    imageUrl: "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png",
    rarity: "R",
    series: ["Scanlation Problems", "Fan Translation Issues", "Manga Reader Woes"][Math.floor(Math.random() * 3)],
    tagline: "Common issues we all face",
    stars: 1,
    type: "manga",
    backgroundColor: "#D3D3D3"
  });
}

// Drop rates for different rarities
const DROP_RATES = {
  R: 0.79,    // 79%
  SR: 0.15,   // 15%
  SSR: 0.05,  // 5%
  UR: 0.01    // 1%
};

// Pity system configuration
const PITY = {
  SSR: 50,    // Guaranteed SSR every 50 pulls without an SSR
  UR: 100     // Guaranteed UR every 100 pulls without a UR
};

export default function GachaEnhanced() {
  const [inventory, setInventory] = useState<GachaCard[]>([]);
  const [collection, setCollection] = useState<{[id: string]: GachaCard & {count: number}}>({});
  const [currency, setCurrency] = useState(1000);  // Starting currency
  const [pulls, setPulls] = useState({ total: 0, sinceLastSSR: 0, sinceLastUR: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPull, setCurrentPull] = useState<GachaCard | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [pullAnimation, setPullAnimation] = useState<"normal" | "ssr-plus">("normal");
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("gacha_currency");
    const savedPulls = localStorage.getItem("gacha_pulls");
    const savedCollection = localStorage.getItem("gacha_collection");
    
    if (savedCurrency) setCurrency(parseInt(savedCurrency));
    if (savedPulls) setPulls(JSON.parse(savedPulls));
    if (savedCollection) setCollection(JSON.parse(savedCollection));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gacha_currency", currency.toString());
    localStorage.setItem("gacha_pulls", JSON.stringify(pulls));
    localStorage.setItem("gacha_collection", JSON.stringify(collection));
  }, [currency, pulls, collection]);

  // Enhanced pull animation sequence with more spectacular effects
  const animatePull = async (rarity: Rarity) => {
    // Set the animation type based on rarity
    const animationType = rarity === "UR" || rarity === "SSR" ? "ssr-plus" : "normal";
    setPullAnimation(animationType);
    
    // Initial build-up animation
    await controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.8, ease: "easeInOut" }
    });
    
    if (animationType === "ssr-plus") {
      // Special effects for high rarity cards
      
      // Fake-out animation (looks like an R card then changes)
      await controls.start({
        opacity: [1, 0.5, 1],
        scale: [1, 0.95, 1.15],
        transition: { duration: 1.2 }
      });
      
      // Burst animation
      await controls.start({
        scale: [1.15, 1.3, 1],
        rotate: [0, 5, -5, 0],
        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
        transition: { duration: 1.5, ease: "easeOut" }
      });
    } else {
      // Standard animation for normal cards
      await controls.start({
        rotateY: [0, 180],
        transition: { duration: 0.5 }
      });
    }
    
    // Final reveal
    await controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 }
    });
  };

  // Calculate the pull result based on rarities and pity system
  const calculatePullResult = (): GachaCard => {
    // Apply pity system
    let forcedRarity: Rarity | null = null;
    
    if (pulls.sinceLastUR >= PITY.UR - 1) {
      forcedRarity = "UR";
    } else if (pulls.sinceLastSSR >= PITY.SSR - 1) {
      forcedRarity = "SSR";
    }
    
    // Determine rarity based on probabilities or pity
    let rarity: Rarity;
    
    if (forcedRarity) {
      rarity = forcedRarity;
    } else {
      const rand = Math.random();
      if (rand < DROP_RATES.UR) {
        rarity = "UR";
      } else if (rand < DROP_RATES.UR + DROP_RATES.SSR) {
        rarity = "SSR";
      } else if (rand < DROP_RATES.UR + DROP_RATES.SSR + DROP_RATES.SR) {
        rarity = "SR";
      } else {
        rarity = "R";
      }
    }
    
    // Select a random card of the chosen rarity
    const cardsOfRarity = mockCards.filter(card => card.rarity === rarity);
    const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
    
    return randomCard;
  };

  // Perform a single gacha pull with enhanced animations
  const performPull = async (isFreePull = false) => {
    if (isAnimating) return;
    
    if (!isFreePull && currency < 100) {
      toast({
        title: "Not Enough DexCoins",
        description: "You need 100 DexCoins to pull.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnimating(true);
    
    if (!isFreePull) {
      setCurrency(prev => prev - 100); // Cost per pull
    }
    
    // Update pull counters
    const newPulls = { 
      total: pulls.total + 1,
      sinceLastSSR: pulls.sinceLastSSR + 1,
      sinceLastUR: pulls.sinceLastUR + 1
    };
    
    // Calculate pull result based on rates and pity
    const result = calculatePullResult();
    
    // Reset appropriate pity counters based on result
    if (result.rarity === "UR") {
      newPulls.sinceLastUR = 0;
      newPulls.sinceLastSSR = 0;
    } else if (result.rarity === "SSR") {
      newPulls.sinceLastSSR = 0;
    }
    
    setPulls(newPulls);
    
    // Add to inventory
    setInventory(prev => [...prev, result]);
    
    // Add to collection
    setCollection(prev => {
      const updated = {...prev};
      if (updated[result.id]) {
        updated[result.id] = {
          ...updated[result.id],
          count: updated[result.id].count + 1
        };
      } else {
        updated[result.id] = {
          ...result,
          count: 1
        };
      }
      return updated;
    });
    
    // First set a loading state for build-up
    setCurrentPull(null);
    
    // Add some dramatic delay based on rarity
    const delayTime = result.rarity === "UR" ? 2000 : 
                     result.rarity === "SSR" ? 1500 : 
                     result.rarity === "SR" ? 1000 : 500;
    
    await new Promise(resolve => setTimeout(resolve, delayTime));
    
    // Set current pull for animation
    setCurrentPull(result);
    
    // Start the pull animation
    await animatePull(result.rarity);
    
    // Show appropriate toast based on rarity
    const rarityMessages = {
      R: "Common card obtained",
      SR: "Super Rare! Not bad!",
      SSR: "Super Super Rare! Amazing pull!",
      UR: "ULTRA RARE! Incredible luck!"
    };
    
    toast({
      title: rarityMessages[result.rarity],
      description: `You obtained: ${result.title}`,
      variant: result.rarity === "UR" ? "destructive" : "default"
    });
    
    // If UR, add additional celebration effect
    if (result.rarity === "UR") {
      document.getElementById('main-container')?.classList.add('animate-glitch');
      setTimeout(() => {
        document.getElementById('main-container')?.classList.remove('animate-glitch');
      }, 1000);
    }
    
    setIsAnimating(false);
  };

  // Perform a multi-pull (10 cards) with enhanced animations
  const performMultiPull = async () => {
    if (isAnimating) return;
    
    if (currency < 900) { // 10% discount for multi-pull
      toast({
        title: "Not Enough DexCoins",
        description: "You need 900 DexCoins for a 10-pull (10% discount).",
        variant: "destructive"
      });
      return;
    }
    
    setCurrency(prev => prev - 900);
    
    const results: GachaCard[] = [];
    let guaranteedSR = false;
    
    // Check if any SR or higher was pulled
    for (let i = 0; i < 10; i++) {
      const result = calculatePullResult();
      if (result.rarity !== "R") {
        guaranteedSR = true;
      }
      results.push(result);
    }
    
    // If no SR or higher, replace last card with a guaranteed SR
    if (!guaranteedSR) {
      const srCards = mockCards.filter(card => card.rarity === "SR");
      const guaranteedCard = srCards[Math.floor(Math.random() * srCards.length)];
      results[9] = guaranteedCard;
    }
    
    // Update inventory and collection
    setInventory(prev => [...prev, ...results]);
    
    const newCollection = {...collection};
    results.forEach(card => {
      if (newCollection[card.id]) {
        newCollection[card.id] = {
          ...newCollection[card.id],
          count: newCollection[card.id].count + 1
        };
      } else {
        newCollection[card.id] = {
          ...card,
          count: 1
        };
      }
    });
    setCollection(newCollection);
    
    // Update pull counters
    const hasUR = results.some(card => card.rarity === "UR");
    const hasSSR = results.some(card => card.rarity === "SSR");
    
    setPulls(prev => ({
      total: prev.total + 10,
      sinceLastSSR: hasSSR ? 0 : prev.sinceLastSSR + 10,
      sinceLastUR: hasUR ? 0 : prev.sinceLastUR + 10
    }));
    
    // Show toast summary
    toast({
      title: "10-Pull Complete!",
      description: `Results: ${results.filter(c => c.rarity === "UR").length} UR, ${results.filter(c => c.rarity === "SSR").length} SSR, ${results.filter(c => c.rarity === "SR").length} SR, ${results.filter(c => c.rarity === "R").length} R`,
    });
    
    // Show inventory after multi-pull
    setShowInventory(true);
  };

  // Get currency by watching an ad (would actually integrate with ad network in a real app)
  const getCurrency = () => {
    toast({
      title: "Daily Reward!",
      description: "You've received 300 DexCoins!",
    });
    
    setCurrency(prev => prev + 300);
  };

  // Function to get color based on rarity
  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case "UR": return "bg-gradient-to-br from-red-500 via-pink-500 to-purple-500";
      case "SSR": return "bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600";
      case "SR": return "bg-gradient-to-br from-blue-400 to-indigo-600";
      case "R": 
      default: return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  };

  // Function to get glow based on rarity
  const getRarityGlow = (rarity: Rarity) => {
    switch (rarity) {
      case "UR": return "shadow-[0_0_25px_rgba(239,68,68,0.7)]";
      case "SSR": return "shadow-[0_0_20px_rgba(250,204,21,0.7)]";
      case "SR": return "shadow-[0_0_15px_rgba(96,165,250,0.7)]";
      case "R": 
      default: return "";
    }
  };

  // Function to display star rating
  const renderStars = (count: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-5 h-5 ${i < count ? "text-yellow-400" : "text-gray-600"}`}>
            ★
          </div>
        ))}
      </div>
    );
  };

  // Get text description for pity counters
  const getPityText = () => {
    const ssrGaugePercent = Math.min(100, (pulls.sinceLastSSR / PITY.SSR) * 100);
    const urGaugePercent = Math.min(100, (pulls.sinceLastUR / PITY.UR) * 100);
    
    return (
      <div className="mt-3 text-xs text-gray-400 space-y-2">
        <div>
          <div className="flex justify-between mb-1">
            <span>SSR Pity: {pulls.sinceLastSSR}/{PITY.SSR}</span>
            <span>{ssrGaugePercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-anime-gray h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500"
              style={{ width: `${ssrGaugePercent}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>UR Pity: {pulls.sinceLastUR}/{PITY.UR}</span>
            <span>{urGaugePercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-anime-gray h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-anime-red"
              style={{ width: `${urGaugePercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" id="main-container">
        <motion.h1 
          className="text-3xl md:text-4xl font-display font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-anime-cyberpunk-blue">[</span> 
          <span className="text-anime-red">DexGacha</span>システム
          <span className="text-anime-cyberpunk-blue">]</span>
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Collect rare manga series cards with humorous titles and taglines! With our pity system,
          you're guaranteed an SSR card every 50 pulls and a UR card every 100 pulls!
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Pull info */}
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
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center mr-3 text-anime-dark font-bold text-lg">
                    D
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">DEXCOINS</div>
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
            
            {/* Stats and rates */}
            <div className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-4 mb-6">
              <h2 className="text-lg font-display font-bold mb-3 flex items-center">
                <span className="text-anime-red mr-2">#</span> Pull Statistics
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-anime-dark rounded-lg">
                  <div className="text-2xl font-display font-bold">{pulls.total}</div>
                  <div className="text-xs text-gray-400">TOTAL PULLS</div>
                </div>
                <div className="text-center p-3 bg-anime-dark rounded-lg">
                  <div className="text-2xl font-display font-bold">{Object.keys(collection).length}</div>
                  <div className="text-xs text-gray-400">UNIQUE CARDS</div>
                </div>
              </div>
              
              {/* Pity counters */}
              <div className="mb-4">
                <h3 className="text-sm font-display font-bold mb-2 text-anime-cyberpunk-blue">PITY SYSTEM</h3>
                {getPityText()}
              </div>
              
              {/* Drop rates */}
              <div>
                <h3 className="text-sm font-display font-bold mb-2 text-anime-cyberpunk-blue">DROP RATES</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-white">UR (Ultra Rare)</span>
                    </div>
                    <span>1%</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      <span className="text-white">SSR (Super Super Rare)</span>
                    </div>
                    <span>5%</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      <span className="text-white">SR (Super Rare)</span>
                    </div>
                    <span>15%</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      <span className="text-white">R (Rare)</span>
                    </div>
                    <span>79%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* View inventory button */}
            <button
              onClick={() => setShowInventory(true)}
              className="w-full py-3 bg-anime-dark border border-anime-light-gray hover:border-anime-cyberpunk-blue rounded-lg text-sm transition-colors mb-4"
            >
              View Collection
            </button>
            
            {/* Japanese typography */}
            <div className="hidden lg:block relative h-60 mt-10 overflow-hidden">
              <motion.div 
                className="absolute -bottom-10 -right-10 text-anime-red/10 font-jp font-black text-9xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [-2, 2, -2],
                  transition: { 
                    y: { repeat: Infinity, duration: 10, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 20, ease: "easeInOut" }
                  }
                }}
              >
                ガチャ
              </motion.div>
            </div>
          </motion.div>
          
          {/* Center column - Current pull and buttons */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Pull area with enhanced animations */}
            <div className="flex flex-col items-center justify-center bg-anime-dark/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-8 mb-6 min-h-[500px] relative overflow-hidden">
              {/* Background effect */}
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-0 left-0 w-full h-px bg-anime-cyberpunk-blue/50 animate-[scanline_4s_linear_infinite]"></div>
                <div className="absolute top-1/4 left-0 w-full h-px bg-anime-red/30 animate-[scanline_6s_linear_infinite]"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-anime-cyberpunk-blue/30 animate-[scanline_5s_linear_infinite]"></div>
              </div>
              
              {currentPull ? (
                <motion.div 
                  className="relative"
                  ref={cardRef}
                  animate={controls}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Card container - Enhanced with visual elements from the example */}
                  <motion.div 
                    className={`relative w-80 h-[450px] rounded-xl overflow-hidden ${getRarityGlow(currentPull.rarity)}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Card background with custom color from card data */}
                    <div 
                      className={`absolute inset-0 ${currentPull.backgroundColor ? '' : getRarityColor(currentPull.rarity)}`}
                      style={currentPull.backgroundColor ? {backgroundColor: currentPull.backgroundColor} : {}}
                    ></div>
                    
                    {/* Card header with title */}
                    <div className="absolute top-0 left-0 right-0 p-3 bg-black/70">
                      <h3 className="text-white font-display font-bold text-xl text-center">{currentPull.title}</h3>
                    </div>
                    
                    {/* Card image */}
                    <div className="absolute inset-0 pt-14 pb-32 px-3">
                      <div className="relative h-full w-full overflow-hidden rounded-lg">
                        <img 
                          src={currentPull.imageUrl} 
                          alt={currentPull.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Rarity badge */}
                    <div className="absolute top-12 right-2 px-2 py-1 rounded bg-black/70 text-white text-sm font-digital">
                      {currentPull.rarity}
                    </div>
                    
                    {/* Star rating */}
                    <div className="absolute bottom-32 left-0 right-0 flex justify-center p-1 bg-black/60">
                      {renderStars(currentPull.stars)}
                    </div>
                    
                    {/* Card footer with series and tagline */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4">
                      <div className="text-anime-cyberpunk-blue font-bold mb-1">{currentPull.series}</div>
                      <p className="text-white text-sm italic">"{currentPull.tagline}"</p>
                    </div>
                  </motion.div>
                  
                  {/* Card details button */}
                  <button
                    onClick={() => setShowDetails(true)}
                    className="mt-6 px-6 py-2 bg-anime-cyberpunk-blue text-white rounded-full font-display hover:bg-opacity-80 transition-colors"
                  >
                    View Details
                  </button>
                </motion.div>
              ) : (
                <div className="text-center">
                  {isAnimating ? (
                    /* Pull animation - shows while pulling */
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="w-20 h-20 mb-8"
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ 
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <div className="w-full h-full rounded-full border-4 border-t-anime-red border-r-anime-cyberpunk-blue border-b-anime-red border-l-anime-cyberpunk-blue"></div>
                      </motion.div>
                      <h2 className="text-2xl font-display font-bold animate-pulse">Pulling...</h2>
                      <p className="text-gray-400 mt-2">Fate is being decided!</p>
                    </div>
                  ) : (
                    /* Idle state */
                    <div>
                      <motion.div 
                        className="text-6xl mb-6"
                        animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🎮
                      </motion.div>
                      <h2 className="text-xl font-display font-bold mb-3">Ready to Test Your Luck?</h2>
                      <p className="text-gray-400 mb-6 max-w-md">
                        Pull for rare manga series cards with humorous titles. 
                        The rarer the card, the more spectacular the animation!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Pull buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => performPull(true)}
                disabled={isAnimating}
                className="px-6 py-4 bg-anime-gray border border-anime-light-gray hover:border-anime-cyberpunk-blue rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div className="text-sm font-digital text-anime-cyberpunk-blue">FREE DAILY</div>
                <div className="font-display font-bold">Single Pull</div>
              </button>
              
              <button
                onClick={() => performPull()}
                disabled={isAnimating || currency < 100}
                className="px-6 py-4 bg-anime-gray border border-anime-light-gray hover:border-anime-red rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div className="text-sm font-digital text-anime-red">100 DEXCOINS</div>
                <div className="font-display font-bold">Single Pull</div>
              </button>
              
              <button
                onClick={performMultiPull}
                disabled={isAnimating || currency < 900}
                className="px-6 py-4 bg-anime-red hover:bg-opacity-90 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div className="text-sm font-digital">900 DEXCOINS</div>
                <div className="font-display font-bold">10x Pull (10% OFF)</div>
              </button>
            </div>
            
            {/* Tips */}
            <div className="mt-6 p-4 border border-anime-light-gray/30 rounded-lg bg-anime-dark/30 text-sm text-gray-400">
              <p>
                <span className="text-anime-cyberpunk-blue font-bold">TIP:</span> The pity system guarantees an SSR card every 50 pulls and a UR card every 100 pulls!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Card Details Modal - Enhanced with more info */}
      {showDetails && currentPull && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-anime-gray border border-anime-light-gray rounded-lg max-w-lg w-full mx-4 overflow-hidden"
          >
            <div className="relative">
              <div 
                className={`h-64`}
                style={currentPull.backgroundColor ? {backgroundColor: currentPull.backgroundColor} : {}}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={currentPull.imageUrl} 
                    alt={currentPull.title}
                    className="h-full w-auto object-contain"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-display font-bold">{currentPull.title}</h2>
                <span className={`px-3 py-1 rounded text-sm font-digital
                  ${currentPull.rarity === 'UR' ? 'bg-red-500/20 text-red-400' :
                    currentPull.rarity === 'SSR' ? 'bg-yellow-500/20 text-yellow-400' :
                    currentPull.rarity === 'SR' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {currentPull.rarity}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-400">SERIES</div>
                <div className="font-digital">{currentPull.series}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-400">TAGLINE</div>
                <div className="font-digital italic">"{currentPull.tagline}"</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-400">RATING</div>
                <div className="font-digital flex">
                  {renderStars(currentPull.stars)}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-400">TYPE</div>
                <div className="font-digital uppercase">{currentPull.type}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-400">CARD ID</div>
                <div className="font-digital">#{currentPull.id}</div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm text-gray-400">OWNED</div>
                <div className="font-digital">
                  {collection[currentPull.id]?.count || 0} copies
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-anime-red hover:bg-opacity-90 text-white rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Inventory/Collection Modal */}
      {showInventory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-anime-gray border border-anime-light-gray rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col"
          >
            <div className="p-6 border-b border-anime-light-gray flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold">Your Collection</h2>
              <button 
                onClick={() => setShowInventory(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-anime-dark text-white hover:bg-opacity-70 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto">
              {/* Collection stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-anime-dark p-3 rounded-lg text-center">
                  <div className="text-xl font-bold">{Object.keys(collection).length}</div>
                  <div className="text-xs text-gray-400">UNIQUE CARDS</div>
                </div>
                <div className="bg-anime-dark p-3 rounded-lg text-center">
                  <div className="text-xl font-bold">{Object.values(collection).filter(c => c.rarity === "UR").length}</div>
                  <div className="text-xs text-red-400">UR CARDS</div>
                </div>
                <div className="bg-anime-dark p-3 rounded-lg text-center">
                  <div className="text-xl font-bold">{Object.values(collection).filter(c => c.rarity === "SSR").length}</div>
                  <div className="text-xs text-yellow-400">SSR CARDS</div>
                </div>
                <div className="bg-anime-dark p-3 rounded-lg text-center">
                  <div className="text-xl font-bold">
                    {Object.values(collection).reduce((total, card) => total + card.count, 0)}
                  </div>
                  <div className="text-xs text-gray-400">TOTAL CARDS</div>
                </div>
              </div>
              
              {/* Filter tabs */}
              <div className="flex space-x-2 mb-6">
                {["All", "UR", "SSR", "SR", "R"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-3 py-1 rounded text-sm ${
                      filter === "All" ? "bg-anime-cyberpunk-blue text-black" : "bg-anime-dark"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              
              {/* Card grid - Styled to match the reference image */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Object.values(collection).map((card) => (
                  <div 
                    key={card.id}
                    className={`relative rounded-lg overflow-hidden border ${
                      card.rarity === "UR" ? "border-red-500 " + getRarityGlow("UR") :
                      card.rarity === "SSR" ? "border-yellow-500" :
                      card.rarity === "SR" ? "border-blue-500" :
                      "border-gray-500"
                    }`}
                    style={{backgroundColor: card.backgroundColor}}
                  >
                    {/* Card header with title */}
                    <div className="p-2 bg-black/70 text-center">
                      <h3 className="text-sm font-display font-bold truncate">{card.title}</h3>
                    </div>
                    
                    {/* Card image */}
                    <div className="h-32 bg-anime-dark flex items-center justify-center overflow-hidden">
                      <img 
                        src={card.imageUrl} 
                        alt={card.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    {/* Card footer with tagline and rarity */}
                    <div className="p-2 bg-black/70 min-h-[60px]">
                      <div className="text-xs italic mb-1 text-gray-300 line-clamp-2">
                        "{card.tagline}"
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${
                          card.rarity === "UR" ? "bg-red-500/20 text-red-400" :
                          card.rarity === "SSR" ? "bg-yellow-500/20 text-yellow-400" :
                          card.rarity === "SR" ? "bg-blue-500/20 text-blue-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {card.rarity}
                        </span>
                        <span className="text-xs text-gray-400">x{card.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {Object.keys(collection).length === 0 && (
                  <div className="col-span-full text-center py-10 text-gray-400">
                    <p>You haven't collected any cards yet.</p>
                    <p className="mt-2">Pull the gacha to start your collection!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
