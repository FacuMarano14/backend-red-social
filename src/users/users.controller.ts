// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Put,
//   Post,
//   Body,
//   UseInterceptors,
//   UploadedFile,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UsersService } from './users.service';
// import { PostsService } from 'src/posts/posts.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { RegisterDto } from 'src/auth/dto/register.dto';

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//   ) {}

//   // Perfil del usuario logueado
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req) {
//     const user = await this.usersService.findById(req.user.userId);
//     return {
//       success: true,
//       message: 'Perfil obtenido correctamente',
//       data: user,
//     };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return {
//       success: true,
//       data: posts.data || posts,
//     };
//   }

//   // Editar perfil (mantengo tu lógica)
//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };

//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }

//     await this.usersService.updateProfile(req.user.userId, updateData);
//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );

//     return {
//       success: true,
//       message: 'Perfil actualizado correctamente',
//       data: sanitized,
//     };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Post('change-password')
//   async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
//     return await this.usersService.changePassword(
//       req.user.userId,
//       dto.oldPassword,
//       dto.newPassword,
//     );
//   }

//   // -----------------------------
//   // Endpoints ADMIN
//   // -----------------------------

//   // Listar usuarios (solo administradores)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Get('all')
//   async listAll(
//     @Request() req,
//   ) {
//     // opcional: podes pasar query params para paginar; por ahora devolvemos todo
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   // Crear usuario por admin
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post()
//   async createByAdmin(@Body() dto: RegisterDto) {
//     const created = await this.usersService.createByAdmin(dto);
//     return { success: true, message: 'Usuario creado', data: created };
//   }

//   // Baja lógica de usuario (deshabilitar)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Delete(':id')
//   async disableUser(@Param('id') id: string) {
//     await this.usersService.disableUser(id);
//     return { success: true, message: 'Usuario deshabilitado' };
//   }

//   // Alta lógica (rehabilitar)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') id: string) {
//     await this.usersService.enableUser(id);
//     return { success: true, message: 'Usuario habilitado' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/hacer-admin')
//   async makeAdmin(@Param('id') id: string) {
//     await this.usersService.updateProfile(id, { perfil: 'administrador' });
//     return { success: true, message: 'Usuario ahora es administrador' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/hacer-usuario')
//   async makeUser(@Param('id') id: string) {
//     await this.usersService.updateProfile(id, { perfil: 'usuario' });
//     return { success: true, message: 'Usuario ahora es usuario' };
//   }
// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Put,
//   Post,
//   Body,
//   UseInterceptors,
//   UploadedFile,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UsersService } from './users.service';
// import { PostsService } from 'src/posts/posts.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { RegisterDto } from 'src/auth/dto/register.dto';
// import { CreateUserAdminDTO } from './dto/create-user-admin.dto';

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//   ) {}

//   // ===================================
//   // ENDPOINTS de USUARIO AUTENTICADO
//   // ===================================

//   // GET /users/me
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, message: 'Perfil obtenido correctamente', data: user };
//   }

//   // GET /users/me/posts
//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return { success: true, data: posts.data || posts };
//   }

//   // PUT /users/profile
//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };
//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }
//     await this.usersService.updateProfile(req.user.userId, updateData);
//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );
//     return {
//       success: true,
//       message: 'Perfil actualizado correctamente',
//       data: sanitized,
//     };
//   }

//   // POST /users/change-password
//   @UseGuards(JwtAuthGuard)
//   @Post('change-password')
//   async changePassword(
//     @Request() req,
//     @Body() dto: ChangePasswordDto,
//   ) {
//     return await this.usersService.changePassword(
//       req.user.userId,
//       dto.oldPassword,
//       dto.newPassword,
//     );
//   }

//   // -----------------------------
//   // ENDPOINTS de ADMINISTRADOR
//   // -----------------------------

//   // GET /users/all
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Get('all')
//   async listAll() {
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   // POST /users
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post()
//   async createByAdmin(@Body() dto: RegisterDto) {
//     const created = await this.usersService.createByAdmin(dto);
//     return { success: true, message: 'Usuario creado', data: created };
//   }

//   // DELETE /users/:id
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Delete(':id')
//   async disableUser(@Param('id') id: string) {
//     await this.usersService.disableUser(id);
//     return { success: true,  message: 'Usuario deshabilitado' };
//   }

