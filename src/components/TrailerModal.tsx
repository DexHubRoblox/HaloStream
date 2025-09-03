import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getTrailers, getYouTubeEmbedUrl, TrailerVideo } from '@/utils/trailers';
import { Media } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import Loader from './Loader';

interface TrailerModalProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ media, isOpen, onClose }) => {
  const [trailers, setTrailers] = useState<TrailerVideo[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<TrailerVideo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (media && isOpen) {
      setLoading(true);
      const mediaType = media.media_type || (media.first_air_date ? 'tv' : 'movie');
      
      getTrailers(media.id, mediaType)
        .then(trailerData => {
          setTrailers(trailerData);
          if (trailerData.length > 0) {
            setSelectedTrailer(trailerData[0]);
          }
        })
        .catch(error => {
          console.error('Error loading trailers:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [media, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedTrailer(null);
      setTrailers([]);
    }
  }, [isOpen]);

  if (!media) return null;

  const title = media.title || media.name || 'Unknown Title';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[90vh] bg-black border-gray-800 p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between p-6 pb-0">
            <span>{title} - Trailers</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X size={20} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Main trailer player */}
          <div className="flex-1 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="large" />
            </div>
          ) : trailers.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <Play size={48} className="mx-auto mb-4 opacity-50" />
              <p>No trailers available for this title</p>
              selectedTrailer && (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedTrailer.key)}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title={selectedTrailer.name}
                  />
                </div>
              )
              )}
          </div>
          
          {/* Trailer selection sidebar */}
          {trailers.length > 0 && (
            <div className="w-80 border-l border-gray-800 bg-gray-900/50">
              <div className="p-4 border-b border-gray-800">
                    </p>
                  </div>
                )}
              </div>
              
              {/* Trailer list - Right side */}
              <div className="w-80 border-l border-gray-800 bg-gray-900/50">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-white font-medium">Available Trailers ({trailers.length})</h3>
                </div>
                
                <div className="overflow-y-auto h-full pb-20">
                  <div className="p-2 space-y-2">
                    {trailers.map((trailer) => (
                      <button
                        key={trailer.id}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedTrailer?.id === trailer.id 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                        onClick={() => setSelectedTrailer(trailer)}
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-sm line-clamp-2">{trailer.name}</div>
                          <div className="text-xs opacity-70">
                            {trailer.type} • {trailer.official ? 'Official' : 'Fan Made'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;