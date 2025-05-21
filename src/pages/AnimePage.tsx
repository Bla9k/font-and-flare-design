
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { searchAnime, getSeasonalAnime, Anime } from "@/api/jikan";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import AnimeCard from "@/components/AnimeCard";
import Layout from "@/components/Layout";
import { Search, SlidersHorizontal } from "lucide-react";

export default function AnimePage() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch seasonal anime on mount
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const data = await getSeasonalAnime();
        if (data && Array.isArray(data)) {
          setAnime(data);
        }
      } catch (error) {
        console.error("Error fetching anime:", error);
        toast({
          title: "Error",
          description: "Failed to load anime. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnime();
  }, []);
  
  // Search anime
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await searchAnime(query);
      if (data && Array.isArray(data)) {
        setAnime(data);
      }
    } catch (error) {
      console.error("Error searching anime:", error);
      toast({
        title: "Error",
        description: "Failed to search anime. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  return (
    <Layout>
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">
            <span className="text-anime-red">Anime</span> Browser
          </h1>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Search anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-anime-gray border-anime-light-gray pr-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            size="icon"
            variant="ghost" 
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[320px] bg-anime-gray animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {anime && anime.length > 0 ? (
                anime.map((item) => (
                  <AnimeCard key={item.mal_id} anime={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No anime found.</p>
                </div>
              )}
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => page < totalPages && setPage(page + 1)}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </motion.div>
    </Layout>
  );
}
