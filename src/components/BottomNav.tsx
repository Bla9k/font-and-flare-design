
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Search, Film, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Discover",
    path: "/discover",
    icon: <Search className="h-5 w-5" />,
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

  // Handle scroll events to auto-hide the navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide the nav
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show the nav
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Toggle expanded state when clicked
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className="fixed bottom-3 left-1/2 z-50"
      initial={{ translateX: "-50%", translateY: 0 }}
      animate={{ 
        translateX: "-50%", 
        translateY: isVisible ? 0 : 100
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.nav 
        className={cn(
          "px-3 py-1 rounded-full bg-anime-dark/90 backdrop-blur-md border border-anime-red/30",
          "shadow-[0_0_15px_0px_rgba(255,42,69,0.3)] cyberpunk-border",
          "transition-all duration-300 ease-in-out",
          isExpanded ? "w-[330px]" : "w-[240px]"
        )}
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
                        "flex items-center p-1.5 transition-all duration-300",
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
                        "relative p-1.5 rounded-lg transition-all duration-300",
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
    </motion.div>
  );
}
