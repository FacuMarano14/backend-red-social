import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req: any,
  ) {
    const url = file?.path;
    return this.postsService.create(
      req.user.userId,
      body.titulo,
      body.contenido,
      url,
    );
  }

  @Get()
  async findAll(
    @Query('orderBy') orderBy: 'fecha' | 'likes',
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.postsService.findAll(orderBy, Number(limit), Number(offset));
  }

  @Get(':id')
  async findOne(@Param('id') postId: string) {
    return this.postsService.findOne(postId);
  }

  @Get('author/:id')
  async getByAuthor(@Param('id') id: string) {
    const posts = await this.postsService.findByAuthor(id);
    return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.postsService.delete(id, req.user.userId, req.user.perfil === 'administrador');
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost(':id/like') // POST /posts/:id/like
  async likePost(@Param('id') postId: string, @Request() req: any) {
    // Usa req.user.userId obtenido del token JWT
    return this.postsService.likePost(postId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unlike') // DELETE /posts/:id/unlike
  async unlikePost(@Param('id') postId: string, @Request() req: any) {
    return this.postsService.unlikePost(postId, req.user.userId);
  }
}
