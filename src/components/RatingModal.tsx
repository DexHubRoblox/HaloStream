import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, X } from 'lucide-react';
import { Media } from '@/utils/api';
import { rateMedia, getUserRating, UserRating } from '@/utils/userRatings';
import { toast } from '@/components/ui/use-toast';

interface RatingModalProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ media, isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [existingRating, setExistingRating] = useState<UserRating | null>(null);

  useEffect(() => {
    if (media && isOpen) {
      const existing = getUserRating(media.id);
      setExistingRating(existing);
      if (existing) {
        setRating(existing.rating);
        setReview(existing.review || '');
      } else {
        setRating(0);
        setReview('');
      }
    }
  }, [media, isOpen]);

  const handleSubmit = () => {
    if (!media || rating === 0) return;

    rateMedia(media.id, rating, review.trim() || undefined);
    
    toast({
      title: existingRating ? "Rating Updated" : "Rating Added",
      description: `You rated "${media.title || media.name}" ${rating}/10 stars.`,
    });

    onClose();
  };

  if (!media) return null;

  const title = media.title || media.name || 'Unknown Title';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span>Rate {title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X size={20} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={24}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-white/70 text-sm">
              {rating > 0 ? `${rating}/10 stars` : 'Click to rate'}
            </p>
          </div>

          {/* Review */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Review (Optional)
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this title..."
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 resize-none"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {existingRating ? 'Update Rating' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;