
import { getTopAnime, searchAnime, Anime } from "@/api/jikan";
import { GachaSeriesCard, GachaBanner } from "@/types/anime";

const RARITY_LEVELS = ["R", "SR", "SSR"] as const;
const COLOR_SCHEMES = [
  "from-blue-500 to-purple-600",
  "from-red-500 to-orange-500",
  "from-emerald-500 to-cyan-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-yellow-600",
  "from-indigo-500 to-violet-600",
];

const RARITIES: Record<string, { probability: number, colorScheme: string }> = {
  "R": { probability: 0.7, colorScheme: "from-blue-500 to-purple-600" },
  "SR": { probability: 0.25, colorScheme: "from-pink-500 to-rose-600" },
  "SSR": { probability: 0.05, colorScheme: "from-amber-500 to-yellow-600" }
};

// Map anime genres to specialty
const mapGenreToSpecialty = (genres: {mal_id: number, name: string}[]): string => {
  const genreMap: Record<string, string> = {
    'Action': 'Combat',
    'Adventure': 'Exploration',
    'Comedy': 'Humor',
    'Drama': 'Emotional',
    'Fantasy': 'Magic',
    'Horror': 'Fear',
    'Mystery': 'Investigation',
    'Romance': 'Charm',
    'Sci-Fi': 'Technology',
    'Slice of Life': 'Everyday',
    'Sports': 'Athletics',
    'Supernatural': 'Mystical'
  };
  
  for (const genre of genres) {
    if (genreMap[genre.name]) {
      return genreMap[genre.name];
    }
  }
  
  return 'Versatile';
};

// Convert Anime to GachaSeriesCard
export const convertAnimeToGachaCard = (anime: Anime, index: number): GachaSeriesCard => {
  // Determine rarity based on score
  let rarity = "R";
  if (anime.score >= 8.5) {
    rarity = "SSR";
  } else if (anime.score >= 7.5) {
    rarity = "SR";
  }

  const colorIndex = index % COLOR_SCHEMES.length;
  
  return {
    id: anime.mal_id,
    title: anime.title,
    description: anime.synopsis?.substring(0, 120) + "..." || "No description available",
    imageUrl: anime.images.jpg.large_image_url || anime.images.webp.large_image_url,
    rating: anime.score || 0,
    colorScheme: RARITIES[rarity].colorScheme || COLOR_SCHEMES[colorIndex],
    coins: Math.floor((anime.score || 5) * 100),
    rarity: rarity,
    specialty: mapGenreToSpecialty(anime.genres),
    releaseDate: anime.aired.from ? new Date(anime.aired.from).toLocaleDateString() : "Unknown",
    limited: false,
    artist: anime.studios && anime.studios.length > 0 ? anime.studios[0].name : "Unknown",
    universe: anime.genres && anime.genres.length > 0 ? anime.genres[0].name : "Anime",
    powerLevel: Math.floor((anime.score || 5) * 10),
    collectionValue: Math.floor(((anime.score || 5) * 20) + (anime.popularity || 0) / 100)
  };
};

// Fetch real series data from Jikan API
export const fetchRealSeriesData = async (): Promise<GachaSeriesCard[]> => {
  try {
    // Get top anime and seasonal anime
    const [topAnime, searchResults1, searchResults2, searchResults3] = await Promise.all([
      getTopAnime(1),
      searchAnime({ q: 'fantasy', order_by: 'popularity', sort: 'desc' }),
      searchAnime({ q: 'action', order_by: 'popularity', sort: 'desc' }),
      searchAnime({ q: 'romance', order_by: 'popularity', sort: 'desc' })
    ]);

    // Combine and deduplicate results
    const combinedAnime = [...topAnime];
    const seenIds = new Set(topAnime.map(anime => anime.mal_id));
    
    [searchResults1, searchResults2, searchResults3].forEach(results => {
      results.forEach(anime => {
        if (!seenIds.has(anime.mal_id)) {
          seenIds.add(anime.mal_id);
          combinedAnime.push(anime);
        }
      });
    });

    // Convert to GachaSeriesCard format
    return combinedAnime.map((anime, index) => convertAnimeToGachaCard(anime, index));
  } catch (error) {
    console.error("Error fetching real anime data:", error);
    return [];
  }
};

