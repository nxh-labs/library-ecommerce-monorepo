import { redisClient } from './redis-client';
import { InternalServerError } from '../../domain/errors';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
}

export class CacheService {
  private readonly defaultTTL = 3600; // 1 hour
  private readonly keyPrefix = 'library_api:';

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key);
      const cached = await redisClient.get(fullKey);
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      throw new InternalServerError('Cache get operation failed');
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    try {
      const fullKey = this.getFullKey(key, options.keyPrefix);
      const ttl = options.ttl || this.defaultTTL;
      await redisClient.set(fullKey, JSON.stringify(value), ttl);
    } catch (error) {
      throw new InternalServerError('Cache set operation failed');
    }
  }

  async delete(key: string, keyPrefix?: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key, keyPrefix);
      await redisClient.del(fullKey);
    } catch (error) {
      throw new InternalServerError('Cache delete operation failed');
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      // Note: This is a simplified implementation
      // In production, you might want to use SCAN for better performance
      const keys = await this.getKeysByPattern(pattern);
      if (keys.length > 0) {
        await Promise.all(keys.map(key => redisClient.del(key)));
      }
    } catch (error) {
      throw new InternalServerError('Cache delete pattern operation failed');
    }
  }

  async exists(key: string, keyPrefix?: string): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key, keyPrefix);
      const result = await redisClient.exists(fullKey);
      return result === 1;
    } catch (error) {
      throw new InternalServerError('Cache exists operation failed');
    }
  }

  async clear(): Promise<void> {
    try {
      // Clear all keys with our prefix
      await this.deletePattern(`${this.keyPrefix}*`);
    } catch (error) {
      throw new InternalServerError('Cache clear operation failed');
    }
  }

  private getFullKey(key: string, customPrefix?: string): string {
    const prefix = customPrefix || this.keyPrefix;
    return `${prefix}${key}`;
  }

  private async getKeysByPattern(pattern: string): Promise<string[]> {
    // This is a simplified implementation
    // In a real-world scenario, you'd use Redis SCAN command
    // For now, we'll return an empty array as this requires more complex implementation
    return [];
  }

  // Specific cache methods for common use cases
  async getPopularBooks(limit: number = 10): Promise<any[] | null> {
    return this.get(`popular_books:${limit}`);
  }

  async setPopularBooks(books: any[], limit: number = 10): Promise<void> {
    await this.set(`popular_books:${limit}`, books, { ttl: 1800 }); // 30 minutes
  }

  async getCategories(): Promise<any[] | null> {
    return this.get('categories');
  }

  async setCategories(categories: any[]): Promise<void> {
    await this.set('categories', categories, { ttl: 3600 }); // 1 hour
  }

  async invalidateBookCache(bookId: string): Promise<void> {
    await this.delete(`book:${bookId}`);
    await this.deletePattern('popular_books:*');
  }

  async invalidateCategoryCache(): Promise<void> {
    await this.delete('categories');
  }
}

export const cacheService = new CacheService();