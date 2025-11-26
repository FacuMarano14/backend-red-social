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
import { AllExceptionsFilter } from './common/filters/http-exception.filter'; // Nota: Esta ruta es solo un ejemplo

async function bootstrap() {
   // 1. Creación de la aplicación y configuración de logs
   const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
   }) ;

   // 2. Configuración de CORS (para permitir peticiones desde el frontend)
   app.enableCors({
      origin: '*', // Permite todos los orígenes
      methods: 'GET,POST,PUT,DELETE',
   });

   // 3. Pipes Globales para Validación y Transformación de datos
   app.useGlobalPipes(
     new ValidationPipe({
        whitelist: true, // Remueve propiedades que no están definidas en el DTO
        forbidNonWhitelisted: true, // Rechaza la petición si hay propiedades extra
        transform: true, // Transforma automáticamente los tipos de datos (ej: string a number)
     }),
   );

   // 4. Filtros Globales para el manejo centralizado de excepciones
   app.useGlobalFilters(new AllExceptionsFilter());

   // 5. Inicio del servidor
   const port = process.env.PORT || 3000;
   await app.listen(port);
   
   console.log(`🚀 Backend corriendo en el puerto ${port}`);
}

bootstrap();