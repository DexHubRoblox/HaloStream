import { getTrending, getPopularMovies, getPopularTVShows } from './api';

export interface RefreshConfig {
  interval: number; // in milliseconds
  enabled: boolean;
}

class AutoRefreshManager {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private callbacks: Map<string, () => Promise<void>> = new Map();

  register(key: string, callback: () => Promise<void>, config: RefreshConfig) {
    // Clear existing interval if any
    this.unregister(key);

    this.callbacks.set(key, callback);

    if (config.enabled) {
      const interval = setInterval(async () => {
        try {
          await callback();
        } catch (error) {
          console.error(`Auto-refresh error for ${key}:`, error);
        }
      }, config.interval);

      this.intervals.set(key, interval);
    }
  }

  unregister(key: string) {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
    this.callbacks.delete(key);
  }

  pause(key: string) {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
  }

  resume(key: string, config: RefreshConfig) {
    const callback = this.callbacks.get(key);
    if (callback && config.enabled) {
      const interval = setInterval(async () => {
        try {
          await callback();
        } catch (error) {
          console.error(`Auto-refresh error for ${key}:`, error);
        }
      }, config.interval);

      this.intervals.set(key, interval);
    }
  }

  pauseAll() {
    this.intervals.forEach((interval, key) => {
      clearInterval(interval);
    });
    this.intervals.clear();
  }

  resumeAll(config: RefreshConfig) {
    this.callbacks.forEach((callback, key) => {
      if (config.enabled) {
        const interval = setInterval(async () => {
          try {
            await callback();
          } catch (error) {
            console.error(`Auto-refresh error for ${key}:`, error);
          }
        }, config.interval);

        this.intervals.set(key, interval);
      }
    });
  }

  destroy() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.callbacks.clear();
  }
}

export const autoRefreshManager = new AutoRefreshManager();

// Default refresh configurations
export const refreshConfigs = {
  trending: {
    interval: 30 * 60 * 1000, // 30 minutes
    enabled: true
  },
  popular: {
    interval: 60 * 60 * 1000, // 1 hour
    enabled: true
  },
  recommendations: {
    interval: 2 * 60 * 60 * 1000, // 2 hours
    enabled: true
  }
};

// Setup auto-refresh for common data
export const setupAutoRefresh = () => {
  // Trending content refresh
  autoRefreshManager.register(
    'trending',
    async () => {
      const data = await getTrending('week');
      // Dispatch event to update components
      window.dispatchEvent(new CustomEvent('trending-updated', { detail: data }));
    },
    refreshConfigs.trending
  );

  // Popular movies refresh
  autoRefreshManager.register(
    'popular-movies',
    async () => {
      const data = await getPopularMovies();
      window.dispatchEvent(new CustomEvent('popular-movies-updated', { detail: data }));
    },
    refreshConfigs.popular
  );

  // Popular TV shows refresh
  autoRefreshManager.register(
    'popular-tv',
    async () => {
      const data = await getPopularTVShows();
      window.dispatchEvent(new CustomEvent('popular-tv-updated', { detail: data }));
    },
    refreshConfigs.popular
  );
};

// Pause auto-refresh when page is not visible
export const setupVisibilityHandling = () => {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      autoRefreshManager.pauseAll();
    } else {
      autoRefreshManager.resumeAll(refreshConfigs.trending);
    }
  });
};

// Network-aware refresh (pause on slow connections)
export const setupNetworkAwareRefresh = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    const handleConnectionChange = () => {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g';
      
      if (isSlowConnection) {
        autoRefreshManager.pauseAll();
      } else {
        autoRefreshManager.resumeAll(refreshConfigs.trending);
      }
    };

    connection.addEventListener('change', handleConnectionChange);
    handleConnectionChange(); // Initial check
  }
};