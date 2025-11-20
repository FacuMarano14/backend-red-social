import { Controller, Post, Body, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  
  @Post('register')
  @UseInterceptors(FileInterceptor('imagen'))
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() imagen?: Express.Multer.File
  ) {
    return this.authService.register(registerDto, imagen);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('autorizar')
  async autorizar(@Req() req, @Body('token') tokenFromBody?: string) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || tokenFromBody;
    

    if (!token) {
      return { success: false, message: 'Token no proporcionado' };
    }

    return this.authService.authorizeToken(token);
  }

  @Post('refrescar')
  async refrescar(@Req() req, @Body('token') tokenFromBody?: string) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || tokenFromBody;

    if (!token) {
      return { success: false, message: 'Token no proporcionado' };
    }

    return this.authService.refreshToken(token);
  }

  private _extractToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
    return null;
  }
}