//   // POST /users/:id/rehabilitar
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') id: string) {
//     await this.usersService.enableUser(id);
//     return { success: true, message: 'Usuario habilitado' };
//   }

//   // PUT /users/:id/make-admin
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-admin')
//   async makeAdmin(@Param('id') id: string) {
//     await this.usersService.makeAdmin(id);
//     return { success: true, message: 'Ahora es administrador' };
//   }

//   // PUT /users/:id/make-user
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-user')
//   async makeUser(@Param('id') id: string) {
//     await this.usersService.makeUser(id);
//     return { success: true, message: 'Ahora es usuario normal' };
//   }

//   @Post('create')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('administrador')
// @UseInterceptors(FileInterceptor('imagen'))
// async createUserFromAdmin(
//   @UploadedFile() file: Express.Multer.File,
//   @Body() body: CreateUserAdminDTO
// ) {
//   const imgUrl = file ? file.path : undefined;

//   return this.usersService.createUserFromAdmin(body, imgUrl);
// }

// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Put,
//   Post,
//   Body,
//   UseInterceptors,
//   UploadedFile,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UsersService } from './users.service';
// import { PostsService } from 'src/posts/posts.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { RegisterDto } from 'src/auth/dto/register.dto';
// import { CreateUserAdminDTO } from './dto/create-user-admin.dto';
// import { AnalyticsService } from '../analytics/analytics.service'; // <-- Agregado

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly analyticsService: AnalyticsService, // <-- Agregado
//   ) {}

//   // ===================================
//   // ENDPOINTS de USUARIO AUTENTICADO
//   // ===================================

//   // GET /users/me
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, message: 'Perfil obtenido correctamente', data: user };
//   }

//   // GET /users/:id (perfil público de otro usuario) // <-- NUEVA RUTA
//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   async getUserPublicProfile(@Param('id') id: string, @Request() req) {
//     const visitorId = req.user.userId;
//     // no registrar si el mismo usuario pide su propio /me o su /:id
//     if (visitorId !== id) {
//       try {
//         // registrar visita (analytics)
//         const ip = req.ip || req.headers['x-forwarded-for'] || null;
//         await this.analyticsService.recordProfileVisit(visitorId, id, ip, { ua: req.headers['user-agent'] });
//       } catch (e) {
//         console.error('Analytics: profile visit failed', e);
//       }
//     }

//     const user = await this.usersService.findById(id);
//     // Devolver únicamente datos públicos (ya findById excluye password)
//     return { success: true, data: user };
//   }


//   // GET /users/me/posts
//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return { success: true, data: posts.data || posts };
//   }

//   // PUT /users/profile
//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };
//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }
//     await this.usersService.updateProfile(req.user.userId, updateData);
//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );
//     return {
//       success: true,
//       message: 'Perfil actualizado correctamente',
//       data: sanitized,
//     };
//   }

//   // POST /users/change-password
//   @UseGuards(JwtAuthGuard)
//   @Post('change-password')
//   async changePassword(
//     @Request() req,
//     @Body() dto: ChangePasswordDto,
//   ) {
//     return await this.usersService.changePassword(
//       req.user.userId,
//       dto.oldPassword,
//       dto.newPassword,
//     );
//   }

//   // -----------------------------
//   // ENDPOINTS de ADMINISTRADOR
//   // -----------------------------

//   // GET /users/all
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Get('all')
//   async listAll() {
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   // POST /users
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post()
//   async createByAdmin(@Body() dto: RegisterDto) {
//     const created = await this.usersService.createByAdmin(dto);
//     return { success: true, message: 'Usuario creado', data: created };
//   }

//   // DELETE /users/:id
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Delete(':id')
//   async disableUser(@Param('id') id: string) {
//     await this.usersService.disableUser(id);
//     return { success: true,  message: 'Usuario deshabilitado' };
//   }

//   // POST /users/:id/rehabilitar
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') id: string) {
//     await this.usersService.enableUser(id);
//     return { success: true, message: 'Usuario habilitado' };
//   }

//   // PUT /users/:id/make-admin
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-admin')
//   async makeAdmin(@Param('id') id: string) {
//     await this.usersService.makeAdmin(id);
//     return { success: true, message: 'Ahora es administrador' };
//   }

//   // PUT /users/:id/make-user
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-user')
//   async makeUser(@Param('id') id: string) {
//     await this.usersService.makeUser(id);
//     return { success: true, message: 'Ahora es usuario normal' };
//   }

