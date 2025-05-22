
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Film, BookOpen, X, SlidersHorizontal, Sparkles, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Anime } from "@/types/anime";

export default function SearchPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [email, setEmail] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchType, setSearchType] = useState<"all" | "anime" | "manga">("all");
  const [advancedFilters, setAdvancedFilters] = useState({
    genres: "",
    rating: "",
    status: "airing",
    sort: "popularity"
  });

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recent_searches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Focus search input when dialog opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Handle search submission
  const handleSearch = async () => {
    if (!searchTerm.trim() && !advancedFilters.genres) return;
    
    setIsLoading(true);
    
    // Save to recent searches
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      const newSearches = [searchTerm, ...recentSearches].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem("recent_searches", JSON.stringify(newSearches));
    }
    
    try {
      // Build API URL based on search type and filters
      let apiUrl = "";
      if (searchTerm) {
        if (searchType === "manga") {
          apiUrl = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(searchTerm)}`;
        } else {
          apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchTerm)}`;
        }
      } else {
        // Advanced search without keyword
        const filters = [];
        
        if (advancedFilters.status) {
          filters.push(`status=${advancedFilters.status}`);
        }
        
        if (advancedFilters.genres) {
          filters.push(`genres=${advancedFilters.genres}`);
        }
        
        if (advancedFilters.rating) {
          filters.push(`rating=${advancedFilters.rating}`);
        }
        
        if (advancedFilters.sort) {
          filters.push(`order_by=${advancedFilters.sort}`);
        }
        
        apiUrl = `https://api.jikan.moe/v4/${searchType === "manga" ? "manga" : "anime"}?${filters.join("&")}`;
      }
      
      if (hasJapanese(searchTerm)) {
        // If search term contains Japanese characters, simulate AI-powered search
        toast({
          title: "AI Translation Detected",
          description: "Translated Japanese query and searching...",
        });
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.data) {
        setSearchResults(data.data.slice(0, 10));
      } else {
        toast({
          title: "No Results",
          description: "We couldn't find any matches for your search.",
          variant: "destructive"
        });
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
      toast({
        title: "Search Failed",
        description: "There was an error completing your search. Please try again.",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Random anime search
  const handleRandomSearch = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("https://api.jikan.moe/v4/random/anime");
      const data = await response.json();
      
      if (data && data.data) {
        setSearchResults([data.data]);
        toast({
          title: "Random Anime Found",
          description: "Enjoy this random selection!",
        });
      }
    } catch (error) {
      console.error("Error fetching random anime:", error);
      toast({
        title: "Random Search Failed",
        description: "Unable to get a random anime. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle waitlist email submission
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Added to Waitlist",
      description: "You'll be notified when Casper AI Search is available!",
    });
    
    setShowWaitlist(false);
    setEmail("");
  };

  // Toggle advanced search options
  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  // Check for Japanese characters in a string
  function hasJapanese(str: string) {
    return /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u3400-\u4DBF]/.test(str);
  }

  // Japanese text animation for the search hints
  const textVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3 
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-anime-red">カスパー</span> Search
            </h1>
            <p className="text-gray-300 md:text-lg">Find anime and manga with our intelligent search system.</p>
          </motion.div>
          
          {/* Search bar */}
          <div className="relative mx-auto max-w-lg mb-8">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Type anything, even in Japanese..."
                className="w-full h-14 bg-anime-gray border-2 border-anime-light-gray focus:border-anime-red rounded-lg pl-12 pr-12 text-white focus:outline-none transition-colors"
              />
              <div className="absolute left-4 top-4">
                <SearchIcon className="h-6 w-6 text-gray-400" />
              </div>
              {searchTerm && (
                <button 
                  className="absolute right-14 top-4 text-gray-400 hover:text-white transition-colors"
                  onClick={clearSearch}
                >
                  <X className="h-6 w-6" />
                </button>
              )}
              <button 
                className={`absolute right-3 top-3 px-2 py-1 rounded-lg font-digital text-xs border ${
                  searchType === "all" ? "border-anime-red text-anime-red" : 
                  searchType === "anime" ? "border-anime-cyberpunk-blue text-anime-cyberpunk-blue" :
                  "border-anime-red/50 text-anime-red/50"
                }`}
                onClick={() => setSearchType(searchType === "all" ? "anime" : searchType === "anime" ? "manga" : "all")}
              >
                {searchType === "all" ? "ALL" : searchType === "anime" ? "ANIME" : "MANGA"}
              </button>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={handleSearch}
                disabled={(!searchTerm.trim() && !advancedFilters.genres) || isLoading}
                className="flex-1 bg-anime-red hover:bg-opacity-90 disabled:opacity-50 text-white font-display py-3 rounded-lg transition-all"
              >
                {isLoading ? 
                  <span className="flex items-center justify-center">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Searching...
                  </span> : 
                  "Search"
                }
              </button>
              
              <button 
                onClick={toggleAdvancedSearch}
                className="px-4 py-3 bg-anime-gray hover:bg-anime-light-gray rounded-lg transition-colors"
                title="Advanced Search"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
              
              <button 
                onClick={handleRandomSearch}
                className="px-4 py-3 bg-anime-cyberpunk-blue hover:bg-opacity-90 rounded-lg transition-colors"
                title="Random Anime"
              >
                <Shuffle className="h-5 w-5" />
              </button>
            </div>
            
            {/* Advanced Search Options */}
            <AnimatePresence>
              {showAdvancedSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="bg-anime-gray/60 border border-anime-light-gray rounded-lg p-4">
                    <h3 className="font-digital text-sm text-anime-cyberpunk-blue mb-3">ADVANCED FILTERS</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Status</label>
                        <select 
                          className="w-full bg-anime-dark border border-anime-light-gray rounded px-3 py-2 text-sm"
                          value={advancedFilters.status}
                          onChange={(e) => setAdvancedFilters({...advancedFilters, status: e.target.value})}
                        >
                          <option value="airing">Airing</option>
                          <option value="complete">Completed</option>
                          <option value="upcoming">Upcoming</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Sort By</label>
                        <select 
                          className="w-full bg-anime-dark border border-anime-light-gray rounded px-3 py-2 text-sm"
                          value={advancedFilters.sort}
                          onChange={(e) => setAdvancedFilters({...advancedFilters, sort: e.target.value})}
                        >
                          <option value="popularity">Popularity</option>
                          <option value="score">Rating</option>
                          <option value="title">Title</option>
                          <option value="start_date">Release Date</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Genre</label>
                        <select 
                          className="w-full bg-anime-dark border border-anime-light-gray rounded px-3 py-2 text-sm"
                          value={advancedFilters.genres}
                          onChange={(e) => setAdvancedFilters({...advancedFilters, genres: e.target.value})}
                        >
                          <option value="">Any</option>
                          <option value="1">Action</option>
                          <option value="2">Adventure</option>
                          <option value="4">Comedy</option>
                          <option value="8">Drama</option>
                          <option value="10">Fantasy</option>
                          <option value="22">Romance</option>
                          <option value="24">Sci-Fi</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Rating</label>
                        <select 
                          className="w-full bg-anime-dark border border-anime-light-gray rounded px-3 py-2 text-sm"
                          value={advancedFilters.rating}
                          onChange={(e) => setAdvancedFilters({...advancedFilters, rating: e.target.value})}
                        >
                          <option value="">Any</option>
                          <option value="g">G - All Ages</option>
                          <option value="pg">PG - Children</option>
                          <option value="pg13">PG-13 - Teens 13+</option>
                          <option value="r17">R - 17+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Casper AI Coming Soon */}
            <div className="mt-4 text-center">
              <button 
                onClick={() => setShowWaitlist(true)}
                className="inline-flex items-center gap-2 text-anime-cyberpunk-blue hover:text-anime-red text-sm transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Casper AI Search coming soon (join waitlist)
              </button>
            </div>
            
            {/* Recent searches */}
            {recentSearches.length > 0 && !searchResults.length && (
              <div className="mt-8">
                <h3 className="text-sm font-digital text-gray-400 mb-3 flex items-center">
                  <SearchIcon className="h-4 w-4 mr-1" />
                  RECENT SEARCHES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(term);
                        handleSearch();
                      }}
                      className="px-3 py-1 bg-anime-gray hover:bg-anime-light-gray rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Search results */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <div className="inline-flex flex-col items-center">
                  <div className="h-16 w-16 border-4 border-anime-red border-t-transparent rounded-full animate-spin"></div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      transition: { repeat: Infinity, duration: 2 }
                    }}
                    className="mt-6 font-jp text-2xl"
                  >
                    検索中...
                  </motion.div>
                </div>
              </motion.div>
            ) : searchResults.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6 pb-3 border-b border-anime-light-gray/30">
                  <h2 className="text-xl font-display">Search Results</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((result) => (
                    <Link 
                      key={`${result.type || 'anime'}-${result.mal_id}`}
                      to={`/${result.type || (searchType === "manga" ? "manga" : "anime")}/${result.mal_id}`}
                      className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg overflow-hidden hover:border-anime-red transition-colors"
                    >
                      <div className="relative h-48">
                        <img 
                          src={result.images?.jpg?.image_url || result.image_url || "https://via.placeholder.com/320x480?text=No+Image"} 
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-anime-dark/80 backdrop-blur-sm text-xs font-digital">
                          {(result.type === 'anime' || searchType === 'anime' || searchType === 'all') ? (
                            <div className="flex items-center text-anime-cyberpunk-blue">
                              <Film className="h-3 w-3 mr-1" />
                              ANIME
                            </div>
                          ) : (
                            <div className="flex items-center text-anime-red">
                              <BookOpen className="h-3 w-3 mr-1" />
                              MANGA
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-medium">{result.title}</h3>
                        {result.genres && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.genres.slice(0, 3).map((genre: any) => (
                              <span key={genre.mal_id} className="text-xs px-2 py-0.5 rounded-full bg-anime-dark text-gray-300">
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          
          {/* Japanese animated typography hints */}
          <div className="relative h-96 overflow-hidden mt-20">
            <AnimatePresence>
              {!searchResults.length && !isLoading && (
                <>
                  <motion.div 
                    key="hint-1"
                    className="absolute top-0 left-0 writing-vertical text-anime-red/10 font-jp font-black text-9xl"
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    検索
                  </motion.div>
                  
                  <motion.div 
                    key="hint-2"
                    className="absolute top-20 right-10 text-anime-cyberpunk-blue/10 font-jp font-black text-7xl"
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: 0.3 }}
                  >
                    アニメ
                  </motion.div>
                  
                  <motion.div 
                    key="hint-3"
                    className="absolute bottom-10 left-20 text-anime-red/10 font-jp font-black text-8xl"
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: 0.6 }}
                  >
                    マンガ
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-anime-gray border border-anime-light-gray rounded-lg w-full max-w-md p-6 m-4"
          >
            <h3 className="text-xl font-display font-bold mb-1">Casper AI Search Waitlist</h3>
            <p className="text-gray-300 text-sm mb-6">
              Join the waitlist for early access to our AI-powered search, which can understand natural language and translate searches in any language.
            </p>
            
            <form onSubmit={handleWaitlistSubmit}>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 bg-anime-dark border border-anime-light-gray focus:border-anime-red rounded-lg px-4 text-white focus:outline-none transition-colors mb-3"
                required
              />
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowWaitlist(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-anime-red hover:bg-opacity-90 text-white rounded transition-colors"
                >
                  Join Waitlist
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
