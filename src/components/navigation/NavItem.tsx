
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  isActive: boolean;
}

export default function NavItem({ name, path, icon: Icon, isActive }: NavItemProps) {
  return (
    <li className="relative">
      <Link 
        to={path}
        className={cn(
          "flex flex-col items-center px-2 py-1 transition-all duration-300",
          isActive 
            ? "text-anime-cyberpunk-blue" 
            : "text-gray-400 hover:text-gray-200"
        )}
      >
        <div className={cn(
          "relative p-1 rounded-lg transition-all duration-300",
          isActive && "bg-anime-dark/70 shadow-[0_0_12px_2px_rgba(0,240,255,0.25)]"
        )}>
          <Icon className="h-5 w-5" />
          {isActive && (
            <motion.span 
              className="absolute top-0 right-0 h-1.5 w-1.5 bg-anime-cyberpunk-blue rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <span className="text-[10px] font-digital tracking-wider">
          {name}
        </span>
      </Link>
    </li>
  );
}
