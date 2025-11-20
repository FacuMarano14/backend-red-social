// import {
//   Controller,
//   Post,
//   Get,
//   Delete,
//   Param,
//   Body,
//   UseGuards,
//   Request
// } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CommentsService } from './comments.service';

// @Controller('comments')
// export class CommentsController {
//   constructor(private commentsService: CommentsService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post(':postId')
//   async create(@Param('postId') postId: string, @Request() req, @Body('contenido') contenido: string) {
//     return this.commentsService.create(req.user.userId, postId, contenido);
//   }

//   @Get('post/:postId')
//   async getByPost(@Param('postId') postId: string) {
//     return this.commentsService.findByPost(postId);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(':id')
//   async delete(@Param('id') id: string, @Request() req) {
//     return this.commentsService.delete(id, req.user.userId);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Post(':id/like')
//   like(@Param('id') id: string, @Request() req) {
//     return this.commentsService.like(id, req.user.userId);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(':id/unlike')
//   unlike(@Param('id') id: string, @Request() req) {
//     return this.commentsService.unlike(id, req.user.userId);
//   }
// }
import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Query
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  async create(@Param('postId') postId: string, @Request() req, @Body('contenido') contenido: string) {
    return this.commentsService.create(req.user.userId, postId, contenido);
  }

  // 🔹 PAGINACIÓN: /comments/post/:postId?page=1&limit=10
  @Get('post/:postId')
  async getByPost(
    @Param('postId') postId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.commentsService.findByPost(postId, Number(page), Number(limit));
  }

  // 🔹 PUT modificar comentario
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body('contenido') contenido: string
  ) {
    return this.commentsService.update(id, req.user.userId, contenido);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.commentsService.delete(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @Request() req) {
    return this.commentsService.like(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unlike')
  unlike(@Param('id') id: string, @Request() req) {
    return this.commentsService.unlike(id, req.user.userId);
  }
}
