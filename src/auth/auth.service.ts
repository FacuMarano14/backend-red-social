// import {
//   Injectable,
//   UnauthorizedException,
//   ConflictException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { InjectModel } from '@nestjs/mongoose';
//   import { Model } from 'mongoose';
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

//     const exists = await this.userModel.findOne({
//       $or: [{ email }, { nombre_usuario }],
//     });
//     if (exists)
//       throw new ConflictException('El email o nombre de usuario ya existen');

//     let avatar: string | undefined = undefined;


//     if (file) {
//       const upload = await this.cloudinaryService.uploadImage(file);
//       avatar = upload.secure_url;
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const newUser = new this.userModel({
//       nombre,
//       apellido,
//       email,
//       nombre_usuario,
//       password: hashed,
//       fecha_nacimiento,
//       descripcion,
//       perfil: perfil || 'usuario',
//       avatar,
//       activo: true,
//     });

//     await newUser.save();

//     const clean = await this.userModel
//       .findById(newUser._id)
//       .select('-password');

//     return {
//       success: true,
//       message: 'Usuario registrado correctamente',
//       data: clean,
//     };
//   }

//   async login(dto: LoginDto) {
//     const { identificador, password } = dto;

//     const user = await this.userModel.findOne({
//       $or: [{ email: identificador }, { nombre_usuario: identificador }],
//     });

//     if (!user || !user.activo)
//       throw new UnauthorizedException('Usuario o contraseña incorrectos');

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok)
//       throw new UnauthorizedException('Usuario o contraseña incorrectos');

//     const payload = {
//       sub: user._id.toString(),
//       email: user.email,
//       nombre: user.nombre,
//       nombre_usuario: user.nombre_usuario,
//       perfil: user.perfil,
//     };

//     const token = this.jwtService.sign(payload);

//     const clean = await this.userModel
//       .findById(user._id)
//       .select('-password');

//     return {
//       success: true,
//       message: 'Login correcto',
//       token,
//       data: clean,
//     };
//   }

//   async authorizeToken(token: string) {
//     try {
//       const payload = this.jwtService.verify(token, {
//         secret: process.env.JWT_SECRET,
//       });
//       const user = await this.userModel
//         .findById(payload.sub)
//         .select('-password');

//       if (!user || !user.activo)
//         throw new UnauthorizedException('Usuario no autorizado');

//       return { success: true, data: user };
//     } catch {
//       throw new UnauthorizedException('Token inválido o vencido');
//     }
//   }

//   async refreshToken(token: string) {
//     const payload = this.jwtService.verify(token);
//     if (!payload || !payload.sub)
//       throw new UnauthorizedException('Token inválido');

//     const user = await this.userModel.findById(payload.sub);
//     if (!user || !user.activo)
//       throw new UnauthorizedException('Usuario no autorizado');

//     const newPayload = {
//       sub: user._id.toString(),
//       email: user.email,
//       nombre: user.nombre,
//       nombre_usuario: user.nombre_usuario,
//       perfil: user.perfil,
//     };

//     const newToken = this.jwtService.sign(newPayload, {
//       secret: process.env.JWT_SECRET,
//       expiresIn: '15m',
//     });

//     return { success: true, token: newToken };
//   }
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

  /**
   * MODIFICACIÓN CLAVE: Ahora genera y devuelve el token JWT,
   * permitiendo el inicio de sesión automático en el frontend.
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

    // 1. Verificar si existe
    const exists = await this.userModel.findOne({
      $or: [{ email }, { nombre_usuario }],
    });
    if (exists)
      throw new ConflictException('El email o nombre de usuario ya existen');

    // 2. Subir imagen (si existe)
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
      perfil: perfil || 'usuario',
      avatar,
      activo: true,
    });
    await newUser.save();

    // 4. Generar Payload y Token
    const payload = {
      sub: newUser._id.toString(),
      email: newUser.email,
      nombre: newUser.nombre,
      nombre_usuario: newUser.nombre_usuario,
      perfil: newUser.perfil,
    };
    const token = this.jwtService.sign(payload); // Genera el token

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
        createdAt: newUser['createdAt'], // Asumiendo que Mongoose añade timestamps
        updatedAt: newUser['updatedAt'],
    };
    
    // 6. Devolver la respuesta con el token y los datos limpios
    return {
      success: true,
      message: 'Usuario registrado correctamente',
      token, // DEVOLVEMOS EL TOKEN
      data: cleanUser, // Devolvemos el objeto limpio
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