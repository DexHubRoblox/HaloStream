import { Media, getMediaDetails, searchMedia, getRecommendations } from './api';
import { getWatchHistory } from './watchHistory';
import { getUserRatings } from './userRatings';

// Get personalized recommendations based on watch history and ratings
export const getPersonalizedRecommendations = async (): Promise<{
  title: string;
  medias: Media[];
}[]> => {
  const watchHistory = getWatchHistory();
  const userRatings = getUserRatings();
  const recommendations: { title: string; medias: Media[] }[] = [];

  if (watchHistory.length === 0) {
    return [];
  }

  // Get "Because you watched X" recommendations
  const recentlyWatched = watchHistory.slice(0, 3);
  
  for (const item of recentlyWatched) {
    try {
      const mediaType = item.media.media_type || (item.media.first_air_date ? 'tv' : 'movie');
      const recs = await getRecommendations(item.media.id.toString(), mediaType);
      
      if (recs.results.length > 0) {
        recommendations.push({
          title: `Because you watched ${item.media.title || item.media.name}`,
          medias: recs.results.slice(0, 12)
        });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  }

  return recommendations;
};

// Get random movie/show picker
export const getRandomPick = async (): Promise<Media | null> => {
  try {
    // Get a random page between 1-10 and random index
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=71fdb081b0133511ac14ac0cc10fd307&page=${randomPage}&sort_by=popularity.desc`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      return data.results[randomIndex];
    }
  } catch (error) {
    console.error('Error fetching random pick:', error);
  }
  
  return null;
};

// Get recently viewed from watch history
export const getRecentlyViewed = (): Media[] => {
  const watchHistory = getWatchHistory();
  return watchHistory.slice(0, 12).map(item => item.media);
};