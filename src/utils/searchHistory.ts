export const SEARCH_HISTORY_UPDATED_EVENT = 'search-history-updated';

export interface SearchHistoryItem {
  query: string;
  timestamp: string;
  results: number;
}

// Notify components of search history changes
export const notifySearchHistoryUpdated = () => {
  window.dispatchEvent(new Event(SEARCH_HISTORY_UPDATED_EVENT));
};

// Get search history
export const getSearchHistory = (): SearchHistoryItem[] => {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : [];
};

// Add search to history
export const addToSearchHistory = (query: string, results: number): void => {
  if (!query.trim()) return;
  
  const history = getSearchHistory();
  const existingIndex = history.findIndex(item => item.query.toLowerCase() === query.toLowerCase());
  
  const searchItem: SearchHistoryItem = {
    query: query.trim(),
    timestamp: new Date().toISOString(),
    results
  };
  
  if (existingIndex >= 0) {
    // Update existing search
    history[existingIndex] = searchItem;
  } else {
    // Add new search to beginning
    history.unshift(searchItem);
  }
  
  // Keep only last 10 searches
  const trimmedHistory = history.slice(0, 10);
  localStorage.setItem('searchHistory', JSON.stringify(trimmedHistory));
  notifySearchHistoryUpdated();
};

// Clear search history
export const clearSearchHistory = (): void => {
  localStorage.removeItem('searchHistory');
  notifySearchHistoryUpdated();
};

// Get recent searches (last 5)
export const getRecentSearches = (): string[] => {
  const history = getSearchHistory();
  return history.slice(0, 5).map(item => item.query);
};