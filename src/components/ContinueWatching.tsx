import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContinueWatching, WatchHistoryItem, WATCH_HISTORY_UPDATED_EVENT } from '@/utils/watchHistory';
import { getImageUrl } from '@/utils/api';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContinueWatching: React.FC = () => {
  const [continueWatching, setContinueWatching] = useState<WatchHistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const updateContinueWatching = () => {
      setContinueWatching(getContinueWatching());
    };

    updateContinueWatching();
    window.addEventListener(WATCH_HISTORY_UPDATED_EVENT, updateContinueWatching);
    
    return () => {
      window.removeEventListener(WATCH_HISTORY_UPDATED_EVENT, updateContinueWatching);
    };
  }, []);

  if (continueWatching.length === 0) {
    return null;
  }

  const handleContinueWatching = (item: WatchHistoryItem) => {
    const mediaType = item.media.media_type || (item.media.first_air_date ? 'tv' : 'movie');
    navigate(`/watch/${mediaType}/${item.media.id}?t=${item.currentTime}`);
  };

  const handleViewDetails = (item: WatchHistoryItem) => {
    const mediaType = item.media.media_type || (item.media.first_air_date ? 'tv' : 'movie');
    navigate(`/details/${mediaType}/${item.media.id}`);
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-white px-4 md:px-12">Continue Watching</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4 px-4 md:px-12">
          {continueWatching.map((item) => {
            const backdropUrl = getImageUrl(item.media.backdrop_path, 'w780');
            const title = item.media.title || item.media.name || 'Unknown Title';
            
            return (
              <CarouselItem key={item.media.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div className="group relative">
                  <div 
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => handleViewDetails(item)}
                  >
                    {backdropUrl ? (
                      <img
                        src={backdropUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                      <div 
                        className="h-full bg-red-600 transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-white text-sm font-medium line-clamp-1 mb-2">{title}</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-white/80">
                          <Clock size={12} />
                          <span>{item.progress}% watched</span>
                        </div>
                        
                        <Button
                          size="sm"
                          className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinueWatching(item);
                          }}
                        >
                          <Play size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        <CarouselPrevious className="left-2 md:left-6 bg-black/50 border-none text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
        <CarouselNext className="right-2 md:right-6 bg-black/50 border-none text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Carousel>
    </div>
  );
};

export default ContinueWatching;