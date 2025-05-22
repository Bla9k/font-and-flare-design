
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GachaBanner } from '@/types/anime';
import { Calendar, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchRealSeriesData, createBanners } from '@/api/gachaService';

export default function EventBanners() {
  const [banners, setBanners] = useState<GachaBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventBanners = async () => {
      try {
        const seriesData = await fetchRealSeriesData();
        const allBanners = createBanners(seriesData);
        // Only display limited time banners, not standard ones
        const limitedBanners = allBanners.filter(banner => 
          banner.bannerType !== 'standard'
        );
        setBanners(limitedBanners);
      } catch (error) {
        console.error("Error fetching event banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventBanners();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-4 py-4">
        <div className="flex items-center gap-3 px-4">
          <div className="h-0.5 w-12 bg-anime-cyberpunk-blue"></div>
          <span className="font-digital text-sm text-anime-cyberpunk-blue">LIMITED EVENTS</span>
        </div>
        <div className="animate-pulse flex space-x-4 overflow-x-auto px-4">
          {[1, 2].map((i) => (
            <div 
              key={i}
              className="min-w-[280px] h-40 bg-anime-gray rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center gap-3 px-4 mb-3">
        <div className="h-0.5 w-12 bg-anime-red"></div>
        <span className="font-digital text-sm text-anime-red">LIMITED TIME EVENTS</span>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto px-4 pb-2">
        {banners.map((banner) => (
          <Link to="/gacha" key={banner.id}>
            <motion.div 
              className={cn(
                "min-w-[280px] h-40 rounded-lg overflow-hidden relative",
                "border border-gray-700 shadow-lg",
                "flex flex-col justify-end"
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Banner image with gradient overlay */}
              <div className="absolute inset-0">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://i.imgur.com/bZISp9m.jpg";
                  }}
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t",
                  banner.colorScheme || "from-black to-transparent"
                )} />
              </div>
              
              {/* Limited tag */}
              <div className="absolute top-2 right-2">
                <div className="bg-anime-red text-white text-xs px-2 py-1 rounded-full font-bold flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  LIMITED
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-3 bg-black/50 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white">{banner.title}</h3>
                <p className="text-xs text-gray-200 line-clamp-1">{banner.description}</p>
                
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-yellow-300 flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-yellow-300" />
                    {banner.boost}x Rate Up
                  </div>
                  <div className="text-xs text-gray-200">Ends: {banner.endDate}</div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
