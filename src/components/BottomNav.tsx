
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navItems } from "./navigation/navItems";
import NavItem from "./navigation/NavItem";
import PageIndicator from "./navigation/PageIndicator";
import { useNavigation } from "@/hooks/useNavigation";

export default function BottomNav() {
  const location = useLocation();
  const { isVisible } = useNavigation(navItems);

  return (
    <motion.div 
      className="fixed bottom-6 left-1/2 z-50"
      initial={{ translateX: "-50%", translateY: 0 }}
      animate={{ 
        translateX: "-50%", 
        translateY: isVisible ? 0 : 100
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.nav 
        className={cn(
          "px-4 py-2 rounded-full bg-gradient-to-r from-anime-dark/95 via-anime-gray/95 to-anime-dark/95 backdrop-blur-md",
          "shadow-lg shadow-black/20",
          "border border-anime-cyberpunk-blue/30",
          "w-[340px]"
        )}
      >
        <div className="relative">
          <ul className="flex justify-center items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                            (item.path !== "/" && location.pathname.startsWith(item.path));
                            
              return (
                <NavItem 
                  key={item.path}
                  name={item.name}
                  path={item.path}
                  icon={item.icon}
                  isActive={isActive}
                />
              );
            })}
          </ul>
          
          {/* Enhanced glow effect for better UI */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-anime-cyberpunk-blue/10 via-anime-red/5 to-anime-cyberpunk-blue/10 rounded-full blur-md opacity-70"></div>
        </div>
      </motion.nav>
      
      {/* Page navigation indicator - centered */}
      <PageIndicator navItems={navItems} />
    </motion.div>
  );
}
