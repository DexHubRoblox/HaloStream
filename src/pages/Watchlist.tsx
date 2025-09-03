
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MediaGrid from '@/components/MediaGrid';
import { getWatchlist, WATCHLIST_UPDATED_EVENT } from '@/utils/watchlist';
import { Media } from '@/utils/api';
import { BookmarkX, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportWatchlist } from '@/utils/sharing';

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<Media[]>([]);
  
  useEffect(() => {
    const updateWatchlist = () => {
      const items = getWatchlist();
      setWatchlist(items);
    };
    
    updateWatchlist();
    
    window.addEventListener(WATCHLIST_UPDATED_EVENT, updateWatchlist);
    window.addEventListener('storage', updateWatchlist);
    
    return () => {
      window.removeEventListener(WATCHLIST_UPDATED_EVENT, updateWatchlist);
      window.removeEventListener('storage', updateWatchlist);
    };
  }, []);

  const handleExportWatchlist = () => {
    exportWatchlist(watchlist);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-white">My Watchlist</h1>
          {watchlist.length > 0 && (
            <Button
              onClick={handleExportWatchlist}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <Download size={16} className="mr-2" />
              Export Watchlist
            </Button>
          )}
        </div>
        
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-white/60">
            <BookmarkX size={64} className="mb-4" />
            <h2 className="text-xl font-medium mb-2">Your watchlist is empty</h2>
            <p className="text-center max-w-md">
              Add movies and TV shows to your watchlist to keep track of what you want to watch.
            </p>
          </div>
        ) : (
          <MediaGrid title="" medias={watchlist} />
        )}
      </div>
    </div>
  );
};

export default Watchlist;
