import { Media } from './api';

export interface DecadeCollection {
  id: string;
  name: string;
  description: string;
  startYear: number;
  endYear: number;
  color: string;
}

export const decadeCollections: DecadeCollection[] = [
  {
    id: '2020s',
    name: '2020s Hits',
    description: 'The latest and greatest from this decade',
    startYear: 2020,
    endYear: 2029,
    color: 'bg-purple-600'
  },
  {
    id: '2010s',
    name: '2010s Classics',
    description: 'Defining movies and shows of the 2010s',
    startYear: 2010,
    endYear: 2019,
    color: 'bg-blue-600'
  },
  {
    id: '2000s',
    name: '2000s Nostalgia',
    description: 'Y2K era entertainment at its finest',
    startYear: 2000,
    endYear: 2009,
    color: 'bg-green-600'
  },
  {
    id: '90s',
    name: '90s Gold',
    description: 'The golden age of cinema and television',
    startYear: 1990,
    endYear: 1999,
    color: 'bg-yellow-600'
  },
  {
    id: '80s',
    name: '80s Retro',
    description: 'Neon lights, synthesizers, and iconic movies',
    startYear: 1980,
    endYear: 1989,
    color: 'bg-pink-600'
  },
  {
    id: '70s',
    name: '70s Classics',
    description: 'The birth of modern blockbusters',
    startYear: 1970,
    endYear: 1979,
    color: 'bg-orange-600'
  }
];

// Fetch media by decade
export const getMediaByDecade = async (decade: DecadeCollection, mediaType: 'movie' | 'tv' = 'movie'): Promise<Media[]> => {
  const API_KEY = "71fdb081b0133511ac14ac0cc10fd307";
  const BASE_URL = "https://api.themoviedb.org/3";
  
  try {
    const dateField = mediaType === 'movie' ? 'release_date' : 'first_air_date';
    const response = await fetch(
      `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&${dateField}.gte=${decade.startYear}-01-01&${dateField}.lte=${decade.endYear}-12-31&sort_by=popularity.desc&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results.slice(0, 12);
  } catch (error) {
    console.error(`Error fetching ${mediaType} by decade:`, error);
    return [];
  }
};