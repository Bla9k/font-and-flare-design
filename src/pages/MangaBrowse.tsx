
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MangaDetailsPanel from "@/components/manga/MangaDetailsPanel";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, TrendingUp } from "lucide-react";

// Mock manga data - in a real app this would come from an API
const mockMangaData = [
  {
    mal_id: 1,
    title: "Berserk",
    title_japanese: "ベルセルク",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg" } },
    synopsis: "Guts, a former mercenary now known as the 'Black Swordsman,' is out for revenge. After a tumultuous childhood, he finally finds someone he respects and believes he can trust, only to have everything fall apart when this person takes away everything important to Guts for the purpose of fulfilling his own desires.",
    score: 9.4,
    scored_by: 323470,
    rank: 1,
    popularity: 2,
    status: "Publishing",
    genres: [
      { mal_id: 1, name: "Action" }, 
      { mal_id: 2, name: "Adventure" }, 
      { mal_id: 8, name: "Drama" }
    ],
    authors: [{ mal_id: 1868, name: "Miura, Kentarou" }],
    chapters: 364,
    volumes: 41,
    published: { string: "Aug 25, 1989 to ?" }
  },
  {
    mal_id: 2,
    title: "Vagabond",
    title_japanese: "バガボンド",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/259070.jpg" } },
    synopsis: "In 16th century Japan, Shinmen Takezou is a wild, rough young man, in both his appearance and his actions.",
    score: 9.2,
    scored_by: 157302,
    rank: 2,
    popularity: 4,
    status: "On Hiatus",
    genres: [
      { mal_id: 1, name: "Action" }, 
      { mal_id: 2, name: "Adventure" }, 
      { mal_id: 8, name: "Drama" }
    ],
    authors: [{ mal_id: 1867, name: "Inoue, Takehiko" }],
    chapters: 327,
    volumes: 37,
    published: { string: "Sep 3, 1998 to ?" }
  },
  {
    mal_id: 3,
    title: "One Piece",
    title_japanese: "ワンピース",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/2/253146.jpg" } },
    synopsis: "Gol D. Roger, a man referred to as the 'King of the Pirates,' is set to be executed by the World Government.",
    score: 9.1,
    scored_by: 258139,
    rank: 3,
    popularity: 1,
    status: "Publishing",
    genres: [
      { mal_id: 1, name: "Action" }, 
      { mal_id: 2, name: "Adventure" }, 
      { mal_id: 4, name: "Comedy" }
    ],
    authors: [{ mal_id: 1881, name: "Oda, Eiichiro" }],
    chapters: null,
    volumes: null,
    published: { string: "Jul 22, 1997 to ?" }
  }
];

export default function MangaBrowse() {
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedManga, setSelectedManga] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setMangaList(mockMangaData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMangaClick = (manga: any) => {
    setSelectedManga(manga);
    setIsPanelOpen(true);
  };

  const filteredManga = mangaList.filter(manga =>
    manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manga.title_japanese?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-display font-bold mb-4"
            style={{ color: 'var(--theme-text)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span style={{ color: 'var(--theme-primary)' }}>#</span> Browse Manga
          </motion.h1>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5" style={{ color: 'var(--theme-text-muted)' }} />
            <input
              type="text"
              placeholder="Search manga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--theme-card)',
                borderColor: 'var(--theme-accent)',
                color: 'var(--theme-text)',
                borderWidth: '1px'
              }}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="h-80 rounded-lg animate-pulse"
                style={{ backgroundColor: 'var(--theme-accent)' }}
              />
            ))}
          </div>
        )}

        {/* Manga Grid */}
        {!loading && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredManga.map((manga, index) => (
              <motion.div
                key={manga.mal_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleMangaClick(manga)}
              >
                <div className="relative rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={manga.images.jpg.large_image_url} 
                      alt={manga.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Score Badge */}
                    {manga.score && (
                      <div className="absolute top-2 right-2 flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-yellow-400 mr-1 fill-current" />
                        <span className="text-white text-xs font-bold">{manga.score.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {/* Rank Badge */}
                    {manga.rank && manga.rank <= 10 && (
                      <div className="absolute top-2 left-2 flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 px-2 py-1 rounded-full">
                        <TrendingUp className="h-3 w-3 text-white mr-1" />
                        <span className="text-white text-xs font-bold">#{manga.rank}</span>
                      </div>
                    )}
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                        {manga.title}
                      </h3>
                      <p className="text-gray-300 text-xs">
                        {manga.status} • {manga.chapters ? `${manga.chapters} chapters` : 'Ongoing'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && filteredManga.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: 'var(--theme-text-muted)' }}>No manga found matching your search.</p>
          </div>
        )}
      </div>

      {/* Manga Details Panel */}
      <MangaDetailsPanel 
        manga={selectedManga}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </Layout>
  );
}
