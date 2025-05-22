
export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
      image_url?: string;
    }
  };
  genres?: {
    mal_id: number;
    name: string;
  }[];
  synopsis: string; // Changed from optional to required
  score: number;    // Changed from optional to required
  episodes: number; // Changed from optional to required
  status: string;   // Changed from optional to required
  rating: string;   // Changed from optional to required
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
