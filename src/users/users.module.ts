// import { Module, forwardRef } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { User, UserSchema } from './schemas/user.schema';
// import { PostsModule } from 'src/posts/posts.module';

// @Module({
//   imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => PostsModule)],
//   providers: [UsersService],
//   controllers: [UsersController],
//   exports: [UsersService],
// })
// export class UsersModule {}
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { PostsModule } from 'src/posts/posts.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'; // <-- agregado

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => PostsModule),
    CloudinaryModule, // <-- agregado
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
