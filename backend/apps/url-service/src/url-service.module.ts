import { Module } from '@nestjs/common';
import { UrlServiceController } from './url-service.controller';
import { UrlServiceService } from './url-service.service';

@Module({
  imports: [],
  controllers: [UrlServiceController],
  providers: [UrlServiceService],
})
export class UrlServiceModule {}
