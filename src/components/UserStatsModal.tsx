import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getUserStatistics, formatWatchTime, UserStatistics } from '@/utils/statistics';
import { BarChart, Clock, Film, Tv, Star, Calendar, Target, Bookmark } from 'lucide-react';

interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserStatsModal: React.FC<UserStatsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<UserStatistics | null>(null);

  useEffect(() => {
    if (isOpen) {
      const userStats = getUserStatistics();
      setStats(userStats);
    }
  }, [isOpen]);

  if (!stats) return null;

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }> = ({ icon, title, value, subtitle, color = 'text-blue-400' }) => (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${color}`}>{icon}</div>
        <h3 className="text-white font-medium">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <BarChart size={24} />
            Your Watching Statistics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Clock size={20} />}
              title="Total Watch Time"
              value={formatWatchTime(stats.totalWatchTime)}
              subtitle="Hours of entertainment"
              color="text-green-400"
            />
            <StatCard
              icon={<Film size={20} />}
              title="Movies Watched"
              value={stats.totalMoviesWatched}
              color="text-blue-400"
            />
            <StatCard
              icon={<Tv size={20} />}
              title="TV Shows"
              value={stats.totalTVShowsWatched}
              subtitle={`~${stats.totalEpisodesWatched} episodes`}
              color="text-purple-400"
            />
            <StatCard
              icon={<Star size={20} />}
              title="Average Rating"
              value={stats.averageRating > 0 ? `${stats.averageRating}/10` : 'N/A'}
              color="text-yellow-400"
            />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={<Target size={20} />}
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              subtitle="Of started content finished"
              color="text-orange-400"
            />
            <StatCard
              icon={<Calendar size={20} />}
              title="Watching Streak"
              value={`${stats.watchingStreak} days`}
              color="text-red-400"
            />
            <StatCard
              icon={<Bookmark size={20} />}
              title="Watchlist Size"
              value={stats.watchlistSize}
              subtitle="Items to watch"
              color="text-indigo-400"
            />
          </div>

          {/* Favorite Genres */}
          {stats.favoriteGenres.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BarChart size={20} className="text-pink-400" />
                Favorite Genres
              </h3>
              <div className="space-y-3">
                {stats.favoriteGenres.map((genre, index) => (
                  <div key={genre.genre} className="flex items-center justify-between">
                    <span className="text-white">{genre.genre}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-pink-400 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(genre.count / stats.favoriteGenres[0].count) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm w-8 text-right">{genre.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Rated Content */}
          {stats.topRatedContent.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Star size={20} className="text-yellow-400" />
                Your Top Rated Content
              </h3>
              <div className="space-y-2">
                {stats.topRatedContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                      <span className="text-white">{content.title}</span>
                      <span className="text-xs text-gray-500 capitalize">({content.type})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-medium">{content.rating}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Most Watched Year */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Calendar size={20} className="text-cyan-400" />
              Most Watched Era
            </h3>
            <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.mostWatchedYear}</div>
            <div className="text-gray-400 text-sm">You seem to love content from this year!</div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserStatsModal;