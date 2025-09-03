import { Media } from './api';

const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
const BASE_URL = "https://api.themoviedb.org/3";

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  also_known_as: string[];
}

export interface PersonCredits {
  cast: Media[];
  crew: Media[];
}

// Get cast and crew for a movie/TV show
export const getCredits = async (mediaId: string, mediaType: 'movie' | 'tv'): Promise<{
  cast: CastMember[];
  crew: CrewMember[];
}> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${mediaId}/credits?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      cast: data.cast?.slice(0, 20) || [], // Limit to top 20 cast members
      crew: data.crew?.filter((member: CrewMember) => 
        ['Director', 'Producer', 'Executive Producer', 'Writer', 'Screenplay'].includes(member.job)
      ) || []
    };
  } catch (error) {
    console.error('Error fetching credits:', error);
    return { cast: [], crew: [] };
  }
};

// Get person details
export const getPersonDetails = async (personId: string): Promise<PersonDetails | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${personId}?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching person details:', error);
    return null;
  }
};

// Get person's movie and TV credits
export const getPersonCredits = async (personId: string): Promise<PersonCredits> => {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Sort by popularity and release date
    const sortCredits = (credits: Media[]) => {
      return credits
        .filter(credit => credit.poster_path) // Only include items with posters
        .sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01');
          const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01');
          return dateB.getTime() - dateA.getTime(); // Most recent first
        })
        .slice(0, 20); // Limit to 20 items
    };
    
    return {
      cast: sortCredits(data.cast || []),
      crew: sortCredits(data.crew || [])
    };
  } catch (error) {
    console.error('Error fetching person credits:', error);
    return { cast: [], crew: [] };
  }
};