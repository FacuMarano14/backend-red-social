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
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';
import { PostsService } from 'src/posts/posts.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ===================================
  // ENDPOINTS de USUARIO AUTENTICADO
  // ===================================

  // GET /users/me
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return { success: true, message: 'Perfil obtenido correctamente', data: user };
  }

  // GET /users/me/posts
  @UseGuards(JwtAuthGuard)
  @Get('me/posts')
  async getMyPosts(@Request() req) {
    const posts = await this.postsService.findByAuthor(req.user.userId);
    return { success: true, data: posts.data || posts };
  }

  // PUT /users/profile
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UseInterceptors(FileInterceptor('imagen'))
  async updateProfile(
    @Request() req,
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
    return {
      success: true,
      message: 'Perfil actualizado correctamente',
      data: sanitized,
    };
  }

  // POST /users/change-password
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(
      req.user.userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  // -----------------------------
  // ENDPOINTS de ADMINISTRADOR
  // -----------------------------

  // GET /users/all
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get('all')
  async listAll() {
    const users = await this.usersService.listAll();
    return { success: true, data: users };
  }

  // POST /users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  async createByAdmin(@Body() dto: RegisterDto) {
    const created = await this.usersService.createByAdmin(dto);
    return { success: true, message: 'Usuario creado', data: created };
  }

  // DELETE /users/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  async disableUser(@Param('id') id: string) {
    await this.usersService.disableUser(id);
    return { success: true, message: 'Usuario deshabilitado' };
  }

  // POST /users/:id/rehabilitar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post(':id/rehabilitar')
  async enableUser(@Param('id') id: string) {
    await this.usersService.enableUser(id);
    return { success: true, message: 'Usuario habilitado' };
  }

  // PUT /users/:id/make-admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id/make-admin')
  async makeAdmin(@Param('id') id: string) {
    await this.usersService.makeAdmin(id);
    return { success: true, message: 'Ahora es administrador' };
  }

  // PUT /users/:id/make-user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id/make-user')
  async makeUser(@Param('id') id: string) {
    await this.usersService.makeUser(id);
    return { success: true, message: 'Ahora es usuario normal' };
  }
}