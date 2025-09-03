import { Media } from './api';

const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
const BASE_URL = "https://api.themoviedb.org/3";

export interface TrailerVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

// Get trailers for a media item
export const getTrailers = async (mediaId: number, mediaType: 'movie' | 'tv'): Promise<TrailerVideo[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${mediaId}/videos?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter for YouTube trailers and teasers
    return data.results
      .filter((video: any) => 
        video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser') &&
        video.key
      )
      .map((video: any) => ({
        id: video.id,
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
        official: video.official || false
      }))
      .sort((a: TrailerVideo, b: TrailerVideo) => {
        // Prioritize official trailers
        if (a.official && !b.official) return -1;
        if (!a.official && b.official) return 1;
        // Then prioritize trailers over teasers
        if (a.type === 'Trailer' && b.type === 'Teaser') return -1;
        if (a.type === 'Teaser' && b.type === 'Trailer') return 1;
        return 0;
      });
  } catch (error) {
    console.error('Error fetching trailers:', error);
    return [];
  }
};

// Get YouTube embed URL
export const getYouTubeEmbedUrl = (videoKey: string): string => {
  return `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`;
};

// Get YouTube thumbnail URL
export const getYouTubeThumbnail = (videoKey: string): string => {
  return `https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`;
};