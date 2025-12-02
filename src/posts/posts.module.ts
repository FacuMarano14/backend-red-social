// import { Module, forwardRef } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PostsService } from './posts.service';
// import { PostsController } from './posts.controller';
// import { Post, PostSchema } from './schemas/post.schema';
// import { UsersModule } from '../users/users.module';
// import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
//     forwardRef(() => UsersModule),
//     CloudinaryModule,
//   ],
//   controllers: [PostsController],
//   providers: [PostsService],
//   exports: [PostsService]
// })
// export class PostsModule {}
// src/posts/posts.module.ts
// import { Module, forwardRef } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PostsService } from './posts.service';
// import { PostsController } from './posts.controller';
// import { Post, PostSchema } from './schemas/post.schema';
// import { UsersModule } from '../users/users.module';
// import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
// import { CommentsModule } from 'src/comments/comments.module';
// import { StatsController } from './stats.controller';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
//     forwardRef(() => UsersModule),
//     CloudinaryModule,
//     CommentsModule, // NECESARIO para inyectar CommentsService
//   ],
//   controllers: [
//     PostsController,
//     StatsController, // Controlador de estadísticas (solo admin)
//   ],
//   providers: [
//     PostsService,
//   ],
//   exports: [
//     PostsService,
//   ],
// })
// export class PostsModule {}
// import { Module, forwardRef } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PostsService } from './posts.service';
// import { PostsController } from './posts.controller';
// import { Post, PostSchema } from './schemas/post.schema';
// import { UsersModule } from '../users/users.module';
// import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
// import { CommentsModule } from 'src/comments/comments.module';
// import { StatsController } from './stats.controller';
// import { StatsModule } from 'src/stats/stats.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),

//     // 🔥 Estos dos deben usar forwardRef para evitar dependencia circular
//     forwardRef(() => UsersModule),
//     forwardRef(() => CommentsModule),

//     CloudinaryModule,
//     StatsModule
//   ],
//   controllers: [
//     PostsController,
//     StatsController,
//   ],
//   providers: [
//     PostsService,
//   ],
//   exports: [
//     PostsService,
//   ],
// })
// export class PostsModule {}
// import { Module, forwardRef } from '@nestjs/common';
// import { PostsController } from './posts.controller';
// import { Post, PostSchema } from './schemas/post.schema';
// import { UsersModule } from '../users/users.module';
// import { CloudinaryModule } from '../cloudinary/cloudinary.module';
// import { CommentsModule } from '../comments/comments.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PostsService } from './posts.service';
// import { StatsModule } from 'src/stats/stats.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
//     forwardRef(() => UsersModule),
//     forwardRef(() => CommentsModule),
//     CloudinaryModule,
//     StatsModule
//   ],
//   controllers: [PostsController],
//   providers: [PostsService],
//   exports: [PostsService],
// })
// export class PostsModule {}
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/post.schema';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => CommentsModule),
    CloudinaryModule, // <- necesario para inyectar StatsService en PostsService
    forwardRef(() => StatsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

