import { getWatchHistory, WatchHistoryItem } from './watchHistory';
import { getUserRatings } from './userRatings';
import { getWatchlist } from './watchlist';

export interface UserStatistics {
  totalWatchTime: number; // in minutes
  totalMoviesWatched: number;
  totalTVShowsWatched: number;
  totalEpisodesWatched: number;
  averageRating: number;
  favoriteGenres: { genre: string; count: number }[];
  watchingStreak: number; // days
  mostWatchedYear: number;
  completionRate: number; // percentage of started content that was finished
  watchlistSize: number;
  topRatedContent: { title: string; rating: number; type: string }[];
}

// Genre mapping for statistics
const genreMap: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export const getUserStatistics = (): UserStatistics => {
  const watchHistory = getWatchHistory();
  const userRatings = getUserRatings();
  const watchlist = getWatchlist();

  // Calculate total watch time
  const totalWatchTime = watchHistory.reduce((total, item) => {
    return total + (item.duration * (item.progress / 100));
  }, 0) / 60; // Convert to minutes

  // Count movies vs TV shows
  const movieCount = watchHistory.filter(item => 
    !item.media.first_air_date || item.media.media_type === 'movie'
  ).length;
  
  const tvShowCount = watchHistory.filter(item => 
    item.media.first_air_date && item.media.media_type === 'tv'
  ).length;

  // Estimate episodes watched (rough calculation)
  const episodesWatched = watchHistory.filter(item => 
    item.media.first_air_date && item.media.media_type === 'tv'
  ).length * 3; // Assume average 3 episodes per TV show entry

  // Calculate average rating
  const averageRating = userRatings.length > 0 
    ? userRatings.reduce((sum, rating) => sum + rating.rating, 0) / userRatings.length
    : 0;

  // Calculate favorite genres
  const genreCounts: { [key: string]: number } = {};
  watchHistory.forEach(item => {
    item.media.genre_ids?.forEach(genreId => {
      const genreName = genreMap[genreId] || 'Unknown';
      genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
    });
  });

  const favoriteGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate watching streak (simplified)
  const watchingStreak = calculateWatchingStreak(watchHistory);

  // Find most watched year
  const yearCounts: { [key: number]: number } = {};
  watchHistory.forEach(item => {
    const year = new Date(item.media.release_date || item.media.first_air_date || '').getFullYear();
    if (year && !isNaN(year)) {
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }
  });

  const mostWatchedYear = Object.entries(yearCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] 
    ? parseInt(Object.entries(yearCounts).sort(([,a], [,b]) => b - a)[0][0])
    : new Date().getFullYear();

  // Calculate completion rate
  const completedItems = watchHistory.filter(item => item.completed).length;
  const completionRate = watchHistory.length > 0 
    ? (completedItems / watchHistory.length) * 100 
    : 0;

  // Get top rated content
  const topRatedContent = userRatings
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(rating => {
      const historyItem = watchHistory.find(h => h.media.id === rating.mediaId);
      return {
        title: historyItem?.media.title || historyItem?.media.name || 'Unknown',
        rating: rating.rating,
        type: historyItem?.media.media_type || 'movie'
      };
    });

  return {
    totalWatchTime: Math.round(totalWatchTime),
    totalMoviesWatched: movieCount,
    totalTVShowsWatched: tvShowCount,
    totalEpisodesWatched: episodesWatched,
    averageRating: Math.round(averageRating * 10) / 10,
    favoriteGenres,
    watchingStreak,
    mostWatchedYear,
    completionRate: Math.round(completionRate),
    watchlistSize: watchlist.length,
    topRatedContent
  };
};

// Calculate watching streak in days
const calculateWatchingStreak = (watchHistory: WatchHistoryItem[]): number => {
  if (watchHistory.length === 0) return 0;

  const sortedHistory = watchHistory
    .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const item of sortedHistory) {
    const watchDate = new Date(item.watchedAt);
    watchDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((currentDate.getTime() - watchDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
};

// Format watch time for display
export const formatWatchTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  } else if (minutes < 1440) { // Less than 24 hours
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
};