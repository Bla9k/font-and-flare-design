
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
