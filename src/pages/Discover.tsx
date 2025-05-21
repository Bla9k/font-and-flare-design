
import { useState, useEffect } from "react";
import { searchAnime } from "@/api/jikan";
import { Anime } from "@/types/anime";
import AnimeCard from "@/components/AnimeCard";
import Layout from "@/components/Layout";

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState("");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.length > 2) {
        fetchAnime();
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm, currentPage]);
  
  const fetchAnime = async () => {
    setLoading(true);
    try {
      const response = await searchAnime(searchTerm, currentPage);
      // Fixed: Only set the data array to the state
      setAnimeList(response.data);
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold text-anime-red font-display mb-6">
          Discover Anime
        </h1>
        
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for anime..."
            className="w-full p-2 bg-anime-gray text-white border border-anime-red/30 rounded-lg focus:outline-none focus:border-anime-red"
          />
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-anime-red border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {animeList.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
        
        {animeList.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-anime-gray text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-anime-gray text-white rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-anime-gray text-white rounded-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
