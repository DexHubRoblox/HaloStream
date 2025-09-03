import { Media } from './api';

export interface SeasonalCollection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  keywords: string[];
  genreIds: number[];
  isActive: boolean; // Based on current date
}

export const seasonalCollections: SeasonalCollection[] = [
  {
    id: 'christmas',
    name: 'Christmas Movies',
    description: 'Festive films to get you in the holiday spirit',
    icon: '🎄',
    color: 'bg-red-600',
    keywords: ['christmas', 'holiday', 'santa', 'xmas'],
    genreIds: [35, 10751], // Comedy, Family
    isActive: false
  },
  {
    id: 'halloween',
    name: 'Halloween Horror',
    description: 'Spine-chilling movies for the spooky season',
    icon: '🎃',
    color: 'bg-orange-600',
    keywords: ['halloween', 'horror', 'scary', 'ghost'],
    genreIds: [27], // Horror
    isActive: false
  },
  {
    id: 'summer',
    name: 'Summer Blockbusters',
    description: 'Action-packed movies perfect for summer nights',
    icon: '☀️',
    color: 'bg-yellow-500',
    keywords: ['summer', 'beach', 'vacation'],
    genreIds: [28, 12], // Action, Adventure
    isActive: false
  },
  {
    id: 'valentines',
    name: 'Valentine\'s Romance',
    description: 'Love stories for the most romantic day of the year',
    icon: '💕',
    color: 'bg-pink-600',
    keywords: ['valentine', 'love', 'romance'],
    genreIds: [10749], // Romance
    isActive: false
  }
];

// Check which seasonal collections are currently active
export const getActiveSeasonalCollections = (): SeasonalCollection[] => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  return seasonalCollections.map(collection => {
    let isActive = false;
    
    switch (collection.id) {
      case 'christmas':
        isActive = month === 12 || (month === 1 && day <= 7); // December and early January
        break;
      case 'halloween':
        isActive = month === 10; // October
        break;
      case 'summer':
        isActive = month >= 6 && month <= 8; // June-August
        break;
      case 'valentines':
        isActive = month === 2 && day <= 14; // February up to Valentine's Day
        break;
    }
    
    return { ...collection, isActive };
  }).filter(collection => collection.isActive);
};

// Fetch seasonal media
export const getSeasonalMedia = async (collection: SeasonalCollection): Promise<Media[]> => {
  const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
  const BASE_URL = "https://api.themoviedb.org/3";
  
  try {
    // First try to search by keywords
    const keywordResults = await Promise.all(
      collection.keywords.map(async (keyword) => {
        const response = await fetch(
          `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(keyword)}&sort_by=popularity.desc`
        );
        const data = await response.json();
        return data.results || [];
      })
    );
    
    // Flatten and deduplicate results
    const allResults = keywordResults.flat();
    const uniqueResults = allResults.filter((movie, index, self) => 
      index === self.findIndex(m => m.id === movie.id)
    );
    
    // If we have enough results from keywords, return them
    if (uniqueResults.length >= 8) {
      return uniqueResults.slice(0, 12);
    }
    
    // Otherwise, supplement with genre-based results
    const genreResponse = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${collection.genreIds.join(',')}&sort_by=popularity.desc&page=1`
    );
    const genreData = await genreResponse.json();
    
    // Combine and deduplicate
    const combined = [...uniqueResults, ...(genreData.results || [])];
    const final = combined.filter((movie, index, self) => 
      index === self.findIndex(m => m.id === movie.id)
    );
    
    return final.slice(0, 12);
  } catch (error) {
    console.error('Error fetching seasonal media:', error);
    return [];
  }
};