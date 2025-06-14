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
      const topAnimeResponse = await getTopAnime(1); 
      const popularAnimeResponse = await searchAnime({ order_by: 'popularity', sort: 'asc', limit: '50' });
      
      // Correctly assign the anime lists
      const topAnimeList = topAnimeResponse || []; // topAnimeResponse is already Anime[]
      const popularAnimeList = popularAnimeResponse || []; // popularAnimeResponse is already Anime[]
      
      // Combine data sources and remove duplicates
      // Ensure both lists are actually arrays before spreading
      const combinedAnime = [
        ...(Array.isArray(topAnimeList) ? topAnimeList : []),
        ...(Array.isArray(popularAnimeList) ? popularAnimeList : [])
      ];
      animeCache = Array.from(new Map(combinedAnime.map(anime => [anime.mal_id, anime])).values());
      
      // Generate gacha cards from anime data
      generateGachaCards();
      generateBanners();
    }
  } catch (error) {
    console.error('Error initializing gacha data:', error);
    // Optionally, clear caches or set a flag to indicate data loading failure
    animeCache = [];
    gachaCardsCache = [];
    bannersCache = [];
  }
};

// Generate gacha cards from anime data
const generateGachaCards = (): void => {
  gachaCardsCache = animeCache.map(anime => {
    // Determine rarity based on score
    let rarity: Rarity = 'R';
    if (anime.score && anime.score >= 8.5) {
      rarity = 'UR';
    } else if (anime.score && anime.score >= 8.0) {
      rarity = 'SSR';
    } else if (anime.score && anime.score >= 7.0) {
      rarity = 'SR';
    }
    
    // Calculate power level based on score and popularity
    const basePower = Math.round(((anime.score || 5) / 10) * 100); // Use a default score if undefined
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
      imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", // Fallback image
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
    featuredSeries: gachaCardsCache.length > 3 ? gachaCardsCache.slice(0, 3).map(card => card.id) : gachaCardsCache.map(card => card.id),
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
    endDate: new Date(new Date().getFullYear(), 8, 30).toLocaleDateString(), // Month is 0-indexed, so 8 is September
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
  // Ensure there are always some featured series even if cache is small
  if (gachaCardsCache.length > 0 && standardBanner.featuredSeries.length === 0) {
      standardBanner.featuredSeries = [gachaCardsCache[0].id];
  }
  if (gachaCardsCache.length > 0 && eventBanner.featuredSeries.length === 0) {
      eventBanner.featuredSeries = gachaCardsCache.filter(card => card.rarity === 'SSR' || card.rarity === 'UR').slice(0,1).map(c => c.id);
      if(eventBanner.featuredSeries.length === 0) eventBanner.featuredSeries = [gachaCardsCache[0].id];
  }
   if (gachaCardsCache.length > 0 && seasonalBanner.featuredSeries.length === 0) {
      seasonalBanner.featuredSeries = gachaCardsCache.filter(card => card.universe.includes("Comedy") || card.universe.includes("Slice of Life")).slice(0,1).map(c => c.id);
      if(seasonalBanner.featuredSeries.length === 0) seasonalBanner.featuredSeries = [gachaCardsCache[0].id];
  }
   if (gachaCardsCache.length > 0 && collabBanner.featuredSeries.length === 0) {
      collabBanner.featuredSeries = gachaCardsCache.filter(card => card.rarity === 'UR').slice(0,1).map(c => c.id);
      if(collabBanner.featuredSeries.length === 0) collabBanner.featuredSeries = [gachaCardsCache[0].id];
  }
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
  if (allCards.length === 0) return []; // Ensure cards are loaded
  return allCards.filter(card => banner.featuredSeries.includes(card.id));
};

// Pull system with animations
export interface PullResult {
  card: GachaCard;
  animation: 'standard' | 'sr' | 'ssr' | 'ur';
}

// Single pull function
export const pullSingle = async (bannerId: number): Promise<PullResult | null> => {
  const banner = await getBannerById(bannerId);
  const allCards = await getAllGachaCards();

  if (allCards.length === 0) {
    console.error("No gacha cards available to pull from.");
    return null; // Or throw an error
  }
  
  // Initialize rates
  let rRates = 80;
  let srRates = 15;
  let ssrRates = 4;
  let urRates = 1;
  
  // Adjust rates based on banner boost if applicable
  if (banner && banner.boost) {
    // Ensure boost is a positive number
    const boostMultiplier = Math.max(0, banner.boost -1); // e.g. boost 2 means 100% increase for higher rarities
    const totalBoostRate = urRates * boostMultiplier + ssrRates * boostMultiplier + srRates * boostMultiplier;
    
    // Reduce R rate by the total boosted amount for higher rarities
    // Ensure R rate doesn't go below a minimum (e.g. 10%)
    const rRateReduction = Math.min(totalBoostRate, rRates - 10); 
    rRates -= rRateReduction;

    // Distribute the reduction proportionally to higher rarities based on their original share of the boosted pool
    if (totalBoostRate > 0) {
        urRates += (urRates * boostMultiplier / totalBoostRate) * rRateReduction;
        ssrRates += (ssrRates * boostMultiplier / totalBoostRate) * rRateReduction;
        srRates += (srRates * boostMultiplier / totalBoostRate) * rRateReduction;
    } else if (banner.boost > 1) { // If original rates were 0, just add some base boost
        urRates += banner.boost * 0.1;
        ssrRates += banner.boost * 0.2;
        srRates += banner.boost * 0.7;
    }

    // Normalize rates to sum to 100
    const currentTotal = rRates + srRates + ssrRates + urRates;
    if (currentTotal !== 100) {
        rRates = (rRates / currentTotal) * 100;
        srRates = (srRates / currentTotal) * 100;
        ssrRates = (ssrRates / currentTotal) * 100;
        urRates = (urRates / currentTotal) * 100;
    }
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
  } else if (rand < urRates + ssrRates + srRates) { // Corrected condition
    pulledRarity = 'SR';
  } else {
    pulledRarity = 'R';
  }
  
  // Filter cards by rarity
  let rarityPool = allCards.filter(card => card.rarity === pulledRarity);
  if (rarityPool.length === 0) { // Fallback if no cards of this rarity
    rarityPool = allCards.filter(card => card.rarity === 'R'); // Default to R
    if (rarityPool.length === 0) rarityPool = allCards; // Absolute fallback
  }
  if (rarityPool.length === 0) { // If still no cards, something is very wrong
     console.error("Critical: No cards in rarity pool or any fallback pool.");
     // Return a dummy card or handle error appropriately
     return { card: { id: 0, title: "Error Card", imageUrl: "", rarity: 'R', rating: 0, colorScheme: "", specialty: "", universe: "", limited: false, powerLevel: 0, description: "Error loading card" }, animation: 'standard'};
  }

  
  // Prioritize featured cards
  const featuredOfRarity = featuredCards.filter(card => card.rarity === pulledRarity);
  
  // Select card
  let selectedCard: GachaCard;
  
  if (featuredOfRarity.length > 0 && Math.random() < 0.5) {
    // 50% chance to get a featured card of the appropriate rarity if available
    selectedCard = featuredOfRarity[Math.floor(Math.random() * featuredOfRarity.length)];
  } else {
    // Otherwise pull from general pool of that rarity
    selectedCard = rarityPool[Math.floor(Math.random() * rarityPool.length)];
  }
   if (!selectedCard && rarityPool.length > 0) { // Ensure selectedCard is assigned if pool wasn't empty
    selectedCard = rarityPool[0];
  } else if (!selectedCard && allCards.length > 0) { // Fallback to any card if specific rarity pool was empty but allCards is not
    selectedCard = allCards[Math.floor(Math.random() * allCards.length)];
  } else if (!selectedCard) { // Absolute fallback if everything else failed
    console.error("Could not select a card. All pools might be empty or logic error.");
    return { card: { id: 0, title: "Fallback Card", imageUrl: "", rarity: 'R', rating: 0, colorScheme: "", specialty: "", universe: "", limited: false, powerLevel: 0, description: "Error selecting card" }, animation: 'standard'};
  }

  
  // Determine animation type based on rarity
  let animationType: 'standard' | 'sr' | 'ssr' | 'ur' = 'standard';
  if (selectedCard.rarity === 'SR') animationType = 'sr';
  else if (selectedCard.rarity === 'SSR') animationType = 'ssr';
  else if (selectedCard.rarity === 'UR') animationType = 'ur';
  
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
    const pull = await pullSingle(bannerId);
    if (pull) results.push(pull);
  }
  
  // Guarantee at least SR for the 10th pull
  const banner = await getBannerById(bannerId);
  const allCards = await getAllGachaCards();

  if (allCards.length === 0) {
    console.error("No gacha cards available for multi-pull.");
    // Add 10 dummy error results if no cards
    return Array(10).fill({ card: { id: 0, title: "Error Card", imageUrl: "", rarity: 'R', rating: 0, colorScheme: "", specialty: "", universe: "", limited: false, powerLevel: 0, description: "Error loading card" }, animation: 'standard'});
  }
  
  // Filter cards by at least SR rarity
  let guaranteedPool = allCards.filter(card => 
    card.rarity === 'SR' || card.rarity === 'SSR' || card.rarity === 'UR'
  );

  if (guaranteedPool.length === 0) { // Fallback if no SR+ cards
    guaranteedPool = allCards.filter(card => card.rarity === 'R');
     if (guaranteedPool.length === 0) guaranteedPool = allCards; // Absolute fallback
  }
  if (guaranteedPool.length === 0) { // If still no cards for guaranteed pull
    console.error("Critical: No cards for guaranteed SR+ pull.");
    // Add a dummy card for the guaranteed slot
    results.push({ card: { id: 0, title: "Guaranteed Error Card", imageUrl: "", rarity: 'SR', rating: 0, colorScheme: "", specialty: "", universe: "", limited: false, powerLevel: 0, description: "Error loading guaranteed card" }, animation: 'sr'});
    return results;
  }
  
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
  if (!selectedCard && guaranteedPool.length > 0) {
    selectedCard = guaranteedPool[0];
  } else if (!selectedCard && allCards.length > 0) {
    selectedCard = allCards[Math.floor(Math.random() * allCards.length)];
  } else if (!selectedCard) {
     console.error("Could not select a card for guaranteed pull.");
    selectedCard = { id: 0, title: "Guaranteed Fallback", imageUrl: "", rarity: 'SR', rating: 0, colorScheme: "", specialty: "", universe: "", limited: false, powerLevel: 0, description: "Error selecting guaranteed card" };
  }
  
  // Determine animation type based on rarity
  let animationType: 'standard' | 'sr' | 'ssr' | 'ur' = 'sr'; // Default to 'sr' for guaranteed
  if (selectedCard.rarity === 'SSR') animationType = 'ssr';
  else if (selectedCard.rarity === 'UR') animationType = 'ur';
  
  // Add guaranteed pull to results
  results.push({
    card: selectedCard,
    animation: animationType
  });
  
  // Ensure 10 results, even if some single pulls failed
  while (results.length < 10 && allCards.length > 0) {
     const fallbackPull = await pullSingle(bannerId); // Try another pull
     if (fallbackPull) results.push(fallbackPull);
     else { // If pullSingle returns null consistently, add a placeholder
         results.push({ card: { id: 0, title: "Padding Card", imageUrl: "", rarity: 'R', rating: 0, colorScheme: "", specialty: "", universe: "", limited: false, powerLevel: 0, description: "Padding for multi-pull" }, animation: 'standard'});
     }
  }
  
  return results;
};
