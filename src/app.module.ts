import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommentsModule } from './comments/comments.module';
import { StatsModule } from './stats/stats.module';
import { EventsModule } from './events/events.module';


@Module({
  // Define todos los submódulos que formarán parte de la aplicación
  imports: [DatabaseModule, AuthModule, UsersModule, PostsModule, CloudinaryModule, CommentsModule, StatsModule, EventsModule]
})
export class AppModule implements NestModule{
  // Implementa la interfaz NestModule para configurar middlewares
  configure(consumer: MiddlewareConsumer) {
    // Aplica el LoggerMiddleware a *todas* las rutas de la aplicación
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}