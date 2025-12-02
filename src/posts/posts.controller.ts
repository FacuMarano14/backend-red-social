// import { Controller, Get, Post as PostMethod, Body, UseGuards, Request, Delete, UseInterceptors, UploadedFile, Query, Param } from '@nestjs/common';
// import { PostsService } from './posts.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CreatePostDto } from './dto/create-post.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';

// @Controller('posts') // Define que todas las rutas de este controlador comienzan con /posts
// export class PostsController {
//   constructor(
//     private postsService: PostsService, // Servicio que maneja la lógica de las publicaciones
//     private cloudinaryService: CloudinaryService, // Servicio para subir imágenes a Cloudinary
//   ) { }

//   // Crear una nueva publicación (ruta protegida con JWT)
//   @UseGuards(JwtAuthGuard)
//   @PostMethod()
//   @UseInterceptors(FileInterceptor('imagen')) // Permite recibir una imagen en la petición
//   async create(
//     @Request() req,
//     @Body() createPostDto: CreatePostDto,
//     @UploadedFile() file?: Express.Multer.File, // Archivo de imagen (opcional)
//   ) {
//     let imageUrl: string | undefined;

//     // Si hay archivo, se sube a Cloudinary y se obtiene la URL segura
//     if (file) {
//       const uploadResult = await this.cloudinaryService.uploadImage(file);
//       imageUrl = uploadResult.secure_url;
//     }

//     // Se llama al servicio para crear el post en la base de datos
//     return this.postsService.create(
//       req.user.userId,
//       createPostDto.titulo,
//       createPostDto.contenido,
//       imageUrl,
//     );
//   }

//   // Obtener todas las publicaciones
//   @Get()
//   async findAll(
//     @Query('sortBy') sortBy?: string, // Permite ordenar por "likes" o "fecha"
//     @Query('offset') offset = 0,
//     @Query('limit') limit = 10,
//   ) {
//     const validSort = sortBy === 'likes' || sortBy === 'fecha' ? sortBy : undefined;
//     return this.postsService.findAll(validSort, Number(limit), Number(offset));
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return this.postsService.findOne(id);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(':id')
//   delete(@Param('id') id: string, @Request() req) {
//     const isAdmin = req.user?.perfil === 'admin' || req.user?.perfil === 'administrador';
//     return this.postsService.delete(id, req.user.userId, isAdmin);
//   }

//   // Dar "me gusta" a una publicación
//   @UseGuards(JwtAuthGuard)
//   @PostMethod(':id/like')
//   like(@Param('id') id: string, @Request() req) {
//     return this.postsService.likePost(id, req.user.userId);
//   }

//   // Quitar "me gusta"
//   @UseGuards(JwtAuthGuard)
//   @Delete(':id/unlike')
//   unlike(@Param('id') id: string, @Request() req) {
//     return this.postsService.unlikePost(id, req.user.userId);
//   }

//   @Get('user/:id')
//   async getByUser(@Param('id') id: string) {
//     return this.postsService.findByAuthor(id);
//   }
// }
// import {
//   Controller,
//   Get,
//   Post as HttpPost,
//   Body,
//   Param,
//   Delete,
//   UseGuards,
//   UploadedFile,
//   UseInterceptors,
//   Request,
//   Query,
// } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { PostsService } from './posts.service';
// import { FileInterceptor } from '@nestjs/platform-express';

// @Controller('posts')
// export class PostsController {
//   constructor(private readonly postsService: PostsService) {}

//   @UseGuards(JwtAuthGuard)
//   @HttpPost()
//   @UseInterceptors(FileInterceptor('imagen'))
//   async create(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: any,
//     @Request() req: any,
//   ) {
//     const url = file?.path;
//     return this.postsService.create(
//       req.user.userId,
//       body.titulo,
//       body.contenido,
//       url,
//     );
//   }

//   @Get()
//   async findAll(
//     @Query('orderBy') orderBy: 'fecha' | 'likes',
//     @Query('limit') limit = 10,
//     @Query('offset') offset = 0,
//   ) {
//     return this.postsService.findAll(orderBy, Number(limit), Number(offset));
//   }

//   @Get(':id')
//   async findOne(@Param('id') postId: string) {
//     return this.postsService.findOne(postId);
//   }

//   // 🔥 RUTA NECESARIA PARA user.ts
//   @Get('author/:id')
//   async getByAuthor(@Param('id') id: string) {
//     return this.postsService.findByAuthor(id);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(':id')
//   async delete(@Param('id') id: string, @Request() req: any) {
//     return this.postsService.delete(id, req.user.userId, req.user.perfil === 'administrador');
//   }
// }
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
}
