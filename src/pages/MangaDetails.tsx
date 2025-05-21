
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Star } from "lucide-react";

// For demo purposes - in a real app this would be fetched from an API
const mockMangaDetails = [
  {
    mal_id: 1,
    title: "Berserk",
    title_japanese: "ベルセルク",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg" } },
    synopsis: "Guts, a former mercenary now known as the 'Black Swordsman,' is out for revenge. After a tumultuous childhood, he finally finds someone he respects and believes he can trust, only to have everything fall apart when this person takes away everything important to Guts for the purpose of fulfilling his own desires. Now marked for death, Guts becomes condemned to a fate in which he is relentlessly pursued by demonic beings.",
    score: 9.4,
    scored_by: 323470,
    rank: 1,
    popularity: 2,
    status: "Publishing",
    genres: [
      { mal_id: 1, name: "Action" }, 
      { mal_id: 2, name: "Adventure" }, 
      { mal_id: 8, name: "Drama" },
      { mal_id: 10, name: "Fantasy" },
      { mal_id: 27, name: "Horror" }
    ],
    authors: [
      { mal_id: 1868, name: "Miura, Kentarou" }
    ],
    chapters: 364,
    volumes: 41,
    published: {
      from: "1989-08-25T00:00:00+00:00",
      to: null,
      string: "Aug 25, 1989 to ?"
    }
  },
  {
    mal_id: 2,
    title: "Vagabond",
    title_japanese: "バガボンド",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/259070.jpg" } },
    synopsis: "In 16th century Japan, Shinmen Takezou is a wild, rough young man, in both his appearance and his actions. His aggressive nature has won him the collective reproach and fear of his village, leading him and his best friend, Matahachi Honiden, to run away in search of something grander than provincial life. The pair enlist in the Toyotomi army, yearning for glory—but when the Toyotomi suffer a crushing defeat at the hands of the Tokugawa Clan at the Battle of Sekigahara, the friends barely make it out alive.",
    score: 9.2,
    scored_by: 157302,
    rank: 2,
    popularity: 4,
    status: "On Hiatus",
    genres: [
      { mal_id: 1, name: "Action" }, 
      { mal_id: 2, name: "Adventure" }, 
      { mal_id: 8, name: "Drama" },
      { mal_id: 13, name: "Historical" },
      { mal_id: 36, name: "Martial Arts" }
    ],
    authors: [
      { mal_id: 1867, name: "Inoue, Takehiko" }
    ],
    chapters: 327,
    volumes: 37,
    published: {
      from: "1998-09-03T00:00:00+00:00",
      to: null,
      string: "Sep 3, 1998 to ?"
    }
  },
  {
    mal_id: 3,
    title: "One Piece",
    title_japanese: "ワンピース",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/2/253146.jpg" } },
    synopsis: "Gol D. Roger, a man referred to as the 'King of the Pirates,' is set to be executed by the World Government. But just before his death, he confirms the existence of a great treasure, One Piece, located somewhere within the vast ocean known as the Grand Line. Announcing that One Piece can be claimed by anyone worthy enough to reach it, the King of the Pirates is executed and the Great Age of Pirates begins.",
    score: 9.1,
    scored_by: 258139,
    rank: 3,
    popularity: 1,
    status: "Publishing",
    genres: [
      { mal_id: 1, name: "Action" }, 
      { mal_id: 2, name: "Adventure" }, 
      { mal_id: 4, name: "Comedy" },
      { mal_id: 10, name: "Fantasy" }
    ],
    authors: [
      { mal_id: 1881, name: "Oda, Eiichiro" }
    ],
    chapters: null,
    volumes: null,
    published: {
      from: "1997-07-22T00:00:00+00:00",
      to: null,
      string: "Jul 22, 1997 to ?"
    }
  }
];

