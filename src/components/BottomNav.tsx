
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Film, Book, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
    icon: <Book className="h-5 w-5" />,
  },
  {
    name: "Favorites",
    path: "/favorites",
    icon: <Heart className="h-5 w-5" />,
  },
];

export default function BottomNav() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  
  // Collapse the nav when navigating to a new page
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-anime-dark/90 backdrop-blur-md border-t border-anime-light-gray"
          >
            <div className="container mx-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-300 hover:bg-anime-light-gray/20 group",
                    location.pathname === item.path && "bg-anime-red/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    location.pathname === item.path 
                      ? "bg-anime-red text-white" 
                      : "bg-anime-gray text-gray-400 group-hover:bg-anime-light-gray/30 group-hover:text-gray-300"
                  )}>
                    {item.icon}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    location.pathname === item.path
                      ? "text-anime-red" 
                      : "text-gray-400 group-hover:text-gray-300"
                  )}>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="bg-anime-dark/80 backdrop-blur-md border-t border-anime-light-gray cyberpunk-glow">
        <div className="container mx-auto py-2 px-4 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-md hover:bg-anime-light-gray/20"
          >
            {expanded ? (
              <X className="h-5 w-5 text-anime-red" />
            ) : (
              <Menu className="h-5 w-5 text-anime-cyberpunk-blue" />
            )}
          </button>
          
          <div className="text-anime-red text-xl font-display font-bold tracking-wider glitch-text">
            CASPER<span className="text-anime-cyberpunk-blue">.</span>
          </div>
          
          <Link to="/" className="p-2 rounded-md hover:bg-anime-light-gray/20">
            <Home className={cn(
              "h-5 w-5",
              location.pathname === "/" ? "text-anime-red" : "text-gray-400"
            )} />
          </Link>
        </div>
      </div>
    </div>
  );
}
