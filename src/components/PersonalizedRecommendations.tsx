import React, { useEffect, useState } from 'react';
import { getPersonalizedRecommendations } from '@/utils/recommendations';
import { Media } from '@/utils/api';
import { WATCH_HISTORY_UPDATED_EVENT } from '@/utils/watchHistory';
import GenreRow from './GenreRow';

const PersonalizedRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<{
    title: string;
    medias: Media[];
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const recs = await getPersonalizedRecommendations();
        setRecommendations(recs);
      } catch (error) {
        console.error('Error fetching personalized recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    
    // Update recommendations when watch history changes
    window.addEventListener(WATCH_HISTORY_UPDATED_EVENT, fetchRecommendations);
    
    return () => {
      window.removeEventListener(WATCH_HISTORY_UPDATED_EVENT, fetchRecommendations);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(2)].map((_, index) => (
          <GenreRow
            key={index}
            title="Loading recommendations..."
            medias={[]}
            isLoading={true}
          />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {recommendations.map((rec, index) => (
        <GenreRow
          key={index}
          title={rec.title}
          medias={rec.medias}
        />
      ))}
    </div>
  );
};

export default PersonalizedRecommendations;