
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Search, Film, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    name: "Favorites",
    path: "/favorites",
    icon: <Heart className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          className="bg-anime-gray border-anime-light-gray"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-anime-dark border-r border-anime-light-gray transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-anime-light-gray">
          <h1 className="text-anime-red text-2xl font-display font-bold tracking-wider">
            CASPER<span className="text-anime-cyberpunk-blue">.</span>
          </h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 group",
                location.pathname === item.path 
                  ? "bg-anime-red text-white" 
                  : "hover:bg-anime-light-gray text-gray-400"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-anime-light-gray">
          <div className="px-3 py-2 text-xs font-digital text-gray-500">
            <span className="text-anime-cyberpunk-blue">&gt;</span> CASPER v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}