//   @Post('create')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('administrador')
// @UseInterceptors(FileInterceptor('imagen'))
// async createUserFromAdmin(
//   @UploadedFile() file: Express.Multer.File,
//   @Body() body: CreateUserAdminDTO
// ) {
//   const imgUrl = file ? file.path : undefined;

//   return this.usersService.createUserFromAdmin(body, imgUrl);
// }

// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Put,
//   Post,
//   Body,
//   UseInterceptors,
//   UploadedFile,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UsersService } from './users.service';
// import { PostsService } from 'src/posts/posts.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { RegisterDto } from 'src/auth/dto/register.dto';
// import { CreateUserAdminDTO } from './dto/create-user-admin.dto';

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//   ) {}

//   // ===================================
//   // ENDPOINTS de USUARIO AUTENTICADO
//   // ===================================

//   /**
//    * GET /users/me
//    * Obtiene el perfil del usuario autenticado.
//    */
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req: any) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, message: 'Perfil obtenido correctamente', data: user };
//   }

//   /**
//    * GET /users/me/posts
//    * Obtiene las publicaciones del usuario autenticado.
//    */
//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req: any) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return { success: true, data: posts.data || posts };
//   }

//   /**
//    * PUT /users/profile
//    * Actualiza el perfil del usuario autenticado (incluyendo la imagen de perfil).
//    */
//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req: any,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };
//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }
//     await this.usersService.updateProfile(req.user.userId, updateData);
//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );
//     return {
//       success: true,
//       message: 'Perfil actualizado correctamente',
//       data: sanitized,
//     };
//   }

//   /**
//    * POST /users/change-password
//    * Permite al usuario autenticado cambiar su contraseña.
//    */
//   @UseGuards(JwtAuthGuard)
//   @Post('change-password')
//   async changePassword(
//     @Request() req: any,
//     @Body() dto: ChangePasswordDto,
//   ) {
//     return await this.usersService.changePassword(
//       req.user.userId,
//       dto.oldPassword,
//       dto.newPassword,
//     );
//   }

//   // -----------------------------
//   // ENDPOINTS de ADMINISTRADOR
//   // -----------------------------

//   /**
//    * GET /users/all
//    * Lista todos los usuarios (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Get('all')
//   async listAll() {
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   /**
//    * POST /users
//    * Crea un nuevo usuario (Solo Admin). Este endpoint usa el DTO de registro estándar.
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post()
//   async createByAdmin(@Body() dto: RegisterDto) {
//     const created = await this.usersService.createByAdmin(dto);
//     return { success: true, message: 'Usuario creado', data: created };
//   }

//   /**
//    * DELETE /users/:id
//    * Deshabilita un usuario por ID (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Delete(':id')
//   async disableUser(@Param('id') id: string) {
//     await this.usersService.disableUser(id);
//     return { success: true,  message: 'Usuario deshabilitado' };
//   }

//   /**
//    * POST /users/:id/rehabilitar
//    * Rehabilita un usuario por ID (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') id: string) {
//     await this.usersService.enableUser(id);
//     return { success: true, message: 'Usuario habilitado' };
//   }

//   /**
//    * PUT /users/:id/make-admin
//    * Convierte un usuario en administrador por ID (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-admin')
//   async makeAdmin(@Param('id') id: string) {
//     await this.usersService.makeAdmin(id);
//     return { success: true, message: 'Ahora es administrador' };
//   }

//   /**
//    * PUT /users/:id/make-user
//    * Revierte un administrador a usuario normal por ID (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-user')
//   async makeUser(@Param('id') id: string) {
//     await this.usersService.makeUser(id);
//     return { success: true, message: 'Ahora es usuario normal' };
//   }

//   /**
//    * POST /users/create
//    * Crea un usuario desde el administrador con capacidad de subir una imagen (avatar).
//    * Usa un DTO específico para la creación por admin.
//    */
//   @Post('create')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async createUserFromAdmin(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: CreateUserAdminDTO
//   ) {
//     const imgUrl = file ? file.path : undefined;

//     return this.usersService.createUserFromAdmin(body, imgUrl);
//   }
// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Put,
//   Post,
//   Body,
//   UseInterceptors,
//   UploadedFile,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UsersService } from './users.service';
// import { PostsService } from 'src/posts/posts.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { RegisterDto } from 'src/auth/dto/register.dto';
// import { CreateUserAdminDTO } from './dto/create-user-admin.dto';
// import { StatsService } from '../stats/stats.service'; // <-- AGREGADO

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly statsService: StatsService, // <-- AGREGADO
//   ) {}

