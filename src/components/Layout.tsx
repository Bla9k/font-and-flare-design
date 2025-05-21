
import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">      
      {/* Visual effects for cyberpunk feel */}
      <div className="scanline"></div>
      <div className="noise"></div>
      
      {/* Starry sky background */}
      <div className="starry-sky fixed inset-0 z-[-1]"></div>
      
      <main className="flex-1 min-h-screen pb-16">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
