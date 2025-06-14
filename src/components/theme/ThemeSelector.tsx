
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeChangeAnimation from '@/components/effects/ThemeChangeAnimation';

const themes = [
  {
    id: 'dark',
    name: 'Dark Cyberpunk',
    description: 'Classic dark theme with cyberpunk elements',
    colors: {
      primary: '#00F0FF',
      secondary: '#FF2A45',
      background: '#121212',
      accent: '#282828',
      card: '#1a1a1a',
      text: '#ffffff',
      textMuted: '#888888'
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
      accent: '#F5F5F5',
      card: '#ffffff',
      text: '#000000',
      textMuted: '#666666'
    }
  },
  {
    id: 'persona',
    name: 'Persona Universe',
    description: 'Dark supernatural theme with golden accents and mystical effects',
    colors: {
      primary: '#FFD700',
      secondary: '#FF4500',
      tertiary: '#8A2BE2',
      background: '#0A0A0F',
      accent: '#1A1A25',
      card: '#151520',
      text: '#F0F0F0',
      textMuted: '#A0A0B0',
      shadow: '#4B0082',
      glow: '#FFD700'
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
      accent: '#FFF5F8',
      card: '#ffffff',
      text: '#2D1B2E',
      textMuted: '#8B5A7C'
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
      accent: '#1A1A1A',
      card: '#0f0f0f',
      text: '#00FF41',
      textMuted: '#40A060'
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
      accent: '#5D4E6D',
      card: '#3D2B3E',
      text: '#FFE4B5',
      textMuted: '#D4A574'
    }
  }
];

interface ThemeSelectorProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

export default function ThemeSelector({ currentTheme = '', onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || '');
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatingTheme, setAnimatingTheme] = useState('');

  // System preference for first load
  useEffect(() => {
    let userTheme = localStorage.getItem('selected-theme');
    if (userTheme) {
      setSelectedTheme(userTheme);
      applyTheme(userTheme, false);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? "dark" : "light";
      setSelectedTheme(defaultTheme);
      applyTheme(defaultTheme, false);
    }
  }, []);

  const applyTheme = (themeId: string, animate = true) => {
    const theme = themes.find(t => t.id === themeId);
    const root = document.documentElement;

    if (animate) {
      // Add animating class to body for smooth transitions
      document.body.classList.add('theme-transition');
      setTimeout(() => { document.body.classList.remove('theme-transition'); }, 520);
    }
    if (theme) {
      root.style.setProperty('--theme-primary', theme.colors.primary);
      root.style.setProperty('--theme-secondary', theme.colors.secondary);
      root.style.setProperty('--theme-background', theme.colors.background);
      root.style.setProperty('--theme-accent', theme.colors.accent);
      root.style.setProperty('--theme-card', theme.colors.card);
      root.style.setProperty('--theme-text', theme.colors.text);
      root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
      
      // Persona-specific colors
      if (theme.colors.tertiary) {
        root.style.setProperty('--theme-tertiary', theme.colors.tertiary);
      }
      if (theme.colors.shadow) {
        root.style.setProperty('--theme-shadow', theme.colors.shadow);
      }
      if (theme.colors.glow) {
        root.style.setProperty('--theme-glow', theme.colors.glow);
      }
      
      root.style.setProperty('--anime-red', theme.colors.secondary);
      root.style.setProperty('--anime-blue', theme.colors.primary);
      root.style.setProperty('--anime-dark', theme.colors.background);
      root.style.setProperty('--anime-gray', theme.colors.accent);
      root.style.setProperty('--anime-light-gray', theme.colors.card);
      root.style.setProperty('--anime-cyberpunk-blue', theme.colors.primary);

      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(`theme-${themeId}`);
    } else {
      // System default: remove any theme- classes
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
    }
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    setAnimatingTheme(themeId);
    
    // Show animation for Persona theme
    if (themeId === 'persona') {
      setShowAnimation(true);
      // Apply theme immediately but show animation
      applyTheme(themeId);
    } else {
      applyTheme(themeId);
    }
    
    onThemeChange?.(themeId);
    localStorage.setItem('selected-theme', themeId);
    setIsOpen(false);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setAnimatingTheme('');
  };

  // System default option
  const handleSystemDefault = () => {
    localStorage.removeItem('selected-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? "dark" : "light";
    setSelectedTheme(defaultTheme);
    applyTheme(defaultTheme);
    onThemeChange?.(defaultTheme);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative z-[120]">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="border-anime-light-gray/50 hover:bg-anime-gray/60 transition-colors"
          style={{
            backgroundColor: `var(--theme-card)`,
            borderColor: `var(--theme-accent)`,
            color: `var(--theme-text)`
          }}
        >
          <Palette className="h-4 w-4 mr-2" />
          Themes
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className="absolute top-full mt-2 right-0 w-80 border rounded-lg shadow-2xl z-[120]"
              style={{
                background: `rgba(18,18,18,0.99)`,
                borderColor: `var(--theme-accent)`,
                color: `var(--theme-text)`
              }}
            >
              <div className="p-4">
                <h3 className="text-lg font-display font-bold mb-4" style={{ color: `var(--theme-primary)` }}>
                  Choose Theme
                </h3>
                <div className="space-y-3">
                  {themes.map((theme) => (
                    <motion.button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedTheme === theme.id
                          ? 'border-current bg-opacity-15'
                          : 'border-opacity-30 hover:border-opacity-60'
                      }`}
                      style={{
                        borderColor: selectedTheme === theme.id ? theme.colors.primary : `var(--theme-accent)`,
                        backgroundColor: selectedTheme === theme.id ? `${theme.colors.primary}22` : 'rgba(0,0,0,0.00)'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex space-x-1">
                              {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                                <div
                                  key={index}
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: color, border: "1px solid #222" }}
                                />
                              ))}
                            </div>
                            <h4 className="font-medium" style={{ color: `var(--theme-text)` }}>{theme.name}</h4>
                          </div>
                          <p className="text-sm" style={{ color: `var(--theme-text-muted)` }}>{theme.description}</p>
                        </div>
                        {selectedTheme === theme.id && (
                          <Check className="h-5 w-5" style={{ color: theme.colors.primary }} />
                        )}
                      </div>
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={handleSystemDefault}
                    className="w-full mt-1 p-3 rounded-lg border border-dashed border-anime-cyberpunk-blue transition-all text-left hover:bg-anime-cyberpunk-blue/10"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="font-medium">System Default</span>
                    <span className="ml-2 text-xs text-anime-cyberpunk-blue">(match OS)</span>
                  </motion.button>
                </div>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: `var(--theme-accent)` }}>
                  <p className="text-xs" style={{ color: `var(--theme-text-muted)` }}>
                    Theme changes are smooth and saved to your preferences.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-[110]"
            style={{ background: 'transparent' }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Theme Change Animation */}
      <ThemeChangeAnimation
        themeName={animatingTheme}
        show={showAnimation}
        onComplete={handleAnimationComplete}
      />
    </>
  );
}
