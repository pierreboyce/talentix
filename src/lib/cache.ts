/**
 * Simple in-memory cache with TTL (Time To Live)
 */

interface CacheItem<T> {
  value: T;
  expiry: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();

  /**
   * Set a value in the cache with optional TTL
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or null if not found/expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Delete a specific key from the cache
   * @param key - Cache key to delete
   */
  del(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cached items
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  stats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const [, item] of this.cache) {
      if (now > item.expiry) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      hitRate: 0, // Would need to track hits/misses for this
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache) {
      if (now > item.expiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Export a singleton instance
export const cache = new MemoryCache();

// Auto cleanup every 10 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}