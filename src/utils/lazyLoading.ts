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