import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Parse REDIS_URL if provided, otherwise use individual config
        const redisUrl = configService.get('REDIS_URL');
        let host = 'localhost';
        let port = 6379;
        let password: string | undefined;
        
        if (redisUrl) {
          try {
            const url = new URL(redisUrl);
            host = url.hostname;
            port = parseInt(url.port) || 6379;
            password = url.password || undefined;
          } catch {
            // Fallback to individual config if URL parsing fails
            host = configService.get('REDIS_HOST', 'localhost');
            port = configService.get('REDIS_PORT', 6379);
            password = configService.get('REDIS_PASSWORD');
          }
        } else {
          host = configService.get('REDIS_HOST', 'localhost');
          port = configService.get('REDIS_PORT', 6379);
          password = configService.get('REDIS_PASSWORD');
        }
        
        return {
          store: redisStore as any,
          host,
          port,
          password,
          db: configService.get('REDIS_DB', 0),
          ttl: configService.get('REDIS_TTL', 3600), // 1 hour default
        } as any;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
