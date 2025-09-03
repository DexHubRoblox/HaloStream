import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { genres, getMediaByGenre } from '@/utils/genres';
import { Media } from '@/utils/api';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import { Button } from '@/components/ui/button';

const Genres: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedGenreParam = queryParams.get('genre');
  
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    selectedGenreParam ? parseInt(selectedGenreParam) : null
  );
  const [genreMedia, setGenreMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'both'>('both');

  useEffect(() => {
    if (selectedGenre) {
      fetchGenreMedia(selectedGenre, mediaType);
    }
  }, [selectedGenre, mediaType]);

  const fetchGenreMedia = async (genreId: number, type: 'movie' | 'tv' | 'both') => {
    setLoading(true);
    try {
      const genre = genres.find(g => g.id === genreId);
      if (!genre) return;

      let allMedia: Media[] = [];

      if (type === 'both') {
        const [movies, tvShows] = await Promise.all([
          getMediaByGenre(genre.movieGenreId, 'movie'),
          getMediaByGenre(genre.tvGenreId, 'tv')
        ]);
        allMedia = [...movies, ...tvShows].sort(() => Math.random() - 0.5);
      } else {
        const genreIdToUse = type === 'movie' ? genre.movieGenreId : genre.tvGenreId;
        allMedia = await getMediaByGenre(genreIdToUse, type);
      }

      setGenreMedia(allMedia);
    } catch (error) {
      console.error('Error fetching genre media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenre(genreId);
    navigate(`/genres?genre=${genreId}`);
  };

  const handleMediaTypeChange = (type: 'movie' | 'tv' | 'both') => {
    setMediaType(type);
  };

  const selectedGenreData = genres.find(g => g.id === selectedGenre);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black animate-fade-in text-white">Browse by Genre</h1>
          <p className="text-white/70 mt-2 animate-fade-in animate-delay-100">
            Discover movies and TV shows by your favorite genres
          </p>
        </div>

        {/* Genre Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.id ? "default" : "outline"}
              className={`h-12 text-sm font-medium transition-all ${
                selectedGenre === genre.id 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-600'
              }`}
              onClick={() => handleGenreSelect(genre.id)}
            >
              {genre.name}
            </Button>
          ))}
        </div>

        {/* Media Type Filter */}
        {selectedGenre && (
          <div className="flex gap-2 mb-6">
            <Button
              variant={mediaType === 'both' ? "default" : "outline"}
              size="sm"
              className={mediaType === 'both' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600 text-white'}
              onClick={() => handleMediaTypeChange('both')}
            >
              All
            </Button>
            <Button
              variant={mediaType === 'movie' ? "default" : "outline"}
              size="sm"
              className={mediaType === 'movie' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600 text-white'}
              onClick={() => handleMediaTypeChange('movie')}
            >
              Movies
            </Button>
            <Button
              variant={mediaType === 'tv' ? "default" : "outline"}
              size="sm"
              className={mediaType === 'tv' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600 text-white'}
              onClick={() => handleMediaTypeChange('tv')}
            >
              TV Shows
            </Button>
          </div>
        )}

        {/* Selected Genre Content */}
        {selectedGenre && selectedGenreData ? (
          <MediaGrid
            title={`${selectedGenreData.name} ${
              mediaType === 'movie' ? 'Movies' : 
              mediaType === 'tv' ? 'TV Shows' : 
              'Movies & TV Shows'
            }`}
            medias={genreMedia}
            isLoading={loading}
          />
        ) : (
          <div className="text-center py-12 text-white/50">
            <h2 className="text-xl font-medium mb-2">Select a genre to get started</h2>
            <p>Choose from the genres above to discover amazing content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Genres;