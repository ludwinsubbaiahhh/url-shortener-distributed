import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UrlServiceController } from './url-service.controller';
import { UrlServiceService } from './url-service.service';
import { UrlService } from './url.service';
import { PrismaModule } from './prisma.module';
import { RedisModule } from './redis.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';
import { DynamicThrottlerGuard } from './guards/dynamic-throttler.guard';

@Module({
  imports: [
    PrismaModule, 
    RedisModule,
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            name: 'anonymous',
            ttl: 60000,
            limit: 10,
          },
          {
            name: 'authenticated',
            ttl: 60000,
            limit: 100,
          },
        ],
        storage: new ThrottlerStorageRedisService(new Redis()),
      }),
    }),
  ],
  controllers: [UrlServiceController],
  providers: [
    UrlServiceService, 
    UrlService,
    {
      provide: APP_GUARD,
      useClass: DynamicThrottlerGuard,
    },
  ],
})
export class UrlServiceModule {}
