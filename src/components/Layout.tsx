
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNavEnhanced from "./BottomNavEnhanced";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMobile();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <div className="flex min-h-screen bg-anime-dark text-white">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0 md:ml-64">
        {/* Show Casper logo only on home page */}
        {isHomePage && (
          <div className="fixed top-4 right-4 z-10">
            <div className="bg-anime-dark/70 backdrop-blur-sm px-3 py-2 rounded-full flex items-center">
              <span className="text-anime-cyberpunk-blue font-digital text-xs">v1.0.0</span>
            </div>
          </div>
        )}
        
        {children}
      </main>
      
      {/* Bottom navigation for mobile */}
      {isMobile && <BottomNavEnhanced />}
    </div>
  );
}
