// import { Controller, Get, Query, UseGuards } from '@nestjs/common';
// import { StatsService } from './stats.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('stats')
// @UseGuards(JwtAuthGuard)
// export class StatsController {
//   constructor(private readonly stats: StatsService) {}

//   // GET /stats/logins-by-user
//   @Get('logins-by-user')
//   getLogins() {
//     return this.stats.aggregateByUser('login');
//   }

//   // GET /stats/profile-visits-by-user
//   @Get('profile-visits-by-user')
//   getProfileVisits() {
//     return this.stats.aggregateByUser('profile_visit');
//   }

//   // GET /stats/likes-by-day
//   @Get('likes-by-day')
//   getLikesByDay() {
//     return this.stats.aggregateByDay('like');
//   }
// }
// import { Controller, Get, Query, UseGuards } from '@nestjs/common';
// import { StatsService } from './stats.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('stats')
// @UseGuards(JwtAuthGuard)
// export class StatsController {
//   constructor(private readonly stats: StatsService) {}

//   // =====================================
//   // 🔹 LOGINS POR USUARIO
//   // =====================================
//   @Get('logins-by-user')
//   async getLogins(@Query('from') from?: string, @Query('to') to?: string) {
//     const data = await this.stats.aggregateByUser('login', from, to);
//     return { success: true, data };
//   }

//   // =====================================
//   // 🔹 VISITAS A PERFIL POR USUARIO
//   // =====================================
//   @Get('profile-visits-by-user')
//   async getProfileVisits(@Query('from') from?: string, @Query('to') to?: string) {
//     const data = await this.stats.aggregateByUser('profile_visit', from, to);
//     return { success: true, data };
//   }

//   // =====================================
//   // 🔹 LIKES POR DÍA
//   // =====================================
// //   @Get('likes-by-day')
// //   async getLikesByDay(@Query('from') from?: string, @Query('to') to?: string) {
// //     const data = await this.stats.aggregateByDay('like', from, to);
// //     return { success: true, data };
// //   }
// // }
// import { Controller, Get, Query, UseGuards } from '@nestjs/common';
// import { StatsService } from './stats.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('stats')
// @UseGuards(JwtAuthGuard)
// export class StatsController {
//   constructor(private readonly stats: StatsService) {}

//   // LOGINS POR USUARIO (events tipo 'login')
//   @Get('logins-by-user')
//   async getLogins(@Query('from') from?: string, @Query('to') to?: string) {
//     const data = await this.stats.aggregateByUser('login', from, to);
//     return { success: true, data };
//   }

//   // VISITAS A PERFIL POR USUARIO (events tipo 'profile_visit')
//   @Get('profile-visits-by-user')
//   async getProfileVisits(@Query('from') from?: string, @Query('to') to?: string) {
//     const data = await this.stats.aggregateByUser('profile_visit', from, to);
//     return { success: true, data };
//   }

//   // LIKES POR DÍA (events tipo 'like')
//   @Get('likes-by-day')
//   async getLikesByDay(@Query('from') from?: string, @Query('to') to?: string) {
//     const data = await this.stats.aggregateByDay('like', from, to);
//     return { success: true, data };
//   }

//   // POSTS POR USUARIO (si estás registrando 'post' en events)
//   @Get('posts-by-user')
//   async getPostsByUser(@Query('from') from?: string, @Query('to') to?: string) {
//     const data = await this.stats.aggregateByUser('post', from, to);
//     return { success: true, data };
//   }

//   // COMENTARIOS POR USUARIO (si registrás 'comment' en events)
//   @Get('comments-by-user')
//   async getCommentsByUser(@Query('from') from?: string, @Query('to') to?: string) {
//     const data = await this.stats.aggregateByUser('comment', from, to);
//     return { success: true, data };
//   }

//   // COMENTARIOS POR PUBLICACIÓN (agrupar por targetId y lookup posts.titulo)
//   @Get('comments-by-post')
//   async getCommentsByPost(@Query('from') from?: string, @Query('to') to?: string) {
//     const data = await this.stats.aggregateByTarget('comment', 'posts', 'titulo', from, to);
//     return { success: true, data };
//   }
// }
// import { Controller, Get } from '@nestjs/common';
// import { StatsService } from './stats.service';

// @Controller('events')
// export class StatsController {
//   constructor(private readonly statsService: StatsService) {}

//   @Get('logins-by-user')
//   async loginsByUser() {
//     return this.statsService.loginsByUser();
//   }

//   @Get('profile-visits-by-user')
//   async profileVisits() {
//     return this.statsService.profileVisitsByUser();
//   }

//   @Get('likes-by-post')
//   async likesByPost() {
//     return this.statsService.likesByPost();
//   }
// }
// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { StatsService } from './stats.service';

