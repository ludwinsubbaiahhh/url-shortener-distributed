import { Module } from '@nestjs/common';
import { AppController } from './analytics-service.controller';
import { AnalyticsServiceService } from './analytics-service.service';
import { RabbitMQModule } from './rabbitmq.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [RabbitMQModule, PrismaModule],
  controllers: [AppController],
  providers: [AnalyticsServiceService],
})
export class AnalyticsServiceModule {}
