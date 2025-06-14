
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MangaDetailsPanel from "@/components/manga/MangaDetailsPanel";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, TrendingUp, Filter } from "lucide-react";

// Expanded mock manga data with more entries
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
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }, { mal_id: 8, name: "Drama" }],
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
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }, { mal_id: 8, name: "Drama" }],
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
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }, { mal_id: 4, name: "Comedy" }],
    authors: [{ mal_id: 1881, name: "Oda, Eiichiro" }],
    chapters: null,
    volumes: null,
    published: { string: "Jul 22, 1997 to ?" }
  },
  {
    mal_id: 4,
    title: "Attack on Titan",
    title_japanese: "進撃の巨人",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/2/37846.jpg" } },
    synopsis: "Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.",
    score: 8.9,
    scored_by: 289456,
    rank: 4,
    popularity: 3,
    status: "Finished",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 8, name: "Drama" }, { mal_id: 41, name: "Supernatural" }],
    authors: [{ mal_id: 11705, name: "Isayama, Hajime" }],
    chapters: 139,
    volumes: 34,
    published: { string: "Sep 9, 2009 - Apr 9, 2021" }
  },
  {
    mal_id: 5,
    title: "Demon Slayer",
    title_japanese: "鬼滅の刃",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/3/179023.jpg" } },
    synopsis: "Tanjiro sets out on a dangerous journey to find a way to return his sister to normal and destroy the demon who ruined his life.",
    score: 8.7,
    scored_by: 178923,
    rank: 5,
    popularity: 5,
    status: "Finished",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 27, name: "Shounen" }, { mal_id: 41, name: "Supernatural" }],
    authors: [{ mal_id: 39532, name: "Gotouge, Koyoharu" }],
    chapters: 205,
    volumes: 23,
    published: { string: "Feb 15, 2016 - May 18, 2020" }
  },
  {
    mal_id: 6,
    title: "Jujutsu Kaisen",
    title_japanese: "呪術廻戦",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/3/210341.jpg" } },
    synopsis: "Yuji Itadori joins a secret organization of Jujutsu Sorcerers in order to kill a powerful Curse named Ryomen Sukuna.",
    score: 8.6,
    scored_by: 156789,
    rank: 6,
    popularity: 6,
    status: "Publishing",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 27, name: "Shounen" }, { mal_id: 41, name: "Supernatural" }],
    authors: [{ mal_id: 44909, name: "Akutami, Gege" }],
    chapters: null,
    volumes: null,
    published: { string: "Mar 5, 2018 to ?" }
  },
  {
    mal_id: 7,
    title: "Chainsaw Man",
    title_japanese: "チェンソーマン",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/3/216464.jpg" } },
    synopsis: "Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes.",
    score: 8.8,
    scored_by: 234567,
    rank: 7,
    popularity: 7,
    status: "Publishing",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 8, name: "Drama" }, { mal_id: 27, name: "Shounen" }],
    authors: [{ mal_id: 42104, name: "Fujimoto, Tatsuki" }],
    chapters: null,
    volumes: null,
    published: { string: "Dec 3, 2018 to ?" }
  },
  {
    mal_id: 8,
    title: "My Hero Academia",
    title_japanese: "僕のヒーローアカデミア",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/2/117419.jpg" } },
    synopsis: "Izuku Midoriya wants to be a hero more than anything, but he hasn't got an ounce of power in him.",
    score: 8.5,
    scored_by: 145678,
    rank: 8,
    popularity: 8,
    status: "Publishing",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 27, name: "Shounen" }, { mal_id: 31, name: "Super Power" }],
    authors: [{ mal_id: 15843, name: "Horikoshi, Kouhei" }],
    chapters: null,
    volumes: null,
    published: { string: "Jul 7, 2014 to ?" }
  },
  {
    mal_id: 9,
    title: "Tokyo Ghoul",
    title_japanese: "東京喰種",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/3/179520.jpg" } },
    synopsis: "Ken Kaneki is a bookworm college student who meets a girl who shares his taste in books at a coffee shop.",
    score: 8.4,
    scored_by: 298456,
    rank: 9,
    popularity: 9,
    status: "Finished",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 8, name: "Drama" }, { mal_id: 41, name: "Supernatural" }],
    authors: [{ mal_id: 34403, name: "Ishida, Sui" }],
    chapters: 144,
    volumes: 14,
    published: { string: "Sep 8, 2011 - Sep 18, 2014" }
  },
  {
    mal_id: 10,
    title: "Death Note",
    title_japanese: "デスノート",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/258245.jpg" } },
    synopsis: "Light Yagami is a brilliant student who discovers a supernatural notebook that can kill anyone whose name is written in it.",
    score: 8.7,
    scored_by: 456789,
    rank: 10,
    popularity: 10,
    status: "Finished",
    genres: [{ mal_id: 8, name: "Drama" }, { meta_id: 41, name: "Supernatural" }, { mal_id: 7, name: "Mystery" }],
    authors: [{ mal_id: 1872, name: "Ohba, Tsugumi" }, { mal_id: 1871, name: "Obata, Takeshi" }],
    chapters: 108,
    volumes: 12,
    published: { string: "Dec 1, 2003 - May 15, 2006" }
  },
  {
    mal_id: 11,
    title: "Naruto",
    title_japanese: "ナルト",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/3/249658.jpg" } },
    synopsis: "Naruto Uzumaki wants to be the best ninja in the land. He's done well so far, but with the looming danger posed by the mysterious Akatsuki organization.",
    score: 8.3,
    scored_by: 567890,
    rank: 11,
    popularity: 11,
    status: "Finished",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }, { mal_id: 27, name: "Shounen" }],
    authors: [{ mal_id: 1879, name: "Kishimoto, Masashi" }],
    chapters: 700,
    volumes: 72,
    published: { string: "Sep 21, 1999 - Nov 10, 2014" }
  },
  {
    mal_id: 12,
    title: "Fullmetal Alchemist",
    title_japanese: "鋼の錬金術師",
    images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/3/243675.jpg" } },
    synopsis: "Alchemy tore the Elric brothers' bodies apart. Now Edward is the youngest State Alchemist in the history of the country.",
    score: 9.0,
    scored_by: 387654,
    rank: 12,
    popularity: 12,
    status: "Finished",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }, { mal_id: 8, name: "Drama" }],
    authors: [{ mal_id: 1874, name: "Arakawa, Hiromu" }],
    chapters: 109,
    volumes: 27,
    published: { string: "Jul 12, 2001 - Jun 11, 2010" }
  }
];

export default function MangaBrowse() {
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedManga, setSelectedManga] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");

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

  const filteredAndSortedManga = mangaList
    .filter(manga =>
      manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manga.title_japanese?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return (b.score || 0) - (a.score || 0);
        case "popularity":
          return (a.popularity || 999) - (b.popularity || 999);
        case "rank":
        default:
          return (a.rank || 999) - (b.rank || 999);
      }
    });

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
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
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
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" style={{ color: 'var(--theme-text-muted)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--theme-card)',
                  borderColor: 'var(--theme-accent)',
                  color: 'var(--theme-text)',
                  borderWidth: '1px'
                }}
              >
                <option value="rank">By Rank</option>
                <option value="score">By Score</option>
                <option value="popularity">By Popularity</option>
              </select>
            </div>
          </div>
          
          <p className="text-sm mt-2" style={{ color: 'var(--theme-text-muted)' }}>
            Showing {filteredAndSortedManga.length} manga
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(12)].map((_, i) => (
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
            {filteredAndSortedManga.map((manga, index) => (
              <motion.div
                key={manga.mal_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
        {!loading && filteredAndSortedManga.length === 0 && (
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
