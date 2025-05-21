
export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  genres?: {
    mal_id: number;
    name: string;
  }[];
  synopsis?: string;
  score?: number;
  episodes?: number;
  status?: string;
  rating?: string;
  aired?: {
    from?: string;
    to?: string;
  };
}

export interface AnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface GachaCard {
  id: string;
  title: string;
  imageUrl: string;
  rarity: "R" | "SR" | "SSR" | "UR";
  series: string;
  description: string;
  tagline: string;
  stars: number;
  type: "anime" | "manga";
  backgroundColor?: string;
}
