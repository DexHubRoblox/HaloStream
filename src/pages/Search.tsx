
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchMedia, searchByGenreName, Media } from '@/utils/api';
import { genres, detectGenreFromQuery } from '@/utils/genres';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import Loader from '@/components/Loader';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  const pageFromUrl = parseInt(queryParams.get('page') || '1', 10);
  
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenreSearch, setIsGenreSearch] = useState(false);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (pageFromUrl !== page) {
      setPage(pageFromUrl);
    }
  }, [pageFromUrl]);

  useEffect(() => {
    if (query) {
      setLoading(true);
      
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
            setTotalPages(Math.min(data.total_pages, 20)); // Limit to 20 pages max
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
            setTotalPages(Math.min(data.total_pages, 20)); // Limit to 20 pages max
            setLoading(false);
          })
          .catch(error => {
            console.error('Error searching:', error);
            setLoading(false);
          });
      }
    } else {
      setResults([]);
      setTotalPages(1);
      setLoading(false);
    }
  }, [query, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    navigate(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black animate-fade-in text-white">Search Results</h1>
          <p className="text-white/70 mt-2 animate-fade-in animate-delay-100">
            {query ? `${isGenreSearch ? 'Genre results' : 'Results'} for "${query}"` : 'Enter a search term'}
          </p>
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
                : isGenreSearch 
                  ? `${results.length} movies and shows in this genre`
                  : `${results.length} search results`
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
