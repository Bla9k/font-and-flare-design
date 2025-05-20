
import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Visual effects for cyberpunk feel */}
      <div className="scanline"></div>
      <div className="noise"></div>
      
      {/* Animated starry background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-anime-dark">
          <div id="stars-container" className="h-full w-full opacity-70"></div>
        </div>
      </div>
      
      <main className="flex-1 min-h-screen pb-24">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
