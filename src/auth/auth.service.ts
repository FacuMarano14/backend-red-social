import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // 🟢 Registro
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

    // 🔒 Validación de duplicados
    const existing = await this.userModel.findOne({
      $or: [{ email }, { nombre_usuario }],
    });
    if (existing)
      throw new ConflictException('El email o nombre de usuario ya existen');

    // 🔐 Hash del password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📷 Subida de imagen opcional
    let imageUrl: string | null = null;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    const newUser = new this.userModel({
      nombre,
      apellido,
      email,
      nombre_usuario,
      password: hashedPassword,
      fecha_nacimiento,
      descripcion,
      perfil: perfil || 'usuario',
      avatar: imageUrl,
      activo: true,
    });

    await newUser.save();

    return {
      success: true,
      message: 'Usuario registrado correctamente',
      data: newUser,
    };
  }

  // 🟢 Login
  async login(loginDto: LoginDto) {
    const { identificador, password } = loginDto;

    // Buscar por email o nombre_usuario
    const user = await this.userModel.findOne({
      $or: [{ email: identificador }, { nombre_usuario: identificador }],
    });

    if (!user || !user.activo)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');

    // 🧩 Payload del token (claves consistentes con JwtStrategy)
    const payload = {
      sub: (user._id as any).toString(),
      email: user.email,
      nombre: user.nombre,
      nombre_usuario: user.nombre_usuario,
      perfil: user.perfil,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      token: access_token, // <-- renombrado para consistencia
      data: {
        _id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        nombre_usuario: user.nombre_usuario,
        email: user.email,
        perfil: user.perfil,
        avatar: user.avatar,
      },
    };
  }
}
