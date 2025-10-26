import { Module } from '@nestjs/common';
import { AnalyticsServiceController } from './analytics-service.controller';
import { AnalyticsServiceService } from './analytics-service.service';
import { RabbitMQModule } from '../../../../libs/common/src/rabbitmq/rabbitmq.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [RabbitMQModule, PrismaModule],
  controllers: [AnalyticsServiceController],
  providers: [AnalyticsServiceService],
})
export class AnalyticsServiceModule {}
