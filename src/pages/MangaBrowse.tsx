import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Manga, searchManga, getTopManga } from "@/api/jikan";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function MangaBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchMode, setSearchMode] = useState(searchParams.has("q"));

  useEffect(() => {
    fetchManga();
  }, [currentPage, searchParams]);

  const fetchManga = async () => {
    setLoading(true);
    try {
      const queryParam = searchParams.get("q");
      const pageParam = Number(searchParams.get("page")) || 1;
      
      if (queryParam) {
        // Keep using the original searchManga function as it's not been updated yet
        const result = await searchManga(queryParam, pageParam);
        setMangaList(result.manga);
        setTotalPages(result.pagination.last_visible_page);
        setSearchMode(true);
      } else {
        const manga = await getTopManga(pageParam);
        setMangaList(manga);
        setTotalPages(20); // Assuming 20 pages for top manga
        setSearchMode(false);
      }
    } catch (error) {
      console.error("Error fetching manga:", error);
      toast({
        title: "Error",
        description: "Failed to fetch manga data. Please try again later.",
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
            Browse Manga
            <span className="text-anime-cyberpunk-blue">_</span>
            <span className="text-anime-red">]</span>
          </h1>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-96 relative">
            <Input
              type="text"
              placeholder="Search manga..."
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
              {searchMode ? `Search Results: ${searchTerm}` : "Top Manga"}
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
              {mangaList && mangaList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {mangaList.map((manga) => (
                    <div 
                      key={manga.mal_id} 
                      className="group relative overflow-hidden rounded-lg border border-anime-light-gray bg-anime-gray/60 backdrop-blur-sm hover:border-anime-cyberpunk-blue/60 transition-all duration-300"
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        <img 
                          src={manga.images.jpg.image_url} 
                          alt={manga.title}
                          className="w-full h-full object-cover opacity-20 transform group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/80 to-transparent"></div>

                      <div className="relative z-10 p-4 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-display font-medium line-clamp-2 group-hover:text-anime-cyberpunk-blue transition-colors">
                            {manga.title}
                          </h3>
                          {manga.score > 0 && (
                            <div className="px-2 py-0.5 bg-anime-red text-white text-sm rounded font-digital">
                              {manga.score.toFixed(1)}
                            </div>
                          )}
                        </div>

                        <p className="text-gray-400 text-xs mb-2 line-clamp-3">{manga.synopsis}</p>
                        
                        <div className="mt-auto flex flex-wrap gap-1">
                          {manga.genres?.slice(0, 3).map((genre) => (
                            <span 
                              key={genre.mal_id} 
                              className="px-1.5 py-0.5 text-xs bg-anime-dark border border-anime-light-gray rounded"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-anime-cyberpunk-blue font-digital text-xl mb-2">NO_RESULTS_FOUND</p>
                  <p className="text-gray-400">Try a different search term or browse the top manga</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && mangaList.length > 0 && (
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
