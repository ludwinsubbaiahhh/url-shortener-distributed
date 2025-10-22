import { NestFactory } from '@nestjs/core';
import { UrlServiceModule } from './url-service.module';

async function bootstrap() {
  const app = await NestFactory.create(UrlServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
