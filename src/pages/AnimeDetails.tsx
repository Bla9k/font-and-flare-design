
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Anime, getAnimeById } from "@/api/jikan";
import Layout from "@/components/Layout";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Heart, Star, Calendar, ArrowRight } from "lucide-react";

export default function AnimeDetails() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        if (id) {
          const animeData = await getAnimeById(parseInt(id, 10));
          setAnime(animeData);
        }
      } catch (error) {
        console.error("Error fetching anime details:", error);
        toast({
          title: "Error",
          description: "Failed to load anime details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          {/* Cyberpunk loading state */}
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-16 h-16 border-4 border-t-anime-cyberpunk-blue border-anime-red/30 rounded-full animate-spin"></div>
            <p className="font-digital text-anime-cyberpunk-blue animate-pulse">LOADING_DATA...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!anime) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-anime-gray/70 border border-anime-red/40 p-8 rounded-md max-w-md mx-auto">
            <h2 className="text-2xl font-display font-bold mb-2">DATA_NOT_FOUND</h2>
            <p className="text-anime-cyberpunk-blue font-digital mb-4">ERROR CODE: 404</p>
            <p className="text-gray-400 mt-2">The requested anime could not be located in the database.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-[60vh] overflow-hidden pb-20">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={anime.images.jpg.large_image_url} 
            alt={anime.title}
            className="w-full h-full object-cover blur-md opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/90 to-anime-dark/70" />
        </div>

        {/* Glitch effect lines */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-5">
          <div className="h-1 bg-anime-cyberpunk-blue absolute w-full top-[15%] left-0 animate-pulse"></div>
          <div className="h-1 bg-anime-red absolute w-full top-[45%] left-0 animate-pulse"></div>
          <div className="h-1 bg-anime-cyberpunk-blue absolute w-full top-[75%] left-0 animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Image */}
            <div className="md:col-span-1">
              <div className="relative w-full max-w-[350px] mx-auto md:mx-0">
                {/* Cyberpunk style frame for image */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-anime-red via-anime-cyberpunk-blue to-anime-red opacity-70 blur-sm"></div>
                <div className="relative overflow-hidden cyberpunk-border">
                  <img 
                    src={anime.images.jpg.large_image_url} 
                    alt={anime.title} 
                    className="w-full h-auto"
                  />
                  {/* Scan line effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-anime-dark/30 opacity-40"></div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="absolute top-4 right-4 bg-anime-dark/50 border border-anime-light-gray p-3 rounded-full hover:bg-anime-red/20 hover:border-anime-red transition-all"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-anime-gray/80 backdrop-blur-sm rounded-md border border-anime-light-gray space-y-4 cyberpunk-border">
                <div className="font-digital text-xs text-anime-cyberpunk-blue mb-4">
                  &gt; ANIME_DATA
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${anime.status === "Currently Airing" ? "bg-anime-cyberpunk-blue" : "bg-anime-red"}`}></span>
                    {anime.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Episodes</p>
                  <p className="font-medium font-digital">{anime.episodes || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Aired</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-anime-cyberpunk-blue" />
                    <span>
                      {new Date(anime.aired.from).toLocaleDateString()} 
                      {anime.aired.to && (
                        <>
                          <ArrowRight className="h-3 w-3 inline mx-1" />
                          {new Date(anime.aired.to).toLocaleDateString()}
                        </>
                      )}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Rating</p>
                  <p className="font-medium">{anime.rating || "Unknown"}</p>
                </div>
              </div>
            </div>

            {/* Right column - Details */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-anime-cyberpunk-blue">
                  {anime.title}
                </h1>
                
                <p className="text-gray-400 mb-4">{anime.title_japanese}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  {anime.score > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-anime-red text-white rounded-md">
                      <Star className="h-4 w-4" />
                      <span className="font-digital">{anime.score.toFixed(1)}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((genre) => (
                      <span 
                        key={genre.mal_id} 
                        className="px-3 py-1 text-sm bg-anime-gray/80 backdrop-blur-sm border border-anime-cyberpunk-blue/30 rounded-md transition-colors hover:border-anime-cyberpunk-blue cursor-pointer"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-anime-gray/50 backdrop-blur-sm p-6 rounded-md border border-anime-light-gray">
                <h2 className="text-xl font-display font-semibold mb-4 flex items-center">
                  <span className="h-4 w-1 bg-anime-red mr-2"></span>
                  Synopsis
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {anime.synopsis || "No synopsis available."}
                </p>
              </div>

              {/* Additional info sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Studios */}
                <div className="bg-anime-gray/40 backdrop-blur-sm p-4 rounded-md border border-anime-light-gray">
                  <h3 className="text-lg font-display font-medium mb-3 text-anime-cyberpunk-blue">Studios</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios?.map((studio) => (
                      <span key={studio.mal_id} className="px-2 py-1 bg-anime-dark/70 rounded text-sm">
                        {studio.name}
                      </span>
                    ))}
                    {anime.studios?.length === 0 && <span className="text-gray-400">Unknown</span>}
                  </div>
                </div>
                
                {/* Producers */}
                <div className="bg-anime-gray/40 backdrop-blur-sm p-4 rounded-md border border-anime-light-gray">
                  <h3 className="text-lg font-display font-medium mb-3 text-anime-cyberpunk-blue">Producers</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.producers?.map((producer) => (
                      <span key={producer.mal_id} className="px-2 py-1 bg-anime-dark/70 rounded text-sm">
                        {producer.name}
                      </span>
                    ))}
                    {anime.producers?.length === 0 && <span className="text-gray-400">Unknown</span>}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-4">
                  <div className="h-0.5 w-12 bg-anime-red"></div>
                  <span className="font-digital text-sm text-anime-cyberpunk-blue">// ID: {anime.mal_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
