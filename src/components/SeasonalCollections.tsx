import React, { useEffect, useState } from 'react';
import { getActiveSeasonalCollections, getSeasonalMedia, SeasonalCollection } from '@/utils/seasonal';
import { Media } from '@/utils/api';
import GenreRow from './GenreRow';

const SeasonalCollections: React.FC = () => {
  const [activeCollections, setActiveCollections] = useState<SeasonalCollection[]>([]);
  const [seasonalData, setSeasonalData] = useState<{ [key: string]: Media[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const active = getActiveSeasonalCollections();
    setActiveCollections(active);

    const fetchSeasonalData = async () => {
      for (const collection of active) {
        setLoading(prev => ({ ...prev, [collection.id]: true }));
        
        try {
          const media = await getSeasonalMedia(collection);
          setSeasonalData(prev => ({ ...prev, [collection.id]: media }));
        } catch (error) {
          console.error(`Error fetching data for ${collection.name}:`, error);
        } finally {
          setLoading(prev => ({ ...prev, [collection.id]: false }));
        }
      }
    };

    if (active.length > 0) {
      fetchSeasonalData();
    }
  }, []);

  if (activeCollections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {activeCollections.map((collection) => (
        <GenreRow
          key={collection.id}
          title={`${collection.icon} ${collection.name}`}
          medias={seasonalData[collection.id] || []}
          isLoading={loading[collection.id]}
        />
      ))}
    </div>
  );
};

export default SeasonalCollections;