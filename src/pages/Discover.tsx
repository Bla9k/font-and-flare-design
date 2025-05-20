
import { useState, useEffect } from "react";
import { searchAnime, Anime } from "@/api/jikan";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import { toast } from "@/components/ui/use-toast";

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const data = await searchAnime(searchTerm);
      setResults(data);
    } catch (error) {
      console.error("Error searching anime:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for anime. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-display font-bold mb-8 text-center">Discover Anime</h1>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for anime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-anime-gray border-anime-light-gray text-white pl-10 h-12"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[320px] bg-anime-gray animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No results found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-anime-cyberpunk-blue text-6xl mb-6 font-display">
              // 検索
            </div>
            <p className="text-gray-400 max-w-lg">
              Enter a keyword above to search for your favorite anime titles, characters, or genres.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
