import { Controller, Get, Post as PostMethod, Body, UseGuards, Request, Delete, UseInterceptors, UploadedFile, Query, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @PostMethod()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    return this.postsService.create(
      req.user.userId,
      createPostDto.titulo,
      createPostDto.contenido,
      imageUrl,
    );
  }

  @Get()
  async findAll(
    @Query('sortBy') sortBy?: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ) {
    const validSort = sortBy === 'likes' || sortBy === 'fecha' ? sortBy : undefined;
    return this.postsService.findAll(validSort, Number(limit), Number(offset));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.postsService.delete(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @PostMethod(':id/like')
  like(@Param('id') id: string, @Request() req) {
    return this.postsService.likePost(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unlike')
  unlike(@Param('id') id: string, @Request() req) {
    return this.postsService.unlikePost(id, req.user.userId);
  }
}
