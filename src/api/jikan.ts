
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
  type: string;
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
  volumes: number;
  chapters: number;
  status: string;
  genres: {
    mal_id: number;
    name: string;
  }[];
  published: {
    from: string;
    to: string;
  };
  type: string;
}

export interface JikanResponse<T> {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
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
export const getTopAnime = async (): Promise<Anime[]> => {
  try {
    const response = await fetch(`${API_URL}/top/anime?limit=20`);
    const data: JikanResponse<Anime[]> = await response.json();
    return data.data || [];
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
    return data.data || [];
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
    return data.data || null;
  } catch (error) {
    console.error(`Error fetching anime with ID ${id}:`, error);
    return null;
  }
};

// Search anime
export const searchAnime = async (query: string, page: number = 1): Promise<Anime[]> => {
  try {
    const response = await fetch(`${API_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`);
    const data: JikanResponse<Anime[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching anime:", error);
    return [];
  }
};

// Get top manga
export const getTopManga = async (): Promise<Manga[]> => {
  try {
    const response = await fetch(`${API_URL}/top/manga?limit=20`);
    const data: JikanResponse<Manga[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching top manga:", error);
    return [];
  }
};

// Get manga by ID
export const getMangaById = async (id: number): Promise<Manga | null> => {
  try {
    const response = await fetch(`${API_URL}/manga/${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Error fetching manga with ID ${id}:`, error);
    return null;
  }
};

// Search manga
export const searchManga = async (query: string, page: number = 1): Promise<Manga[]> => {
  try {
    const response = await fetch(`${API_URL}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=20`);
    const data: JikanResponse<Manga[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching manga:", error);
    return [];
  }
};
