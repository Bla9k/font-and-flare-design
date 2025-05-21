
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { toast } from "@/components/ui/use-toast";

// For demo purposes - in a real app this would be fetched from the Jikan API
const mockMangaData = [
  {
    mal_id: 1,
    title: "Berserk",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg" } },
    synopsis: "Guts, a former mercenary now known as the 'Black Swordsman,' is out for revenge...",
    score: 9.4,
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }]
  },
  {
    mal_id: 2,
    title: "Vagabond",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/259070.jpg" } },
    synopsis: "In 16th century Japan, Shinmen Takezou is a wild, rough young man, in both his appearance and his actions...",
    score: 9.2,
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 3, name: "Drama" }]
  },
  {
    mal_id: 3,
    title: "One Piece",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/2/253146.jpg" } },
    synopsis: "Gol D. Roger, a man referred to as the 'King of the Pirates,' is set to be executed by the World Government...",
    score: 9.1,
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }]
  }
];

export default function Manga() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API fetch with mock data
    setFeatured(mockMangaData);
    setTrending([...mockMangaData].reverse());
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 relative">
          <span className="text-anime-cyberpunk-blue">[</span> 
          Manga
          <span className="text-anime-cyberpunk-blue">_</span>
          <span className="text-anime-red">]</span>
        </h1>

        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-display font-bold">Featured Titles</h2>
            <div className="h-0.5 flex-1 bg-anime-light-gray/50"></div>
            <span className="text-sm font-digital text-anime-cyberpunk-blue">//FEATURED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((manga) => (
              <div 
                key={manga.mal_id} 
                className="group relative overflow-hidden rounded-lg border border-anime-light-gray bg-anime-gray/60 backdrop-blur-sm hover:border-anime-cyberpunk-blue/60 transition-all duration-300"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={manga.images.jpg.large_image_url} 
                    alt={manga.title}
                    className="w-full h-full object-cover blur-md opacity-20 transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/80 to-transparent"></div>

                <div className="relative z-10 p-5 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-display font-bold group-hover:text-anime-cyberpunk-blue transition-colors">{manga.title}</h3>
                    {manga.score && (
                      <div className="px-2 py-0.5 bg-anime-red text-white text-sm rounded font-digital">
                        {manga.score.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{manga.synopsis}</p>
                  
                  <div className="mt-auto flex flex-wrap gap-2">
                    {manga.genres?.slice(0, 3).map((genre: any) => (
                      <span 
                        key={genre.mal_id} 
                        className="px-2 py-1 text-xs bg-anime-dark border border-anime-light-gray rounded"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-display font-bold">Trending</h2>
            <div className="h-0.5 flex-1 bg-anime-light-gray/50"></div>
            <span className="text-sm font-digital text-anime-cyberpunk-blue">//TRENDING</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trending.map((manga) => (
              <div 
                key={manga.mal_id} 
                className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg overflow-hidden hover:border-anime-cyberpunk-blue/60 transition-colors"
              >
                <img 
                  src={manga.images.jpg.large_image_url} 
                  alt={manga.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-display font-medium mb-1 truncate">{manga.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {manga.genres?.slice(0, 2).map((genre: any) => (
                        <span 
                          key={genre.mal_id} 
                          className="px-1.5 py-0.5 text-xs bg-anime-dark text-gray-300 rounded"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                    {manga.score && (
                      <div className="text-xs text-anime-cyberpunk-blue font-digital">
                        {manga.score.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