//   // ===================================
//   // ENDPOINTS de USUARIO AUTENTICADO
//   // ===================================

//   /**
//    * GET /users/me
//    * Obtiene el perfil del usuario autenticado.
//    */
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req: any) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, message: 'Perfil obtenido correctamente', data: user };
//   }

//   // ... (otros endpoints)

//   /**
//    * GET /users/:id
//    * Obtiene el perfil de OTRO usuario por ID.
//    */
//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   async getProfileById(@Param('id') userId: string, @Request() req: any) {
//     // 📍 PASO 2. Registrar VISITA DE PERFIL
//     // Se asume que este es el endpoint que trae el perfil de OTRO usuario.
//     if (req.user.userId !== userId) {
//       await this.statsService.register(
//         'profile_visit',
//         req.user.userId, // El ID del que visita
//         userId, // El ID del perfil visitado
//       );
//     }
//     // -------------------------------------

//     const user = await this.usersService.findById(userId);
//     return { success: true, message: 'Perfil obtenido correctamente', data: user };
//   }


//   // ... (resto del archivo users.controller.ts)
//   
//   /**
//    * GET /users/me/posts
//    * Obtiene las publicaciones del usuario autenticado.
//    */
//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req: any) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return { success: true, data: posts.data || posts };
//   }

//   /**
//    * PUT /users/profile
//    * Actualiza el perfil del usuario autenticado (incluyendo la imagen de perfil).
//    */
//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req: any,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };
//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }
//     await this.usersService.updateProfile(req.user.userId, updateData);
//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );
//     return {
//       success: true,
//       message: 'Perfil actualizado correctamente',
//       data: sanitized,
//     };
//   }

//   /**
//    * POST /users/change-password
//    * Permite al usuario autenticado cambiar su contraseña.
//    */
//   @UseGuards(JwtAuthGuard)
//   @Post('change-password')
//   async changePassword(
//     @Request() req: any,
//     @Body() dto: ChangePasswordDto,
//   ) {
//     return await this.usersService.changePassword(
//       req.user.userId,
//       dto.oldPassword,
//       dto.newPassword,
//     );
//   }

//   // -----------------------------
//   // ENDPOINTS de ADMINISTRADOR
//   // -----------------------------

//   /**
//    * GET /users/all
//    * Lista todos los usuarios (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Get('all')
//   async listAll() {
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   /**
//    * POST /users
//    * Crea un nuevo usuario (Solo Admin). Este endpoint usa el DTO de registro estándar.
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post()
//   async createByAdmin(@Body() dto: RegisterDto) {
//     const created = await this.usersService.createByAdmin(dto);
//     return { success: true, message: 'Usuario creado', data: created };
//   }

//   /**
//    * DELETE /users/:id
//    * Deshabilita un usuario por ID (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Delete(':id')
//   async disableUser(@Param('id') id: string) {
//     await this.usersService.disableUser(id);
//     return { success: true,  message: 'Usuario deshabilitado' };
//   }

//   /**
//    * POST /users/:id/rehabilitar
//    * Rehabilita un usuario por ID (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') id: string) {
//     await this.usersService.enableUser(id);
//     return { success: true, message: 'Usuario habilitado' };
//   }

//   /**
//    * PUT /users/:id/make-admin
//    * Convierte un usuario en administrador por ID (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-admin')
//   async makeAdmin(@Param('id') id: string) {
//     await this.usersService.makeAdmin(id);
//     return { success: true, message: 'Ahora es administrador' };
//   }

//   /**
//    * PUT /users/:id/make-user
//    * Revierte un administrador a usuario normal por ID (Solo Admin).
//    */
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-user')
//   async makeUser(@Param('id') id: string) {
//     await this.usersService.makeUser(id);
//     return { success: true, message: 'Ahora es usuario normal' };
//   }

//   /**
//    * POST /users/create
//    * Crea un usuario desde el administrador con capacidad de subir una imagen (avatar).
//    * Usa un DTO específico para la creación por admin.
//    */
//   @Post('create')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async createUserFromAdmin(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: CreateUserAdminDTO
//   ) {
//     const imgUrl = file ? file.path : undefined;

