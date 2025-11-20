// import {
//   Injectable,
//   UnauthorizedException,
//   ConflictException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, UserDocument } from '../users/schemas/user.schema';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//     private jwtService: JwtService,
//     private readonly cloudinaryService: CloudinaryService,
//   ) {}

//   // 🟢 Registro
//   async register(dto: RegisterDto, file?: Express.Multer.File) {
//     const {
//       nombre,
//       apellido,
//       email,
//       nombre_usuario,
//       password,
//       fecha_nacimiento,
//       descripcion,
//       perfil,
//     } = dto;

//     // 🔒 Validación de duplicados
//     const existing = await this.userModel.findOne({
//       $or: [{ email }, { nombre_usuario }],
//     });
//     if (existing)
//       throw new ConflictException('El email o nombre de usuario ya existen');

//     // 🔐 Hash del password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 📷 Subida de imagen opcional
//     let imageUrl: string | null = null;
//     if (file) {
//       const uploadResult = await this.cloudinaryService.uploadImage(file);
//       imageUrl = uploadResult.secure_url;
//     }

//     const newUser = new this.userModel({
//       nombre,
//       apellido,
//       email,
//       nombre_usuario,
//       password: hashedPassword,
//       fecha_nacimiento,
//       descripcion,
//       perfil: perfil || 'usuario',
//       avatar: imageUrl,
//       activo: true,
//     });

//     await newUser.save();

//     return {
//       success: true,
//       message: 'Usuario registrado correctamente',
//       data: newUser,
//     };
//   }

//   // 🟢 Login
//   async login(loginDto: LoginDto) {
//     const { identificador, password } = loginDto;

//     // Buscar por email o nombre_usuario
//     const user = await this.userModel.findOne({
//       $or: [{ email: identificador }, { nombre_usuario: identificador }],
//     });

//     if (!user || !user.activo)
//       throw new UnauthorizedException('Usuario o contraseña incorrectos');

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid)
//       throw new UnauthorizedException('Usuario o contraseña incorrectos');

//     // 🧩 Payload del token (claves consistentes con JwtStrategy)
//     const payload = {
//       sub: (user._id as any).toString(),
//       email: user.email,
//       nombre: user.nombre,
//       nombre_usuario: user.nombre_usuario,
//       perfil: user.perfil,
//     };

//     const access_token = this.jwtService.sign(payload);

//     return {
//       success: true,
//       message: 'Inicio de sesión exitoso',
//       token: access_token, // <-- renombrado para consistencia
//       data: {
//         _id: user._id,
//         nombre: user.nombre,
//         apellido: user.apellido,
//         nombre_usuario: user.nombre_usuario,
//         email: user.email,
//         perfil: user.perfil,
//         avatar: user.avatar,
//       },
//     };
//   }

//   async authorizeToken(token: string) {
//     try {
//       const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
//       // payload.sub es el userId
//       const user = await this.userModel.findById(payload.sub).select('-password').exec();
//       if (!user || !user.activo) throw new UnauthorizedException('Usuario no autorizado');
//       return { success: true, data: user };
//     } catch (err: any) {
//       // jwt.verify lanza errores si está vencido o es inválido
//       throw new UnauthorizedException('Token inválido o vencido');
//     }
//   }

//   // async refreshToken(token: string) {
//   //   try {
//   //     // Verificamos que el token sea válido (no vencido)
//   //     const payload: any = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

//   //     // Aseguramos que el usuario exista y esté activo
//   //     const user = await this.userModel.findById(payload.sub);
//   //     if (!user || !user.activo) throw new UnauthorizedException('Usuario no autorizado');

//   //     // Creamos nuevo token con misma información
//   //     const newPayload = {
//   //       sub: payload.sub,
//   //       email: payload.email,
//   //       nombre: payload.nombre,
//   //       nombre_usuario: payload.nombre_usuario,
//   //       perfil: payload.perfil,
//   //     };
//   //     const newToken = this.jwtService.sign(newPayload);

//   //     return { success: true, token: newToken };
//   //   } catch (err) {
//   //     throw new UnauthorizedException('No se puede refrescar el token: inválido o vencido');
//   //   }
//   // }

//   async refreshToken(token: string) {
//   try {
//     // 🔹 No verifica expiración → permite refrescar tokens vencidos
//     const payload: any = this.jwtService.decode(token);

//     if (!payload || !payload.sub) {
//       throw new UnauthorizedException('Token inválido');
//     }

//     const user = await this.userModel.findById(payload.sub);
//     if (!user || !user.activo) {
//       throw new UnauthorizedException('Usuario no autorizado');
//     }

//     // 🔹 Convertimos _id (unknown) a string
//     const userId = user._id.toString();

//     const newPayload = {
//       sub: userId,
//       email: user.email,
//       nombre: user.nombre,
//       nombre_usuario: user.nombre_usuario,
//       perfil: user.perfil,
//     };

//     // 🔹 Nuevo token (duración 15 minutos)
//     const newToken = this.jwtService.sign(newPayload, {
//       secret: process.env.JWT_SECRET,
//       expiresIn: '15m',
//     });

//     return { success: true, token: newToken };
//   } catch (err) {
//     throw new UnauthorizedException('No se puede refrescar el token');
//   }
// }

// }
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

    const exists = await this.userModel.findOne({
      $or: [{ email }, { nombre_usuario }],
    });
    if (exists)
      throw new ConflictException('El email o nombre de usuario ya existen');

    let avatar: string | undefined = undefined;


    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);
      avatar = upload.secure_url;
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      nombre,
      apellido,
      email,
      nombre_usuario,
      password: hashed,
      fecha_nacimiento,
      descripcion,
      perfil: perfil || 'usuario',
      avatar,
      activo: true,
    });

    await newUser.save();

    const clean = await this.userModel
      .findById(newUser._id)
      .select('-password');

    return {
      success: true,
      message: 'Usuario registrado correctamente',
      data: clean,
    };
  }

  async login(dto: LoginDto) {
    const { identificador, password } = dto;

    const user = await this.userModel.findOne({
      $or: [{ email: identificador }, { nombre_usuario: identificador }],
    });

    if (!user || !user.activo)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      nombre: user.nombre,
      nombre_usuario: user.nombre_usuario,
      perfil: user.perfil,
    };

    const token = this.jwtService.sign(payload);

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

  async authorizeToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userModel
        .findById(payload.sub)
        .select('-password');

      if (!user || !user.activo)
        throw new UnauthorizedException('Usuario no autorizado');

      return { success: true, data: user };
    } catch {
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }

  async refreshToken(token: string) {
    const payload = this.jwtService.verify(token);
    if (!payload || !payload.sub)
      throw new UnauthorizedException('Token inválido');

    const user = await this.userModel.findById(payload.sub);
    if (!user || !user.activo)
      throw new UnauthorizedException('Usuario no autorizado');

    const newPayload = {
      sub: user._id.toString(),
      email: user.email,
      nombre: user.nombre,
      nombre_usuario: user.nombre_usuario,
      perfil: user.perfil,
    };

    const newToken = this.jwtService.sign(newPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    return { success: true, token: newToken };
  }
}
