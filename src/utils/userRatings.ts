import { Media } from './api';

export const USER_RATINGS_UPDATED_EVENT = 'user-ratings-updated';

export interface UserRating {
  mediaId: number;
  rating: number; // 1-10
  review?: string;
  ratedAt: string;
}

export interface UserReview {
  id: string;
  mediaId: number;
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
  helpful: number;
}

// Notify components of rating changes
export const notifyRatingsUpdated = () => {
  window.dispatchEvent(new Event(USER_RATINGS_UPDATED_EVENT));
};

// Get user's ratings
export const getUserRatings = (): UserRating[] => {
  const ratings = localStorage.getItem('userRatings');
  return ratings ? JSON.parse(ratings) : [];
};

// Rate a media item
export const rateMedia = (mediaId: number, rating: number, review?: string): void => {
  const ratings = getUserRatings();
  const existingIndex = ratings.findIndex(r => r.mediaId === mediaId);
  
  const userRating: UserRating = {
    mediaId,
    rating,
    review,
    ratedAt: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    ratings[existingIndex] = userRating;
  } else {
    ratings.push(userRating);
  }
  
  localStorage.setItem('userRatings', JSON.stringify(ratings));
  notifyRatingsUpdated();
};

// Get user's rating for a specific media
export const getUserRating = (mediaId: number): UserRating | null => {
  const ratings = getUserRatings();
  return ratings.find(r => r.mediaId === mediaId) || null;
};

// Get mock reviews (in a real app, this would come from a backend)
export const getMediaReviews = (mediaId: number): UserReview[] => {
  // Mock reviews for demonstration
  const mockReviews: UserReview[] = [
    {
      id: '1',
      mediaId,
      userName: 'MovieBuff2024',
      rating: 8,
      review: 'Great cinematography and solid performances. Definitely worth watching!',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      helpful: 12
    },
    {
      id: '2',
      mediaId,
      userName: 'CinemaLover',
      rating: 7,
      review: 'Good story but pacing could be better. Still enjoyable overall.',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      helpful: 8
    }
  ];
  
  return mockReviews;
};

// Get recommended media based on user ratings
export const getRecommendedMedia = async (): Promise<Media[]> => {
  const ratings = getUserRatings();
  const highRatedGenres = new Map<number, number>();
  
  // Count genres from highly rated content (8+ rating)
  ratings
    .filter(r => r.rating >= 8)
    .forEach(rating => {
      // In a real app, you'd fetch the media details to get genres
      // For now, we'll return empty array
    });
  
  return [];
};