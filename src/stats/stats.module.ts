// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Event, EventSchema } from './schemas/event.schema';
// import { StatsService } from './stats.service';
// import { StatsController } from './stats.controller';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
//   ],
//   controllers: [StatsController],
//   providers: [StatsService],
//   exports: [StatsService]
// })
// export class StatsModule {}
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Event, EventSchema } from './schemas/event.schema';
// import { StatsService } from './stats.service';
// import { StatsController } from './stats.controller';
// import { EventsController } from 'src/events/events.controller';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
//   ],
//   controllers: [StatsController, EventsController],
//   providers: [StatsService],
//   exports: [StatsService]
// })
// export class StatsModule {}
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Event, EventSchema } from './schemas/event.schema';
// import { StatsService } from './stats.service';
// import { StatsController } from './stats.controller';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
//   ],
//   controllers: [StatsController],
//   providers: [StatsService],
//   exports: [StatsService]
// })
// export class StatsModule {}
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { UserSchema } from '../users/schemas/user.schema';
import { PostSchema } from '../posts/schemas/post.schema';
import { CommentSchema } from '../comments/schemas/comment.schema';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'Comment', schema: CommentSchema },
    ]),
    forwardRef(() => PostsModule), 
    forwardRef(() => CommentsModule),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
