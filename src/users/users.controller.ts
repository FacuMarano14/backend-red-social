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