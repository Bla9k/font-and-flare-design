
import { useEffect, useState } from "react";
import { Anime, getTopAnime } from "@/api/jikan";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import EventBanners from "@/components/EventBanners";

export default function HeroSection() {
  const [featuredAnime, setFeaturedAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedAnime = async () => {
      try {
        const topAnime = await getTopAnime();
        // Select a random anime from top 5
        const randomIndex = Math.floor(Math.random() * Math.min(5, topAnime.length));
        setFeaturedAnime(topAnime[randomIndex]);
      } catch (error) {
        console.error("Error fetching featured anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedAnime();
  }, []);

  if (loading || !featuredAnime) {
    return <div className="min-h-[500px] bg-anime-gray animate-pulse"></div>;
  }

  return (
    <>
      <div className="relative w-full min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 z-10">
          <img 
            src={featuredAnime.images.jpg.large_image_url} 
            alt={featuredAnime.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-anime-dark via-anime-dark/80 to-transparent" />
        </div>

        <div className="relative z-20 container mx-auto px-4 py-16 md:py-24 flex flex-col justify-center h-full">
          <div className="max-w-2xl space-y-6">
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
          </div>
        </div>
      </div>
      
      {/* Add Event Banners component below the hero */}
      <EventBanners />
    </>
  );
}
