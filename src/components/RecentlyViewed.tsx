import React, { useEffect, useState } from 'react';
import { getRecentlyViewed } from '@/utils/recommendations';
import { Media } from '@/utils/api';
import { WATCH_HISTORY_UPDATED_EVENT } from '@/utils/watchHistory';
import GenreRow from './GenreRow';

const RecentlyViewed: React.FC = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<Media[]>([]);

  useEffect(() => {
    const updateRecentlyViewed = () => {
      const recent = getRecentlyViewed();
      setRecentlyViewed(recent);
    };

    updateRecentlyViewed();
    window.addEventListener(WATCH_HISTORY_UPDATED_EVENT, updateRecentlyViewed);
    
    return () => {
      window.removeEventListener(WATCH_HISTORY_UPDATED_EVENT, updateRecentlyViewed);
    };
  }, []);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <GenreRow
      title="Recently Viewed"
      medias={recentlyViewed}
    />
  );
};

export default RecentlyViewed;