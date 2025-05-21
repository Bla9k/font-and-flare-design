
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import Discover from "./pages/Discover";
import AnimeBrowse from "./pages/AnimeBrowse";
import MangaBrowse from "./pages/MangaBrowse";
import AnimeDetails from "./pages/AnimeDetails";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Manga from "./pages/Manga";
import MangaDetails from "./pages/MangaDetails";
import Search from "./pages/Search";
import GachaEnhanced from "./pages/GachaEnhanced";

const queryClient = new QueryClient();

// Japanese text for page transitions
const pageTransitionTexts: Record<string, string> = {
  "/": "ホーム",
  "/discover": "発見",
  "/anime": "アニメ",
  "/manga": "漫画",
  "/favorites": "お気に入り",
  "/search": "検索",
  "/gacha": "ガチャ"
};

// AnimatedRoutes component to handle page transitions with Japanese text overlays
const AnimatedRoutes = () => {
  const location = useLocation();
  const pathname = location.pathname.split('/')[1];
  const basePath = `/${pathname}`;
  
  const transitionText = pageTransitionTexts[basePath] || "ページ";
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition transitionText={pageTransitionTexts["/"]}><Home /></PageTransition>
        } />
        <Route path="/discover" element={
          <PageTransition transitionText={pageTransitionTexts["/discover"]}><Discover /></PageTransition>
        } />
        <Route path="/anime" element={
          <PageTransition transitionText={pageTransitionTexts["/anime"]}><AnimeBrowse /></PageTransition>
        } />
        <Route path="/anime/:id" element={
          <PageTransition transitionText={pageTransitionTexts["/anime"]}><AnimeDetails /></PageTransition>
        } />
        <Route path="/manga" element={
          <PageTransition transitionText={pageTransitionTexts["/manga"]}><MangaBrowse /></PageTransition>
        } />
        <Route path="/manga/:id" element={
          <PageTransition transitionText={pageTransitionTexts["/manga"]}><MangaDetails /></PageTransition>
        } />
        <Route path="/favorites" element={
          <PageTransition transitionText={pageTransitionTexts["/favorites"]}><Favorites /></PageTransition>
        } />
        <Route path="/search" element={
          <PageTransition transitionText={pageTransitionTexts["/search"]}><Search /></PageTransition>
        } />
        <Route path="/gacha" element={
          <PageTransition transitionText={pageTransitionTexts["/gacha"]}><GachaEnhanced /></PageTransition>
        } />
        <Route path="*" element={
          <PageTransition transitionText="見つかりません"><NotFound /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

// Page transition component with Japanese text overlay
const PageTransition = ({ children, transitionText }: { children: React.ReactNode; transitionText: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed inset-0 z-50 bg-anime-dark flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <span className="text-7xl md:text-9xl font-jp font-black text-anime-cyberpunk-blue/20">
            {transitionText}
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-3xl md:text-5xl font-display font-bold text-white">
            {transitionText}
          </span>
        </motion.div>
      </motion.div>
      {children}
    </motion.div>
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
