
import { useEffect, useState } from "react";
import { Anime, getTopAnime } from "@/api/jikan";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllBanners, GachaBanner } from "@/api/gachaService";

export default function HeroSection() {
  const [featuredAnime, setFeaturedAnime] = useState<Anime | null>(null);
  const [eventBanners, setEventBanners] = useState<GachaBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEvent, setShowEvent] = useState(false);

  // Toggle between featured anime and event banner every 10 seconds
  useEffect(() => {
    if (eventBanners.length > 0) {
      const interval = setInterval(() => {
        setShowEvent(prev => !prev);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [eventBanners]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both top anime and event banners in parallel
        const [topAnime, banners] = await Promise.all([
          getTopAnime(),
          getAllBanners()
        ]);
        
        // Select a random anime from top 5
        const randomIndex = Math.floor(Math.random() * Math.min(5, topAnime.length));
        setFeaturedAnime(topAnime[randomIndex]);
        
        // Filter only limited and collaboration banners
        const specialBanners = banners.filter(
          banner => banner.bannerType === 'limited' || banner.bannerType === 'collaboration'
        );
        setEventBanners(specialBanners);
      } catch (error) {
        console.error("Error fetching featured content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || (!featuredAnime && !eventBanners.length)) {
    return <div className="min-h-[500px] bg-anime-gray animate-pulse"></div>;
  }

  // Show event banner if there are any and it's toggled on
  const showEventBanner = eventBanners.length > 0 && showEvent;
  const currentBanner = eventBanners[0]; // Use the first event banner

  return (
    <div className="relative w-full min-h-[70vh] overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: showEventBanner ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        {featuredAnime && (
          <>
            <img 
              src={featuredAnime.images.jpg.large_image_url} 
              alt={featuredAnime.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-anime-dark via-anime-dark/80 to-transparent" />
          </>
        )}
      </motion.div>

      <motion.div 
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: showEventBanner ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {currentBanner && (
          <>
            <img 
              src={currentBanner.imageUrl} 
              alt={currentBanner.title}
              className="w-full h-full object-cover opacity-50"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1559125148-5118931534d6";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-anime-dark via-anime-dark/80 to-transparent" />
          </>
        )}
      </motion.div>

      <div className="relative z-20 container mx-auto px-4 py-16 md:py-24 flex flex-col justify-center h-full">
        <motion.div 
          className="max-w-2xl space-y-6"
          initial={{ opacity: 1 }}
          animate={{ opacity: showEventBanner ? 0 : 1, x: showEventBanner ? -20 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {featuredAnime && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-12 bg-anime-red"></div>
                <span className="font-digital text-sm text-anime-red">FEATURED ANIME</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold">
                {featuredAnime.title}
              </h1>
              
              <p className="text-gray-300 line-clamp-3 md:line-clamp-4">
                {featuredAnime.synopsis}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {featuredAnime.genres?.slice(0, 4).map((genre) => (
                  <span 
                    key={genre.mal_id}
                    className="px-3 py-1 text-sm border border-anime-light-gray text-gray-400"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="pt-4">
                <Link to={`/anime/${featuredAnime.mal_id}`}>
                  <Button className="bg-anime-red hover:bg-anime-red/80 text-white">
                    View Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </motion.div>
        
        <motion.div 
          className="max-w-2xl space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: showEventBanner ? 1 : 0, x: showEventBanner ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          style={{ display: showEventBanner ? 'block' : 'none' }}
        >
          {currentBanner && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-12 bg-anime-cyberpunk-blue"></div>
                <span className="font-digital text-sm text-anime-cyberpunk-blue">
                  {currentBanner.bannerType === 'limited' ? 'LIMITED TIME EVENT' : 'SPECIAL COLLABORATION'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold">
                {currentBanner.title}
              </h1>
              
              <p className="text-gray-300 line-clamp-3 md:line-clamp-4">
                {currentBanner.description}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-anime-cyberpunk-blue/20 text-anime-cyberpunk-blue border border-anime-cyberpunk-blue/50 rounded">
                  Ends: {currentBanner.endDate}
                </div>
                
                {currentBanner.boost && (
                  <div className="px-3 py-1 bg-anime-red/20 text-anime-red border border-anime-red/50 rounded">
                    {currentBanner.boost}x Rate Up!
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <Link to="/gacha">
                  <Button className="bg-anime-cyberpunk-blue hover:bg-anime-cyberpunk-blue/80 text-white">
                    Pull Now <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
