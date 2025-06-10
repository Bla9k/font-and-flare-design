
import { Home, Heart, Search, Film, BookOpen, Package, Info } from "lucide-react";
import React from "react";

export type NavItem = {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  subItems?: NavItem[];
};

export const navItems: NavItem[] = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Search",
    path: "/search",
    icon: Search,
  },
  {
    name: "Anime",
    path: "/anime",
    icon: Film,
  },
  {
    name: "Manga",
    path: "/manga",
    icon: BookOpen,
    subItems: [
      {
        name: "Browse",
        path: "/manga",
        icon: BookOpen,
      },
      {
        name: "About",
        path: "/manga/about",
        icon: Info,
      }
    ]
  },
  {
    name: "Gacha",
    path: "/gacha",
    icon: Package,
  },
  {
    name: "Favorites",
    path: "/favorites",
    icon: Heart,
  },
];
