import { Module } from '@nestjs/common';
import { WorkerServiceController } from './worker-service.controller';
import { WorkerServiceService } from './worker-service.service';
import { RabbitMQModule } from '../../../../libs/common/src/rabbitmq/rabbitmq.module';
import { PrismaModule } from './prisma.module';
import { RedisModule } from './redis.module';

@Module({
  imports: [RabbitMQModule, PrismaModule, RedisModule],
  controllers: [WorkerServiceController],
  providers: [WorkerServiceService],
})
export class WorkerServiceModule {}
