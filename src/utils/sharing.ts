import { Media } from './api';
import { toast } from '@/components/ui/use-toast';

// Share movie/show with friends
export const shareMedia = async (media: Media): Promise<void> => {
  const mediaType = media.media_type || (media.first_air_date ? 'tv' : 'movie');
  const title = media.title || media.name || 'Unknown Title';
  const url = `${window.location.origin}/details/${mediaType}/${media.id}`;
  
  const shareData = {
    title: `Check out ${title}`,
    text: `I found this great ${mediaType === 'movie' ? 'movie' : 'TV show'}: ${title}`,
    url: url
  };

  try {
    // Try native sharing first (mobile devices)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      toast({
        title: "Shared successfully!",
        description: `${title} has been shared.`,
      });
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: `${title} link has been copied to your clipboard.`,
      });
    }
  } catch (error) {
    console.error('Error sharing:', error);
    toast({
      title: "Share failed",
      description: "Unable to share this content.",
      variant: "destructive"
    });
  }
};

// Export watchlist functionality
export const exportWatchlist = (watchlist: Media[]): void => {
  try {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalItems: watchlist.length,
      items: watchlist.map(media => ({
        id: media.id,
        title: media.title || media.name,
        type: media.media_type || (media.first_air_date ? 'tv' : 'movie'),
        releaseDate: media.release_date || media.first_air_date,
        rating: media.vote_average,
        overview: media.overview
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `watchlist-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Watchlist exported!",
      description: `${watchlist.length} items exported successfully.`,
    });
  } catch (error) {
    console.error('Error exporting watchlist:', error);
    toast({
      title: "Export failed",
      description: "Unable to export your watchlist.",
      variant: "destructive"
    });
  }
};