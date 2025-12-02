import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { StatsService } from '../stats/stats.service'; // <-- AGREGADO

/**
 * Servicio encargado de la lógica de autenticación (registro, login,
 * autorización y refresco de tokens).
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly statsService: StatsService, // <-- AGREGADO
  ) {}

  /**
   * Registra un nuevo usuario en la base de datos.
   * Incluye validación de existencia, subida de avatar (si aplica),
   * hasheo de contraseña y generación de JWT para inicio de sesión automático.
   * @param dto Datos de registro.
   * @param file Archivo de imagen para el avatar (opcional).
   * @returns Respuesta con el nuevo token y los datos del usuario.
   * @throws ConflictException si el email o nombre de usuario ya existen.
   */
  async register(dto: RegisterDto, file?: Express.Multer.File) {
    const {
      nombre,
      apellido,
      email,
      nombre_usuario,
      password,
      fecha_nacimiento,
      descripcion,
      perfil,
    } = dto;

    // 1. Verificar si el usuario o email ya existen
    const exists = await this.userModel.findOne({
      $or: [{ email }, { nombre_usuario }],
    });
    if (exists)
      throw new ConflictException('El email o nombre de usuario ya existen');

    // 2. Subir imagen (si existe) a Cloudinary
    let avatar: string | undefined = undefined;
    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);
      avatar = upload.secure_url;
    }

    // 3. Crear usuario
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      nombre,
      apellido,
      email,
      nombre_usuario,
      password: hashed,
      fecha_nacimiento,
      descripcion,
      perfil: perfil || 'usuario', // Asigna 'usuario' por defecto
      avatar,
      activo: true,
    });
    await newUser.save();

    // 4. Generar Payload y Token JWT
    const payload = {
      sub: newUser._id.toString(), // ID del usuario como 'subject'
      email: newUser.email,
      nombre: newUser.nombre,
      nombre_usuario: newUser.nombre_usuario,
      perfil: newUser.perfil,
      // Nota: El tiempo de expiración se configura en JwtModule.register()
    };
    const token = this.jwtService.sign(payload);

    // 5. Obtener datos limpios del usuario (sin password)
    const cleanUser = {
        _id: newUser._id,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        email: newUser.email,
        nombre_usuario: newUser.nombre_usuario,
        fecha_nacimiento: newUser.fecha_nacimiento,
        descripcion: newUser.descripcion,
        perfil: newUser.perfil,
        avatar: newUser.avatar,
        activo: newUser.activo,
        createdAt: newUser['createdAt'],
        updatedAt: newUser['updatedAt'],
    };
    
    // 6. Devolver la respuesta con el token y los datos limpios
    return {
      success: true,
      message: 'Usuario registrado correctamente',
      token, // Token para el inicio de sesión automático
      data: cleanUser,
    };
  }

  /**
   * Autentica a un usuario y genera un token JWT.
   * @param dto Datos de login (identificador puede ser email o nombre_usuario, y password).
   * @returns Respuesta con el token JWT y los datos limpios del usuario.
   * @throws UnauthorizedException si las credenciales son incorrectas o el usuario está inactivo.
   */
  async login(dto: LoginDto) {
    const { identificador, password } = dto;

    // Buscar por email o nombre de usuario
    const user = await this.userModel.findOne({
      $or: [{ email: identificador }, { nombre_usuario: identificador }],
    });

    if (!user || !user.activo)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');

    // Comparar contraseña hasheada
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');

    // 📍 PASO 1. Registrar LOGIN
    await this.statsService.register('login', user._id.toString());
    // -------------------------------------

    // Generar Payload
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      nombre: user.nombre,
      nombre_usuario: user.nombre_usuario,
      perfil: user.perfil,
    };

    const token = this.jwtService.sign(payload);

    // Obtener datos limpios sin la contraseña
    const clean = await this.userModel
      .findById(user._id)
      .select('-password');

    return {
      success: true,
      message: 'Login correcto',
      token,
      data: clean,
    };
  }

  /**
   * Autoriza/Verifica la validez de un token JWT.
   * @param token Token JWT a verificar.
   * @returns Datos del usuario si el token es válido.
   * @throws UnauthorizedException si el token es inválido, vencido o el usuario está inactivo.
   */
  async authorizeToken(token: string) {
    try {
      // Verifica el token y obtiene el payload
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // Se asume que JWT_SECRET está en el .env
      });

      // Busca el usuario y excluye la contraseña
      const user = await this.userModel
        .findById(payload.sub)
        .select('-password');

      if (!user || !user.activo)
        throw new UnauthorizedException('Usuario no autorizado');

      return { success: true, data: user };
    } catch {
      // Captura errores de verificación (token expirado, firma inválida, etc.)
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }

  /**
   * Genera un nuevo token de acceso a partir de un token existente (o un refresh token).
   * @param token Token JWT (generalmente un token de acceso a punto de expirar).
   * @returns Nuevo token JWT.
   * @throws UnauthorizedException si el token es inválido o el usuario no está activo.
   */
  async refreshToken(token: string) {
    // Nota: El token a refrescar debe tener una expiración más larga o
    // este endpoint debería usar un Refresh Token aparte. Aquí se usa el token de acceso.
    let payload;
    try {
        payload = this.jwtService.decode(token);
    } catch {
        throw new UnauthorizedException('Token inválido');
    }
    
    if (!payload || !payload.sub)
      throw new UnauthorizedException('Token inválido');

    const user = await this.userModel.findById(payload.sub);
    if (!user || !user.activo)
      throw new UnauthorizedException('Usuario no autorizado');

    // Crear un nuevo payload con datos actualizados
    const newPayload = {
      sub: user._id.toString(),
      email: user.email,
      nombre: user.nombre,
      nombre_usuario: user.nombre_usuario,
      perfil: user.perfil,
    };

    // Generar el nuevo token con una nueva expiración (por ejemplo, 15 minutos)
    const newToken = this.jwtService.sign(newPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m', // Se asume la configuración por defecto o se sobreescribe aquí
    });

    return { success: true, token: newToken };
  }
}