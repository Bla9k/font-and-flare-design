
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { searchManga, getTopManga, Manga } from "@/api/jikan";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import MangaCard from "@/components/MangaCard";
import Layout from "@/components/Layout";
import { Search, SlidersHorizontal } from "lucide-react";

export default function MangaPage() {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch top manga on mount
  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true);
      try {
        const data = await getTopManga();
        if (data && Array.isArray(data)) {
          setManga(data);
        }
      } catch (error) {
        console.error("Error fetching manga:", error);
        toast({
          title: "Error",
          description: "Failed to load manga. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchManga();
  }, []);
  
  // Search manga
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await searchManga(query);
      if (data && Array.isArray(data)) {
        setManga(data);
      }
    } catch (error) {
      console.error("Error searching manga:", error);
      toast({
        title: "Error",
        description: "Failed to search manga. Please try again later.",
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
            <span className="text-anime-red">Manga</span> Browser
          </h1>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Search manga..."
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
              {manga && manga.length > 0 ? (
                manga.map((item) => (
                  <MangaCard key={item.mal_id} manga={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No manga found.</p>
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
