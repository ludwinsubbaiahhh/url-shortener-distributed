import { Module } from '@nestjs/common';
import { UrlServiceController } from './url-service.controller';
import { UrlServiceService } from './url-service.service';
import { PrismaModule } from './prisma.module';
import { RedisModule } from './redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [UrlServiceController],
  providers: [UrlServiceService],
})
export class UrlServiceModule {}
