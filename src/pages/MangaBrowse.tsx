
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MangaDetailsPanel from "@/components/manga/MangaDetailsPanel";
import PersonaCard from "@/components/effects/PersonaCard";
import PersonaButton from "@/components/effects/PersonaButton";
import GlitchText from "@/components/effects/GlitchText";
import ParticleSystem from "@/components/effects/ParticleSystem";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, TrendingUp, Filter, Grid, List, Eye, Shield, Zap } from "lucide-react";

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
    published: { string: "Aug 25, 1989 to ?" },
    arcana: "death"
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
    published: { string: "Sep 3, 1998 to ?" },
    arcana: "hermit"
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
    published: { string: "Jul 22, 1997 to ?" },
    arcana: "fool"
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
    published: { string: "Sep 9, 2009 - Apr 9, 2021" },
    arcana: "tower"
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
    published: { string: "Feb 15, 2016 - May 18, 2020" },
    arcana: "strength"
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
    published: { string: "Mar 5, 2018 to ?" },
    arcana: "devil"
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
    published: { string: "Dec 3, 2018 to ?" },
    arcana: "chariot"
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
    published: { string: "Jul 7, 2014 to ?" },
    arcana: "sun"
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
    published: { string: "Sep 8, 2011 - Sep 18, 2014" },
    arcana: "hanged"
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
    published: { string: "Dec 1, 2003 - May 15, 2006" },
    arcana: "judgement"
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
    published: { string: "Sep 21, 1999 - Nov 10, 2014" },
    arcana: "magician"
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
    published: { string: "Jul 12, 2001 - Jun 11, 2010" },
    arcana: "world"
  }
];

export default function MangaBrowse() {
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedManga, setSelectedManga] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      <div className="relative overflow-hidden">
        {/* Particle Background */}
        <div className="fixed inset-0 z-0">
          <ParticleSystem 
            particleCount={80}
            colors={['#FFD700', '#FF4500', '#8A2BE2', '#4B0082']}
            speed={0.5}
            size={3}
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Enhanced Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <h1 className="text-5xl font-persona-title font-bold mb-2 persona-text-glow">
                <GlitchText intensity={0.05}>
                  Manga Compendium
                </GlitchText>
              </h1>
              <p className="text-lg font-persona-ui" style={{ color: 'var(--theme-text-muted)' }}>
                Discover the Arcana of Stories
              </p>
            </motion.div>
            
            {/* Enhanced Search and Filter Controls */}
            <motion.div 
              className="flex flex-col lg:flex-row gap-4 items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
                <input
                  type="text"
                  placeholder="Search the void..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none font-persona-ui glass-morphism"
                  style={{
                    borderColor: 'var(--theme-primary)',
                    color: 'var(--theme-text)',
                  }}
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <PersonaCard className="p-0" arcanaType="magician">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-lg bg-transparent border-none focus:outline-none font-persona-ui"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    <option value="rank" style={{ backgroundColor: 'var(--theme-card)' }}>By Rank</option>
                    <option value="score" style={{ backgroundColor: 'var(--theme-card)' }}>By Score</option>
                    <option value="popularity" style={{ backgroundColor: 'var(--theme-card)' }}>By Popularity</option>
                  </select>
                </PersonaCard>

                {/* View Mode Toggle */}
                <div className="flex rounded-lg overflow-hidden">
                  <PersonaButton
                    variant={viewMode === 'grid' ? 'primary' : 'arcana'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid size={16} />
                  </PersonaButton>
                  <PersonaButton
                    variant={viewMode === 'list' ? 'primary' : 'arcana'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List size={16} />
                  </PersonaButton>
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-sm mt-4 text-center font-persona-ui" 
              style={{ color: 'var(--theme-text-muted)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <GlitchText intensity={0.02}>
                {filteredAndSortedManga.length.toString()} tomes discovered
              </GlitchText>
            </motion.p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                : 'grid-cols-1'
            } gap-6`}>
              {[...Array(12)].map((_, i) => (
                <PersonaCard key={i} className="h-80 animate-pulse" arcanaType="fool">
                  <div className="h-full w-full bg-gradient-to-b from-transparent to-black/50" />
                </PersonaCard>
              ))}
            </div>
          )}

          {/* Manga Grid/List */}
          {!loading && (
            <motion.div
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {filteredAndSortedManga.map((manga, index) => (
                <motion.div
                  key={manga.mal_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMangaClick(manga)}
                  className="cursor-pointer"
                >
                  <PersonaCard
                    className="hover-arcana transform-3d"
                    arcanaType={manga.arcana || 'fool'}
                    hover3D={viewMode === 'grid'}
                  >
                    <div className={`relative ${viewMode === 'grid' ? 'aspect-[3/4]' : 'aspect-[4/3] sm:aspect-[16/9]'} overflow-hidden rounded-lg`}>
                      <img 
                        src={manga.images.jpg.large_image_url} 
                        alt={manga.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      
                      {/* Mystical Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                      
                      {/* Score Badge */}
                      {manga.score && (
                        <motion.div 
                          className="absolute top-3 right-3 flex items-center px-3 py-1 rounded-full glass-morphism"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          <span className="text-white text-sm font-bold font-persona-ui">{manga.score.toFixed(1)}</span>
                        </motion.div>
                      )}
                      
                      {/* Rank Badge */}
                      {manga.rank && manga.rank <= 10 && (
                        <motion.div 
                          className="absolute top-3 left-3 flex items-center px-3 py-1 rounded-full"
                          style={{ background: 'linear-gradient(135deg, #FFD700, #FF4500)' }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <TrendingUp className="h-4 w-4 text-black mr-1" />
                          <span className="text-black text-sm font-bold font-persona-ui">#{manga.rank}</span>
                        </motion.div>
                      )}
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold font-persona-title text-lg mb-2 line-clamp-2 persona-text-glow">
                          {manga.title}
                        </h3>
                        <p className="text-gray-300 text-sm font-persona-ui mb-2">
                          {manga.title_japanese}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs font-persona-ui">
                            {manga.status} • {manga.chapters ? `${manga.chapters} chapters` : 'Ongoing'}
                          </span>
                          {/* Arcana Indicator */}
                          <div className="flex items-center gap-1">
                            {manga.arcana === 'death' && <Zap size={12} style={{ color: '#8B0000' }} />}
                            {manga.arcana === 'strength' && <Shield size={12} style={{ color: '#32CD32' }} />}
                            {manga.arcana === 'hermit' && <Eye size={12} style={{ color: '#8B4513' }} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </PersonaCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Results */}
          {!loading && filteredAndSortedManga.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <PersonaCard className="max-w-md mx-auto p-8" arcanaType="hanged">
                <div className="text-6xl mb-4">🌙</div>
                <h3 className="text-xl font-persona-title mb-2" style={{ color: 'var(--theme-primary)' }}>
                  The Void Echoes Empty
                </h3>
                <p className="font-persona-ui" style={{ color: 'var(--theme-text-muted)' }}>
                  No manga found in this realm. Try a different incantation.
                </p>
              </PersonaCard>
            </motion.div>
          )}
        </div>

        {/* Enhanced Manga Details Panel */}
        <MangaDetailsPanel 
          manga={selectedManga}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
        />
      </div>
    </Layout>
  );
}
