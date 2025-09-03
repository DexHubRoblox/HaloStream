import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { genres, getMediaByGenre } from '@/utils/genres';
import { Media } from '@/utils/api';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Genres: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedGenreParam = queryParams.get('genre');
  const pageFromUrl = parseInt(queryParams.get('page') || '1', 10);
  
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    selectedGenreParam ? parseInt(selectedGenreParam) : null
  );
  const [genreMedia, setGenreMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'both'>('both');
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (pageFromUrl !== page) {
      setPage(pageFromUrl);
    }
  }, [pageFromUrl]);

  useEffect(() => {
    if (selectedGenre) {
      fetchGenreMedia(selectedGenre, mediaType, page);
    }
  }, [selectedGenre, mediaType, page]);

  const fetchGenreMedia = async (genreId: number, type: 'movie' | 'tv' | 'both', currentPage: number = 1) => {
    setLoading(true);
    try {
      const genre = genres.find(g => g.id === genreId);
      if (!genre) return;

      const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
      const BASE_URL = "https://api.themoviedb.org/3";
      
      let allMedia: Media[] = [];
      let totalPagesCount = 1;

      if (type === 'both') {
        // For 'both', we'll mix movies and TV shows (6 each for 12 total)
        const movieResponse = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre.movieGenreId}&sort_by=popularity.desc&page=${currentPage}`
        );
        const tvResponse = await fetch(
          `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genre.tvGenreId}&sort_by=popularity.desc&page=${currentPage}`
        );
        
        const [movieData, tvData] = await Promise.all([
          movieResponse.json(),
          tvResponse.json()
        ]);
        
        // Mix movies and TV shows (6 each for 12 total)
        const movies = movieData.results.slice(0, 6);
        const tvShows = tvData.results.slice(0, 6);
        allMedia = [...movies, ...tvShows].sort(() => Math.random() - 0.5).slice(0, 12);
        totalPagesCount = Math.max(movieData.total_pages, tvData.total_pages);
      } else {
        const genreIdToUse = type === 'movie' ? genre.movieGenreId : genre.tvGenreId;
        const response = await fetch(
          `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreIdToUse}&sort_by=popularity.desc&page=${currentPage}`
        );
        const data = await response.json();
        allMedia = data.results;
        totalPagesCount = Math.min(data.total_pages, 20); // Limit to 20 pages max
      }

      setGenreMedia(allMedia);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error('Error fetching genre media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenre(genreId);
    setPage(1);
    navigate(`/genres?genre=${genreId}&page=1`);
  };

  const handleMediaTypeChange = (type: 'movie' | 'tv' | 'both') => {
    setMediaType(type);
    setPage(1);
    if (selectedGenre) {
      navigate(`/genres?genre=${selectedGenre}&page=1`);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (selectedGenre) {
      navigate(`/genres?genre=${selectedGenre}&page=${newPage}`);
    }
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
        
        {/* Pagination */}
        {selectedGenre && totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                </PaginationItem>
              )}
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = page <= 3 
                  ? i + 1 
                  : page >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : page - 2 + i;
                
                if (pageNumber <= totalPages && pageNumber > 0) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        isActive={pageNumber === page} 
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Genres;