// @Controller('stats')
// @UseGuards(JwtAuthGuard)
// export class StatsController {
//   constructor(private readonly statsService: StatsService) {}

//   @Get('logins-by-user')
//   async loginsByUser() {
//     const data = await this.statsService.loginsByUser();
//     return { success: true, data };
//   }

//   @Get('profile-visits-by-user')
//   async profileVisits() {
//     const data = await this.statsService.profileVisitsByUser();
//     return { success: true, data };
//   }

//   @Get('likes-by-day')
//   async likesByDay() {
//     const data = await this.statsService.likesByPost();
//     return { success: true, data };
//   }
// }
// import { Controller, Get } from '@nestjs/common';
// import { StatsService } from './stats.service';

// @Controller('stats')
// export class StatsController {
//   constructor(private readonly statsService: StatsService) {}

//   @Get('logins-by-user')
//   async loginsByUser() {
//     return { success: true, data: await this.statsService.loginsByUser() };
//   }

//   @Get('profile-visits-by-user')
//   async profileVisits() {
//     return { success: true, data: await this.statsService.profileVisitsByUser() };
//   }

//   @Get('likes-by-post')
//   async likesByPost() {
//     return { success: true, data: await this.statsService.likesByPost() };
//   }

//   // ⭐⭐⭐ NUEVO — LO QUE FALTABA ⭐⭐⭐
//   @Get('likes-by-day')
//   async likesByDay() {
//     return { success: true, data: await this.statsService.likesByDay() };
//   }
// }
// import { Controller, Get, Query } from '@nestjs/common';
// import { StatsService } from './stats.service';

// @Controller('stats')
// export class StatsController {
//   constructor(private readonly statsService: StatsService) {}

//   @Get('logins-by-user')
//   async loginsByUser(
//     @Query('from') from?: string,
//     @Query('to') to?: string
//   ) {
//     return { success: true, data: await this.statsService.loginsByUser(from, to) };
//   }

//   @Get('profile-visits-by-user')
//   async profileVisits(
//     @Query('from') from?: string,
//     @Query('to') to?: string
//   ) {
//     return { success: true, data: await this.statsService.profileVisitsByUser(from, to) };
//   }

//   @Get('likes-by-day')
//   async likesByDay(
//     @Query('from') from?: string,
//     @Query('to') to?: string
//   ) {
//     return { success: true, data: await this.statsService.likesByDay(from, to) };
//   }
// }
// import { Controller, Get } from '@nestjs/common';
// import { StatsService } from './stats.service';

// @Controller('stats')
// export class StatsController {
//   constructor(private readonly statsService: StatsService) {}

//   @Get('logins-by-user')
//   async loginsByUser() {
//     return { success: true, data: await this.statsService.loginsByUser() };
//   }

//   @Get('profile-visits-by-user')
//   async profileVisits() {
//     return { success: true, data: await this.statsService.profileVisitsByUser() };
//   }

//   @Get('likes-by-post')
//   async likesByPost() {
//     return { success: true, data: await this.statsService.likesByPost() };
//   }

//   @Get('likes-by-day')
//   async likesByDay() {
//     return { success: true, data: await this.statsService.likesByDay() };
//   }
// }
// import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
// import { StatsService } from './stats.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('stats')
// @UseGuards(JwtAuthGuard)
// export class StatsController {
//   constructor(private readonly statsService: StatsService) {}

//   // ============================================================
//   //   👉 REGISTRAR EVENTO (ESTE ENDPOINT NO EXISTÍA)
//   // ============================================================
//   @Post('event')
//   async registerEvent(
//     @Body() body: { type: string; userId?: string; targetId?: string; metadata?: any }
//   ) {
//     const { type, userId, targetId, metadata } = body;

//     const result = await this.statsService.register(
//       type,
//       userId || "",
//       targetId || "",
//       metadata || {}
//     );

//     return { success: true, data: result };
//   }

//   // ============================================================
//   //    LOGINs por usuario
//   // ============================================================
//   @Get('logins-by-user')
//   async loginsByUser() {
//     const data = await this.statsService.loginsByUser();
//     return { success: true, data };
//   }

//   // ============================================================
//   //    Visitas a perfil por usuario
//   // ============================================================
//   @Get('profile-visits-by-user')
//   async profileVisitsByUser() {
//     const data = await this.statsService.profileVisitsByUser();
//     return { success: true, data };
//   }

//   // ============================================================
//   //    Likes por día
//   // ============================================================
//   @Get('likes-by-day')
//   async likesByDay() {
//     const data = await this.statsService.likesByDay();
//     return { success: true, data };
//   }

//   // ============================================================
//   //    Likes por post
//   // ============================================================
//   @Get('likes-by-post')
//   async likesByPost() {
//     const data = await this.statsService.likesByPost();
//     return { success: true, data };
//   }
// }
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