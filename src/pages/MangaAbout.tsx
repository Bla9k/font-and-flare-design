
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Book, Heart, Star, Users, Globe, BookOpen } from 'lucide-react';

export default function MangaAbout() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-6xl font-display font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-anime-cyberpunk-blue">[</span>
              About Manga
              <span className="text-anime-cyberpunk-blue">]</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover the rich world of Japanese comics and graphic storytelling
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-anime-gray/40 border border-anime-light-gray/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Book className="h-6 w-6 text-anime-cyberpunk-blue mr-3" />
                  <h2 className="text-2xl font-display font-bold">What is Manga?</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Manga (漫画) are comics or graphic novels originating from Japan. They are typically published 
                  in black and white, though some are in color. Manga stories cover a wide variety of genres 
                  and demographics, from action-packed adventures to slice-of-life stories.
                </p>
              </div>

              <div className="bg-anime-gray/40 border border-anime-light-gray/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Globe className="h-6 w-6 text-anime-red mr-3" />
                  <h2 className="text-2xl font-display font-bold">Global Impact</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Manga has become a global phenomenon, influencing art, storytelling, and pop culture 
                  worldwide. Many popular anime series are adapted from manga, creating multimedia 
                  franchises that span generations.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-anime-gray/40 border border-anime-light-gray/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-anime-cyberpunk-blue mr-3" />
                  <h2 className="text-2xl font-display font-bold">Demographics</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shonen (Boys)</span>
                    <span className="text-anime-cyberpunk-blue">Action, Adventure</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shoujo (Girls)</span>
                    <span className="text-anime-red">Romance, Drama</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Seinen (Men)</span>
                    <span className="text-anime-cyberpunk-blue">Mature Themes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Josei (Women)</span>
                    <span className="text-anime-red">Realistic Romance</span>
                  </div>
                </div>
              </div>

              <div className="bg-anime-gray/40 border border-anime-light-gray/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-6 w-6 text-anime-red mr-3" />
                  <h2 className="text-2xl font-display font-bold">Reading Style</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Traditional manga is read from right to left, top to bottom - the opposite of Western comics. 
                  This unique reading flow is part of the authentic manga experience and helps preserve the 
                  artist's original vision.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: Book, label: 'Series Available', value: '10,000+' },
              { icon: Heart, label: 'Genres', value: '50+' },
              { icon: Star, label: 'Top Rated', value: '9.5/10' },
              { icon: Users, label: 'Active Readers', value: '1M+' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-anime-gray/40 border border-anime-light-gray/30 rounded-lg p-4 text-center"
              >
                <stat.icon className="h-8 w-8 text-anime-cyberpunk-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Japanese Typography */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <div className="text-6xl md:text-8xl font-jp text-anime-red/20 mb-4">
              漫画
            </div>
            <p className="text-gray-400 italic">
              "The art of storytelling through sequential art"
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
