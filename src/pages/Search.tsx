
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Film, BookOpen, X } from "lucide-react";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Mock results for the demo (in a real app, these would come from an API call)
const mockAnimeResults = [
  { mal_id: 1, title: "Attack on Titan", type: "anime", image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg" },
  { mal_id: 2, title: "Death Note", type: "anime", image_url: "https://cdn.myanimelist.net/images/anime/9/9453.jpg" },
  { mal_id: 3, title: "Fullmetal Alchemist: Brotherhood", type: "anime", image_url: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg" },
];

const mockMangaResults = [
  { mal_id: 1, title: "Berserk", type: "manga", image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg" },
  { mal_id: 2, title: "Vagabond", type: "manga", image_url: "https://cdn.myanimelist.net/images/manga/1/259070.jpg" },
  { mal_id: 3, title: "One Piece", type: "manga", image_url: "https://cdn.myanimelist.net/images/manga/2/253146.jpg" },
];

// Check for Japanese characters in a string
function hasJapanese(str: string) {
  return /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u3400-\u4DBF]/.test(str);
}

export default function SearchPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchType, setSearchType] = useState<"all" | "anime" | "manga">("all");

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
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    // Save to recent searches
    if (!recentSearches.includes(searchTerm)) {
      const newSearches = [searchTerm, ...recentSearches].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem("recent_searches", JSON.stringify(newSearches));
    }
    
    // For the demo we'll use mock data and add some delay to simulate API call
    setTimeout(() => {
      if (hasJapanese(searchTerm)) {
        // If search term contains Japanese characters, simulate AI-powered search
        toast({
          title: "AI Translation Detected",
          description: "Translated Japanese query and searching...",
        });
      }
      
      // Filter mock results based on search type
      let results: any[] = [];
      
      if (searchType === "all" || searchType === "anime") {
        results = [...results, ...mockAnimeResults.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )];
      }
      
      if (searchType === "all" || searchType === "manga") {
        results = [...results, ...mockMangaResults.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )];
      }
      
      // If no direct matches, pretend the AI found something
      if (results.length === 0) {
        if (searchType === "all" || searchType === "anime") {
          results.push(mockAnimeResults[0]);
        }
        if (searchType === "all" || searchType === "manga") {
          results.push(mockMangaResults[0]);
        }
        
        toast({
          title: "AI-Powered Results",
          description: "Using semantic search to find related content",
        });
      }
      
      setSearchResults(results);
      setIsLoading(false);
    }, 1000);
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
    
    // In a real app, this would send the email to your backend
    toast({
      title: "Added to Waitlist",
      description: "You'll be notified when AI Search is available!",
    });
    
    setShowWaitlist(false);
    setEmail("");
  };

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
          <div className="relative mx-auto max-w-lg mb-16">
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
            
            <button 
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isLoading}
              className="mt-4 w-full bg-anime-red hover:bg-opacity-90 disabled:opacity-50 text-white font-display py-3 rounded-lg transition-all"
            >
              {isLoading ? 
                <span className="flex items-center justify-center">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Searching...
                </span> : 
                "Search"
              }
            </button>
            
            {/* Waitlist CTA */}
            <div className="mt-3 text-center">
              <button 
                onClick={() => setShowWaitlist(true)}
                className="text-anime-cyberpunk-blue hover:text-anime-red text-sm transition-colors"
              >
                Try our AI-powered search (early access waitlist)
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
                      key={`${result.type}-${result.mal_id}`}
                      to={`/${result.type}/${result.mal_id}`}
                      className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg overflow-hidden hover:border-anime-red transition-colors"
                    >
                      <div className="relative h-48">
                        <img 
                          src={result.image_url} 
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-anime-dark/80 backdrop-blur-sm text-xs font-digital">
                          {result.type === 'anime' ? (
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
            <h3 className="text-xl font-display font-bold mb-1">AI Search Waitlist</h3>
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
