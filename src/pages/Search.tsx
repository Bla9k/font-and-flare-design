
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Anime } from "@/types/anime";
import AnimeCard from "@/components/AnimeCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, SlidersHorizontal, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [aiResults, setAiResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minScore, setMinScore] = useState([5]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<{mal_id: number, name: string}[]>([]);

  // Initialize genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/genres/anime");
        const data = await response.json();
        if (data && data.data) {
          setAvailableGenres(data.data);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    
    fetchGenres();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearchResults([]);
    
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("q", searchQuery);
      
      if (showAdvanced) {
        params.append("min_score", minScore[0].toString());
        
        if (selectedGenres.length > 0) {
          params.append("genres", selectedGenres.join(","));
        }
      }
      
      const response = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}&sfw=true`);
      const data = await response.json();
      
      if (data && data.data) {
        setSearchResults(data.data);
        
        if (data.data.length === 0) {
          toast({
            title: "No results found",
            description: "Try a different search term or filters",
          });
        }
      }
    } catch (error) {
      console.error("Error searching anime:", error);
      toast({
        title: "Search failed",
        description: "There was an error processing your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) return;
    
    setAiLoading(true);
    setAiResults([]);
    
    try {
      // First translate the natural language query into search parameters
      toast({
        title: "AI Search Processing",
        description: "Converting your request into search parameters...",
      });
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Parse the query to extract search parameters
      const keywords = aiSearchQuery.toLowerCase();
      let genreParam = "";
      let scoreParam = "";
      let queryParam = "";
      
      // Simple AI-like parsing (in a real app, this would use a real AI model)
      if (keywords.includes("action") || keywords.includes("fight")) {
        genreParam = "1"; // Action genre
      } else if (keywords.includes("romance") || keywords.includes("love")) {
        genreParam = "22"; // Romance genre
      } else if (keywords.includes("fantasy") || keywords.includes("magic")) {
        genreParam = "10"; // Fantasy genre
      }
      
      if (keywords.includes("good") || keywords.includes("best") || keywords.includes("top")) {
        scoreParam = "7"; // Good rated anime
      }
      
      // Extract main query terms
      queryParam = aiSearchQuery
        .replace(/with|featuring|about|like|similar to|recommend|good|best|top|action|romance|fantasy|magic|fight/gi, "")
        .trim();
      
      // Build the actual search params
      const params = new URLSearchParams();
      
      if (queryParam) {
        params.append("q", queryParam);
      }
      
      if (genreParam) {
        params.append("genres", genreParam);
      }
      
      if (scoreParam) {
        params.append("min_score", scoreParam);
      }
      
      // Now perform the actual search
      const response = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}&limit=12&sfw=true`);
      const data = await response.json();
      
      if (data && data.data) {
        setAiResults(data.data);
        
        toast({
          title: "AI Search Complete",
          description: `Found ${data.data.length} results for "${aiSearchQuery}"`,
        });
        
        if (data.data.length === 0) {
          toast({
            title: "No results found",
            description: "Try a different description or request",
          });
        }
      }
    } catch (error) {
      console.error("Error with AI search:", error);
      toast({
        title: "AI Search failed",
        description: "There was an error processing your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleRandomAnime = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("https://api.jikan.moe/v4/random/anime");
      const data = await response.json();
      
      if (data && data.data) {
        setSearchResults([data.data]);
        toast({
          title: "Random Anime Found",
          description: `Check out "${data.data.title}"!`,
        });
      }
    } catch (error) {
      console.error("Error fetching random anime:", error);
      toast({
        title: "Random search failed",
        description: "There was an error finding a random anime. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreName: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreName)
        ? prev.filter(g => g !== genreName)
        : [...prev, genreName]
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 relative">
          <span className="text-anime-cyberpunk-blue">[</span> 
          Search
          <span className="text-anime-cyberpunk-blue">_</span>
          <span className="text-anime-red">]</span>
        </h1>
        
        <Tabs defaultValue="standard" className="mb-8">
          <TabsList className="w-full bg-anime-gray mb-4">
            <TabsTrigger value="standard" className="flex-1">Standard Search</TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">AI Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search for anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pr-10 bg-anime-gray border-anime-light-gray"
                />
                {searchQuery && (
                  <button
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <Button onClick={handleSearch} disabled={loading} className="bg-anime-red hover:bg-anime-red/90">
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw size={18} />
                  </motion.div>
                ) : (
                  <SearchIcon size={18} />
                )}
              </Button>
              <Button onClick={handleRandomAnime} variant="outline" className="border-anime-light-gray">
                Random
              </Button>
            </div>
            
            {/* Advanced Search Toggle */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm text-anime-cyberpunk-blue"
              >
                <SlidersHorizontal size={14} className="mr-1" />
                {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
              </button>
            </div>
            
            {/* Advanced Search Options */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-anime-dark/40 p-4 rounded-lg border border-anime-light-gray/30"
                >
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Minimum Score: {minScore[0]}</Label>
                      <span className="text-xs text-gray-400">({minScore[0]}/10)</span>
                    </div>
                    <Slider
                      defaultValue={[5]}
                      min={0}
                      max={10}
                      step={0.5}
                      value={minScore}
                      onValueChange={setMinScore}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Genres</Label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                      {availableGenres.slice(0, 15).map((genre) => (
                        <div key={genre.mal_id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`genre-${genre.mal_id}`}
                            checked={selectedGenres.includes(genre.mal_id.toString())}
                            onCheckedChange={() => toggleGenre(genre.mal_id.toString())}
                          />
                          <label
                            htmlFor={`genre-${genre.mal_id}`}
                            className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {genre.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-display font-bold mb-4">Results</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4">
            <div className="bg-gradient-to-r from-anime-gray to-anime-dark p-5 rounded-lg border border-anime-light-gray/30">
              <h2 className="text-xl font-display font-bold mb-2 text-anime-cyberpunk-blue">CASPER AI Search</h2>
              <p className="text-gray-400 mb-4 text-sm">
                Describe what you're looking for in natural language, and our AI will find it.
              </p>
              
              <div className="flex flex-col gap-2">
                <textarea
                  placeholder="Example: Show me anime with magical girls and good action scenes"
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  className="w-full p-3 bg-anime-gray border border-anime-light-gray rounded-md resize-none h-24"
                />
                
                <Button 
                  onClick={handleAISearch} 
                  disabled={aiLoading} 
                  className="bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/90 flex items-center justify-center gap-2"
                >
                  {aiLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw size={18} />
                    </motion.div>
                  ) : (
                    <>
                      Search with AI <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-gray-400">
                <p>Examples:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>"Find me fantasy anime with strong female characters"</li>
                  <li>"What are some good romance anime with comedy?"</li>
                  <li>"I want something similar to Attack on Titan"</li>
                </ul>
              </div>
            </div>
            
            {/* AI Search Results */}
            {aiResults.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-display font-bold mb-4">AI Search Results</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {aiResults.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
