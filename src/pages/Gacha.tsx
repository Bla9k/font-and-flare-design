
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { GachaSeriesCard, GachaBanner } from "@/types/anime";
import { Package, Star, Gift, ChevronDown, ChevronUp, Plus, CircleCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

// Generate a large collection of reliable image URLs
const generateReliableImageUrls = () => {
  // Base URLs that are known to be reliable
  const baseUrls = [
    "https://cdn.myanimelist.net/images/anime/",
    "https://cdn.myanimelist.net/images/manga/"
  ];
  
  // Different image subfolders and IDs
  const imageParams = [
    "13/80230l.jpg", "9/9453l.jpg", "1429/95946l.jpg", "2/20668l.jpg", 
    "6/73245l.jpg", "1411/113957l.jpg", "5/79013l.jpg", "1630/106551l.jpg",
    "1223/121007l.jpg", "11/39717l.jpg", "1904/121060l.jpg", "5/73199l.jpg",
    "1964/110662l.jpg", "7/76014l.jpg", "9/77928l.jpg", "12/76049l.jpg",
    "1208/109612l.jpg", "1079/112077l.jpg", "1425/94084l.jpg", "1918/104249l.jpg",
    "7/21570l.jpg", "5/75639l.jpg", "1368/117005l.jpg", "4/86334l.jpg",
    "1440/99748l.jpg", "1537/95151l.jpg", "1000/110336l.jpg", "1614/108104l.jpg",
    "6/86733l.jpg", "13/77928l.jpg", "5/64449l.jpg", "10/67145l.jpg",
    "1614/90408l.jpg", "8/77928l.jpg", "1763/95143l.jpg", "13/59897l.jpg",
    "13/75587l.jpg", "7/76014l.jpg", "1806/96777l.jpg", "1015/124945l.jpg"
  ];
  
  // Generate a large pool of URLs by combining baseUrls and imageParams
  const urls: string[] = [];
  for (let i = 0; i < 10; i++) {
    baseUrls.forEach(baseUrl => {
      imageParams.forEach(param => {
        urls.push(`${baseUrl}${param}`);
      });
    });
  }
  
  return urls;
};

// Create a pool of reliable image URLs
const reliableImageUrls = generateReliableImageUrls();

// Generate a collection of fantasy anime titles
const generateAnimeTitle = () => {
  const prefixes = ["Rising of the", "Sword Art", "Attack on", "My Hero", "Demon", "Jujutsu", "Dragon", "One", "Hunter x", "Tokyo", "Fullmetal", "Death", "Code", "Steins;", "Re:", "Neon Genesis", "Cowboy", "Ghost in the", "Mobile Suit", "Violet"];
  const middleParts = ["Crystal", "Eternal", "Divine", "Shadow", "Mystic", "Fallen", "Galactic", "Ancient", "Crimson", "Azure", "Golden", "Silver", "Emerald", "Quantum", "Radiant", "Astral", "Celestial", "Phantom", "Dark", "Light"];
  const suffixes = ["Alchemist", "Guardian", "Chronicles", "Academy", "Legends", "Fantasy", "Odyssey", "Destiny", "Quest", "Adventure", "Hunters", "Arcana", "Kingdom", "Blade", "Gate", "Slayer", "Wanderer", "Reverie", "Protocol", "Horizon"];
  
  // Get random elements
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const middlePart = middleParts[Math.floor(Math.random() * middleParts.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  // Different patterns to create variety
  const patterns = [
    () => `${prefix} ${middlePart} ${suffix}`,
    () => `${prefix} ${suffix}`,
    () => `${middlePart} ${suffix}`,
    () => `${prefix}: ${middlePart} ${suffix}`,
    () => `${middlePart} ${suffix}: ${prefix}`,
    () => `${prefix}'s ${middlePart} ${suffix}`
  ];
  
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  return selectedPattern();
};

// Generate description for gacha series
const generateDescription = () => {
  const intros = [
    "An epic tale of",
    "A heartwarming story about",
    "The thrilling adventure of",
    "A mysterious journey into",
    "The legendary saga of",
    "A futuristic vision of",
    "The comedic misadventures of",
    "A dark fantasy featuring",
    "The romantic entanglement between",
    "A nostalgic reflection on"
  ];
  
  const subjects = [
    "young heroes",
    "ancient gods",
    "mech pilots",
    "magical girls",
    "demon hunters",
    "alchemists",
    "samurai warriors",
    "spellcasters",
    "space explorers",
    "rival schools"
  ];
  
  const actions = [
    "fighting to save their world",
    "discovering hidden powers",
    "competing in tournaments",
    "navigating high school drama",
    "uncovering cosmic secrets",
    "seeking revenge",
    "finding redemption",
    "building unlikely friendships",
    "challenging destiny",
    "breaking ancient curses"
  ];
  
  const endings = [
    "against all odds.",
    "with unexpected consequences.",
    "while growing up together.",
    "in a world on the brink of collapse.",
    "across multiple dimensions.",
    "before time runs out.",
    "with humor and heart.",
    "despite their differences.",
    "beyond the reaches of imagination.",
    "as prophesied long ago."
  ];
  
  const intro = intros[Math.floor(Math.random() * intros.length)];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  
  return `${intro} ${subject} ${action} ${ending}`;
};

// Generate color scheme
const generateColorScheme = () => {
  const colorSchemes = ["red", "blue", "green", "purple", "yellow", "orange", "pink", "cyan", "teal", "indigo"];
  return colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
};

// Generate rarity with weighted probabilities
const generateRarity = () => {
  const rand = Math.random();
  if (rand < 0.03) return "UR"; // Ultra Rare: 3%
  if (rand < 0.10) return "SSR"; // Super Super Rare: 7%
  if (rand < 0.30) return "SR"; // Super Rare: 20%
  if (rand < 0.70) return "R"; // Rare: 40%
  return "N"; // Normal: 30%
};

// Generate artist name
const generateArtist = () => {
  const firstNames = ["Akira", "Yuki", "Hiro", "Mei", "Takeshi", "Kaori", "Ryo", "Sakura", "Kenji", "Aoi"];
  const lastNames = ["Tanaka", "Suzuki", "Yamamoto", "Nakamura", "Ito", "Watanabe", "Kobayashi", "Sato", "Takahashi", "Kimura"];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Generate anime universe
const generateUniverse = () => {
  const universes = [
    "Shonen Jump", "Magic Academy", "Isekai World", "Cyberpunk Neo-Tokyo", "Fantasy Realm",
    "Space Federation", "Mythological Era", "Post-Apocalyptic Earth", "Alternate History",
    "Magical Kingdom", "Demon World", "Virtual Reality", "Feudal Japan", "Steampunk Revolution",
    "Divine Pantheon", "Academy City", "Dragon Lands", "Underworld", "Celestial Plane", "Spirit World"
  ];
  
  return universes[Math.floor(Math.random() * universes.length)];
};

// Generate release date
const generateReleaseDate = () => {
  const year = 2022 + Math.floor(Math.random() * 4); // 2022-2025
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// Generate speciality
const generateSpecialty = () => {
  const specialties = [
    "High DPS", "Tank", "Support", "Healer", "Crowd Control", 
    "Debuffer", "Buffer", "AoE Damage", "Single Target", "Summoner",
    "Assassin", "Ranged", "Melee", "Magic", "Physical", 
    "Hybrid", "Transformation", "Stealth", "Counter", "Combo"
  ];
  
  return specialties[Math.floor(Math.random() * specialties.length)];
};

// Generate power level
const generatePowerLevel = (rarity: string) => {
  switch(rarity) {
    case "UR": return 85 + Math.floor(Math.random() * 16); // 85-100
    case "SSR": return 70 + Math.floor(Math.random() * 15); // 70-84
    case "SR": return 50 + Math.floor(Math.random() * 20); // 50-69
    case "R": return 30 + Math.floor(Math.random() * 20); // 30-49
    default: return 10 + Math.floor(Math.random() * 20); // 10-29
  }
};

// Generate collection value
const generateCollectionValue = (rarity: string) => {
  switch(rarity) {
    case "UR": return 5000 + Math.floor(Math.random() * 5000); // 5000-10000
    case "SSR": return 2000 + Math.floor(Math.random() * 3000); // 2000-5000
    case "SR": return 500 + Math.floor(Math.random() * 1500); // 500-2000
    case "R": return 100 + Math.floor(Math.random() * 400); // 100-500
    default: return 10 + Math.floor(Math.random() * 90); // 10-100
  }
};

// Generate a large set of series data
const generateLargeMockSeries = (count: number): GachaSeriesCard[] => {
  const series: GachaSeriesCard[] = [];
  
  for (let i = 1; i <= count; i++) {
    const rarity = generateRarity();
    series.push({
      id: i,
      title: generateAnimeTitle(),
      imageUrl: reliableImageUrls[Math.floor(Math.random() * reliableImageUrls.length)],
      description: generateDescription(),
      rating: 1 + Math.floor(Math.random() * 5),
      colorScheme: generateColorScheme(),
      coins: 1000 + Math.floor(Math.random() * 100000),
      rarity: rarity,
      specialty: generateSpecialty(),
      releaseDate: generateReleaseDate(),
      limited: Math.random() < 0.2, // 20% chance to be limited
      artist: generateArtist(),
      universe: generateUniverse(),
      powerLevel: generatePowerLevel(rarity),
      collectionValue: generateCollectionValue(rarity)
    });
  }
  
  return series;
};

// Generate featured banners
const generateFeaturedBanners = (seriesData: GachaSeriesCard[]): GachaBanner[] => {
  // Create different banner types
  const bannerTypes: GachaBanner[] = [
    {
      id: 1,
      title: "SUMMER PARADISE",
      description: "Limited time summer-themed series with special bonus content!",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1223/121007l.jpg",
      featuredSeries: [1, 7, 15, 22, 38], 
      endDate: "2025-08-15",
      colorScheme: "blue",
      bannerType: "seasonal",
      boost: 1.5,
      bonusItems: ["Summer Outfit Voucher", "Beach Background"]
    },
    {
      id: 2,
      title: "LEGEND REVIVAL",
      description: "A collection of the most legendary series with enhanced editions",
      imageUrl: "https://cdn.myanimelist.net/images/anime/11/39717l.jpg",
      featuredSeries: [2, 4, 16, 29, 45],
      endDate: "2025-09-01",
      colorScheme: "green",
      bannerType: "standard",
      boost: 1.2,
      bonusItems: ["Legendary Frame", "Exclusive Title"]
    },
    {
      id: 3,
      title: "NEO FUTURE",
      description: "The best science fiction series across all dimensions",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1904/121060l.jpg",
      featuredSeries: [3, 5, 10, 27, 42],
      endDate: "2025-07-30",
      colorScheme: "purple",
      bannerType: "collaboration",
      boost: 1.8,
      bonusItems: ["Sci-Fi Avatar", "Futuristic Border"]
    },
    {
      id: 4,
      title: "MYSTIC REALMS",
      description: "Journey into mystical worlds with magical characters",
      imageUrl: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
      featuredSeries: [8, 12, 19, 31, 50],
      endDate: "2025-10-15",
      colorScheme: "cyan",
      bannerType: "limited",
      boost: 2.0,
      bonusItems: ["Spell Effect Animation", "Enchanted Card Back"]
    },
    {
      id: 5,
      title: "HEROES UNITE",
      description: "The ultimate collection of heroic characters from across universes",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1079/112077l.jpg",
      featuredSeries: [6, 14, 23, 36, 49],
      endDate: "2025-11-01",
      colorScheme: "red",
      bannerType: "collaboration",
      boost: 1.5,
      bonusItems: ["Hero Badge", "Victory Animation"]
    },
    {
      id: 6,
      title: "ACADEMY LIFE",
      description: "Experience school drama and friendship in these slice-of-life series",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1368/117005l.jpg",
      featuredSeries: [9, 17, 25, 33, 47],
      endDate: "2025-09-15",
      colorScheme: "pink",
      bannerType: "standard",
      boost: 1.3,
      bonusItems: ["School Uniform", "Classroom Background"]
    }
  ];
  
  return bannerTypes;
};

// Generate the mock series with 500+ entries
const mockSeries = generateLargeMockSeries(500);

// Featured banners
const featuredBanners = generateFeaturedBanners(mockSeries);

export default function Gacha() {
  // State variables
  const [currency, setCurrency] = useState(1000);
  const [showCollection, setShowCollection] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<GachaSeriesCard | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ownedSeries, setOwnedSeries] = useState<{[id: number]: boolean}>({});
  const [activeBanner, setActiveBanner] = useState<number>(1);
  const [pityCounter, setPityCounter] = useState(0);
  const [showPullResult, setShowPullResult] = useState(false);
  const [pullResult, setPullResult] = useState<GachaSeriesCard | null>(null);
  const [showBanners, setShowBanners] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "rarity" | "power" | "value">("rarity");
  const [showFilters, setShowFilters] = useState(false);
  const [universeFilter, setUniverseFilter] = useState<string>("all");
  const [showMultiPullResults, setShowMultiPullResults] = useState(false);
  const [multiPullResults, setMultiPullResults] = useState<GachaSeriesCard[]>([]);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(true);
  
  const seriesContainerRef = useRef<HTMLDivElement>(null);
  
  // Extract unique universes for filtering
  const universes = Array.from(new Set(mockSeries.map(series => series.universe)));
  
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

  // Implement infinite scrolling
  useEffect(() => {
    if (!infiniteScrollEnabled) return;
    
    const handleScroll = () => {
      if (seriesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 300) {
          // Add more items when user scrolls near bottom
          setVisibleSeries(prev => Math.min(prev + 8, mockSeries.length));
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [infiniteScrollEnabled]);

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
      const currentBanner = featuredBanners.find(b => b.id === activeBanner);
      const boostRate = currentBanner?.boost || 1;
      
      // Base pull rates with banner boost
      let pullRates = [
        0.01 * boostRate, // UR rate
        0.07 * boostRate, // SSR rate
        0.20 * boostRate, // SR rate 
        0.42 * boostRate, // R rate
        0.30           // Normal rate (remaining probability)
      ];
      
      // If pity counter is at 90 or above, guaranteed SSR or above
      if (pityCounter >= 89) {
        pullRates = [0.15, 0.85, 0, 0, 0]; // 15% UR, 85% SSR
        setPityCounter(0); // Reset pity after getting SSR or above
        toast({
          title: "Pity Activated!",
          description: "Your pity counter reached 90 - guaranteed SSR pull or higher!",
        });
      }
      
      // Get all series of each rarity
      const urSeries = mockSeries.filter(s => s.rarity === "UR");
      const ssrSeries = mockSeries.filter(s => s.rarity === "SSR");
      const srSeries = mockSeries.filter(s => s.rarity === "SR");
      const rSeries = mockSeries.filter(s => s.rarity === "R");
      const nSeries = mockSeries.filter(s => s.rarity === "N");
      
      // Featured series have higher rates within their rarity
      const featuredSeriesIds = currentBanner?.featuredSeries || [];
      const featuredUr = urSeries.filter(s => featuredSeriesIds.includes(s.id));
      const featuredSsr = ssrSeries.filter(s => featuredSeriesIds.includes(s.id));
      const featuredSr = srSeries.filter(s => featuredSeriesIds.includes(s.id));
      const featuredR = rSeries.filter(s => featuredSeriesIds.includes(s.id));
      
      // Determine which rarity is pulled based on rates
      const roll = Math.random();
      let result: GachaSeriesCard | null = null;
      
      if (roll < pullRates[0]) {
        // UR pull
        if (featuredUr.length > 0 && Math.random() < 0.7) {
          // 70% chance to pull featured UR if available
          result = featuredUr[Math.floor(Math.random() * featuredUr.length)];
        } else {
          result = urSeries[Math.floor(Math.random() * urSeries.length)];
        }
      } else if (roll < pullRates[0] + pullRates[1]) {
        // SSR pull
        if (featuredSsr.length > 0 && Math.random() < 0.7) {
          // 70% chance to pull featured SSR if available
          result = featuredSsr[Math.floor(Math.random() * featuredSsr.length)];
        } else {
          result = ssrSeries[Math.floor(Math.random() * ssrSeries.length)];
        }
      } else if (roll < pullRates[0] + pullRates[1] + pullRates[2]) {
        // SR pull
        if (featuredSr.length > 0 && Math.random() < 0.5) {
          // 50% chance to pull featured SR if available
          result = featuredSr[Math.floor(Math.random() * featuredSr.length)];
        } else {
          result = srSeries[Math.floor(Math.random() * srSeries.length)];
        }
      } else if (roll < pullRates[0] + pullRates[1] + pullRates[2] + pullRates[3]) {
        // R pull
        if (featuredR.length > 0 && Math.random() < 0.3) {
          // 30% chance to pull featured R if available
          result = featuredR[Math.floor(Math.random() * featuredR.length)];
        } else {
          result = rSeries[Math.floor(Math.random() * rSeries.length)];
        }
      } else {
        // N pull
        result = nSeries[Math.floor(Math.random() * nSeries.length)];
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
      const currentBanner = featuredBanners.find(b => b.id === activeBanner);
      const boostRate = currentBanner?.boost || 1;
      
      // For 10x pull, guarantee at least one SR or above
      let results: GachaSeriesCard[] = [];
      let hasHighRarity = false;
      
      // Check if pity should activate
      const pityShouldActivate = pityCounter >= 89;
      if (pityShouldActivate) {
        setPityCounter(0);
        toast({
          title: "Pity Activated!",
          description: "Your pity counter reached 90 - guaranteed SSR pull or higher!",
        });
      }
      
      const featuredSeriesIds = currentBanner?.featuredSeries || [];
      
      // Get all series of each rarity
      const urSeries = mockSeries.filter(s => s.rarity === "UR");
      const ssrSeries = mockSeries.filter(s => s.rarity === "SSR");
      const srSeries = mockSeries.filter(s => s.rarity === "SR");
      const rSeries = mockSeries.filter(s => s.rarity === "R");
      const nSeries = mockSeries.filter(s => s.rarity === "N");
      
      // Featured series have higher rates within their rarity
      const featuredUr = urSeries.filter(s => featuredSeriesIds.includes(s.id));
      const featuredSsr = ssrSeries.filter(s => featuredSeriesIds.includes(s.id));
      const featuredSr = srSeries.filter(s => featuredSeriesIds.includes(s.id));
      const featuredR = rSeries.filter(s => featuredSeriesIds.includes(s.id));
      
      // Fill results array with 10 pulls
      for (let i = 0; i < 10; i++) {
        // Base pull rates with banner boost
        let pullRates = [
          0.01 * boostRate, // UR rate
          0.07 * boostRate, // SSR rate
          0.20 * boostRate, // SR rate 
          0.42 * boostRate, // R rate
          0.30           // Normal rate (remaining probability)
        ];
        
        // First pull uses pity if applicable
        if (i === 0 && pityShouldActivate) {
          pullRates = [0.15, 0.85, 0, 0, 0]; // 15% UR, 85% SSR
        }
        
        // Determine which rarity is pulled based on rates
        const roll = Math.random();
        let result: GachaSeriesCard | null = null;
        
        if (roll < pullRates[0]) {
          // UR pull
          if (featuredUr.length > 0 && Math.random() < 0.7) {
            result = featuredUr[Math.floor(Math.random() * featuredUr.length)];
          } else {
            result = urSeries[Math.floor(Math.random() * urSeries.length)];
          }
          hasHighRarity = true;
        } else if (roll < pullRates[0] + pullRates[1]) {
          // SSR pull
          if (featuredSsr.length > 0 && Math.random() < 0.7) {
            result = featuredSsr[Math.floor(Math.random() * featuredSsr.length)];
          } else {
            result = ssrSeries[Math.floor(Math.random() * ssrSeries.length)];
          }
          hasHighRarity = true;
        } else if (roll < pullRates[0] + pullRates[1] + pullRates[2]) {
          // SR pull
          if (featuredSr.length > 0 && Math.random() < 0.5) {
            result = featuredSr[Math.floor(Math.random() * featuredSr.length)];
          } else {
            result = srSeries[Math.floor(Math.random() * srSeries.length)];
          }
          hasHighRarity = true;
        } else if (roll < pullRates[0] + pullRates[1] + pullRates[2] + pullRates[3]) {
          // R pull
          if (featuredR.length > 0 && Math.random() < 0.3) {
            result = featuredR[Math.floor(Math.random() * featuredR.length)];
          } else {
            result = rSeries[Math.floor(Math.random() * rSeries.length)];
          }
        } else {
          // N pull
          result = nSeries[Math.floor(Math.random() * nSeries.length)];
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
        results[9] = srSeries[Math.floor(Math.random() * srSeries.length)];
        
        setOwnedSeries(prev => ({
          ...prev,
          [results[9].id]: true
        }));
      }
      
      // Set multi-pull results
      setMultiPullResults(results);
      setShowMultiPullResults(true);
      
      // Show the highest rarity result for immediate display
      const bestResult = results.reduce((best, current) => {
        const rarityValue = (series: GachaSeriesCard) => {
          if (series.rarity === "UR") return 4;
          if (series.rarity === "SSR") return 3;
          if (series.rarity === "SR") return 2;
          if (series.rarity === "R") return 1;
          return 0;
        };
        
        return rarityValue(current) > rarityValue(best) ? current : best;
      }, results[0]);
      
      setPullResult(bestResult);
      setShowPullResult(true);
      
      // Log the stats of the pull
      const urCount = results.filter(r => r.rarity === "UR").length;
      const ssrCount = results.filter(r => r.rarity === "SSR").length;
      const srCount = results.filter(r => r.rarity === "SR").length;
      const rCount = results.filter(r => r.rarity === "R").length;
      const nCount = results.filter(r => r.rarity === "N").length;
      
      toast({
        title: "10x Pull Complete!",
        description: `You obtained ${urCount > 0 ? `${urCount} UR, ` : ''}${ssrCount} SSR, ${srCount} SR, ${rCount} R, and ${nCount} N series!`,
      });
      
      setIsAnimating(false);
    }, 1500);
  };
  
  // Pull for a specific series
  const pullSeries = (series: GachaSeriesCard) => {
    if (isAnimating || ownedSeries[series.id]) return;
    
    const rarityPrices: Record<string, number> = {
      "UR": 3000,
      "SSR": 1500,
      "SR": 800,
      "R": 300,
      "N": 100
    };
    
    const cost = rarityPrices[series.rarity || "R"];
    
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
      
      // Set as pull result to show the animation
      setPullResult(series);
      setShowPullResult(true);
    }, 800);
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
      case "pink":
        return "bg-gradient-to-b from-pink-500/40 via-pink-300/30 to-pink-400/40";
      case "cyan":
        return "bg-gradient-to-b from-cyan-500/40 via-cyan-300/30 to-cyan-400/40";
      case "teal":
        return "bg-gradient-to-b from-teal-500/40 via-teal-300/30 to-teal-400/40";
      case "indigo":
        return "bg-gradient-to-b from-indigo-500/40 via-indigo-300/30 to-indigo-400/40";
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
      case "pink":
        return "border-pink-400";
      case "cyan":
        return "border-cyan-400";
      case "teal":
        return "border-teal-400";
      case "indigo":
        return "border-indigo-400";
      default:
        return "border-gray-400";
    }
  };
  
  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "UR":
        return "bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-rose-500/50";
      case "SSR":
        return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black shadow-yellow-500/50";
      case "SR":
        return "bg-gradient-to-r from-purple-300 to-purple-600 text-white shadow-purple-500/50";
      case "R":
        return "bg-gradient-to-r from-blue-300 to-blue-500 text-white shadow-blue-500/50";
      default:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-gray-500/20";
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
        case "pink": return "text-pink-400";
        case "cyan": return "text-cyan-400";
        case "teal": return "text-teal-400";
        case "indigo": return "text-indigo-400";
        default: return "text-gray-400";
      }
    };

    return (
      <div className="flex mt-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            size={16}
            className={cn(
              "mr-0.5",
              i < rating ? getStarColor() : "text-gray-600 opacity-50"
            )}
            fill={i < rating ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };
  
  // Filter series by search term, rarity and universe
  const filteredSeries = mockSeries.filter(series => {
    const matchesSearch = series.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (series.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (series.artist?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRarity = rarityFilter === "all" || series.rarity === rarityFilter;
    const matchesUniverse = universeFilter === "all" || series.universe === universeFilter;
    
    return matchesSearch && matchesRarity && matchesUniverse;
  });
  
  // Sort filtered series
  const sortedSeries = [...filteredSeries].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.releaseDate || "").getTime() - new Date(a.releaseDate || "").getTime();
      case "rarity":
        const rarityOrder: Record<string, number> = { "UR": 5, "SSR": 4, "SR": 3, "R": 2, "N": 1 };
        return (rarityOrder[b.rarity || "N"] || 0) - (rarityOrder[a.rarity || "N"] || 0);
      case "power":
        return (b.powerLevel || 0) - (a.powerLevel || 0);
      case "value":
        return (b.collectionValue || 0) - (a.collectionValue || 0);
      default:
        return (rarityOrder[b.rarity || "N"] || 0) - (rarityOrder[a.rarity || "N"] || 0);
    }
  });
  
  // Get visible series for display (with pagination)
  const visibleSeriesList = sortedSeries.slice(0, visibleSeries);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced header with animated glow */}
        <motion.div 
          className="text-center relative mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-anime-cyberpunk-blue/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 relative z-10">
            <span className="text-anime-cyberpunk-blue">[</span> 
            <span className="bg-gradient-to-r from-anime-red to-anime-cyberpunk-blue bg-clip-text text-transparent">SERIES</span>
            <span className="font-digital">ガチャ</span>
            <span className="text-anime-cyberpunk-blue">]</span>
          </h1>
          
          <motion.p 
            className="text-center text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Unlock complete manga and anime series in our gacha system!
            Each series contains characters, stories, and exclusive rewards.
          </motion.p>
        </motion.div>
        
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
          
          {/* Current featured banner with enhanced visuals */}
          <div className="relative h-60 md:h-80 rounded-lg overflow-hidden border border-anime-gray shadow-xl">
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img 
              src={featuredBanners[activeBanner - 1].imageUrl} 
              alt={featuredBanners[activeBanner - 1].title} 
              className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="mb-1 inline-block px-2 py-0.5 bg-anime-red/80 text-xs rounded-sm font-digital">
                  {featuredBanners[activeBanner - 1].bannerType?.toUpperCase()}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                  {featuredBanners[activeBanner - 1].title}
                </h3>
                <p className="text-gray-300 mb-4 max-w-3xl">
                  {featuredBanners[activeBanner - 1].description}
                </p>
                
                <div className="mb-2 text-sm text-anime-cyberpunk-blue">
                  <span className="font-digital">RATE UP:</span> {featuredBanners[activeBanner - 1].boost}x
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredBanners[activeBanner - 1].featuredSeries.map(seriesId => {
                    const series = mockSeries.find(s => s.id === seriesId);
                    if (!series) return null;
                    return (
                      <div 
                        key={seriesId} 
                        className={`flex items-center bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-${series.colorScheme}-500/50`}
                      >
                        <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-white/30">
                          <img src={series.imageUrl} alt={series.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-white mr-1">{series.title}</span>
                        <span className={`text-xs px-1 rounded ${getRarityBadgeColor(series.rarity || 'R')}`}>
                          {series.rarity}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pull buttons with enhanced styling */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={singlePull}
                    className="px-4 py-2 bg-gradient-to-r from-anime-cyberpunk-blue/80 to-blue-400/80 hover:from-anime-cyberpunk-blue to-blue-400 text-black font-semibold rounded transition-all duration-300 shadow-lg shadow-anime-cyberpunk-blue/20 flex items-center"
                    disabled={isAnimating}
                  >
                    <span className="mr-2">Single Pull</span>
                    <span className="bg-black/30 px-2 py-0.5 rounded text-white text-xs">200 💎</span>
                  </button>
                  <button
                    onClick={multiPull}
                    className="px-4 py-2 bg-gradient-to-r from-anime-red/80 to-rose-500/80 hover:from-anime-red to-rose-500 text-white font-semibold rounded transition-all duration-300 shadow-lg shadow-anime-red/20 flex items-center"
                    disabled={isAnimating}
                  >
                    <span className="mr-2">10x Pull</span>
                    <span className="bg-black/30 px-2 py-0.5 rounded text-white text-xs">2000 💎</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Banner navigation dots */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-1 z-30">
              {featuredBanners.map((banner, idx) => (
                <motion.button
                  key={banner.id}
                  onClick={() => setActiveBanner(banner.id)}
                  className={`w-2 h-2 rounded-full ${
                    activeBanner === banner.id ? 'bg-anime-cyberpunk-blue shadow-[0_0_5px_1px_rgba(0,240,255,0.7)]' : 'bg-gray-400/50'
                  }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
          
          {/* Pity counter display with improved visuals */}
          <div className="mt-4 bg-anime-dark/60 backdrop-blur-sm border border-anime-light-gray/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-400 font-digital">PITY COUNTER:</div>
              <div className="text-xs font-digital">
                <span className={pityCounter >= 80 ? "text-anime-red animate-pulse" : "text-gray-300"}>
                  {pityCounter}/90
                </span>
              </div>
            </div>
            
            <div className="h-2 bg-anime-dark rounded-full overflow-hidden flex-1 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-anime-cyberpunk-blue via-purple-500 to-anime-red"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(pityCounter / 90 * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>90</span>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left column - Currency info and filters */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Currency display with enhanced UI */}
            <div className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-4 mb-6 shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-anime-red/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-8 -top-8 w-32 h-32 bg-anime-cyberpunk-blue/10 rounded-full blur-3xl"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mr-3 shadow-lg shadow-yellow-500/20 border border-yellow-400/50">
                    <span className="text-black text-xl font-bold">💎</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-digital">CURRENCY</div>
                    <div className="text-2xl font-display font-bold">{currency.toLocaleString()}</div>
                  </div>
                </div>
                <button 
                  onClick={getCurrency}
                  className="px-3 py-2 bg-gradient-to-r from-anime-cyberpunk-blue/30 to-anime-cyberpunk-blue/10 hover:from-anime-cyberpunk-blue/40 hover:to-anime-cyberpunk-blue/20 border border-anime-cyberpunk-blue/30 rounded text-sm transition-all duration-300 shadow-md"
                >
                  <span className="font-digital">Get Daily</span>
                </button>
              </div>
            </div>
            
            {/* Search and filters panel */}
            <div className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-4 mb-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-medium">
                  <span className="text-anime-cyberpunk-blue mr-2">◉</span> 
                  Filters
                </h3>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-sm flex items-center text-gray-400 hover:text-white"
                >
                  {showFilters ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                </button>
              </div>
              
              {/* Search input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-anime-dark border border-anime-light-gray/50 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-anime-cyberpunk-blue text-sm"
                />
              </div>
              
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Rarity filter */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Rarity</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["all", "UR", "SSR", "SR", "R", "N"].map(rarity => (
                        <button
                          key={rarity}
                          onClick={() => setRarityFilter(rarity)}
                          className={`py-1 px-2 text-xs rounded-md ${
                            rarityFilter === rarity
                              ? "bg-anime-cyberpunk-blue text-black font-medium"
                              : "bg-anime-dark text-gray-400 hover:bg-anime-gray"
                          }`}
                        >
                          {rarity === "all" ? "All" : rarity}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Universe filter */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Universe</label>
                    <select
                      value={universeFilter}
                      onChange={(e) => setUniverseFilter(e.target.value)}
                      className="w-full bg-anime-dark border border-anime-light-gray/50 rounded-md px-3 py-2 focus:outline-none text-sm appearance-none"
                    >
                      <option value="all">All Universes</option>
                      {universes.map((universe, index) => (
                        <option key={index} value={universe}>{universe}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Sort options */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "rarity", label: "Rarity" },
                        { key: "power", label: "Power" },
                        { key: "newest", label: "Newest" },
                        { key: "value", label: "Value" }
                      ].map(option => (
                        <button
                          key={option.key}
                          onClick={() => setSortBy(option.key as any)}
                          className={`py-1 px-2 text-xs rounded-md ${
                            sortBy === option.key
                              ? "bg-anime-red text-white font-medium"
                              : "bg-anime-dark text-gray-400 hover:bg-anime-gray"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* View options */}
                  <div className="mb-2">
                    <label className="block text-sm text-gray-400 mb-2">View Mode</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex-1 py-1 px-2 text-xs rounded-md flex items-center justify-center ${
                          viewMode === "grid"
                            ? "bg-anime-cyberpunk-blue text-black font-medium"
                            : "bg-anime-dark text-gray-400 hover:bg-anime-gray"
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`flex-1 py-1 px-2 text-xs rounded-md flex items-center justify-center ${
                          viewMode === "list"
                            ? "bg-anime-cyberpunk-blue text-black font-medium"
                            : "bg-anime-dark text-gray-400 hover:bg-anime-gray"
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Collection stats with improved visuals */}
            <div className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-4 mb-6 shadow-lg">
              <h3 className="text-lg font-display font-medium mb-3 flex items-center">
                <span className="text-anime-cyberpunk-blue mr-2">◉</span> 
                Collection
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-anime-dark rounded-lg border border-anime-light-gray/30">
                  <div className="text-2xl font-display font-bold">
                    {Object.keys(ownedSeries).length}
                  </div>
                  <div className="text-xs text-gray-400">OWNED SERIES</div>
                </div>
                <div className="text-center p-3 bg-anime-dark rounded-lg border border-anime-light-gray/30">
                  <div className="text-2xl font-display font-bold">
                    {mockSeries.length}
                  </div>
                  <div className="text-xs text-gray-400">TOTAL SERIES</div>
                </div>
              </div>
              
              <div className="mt-3 h-1.5 bg-anime-dark rounded-full overflow-hidden flex-1">
                <div 
                  className="h-full bg-gradient-to-r from-anime-cyberpunk-blue to-anime-red"
                  style={{ width: `${(Object.keys(ownedSeries).length / mockSeries.length) * 100}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-right text-gray-400">
                {Math.round((Object.keys(ownedSeries).length / mockSeries.length) * 100)}% Complete
              </div>
              
              <button
                onClick={() => setShowCollection(true)} 
                className="w-full mt-4 py-2 bg-gradient-to-r from-anime-cyberpunk-blue/20 to-purple-500/20 hover:from-anime-cyberpunk-blue/30 hover:to-purple-500/30 border border-anime-cyberpunk-blue/40 rounded text-sm transition-colors flex items-center justify-center"
              >
                <CircleCheck size={16} className="mr-1" />
                View Collection
              </button>
            </div>
            
            {/* Coming soon - Casper AI */}
            <div className="bg-anime-gray/60 backdrop-blur-sm border border-anime-red/40 rounded-lg p-4 mb-6 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-anime-red/20 rounded-full blur-3xl animate-pulse"></div>
              
              <div className="font-digital text-xs text-anime-red mb-2 relative z-10">
                // COMING_SOON
              </div>
              <h3 className="text-lg font-display font-medium mb-2 relative z-10">CASPER AI</h3>
              <p className="text-sm text-gray-400 relative z-10">
                Our advanced AI system will soon be available to help you navigate the anime universe,
                provide recommendations, and enhance your gacha experience.
              </p>
              <div className="mt-3 h-1.5 w-full bg-anime-dark rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-anime-red w-[35%]"></div>
              </div>
              <div className="mt-1 text-xs text-right text-gray-400 relative z-10">
                Development: 35%
              </div>
            </div>
          </motion.div>
          
          {/* Series cards */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            ref={seriesContainerRef}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold">
                <span className="text-anime-red">⟦</span> Series Collection <span className="text-anime-red">⟧</span>
              </h2>
              
              <div className="text-sm text-gray-400">
                Showing {visibleSeriesList.length} of {filteredSeries.length} series
              </div>
            </div>
            
            {filteredSeries.length === 0 && (
              <div className="bg-anime-dark/60 backdrop-blur-sm border border-anime-light-gray/30 rounded-lg p-8 text-center">
                <div className="text-anime-cyberpunk-blue text-3xl mb-3">No series found</div>
                <p className="text-gray-400">Try adjusting your filters or search term</p>
              </div>
            )}
            
            {/* Grid view for series */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleSeriesList.map((series) => (
                  <motion.div 
                    key={series.id}
                    className={`rounded-lg overflow-hidden relative ${getGradient(series.colorScheme)} border-2 ${getBorderColor(series.colorScheme)} shadow-xl`}
                    whileHover={{ scale: 1.03, boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.7)` }}
                    transition={{ duration: 0.3 }}
                    layoutId={`series-${series.id}`}
                  >
                    {/* Series image with improved loading */}
                    <div className="h-56 relative overflow-hidden">
                      <motion.img 
                        src={series.imageUrl} 
                        alt={series.title} 
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      {/* Series title with better readability */}
                      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent">
                        <h3 className="text-white font-display font-bold line-clamp-1">{series.title}</h3>
                      </div>
                      
                      {/* Rarity badge with enhanced styling */}
                      <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded font-digital shadow-lg transform -rotate-3 ${getRarityBadgeColor(series.rarity || 'R')}`}>
                        {series.rarity || "R"}
                      </div>
                      
                      {/* Owned badge */}
                      {ownedSeries[series.id] && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-anime-cyberpunk-blue to-blue-400 text-black text-xs font-digital rounded-full shadow-lg flex items-center">
                          <CircleCheck size={12} className="mr-1" />
                          OWNED
                        </div>
                      )}
                      
                      {/* Show universe */}
                      {series.universe && (
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs">
                          {series.universe}
                        </div>
                      )}
                      
                      {/* Coins display with enhanced visuals */}
                      {series.coins && (
                        <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded text-center flex items-center">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 flex items-center justify-center mr-1 text-xs text-black">
                            💎
                          </div>
                          <div className="text-sm font-digital text-yellow-300">{series.coins.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Series info with improved layout */}
                    <div className="p-4 bg-black/60 backdrop-blur-sm">
                      <div className="flex justify-between items-start mb-2">
                        {renderRating(series.rating, series.colorScheme)}
                        
                        {series.powerLevel && (
                          <div className="bg-anime-dark/80 px-2 py-0.5 rounded text-xs flex items-center">
                            <span className="font-digital text-anime-cyberpunk-blue mr-1">PWR</span>
                            <span>{series.powerLevel}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-white/90 mb-3 line-clamp-2">{series.description}</p>
                      
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {series.specialty && (
                          <div className="bg-anime-dark/60 text-xs px-2 py-0.5 rounded-full">
                            {series.specialty}
                          </div>
                        )}
                        
                        {series.artist && (
                          <div className="bg-anime-dark/60 text-xs px-2 py-0.5 rounded-full flex items-center">
                            <span className="text-gray-400 mr-1">Artist:</span> {series.artist}
                          </div>
                        )}
                        
                        {series.limited && (
                          <div className="bg-anime-red/30 text-xs px-2 py-0.5 rounded-full text-anime-red">
                            Limited
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => pullSeries(series)}
                        disabled={ownedSeries[series.id] || isAnimating}
                        className={`w-full py-2 rounded text-center text-sm ${
                          ownedSeries[series.id]
                            ? 'bg-anime-dark text-gray-400 cursor-not-allowed'
                            : `bg-gradient-to-r from-anime-cyberpunk-blue to-blue-500 hover:from-anime-cyberpunk-blue/90 hover:to-blue-500/90 text-black font-medium transition-all duration-300 shadow-lg shadow-blue-500/20`
                        }`}
                      >
                        {ownedSeries[series.id] ? 'Owned' : `Unlock Series (${series.rarity === "UR" ? 3000 : series.rarity === "SSR" ? 1500 : series.rarity === "SR" ? 800 : series.rarity === "R" ? 300 : 100} 💎)`}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* List view for series */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {visibleSeriesList.map((series) => (
                  <motion.div 
                    key={series.id}
                    className={`rounded-lg overflow-hidden relative border ${getBorderColor(series.colorScheme)} shadow-lg bg-anime-gray/40`}
                    whileHover={{ scale: 1.01, boxShadow: `0 5px 15px -5px rgba(0, 0, 0, 0.7)` }}
                    transition={{ duration: 0.2 }}
                    layoutId={`series-list-${series.id}`}
                  >
                    <div className="flex">
                      {/* Series image thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24">
                        <img src={series.imageUrl} alt={series.title} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Series info */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-white font-display font-medium text-sm">{series.title}</h3>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityBadgeColor(series.rarity || 'R')}`}>
                              {series.rarity}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-300 line-clamp-1 mt-1">{series.description}</p>
                          
                          <div className="flex gap-2 mt-1">
                            <div className="text-xs bg-anime-dark/60 px-1.5 py-0.5 rounded">{series.universe}</div>
                            {series.specialty && (
                              <div className="text-xs bg-anime-dark/60 px-1.5 py-0.5 rounded">{series.specialty}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action button */}
                      <div className="p-3 flex items-center">
                        {ownedSeries[series.id] ? (
                          <div className="bg-anime-cyberpunk-blue/20 text-anime-cyberpunk-blue px-3 py-1 rounded-full text-xs flex items-center">
                            <CircleCheck size={14} className="mr-1" />
                            Owned
                          </div>
                        ) : (
                          <button
                            onClick={() => pullSeries(series)}
                            disabled={isAnimating}
                            className="bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/90 text-black px-3 py-1 rounded-full text-xs whitespace-nowrap"
                          >
                            Get ({series.rarity === "UR" ? 3000 : series.rarity === "SSR" ? 1500 : series.rarity === "SR" ? 800 : series.rarity === "R" ? 300 : 100} 💎)
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Load more button */}
            {visibleSeries < filteredSeries.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleSeries(prev => Math.min(prev + 12, filteredSeries.length))}
                  className="px-6 py-2 bg-anime-gray hover:bg-anime-light-gray border border-anime-light-gray/50 rounded-full text-sm transition-colors inline-flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Load More Series
                </button>
              </div>
            )}
            
            {/* Infinite scroll toggle */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setInfiniteScrollEnabled(!infiniteScrollEnabled)}
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                {infiniteScrollEnabled ? "Disable" : "Enable"} infinite scroll
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Collection Modal with improved UI */}
      {showCollection && (
        <motion.div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-anime-gray/90 border border-anime-light-gray rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-anime-light-gray flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold">Your Collection</h2>
              <div className="flex items-center">
                <div className="mr-4 px-3 py-1 bg-anime-cyberpunk-blue/20 rounded-full text-sm">
                  <span className="text-anime-cyberpunk-blue font-digital">{Object.keys(ownedSeries).length}</span>
                  <span className="text-gray-400 ml-1">/{mockSeries.length}</span>
                </div>
                <button 
                  onClick={() => setShowCollection(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-anime-dark text-white hover:bg-anime-red transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex gap-2 mb-4 flex-wrap">
                <button 
                  onClick={() => setRarityFilter("all")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    rarityFilter === "all" 
                      ? "bg-anime-cyberpunk-blue text-black" 
                      : "bg-anime-dark/60 text-gray-400"
                  }`}
                >
                  All
                </button>
                {["UR", "SSR", "SR", "R", "N"].map(rarity => (
                  <button
                    key={rarity}
                    onClick={() => setRarityFilter(rarity)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      rarityFilter === rarity
                        ? getRarityBadgeColor(rarity)
                        : "bg-anime-dark/60 text-gray-400"
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
              
              {Object.keys(ownedSeries).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mockSeries
                    .filter(s => ownedSeries[s.id] && (rarityFilter === "all" || s.rarity === rarityFilter))
                    .map((series) => (
                      <motion.div 
                        key={series.id}
                        className={`rounded-lg overflow-hidden border ${getBorderColor(series.colorScheme)} shadow-lg`}
                        whileHover={{ scale: 1.05 }}
                        layoutId={`collection-${series.id}`}
                      >
                        <div className="h-32 relative">
                          <img 
                            src={series.imageUrl} 
                            alt={series.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                            <div className="p-2">
                              <div className="flex items-center justify-between w-full">
                                <h3 className="text-xs font-medium text-white line-clamp-1">{series.title}</h3>
                              </div>
                              <div className="mt-1 flex items-center justify-between">
                                <span className={`text-xs px-1 py-0.5 rounded ${getRarityBadgeColor(series.rarity || 'R')}`}>
                                  {series.rarity}
                                </span>
                                {series.powerLevel && (
                                  <span className="text-xs bg-black/50 px-1 py-0.5 rounded ml-1">
                                    PWR {series.powerLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
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
        </motion.div>
      )}
      
      {/* All Banners Modal with enhanced visuals */}
      {showBanners && (
        <motion.div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-anime-gray/90 border border-anime-light-gray rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-anime-light-gray flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold">Featured Banners</h2>
              <button 
                onClick={() => setShowBanners(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-anime-dark text-white hover:bg-anime-red transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredBanners.map((banner) => (
                  <motion.div 
                    key={banner.id}
                    className={`rounded-lg overflow-hidden border border-${banner.colorScheme}-500/50 shadow-lg`}
                    whileHover={{ scale: 1.02, boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.3)` }}
                    layoutId={`banner-${banner.id}`}
                  >
                    <div className="h-40 relative">
                      {/* Banner type badge */}
                      <div className="absolute top-3 left-3 z-20 bg-anime-red/80 text-white text-xs px-2 py-0.5 rounded-sm font-digital">
                        {banner.bannerType?.toUpperCase()}
                      </div>
                      
                      {/* Rate boost badge */}
                      <div className="absolute top-3 right-3 z-20 bg-anime-cyberpunk-blue/80 text-black text-xs px-2 py-0.5 rounded-sm font-digital">
                        {banner.boost}x BOOST
                      </div>
                      
                      <img 
                        src={banner.imageUrl} 
                        alt={banner.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                        <p className="text-sm text-gray-300 line-clamp-2">{banner.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {banner.featuredSeries.slice(0, 3).map(seriesId => {
                            const series = mockSeries.find(s => s.id === seriesId);
                            if (!series) return null;
                            return (
                              <div key={seriesId} className="bg-black/50 rounded px-2 py-0.5 text-xs flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full ${getRarityBadgeColor(series.rarity || 'R')} mr-1`}></span>
                                {series.title.length > 15 ? series.title.substring(0, 15) + "..." : series.title}
                              </div>
                            );
                          })}
                          {banner.featuredSeries.length > 3 && (
                            <div className="bg-black/50 rounded px-2 py-0.5 text-xs">
                              +{banner.featuredSeries.length - 3} more
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs text-gray-400">
                            Ends: {banner.endDate}
                          </div>
                          <button 
                            onClick={() => {
                              setActiveBanner(banner.id);
                              setShowBanners(false);
                            }}
                            className={`px-3 py-1 bg-${banner.colorScheme}-500/70 hover:bg-${banner.colorScheme}-500 text-white text-sm rounded`}
                          >
                            Select Banner
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Pull Result Modal with enhanced animations */}
      {showPullResult && pullResult && (
        <motion.div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              {/* Rarity rays background */}
              <div className={`absolute inset-0 -z-10 ${
                pullResult.rarity === "UR" || pullResult.rarity === "SSR" ? "animate-pulse" : ""
              }`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-full h-full ${
                    pullResult.rarity === "UR" 
                      ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/40 via-red-500/20 to-transparent"
                      : pullResult.rarity === "SSR" 
                        ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300/30 via-yellow-500/20 to-transparent"
                        : pullResult.rarity === "SR"
                          ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400/30 via-purple-500/20 to-transparent"
                          : pullResult.rarity === "R"
                            ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/30 via-blue-500/20 to-transparent"
                            : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-400/30 via-gray-500/20 to-transparent"
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
                  <motion.img 
                    src={pullResult.imageUrl} 
                    alt={pullResult.title}
                    className="w-full h-80 object-cover"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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
                    
                    <motion.div 
                      className="flex justify-between text-sm mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {pullResult.specialty && (
                        <div className="bg-black/50 px-2 py-0.5 rounded">
                          {pullResult.specialty}
                        </div>
                      )}
                      
                      {pullResult.powerLevel && (
                        <div className="bg-black/50 px-2 py-0.5 rounded">
                          PWR: {pullResult.powerLevel}
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Sparkle effects for UR/SSR */}
                  {(pullResult.rarity === "UR" || pullResult.rarity === "SSR") && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-2 h-2 rounded-full ${
                            pullResult.rarity === "UR" ? "bg-red-400" : "bg-yellow-300"
                          }`}
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
                  
                  {/* Artist and universe info */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    {pullResult.artist && (
                      <div className="bg-anime-gray/30 p-2 rounded">
                        <div className="text-xs text-gray-400">Artist</div>
                        <div>{pullResult.artist}</div>
                      </div>
                    )}
                    
                    {pullResult.universe && (
                      <div className="bg-anime-gray/30 p-2 rounded">
                        <div className="text-xs text-gray-400">Universe</div>
                        <div>{pullResult.universe}</div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowPullResult(false)}
                    className={`w-full py-2 bg-gradient-to-r ${
                      pullResult.rarity === "UR" 
                        ? "from-red-400 to-red-600" 
                        : pullResult.rarity === "SSR" 
                          ? "from-yellow-300 to-yellow-500"
                          : "from-anime-cyberpunk-blue to-blue-400"
                    } hover:opacity-90 text-black rounded font-medium`}
                  >
                    Awesome!
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Multi-Pull Results Modal */}
      {showMultiPullResults && (
        <motion.div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-anime-gray/90 backdrop-blur-md border border-anime-light-gray rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-anime-light-gray flex justify-between items-center">
              <h2 className="text-xl font-display font-bold">10x Pull Results</h2>
              <button 
                onClick={() => setShowMultiPullResults(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-anime-dark text-white hover:bg-anime-red transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {multiPullResults.map((result, index) => (
                  <motion.div 
                    key={index}
                    className={`rounded-lg overflow-hidden border-2 ${getBorderColor(result.colorScheme)} shadow-lg`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="h-32 relative">
                      <img 
                        src={result.imageUrl} 
                        alt={result.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2">
                        <h3 className="text-xs font-medium text-white line-clamp-1">
                          {result.title}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${getRarityBadgeColor(result.rarity || 'R')}`}>
                            {result.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowMultiPullResults(false)}
                  className="px-6 py-2 bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/90 text-black rounded-full font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}
