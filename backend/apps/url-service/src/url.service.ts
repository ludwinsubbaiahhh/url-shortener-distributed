import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from './prisma.service';
import { RedisCacheService } from './redis.service';
import { IsUrl } from 'class-validator';
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
  private readonly base62Chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private readonly shortCodeLength = 7;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  /**
   * Generates a unique 7-character short code using base62 encoding
   * Checks Redis cache first, then database for duplicates
   */
  async generateShortCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      // Generate random bytes and convert to base62
      const randomBytes = crypto.randomBytes(4);
      let shortCode = '';
      let num = randomBytes.readUInt32BE(0);
      
      // Convert to base62
      while (num > 0) {
        shortCode = this.base62Chars[num % 62] + shortCode;
        num = Math.floor(num / 62);
      }
      
      // Pad to 7 characters if needed
      while (shortCode.length < this.shortCodeLength) {
        shortCode = this.base62Chars[0] + shortCode;
      }

      // Check Redis cache first
      const cachedUrl = await this.cacheManager.get(`shortcode:${shortCode}`);
      if (!cachedUrl) {
        // Check database
        const existingUrl = await this.prismaService.url.findUnique({
          where: { shortCode },
        });
        
        if (!existingUrl) {
          return shortCode;
        }
      }

      attempts++;
    }

    throw new Error('Failed to generate unique short code after maximum attempts');
  }

  /**
   * Shortens a URL with optional custom alias
   */
  async shortenUrl(longUrl: string, userId?: string, customAlias?: string): Promise<{
    id: string;
    shortCode: string;
    longUrl: string;
    shortUrl: string;
    expiresAt?: Date;
    createdAt: Date;
  }> {
    // Validate URL format
    if (!this.isValidUrl(longUrl)) {
      throw new BadRequestException('Invalid URL format');
    }

    // Check if URL is already shortened by looking up hash in Redis
    const urlHash = crypto.createHash('sha256').update(longUrl).digest('hex');
    const existingShortCode = await this.cacheManager.get(`urlhash:${urlHash}`);
    
    if (existingShortCode) {
      const existingUrl = await this.prismaService.url.findUnique({
        where: { shortCode: existingShortCode as string },
      });
      
      if (existingUrl && existingUrl.isActive) {
        return {
          id: existingUrl.id,
          shortCode: existingUrl.shortCode,
          longUrl: existingUrl.longUrl,
          shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${existingUrl.shortCode}`,
          expiresAt: existingUrl.expiresAt,
          createdAt: existingUrl.createdAt,
        };
      }
    }

    let shortCode: string;

    // Handle custom alias
    if (customAlias) {
      // Check if custom alias is available
      const existingUrl = await this.prismaService.url.findUnique({
        where: { customAlias },
      });
      
      if (existingUrl) {
        throw new ConflictException('Custom alias is already in use');
      }
      
      shortCode = customAlias;
    } else {
      // Generate new short code
      shortCode = await this.generateShortCode();
    }

    // Save to database
    const newUrl = await this.prismaService.url.create({
      data: {
        longUrl,
        shortCode,
        customAlias: customAlias || null,
        userId: userId || null,
        expiresAt: null, // Can be set based on business logic
      },
    });

    // Cache the shortCode -> longUrl mapping with 24-hour TTL
    await this.cacheManager.set(`shortcode:${shortCode}`, longUrl, 24 * 60 * 60 * 1000);
    
    // Cache the URL hash for future lookups
    await this.cacheManager.set(`urlhash:${urlHash}`, shortCode, 24 * 60 * 60 * 1000);

    return {
      id: newUrl.id,
      shortCode: newUrl.shortCode,
      longUrl: newUrl.longUrl,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${newUrl.shortCode}`,
      expiresAt: newUrl.expiresAt,
      createdAt: newUrl.createdAt,
    };
  }

  /**
   * Retrieves the long URL for a given short code
   */
  async getLongUrl(shortCode: string): Promise<string> {
    // Check Redis cache first
    const cachedLongUrl = await this.cacheManager.get(`shortcode:${shortCode}`);
    
    if (cachedLongUrl) {
      // Cache analytics event for later processing with RabbitMQ
      await this.redisCacheService.cacheAnalyticsEvent('cached-url-id', {
        ipAddress: '127.0.0.1',
        device: 'desktop',
      });
      return cachedLongUrl as string;
    }

    // Cache miss - query database
    const url = await this.prismaService.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (!url.isActive) {
      throw new NotFoundException('Short URL is no longer active');
    }

    // Check if URL has expired
    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new NotFoundException('Short URL has expired');
    }

    // Cache the result for future requests
    await this.cacheManager.set(`shortcode:${shortCode}`, url.longUrl, 24 * 60 * 60 * 1000);

    // Cache analytics event for later processing with RabbitMQ
    await this.redisCacheService.cacheAnalyticsEvent(url.id, {
      ipAddress: '127.0.0.1',
      device: 'desktop',
    });
    return url.longUrl;
  }

  /**
   * Validates if a string is a valid URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
