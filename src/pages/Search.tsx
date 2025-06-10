import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import NaturalSearch from '@/components/search/NaturalSearch';
import GameAdBanner from '@/components/ads/GameAdBanner';
import ThemeSelector from '@/components/theme/ThemeSelector';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Anime } from '@/types/anime';
import { searchAnime } from '@/api/jikan';

export default function Search() {
  const navigate = useNavigate();
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    status: '',
    rating: '',
    year: ''
  });

  const handleSearch = async (query: string, isNaturalLanguage = false) => {
    if (!query.trim() && !Object.values(filters).some(val => val)) {
      toast({
        title: 'Empty Search',
        description: 'Please enter a search term or select filters',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    try {
      let searchParams: Record<string, string> = {};
      
      if (isNaturalLanguage) {
        // Process natural language query (simplified - in real app would use AI/NLP)
        const processedQuery = processNaturalLanguage(query);
        searchParams = { q: processedQuery, ...filters };
      } else {
        searchParams = {
          q: query,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
        };
      }
      
      const data = await searchAnime(searchParams);
      setResults(data);
      
      if (!data || data.length === 0) {
        toast({
          title: 'No Results',
          description: 'No anime found matching your search criteria',
          variant: 'destructive'
        });
      } else if (isNaturalLanguage) {
        toast({
          title: 'Natural Search Complete',
          description: `Found ${data.length} results using AI search`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Failed',
        description: 'An error occurred while searching. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Simple natural language processing (in real app, would use proper NLP/AI)
  const processNaturalLanguage = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Extract genre keywords
    if (lowerQuery.includes('action')) return 'action';
    if (lowerQuery.includes('romance')) return 'romance';
    if (lowerQuery.includes('comedy')) return 'comedy';
    if (lowerQuery.includes('drama')) return 'drama';
    if (lowerQuery.includes('fantasy')) return 'fantasy';
    if (lowerQuery.includes('sci-fi') || lowerQuery.includes('science fiction')) return 'sci-fi';
    if (lowerQuery.includes('horror')) return 'horror';
    if (lowerQuery.includes('mystery')) return 'mystery';
    
    // Extract other keywords
    if (lowerQuery.includes('strong female') || lowerQuery.includes('female protagonist')) return 'strong female lead';
    if (lowerQuery.includes('cyberpunk')) return 'cyberpunk';
    if (lowerQuery.includes('shounen') || lowerQuery.includes('shonen')) return 'shounen';
    if (lowerQuery.includes('shoujo') || lowerQuery.includes('shojo')) return 'shoujo';
    
    return query; // Fallback to original query
  };

  const handleRandom = async () => {
    setLoading(true);
    try {
      const randomId = Math.floor(Math.random() * 10000) + 1;
      navigate(`/anime/${randomId}`);
    } catch (error) {
      console.error('Random error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a random anime',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleResultClick = (animeId: number) => {
    navigate(`/anime/${animeId}`);
  };

  const toggleAdvancedSearch = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Game Ad Banner */}
        <GameAdBanner />
        
        {/* Header with Theme Selector */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-display font-bold mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-anime-cyberpunk-blue">[</span> 
              Search Database
              <span className="text-anime-cyberpunk-blue">]</span>
            </motion.h1>
            
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Find anime by title, genre, year, or ask CASPER in natural language
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ThemeSelector />
          </motion.div>
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Enhanced Natural Search */}
          <NaturalSearch onSearch={handleSearch} isLoading={loading} />
          
          {/* Advanced Search Panel */}
          <motion.div 
            className="mt-6 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex space-x-2">
              <Button 
                onClick={toggleAdvancedSearch}
                variant="outline" 
                className="border-anime-light-gray/50 hover:bg-anime-gray/50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Button 
                onClick={handleRandom}
                variant="outline" 
                className="border-anime-red/50 hover:bg-anime-red/20"
              >
                <Sparkles className="h-4 w-4 mr-2 text-anime-red" />
                Random Discovery
              </Button>
            </div>
          </motion.div>

          {/* Advanced search panel */}
          <motion.div 
            className="mt-4 p-4 bg-anime-gray/50 border border-anime-light-gray/30 rounded-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: showAdvanced ? 'auto' : 0,
              opacity: showAdvanced ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: showAdvanced ? 'visible' : 'hidden' }}
          >
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Genre</label>
                  <select 
                    className="w-full bg-anime-dark border border-anime-light-gray/50 rounded py-2 px-3"
                    value={filters.genre}
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="1">Action</option>
                    <option value="2">Adventure</option>
                    <option value="4">Comedy</option>
                    <option value="7">Mystery</option>
                    <option value="8">Drama</option>
                    <option value="10">Fantasy</option>
                    <option value="22">Romance</option>
                    <option value="24">Sci-Fi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select 
                    className="w-full bg-anime-dark border border-anime-light-gray/50 rounded py-2 px-3"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="airing">Currently Airing</option>
                    <option value="complete">Completed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rating</label>
                  <select 
                    className="w-full bg-anime-dark border border-anime-light-gray/50 rounded py-2 px-3"
                    value={filters.rating}
                    onChange={(e) => setFilters({...filters, rating: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="g">G - All Ages</option>
                    <option value="pg">PG - Children</option>
                    <option value="pg13">PG-13 - Teens 13+</option>
                    <option value="r17">R - 17+</option>
                    <option value="r">R+ - Mild Nudity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Year</label>
                  <select 
                    className="w-full bg-anime-dark border border-anime-light-gray/50 rounded py-2 px-3"
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                  >
                    <option value="">Any</option>
                    {Array.from({ length: 30 }, (_, i) => 2023 - i).map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Results section */}
          {results.length > 0 && (
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-display font-bold mb-4 flex items-center">
                <span className="h-5 w-1 bg-anime-cyberpunk-blue mr-2"></span>
                Search Results
                <span className="ml-2 text-sm font-normal text-gray-400">({results.length} found)</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(anime => (
                  <motion.div 
                    key={anime.mal_id}
                    className="bg-anime-gray/40 border border-anime-light-gray/30 rounded-lg overflow-hidden hover:border-anime-cyberpunk-blue/50 transition-all cursor-pointer"
                    onClick={() => handleResultClick(anime.mal_id)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-48 relative">
                      <img 
                        src={anime.images.jpg.large_image_url} 
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                        <div className="p-4">
                          <h3 className="text-white font-display font-bold">{anime.title}</h3>
                          {anime.score > 0 && (
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-400 mr-1">★</span>
                              <span className="text-white text-sm">{anime.score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {anime.genres.slice(0, 2).map(genre => (
                          <span key={genre.mal_id} className="px-2 py-0.5 bg-anime-dark/80 text-xs rounded">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-anime-cyberpunk-blue">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Empty initial state */}
          {results.length === 0 && !loading && (
            <div className="mt-16 text-center">
              <div className="text-anime-cyberpunk-blue/20 text-8xl mb-4">探す</div>
              <p className="text-gray-400 max-w-md mx-auto">
                Enter a search term, ask CASPER in natural language, or use advanced filters to find your next favorite anime
              </p>
            </div>
          )}
          
          {/* Loading state */}
          {loading && (
            <div className="mt-16 text-center">
              <div className="inline-block h-12 w-12 border-4 border-anime-cyberpunk-blue/30 border-t-anime-cyberpunk-blue rounded-full animate-spin mb-4"></div>
              <p className="text-anime-cyberpunk-blue animate-pulse font-digital">SEARCHING_DATABASE...</p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
