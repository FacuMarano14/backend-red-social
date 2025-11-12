import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';
import { PostsService } from 'src/posts/posts.service'; // Asegúrate de que esta ruta sea correcta

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  // ✅ Obtener perfil del usuario autenticado (Modificado de 'profile' a 'me')
  @UseGuards(JwtAuthGuard)
  @Get('me') // Cambiado de 'profile' a 'me'
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }
    // Devolvemos el objeto user completo como se sugiere en la respuesta original
    return {
      success: true,
      message: 'Perfil obtenido correctamente',
      data: user,
    };
  }

  // ✅ Obtener publicaciones del usuario autenticado (Ajustada la estructura de retorno)
  @UseGuards(JwtAuthGuard)
  @Get('me/posts')
  async getMyPosts(@Request() req) {
    const posts = await this.postsService.findByAuthor(req.user.userId);
    return {
      success: true,
      message: 'Publicaciones del usuario autenticado', // Mensaje ajustado
      // Si postsService.findByAuthor devuelve un objeto { data: [...] }
      data: posts.data || posts, // Usamos 'data' si existe en la respuesta del servicio, sino la respuesta completa.
    };
  }

  // --- Manteniendo los endpoints existentes ---

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: users,
    };
  }

  // Se mantiene el PUT 'profile' para la actualización
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    const updated = await this.usersService.updateProfile(req.user.userId, dto);
    return {
      success: true,
      message: 'Perfil actualizado correctamente',
      data: updated,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return await this.usersService.changePassword(
      req.user.userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }
}