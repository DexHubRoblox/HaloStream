import { toast } from "@/components/ui/use-toast";
import { detectGenreFromQuery, genres } from './genres';

// TMDB API key
const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
const BASE_URL = "https://api.themoviedb.org/3";

// Types
export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MediaDetails extends Media {
  genres: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  tagline: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface SeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episodes: Episode[];
  poster_path: string;
  overview: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  runtime: number;
}

export interface SearchResults {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
}

// Generic fetch function with error handling
const fetchApi = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error("API fetch error:", error);
    toast({
      title: "Error",
      description: "Failed to fetch data. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

// Trending
export const getTrending = (timeWindow: "day" | "week" = "week", page: number = 1) => {
  return fetchApi<SearchResults>(`/trending/all/${timeWindow}?api_key=${API_KEY}&page=${page}`);
};

// Popular Movies
export const getPopularMovies = (page: number = 1) => {
  return fetchApi<SearchResults>(`/movie/popular?api_key=${API_KEY}&page=${page}`);
};

// Popular TV Shows
export const getPopularTVShows = (page: number = 1) => {
  return fetchApi<SearchResults>(`/tv/popular?api_key=${API_KEY}&page=${page}`);
};

// Top Rated Movies
export const getTopRatedMovies = (page: number = 1) => {
  return fetchApi<SearchResults>(`/movie/top_rated?api_key=${API_KEY}&page=${page}`);
};

// Top Rated TV Shows
export const getTopRatedTVShows = (page: number = 1) => {
  return fetchApi<SearchResults>(`/tv/top_rated?api_key=${API_KEY}&page=${page}`);
};

// Now Playing Movies
export const getNowPlayingMovies = (page: number = 1) => {
  return fetchApi<SearchResults>(`/movie/now_playing?api_key=${API_KEY}&page=${page}`);
};

// TV Shows Currently Airing
export const getOnAirTVShows = (page: number = 1) => {
  return fetchApi<SearchResults>(`/tv/on_the_air?api_key=${API_KEY}&page=${page}`);
};

// Get Media Details (Movie or TV Show)
export const getMediaDetails = (id: string, type: "movie" | "tv") => {
  return fetchApi<MediaDetails>(`/${type}/${id}?api_key=${API_KEY}`);
};

// Get Season Details
export const getSeasonDetails = (tvId: string, seasonNumber: number) => {
  return fetchApi<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
};

// Search
export const searchMedia = (query: string, page: number = 1) => {
  return fetchApi<SearchResults>(`/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
};
export const getRecentlyAdded = async (mediaType: 'movie' | 'tv' = 'movie', page: number = 1) => {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
  const dateString = thirtyDaysAgo.toISOString().split('T')[0];
  
  const endpoint = mediaType === 'movie' 
    ? `/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&release_date.gte=${dateString}&page=${page}`
    : `/discover/tv?api_key=${API_KEY}&sort_by=first_air_date.desc&first_air_date.gte=${dateString}&page=${page}`;
    
  return fetchApi<SearchResults>(endpoint);
};

// Advanced search with filters
export const advancedSearch = async (params: {
  query?: string;
  genre?: string;
  mediaType?: 'movie' | 'tv';
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
  ratingMax?: number;
  sortBy?: string;
  page?: number;
}) => {
  const {
    query,
    genre,
    mediaType,
    yearMin,
    yearMax,
    ratingMin,
    ratingMax,
    sortBy = 'popularity.desc',
    page = 1
  } = params;

  // If there's a search query, use search endpoint
  if (query) {
    const searchType = mediaType ? mediaType : 'multi';
    return fetchApi<SearchResults>(`/search/${searchType}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  }

  // Otherwise use discover endpoint with filters
  const discoverType = mediaType || 'movie';
  let endpoint = `/discover/${discoverType}?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}`;

  if (genre) {
    const genreObj = genres.find(g => g.name === genre);
    if (genreObj) {
      const genreId = discoverType === 'movie' ? genreObj.movieGenreId : genreObj.tvGenreId;
      endpoint += `&with_genres=${genreId}`;
    }
  }

  if (yearMin || yearMax) {
    const dateField = discoverType === 'movie' ? 'release_date' : 'first_air_date';
    if (yearMin) endpoint += `&${dateField}.gte=${yearMin}-01-01`;
    if (yearMax) endpoint += `&${dateField}.lte=${yearMax}-12-31`;
  }

  if (ratingMin !== undefined) endpoint += `&vote_average.gte=${ratingMin}`;
  if (ratingMax !== undefined) endpoint += `&vote_average.lte=${ratingMax}`;

  return fetchApi<SearchResults>(endpoint);
};

// Search by genre name
export const searchByGenreName = async (genreName: string, page: number = 1): Promise<SearchResults> => {
  // First try to detect genre from keywords
  const detectedGenre = detectGenreFromQuery(genreName);
  const searchGenreName = detectedGenre || genreName;
  
  // First, try to find matching genre
  const [movieGenres, tvGenres] = await Promise.all([
    getGenres('movie'),
    getGenres('tv')
  ]);
  
  const allGenres = [...movieGenres.genres, ...tvGenres.genres];
  const matchingGenre = allGenres.find(genre => 
    genre.name.toLowerCase().includes(searchGenreName.toLowerCase())
  );
  
  if (matchingGenre) {
    // Search for content with this genre
    const [movieResults, tvResults] = await Promise.all([
      fetchApi<SearchResults>(`/discover/movie?api_key=${API_KEY}&with_genres=${matchingGenre.id}&page=${page}`),
      fetchApi<SearchResults>(`/discover/tv?api_key=${API_KEY}&with_genres=${matchingGenre.id}&page=${page}`)
    ]);
    
    // For genre searches, we'll show movies first, then TV shows (12 total)
    const combinedResults = [...movieResults.results.slice(0, 6), ...tvResults.results.slice(0, 6)];
    
    return {
      page,
      results: combinedResults,
      total_pages: Math.max(movieResults.total_pages, tvResults.total_pages),
      total_results: movieResults.total_results + tvResults.total_results
    };
  }
  
  // Fallback to regular search
  return searchMedia(searchGenreName, page);
};
// Get image URL
export const getImageUrl = (path: string | null, size: "original" | "w500" | "w780" = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Get movie/TV genres
export const getGenres = async (type: "movie" | "tv") => {
  return fetchApi<{genres: Genre[]}>(`/genre/${type}/list?api_key=${API_KEY}`);
};

// Get recommendations
export const getRecommendations = (id: string, type: "movie" | "tv", page: number = 1) => {
  return fetchApi<SearchResults>(`/${type}/${id}/recommendations?api_key=${API_KEY}&page=${page}`);
};
