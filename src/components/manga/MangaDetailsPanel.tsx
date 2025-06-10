
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Book, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MangaDetailsPanelProps {
  manga: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function MangaDetailsPanel({ manga, isOpen, onClose }: MangaDetailsPanelProps) {
  if (!manga) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Details Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full md:w-96 z-50 overflow-y-auto"
            style={{ backgroundColor: 'var(--theme-card)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold" style={{ color: 'var(--theme-text)' }}>
                  Manga Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-opacity-20"
                  style={{ color: 'var(--theme-text-muted)' }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cover Image */}
              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                <img 
                  src={manga.images?.jpg?.large_image_url} 
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Score Badge */}
                {manga.score && (
                  <div className="absolute top-3 right-3 flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    <span className="text-white text-sm font-bold">{manga.score.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Title and Japanese Title */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--theme-text)' }}>
                  {manga.title}
                </h3>
                {manga.title_japanese && (
                  <p className="text-sm font-jp" style={{ color: 'var(--theme-text-muted)' }}>
                    {manga.title_japanese}
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {manga.chapters && (
                  <div className="flex items-center space-x-2">
                    <Book className="h-4 w-4" style={{ color: 'var(--theme-primary)' }} />
                    <div>
                      <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Chapters</div>
                      <div className="font-semibold" style={{ color: 'var(--theme-text)' }}>{manga.chapters}</div>
                    </div>
                  </div>
                )}
                
                {manga.volumes && (
                  <div className="flex items-center space-x-2">
                    <Book className="h-4 w-4" style={{ color: 'var(--theme-primary)' }} />
                    <div>
                      <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Volumes</div>
                      <div className="font-semibold" style={{ color: 'var(--theme-text)' }}>{manga.volumes}</div>
                    </div>
                  </div>
                )}
                
                {manga.published?.string && (
                  <div className="flex items-center space-x-2 col-span-2">
                    <Calendar className="h-4 w-4" style={{ color: 'var(--theme-primary)' }} />
                    <div>
                      <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Published</div>
                      <div className="font-semibold text-xs" style={{ color: 'var(--theme-text)' }}>{manga.published.string}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Authors */}
              {manga.authors?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 mr-2" style={{ color: 'var(--theme-primary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Authors</span>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                    {manga.authors.map((author: any) => author.name).join(', ')}
                  </div>
                </div>
              )}

              {/* Genres */}
              {manga.genres?.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Genres</div>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map((genre: any) => (
                      <span 
                        key={genre.mal_id}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: 'var(--theme-accent)',
                          color: 'var(--theme-text)'
                        }}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="mb-6">
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Status</div>
                <span 
                  className="px-3 py-1 text-xs rounded-full font-medium"
                  style={{ 
                    backgroundColor: 'var(--theme-primary)',
                    color: 'var(--theme-background)'
                  }}
                >
                  {manga.status}
                </span>
              </div>

              {/* Synopsis */}
              {manga.synopsis && (
                <div className="mb-6">
                  <div className="text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Synopsis</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                    {manga.synopsis}
                  </p>
                </div>
              )}

              {/* Rankings */}
              <div className="grid grid-cols-2 gap-4">
                {manga.rank && (
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--theme-accent)' }}>
                    <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Rank</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--theme-primary)' }}>#{manga.rank}</div>
                  </div>
                )}
                
                {manga.popularity && (
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--theme-accent)' }}>
                    <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Popularity</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--theme-primary)' }}>#{manga.popularity}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
