import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Media, getImageUrl } from '@/utils/api';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Play, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WatchlistButton from './WatchlistButton';

interface GenreRowProps {
  title: string;
  medias: Media[];
  isLoading?: boolean;
}

const GenreRow: React.FC<GenreRowProps> = ({ title, medias, isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="mb-4">
          <div className="h-6 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-700 rounded aspect-video"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!medias.length) return null;

  return (
    <div className="py-4 group">
      <h2 className="text-xl font-semibold mb-4 text-white px-4 md:px-12">{title}</h2>
      
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 px-4 md:px-12">
            {medias.map((media, index) => {
              const posterUrl = getImageUrl(media.poster_path, 'w500');
              const backdropUrl = getImageUrl(media.backdrop_path, 'w780');
              const title = media.title || media.name || 'Unknown Title';
              const mediaType = media.media_type || (media.first_air_date ? 'tv' : 'movie');
              
              return (
                <CarouselItem key={`${media.id}-${index}`} className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                  <div className="group/item relative">
                    <div 
                      className="relative aspect-video rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
                      onClick={() => navigate(`/details/${mediaType}/${media.id}`)}
                    >
                      <img
                        src={backdropUrl || posterUrl || ''}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Hover content */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 opacity-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 transition-all duration-300">
                        <h3 className="text-white text-sm font-medium line-clamp-1 mb-2">{title}</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/watch/${mediaType}/${media.id}`);
                              }}
                            >
                              <Play size={14} />
                            </Button>
                            
                            <WatchlistButton 
                              media={media} 
                              variant="icon" 
                              size={14}
                              className="h-8 w-8 bg-gray-800/80 hover:bg-gray-700/80"
                            />
                          </div>
                          
                          {media.vote_average > 0 && (
                            <span className="text-green-400 text-xs font-semibold">
                              {Math.round(media.vote_average * 10)}% Match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 border-none text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 border-none text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Carousel>
      </div>
    </div>
  );
};

export default GenreRow;