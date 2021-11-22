import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const listenPort = 3001;
const logger = new Logger('main.ts');

/*
   *@Description: 主方法
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-19 20:30:46
  */
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  
  /*
   *@Description: 配置Swagger
   *@MethodAuthor: Terry Wang
   *@Date: 2021-11-19 20:30:46
  */
  const options = new DocumentBuilder()
    .setTitle('项目管理平台')
    .setDescription('项目管理平台接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-ui', app, document);


  await app.listen(listenPort);
}
bootstrap().then(() => {
  logger.log(`listen in localhost:${listenPort}`);
});
