import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('v1');

  // GlobalPipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Helmet settings
  app.use(helmet());

  // Env settings
  const appConfig = app.get(ConfigService);
  console.info(`=> Running as ${appConfig.get('app.env')}`);

  // Config for Swagger
  if (appConfig.get('app.env') === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Snackbet API')
      .setDescription('The API description for Snackbet')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(appConfig.get('app.port'));
  console.info(
    `=> Server listening at http://localhost:${appConfig.get('app.port')}`,
  );
}
bootstrap();
