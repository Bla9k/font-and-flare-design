
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Search, Film, BookOpen } from "lucide-react";
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

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-1 py-1 rounded-xl bg-anime-dark/80 backdrop-blur-md border border-anime-cyberpunk-blue/30 shadow-[0_0_15px_0px_rgba(0,240,255,0.3)] cyberpunk-border w-[90%] max-w-md">
      <div className="relative">
        {/* Glitch effect */}
        <div className="absolute inset-0 bg-anime-red/5 animate-pulse opacity-20 rounded-xl"></div>
        
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
                      <span className="absolute top-0 right-0 h-2 w-2 bg-anime-red rounded-full" />
                    )}
                  </div>
                  <span className="text-xs mt-1 font-digital">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
