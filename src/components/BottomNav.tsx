
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Search as SearchIcon, Film, BookOpen, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, PanInfo, useAnimation } from "framer-motion";
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
    icon: <Menu className="h-5 w-5" />,  // Using Menu icon for Gacha
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
  const controls = useAnimation();
  const navRef = useRef<HTMLDivElement>(null);

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

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -30) {
      setIsExpanded(true);
    } else if (info.offset.y > 30) {
      setIsExpanded(false);
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Show tutorial toast on first visit */}
      {showTutorial && (
        <motion.div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence>
            <motion.div 
              className="bg-anime-dark/80 backdrop-blur-md p-6 rounded-lg border border-anime-red/30 max-w-xs"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-display text-anime-red mb-2">ジェスチャーコントロール</h3>
              <p className="text-sm font-digital text-gray-200">
                Swipe left or right on screen to navigate between pages.
                <br /><br />
                Swipe up on the bottom bar to expand it.
                <br /><br />
                Swipe down to collapse it.
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    
      <motion.div 
        className="fixed bottom-3 left-1/2 z-50"
        initial={{ translateX: "-50%", translateY: 0 }}
        animate={{ 
          translateX: "-50%", 
          translateY: isVisible ? 0 : 100
        }}
        transition={{ duration: 0.3 }}
        ref={navRef}
      >
        <motion.nav 
          className={cn(
            "px-3 py-1 rounded-full bg-anime-dark/90 backdrop-blur-md border border-anime-red/30",
            "shadow-[0_0_15px_0px_rgba(255,42,69,0.3)] cyberpunk-border",
            "transition-all duration-300 ease-in-out",
            isExpanded ? "w-[350px]" : "w-[200px]"
          )}
          style={{ height: "34px" }} // Even thinner nav bar
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleDrag}
          onClick={handleToggle}
        >
          <div className="relative">
            {/* Glitch effect */}
            <div className="absolute inset-0 bg-anime-red/5 opacity-20 rounded-full overflow-hidden">
              <div className="h-px w-full bg-anime-cyberpunk-blue/40 absolute top-[30%] animate-[glitch_2s_infinite]"></div>
              <div className="h-px w-full bg-anime-red/40 absolute top-[60%] animate-[glitch_1.5s_infinite]"></div>
            </div>
            
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
                      initial={!isExpanded && item.name !== "Home" ? { opacity: 0, width: 0 } : { opacity: 1 }}
                      animate={isExpanded || item.name === "Home" ? { opacity: 1, width: "auto" } : { opacity: 0, width: 0 }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link 
                        to={item.path}
                        className={cn(
                          "flex items-center px-1.5 py-1 transition-all duration-300",
                          isActive 
                            ? "text-anime-red" 
                            : "text-gray-400 hover:text-gray-200"
                        )}
                        onClick={(e) => {
                          // Don't close the menu if link is clicked
                          e.stopPropagation();
                        }}
                      >
                        <div className={cn(
                          "relative p-1 rounded-lg transition-all duration-300",
                          isActive && "bg-anime-dark/70 shadow-[0_0_8px_0px_rgba(255,42,69,0.3)]"
                        )}>
                          {item.icon}
                          {isActive && (
                            <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-anime-red rounded-full animate-pulse" />
                          )}
                        </div>
                        {isExpanded && (
                          <motion.span 
                            className="text-xs ml-1 font-digital tracking-wider whitespace-nowrap overflow-hidden"
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
          </div>
        </motion.nav>
        
        {/* Page navigation indicator */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -25 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-1"
          >
            {navItems.map((item, index) => (
              <div 
                key={item.path}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  location.pathname === item.path ? "w-3 bg-anime-red" : "w-1 bg-gray-600"
                )}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
}
