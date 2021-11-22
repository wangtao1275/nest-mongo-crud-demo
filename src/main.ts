import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const listenPort = 3001;
const logger = new Logger('main.ts');

/*
 *@Description: Main
 *@MethodAuthor: Terry Wang
 *@Date: 2021-11-19 20:30:46
 */
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  /*
   *@Description: config Swagger
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-19 20:30:46
   */
  const options = new DocumentBuilder()
    .setTitle('nest mongo platform')
    .setDescription('nest mongo platform api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-ui', app, document);

  await app.listen(listenPort);
};
bootstrap().then(() => {
  logger.log(`listen in localhost:${listenPort}`);
});
