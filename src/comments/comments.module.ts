import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    forwardRef(() => PostsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
