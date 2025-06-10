
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const themes = [
  {
    id: 'dark',
    name: 'Dark Cyberpunk',
    description: 'Classic dark theme with cyberpunk elements',
    colors: {
      primary: '#00F0FF',
      secondary: '#FF2A45',
      background: '#121212',
      accent: '#282828'
    }
  },
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean light theme for better readability',
    colors: {
      primary: '#0066CC',
      secondary: '#FF1744',
      background: '#FFFFFF',
      accent: '#F5F5F5'
    }
  },
  {
    id: 'sakura',
    name: 'Sakura',
    description: 'Beautiful cherry blossom inspired theme',
    colors: {
      primary: '#FF69B4',
      secondary: '#FFB6C1',
      background: '#FFF0F5',
      accent: '#FFF5F8'
    }
  },
  {
    id: 'neon',
    name: 'Neon City',
    description: 'Vibrant neon colors for a futuristic feel',
    colors: {
      primary: '#00FF41',
      secondary: '#FF0080',
      background: '#0A0A0A',
      accent: '#1A1A1A'
    }
  },
  {
    id: 'sunset',
    name: 'Anime Sunset',
    description: 'Warm sunset colors inspired by anime scenes',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#2D1B2E',
      accent: '#5D4E6D'
    }
  }
];

interface ThemeSelectorProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

export default function ThemeSelector({ currentTheme = 'dark', onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeChange?.(themeId);
    
    // Apply theme to document root
    const root = document.documentElement;
    const theme = themes.find(t => t.id === themeId);
    
    if (theme) {
      root.style.setProperty('--theme-primary', theme.colors.primary);
      root.style.setProperty('--theme-secondary', theme.colors.secondary);
      root.style.setProperty('--theme-background', theme.colors.background);
      root.style.setProperty('--theme-accent', theme.colors.accent);
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="border-anime-light-gray/50 hover:bg-anime-gray/50"
      >
        <Palette className="h-4 w-4 mr-2" />
        Themes
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 w-80 bg-anime-dark border border-anime-light-gray/30 rounded-lg shadow-xl z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-display font-bold mb-4 text-anime-cyberpunk-blue">
                Choose Theme
              </h3>
              
              <div className="space-y-3">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      selectedTheme === theme.id
                        ? 'border-anime-cyberpunk-blue bg-anime-cyberpunk-blue/10'
                        : 'border-anime-light-gray/30 hover:border-anime-light-gray/50 hover:bg-anime-gray/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex space-x-1">
                            {Object.values(theme.colors).map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <h4 className="font-medium text-white">{theme.name}</h4>
                        </div>
                        <p className="text-sm text-gray-400">{theme.description}</p>
                      </div>
                      
                      {selectedTheme === theme.id && (
                        <Check className="h-5 w-5 text-anime-cyberpunk-blue" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-anime-light-gray/30">
                <p className="text-xs text-gray-400">
                  Theme changes are applied instantly and saved to your preferences.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
