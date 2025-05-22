
export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    },
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    }
  };
  genres: {
    mal_id: number;
    name: string;
  }[];
  synopsis: string;
  score: number;
  episodes: number;
  status: string;
  rating: string;
  aired: {
    from: string;
    to: string;
  };
  // Additional fields that might be needed based on the API
  title_japanese?: string;
  studios?: {
    mal_id: number;
    name: string;
  }[];
  producers?: {
    mal_id: number;
    name: string;
  }[];
}

export interface AnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

// Gacha series card interface based on the image reference
export interface GachaSeriesCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  colorScheme: string;
  coins?: number;
  rarity?: string; // New: SSR, SR, R
  specialty?: string; // New: What this card specializes in
  releaseDate?: string; // New: When this card was released
  limited?: boolean; // New: Whether this card is limited edition
  artist?: string; // New: Artist who created the card art
  universe?: string; // New: Which anime universe this belongs to
  powerLevel?: number; // New: Power level from 1-100
  collectionValue?: number; // New: How valuable in collections
}

// New interface for Gacha banners
export interface GachaBanner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  featuredSeries: number[]; // IDs of featured series with higher pull rates
  endDate: string;
  colorScheme: string;
  bannerType?: 'limited' | 'seasonal' | 'collaboration' | 'standard'; // Type of banner
  boost?: number; // Rate boost percentage
  bonusItems?: string[]; // Special bonus items
}

