// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { AllExceptionsFilter } from './common/filters/http-exception.filter';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: 'http://localhost:4200',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   app.useGlobalFilters(new AllExceptionsFilter());

//   await app.listen(3000);
//   console.log('🚀 Backend corriendo en http://localhost:3000');
// }
// bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

  
   app.enableCors();

  
   app.useGlobalPipes(
     new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
     }),
   );

   app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3000;
   await app.listen(port);
   console.log(`🚀 Backend corriendo en el puerto ${port}`);
}
bootstrap();