import { getPopularMovies, getPopularTVShows, Media } from './api';

export interface Genre {
  id: number;
  name: string;
  movieGenreId: number;
  tvGenreId: number;
}

// Popular genres with their TMDB IDs
export const genres: Genre[] = [
  { id: 1, name: 'Action', movieGenreId: 28, tvGenreId: 10759 },
  { id: 2, name: 'Comedy', movieGenreId: 35, tvGenreId: 35 },
  { id: 3, name: 'Horror', movieGenreId: 27, tvGenreId: 9648 },
  { id: 4, name: 'Drama', movieGenreId: 18, tvGenreId: 18 },
  { id: 5, name: 'Thriller', movieGenreId: 53, tvGenreId: 9648 },
  { id: 6, name: 'Romance', movieGenreId: 10749, tvGenreId: 10749 },
  { id: 7, name: 'Sci-Fi', movieGenreId: 878, tvGenreId: 10765 },
  { id: 8, name: 'Fantasy', movieGenreId: 14, tvGenreId: 10765 },
  { id: 9, name: 'Crime', movieGenreId: 80, tvGenreId: 80 },
  { id: 10, name: 'Animation', movieGenreId: 16, tvGenreId: 16 },
];

// Fetch media by genre
export const getMediaByGenre = async (genreId: number, type: 'movie' | 'tv' = 'movie'): Promise<Media[]> => {
  const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
  const BASE_URL = "https://api.themoviedb.org/3";
  
  try {
    const response = await fetch(
      `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results.slice(0, 20); // Limit to 20 items per genre
  } catch (error) {
    console.error(`Error fetching ${type} by genre:`, error);
    return [];
  }
};