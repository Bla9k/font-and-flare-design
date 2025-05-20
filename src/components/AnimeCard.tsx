
import { Anime } from "@/api/jikan";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AnimeCardProps {
  anime: Anime;
  className?: string;
  variant?: "default" | "featured";
}

export default function AnimeCard({ anime, className, variant = "default" }: AnimeCardProps) {
  const isFeatured = variant === "featured";
  
  return (
    <Link to={`/anime/${anime.mal_id}`}>
      <Card
        className={cn(
          "overflow-hidden group border-anime-light-gray bg-anime-gray hover:border-anime-red transition-all duration-300",
          isFeatured ? "h-[500px]" : "h-[320px]",
          className
        )}
      >
        <div className="relative w-full h-full">
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <CardContent className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              {anime.score > 0 && (
                <span className="px-2 py-1 text-xs bg-anime-red text-white font-digital">
                  {anime.score.toFixed(1)}
                </span>
              )}
              <span className="px-2 py-1 text-xs bg-anime-gray text-white font-digital">
                EP {anime.episodes || "?"}
              </span>
            </div>
            
            <h3 
              className={cn(
                "font-display font-semibold line-clamp-2 group-hover:text-anime-red transition-colors",
                isFeatured ? "text-xl" : "text-lg"
              )}
            >
              {anime.title}
            </h3>
            
            {isFeatured && (
              <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                {anime.synopsis}
              </p>
            )}
            
            <div className="mt-3 flex flex-wrap gap-1">
              {anime.genres?.slice(0, 3).map((genre) => (
                <span 
                  key={genre.mal_id}
                  className="px-2 py-0.5 text-xs bg-anime-dark text-gray-400 border border-anime-light-gray"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
