
import { Manga } from "@/api/jikan";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface MangaCardProps {
  manga: Manga;
  className?: string;
  variant?: "default" | "featured";
}

export default function MangaCard({ manga, className, variant = "default" }: MangaCardProps) {
  const isFeatured = variant === "featured";
  
  return (
    <Link to={`/manga/${manga.mal_id}`}>
      <Card
        className={cn(
          "overflow-hidden group border-anime-light-gray bg-anime-gray hover:border-anime-cyberpunk-blue transition-all duration-300",
          isFeatured ? "h-[500px]" : "h-[320px]",
          className
        )}
      >
        <div className="relative w-full h-full">
          <img
            src={manga.images.jpg.large_image_url}
            alt={manga.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <CardContent className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              {manga.score > 0 && (
                <span className="px-2 py-1 text-xs bg-anime-cyberpunk-blue text-white font-digital">
                  {manga.score.toFixed(1)}
                </span>
              )}
              <span className="px-2 py-1 text-xs bg-anime-gray text-white font-digital">
                {manga.type || "MANGA"}
              </span>
            </div>
            
            <h3 
              className={cn(
                "font-display font-semibold line-clamp-2 group-hover:text-anime-cyberpunk-blue transition-colors",
                isFeatured ? "text-xl" : "text-lg"
              )}
            >
              {manga.title}
            </h3>
            
            {isFeatured && (
              <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                {manga.synopsis}
              </p>
            )}
            
            <div className="mt-3 flex flex-wrap gap-1">
              {manga.genres?.slice(0, 3).map((genre) => (
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
