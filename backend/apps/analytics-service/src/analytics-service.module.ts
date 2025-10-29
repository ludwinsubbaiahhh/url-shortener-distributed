import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AnalyticsServiceService } from './analytics-service.service';
import { RabbitMQModule } from '../../../../libs/common/src/rabbitmq/rabbitmq.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [RabbitMQModule, PrismaModule],
  controllers: [AppController],
  providers: [AnalyticsServiceService],
})
export class AnalyticsServiceModule {}
