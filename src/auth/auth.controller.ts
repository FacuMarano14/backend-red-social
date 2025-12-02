import { Controller, Post, Body, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoginDto } from './dto/login.dto';
import { Request } from '@nestjs/common';

/**
 * Controlador para manejar las rutas de autenticación de usuarios.
 * Prefijo de ruta: /auth
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // Aunque CloudinaryService está inyectado, parece que la lógica de subida y registro
    // se maneja dentro de authService.register para simplificar el controlador.
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * POST /auth/register
   * Registra un nuevo usuario. Permite opcionalmente subir una imagen (avatar).
   * @param registerDto Datos de registro del usuario.
   * @param imagen Archivo de imagen subido (opcional).
   * @returns Resultado del registro.
   */
  @Post('register')
  @UseInterceptors(FileInterceptor('imagen'))
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() imagen?: Express.Multer.File
  ) {
    // La lógica de la subida y la creación del usuario se delega al servicio.
    return this.authService.register(registerDto, imagen);
  }

  /**
   * POST /auth/login
   * Autentica a un usuario con email/username y contraseña.
   * @param loginDto Credenciales de inicio de sesión.
   * @returns Token de acceso (JWT) y datos del usuario.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * POST /auth/autorizar
   * Verifica la validez de un token de acceso (JWT).
   * El token puede venir en el header 'Authorization: Bearer <token>' o en el body.
   * @param req Objeto de solicitud (Request) para acceder a los headers.
   * @param tokenFromBody Token pasado en el cuerpo de la solicitud.
   * @returns Resultado de la autorización (válido o inválido).
   */
  @Post('autorizar')
  async autorizar(@Req() req: Request, @Body('token') tokenFromBody?: string) {
    // Intenta obtener el token del header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = this._extractToken(authHeader as string) || tokenFromBody;
    

    if (!token) {
      return { success: false, message: 'Token no proporcionado' };
    }

    return this.authService.authorizeToken(token);
  }

  /**
   * POST /auth/refrescar
   * Renueva un token de acceso (generalmente usando un refresh token o un token antiguo).
   * El token a refrescar puede venir en el header 'Authorization: Bearer <token>' o en el body.
   * @param req Objeto de solicitud (Request) para acceder a los headers.
   * @param tokenFromBody Token pasado en el cuerpo de la solicitud.
   * @returns Nuevo token de acceso.
   */
  @Post('refrescar')
  async refrescar(@Req() req: Request, @Body('token') tokenFromBody?: string) {
    // Intenta obtener el token del header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = this._extractToken(authHeader as string) || tokenFromBody;

    if (!token) {
      return { success: false, message: 'Token no proporcionado' };
    }

    return this.authService.refreshToken(token);
  }

  /**
   * Método privado para extraer el token de la cabecera 'Authorization'.
   * Espera el formato 'Bearer <token>'.
   * @param authHeader Valor de la cabecera Authorization.
   * @returns El token de la parte 'Bearer', o null si no es válido.
   */
  private _extractToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
    return null;
  }
}