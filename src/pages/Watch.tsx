import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMediaDetails, MediaDetails, getSeasonDetails, Episode } from '@/utils/api';
import { Provider, getDefaultProvider, providers } from '@/utils/providers';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  ChevronDown
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from '@/components/Loader';

const Watch: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [provider, setProvider] = useState<Provider>(getDefaultProvider());
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!type || !id) return;
    
    const fetchMediaDetails = async () => {
      setLoading(true);
      try {
        const mediaData = await getMediaDetails(id, type as 'movie' | 'tv');
        setMedia(mediaData);
        
        if (type === 'tv') {
          const seasonData = await getSeasonDetails(id, selectedSeason);
          setEpisodes(seasonData.episodes);
        }
      } catch (error) {
        console.error('Error fetching media details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [type, id, selectedSeason]);

  // Auto-enter fullscreen on load
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFullscreen();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      setShowControls(true);
      
      if (isFullscreen) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    resetControlsTimeout();

    const handleMouseMove = () => {
      resetControlsTimeout();
    };

    if (isFullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFullscreen]);

  const handleFullscreen = async () => {
    if (!playerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleBackToDetails = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate(`/details/${type}/${id}`);
  };

  const handleSeasonChange = (value: string) => {
    const season = parseInt(value);
    setSelectedSeason(season);
    setSelectedEpisode(1);
  };

  const handleEpisodeChange = (value: string) => {
    setSelectedEpisode(parseInt(value));
  };

  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider);
    setShowProviderMenu(false);
  };

  const getWatchUrl = () => {
    if (!media) return '';
    
    if (type === 'movie') {
      return provider.movieUrl.replace('{tmdb_id}', id || '');
    } else {
      return provider.tvUrl
        .replace('{tmdb_id}', id || '')
        .replace('{season_number}', selectedSeason.toString())
        .replace('{episode_number}', selectedEpisode.toString());
    }
  };

  const watchUrl = getWatchUrl();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Media not found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const title = media.title || media.name || '';
  const totalSeasons = media.number_of_seasons || 0;
  const currentEpisode = episodes.find(ep => ep.episode_number === selectedEpisode);

  return (
    <div 
      ref={playerRef}
      className={`relative w-full h-screen bg-black overflow-hidden ${isFullscreen ? 'cursor-none' : ''}`}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Video Player */}
      <iframe
        ref={iframeRef}
        src={watchUrl}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        title={title}
      />

      {/* Netflix-style Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ pointerEvents: showControls ? 'auto' : 'none' }}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToDetails}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft size={24} />
            </Button>
            
            <div className="text-white">
              <h1 className="text-xl font-semibold">
                {title}
                {type === 'tv' && currentEpisode && (
                  <span className="text-white/80 ml-2">
                    S{selectedSeason}:E{selectedEpisode} - {currentEpisode.name}
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Provider Selector */}
          <DropdownMenu open={showProviderMenu} onOpenChange={setShowProviderMenu}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/20 rounded-lg">
                {provider.name.replace(' ⭐', '')}
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-black/90 border-white/20">
              {providers.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onClick={() => handleProviderChange(p)}
                  className="text-white hover:bg-white/20 cursor-pointer"
                >
                  {p.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:bg-white/20 rounded-full w-16 h-16"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* TV Show Episode/Season Selectors */}
          {type === 'tv' && (
            <div className="flex gap-4 mb-4">
              <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
                <SelectTrigger className="w-32 bg-black/50 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
                    <SelectItem key={season} value={season.toString()} className="text-white hover:bg-white/20">
                      Season {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedEpisode.toString()} onValueChange={handleEpisodeChange}>
                <SelectTrigger className="w-32 bg-black/50 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {episodes.map((episode) => (
                    <SelectItem key={episode.id} value={episode.episode_number.toString()} className="text-white hover:bg-white/20">
                      Episode {episode.episode_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Main Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <SkipBack size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <SkipForward size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Settings size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                className="text-white hover:bg-white/20 rounded-full"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;