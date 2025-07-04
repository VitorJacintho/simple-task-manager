import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://192.168.0.158:5000',  // URL do seu front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Se precisar de cookies ou credenciais
  });

  await app.listen(3000);
}
bootstrap();
