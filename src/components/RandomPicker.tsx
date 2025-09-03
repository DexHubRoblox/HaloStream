import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomPick } from '@/utils/recommendations';
import { Media, getImageUrl } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Shuffle, Play, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const RandomPicker: React.FC = () => {
  const [randomMedia, setRandomMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRandomPick = async () => {
    setIsLoading(true);
    try {
      const media = await getRandomPick();
      if (media) {
        setRandomMedia(media);
      } else {
        toast({
          title: "No random pick found",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error getting random pick:', error);
      toast({
        title: "Error",
        description: "Failed to get random pick.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatch = () => {
    if (randomMedia) {
      const mediaType = randomMedia.media_type || (randomMedia.first_air_date ? 'tv' : 'movie');
      navigate(`/watch/${mediaType}/${randomMedia.id}`);
    }
  };

  const handleDetails = () => {
    if (randomMedia) {
      const mediaType = randomMedia.media_type || (randomMedia.first_air_date ? 'tv' : 'movie');
      navigate(`/details/${mediaType}/${randomMedia.id}`);
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Can't Decide What to Watch?</h2>
        <Button
          onClick={handleRandomPick}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold"
        >
          <Shuffle size={20} className="mr-2" />
          {isLoading ? 'Finding...' : 'Pick Something Random'}
        </Button>
      </div>

      {randomMedia && (
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-lg overflow-hidden animate-fade-in">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={getImageUrl(randomMedia.poster_path, 'w500') || ''}
                alt={randomMedia.title || randomMedia.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {randomMedia.title || randomMedia.name}
              </h3>
              <div className="flex items-center gap-4 mb-4 text-sm text-white/70">
                <span>
                  {randomMedia.release_date || randomMedia.first_air_date 
                    ? new Date(randomMedia.release_date || randomMedia.first_air_date || '').getFullYear()
                    : 'N/A'}
                </span>
                {randomMedia.vote_average > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    {Math.round(randomMedia.vote_average * 10)}%
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm mb-6 line-clamp-3">
                {randomMedia.overview || 'No description available.'}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleWatch}
                  className="bg-white text-black hover:bg-white/90 flex-1"
                >
                  <Play size={16} className="mr-2" />
                  Watch Now
                </Button>
                <Button
                  onClick={handleDetails}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700 flex-1"
                >
                  <Info size={16} className="mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomPicker;