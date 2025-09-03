import React, { useEffect, useState } from 'react';
import { decadeCollections, getMediaByDecade, DecadeCollection } from '@/utils/decades';
import { Media } from '@/utils/api';
import GenreRow from './GenreRow';

const DecadeCollections: React.FC = () => {
  const [decadeData, setDecadeData] = useState<{ [key: string]: Media[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchDecadeData = async () => {
      // Fetch data for the first 3 decades
      const priorityDecades = decadeCollections.slice(0, 3);
      
      for (const decade of priorityDecades) {
        setLoading(prev => ({ ...prev, [decade.id]: true }));
        
        try {
          // Mix movies and TV shows for each decade
          const [movies, tvShows] = await Promise.all([
            getMediaByDecade(decade, 'movie'),
            getMediaByDecade(decade, 'tv')
          ]);
          
          // Combine and shuffle (6 each for 12 total)
          const combined = [...movies.slice(0, 6), ...tvShows.slice(0, 6)]
            .sort(() => Math.random() - 0.5)
            .slice(0, 12);
          
          setDecadeData(prev => ({ ...prev, [decade.id]: combined }));
        } catch (error) {
          console.error(`Error fetching data for ${decade.name}:`, error);
        } finally {
          setLoading(prev => ({ ...prev, [decade.id]: false }));
        }
      }
    };

    fetchDecadeData();
  }, []);

  return (
    <div className="space-y-8">
      {decadeCollections.slice(0, 3).map((decade) => (
        <GenreRow
          key={decade.id}
          title={decade.name}
          medias={decadeData[decade.id] || []}
          isLoading={loading[decade.id]}
        />
      ))}
    </div>
  );
};

export default DecadeCollections;