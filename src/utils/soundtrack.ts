import { Media } from './api';

const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
const BASE_URL = "https://api.themoviedb.org/3";

export interface SoundtrackInfo {
  id: string;
  name: string;
  artist: string;
  album?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
}

export interface Awards {
  oscars: AwardInfo[];
  emmys: AwardInfo[];
  goldenGlobes: AwardInfo[];
  other: AwardInfo[];
}

export interface AwardInfo {
  name: string;
  category: string;
  year: number;
  won: boolean;
  nominee?: string;
}

// Mock soundtrack data (in a real app, this would come from a music API)
export const getSoundtrackInfo = async (mediaId: number, mediaType: 'movie' | 'tv'): Promise<SoundtrackInfo[]> => {
  // Mock data for demonstration
  const mockSoundtracks: SoundtrackInfo[] = [
    {
      id: '1',
      name: 'Main Theme',
      artist: 'Hans Zimmer',
      album: 'Original Motion Picture Soundtrack',
      spotifyUrl: 'https://open.spotify.com/track/example',
      youtubeUrl: 'https://www.youtube.com/watch?v=example'
    },
    {
      id: '2',
      name: 'End Credits',
      artist: 'Various Artists',
      album: 'Original Motion Picture Soundtrack'
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSoundtracks;
};

// Get awards information (mock data)
export const getAwardsInfo = async (mediaId: number, mediaType: 'movie' | 'tv'): Promise<Awards> => {
  // Mock awards data
  const mockAwards: Awards = {
    oscars: [
      {
        name: 'Academy Awards',
        category: 'Best Picture',
        year: 2023,
        won: true
      },
      {
        name: 'Academy Awards',
        category: 'Best Director',
        year: 2023,
        won: false,
        nominee: 'Christopher Nolan'
      }
    ],
    emmys: [],
    goldenGlobes: [
      {
        name: 'Golden Globe Awards',
        category: 'Best Motion Picture - Drama',
        year: 2023,
        won: false
      }
    ],
    other: [
      {
        name: 'BAFTA Awards',
        category: 'Best Film',
        year: 2023,
        won: true
      }
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAwards;
};

// Get box office information
export const getBoxOfficeInfo = async (mediaId: number): Promise<{
  budget?: number;
  revenue?: number;
  opening_weekend?: number;
} | null> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${mediaId}?api_key=${API_KEY}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      budget: data.budget,
      revenue: data.revenue,
      opening_weekend: data.opening_weekend
    };
  } catch (error) {
    console.error('Error fetching box office info:', error);
    return null;
  }
};