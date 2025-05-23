import { getTopAnime, searchAnime } from "@/api/jikan";
import { Anime } from "@/types/anime";

// Rarity definitions
export type Rarity = 'R' | 'SR' | 'SSR' | 'UR';

export interface GachaCard {
  id: number;
  title: string;
  originalTitle?: string;
  description: string;
  imageUrl: string;
  rarity: Rarity;
  rating: number;
  colorScheme: string;
  specialty: string;
  universe: string;
  limited: boolean;
  releaseDate?: string;
  artist?: string;
  powerLevel: number;
}

export interface GachaBanner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  featuredSeries: number[];
  endDate: string;
  colorScheme: string;
  bannerType: 'limited' | 'seasonal' | 'collaboration' | 'standard';
  boost?: number;
  bonusItems?: string[];
}

// Cache for anime data to avoid repeated API calls
let animeCache: Anime[] = [];
let gachaCardsCache: GachaCard[] = [];
let bannersCache: GachaBanner[] = [];

// Color schemes for cards
const colorSchemes = [
  'from-purple-600 to-blue-500',
  'from-pink-500 to-purple-500',
  'from-yellow-400 to-orange-500',
  'from-green-400 to-teal-500',
  'from-blue-500 to-indigo-600',
  'from-red-500 to-pink-500',
];

// Specialties for cards
const specialties = [
  'Attack', 'Defense', 'Support', 'Utility', 'Special', 'Balanced'
];

// Initialize anime data
export const initGachaData = async (): Promise<void> => {
  try {
    if (animeCache.length === 0) {
      console.log('Fetching anime data for gacha...');
      // Fetch top anime and popular anime for variety
      const topAnime = await getTopAnime(1);
      const popularAnime = await searchAnime({ order_by: 'popularity', sort: 'asc', limit: '50' });
      
      // Combine data sources and remove duplicates
      const combinedAnime = [...topAnime, ...popularAnime];
      animeCache = Array.from(new Map(combinedAnime.map(anime => [anime.mal_id, anime])).values());
      
      // Generate gacha cards from anime data
      generateGachaCards();
      generateBanners();
    }
  } catch (error) {
    console.error('Error initializing gacha data:', error);
  }
};

// Generate gacha cards from anime data
const generateGachaCards = (): void => {
  gachaCardsCache = animeCache.map(anime => {
    // Determine rarity based on score
    let rarity: Rarity = 'R';
    if (anime.score >= 8.5) {
      rarity = 'UR';
    } else if (anime.score >= 8.0) {
      rarity = 'SSR';
    } else if (anime.score >= 7.0) {
      rarity = 'SR';
    }
    
    // Calculate power level based on score and popularity
    const basePower = Math.round((anime.score / 10) * 100);
    const powerLevel = Math.min(Math.max(basePower, 30), 100);
    
    // Assign a random color scheme
    const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    
    // Assign a random specialty
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];

    return {
      id: anime.mal_id,
      title: anime.title,
      originalTitle: anime.title_japanese,
      description: anime.synopsis || 'No description available.',
      imageUrl: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
      rarity,
      rating: anime.score || 0,
      colorScheme,
      specialty,
      universe: anime.genres?.[0]?.name || 'Unknown',
      limited: rarity === 'UR', // Make UR cards limited by default
      releaseDate: anime.aired?.from ? new Date(anime.aired.from).toLocaleDateString() : undefined,
      artist: 'Various Artists',
      powerLevel
    };
  });
};

// Generate banners
const generateBanners = (): void => {
  // Create standard banner
  const standardBanner = {
    id: 1,
    title: "Standard Wish",
    description: "Standard banner with all available characters",
    imageUrl: "https://images.unsplash.com/photo-1651364689813-589e4045e007",
    featuredSeries: gachaCardsCache.slice(0, 3).map(card => card.id),
    endDate: "Permanent",
    colorScheme: "from-blue-500 to-purple-500",
    bannerType: 'standard' as const,
  };

  // Create limited event banner
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);
  
  const eventBanner = {
    id: 2,
    title: "Shonen Festival",
    description: "Limited time banner featuring top shonen series",
    imageUrl: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891",
    featuredSeries: gachaCardsCache
      .filter(card => card.rarity === 'SSR' || card.rarity === 'UR')
      .slice(0, 5)
      .map(card => card.id),
    endDate: futureDate.toLocaleDateString(),
    colorScheme: "from-orange-500 to-red-500",
    bannerType: 'limited' as const,
    boost: 2.5,
    bonusItems: ["10x Premium Tickets", "1x Guaranteed SSR"]
  };
  
  // Create seasonal banner
  const seasonalBanner = {
    id: 3,
    title: "Summer Special",
    description: "Seasonal banner with summer-themed characters",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    featuredSeries: gachaCardsCache
      .filter(card => card.universe.includes("Comedy") || card.universe.includes("Slice of Life"))
      .slice(0, 4)
      .map(card => card.id),
    endDate: new Date(new Date().getFullYear(), 8, 30).toLocaleDateString(),
    colorScheme: "from-cyan-400 to-blue-500",
    bannerType: 'seasonal' as const,
  };
  
  // Create collaboration banner
  const collabBanner = {
    id: 4,
    title: "Legendary Collaboration",
    description: "Special collaboration with legendary anime series",
    imageUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa",
    featuredSeries: gachaCardsCache
      .filter(card => card.rarity === 'UR')
      .slice(0, 3)
      .map(card => card.id),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toLocaleDateString(),
    colorScheme: "from-purple-600 to-pink-500",
    bannerType: 'collaboration' as const,
    boost: 5,
    bonusItems: ["1x Guaranteed UR", "50x Premium Gems"]
  };

  bannersCache = [standardBanner, eventBanner, seasonalBanner, collabBanner];
};

