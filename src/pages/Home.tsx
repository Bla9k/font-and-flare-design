
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSeasonalAnime, getTopAnime, Anime } from "@/api/jikan";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AnimeCard from "@/components/AnimeCard";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [top, seasonal] = await Promise.all([
          getTopAnime(),
          getSeasonalAnime()
        ]);
        
        setTopAnime(top || []);
        setSeasonalAnime(seasonal || []);
      } catch (error) {
        console.error("Error fetching anime data:", error);
        toast({
          title: "Error",
          description: "Failed to load anime data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <Layout>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <HeroSection />
        
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Top Anime Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-display font-bold">Top Rated Anime</h2>
                <div className="h-0.5 w-12 bg-anime-red hidden md:block"></div>
              </div>
              <div className="font-digital text-sm text-anime-cyberpunk-blue">// BEST OF ALL TIME</div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-[320px] bg-anime-gray animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {topAnime && topAnime.slice(0, 10).map((anime) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: anime.mal_id * 0.02 % 0.5 }}
                  >
                    <AnimeCard anime={anime} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Seasonal Anime Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-display font-bold">Seasonal Anime</h2>
                <div className="h-0.5 w-12 bg-anime-red hidden md:block"></div>
              </div>
              <div className="font-digital text-sm text-anime-cyberpunk-blue">// CURRENT SEASON</div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[320px] bg-anime-gray animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasonalAnime && seasonalAnime.slice(0, 6).map((anime) => (
                  <motion.div
                    key={anime.mal_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: anime.mal_id * 0.02 % 0.5 }}
                  >
                    <AnimeCard 
                      key={anime.mal_id} 
                      anime={anime} 
                      className="h-[380px]"
                      variant="featured"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </motion.div>
    </Layout>
  );
}
