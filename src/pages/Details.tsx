
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MediaDetails, getMediaDetails, getImageUrl, getRecommendations, Media } from '@/utils/api';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import TrailerModal from '@/components/TrailerModal';
import RatingModal from '@/components/RatingModal';
import CastSection from '@/components/CastSection';
import { getSoundtrackInfo, getAwardsInfo, SoundtrackInfo, Awards } from '@/utils/soundtrack';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Clock, Star, Video, ThumbsUp, Share, Music, Award } from 'lucide-react';
import Loader from '@/components/Loader';
import WatchlistButton from '@/components/WatchlistButton';
import { getUserRating } from '@/utils/userRatings';
import { shareMedia } from '@/utils/sharing';

const Details: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [recommendations, setRecommendations] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [soundtrack, setSoundtrack] = useState<SoundtrackInfo[]>([]);
  const [awards, setAwards] = useState<Awards | null>(null);
  const [showSoundtrack, setShowSoundtrack] = useState(false);
  const [showAwards, setShowAwards] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!type || !id) return;
    
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [detailsData, recommendationsData] = await Promise.all([
          getMediaDetails(id, type as 'movie' | 'tv'),
          getRecommendations(id, type as 'movie' | 'tv')
        ]);
        
        setDetails(detailsData);
        setRecommendations(recommendationsData.results.slice(0, 12));
        
        // Get user rating
        const rating = getUserRating(detailsData.id);
        setUserRating(rating?.rating || null);
        
        // Load additional data
        try {
          const [soundtrackData, awardsData] = await Promise.all([
            getSoundtrackInfo(detailsData.id, type as 'movie' | 'tv'),
            getAwardsInfo(detailsData.id, type as 'movie' | 'tv')
          ]);
          setSoundtrack(soundtrackData);
          setAwards(awardsData);
        } catch (error) {
          console.error('Error loading additional data:', error);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchDetails();
  }, [type, id]);

  const handleWatch = () => {
    if (type && id) {
      navigate(`/watch/${type}/${id}`);
    }
  };

  const handleShare = async () => {
    if (details) {
      await shareMedia(mediaForWatchlist);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex justify-center items-center h-[70vh]">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Details not found</h1>
          <Button 
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(details.backdrop_path, 'original');
  const posterUrl = getImageUrl(details.poster_path, 'w500');
  const title = details.title || details.name || '';
  const year = details.release_date || details.first_air_date 
    ? new Date(details.release_date || details.first_air_date || '').getFullYear() 
    : '';
  
  const runtime = details.runtime 
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` 
    : details.episode_run_time && details.episode_run_time.length > 0 
      ? `${Math.floor(details.episode_run_time[0] / 60)}h ${details.episode_run_time[0] % 60}m` 
      : 'N/A';
  
  const rating = details.vote_average ? Math.round(details.vote_average * 10) : 'N/A';
  
  // Create a Media object from the details for the watchlist
  const mediaForWatchlist: Media = {
    id: details.id,
    title: details.title || '',
    name: details.name || '',
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    release_date: details.release_date || '',
    first_air_date: details.first_air_date || '',
    vote_average: details.vote_average,
    media_type: type as 'movie' | 'tv',
    overview: details.overview,
    genre_ids: details.genres.map(genre => genre.id)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Backdrop */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-background z-10"></div>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover object-center animate-blur-in"
          />
        )}
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-72 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Poster */}
          <div className="hidden md:block">
            <div className="rounded-lg overflow-hidden poster-shadow animate-fade-in">
              {posterUrl ? (
                <img 
                  src={posterUrl} 
                  alt={title} 
                  className="w-full object-cover"
                />
              ) : (
                <div className="bg-halo-200 aspect-[2/3] flex items-center justify-center">
                  <span className="text-halo-500">No image available</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Details */}
          <div className="md:col-span-2 text-white md:text-left text-center animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-bold text-shadow-lg mb-2">
              {title}
            </h1>
            
            {details.tagline && (
              <p className="text-lg italic text-white/80 mb-4">{details.tagline}</p>
            )}
            
            {/* Mobile Poster (shows only on mobile) */}
            <div className="md:hidden mx-auto max-w-[250px] mb-6">
              <div className="rounded-lg overflow-hidden poster-shadow">
                {posterUrl ? (
                  <img 
                    src={posterUrl} 
                    alt={title} 
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="bg-halo-200 aspect-[2/3] flex items-center justify-center">
                    <span className="text-halo-500">No image available</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-6">
              {year && (
                <div className="flex items-center text-white/80">
                  <Calendar size={16} className="mr-1" />
                  <span>{year}</span>
                </div>
              )}
              
              <div className="flex items-center text-white/80">
                <Clock size={16} className="mr-1" />
                <span>{runtime}</span>
              </div>
              
              <div className="flex items-center text-white/80">
                <Star size={16} className="mr-1 text-yellow-400" />
                <span>{rating}%</span>
              </div>
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {details.genres.map(genre => (
                <span 
                  key={genre.id} 
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-white/80 leading-relaxed">
                {details.overview || 'No overview available.'}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button 
                onClick={handleWatch} 
                size="lg" 
                className="rounded-full bg-white text-black hover:bg-white/90 transition-all px-8"
              >
                <Play size={18} className="mr-2" /> Watch Now
              </Button>
              
              <Button 
                onClick={() => setTrailerModalOpen(true)}
                variant="outline"
                size="lg" 
                className="rounded-full border-gray-400 bg-gray-600/50 backdrop-blur-sm hover:bg-gray-600/70 transition-all px-8"
              >
                <Video size={18} className="mr-2" /> Trailer
              </Button>
              
              <Button 
                onClick={() => setRatingModalOpen(true)}
                variant="outline"
                size="lg" 
                className="rounded-full border-gray-400 bg-gray-600/50 backdrop-blur-sm hover:bg-gray-600/70 transition-all px-8"
              >
                <ThumbsUp size={18} className="mr-2" /> 
                {userRating ? `Rated ${userRating}/10` : 'Rate'}
              </Button>
              
              <WatchlistButton 
                media={mediaForWatchlist} 
                variant="button" 
                size={18}
              />
              
              <Button 
                onClick={handleShare}
                variant="outline"
                size="lg" 
                className="rounded-full border-gray-400 bg-gray-600/50 backdrop-blur-sm hover:bg-gray-600/70 transition-all px-8"
              >
                <Share size={18} className="mr-2" /> 
                Share
              </Button>
              
              {soundtrack.length > 0 && (
                <Button 
                  onClick={() => setShowSoundtrack(!showSoundtrack)}
                  variant="outline"
                  size="lg" 
                  className="rounded-full border-gray-400 bg-gray-600/50 backdrop-blur-sm hover:bg-gray-600/70 transition-all px-8"
                >
                  <Music size={18} className="mr-2" /> 
                  Soundtrack
                </Button>
              )}
              
              {awards && (awards.oscars.length > 0 || awards.emmys.length > 0 || awards.goldenGlobes.length > 0) && (
                <Button 
                  onClick={() => setShowAwards(!showAwards)}
                  variant="outline"
                  size="lg" 
                  className="rounded-full border-gray-400 bg-gray-600/50 backdrop-blur-sm hover:bg-gray-600/70 transition-all px-8"
                >
                  <Award size={18} className="mr-2" /> 
                  Awards
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Soundtrack Section */}
        {showSoundtrack && soundtrack.length > 0 && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <Music size={24} />
              Soundtrack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {soundtrack.map((track) => (
                <div key={track.id} className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-1">{track.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">by {track.artist}</p>
                  {track.album && (
                    <p className="text-gray-500 text-xs mb-3">{track.album}</p>
                  )}
                  <div className="flex gap-2">
                    {track.spotifyUrl && (
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-xs"
                      >
                        Spotify
                      </a>
                    )}
                    {track.youtubeUrl && (
                      <a
                        href={track.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Awards Section */}
        {showAwards && awards && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <Award size={24} />
              Awards & Recognition
            </h2>
            <div className="space-y-6">
              {awards.oscars.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Academy Awards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {awards.oscars.map((award, index) => (
                      <div key={index} className={`p-3 rounded-lg ${award.won ? 'bg-yellow-900/30' : 'bg-gray-800/50'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{award.category}</span>
                          <span className={`text-xs px-2 py-1 rounded ${award.won ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                            {award.won ? 'WON' : 'NOMINATED'}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{award.year}</div>
                        {award.nominee && (
                          <div className="text-gray-500 text-xs mt-1">{award.nominee}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {awards.goldenGlobes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Golden Globe Awards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {awards.goldenGlobes.map((award, index) => (
                      <div key={index} className={`p-3 rounded-lg ${award.won ? 'bg-amber-900/30' : 'bg-gray-800/50'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{award.category}</span>
                          <span className={`text-xs px-2 py-1 rounded ${award.won ? 'bg-amber-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                            {award.won ? 'WON' : 'NOMINATED'}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{award.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {awards.other.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Other Awards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {awards.other.map((award, index) => (
                      <div key={index} className={`p-3 rounded-lg ${award.won ? 'bg-blue-900/30' : 'bg-gray-800/50'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{award.category}</span>
                          <span className={`text-xs px-2 py-1 rounded ${award.won ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                            {award.won ? 'WON' : 'NOMINATED'}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{award.name} • {award.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Cast & Crew */}
        <CastSection mediaId={id!} mediaType={type as 'movie' | 'tv'} />
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16 pb-16">
            <MediaGrid 
              title="You May Also Like" 
              medias={recommendations} 
            />
          </div>
        )}
      </div>
      
      {/* Modals */}
      <TrailerModal 
        media={mediaForWatchlist}
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
      />
      
      <RatingModal 
        media={mediaForWatchlist}
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
      />
    </div>
  );
};

export default Details;
