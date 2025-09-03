export interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

class LazyLoadManager {
  private observer: IntersectionObserver | null = null;
  private elements: Map<Element, () => void> = new Map();

  constructor(options: LazyLoadOptions = {}) {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || '50px',
        }
      );
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const callback = this.elements.get(entry.target);
        if (callback) {
          callback();
          this.unobserve(entry.target);
        }
      }
    });
  }

  observe(element: Element, callback: () => void) {
    if (!this.observer) {
      // Fallback for browsers without IntersectionObserver
      callback();
      return;
    }

    this.elements.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
    this.elements.delete(element);
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.elements.clear();
  }
}

// Global lazy load manager instance
export const lazyLoadManager = new LazyLoadManager();

// Hook for lazy loading images
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement || !src) return;

    const loadImage = () => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsLoaded(true); // Still mark as loaded to prevent infinite loading
      };
      img.src = src;
    };

    lazyLoadManager.observe(imgElement, loadImage);

    return () => {
      lazyLoadManager.unobserve(imgElement);
    };
  }, [src]);

  return { imageSrc, isLoaded, imgRef };
};

// Lazy loading component for media grids
export const LazyMediaGrid: React.FC<{
  children: React.ReactNode;
  onLoad?: () => void;
}> = ({ children, onLoad }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleVisible = () => {
      setIsVisible(true);
      onLoad?.();
    };

    lazyLoadManager.observe(container, handleVisible);

    return () => {
      lazyLoadManager.unobserve(container);
    };
  }, [onLoad]);

  return (
    <div ref={containerRef}>
      {isVisible ? children : <div className="h-64 bg-gray-800 animate-pulse rounded-lg" />}
    </div>
  );
};

// Virtualized list for large datasets
export const VirtualizedList: React.FC<{
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
}> = ({ items, itemHeight, containerHeight, renderItem, overscan = 5 }) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
};