//     return this.usersService.createUserFromAdmin(body, imgUrl);
//   }
// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Put,
//   Post,
//   Body,
//   UseInterceptors,
//   UploadedFile,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UsersService } from './users.service';
// import { PostsService } from 'src/posts/posts.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { RegisterDto } from 'src/auth/dto/register.dto';
// import { CreateUserAdminDTO } from './dto/create-user-admin.dto';
// import { StatsService } from '../stats/stats.service';

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly statsService: StatsService,
//   ) {}

//   // ================================
//   //      RUTAS FIJAS (PRIMERO)
//   // ================================

//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req: any) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, data: user };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req: any) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return { success: true, data: posts.data || posts };
//   }

//   // ---------- ADMIN ----------

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Get('all')
//   async listAll() {
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post('create')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async createUserFromAdmin(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: CreateUserAdminDTO,
//   ) {
//     const imgUrl = file ? file.path : undefined;
//     return this.usersService.createUserFromAdmin(body, imgUrl);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post()
//   async createByAdmin(@Body() dto: RegisterDto) {
//     const created = await this.usersService.createByAdmin(dto);
//     return { success: true, message: 'Usuario creado', data: created };
//   }

//   // ======================================
//   //      RUTAS DINÁMICAS (AL FINAL)
//   // ======================================

//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   async getProfileById(@Param('id') userId: string, @Request() req: any) {
//     if (req.user.userId !== userId) {
//       await this.statsService.register(
//         'profile_visit',
//         req.user.userId,
//         userId,
//       );
//     }

//     const user = await this.usersService.findById(userId);
//     return { success: true, data: user };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req: any,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };
//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }

//     await this.usersService.updateProfile(req.user.userId, updateData);

//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );

//     return { success: true, data: sanitized };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Delete(':id')
//   async disableUser(@Param('id') id: string) {
//     await this.usersService.disableUser(id);
//     return { success: true, message: 'Usuario deshabilitado' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') id: string) {
//     await this.usersService.enableUser(id);
//     return { success: true, message: 'Usuario habilitado' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-admin')
//   async makeAdmin(@Param('id') id: string) {
//     await this.usersService.makeAdmin(id);
//     return { success: true, message: 'Ahora es administrador' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-user')
//   async makeUser(@Param('id') id: string) {
//     await this.usersService.makeUser(id);
//     return { success: true, message: 'Ahora es usuario normal' };
//   }
// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Put,
//   Post,
//   Body,
//   UseInterceptors,
//   UploadedFile,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UsersService } from './users.service';
// import { PostsService } from 'src/posts/posts.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { RegisterDto } from 'src/auth/dto/register.dto';
// import { CreateUserAdminDTO } from './dto/create-user-admin.dto';
// import { StatsService } from '../stats/stats.service';

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly statsService: StatsService,
//   ) {}

//   // ======================================
//   // PERFIL LOGUEADO
//   // ======================================

//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req: any) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, data: user };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req: any) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return { success: true, data: posts.data || posts };
//   }

//   // ======================================
//   // ADMIN
//   // ======================================

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Get('all')
//   async listAll() {
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post('create')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async createUserFromAdmin(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: CreateUserAdminDTO,
//   ) {
//     const imgUrl = file ? file.path : undefined;
//     return this.usersService.createUserFromAdmin(body, imgUrl);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post()
//   async createByAdmin(@Body() dto: RegisterDto) {
//     const created = await this.usersService.createByAdmin(dto);
//     return { success: true, message: 'Usuario creado', data: created };
//   }

//   // ======================================
//   // PERFIL AJENO
//   // ======================================

//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   async getProfileById(@Param('id') userId: string, @Request() req: any) {
//     if (req.user.userId !== userId) {
//       await this.statsService.register(
//         'profile_visit',
//         req.user.userId,
//         userId,
//       );
//     }

//     const user = await this.usersService.findById(userId);
//     return { success: true, data: user };
//   }

//   // 👉🔥 RUTA QUE FALTABA
//   @UseGuards(JwtAuthGuard)
//   @Get(':id/posts')
//   async getPostsByUser(@Param('id') userId: string) {
//     const posts = await this.postsService.findByAuthor(userId);
//     return { success: true, data: posts.data || posts };
//   }

//   // ======================================
//   // ACTUALIZAR PERFIL
//   // ======================================

//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req: any,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };
//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }

//     await this.usersService.updateProfile(req.user.userId, updateData);

//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );

//     return { success: true, data: sanitized };
//   }

//   // ======================================
//   // ADMIN ACCIONES
//   // ======================================

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Delete(':id')
//   async disableUser(@Param('id') id: string) {
//     await this.usersService.disableUser(id);
//     return { success: true, message: 'Usuario deshabilitado' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') id: string) {
//     await this.usersService.enableUser(id);
//     return { success: true, message: 'Usuario habilitado' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-admin')
//   async makeAdmin(@Param('id') id: string) {
//     await this.usersService.makeAdmin(id);
//     return { success: true, message: 'Ahora es administrador' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-user')
//   async makeUser(@Param('id') id: string) {
//     await this.usersService.makeUser(id);
//     return { success: true, message: 'Ahora es usuario normal' };
//   }
// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Put,
//   Post,
//   Body,
//   UseInterceptors,
//   UploadedFile,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { UsersService } from './users.service';
// import { PostsService } from 'src/posts/posts.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { RegisterDto } from 'src/auth/dto/register.dto';
// import { CreateUserAdminDTO } from './dto/create-user-admin.dto';
// import { StatsService } from '../stats/stats.service';

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly statsService: StatsService,
//   ) {}

//   // ======================================
//   // PERFIL LOGUEADO
//   // ======================================

//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req: any) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, data: user };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req: any) {
//     // 🔥 DEVOLVER ESTRUCTURA COMPLETA Y CONSISTENTE
//     return this.postsService.findByAuthor(req.user.userId);
//   }

//   // ======================================
//   // ADMIN
//   // ======================================

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Get('all')
//   async listAll() {
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post('create')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async createUserFromAdmin(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: CreateUserAdminDTO,
//   ) {
//     const imgUrl = file ? file.path : undefined;
//     return this.usersService.createUserFromAdmin(body, imgUrl);
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post()
//   async createByAdmin(@Body() dto: RegisterDto) {
//     const created = await this.usersService.createByAdmin(dto);
//     return { success: true, message: 'Usuario creado', data: created };
//   }

//   // ======================================
//   // PERFIL AJENO
//   // ======================================

//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   async getProfileById(@Param('id') userId: string, @Request() req: any) {
//     if (req.user.userId !== userId) {
//       await this.statsService.register(
//         'profile_visit',
//         req.user.userId,
//         userId,
//       );
//     }

//     const user = await this.usersService.findById(userId);
//     return { success: true, data: user };
//   }

//   // 🔥 RUTA CONSISTENTE PARA POSTS POR USUARIO
//   @UseGuards(JwtAuthGuard)
//   @Get(':id/posts')
//   async getPostsByUser(@Param('id') userId: string) {
//     // NO transformar la respuesta, devolverla como viene
//     return this.postsService.findByAuthor(userId);
//   }

//   // ======================================
//   // ACTUALIZAR PERFIL
//   // ======================================

//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req: any,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };
//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }

//     await this.usersService.updateProfile(req.user.userId, updateData);

//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );

//     return { success: true, data: sanitized };
//   }

//   // ======================================
//   // ADMIN ACCIONES
//   // ======================================

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Delete(':id')
//   async disableUser(@Param('id') id: string) {
//     await this.usersService.disableUser(id);
//     return { success: true, message: 'Usuario deshabilitado' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') id: string) {
//     await this.usersService.enableUser(id);
//     return { success: true, message: 'Usuario habilitado' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-admin')
//   async makeAdmin(@Param('id') id: string) {
//     await this.usersService.makeAdmin(id);
//     return { success: true, message: 'Ahora es administrador' };
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('administrador')
//   @Put(':id/make-user')
//   async makeUser(@Param('id') id: string) {
//     await this.usersService.makeUser(id);
//     return { success: true, message: 'Ahora es usuario normal' };
//   }
// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Param,
//   Put,
//   Body,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { UsersService } from './users.service';
// import { PostsService } from '../posts/posts.service';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
// import { StatsService } from '../stats/stats.service';

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly statsService: StatsService,
//   ) {}

//   // ---------------------------
//   // PERFIL PROPIO
//   // ---------------------------
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req: any) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, data: user };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req: any) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return { success: true, data: posts };
//   }

