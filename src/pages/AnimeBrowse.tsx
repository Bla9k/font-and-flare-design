
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import AnimeCard from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Anime, searchAnime, getTopAnime } from "@/api/jikan";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AnimeBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchMode, setSearchMode] = useState(searchParams.has("q"));

  useEffect(() => {
    fetchAnime();
  }, [currentPage, searchParams]);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      const queryParam = searchParams.get("q");
      const pageParam = Number(searchParams.get("page")) || 1;
      
      if (queryParam) {
        // Updated to use the new searchAnime function that takes a params object
        const searchResults = await searchAnime({ 
          q: queryParam,
          page: pageParam.toString() 
        });
        setAnimeList(searchResults);
        setTotalPages(20); // Since we don't have pagination info now, default to 20
        setSearchMode(true);
      } else {
        const anime = await getTopAnime(pageParam);
        setAnimeList(anime);
        setTotalPages(20); // Assuming 20 pages for top anime
        setSearchMode(false);
      }
    } catch (error) {
      console.error("Error fetching anime:", error);
      toast({
        title: "Error",
        description: "Failed to fetch anime data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm, page: "1" });
      setCurrentPage(1);
    } else {
      setSearchParams({ page: "1" });
      setCurrentPage(1);
      setSearchMode(false);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const params: { q?: string, page: string } = { page: newPage.toString() };
    if (searchMode && searchTerm) {
      params.q = searchTerm;
    }
    
    setSearchParams(params);
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold relative flex items-center gap-2">
            <span className="text-anime-cyberpunk-blue">[</span> 
            Browse Anime
            <span className="text-anime-cyberpunk-blue">_</span>
            <span className="text-anime-red">]</span>
          </h1>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-96 relative">
            <Input
              type="text"
              placeholder="Search anime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-anime-cyberpunk-blue/50 bg-anime-dark/80 backdrop-blur-md"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              className="absolute right-0 top-0 h-full text-anime-cyberpunk-blue hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="bg-anime-gray/20 backdrop-blur-sm border border-anime-light-gray/50 p-4 md:p-6 rounded-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold flex items-center">
              <span className="h-4 w-1 bg-anime-red mr-2"></span>
              {searchMode ? `Search Results: ${searchTerm}` : "Top Anime"}
            </h2>
            <div className="font-digital text-sm text-anime-cyberpunk-blue">
              // PAGE {currentPage} OF {totalPages}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="h-[300px] bg-anime-gray/40 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            <>
              {animeList && animeList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {animeList.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-anime-cyberpunk-blue font-digital text-xl mb-2">NO_RESULTS_FOUND</p>
                  <p className="text-gray-400">Try a different search term or browse the top anime</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && animeList.length > 0 && (
          <div className="flex justify-center mt-8 mb-16">
            <div className="flex items-center gap-2 bg-anime-dark/80 backdrop-blur-md p-2 rounded-md border border-anime-cyberpunk-blue/30">
              <Button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="ghost"
                className="h-8 w-8 p-0 text-anime-cyberpunk-blue"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = 0;
                
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={i}
                    onClick={() => changePage(pageNum)}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className={`h-8 w-8 p-0 font-digital ${
                      currentPage === pageNum 
                        ? 'bg-anime-cyberpunk-blue text-anime-dark' 
                        : 'text-anime-cyberpunk-blue border-anime-cyberpunk-blue/50'
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="ghost"
                className="h-8 w-8 p-0 text-anime-cyberpunk-blue"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
