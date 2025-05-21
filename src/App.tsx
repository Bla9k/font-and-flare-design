
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import Discover from "./pages/Discover";
import AnimeBrowse from "./pages/AnimeBrowse";
import MangaBrowse from "./pages/MangaBrowse";
import AnimeDetails from "./pages/AnimeDetails";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Manga from "./pages/Manga";

const queryClient = new QueryClient();

// AnimatedRoutes component to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/anime" element={<AnimeBrowse />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/manga" element={<MangaBrowse />} />
        <Route path="/manga/:id" element={<Manga />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