//   // ---------------------------
//   // PERFIL AJENO
//   // ---------------------------
//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   async getById(@Param('id') userId: string, @Request() req: any) {
//     if (req.user.userId !== userId) {
//       await this.statsService.register('profile_visit', req.user.userId, userId);
//     }

//     const user = await this.usersService.findById(userId);
//     return { success: true, data: user };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get(':id/posts')
//   async getUserPosts(@Param('id') userId: string) {
//     const posts = await this.postsService.findByAuthor(userId);
//     return { success: true, data: posts };
//   }

//   // ---------------------------
//   // ACTUALIZAR PERFIL
//   // ---------------------------
//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req: any,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };

//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }

//     await this.usersService.updateProfile(req.user.userId, updateData);

//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );

//     return { success: true, data: sanitized };
//   }
// }
// import {
//   Controller,
//   Get,
//   UseGuards,
//   Request,
//   Param,
//   Put,
//   Body,
//   UploadedFile,
//   UseInterceptors,
//   Post, // Importación añadida
//   Delete, // Importación añadida
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';

// // Importaciones necesarias para seguridad y roles
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { Roles } from '../common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';

// // Importaciones de servicios y DTOs
// import { UsersService } from './users.service';
// import { PostsService } from '../posts/posts.service';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
// import { StatsService } from '../stats/stats.service';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { RegisterDto } from '../auth/dto/register.dto'; // Necesaria para crear usuario

