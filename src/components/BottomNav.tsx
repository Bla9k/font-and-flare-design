
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Search as SearchIcon, Film, BookOpen, Menu, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Search",
    path: "/search",
    icon: <SearchIcon className="h-5 w-5" />,
  },
  {
    name: "Anime",
    path: "/anime",
    icon: <Film className="h-5 w-5" />,
  },
  {
    name: "Manga",
    path: "/manga",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    name: "Gacha",
    path: "/gacha",
    icon: <Package className="h-5 w-5" />,
  },
  {
    name: "Favorites",
    path: "/favorites",
    icon: <Heart className="h-5 w-5" />,
  },
];

export default function BottomNav() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);

  // Check if this is the first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('seen-gesture-tutorial');
    if (hasSeenTutorial) {
      setShowTutorial(false);
    } else {
      setTimeout(() => {
        toast({
          title: "Gesture Controls",
          description: "Swipe left/right to navigate pages. Swipe up on bottom bar to expand. Swipe down to close.",
          duration: 5000,
        });
        localStorage.setItem('seen-gesture-tutorial', 'true');
      }, 2000);
    }
  }, []);

  // Handle scroll events to auto-hide the navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide the nav
        setIsVisible(false);
        // Also collapse the nav when scrolling down
        setIsExpanded(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show the nav
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Page swipe navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    };
    
    const handleSwipeGesture = () => {
      const minSwipeDistance = 100;
      if (touchStartX - touchEndX > minSwipeDistance) {
        // Swiped left - go forward in navItems
        const currentIndex = navItems.findIndex(item => item.path === location.pathname);
        if (currentIndex < navItems.length - 1) {
          window.location.href = navItems[currentIndex + 1].path;
        }
      } else if (touchEndX - touchStartX > minSwipeDistance) {
        // Swiped right - go backward in navItems
        const currentIndex = navItems.findIndex(item => item.path === location.pathname);
        if (currentIndex > 0) {
          window.location.href = navItems[currentIndex - 1].path;
        }
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [location.pathname]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className="fixed bottom-6 left-1/2 z-50"
      initial={{ translateX: "-50%", translateY: 0 }}
      animate={{ 
        translateX: "-50%", 
        translateY: isVisible ? 0 : 100
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.nav 
        className={cn(
          "px-4 py-2 rounded-full bg-gradient-to-r from-anime-dark/95 via-anime-gray/95 to-anime-dark/95 backdrop-blur-md",
          "shadow-lg shadow-black/20",
          "border border-anime-cyberpunk-blue/30",
          "transition-all duration-300 ease-in-out",
          isExpanded ? "w-[340px]" : "w-[260px]"
        )}
        onClick={handleToggle}
      >
        <div className="relative">
          <motion.ul 
            className="flex justify-center items-center relative z-10"
            layout
          >
            <AnimatePresence>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                              (item.path !== "/" && location.pathname.startsWith(item.path));
                              
                return (
                  <motion.li 
                    key={item.path} 
                    className="relative"
                    initial={!isExpanded && item.name !== "Home" && item.name !== "Search" ? { opacity: 0, width: 0 } : { opacity: 1 }}
                    animate={isExpanded || item.name === "Home" || item.name === "Search" ? { opacity: 1, width: "auto" } : { opacity: 0, width: 0 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      to={item.path}
                      className={cn(
                        "flex items-center px-2 py-1.5 mx-1 transition-all duration-300",
                        isActive 
                          ? "text-anime-cyberpunk-blue" 
                          : "text-gray-400 hover:text-gray-200"
                      )}
                      onClick={(e) => {
                        // Don't close the menu if link is clicked
                        e.stopPropagation();
                      }}
                    >
                      <div className={cn(
                        "relative p-1.5 rounded-lg transition-all duration-300",
                        isActive && "bg-anime-dark/70 shadow-[0_0_12px_2px_rgba(0,240,255,0.25)]"
                      )}>
                        {item.icon}
                        {isActive && (
                          <motion.span 
                            className="absolute top-0 right-0 h-1.5 w-1.5 bg-anime-cyberpunk-blue rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      {isExpanded && (
                        <motion.span 
                          className="text-xs ml-1.5 font-digital tracking-wider whitespace-nowrap overflow-hidden"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
          
          {/* Enhanced glow effect for better UI */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-anime-cyberpunk-blue/10 via-anime-red/5 to-anime-cyberpunk-blue/10 rounded-full blur-md opacity-70"></div>
        </div>
      </motion.nav>
      
      {/* Page navigation indicator */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: -20 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-1"
        >
          {navItems.map((item) => (
            <motion.div 
              key={item.path}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                location.pathname === item.path 
                  ? "w-3 bg-anime-cyberpunk-blue shadow-[0_0_8px_2px_rgba(0,240,255,0.4)]" 
                  : "w-1 bg-gray-600"
              )}
              whileHover={location.pathname !== item.path ? { scale: 1.5, backgroundColor: "#A2C4FF" } : {}}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
