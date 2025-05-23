
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { NavItem } from "./navItems";

interface PageIndicatorProps {
  navItems: NavItem[];
}

export default function PageIndicator({ navItems }: PageIndicatorProps) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: -20 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-1"
      >
        {navItems.map((item) => (
          <motion.div 
            key={item.path}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              location.pathname === item.path 
                ? "w-3 bg-anime-cyberpunk-blue shadow-[0_0_8px_2px_rgba(0,240,255,0.4)]" 
                : "w-1 bg-gray-600"
            )}
            whileHover={location.pathname !== item.path ? { scale: 1.5, backgroundColor: "#A2C4FF" } : {}}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
