import { NestFactory } from '@nestjs/core';
import { WorkerServiceModule } from './worker-service.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkerServiceModule);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3003);
}
bootstrap();
