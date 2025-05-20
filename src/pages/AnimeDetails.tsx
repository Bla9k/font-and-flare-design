
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Anime, getAnimeById } from "@/api/jikan";
import Layout from "@/components/Layout";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

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
          <div className="animate-pulse bg-anime-gray h-[500px] rounded-md"></div>
        </div>
      </Layout>
    );
  }

  if (!anime) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-display font-bold">Anime not found</h2>
          <p className="text-gray-400 mt-2">The requested anime could not be found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-[60vh] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={anime.images.jpg.large_image_url} 
            alt={anime.title}
            className="w-full h-full object-cover blur-md opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/90 to-anime-dark/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Image */}
            <div className="md:col-span-1">
              <div className="relative w-full max-w-[350px] mx-auto md:mx-0">
                <img 
                  src={anime.images.jpg.large_image_url} 
                  alt={anime.title} 
                  className="w-full h-auto rounded-md cyberpunk-border"
                />
                
                <Button variant="outline" className="absolute top-4 right-4 bg-anime-dark/50 border border-anime-light-gray p-3 rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-anime-gray rounded-md border border-anime-light-gray space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="font-medium">{anime.status}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Episodes</p>
                  <p className="font-medium">{anime.episodes || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Aired</p>
                  <p className="font-medium">
                    {new Date(anime.aired.from).toLocaleDateString()} 
                    {anime.aired.to && ` to ${new Date(anime.aired.to).toLocaleDateString()}`}
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
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{anime.title}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  {anime.score > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-anime-red text-white rounded">
                      <Star className="h-4 w-4" />
                      <span className="font-digital">{anime.score.toFixed(1)}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((genre) => (
                      <span 
                        key={genre.mal_id} 
                        className="px-3 py-1 text-sm bg-anime-gray border border-anime-light-gray rounded"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-display font-semibold mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {anime.synopsis || "No synopsis available."}
                </p>
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
