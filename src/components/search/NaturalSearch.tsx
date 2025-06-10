
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface NaturalSearchProps {
  onSearch: (query: string, naturalLanguage?: boolean) => void;
  isLoading?: boolean;
}

export default function NaturalSearch({ onSearch, isLoading }: NaturalSearchProps) {
  const [query, setQuery] = useState('');
  const [isNaturalMode, setIsNaturalMode] = useState(false);
  const [suggestions] = useState([
    "Find action anime with strong female protagonists",
    "Show me romance manga with happy endings",
    "What are the best cyberpunk anime series?",
    "Find comedy anime suitable for beginners",
    "Show me completed shounen manga"
  ]);

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: 'Empty Search',
        description: 'Please enter a search term',
        variant: 'destructive'
      });
      return;
    }
    
    onSearch(query, isNaturalMode);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsNaturalMode(true);
    onSearch(suggestion, true);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder={isNaturalMode ? "Ask CASPER anything about anime..." : "Search for anime or manga..."}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-anime-gray/70 border-anime-light-gray/50 focus:border-anime-cyberpunk-blue pl-12 pr-12 h-14 text-lg"
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Search className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          
          {/* Natural Language Toggle */}
          <Button
            onClick={() => setIsNaturalMode(!isNaturalMode)}
            variant={isNaturalMode ? "default" : "outline"}
            className={`h-14 px-4 ${
              isNaturalMode 
                ? 'bg-anime-red hover:bg-anime-red/80 text-white' 
                : 'border-anime-light-gray/50 hover:bg-anime-gray/50'
            }`}
          >
            <Sparkles className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/80 text-black h-14 px-6 font-bold"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        {/* Mode Indicator */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isNaturalMode ? 'bg-anime-red' : 'bg-anime-cyberpunk-blue'}`} />
            <span className="text-sm text-gray-400">
              {isNaturalMode ? 'Natural Language Mode' : 'Standard Search Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      {!query && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-gray-400">Try asking CASPER:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-anime-gray/50 border border-anime-light-gray/30 rounded-full text-sm text-gray-300 hover:bg-anime-cyberpunk-blue/20 hover:border-anime-cyberpunk-blue/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
