import React, { useEffect, useState } from 'react';
import { genres, getMediaByGenre } from '@/utils/genres';
import { Media } from '@/utils/api';
import GenreRow from './GenreRow';

const GenreBrowser: React.FC = () => {
  const [genreData, setGenreData] = useState<{ [key: number]: Media[] }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchGenreData = async () => {
      // Fetch data for the first few genres initially
      const priorityGenres = genres.slice(0, 6);
      
      for (const genre of priorityGenres) {
        setLoading(prev => ({ ...prev, [genre.id]: true }));
        
        try {
          // Mix movies and TV shows for each genre
          const [movies, tvShows] = await Promise.all([
            getMediaByGenre(genre.movieGenreId, 'movie'),
            getMediaByGenre(genre.tvGenreId, 'tv')
          ]);
          
          // Combine and shuffle movies and TV shows
          const combined = [...movies.slice(0, 10), ...tvShows.slice(0, 10)]
            .sort(() => Math.random() - 0.5)
            .slice(0, 15);
          
          setGenreData(prev => ({ ...prev, [genre.id]: combined }));
        } catch (error) {
          console.error(`Error fetching data for genre ${genre.name}:`, error);
        } finally {
          setLoading(prev => ({ ...prev, [genre.id]: false }));
        }
      }
    };

    fetchGenreData();
  }, []);

  return (
    <div className="space-y-8">
      {genres.slice(0, 6).map((genre) => (
        <GenreRow
          key={genre.id}
          title={genre.name}
          medias={genreData[genre.id] || []}
          isLoading={loading[genre.id]}
        />
      ))}
    </div>
  );
};

export default GenreBrowser;