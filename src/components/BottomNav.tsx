
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
      className="fixed left-1/2 bottom-5 z-[110] md:bottom-7"
      initial={{ translateX: "-50%", translateY: 100 }}
      animate={{ 
        translateX: "-50%", 
        translateY: isVisible ? 0 : 100
      }}
      transition={{ duration: 0.35, type: "spring", stiffness: 70 }}
    >
      <motion.nav 
        className={cn(
          "w-[340px] max-w-[97vw] mx-auto px-6 py-2 rounded-full relative",
          // Opaque glass effect
          "bg-anime-dark bg-opacity-95 backdrop-blur-md",
          // Glow border
          "border-2 border-anime-cyberpunk-blue/40 shadow-2xl shadow-anime-cyberpunk-blue/5",
          // Animation
          "transition-all duration-300"
        )}
      >
        {/* Gradient, subtle glow */}
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-anime-cyberpunk-blue/10 via-anime-red/5 to-anime-cyberpunk-blue/10 blur-sm pointer-events-none" />
        <ul className="flex justify-between items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (
              item.path !== "/" && location.pathname.startsWith(item.path)
            );
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
      </motion.nav>
      {/* Precise navigation indicator */}
      <div className="relative flex justify-center">
        <PageIndicator navItems={navItems} />
      </div>
    </motion.div>
  );
}
