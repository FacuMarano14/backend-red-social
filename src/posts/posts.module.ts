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
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CommentsModule } from 'src/comments/comments.module';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),

    // 🔥 Estos dos deben usar forwardRef para evitar dependencia circular
    forwardRef(() => UsersModule),
    forwardRef(() => CommentsModule),

    CloudinaryModule,
  ],
  controllers: [
    PostsController,
    StatsController,
  ],
  providers: [
    PostsService,
  ],
  exports: [
    PostsService,
  ],
})
export class PostsModule {}
