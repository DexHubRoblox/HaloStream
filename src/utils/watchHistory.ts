import { Media } from './api';

// Event for components to listen to watch history changes
export const WATCH_HISTORY_UPDATED_EVENT = 'watch-history-updated';

export interface WatchHistoryItem {
  media: Media;
  watchedAt: string;
  progress: number; // 0-100 percentage
  duration: number; // total duration in seconds
  currentTime: number; // current time in seconds
  completed: boolean;
}

// Notify all components that watch history has been updated
export const notifyWatchHistoryUpdated = () => {
  window.dispatchEvent(new Event(WATCH_HISTORY_UPDATED_EVENT));
};

// Get watch history from localStorage
export const getWatchHistory = (): WatchHistoryItem[] => {
  const history = localStorage.getItem('watchHistory');
  return history ? JSON.parse(history) : [];
};

// Add or update watch progress
export const updateWatchProgress = (
  media: Media, 
  currentTime: number, 
  duration: number
): void => {
  const history = getWatchHistory();
  const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
  const completed = progress >= 90; // Consider 90%+ as completed
  
  const existingIndex = history.findIndex(item => item.media.id === media.id);
  
  const watchItem: WatchHistoryItem = {
    media,
    watchedAt: new Date().toISOString(),
    progress,
    duration,
    currentTime,
    completed
  };
  
  if (existingIndex >= 0) {
    history[existingIndex] = watchItem;
  } else {
    history.unshift(watchItem);
  }
  
  // Keep only last 50 items
  const trimmedHistory = history.slice(0, 50);
  localStorage.setItem('watchHistory', JSON.stringify(trimmedHistory));
  notifyWatchHistoryUpdated();
};

// Get continue watching items (not completed, watched in last 30 days)
export const getContinueWatching = (): WatchHistoryItem[] => {
  const history = getWatchHistory();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return history
    .filter(item => 
      !item.completed && 
      item.progress > 5 && // At least 5% watched
      new Date(item.watchedAt) > thirtyDaysAgo
    )
    .slice(0, 12);
};

// Get recently watched (all items from last 7 days)
export const getRecentlyWatched = (): WatchHistoryItem[] => {
  const history = getWatchHistory();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return history
    .filter(item => new Date(item.watchedAt) > sevenDaysAgo)
    .slice(0, 12);
};

// Clear watch history
export const clearWatchHistory = (): void => {
  localStorage.removeItem('watchHistory');
  notifyWatchHistoryUpdated();
};