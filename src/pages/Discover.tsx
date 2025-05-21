
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import AnimeCard from "@/components/AnimeCard";
import { Anime } from "@/types/anime";
import { toast } from "@/components/ui/use-toast";

export default function Discover() {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.jikan.moe/v4/top/anime?filter=airing");
        const data = await response.json();
        
        if (data && data.data) {
          setTrending(data.data.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching trending anime:", error);
        toast({
          title: "Error",
          description: "Failed to load trending anime. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 relative">
          <span className="text-anime-cyberpunk-blue">[</span> 
          Discover
          <span className="text-anime-cyberpunk-blue">_</span>
          <span className="text-anime-red">]</span>
        </h1>

        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-display font-bold">Trending Now</h2>
            <div className="h-0.5 flex-1 bg-anime-light-gray/50"></div>
            <span className="text-sm font-digital text-anime-cyberpunk-blue">//HOT</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-[320px] bg-anime-gray animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {trending && trending.length > 0 ? (
                trending.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-anime-cyberpunk-blue">No trending anime found</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