// Get all gacha cards
export const getAllGachaCards = async (): Promise<GachaCard[]> => {
  if (gachaCardsCache.length === 0) {
    await initGachaData();
  }
  return gachaCardsCache;
};

// Get all banners
export const getAllBanners = async (): Promise<GachaBanner[]> => {
  if (bannersCache.length === 0) {
    await initGachaData();
  }
  return bannersCache;
};

// Get a specific banner by ID
export const getBannerById = async (id: number): Promise<GachaBanner | undefined> => {
  if (bannersCache.length === 0) {
    await initGachaData();
  }
  return bannersCache.find(banner => banner.id === id);
};

// Get featured cards for a banner
export const getFeaturedCards = async (bannerId: number): Promise<GachaCard[]> => {
  const banner = await getBannerById(bannerId);
  if (!banner) return [];
  
  const allCards = await getAllGachaCards();
  return allCards.filter(card => banner.featuredSeries.includes(card.id));
};

// Pull system with animations
export interface PullResult {
  card: GachaCard;
  animation: 'standard' | 'sr' | 'ssr' | 'ur';
}

// Single pull function
export const pullSingle = async (bannerId: number): Promise<PullResult> => {
  const banner = await getBannerById(bannerId);
  const allCards = await getAllGachaCards();
  
  // Initialize rates
  let rRates = 80;
  let srRates = 15;
  let ssrRates = 4;
  let urRates = 1;
  
  // Adjust rates based on banner boost if applicable
  if (banner && banner.boost) {
    // Reduce R rates and distribute to higher rarities
    const boostAmount = Math.min(banner.boost, 5); // Cap at 5%
    rRates -= boostAmount * 2;
    srRates += boostAmount;
    ssrRates += boostAmount / 2;
    urRates += boostAmount / 2;
  }
  
  // Get featured cards
  const featuredCards = banner 
    ? allCards.filter(card => banner.featuredSeries.includes(card.id)) 
    : [];
  
  // Determine pull rarity
  const rand = Math.random() * 100;
  let pulledRarity: Rarity;
  
  if (rand < urRates) {
    pulledRarity = 'UR';
  } else if (rand < urRates + ssrRates) {
    pulledRarity = 'SSR';
  } else if (rand < urRates + srRates) {
    pulledRarity = 'SR';
  } else {
    pulledRarity = 'R';
  }
  
  // Filter cards by rarity
  const rarityPool = allCards.filter(card => card.rarity === pulledRarity);
  
  // Prioritize featured cards
  const featuredOfRarity = featuredCards.filter(card => card.rarity === pulledRarity);
  
  // Select card
  let selectedCard: GachaCard;
  
  if (featuredOfRarity.length > 0 && Math.random() < 0.5) {
    // 50% chance to get a featured card of the appropriate rarity if available
    selectedCard = featuredOfRarity[Math.floor(Math.random() * featuredOfRarity.length)];
  } else {
    // Otherwise pull from general pool
    selectedCard = rarityPool[Math.floor(Math.random() * rarityPool.length)];
  }
  
  // Determine animation type based on rarity
  let animationType: 'standard' | 'sr' | 'ssr' | 'ur' = 'standard';
  if (pulledRarity === 'SR') animationType = 'sr';
  else if (pulledRarity === 'SSR') animationType = 'ssr';
  else if (pulledRarity === 'UR') animationType = 'ur';
  
  return {
    card: selectedCard,
    animation: animationType
  };
};

// Multi-pull function (10 pulls)
export const pullMulti = async (bannerId: number): Promise<PullResult[]> => {
  const results: PullResult[] = [];
  
  // Perform 9 regular pulls
  for (let i = 0; i < 9; i++) {
    results.push(await pullSingle(bannerId));
  }
  
  // Guarantee at least SR for the 10th pull
  const banner = await getBannerById(bannerId);
  const allCards = await getAllGachaCards();
  
  // Filter cards by at least SR rarity
  const guaranteedPool = allCards.filter(card => 
    card.rarity === 'SR' || card.rarity === 'SSR' || card.rarity === 'UR'
  );
  
  // Get featured cards of appropriate rarity
  const featuredGuaranteed = banner 
    ? guaranteedPool.filter(card => banner.featuredSeries.includes(card.id)) 
    : [];
  
  // Select card for guaranteed pull
  let selectedCard: GachaCard;
  
  if (featuredGuaranteed.length > 0 && Math.random() < 0.5) {
    // 50% chance to get a featured card of SR+ rarity
    selectedCard = featuredGuaranteed[Math.floor(Math.random() * featuredGuaranteed.length)];
  } else {
    // Otherwise pull from general SR+ pool
    selectedCard = guaranteedPool[Math.floor(Math.random() * guaranteedPool.length)];
  }
  
  // Determine animation type based on rarity
  let animationType: 'standard' | 'sr' | 'ssr' | 'ur' = 'sr';
  if (selectedCard.rarity === 'SSR') animationType = 'ssr';
  else if (selectedCard.rarity === 'UR') animationType = 'ur';
  
  // Add guaranteed pull to results
  results.push({
    card: selectedCard,
    animation: animationType
  });
  
  return results;
};
