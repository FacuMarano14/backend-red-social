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

