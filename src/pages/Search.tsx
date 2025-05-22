
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon, ArrowRight, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Anime } from '@/types/anime';
import { searchAnime } from '@/api/jikan';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    status: '',
    rating: '',
    year: ''
  });

  const handleSearch = async () => {
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
      const searchParams: Record<string, string> = {
        q: query,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      };
      
      const data = await searchAnime(searchParams);
      setResults(data);
      
      if (!data || data.length === 0) {
        toast({
          title: 'No Results',
          description: 'No anime found matching your search criteria',
          variant: 'destructive'
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

  const handleRandom = async () => {
    setLoading(true);
    try {
      // This would use a random API in a real app, but for now we'll just navigate to a random ID
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
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-3xl md:text-4xl font-display font-bold mb-3 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-anime-cyberpunk-blue">[</span> 
          Search Database
          <span className="text-anime-cyberpunk-blue">]</span>
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Find anime by title, genre, year, or other criteria
        </motion.p>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for anime..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="bg-anime-gray/70 border-anime-light-gray/50 focus:border-anime-cyberpunk-blue pl-10 h-12"
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
                <SearchIcon className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/80 text-black h-12"
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button 
                onClick={toggleAdvancedSearch}
                variant="outline" 
                className="border-anime-light-gray/50 hover:bg-anime-gray/50 h-12 px-3"
              >
                <Filter className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleRandom}
                variant="outline" 
                className="border-anime-red/50 hover:bg-anime-red/20 h-12 px-3"
              >
                <Sparkles className="h-5 w-5 text-anime-red" />
              </Button>
            </div>
            
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
            
            {/* Coming soon - Casper AI */}
            <div className="mt-6 p-4 border border-anime-red/40 rounded-lg bg-anime-dark/70">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-anime-red/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-anime-red">AI</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-medium text-anime-red">CASPER AI</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Natural language search coming soon! Ask CASPER AI for personalized anime recommendations.
                  </p>
                </div>
                <div className="text-xs text-gray-400 px-2 py-1 border border-gray-700 rounded">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
          
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
          {query === '' && results.length === 0 && !loading && (
            <div className="mt-16 text-center">
              <div className="text-anime-cyberpunk-blue/20 text-8xl mb-4">探す</div>
              <p className="text-gray-400 max-w-md mx-auto">
                Enter a search term or use the advanced filters to find your next favorite anime
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
