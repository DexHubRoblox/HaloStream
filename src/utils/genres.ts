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

// Genre keyword mapping for smart search
export const genreKeywords: { [key: string]: string } = {
  // Horror keywords
  'scary': 'Horror',
  'frightening': 'Horror',
  'terrifying': 'Horror',
  'spooky': 'Horror',
  'creepy': 'Horror',
  'haunted': 'Horror',
  'ghost': 'Horror',
  'zombie': 'Horror',
  'monster': 'Horror',
  'supernatural': 'Horror',
  'paranormal': 'Horror',
  
  // Comedy keywords
  'funny': 'Comedy',
  'hilarious': 'Comedy',
  'humorous': 'Comedy',
  'laugh': 'Comedy',
  'laughing': 'Comedy',
  'jokes': 'Comedy',
  'comic': 'Comedy',
  'comedic': 'Comedy',
  'amusing': 'Comedy',
  'entertaining': 'Comedy',
  
  // Action keywords
  'action': 'Action',
  'fight': 'Action',
  'fighting': 'Action',
  'battle': 'Action',
  'war': 'Action',
  'explosive': 'Action',
  'adventure': 'Action',
  'adrenaline': 'Action',
  'intense': 'Action',
  'thrilling': 'Action',
  'fast-paced': 'Action',
  'martial arts': 'Action',
  'superhero': 'Action',
  
  // Romance keywords
  'romantic': 'Romance',
  'love': 'Romance',
  'dating': 'Romance',
  'relationship': 'Romance',
  'couples': 'Romance',
  'wedding': 'Romance',
  'valentine': 'Romance',
  'heartwarming': 'Romance',
  'passionate': 'Romance',
  
  // Drama keywords
  'dramatic': 'Drama',
  'emotional': 'Drama',
  'serious': 'Drama',
  'deep': 'Drama',
  'meaningful': 'Drama',
  'touching': 'Drama',
  'powerful': 'Drama',
  'inspiring': 'Drama',
  
  // Thriller keywords
  'suspense': 'Thriller',
  'suspenseful': 'Thriller',
  'mystery': 'Thriller',
  'mysterious': 'Thriller',
  'psychological': 'Thriller',
  'tension': 'Thriller',
  'edge': 'Thriller',
  
  // Sci-Fi keywords
  'science fiction': 'Sci-Fi',
  'sci-fi': 'Sci-Fi',
  'scifi': 'Sci-Fi',
  'futuristic': 'Sci-Fi',
  'space': 'Sci-Fi',
  'alien': 'Sci-Fi',
  'aliens': 'Sci-Fi',
  'robot': 'Sci-Fi',
  'robots': 'Sci-Fi',
  'technology': 'Sci-Fi',
  'cyberpunk': 'Sci-Fi',
  'dystopian': 'Sci-Fi',
  
  // Fantasy keywords
  'magic': 'Fantasy',
  'magical': 'Fantasy',
  'wizard': 'Fantasy',
  'wizards': 'Fantasy',
  'dragon': 'Fantasy',
  'dragons': 'Fantasy',
  'medieval': 'Fantasy',
  'mythical': 'Fantasy',
  'fairy tale': 'Fantasy',
  'fairytale': 'Fantasy',
  'enchanted': 'Fantasy',
  
  // Crime keywords
  'criminal': 'Crime',
  'detective': 'Crime',
  'police': 'Crime',
  'investigation': 'Crime',
  'murder': 'Crime',
  'heist': 'Crime',
  'gangster': 'Crime',
  'mafia': 'Crime',
  'noir': 'Crime',
  
  // Animation keywords
  'animated': 'Animation',
  'cartoon': 'Animation',
  'anime': 'Animation',
  'kids': 'Animation',
  'family': 'Animation',
  'pixar': 'Animation',
  'disney': 'Animation',
};

// Function to detect genre from search query
export const detectGenreFromQuery = (query: string): string | null => {
  const lowerQuery = query.toLowerCase().trim();
  
  // Check for exact genre name matches first
  const exactMatch = genres.find(genre => 
    genre.name.toLowerCase() === lowerQuery
  );
  if (exactMatch) return exactMatch.name;
  
  // Check for keyword matches
  for (const [keyword, genreName] of Object.entries(genreKeywords)) {
    if (lowerQuery.includes(keyword.toLowerCase())) {
      return genreName;
    }
  }
  
  // Check for partial genre name matches
  const partialMatch = genres.find(genre => 
    genre.name.toLowerCase().includes(lowerQuery) || 
    lowerQuery.includes(genre.name.toLowerCase())
  );
  if (partialMatch) return partialMatch.name;
  
  return null;
};

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