export default function MangaDetails() {
  const { id } = useParams<{ id: string }>();
  const [manga, setManga] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true);
      try {
        // In a real app this would be an API call
        // For now we'll just use mock data
        const foundManga = mockMangaDetails.find(m => m.mal_id === Number(id));
        
        if (foundManga) {
          setManga(foundManga);
          // Check if manga is in favorites (would use local storage or a database in a real app)
          const favorites = JSON.parse(localStorage.getItem('manga_favorites') || '[]');
          setIsFavorite(favorites.some((fav: any) => fav.mal_id === Number(id)));
        } else {
          toast({
            title: "Error",
            description: "Manga not found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching manga details:", error);
        toast({
          title: "Error",
          description: "Failed to load manga details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchManga();
    }
  }, [id]);

  const toggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('manga_favorites') || '[]');
      
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter((fav: any) => fav.mal_id !== manga.mal_id);
        localStorage.setItem('manga_favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: `${manga.title} has been removed from your favorites.`
        });
      } else {
        // Add to favorites
        const mangaToSave = {
          mal_id: manga.mal_id,
          title: manga.title,
          image_url: manga.images.jpg.large_image_url,
          score: manga.score
        };
        const updatedFavorites = [...favorites, mangaToSave];
        localStorage.setItem('manga_favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: `${manga.title} has been added to your favorites!`
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Japanese text transition animation
  const textVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
    exit: { 
      opacity: 0,
      y: -30,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-[70vh]"
          >
            <div className="h-16 w-16 border-4 border-anime-red border-t-transparent rounded-full animate-spin"></div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 font-jp text-2xl text-anime-red/70"
            >
              読み込み中...
            </motion.div>
          </motion.div>
        ) : manga ? (
          <motion.div
            key="content"
            initial="initial"
            animate="animate"
            exit="exit"
            className="container mx-auto px-4 py-8"
          >
            {/* Back button */}
            <Link to="/manga" className="inline-flex items-center text-anime-cyberpunk-blue hover:text-anime-red transition-colors mb-6">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span className="font-digital text-sm">BACK TO MANGA</span>
            </Link>
            
            {/* Hero section with manga cover */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
              <div className="absolute inset-0">
                <img 
                  src={manga.images.jpg.large_image_url} 
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/80 to-transparent"></div>
              </div>
              
              <motion.div 
                variants={textVariants}
                className="absolute bottom-0 left-0 w-full p-6"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                      {manga.title}
                    </h1>
                    
                    {manga.title_japanese && (
                      <p className="text-lg font-jp text-gray-300 mb-3">
                        {manga.title_japanese}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      {manga.score && (
                        <div className="flex items-center bg-anime-dark/70 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Star className="h-4 w-4 text-anime-red mr-1" />
                          <span className="text-white font-bold">{manga.score.toFixed(1)}</span>
                          <span className="text-gray-400 text-xs ml-1">({manga.scored_by.toLocaleString()})</span>
                        </div>
                      )}
                      
                      <div className="text-xs font-digital bg-anime-dark/70 backdrop-blur-sm px-3 py-1 rounded-full">
                        {manga.status}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={toggleFavorite}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full ${isFavorite ? 'bg-anime-red text-white' : 'bg-anime-dark/70 backdrop-blur-sm text-gray-400 border border-gray-700'}`}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
            
            {/* Manga details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column - Cover and metadata */}
              <div className="md:col-span-1">
                <motion.div 
                  variants={textVariants}
                  className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg overflow-hidden"
                >
                  <img 
                    src={manga.images.jpg.large_image_url} 
                    alt={manga.title}
                    className="w-full h-auto"
                  />
                </motion.div>
                
                <motion.div 
                  variants={textVariants}
                  className="mt-6 bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-4"
                >
                  <h3 className="text-lg font-display font-bold mb-4 border-b border-anime-light-gray pb-2">
                    <span className="text-anime-cyberpunk-blue">?</span> Information
                  </h3>
                  
                  <dl className="space-y-3 text-sm">
                    {manga.authors?.length > 0 && (
                      <div>
                        <dt className="text-gray-400">Author:</dt>
                        <dd className="font-semibold">{manga.authors.map((a: any) => a.name).join(", ")}</dd>
                      </div>
                    )}
                    
                    {manga.published?.string && (
                      <div>
                        <dt className="text-gray-400">Published:</dt>
                        <dd className="font-semibold">{manga.published.string}</dd>
                      </div>
                    )}
                    
                    {manga.volumes && (
                      <div>
                        <dt className="text-gray-400">Volumes:</dt>
                        <dd className="font-semibold">{manga.volumes}</dd>
                      </div>
                    )}
                    
                    {manga.chapters && (
                      <div>
                        <dt className="text-gray-400">Chapters:</dt>
                        <dd className="font-semibold">{manga.chapters}</dd>
                      </div>
                    )}
                    
                    {manga.genres?.length > 0 && (
                      <div>
                        <dt className="text-gray-400">Genres:</dt>
                        <dd className="flex flex-wrap gap-2 mt-2">
                          {manga.genres.map((genre: any) => (
                            <span 
                              key={genre.mal_id} 
                              className="px-2 py-1 bg-anime-dark text-xs rounded"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                    
                    {manga.rank && (
                      <div>
                        <dt className="text-gray-400">Rank:</dt>
                        <dd className="font-semibold text-anime-red">#{manga.rank}</dd>
                      </div>
                    )}
                    
                    {manga.popularity && (
                      <div>
                        <dt className="text-gray-400">Popularity:</dt>
                        <dd className="font-semibold">#{manga.popularity}</dd>
                      </div>
                    )}
                  </dl>
                </motion.div>
              </div>
              
              {/* Right column - Synopsis and more details */}
              <div className="md:col-span-2">
                <motion.div 
                  variants={textVariants}
                  className="bg-anime-gray/60 backdrop-blur-sm border border-anime-light-gray rounded-lg p-6"
                >
                  <h3 className="text-xl font-display font-bold mb-4 border-b border-anime-light-gray pb-2">
                    <span className="text-anime-cyberpunk-blue">#</span> Synopsis
                  </h3>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                    {manga.synopsis}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="not-found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-[70vh]"
          >
            <div className="text-anime-red text-2xl font-display mb-4">Manga Not Found</div>
            <p className="text-gray-400 mb-6">The manga you're looking for could not be found.</p>
            <Link 
              to="/manga" 
              className="px-4 py-2 bg-anime-red text-white rounded-md hover:bg-opacity-80 transition-colors"
            >
              Back to Manga
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
