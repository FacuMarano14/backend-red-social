import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard'; // Asegúrate de que esta ruta sea correcta
import { Roles } from '../common/decorators/roles.decorator'; // Asegúrate de que esta ruta sea correcta
import { PostsService } from '../posts/posts.service'; // Necesario para los métodos de posts
import { CommentsService } from '../comments/comments.service'; // Necesario para los métodos de comments

@Controller('stats')
@UseGuards(JwtAuthGuard) // Aplicamos el guard de autenticación a todo el controlador

export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    // Injectamos los servicios que contienen las estadísticas de Posts y Comments
    private readonly postsService: PostsService, 
    private readonly commentsService: CommentsService, 
    // Nota: El UsersService que estaba antes en el otro controller no es necesario aquí
  ) {}

  // ---------------------------
  // 1. RUTAS PÚBLICAS (Solo necesitan autenticación, no rol de admin)
  // ---------------------------
  
  @Post('event')
  async registerEvent(
    @Body() body: { type: string; userId?: string; targetId?: string; metadata?: any }
  ) {
    return {
      success: true,
      data: await this.statsService.register(
        body.type,
        body.userId ?? "",
        body.targetId ?? "",
        body.metadata ?? {}
      )
    };
  }
  
  // ---------------------------
  // 2. RUTAS DE ADMINISTRADOR (Necesitan RolesGuard)
  // ---------------------------

  @Roles('administrador')
  @UseGuards(RolesGuard) // Aplicamos el RolesGuard SÓLO a las rutas de Admin
  @Get('logins-by-user')
  async loginsByUser(@Query('from') from?: string, @Query('to') to?: string) {
    // Agregamos el soporte para filtros from/to
    return { success: true, data: await this.statsService.loginsByUser(from, to) };
  }

  @Roles('administrador')
  @UseGuards(RolesGuard)
  @Get('profile-visits-by-user')
  async profileVisitsByUser(@Query('from') from?: string, @Query('to') to?: string) {
    // Agregamos el soporte para filtros from/to
    return { success: true, data: await this.statsService.profileVisitsByUser(from, to) };
  }

  @Roles('administrador')
  @UseGuards(RolesGuard)
  @Get('likes-by-day')
  async likesByDay(@Query('from') from?: string, @Query('to') to?: string) {
    // Agregamos el soporte para filtros from/to
    return { success: true, data: await this.statsService.likesByDay(from, to) };
  }

  // Corregido: La ruta likes-by-post no era usada por el frontend, pero la dejamos por completitud
  @Roles('administrador')
  @UseGuards(RolesGuard)
  @Get('likes-by-post')
  async likesByPost(@Query('from') from?: string, @Query('to') to?: string) {
    return { success: true, data: await this.statsService.likesByPost(from, to) };
  }
  
  // Rutas importadas del PostsController:

  @Roles('administrador')
  @UseGuards(RolesGuard)
  @Get('posts-by-user')
  async postsByUser(@Query('from') from?: string, @Query('to') to?: string) {
    return this.postsService.statsPostsByUser(from, to); // Esto ya devuelve { success: true, data: agg }
  }

  @Roles('administrador')
  @UseGuards(RolesGuard)
  @Get('comments-by-user')
  async commentsByUser(@Query('from') from?: string, @Query('to') to?: string) {
    return this.commentsService.statsCommentsByUser(from, to); // Esto ya devuelve { success: true, data: agg }
  }

  @Roles('administrador')
  @UseGuards(RolesGuard)
  @Get('comments-by-post')
  async commentsByPost(@Query('from') from?: string, @Query('to') to?: string) {
    return this.commentsService.statsCommentsByPost(from, to); // Esto ya devuelve { success: true, data: agg }
  }
}