
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Film, Book, Star, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavEnhanced = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [showGestureHelp, setShowGestureHelp] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);

  // Check if first visit to show gesture tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("casper-gesture-tutorial");
    if (!hasSeenTutorial) {
      setShowGestureHelp(true);
      localStorage.setItem("casper-gesture-tutorial", "true");
    }
  }, []);
  
  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    
    // Minimum distance for a swipe
    const minDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
      // Horizontal swipe
      if (deltaX > 0) {
        setSwipeDirection("right");
        navigateBasedOnSwipe("right");
      } else {
        setSwipeDirection("left");
        navigateBasedOnSwipe("left");
      }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minDistance) {
      // Vertical swipe
      if (deltaY > 0) {
        setSwipeDirection("down");
        setExpanded(false);
      } else {
        setSwipeDirection("up");
        setExpanded(true);
      }
    }
    
    // Reset swipe direction after animation
    setTimeout(() => setSwipeDirection(null), 500);
  };
  
  const navigateBasedOnSwipe = (direction: string) => {
    // Define the navigation flow
    const navFlow = ["/", "/discover", "/anime", "/manga", "/gacha", "/search", "/favorites"];
    const currentIndex = navFlow.indexOf(location.pathname);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === "right") {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = navFlow.length - 1;
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= navFlow.length) nextIndex = 0;
    }
    
    window.location.href = navFlow[nextIndex];
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navigationItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/discover", icon: Star, label: "Discover" },
    { path: "/anime", icon: Film, label: "Anime" },
    { path: "/manga", icon: Book, label: "Manga" },
    { path: "/gacha", icon: User, label: "Gacha" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/favorites", icon: Star, label: "Favorites" },
  ];

  const swipeAnimationVariants = {
    left: {
      x: [-50, 0],
      opacity: [0, 1],
      transition: { duration: 0.3 }
    },
    right: {
      x: [50, 0],
      opacity: [0, 1],
      transition: { duration: 0.3 }
    },
    up: {
      y: [20, 0],
      opacity: [0, 1],
      transition: { duration: 0.3 }
    },
    down: {
      y: [-20, 0],
      opacity: [0, 1],
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Gesture overlay area for the entire screen */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none"
        onTouchStart={(e) => {
          e.stopPropagation();
          handleTouchStart(e as React.TouchEvent);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          handleTouchEnd(e as React.TouchEvent);
        }}
        style={{ touchAction: 'pan-y' }}
      />
      
      {/* Gesture tutorial */}
      <AnimatePresence>
        {showGestureHelp && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-anime-gray border border-anime-light-gray rounded-lg p-6 max-w-md">
              <h2 className="text-2xl font-display font-bold mb-4 text-anime-cyberpunk-blue">
                Gesture Controls
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-anime-dark flex items-center justify-center mr-3">
                    <motion.div
                      animate={{ x: [-10, 10, -10] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      ↔️
                    </motion.div>
                  </div>
                  <div>
                    <p className="font-bold">Swipe Left/Right</p>
                    <p className="text-sm text-gray-400">Navigate between pages</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-anime-dark flex items-center justify-center mr-3">
                    <motion.div
                      animate={{ y: [5, -5, 5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      ↕️
                    </motion.div>
                  </div>
                  <div>
                    <p className="font-bold">Swipe Up/Down</p>
                    <p className="text-sm text-gray-400">Expand/Collapse navigation</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowGestureHelp(false)}
                className="w-full py-3 bg-anime-red hover:bg-opacity-80 transition-colors rounded-md text-white font-display"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom Navigation */}
      <motion.nav 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-anime-dark/95 backdrop-blur-lg border-t border-anime-light-gray/30",
          expanded ? "rounded-t-2xl shadow-lg" : ""
        )}
        animate={{
          height: expanded ? "auto" : "72px",
          paddingBottom: expanded ? "1.5rem" : "0.75rem"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Swipe indicator */}
        <AnimatePresence>
          {swipeDirection && (
            <motion.div 
              className="absolute inset-x-0 top-0 flex justify-center -mt-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-anime-cyberpunk-blue/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                {swipeDirection === "left" && "← Navigating back"}
                {swipeDirection === "right" && "Navigating forward →"}
                {swipeDirection === "up" && "↑ Expanding navigation"}
                {swipeDirection === "down" && "↓ Collapsing navigation"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Expand/Collapse button */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-anime-dark border border-anime-light-gray/50 rounded-full p-1 transition-transform"
          >
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
        
        <motion.div 
          className="flex justify-around items-center pt-2"
          animate={swipeDirection ? swipeAnimationVariants[swipeDirection as keyof typeof swipeAnimationVariants] : {}}
        >
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center transition-all duration-200",
                isActive(item.path)
                  ? "text-anime-cyberpunk-blue"
                  : "text-gray-500 hover:text-gray-300",
                !expanded && item.path === "/favorites" ? "hidden" : "block"
              )}
            >
              <div className="relative">
                <item.icon
                  size={expanded ? 24 : 20}
                  className={cn(
                    "transition-transform",
                    isActive(item.path) && "drop-shadow-[0_0_6px_rgba(0,155,255,0.7)]"
                  )}
                />
                {isActive(item.path) && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-anime-cyberpunk-blue rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </div>
              {expanded && (
                <motion.span 
                  className="text-xs mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          ))}
        </motion.div>
        
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 px-4"
          >
            <div className="h-px bg-anime-light-gray/20 mb-4" />
            <div className="grid grid-cols-3 gap-3">
              <button className="p-2 bg-anime-dark rounded-lg border border-anime-light-gray/30 text-xs text-center">
                Dark Mode
              </button>
              <button className="p-2 bg-anime-dark rounded-lg border border-anime-light-gray/30 text-xs text-center">
                Help
              </button>
              <button className="p-2 bg-anime-dark rounded-lg border border-anime-light-gray/30 text-xs text-center">
                Settings
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
};

export default BottomNavEnhanced;
