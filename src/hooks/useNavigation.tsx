
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { NavItem } from "@/components/navigation/navItems";

export function useNavigation(navItems: NavItem[]) {
  const location = useLocation();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Check if this is the first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('seen-gesture-tutorial');
    if (!hasSeenTutorial) {
      setTimeout(() => {
        toast({
          title: "Gesture Controls",
          description: "Swipe left/right to navigate pages.",
          duration: 5000,
        });
        localStorage.setItem('seen-gesture-tutorial', 'true');
      }, 2000);
    }
  }, []);

  // Handle scroll events to auto-hide the navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide the nav
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show the nav
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Page swipe navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    };
    
    const handleSwipeGesture = () => {
      const minSwipeDistance = 100;
      if (touchStartX - touchEndX > minSwipeDistance) {
        // Swiped left - go forward in navItems
        const currentIndex = navItems.findIndex(item => item.path === location.pathname);
        if (currentIndex < navItems.length - 1) {
          window.location.href = navItems[currentIndex + 1].path;
        }
      } else if (touchEndX - touchStartX > minSwipeDistance) {
        // Swiped right - go backward in navItems
        const currentIndex = navItems.findIndex(item => item.path === location.pathname);
        if (currentIndex > 0) {
          window.location.href = navItems[currentIndex - 1].path;
        }
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [location.pathname, navItems]);

  return { isVisible };
}
