import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSeasonalAnime, getTopAnime, Anime } from "@/api/jikan";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AnimeCard from "@/components/AnimeCard";
import GameAdBanner from "@/components/ads/GameAdBanner";
import ThemeSelector from "@/components/theme/ThemeSelector";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("seasonal");

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
        
        // For upcoming, we'll use a subset of seasonal with different styling
        // In a real app, you'd make a separate API call
        setUpcomingAnime(seasonal?.slice(6, 12) || []);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* Theme Selector */}
        <section className="flex justify-end">
          <ThemeSelector />
        </section>

        {/* Featured Categories Tabs */}
        <section className="mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold flex items-center">
              <span className="text-anime-red mr-2">#</span>
              Featured Anime
            </h2>
            
            <div className="flex space-x-2 mt-3 md:mt-0">
              <Button 
                variant={activeCategory === "seasonal" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("seasonal")}
                className={activeCategory === "seasonal" ? "bg-anime-cyberpunk-blue text-black" : ""}
              >
                <Clock className="h-4 w-4 mr-1" />
                Seasonal
              </Button>
              <Button 
                variant={activeCategory === "top" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("top")}
                className={activeCategory === "top" ? "bg-anime-cyberpunk-blue text-black" : ""}
              >
                <Star className="h-4 w-4 mr-1" />
                Top Rated
              </Button>
              <Button 
                variant={activeCategory === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("upcoming")}
                className={activeCategory === "upcoming" ? "bg-anime-cyberpunk-blue text-black" : ""}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Upcoming
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-[320px] bg-anime-gray animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {activeCategory === "seasonal" && seasonalAnime.slice(0, 10).map((anime) => (
                <motion.div key={anime.mal_id} variants={item}>
                  <AnimeCard anime={anime} />
                </motion.div>
              ))}
              
              {activeCategory === "top" && topAnime.slice(0, 10).map((anime) => (
                <motion.div key={anime.mal_id} variants={item}>
                  <AnimeCard anime={anime} />
                </motion.div>
              ))}
              
              {activeCategory === "upcoming" && upcomingAnime.map((anime) => (
                <motion.div key={anime.mal_id} variants={item}>
                  <AnimeCard anime={anime} />
                </motion.div>
              ))}
              
              {activeCategory === "seasonal" && seasonalAnime.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-anime-cyberpunk-blue">No seasonal anime found</p>
                </div>
              )}
              
              {activeCategory === "top" && topAnime.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-anime-cyberpunk-blue">No top anime found</p>
                </div>
              )}
              
              {activeCategory === "upcoming" && upcomingAnime.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-anime-cyberpunk-blue">No upcoming anime found</p>
                </div>
              )}
            </motion.div>
          )}
          
          <div className="mt-6 text-right">
            <Link 
              to="/anime"
              className="inline-flex items-center text-anime-cyberpunk-blue hover:underline"
            >
              Browse all anime <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Casper AI Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-anime-cyberpunk-blue/5 backdrop-blur-md"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10">
              <div className="text-9xl font-jp font-bold text-anime-cyberpunk-blue">AI</div>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div>
              <div className="mb-4 text-anime-red font-digital text-sm">// COMING_SOON</div>
              <h2 className="text-3xl font-display font-bold mb-4">CASPER AI</h2>
              <p className="text-gray-300 mb-6">
                Our advanced AI system will revolutionize how you discover and enjoy anime. 
                Get personalized recommendations, detailed analysis, and insights about your favorite shows.
              </p>
              
              <ul className="space-y-3 mb-6">
                {["Personalized recommendations", "Detailed character analysis", "Plot predictions", "Similar show finder"].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <div className="h-2 w-2 bg-anime-red mr-2"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="font-digital text-sm text-gray-400">
                Development progress:
                <div className="mt-2 h-2 w-full bg-anime-dark rounded-full overflow-hidden">
                  <div className="h-full bg-anime-red w-[35%]"></div>
                </div>
                <div className="mt-1 text-right">35%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 relative">
                <div className="absolute inset-0 rounded-full bg-anime-red/10 animate-pulse"></div>
                <div className="absolute inset-3 rounded-full border-2 border-anime-red flex items-center justify-center">
                  <div className="text-4xl font-bold text-anime-red">C</div>
                </div>
                <div className="absolute inset-0 border-2 border-anime-red/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-[-10px] border border-anime-red/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute inset-[-20px] border border-anime-red/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Eye of Existence Advertisement */}
        <GameAdBanner />

        {/* Genre Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-display font-bold">Popular Genres</h2>
              <div className="h-0.5 w-12 bg-anime-red hidden md:block"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Action", image: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg", count: 7245 },
              { name: "Romance", image: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg", count: 3512 },
              { name: "Fantasy", image: "https://cdn.myanimelist.net/images/anime/1170/124312l.jpg", count: 5234 },
              { name: "Sci-Fi", image: "https://cdn.myanimelist.net/images/anime/1297/117508l.jpg", count: 2873 }
            ].map((genre) => (
              <motion.div 
                key={genre.name}
                whileHover={{ scale: 1.03 }}
                className="relative h-40 rounded-lg overflow-hidden"
              >
                <img 
                  src={genre.image} 
                  alt={genre.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-display font-bold text-white">{genre.name}</div>
                  <div className="text-sm text-gray-300">{genre.count.toLocaleString()} titles</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
