
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Anime } from "@/api/jikan";
import { toast } from "@/components/ui/use-toast";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Anime[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from localStorage or a backend API
    const mockFavorites: Anime[] = [];
    setFavorites(mockFavorites);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-8">Your Favorites</h1>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Favorites would be displayed here */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="border border-anime-light-gray bg-anime-gray rounded-md p-12 max-w-lg">
              <h2 className="font-display font-bold text-xl mb-4">No favorites yet</h2>
              <p className="text-gray-400 mb-6">
                Start exploring and add your favorite anime titles to your collection.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
