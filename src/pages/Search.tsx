
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchMedia, searchByGenreName, advancedSearch, Media } from '@/utils/api';
import { genres, detectGenreFromQuery } from '@/utils/genres';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  const genre = queryParams.get('genre') || '';
  const mediaType = queryParams.get('type') as 'movie' | 'tv' | undefined;
  const yearMin = queryParams.get('year_min') ? parseInt(queryParams.get('year_min')!) : undefined;
  const yearMax = queryParams.get('year_max') ? parseInt(queryParams.get('year_max')!) : undefined;
  const ratingMin = queryParams.get('rating_min') ? parseFloat(queryParams.get('rating_min')!) : undefined;
  const ratingMax = queryParams.get('rating_max') ? parseFloat(queryParams.get('rating_max')!) : undefined;
  const sortBy = queryParams.get('sort') || 'popularity.desc';
  const pageFromUrl = parseInt(queryParams.get('page') || '1', 10);
  
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenreSearch, setIsGenreSearch] = useState(false);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (pageFromUrl !== page) {
      setPage(pageFromUrl);
    }
  }, [pageFromUrl]);

  useEffect(() => {
    // Check if this is an advanced search
    const hasAdvancedParams = genre || mediaType || yearMin || yearMax || ratingMin || ratingMax || sortBy !== 'popularity.desc';
    setIsAdvancedSearch(hasAdvancedParams);
    
    if (query || hasAdvancedParams) {
      setLoading(true);
      
      if (hasAdvancedParams) {
        // Use advanced search
        advancedSearch({
          query,
          genre,
          mediaType,
          yearMin,
          yearMax,
          ratingMin,
          ratingMax,
          sortBy,
          page
        })
        .then(data => {
          setResults(data.results);
          setTotalPages(Math.min(data.total_pages, 20));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error in advanced search:', error);
          setLoading(false);
        });
      } else {
        // Check if query matches a genre name or keyword
        const detectedGenre = detectGenreFromQuery(query);
        const matchingGenre = detectedGenre ? 
          genres.find(genre => genre.name === detectedGenre) : 
          genres.find(genre => 
            genre.name.toLowerCase() === query.toLowerCase() ||
            genre.name.toLowerCase().includes(query.toLowerCase())
          );
        
        if (matchingGenre) {
          setIsGenreSearch(true);
          searchByGenreName(query, page)
            .then(data => {
              setResults(data.results);
              setTotalPages(Math.min(data.total_pages, 20));
              setLoading(false);
            })
            .catch(error => {
              console.error('Error searching by genre:', error);
              setLoading(false);
            });
        } else {
          setIsGenreSearch(false);
          searchMedia(query, page)
            .then(data => {
              setResults(data.results);
              setTotalPages(Math.min(data.total_pages, 20));
              setLoading(false);
            })
            .catch(error => {
              console.error('Error searching:', error);
              setLoading(false);
            });
        }
      }
    } else {
      setResults([]);
      setTotalPages(1);
      setLoading(false);
    }
  }, [query, genre, mediaType, yearMin, yearMax, ratingMin, ratingMax, sortBy, page]);

  const getSearchDescription = () => {
    if (!query && !isAdvancedSearch) return 'Enter a search term';
    
    let description = '';
    if (query) {
      description = isGenreSearch ? `Genre results for "${query}"` : `Results for "${query}"`;
    } else {
      description = 'Advanced search results';
    }
    
    const filters = [];
    if (genre && genre !== 'all-genres') filters.push(`Genre: ${genre}`);
    if (mediaType && mediaType !== 'all-types') filters.push(`Type: ${mediaType === 'movie' ? 'Movies' : 'TV Shows'}`);
    if (yearMin || yearMax) {
      if (yearMin && yearMax) filters.push(`Year: ${yearMin}-${yearMax}`);
      else if (yearMin) filters.push(`Year: ${yearMin}+`);
      else if (yearMax) filters.push(`Year: up to ${yearMax}`);
    }
    if (ratingMin || ratingMax) {
      if (ratingMin && ratingMax) filters.push(`Rating: ${ratingMin}-${ratingMax}`);
      else if (ratingMin) filters.push(`Rating: ${ratingMin}+`);
      else if (ratingMax) filters.push(`Rating: up to ${ratingMax}`);
    }
    
    if (filters.length > 0) {
      description += ` (${filters.join(', ')})`;
    }
    
    return description;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black animate-fade-in text-white">Search Results</h1>
          <p className="text-white/70 mt-2 animate-fade-in animate-delay-100">
            {getSearchDescription()}
          </p>
          
          {isAdvancedSearch && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/search')}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <Filter size={16} className="mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="large" />
          </div>
        ) : (
          <MediaGrid
            title={
              results.length === 0 
                ? "No results found" 
                : `${results.length} results found`
            }
            medias={results}
          />
        )}
        
        {/* Pagination */}
        {results.length > 0 && totalPages > 1 && (
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

export default Search;