// @Controller('users')
// export class UsersController {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly statsService: StatsService,
//   ) {}

//   // ---------------------------
//   // PERFIL PROPIO
//   // ---------------------------
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getProfile(@Request() req: any) {
//     const user = await this.usersService.findById(req.user.userId);
//     return { success: true, data: user };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('me/posts')
//   async getMyPosts(@Request() req: any) {
//     const posts = await this.postsService.findByAuthor(req.user.userId);
//     return { success: true, data: posts };
//   }

//   // ---------------------------
//   // PERFIL AJENO
//   // ---------------------------
//   @UseGuards(JwtAuthGuard)
//   @Get(':id')
//   async getById(@Param('id') userId: string, @Request() req: any) {
//     if (req.user.userId !== userId) {
//       await this.statsService.register('profile_visit', req.user.userId, userId);
//     }

//     const user = await this.usersService.findById(userId);
//     return { success: true, data: user };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get(':id/posts')
//   async getUserPosts(@Param('id') userId: string) {
//     const posts = await this.postsService.findByAuthor(userId);
//     return { success: true, data: posts };
//   }

//   // ---------------------------
//   // ACTUALIZAR PERFIL
//   // ---------------------------
//   @UseGuards(JwtAuthGuard)
//   @Put('profile')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async updateProfile(
//     @Request() req: any,
//     @Body() dto: UpdateProfileDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     const updateData: any = { ...dto };

//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       updateData.avatar = upload.secure_url;
//     }

//     await this.usersService.updateProfile(req.user.userId, updateData);

//     const sanitized = await this.usersService.findByIdNoPassword(
//       req.user.userId,
//     );

//     return { success: true, data: sanitized };
//   }
  
//   // ---------------------------
//   // ADMIN (Listado y Gestión de usuarios) - SOLUCIÓN A LA TABLA NO CARGA
//   // ---------------------------
  
//   // 1. Ruta para listar todos los usuarios (SOLUCIÓN A LA TABLA NO CARGA)
//   @Roles('administrador')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Get('all')
//   async getAllUsers() {
//     const users = await this.usersService.listAll();
//     return { success: true, data: users };
//   }

//   // 2. Ruta para dar de alta un nuevo usuario (Solo Admin)
//   @Roles('administrador')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Post('create')
//   @UseInterceptors(FileInterceptor('imagen'))
//   async createNewUser(
//     @Body() dto: RegisterDto,
//     @UploadedFile() imagen?: Express.Multer.File,
//   ) {
//     let imageUrl: string | null = null;
//     if (imagen) {
//       const upload = await this.cloudinaryService.uploadImage(imagen);
//       imageUrl = upload.secure_url;
//     }
    
//     const result = await this.usersService.createUserFromAdmin(dto, imageUrl); 
//     return { success: true, ...result };
//   }

//   // 3. Ruta para deshabilitar un usuario (Baja Lógica)
//   @Roles('administrador')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Delete(':id')
//   async disableUser(@Param('id') userId: string) {
//     await this.usersService.disableUser(userId);
//     return { success: true, message: 'Usuario deshabilitado correctamente.' };
//   }

//   // 4. Ruta para rehabilitar un usuario (Alta Lógica)
//   @Roles('administrador')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Post(':id/rehabilitar')
//   async enableUser(@Param('id') userId: string) {
//     await this.usersService.enableUser(userId);
//     return { success: true, message: 'Usuario rehabilitado correctamente.' };
//   }

//   // 5. Rutas para cambiar perfil (Make Admin/User)
//   @Roles('administrador')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Put(':id/make-admin')
//   async makeAdmin(@Param('id') userId: string) {
//     await this.usersService.makeAdmin(userId);
//     return { success: true, message: 'Perfil cambiado a Administrador.' };
//   }

//   @Roles('administrador')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Put(':id/make-user')
//   async makeUser(@Param('id') userId: string) {
//     await this.usersService.makeUser(userId);
//     return { success: true, message: 'Perfil cambiado a Usuario.' };
//   }
// }
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Body,
  UploadedFile,
  UseInterceptors,
  Post,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// Importaciones necesarias para seguridad y roles
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

// Importaciones de servicios y DTOs
import { UsersService } from './users.service';
import { PostsService } from '../posts/posts.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { StatsService } from '../stats/stats.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegisterDto } from '../auth/dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly statsService: StatsService,
  ) {}

  // ===================================
  // ADMIN (SOLUCIÓN AL ERROR DE RUTEO)
  // ESTAS RUTAS DEBEN IR ANTES DE @Get(':id')
  // ===================================

  // 1. Ruta para listar todos los usuarios
  @Roles('administrador')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  async getAllUsers() {
    const users = await this.usersService.listAll();
    return { success: true, data: users };
  }

  // 2. Ruta para dar de alta un nuevo usuario
  @Roles('administrador')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('imagen'))
  async createNewUser(
    @Body() dto: RegisterDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;
    if (imagen) {
      const upload = await this.cloudinaryService.uploadImage(imagen);
      imageUrl = upload.secure_url;
    }
    const result = await this.usersService.createUserFromAdmin(dto, imageUrl);
    return { success: true, ...result };
  }

  // 3. Ruta para deshabilitar un usuario (Baja Lógica)
  @Roles('administrador')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async disableUser(@Param('id') userId: string) {
    await this.usersService.disableUser(userId);
    return { success: true, message: 'Usuario deshabilitado correctamente.' };
  }

  // 4. Ruta para rehabilitar un usuario (Alta Lógica)
  @Roles('administrador')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/rehabilitar')
  async enableUser(@Param('id') userId: string) {
    await this.usersService.enableUser(userId);
    return { success: true, message: 'Usuario rehabilitado correctamente.' };
  }

  // 5. Rutas para cambiar perfil (Make Admin/User)
  @Roles('administrador')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/make-admin')
  async makeAdmin(@Param('id') userId: string) {
    await this.usersService.makeAdmin(userId);
    return { success: true, message: 'Perfil cambiado a Administrador.' };
  }

  @Roles('administrador')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/make-user')
  async makeUser(@Param('id') userId: string) {
    await this.usersService.makeUser(userId);
    return { success: true, message: 'Perfil cambiado a Usuario.' };
  }
  
  // ===================================
  // PERFIL PROPIO (Rutas que no contienen :id)
  // ===================================
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    return { success: true, data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/posts')
  async getMyPosts(@Request() req: any) {
    const posts = await this.postsService.findByAuthor(req.user.userId);
    return { success: true, data: posts };
  }

  // ---------------------------
  // ACTUALIZAR PERFIL (Ruta fija)
  // ---------------------------
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UseInterceptors(FileInterceptor('imagen'))
  async updateProfile(
    @Request() req: any,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    const updateData: any = { ...dto };

    if (imagen) {
      const upload = await this.cloudinaryService.uploadImage(imagen);
      updateData.avatar = upload.secure_url;
    }

    await this.usersService.updateProfile(req.user.userId, updateData);

    const sanitized = await this.usersService.findByIdNoPassword(
      req.user.userId,
    );

    return { success: true, data: sanitized };
  }

  // ===================================
  // PERFIL AJENO (Rutas que contienen :id)
  // ESTAS DEBEN IR AL FINAL
  // ===================================

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') userId: string, @Request() req: any) {
    if (req.user.userId !== userId) {
      await this.statsService.register('profile_visit', req.user.userId, userId);
    }

    const user = await this.usersService.findById(userId);
    return { success: true, data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/posts')
  async getUserPosts(@Param('id') userId: string) {
    const posts = await this.postsService.findByAuthor(userId);
    return { success: true, data: posts };
  }
}