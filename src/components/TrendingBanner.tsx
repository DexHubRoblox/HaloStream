import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrending, Media, getImageUrl } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Play, Info, TrendingUp } from 'lucide-react';

const TrendingBanner: React.FC = () => {
  const [trendingMedia, setTrendingMedia] = useState<Media[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrending('week');
        const withBackdrops = data.results.filter(item => item.backdrop_path);
        setTrendingMedia(withBackdrops.slice(0, 5));
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (trendingMedia.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % trendingMedia.length);
      }, 8000); // Change every 8 seconds

      return () => clearInterval(interval);
    }
  }, [trendingMedia.length]);

  if (loading || trendingMedia.length === 0) {
    return (
      <div className="relative w-full h-[50vh] bg-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50">Loading trending content...</div>
        </div>
      </div>
    );
  }

  const currentMedia = trendingMedia[currentIndex];
  const backdropUrl = getImageUrl(currentMedia.backdrop_path, 'original');
  const title = currentMedia.title || currentMedia.name || '';
  const mediaType = currentMedia.media_type || (currentMedia.first_air_date ? 'tv' : 'movie');

  const handleWatch = () => {
    navigate(`/watch/${mediaType}/${currentMedia.id}`);
  };

  const handleDetails = () => {
    navigate(`/details/${mediaType}/${currentMedia.id}`);
  };

  return (
    <div className="relative w-full h-[50vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover object-center transition-opacity duration-1000"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Trending Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <TrendingUp size={16} />
                Trending This Week
              </div>
              <div className="text-white/70 text-sm">
                #{currentIndex + 1} of {trendingMedia.length}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              {title}
            </h1>

            <p className="text-lg text-white/90 mb-6 line-clamp-3 leading-relaxed">
              {currentMedia.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleWatch}
                size="lg"
                className="bg-white text-black hover:bg-white/90 px-8"
              >
                <Play size={20} className="mr-2 fill-current" />
                Watch Now
              </Button>

              <Button
                onClick={handleDetails}
                variant="outline"
                size="lg"
                className="border-gray-400 bg-gray-600/50 backdrop-blur-sm hover:bg-gray-600/70 px-8"
              >
                <Info size={20} className="mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {trendingMedia.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex gap-2">
            {trendingMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingBanner;