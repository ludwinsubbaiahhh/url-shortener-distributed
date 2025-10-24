import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Session Cache Pattern
   * Stores user session data with 5-minute TTL
   */
  async cacheSession(userId: string, sessionData: object): Promise<void> {
    const key = `session:${userId}`;
    const ttl = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    await this.cacheManager.set(key, sessionData, ttl);
  }

  /**
   * Session Cache Pattern
   * Retrieves user session data
   */
  async getSession(userId: string): Promise<object | null> {
    const key = `session:${userId}`;
    
    return await this.cacheManager.get(key) as object | null;
  }

  /**
   * Analytics Cache (Write-Behind) Pattern
   * Buffers analytics events for later processing with RabbitMQ
   */
  async cacheAnalyticsEvent(urlId: string, eventData: object): Promise<void> {
    const key = `analytics:buffer:${urlId}`;
    
    // Use Redis RPUSH to add event to the buffer list
    // Note: This assumes the cache manager supports Redis operations
    // In a real implementation, you might need to access the underlying Redis client
    await this.cacheManager.store.client?.rpush(key, JSON.stringify(eventData));
    
    // Set expiration for the buffer (e.g., 1 hour) to prevent indefinite growth
    await this.cacheManager.store.client?.expire(key, 3600);
  }
}
