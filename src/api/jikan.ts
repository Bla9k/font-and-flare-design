// Base Jikan API URL
const API_URL = "https://api.jikan.moe/v4";

// Common types
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
  synopsis: string;
  score: number;
  episodes: number;
  status: string;
  rating: string;
  genres: {
    mal_id: number;
    name: string;
  }[];
  aired: {
    from: string;
    to: string;
  };
  // Add missing properties that are used in AnimeDetails
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

export interface Manga {
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
  synopsis: string;
  score: number;
  volumes?: number;
  chapters?: number;
  status: string;
  genres: {
    mal_id: number;
    name: string;
  }[];
  authors?: {
    mal_id: number;
    name: string;
    type: string;
  }[];
  published?: {
    from: string;
    to: string;
    string: string;
  };
  title_japanese?: string;
}

export interface JikanResponse<T> {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page?: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: T;
}

// API functions

// Get top anime
export const getTopAnime = async (page = 1): Promise<Anime[]> => {
  try {
    const response = await fetch(`${API_URL}/top/anime?page=${page}&limit=20`);
    const data: JikanResponse<Anime[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching top anime:", error);
    return [];
  }
};

// Get seasonal anime
export const getSeasonalAnime = async (): Promise<Anime[]> => {
  try {
    const response = await fetch(`${API_URL}/seasons/now`);
    const data: JikanResponse<Anime[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching seasonal anime:", error);
    return [];
  }
};

// Get anime by ID
export const getAnimeById = async (id: number): Promise<Anime | null> => {
  try {
    const response = await fetch(`${API_URL}/anime/${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching anime with ID ${id}:`, error);
    return null;
  }
};

// Search anime
export const searchAnime = async (params: Record<string, string>): Promise<Anime[]> => {
  try {
    // Build the query string from the params object
    const queryParams = Object.entries(params)
      .filter(([_, value]) => value) // Filter out empty values
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const response = await fetch(`${API_URL}/anime?${queryParams}&limit=20`);
    const data: JikanResponse<Anime[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error searching anime:", error);
    return [];
  }
};

// Get top manga
export const getTopManga = async (page = 1): Promise<Manga[]> => {
  try {
    const response = await fetch(`${API_URL}/top/manga?page=${page}&limit=20`);
    const data: JikanResponse<Manga[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching top manga:", error);
    return [];
  }
};

// Search manga
export const searchManga = async (query: string, page = 1): Promise<{manga: Manga[], pagination: any}> => {
  try {
    const response = await fetch(`${API_URL}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=20`);
    const data: JikanResponse<Manga[]> = await response.json();
    return {
      manga: data.data,
      pagination: data.pagination
    };
  } catch (error) {
    console.error("Error searching manga:", error);
    return {
      manga: [],
      pagination: {
        last_visible_page: 0,
        has_next_page: false,
        current_page: 1,
        items: {
          count: 0,
          total: 0,
          per_page: 20
        }
      }
    };
  }
};

// Get manga by ID
export const getMangaById = async (id: number): Promise<Manga | null> => {
  try {
    const response = await fetch(`${API_URL}/manga/${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching manga with ID ${id}:`, error);
    return null;
  }
};