// Create banners using real data
export const createBanners = (seriesData: GachaSeriesCard[]): GachaBanner[] => {
  // Standard banner that's always available
  const standardBanner: GachaBanner = {
    id: 1,
    title: "Standard Wish",
    description: "Standard banner with all available series",
    imageUrl: "https://i.imgur.com/wXfnlUd.jpg",
    featuredSeries: [],
    endDate: "Permanent",
    colorScheme: "from-blue-500 to-purple-600",
    bannerType: "standard",
  };
  
  // Create special event banners using top rated series
  const topSeries = [...seriesData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 30);
  
  const now = new Date();
  
  const eventBanners: GachaBanner[] = [
    {
      id: 2,
      title: "SSR Spotlight",
      description: "Increased chance for SSR characters!",
      imageUrl: topSeries[0]?.imageUrl || "https://i.imgur.com/RDTCOR1.jpg",
      featuredSeries: topSeries.slice(0, 5).map(series => series.id),
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      colorScheme: "from-amber-500 to-yellow-600",
      bannerType: "limited",
      boost: 1.5,
      bonusItems: ["Premium Token", "SSR Guarantee at 80 pulls"]
    },
    {
      id: 3,
      title: "Summer Festival",
      description: "Limited summer-themed characters and skins!",
      imageUrl: topSeries[1]?.imageUrl || "https://i.imgur.com/XnT03eP.jpg",
      featuredSeries: topSeries.slice(5, 10).map(series => series.id),
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      colorScheme: "from-cyan-500 to-blue-600",
      bannerType: "seasonal",
      boost: 2,
      bonusItems: ["Summer Skin Ticket", "Beach Background"]
    },
    {
      id: 4,
      title: "Collaboration Event",
      description: "Special crossover with top anime!",
      imageUrl: topSeries[2]?.imageUrl || "https://i.imgur.com/bZISp9m.jpg",
      featuredSeries: topSeries.slice(10, 15).map(series => series.id),
      endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      colorScheme: "from-red-500 to-orange-600",
      bannerType: "collaboration",
      boost: 2.5,
      bonusItems: ["Collab Character Selector", "Special Frame"]
    },
    {
      id: 5,
      title: "Mystery Banner",
      description: "Try your luck with mystery rewards!",
      imageUrl: topSeries[3]?.imageUrl || "https://i.imgur.com/nYyNBiL.jpg", 
      featuredSeries: topSeries.slice(15, 20).map(series => series.id),
      endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      colorScheme: "from-purple-500 to-pink-600",
      bannerType: "limited",
      boost: 1.8,
      bonusItems: ["Mystery Box", "Bonus Coins"]
    }
  ];
  
  return [standardBanner, ...eventBanners];
};

// Apply pity system and calculate pulls
export const calculatePull = (
  pityCount: number,
  seriesPool: GachaSeriesCard[],
  featuredIds: number[] = []
): {
  result: GachaSeriesCard,
  newPityCount: number,
  isSSR: boolean,
  isSR: boolean,
  isFeatured: boolean
} => {
  let newPityCount = pityCount + 1;
  let rarity: string;
  let isSSR = false;
  let isSR = false;
  
  // Hard pity at 90 pulls (guaranteed SSR)
  if (newPityCount >= 90) {
    rarity = "SSR";
    newPityCount = 0;
    isSSR = true;
  }
  // Soft pity from 75 pulls (increased SSR chance)
  else if (newPityCount >= 75) {
    const softPityChance = 0.2 + ((newPityCount - 75) * 0.06); // Increases with each pull
    rarity = Math.random() < softPityChance ? "SSR" : (Math.random() < 0.5 ? "SR" : "R");
    if (rarity === "SSR") {
      newPityCount = 0;
      isSSR = true;
    }
  }
  // Guaranteed SR every 10 pulls if no SSR
  else if (newPityCount % 10 === 0) {
    const srOrBetter = Math.random() < 0.15 ? "SSR" : "SR"; // 15% chance for SSR
    rarity = srOrBetter;
    if (rarity === "SSR") {
      newPityCount = 0;
      isSSR = true;
    } else {
      isSR = true;
    }
  }
  // Normal pull rates
  else {
    const roll = Math.random();
    if (roll < 0.006) { // 0.6% base SSR rate
      rarity = "SSR";
      newPityCount = 0;
      isSSR = true;
    } else if (roll < 0.057) { // 5.1% SR rate
      rarity = "SR";
      isSR = true;
    } else {
      rarity = "R";
    }
  }
  
  // Filter pool by rarity
  const rarityPool = seriesPool.filter(card => card.rarity === rarity);
  
  // If no cards of this rarity, fallback to any card (shouldn't happen with proper data)
  const poolToUse = rarityPool.length > 0 ? rarityPool : seriesPool;
  
  // Check if pull should be featured (50% chance if SSR/SR)
  const shouldBeFeatured = (isSSR || isSR) && featuredIds.length > 0 && Math.random() < 0.5;
  
  let result: GachaSeriesCard | undefined;
  
  if (shouldBeFeatured) {
    // Get featured cards of the right rarity
    const featuredPool = poolToUse.filter(card => featuredIds.includes(card.id));
    if (featuredPool.length > 0) {
      // Random selection from featured pool
      result = featuredPool[Math.floor(Math.random() * featuredPool.length)];
    }
  }
  
  // If not featured or no featured cards available, select from general pool
  if (!result) {
    result = poolToUse[Math.floor(Math.random() * poolToUse.length)];
  }
  
  // Check if result is a featured card
  const isFeatured = featuredIds.includes(result.id);
  
  return {
    result: result,
    newPityCount,
    isSSR,
    isSR,
    isFeatured
  };
};
