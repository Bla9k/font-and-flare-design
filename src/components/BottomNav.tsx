
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Search, Film, BookOpen, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll events to auto-collapse/expand the navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsCollapsed(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsCollapsed(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out",
      isCollapsed ? "translate-y-24" : "translate-y-0"
    )}>
      {/* Toggle button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-anime-dark/80 backdrop-blur-md p-1 rounded-t-md border-t border-l border-r border-anime-cyberpunk-blue/30 text-anime-cyberpunk-blue hover:text-white transition-colors"
      >
        {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
    
      <nav className="px-1 py-1 rounded-xl bg-anime-dark/80 backdrop-blur-md border border-anime-cyberpunk-blue/30 shadow-[0_0_15px_0px_rgba(0,240,255,0.3)] cyberpunk-border w-[90%] max-w-md">
        <div className="relative">
          {/* Glitch effect */}
          <div className="absolute inset-0 bg-anime-red/10 opacity-20 rounded-xl overflow-hidden">
            <div className="h-px w-full bg-anime-cyberpunk-blue/40 absolute top-[30%] animate-[glitch_2s_infinite]"></div>
            <div className="h-px w-full bg-anime-red/40 absolute top-[60%] animate-[glitch_1.5s_infinite]"></div>
            <div className="h-full w-px bg-anime-cyberpunk-blue/40 absolute left-[25%] animate-[glitch_2.5s_infinite]"></div>
            <div className="h-full w-px bg-anime-red/40 absolute left-[75%] animate-[glitch_1.75s_infinite]"></div>
          </div>
          
          <ul className="flex justify-around items-center relative z-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path !== "/" && location.pathname.startsWith(item.path));
                              
              return (
                <li key={item.path} className="relative">
                  <Link 
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center p-2 transition-all duration-300",
                      isActive 
                        ? "text-anime-cyberpunk-blue" 
                        : "text-gray-400 hover:text-gray-200"
                    )}
                  >
                    <div className={cn(
                      "relative p-2 rounded-lg transition-all duration-300",
                      isActive && "bg-anime-dark shadow-[0_0_8px_0px_rgba(0,240,255,0.3)]"
                    )}>
                      {item.icon}
                      {isActive && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-anime-red rounded-full animate-pulse" />
                      )}
                    </div>
                    <span className="text-xs mt-1 font-digital">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          {/* Casper Logo */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-anime-cyberpunk-blue opacity-70 font-digital text-xs tracking-widest">
            <div className="text-center animate-pulse">CASPER</div>
            <div className="h-0.5 w-12 bg-anime-cyberpunk-blue/30 mx-auto"></div>
          </div>
        </div>
      </nav>
    </div>
  );
}
