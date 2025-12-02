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
// import { AnalyticsService } from 'src/analytics/analytics.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//     private jwtService: JwtService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly analyticsService: AnalyticsService,
//   ) {}

//   /**
//    * MODIFICACIÓN CLAVE: Ahora genera y devuelve el token JWT,
//    * permitiendo el inicio de sesión automático en el frontend.
//    */
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

//     // 1. Verificar si existe
//     const exists = await this.userModel.findOne({
//       $or: [{ email }, { nombre_usuario }],
//     });
//     if (exists)
//       throw new ConflictException('El email o nombre de usuario ya existen');

//     // 2. Subir imagen (si existe)
//     let avatar: string | undefined = undefined;
//     if (file) {
//       const upload = await this.cloudinaryService.uploadImage(file);
//       avatar = upload.secure_url;
//     }

//     // 3. Crear usuario
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

//     // 4. Generar Payload y Token
//     const payload = {
//       sub: newUser._id.toString(),
//       email: newUser.email,
//       nombre: newUser.nombre,
//       nombre_usuario: newUser.nombre_usuario,
//       perfil: newUser.perfil,
//     };
//     const token = this.jwtService.sign(payload); // Genera el token

//     // 5. Obtener datos limpios del usuario (sin password)
//     const cleanUser = {
//         _id: newUser._id,
//         nombre: newUser.nombre,
//         apellido: newUser.apellido,
//         email: newUser.email,
//         nombre_usuario: newUser.nombre_usuario,
//         fecha_nacimiento: newUser.fecha_nacimiento,
//         descripcion: newUser.descripcion,
//         perfil: newUser.perfil,
//         avatar: newUser.avatar,
//         activo: newUser.activo,
//         createdAt: newUser['createdAt'], // Asumiendo que Mongoose añade timestamps
//         updatedAt: newUser['updatedAt'],
//     };
    
//     // 6. Devolver la respuesta con el token y los datos limpios
//     return {
//       success: true,
//       message: 'Usuario registrado correctamente',
//       token, // DEVOLVEMOS EL TOKEN
//       data: cleanUser, // Devolvemos el objeto limpio
//     };
//   }

//   // async login(dto: LoginDto) {
//   //   const { identificador, password } = dto;

//   //   const user = await this.userModel.findOne({
//   //     $or: [{ email: identificador }, { nombre_usuario: identificador }],
//   //   });

//   //   if (!user || !user.activo)
//   //     throw new UnauthorizedException('Usuario o contraseña incorrectos');

//   //   const ok = await bcrypt.compare(password, user.password);
//   //   if (!ok)
//   //     throw new UnauthorizedException('Usuario o contraseña incorrectos');

//   //   const payload = {
//   //     sub: user._id.toString(),
//   //     email: user.email,
//   //     nombre: user.nombre,
//   //     nombre_usuario: user.nombre_usuario,
//   //     perfil: user.perfil,
//   //   };

//   //   const token = this.jwtService.sign(payload);

//   //   const clean = await this.userModel
//   //     .findById(user._id)
//   //     .select('-password');

//   //   return {
//   //     success: true,
//   //     message: 'Login correcto',
//   //     token,
//   //     data: clean,
//   //   };
//   // }
//   async login(loginDto: LoginDto, req) {
//   const user = await this.usersService.validateUser(loginDto.email, loginDto.password);

//   if (!user) {
//     return { success: false, message: 'Credenciales incorrectas' };
//   }

//   const payload = {
//     sub: user._id.toString(),
//     email: user.email,
//     nombre: user.nombre,
//     nombre_usuario: user.nombre_usuario,
//     perfil: user.perfil
//   };

//   const token = this.jwtService.sign(payload);

//   // --- TRACKING DEL LOGIN ---
//   try {
//     const ip = req.ip || req.headers['x-forwarded-for'] || null;
//     await this.analyticsService.recordLogin(
//       user._id.toString(),
//       ip,
//       { userAgent: req.headers['user-agent'] }
//     );
//   } catch (err) {
//     console.error('Error en AnalyticsService.recordLogin:', err);
//   }

//   return {
//     success: true,
//     message: 'Login correcto',
//     data: {
//       ...user.toObject(),
//       token
//     }
//   };
// }

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
// import {
//   Injectable,
//   UnauthorizedException,
//   ConflictException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// // Ya no se inyecta User, ahora se inyecta UsersService (debe importarse)
// // import { User, UserDocument } from '../users/schemas/user.schema'; 
// import { UsersService } from '../users/users.service'; // <-- Agregado
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// // CloudinaryService ya no es necesario si la lógica de creación se mueve a UsersService
// // import { CloudinaryService } from '../cloudinary/cloudinary.service'; 
// import { AnalyticsService } from 'src/analytics/analytics.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     // @InjectModel(User.name) private userModel: Model<UserDocument>, // <-- Eliminado
//     private readonly usersService: UsersService, // <-- Agregado para manejar usuarios
//     private jwtService: JwtService,
//     // private readonly cloudinaryService: CloudinaryService, // <-- Eliminado
//     private readonly analyticsService: AnalyticsService,
//   ) {}

//   // El método 'register' ahora delega la lógica al UsersService
//   async register(registerDto: RegisterDto, imagen?: Express.Multer.File) {
//     return this.usersService.createByAdmin(registerDto, imagen);
//   }

//   async login(loginDto: LoginDto, req: any) { // Se añade 'req: any' para acceder a IP/Headers
//     // 1. Validar usuario usando UsersService
//     const user = await this.usersService.validateUser(
//       loginDto.identificador, // Nota: asumimos que LoginDto usa 'identificador' (email/nombre_usuario)
//       loginDto.password,
//     );

//     if (!user) {
//       throw new UnauthorizedException('Credenciales inválidas');
//     }

//     // 2. Generar Payload y Token
//     const payload = {
//       sub: user._id.toString(),
//       email: user.email,
//       nombre: user.nombre,
//       nombre_usuario: user.nombre_usuario,
//       perfil: user.perfil,
//     };

//     const token = this.jwtService.sign(payload);

//     // 3. Registrar login en el sistema de analytics (no bloqueante)
//     try {
//       const ip = req.ip || req.headers['x-forwarded-for'] || null;
//       await this.analyticsService.recordLogin(
//         user._id.toString(),
//         ip,
//         { userAgent: req.headers['user-agent'] }
//       );
//     } catch (err) {
//       console.error('Analytics error: recordLogin failed', err);
//     }

//     // 4. Devolver la respuesta
//     return {
//       success: true,
//       message: 'Login exitoso',
//       data: {
//         ...user.toObject(),
//         token,
//       },
//     };
//   }

//   // Nota: Asumiendo que ahora 'authorizeToken' y 'refreshToken' usan UsersService
//   // o se mantendrán tal como estaban usando la inyección de Mongoose (que se eliminó)
//   // Manteniendo la lógica simple de JWT como en el ejemplo solicitado:

//   async authorizeToken(token: string) {
//     try {
//       // Simplificación: solo verifica el token, no consulta la DB si no es estrictamente necesario aquí
//       return this.jwtService.verifyAsync(token); 
//     } catch {
//       throw new UnauthorizedException('Token inválido o vencido');
//     }
//   }

//   async refreshToken(token: string) {
//     const decoded = await this.jwtService.verifyAsync(token);
//     const payload = {
//       sub: decoded.sub,
//       email: decoded.email,
//       nombre: decoded.nombre,
//       nombre_usuario: decoded.nombre_usuario,
//       perfil: decoded.perfil,
//     };

//     const newToken = this.jwtService.sign(payload);
//     return { success: true, token: newToken };
//   }
// }
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

// /**
//  * Servicio encargado de la lógica de autenticación (registro, login,
//  * autorización y refresco de tokens).
//  */
// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//     private jwtService: JwtService,
//     private readonly cloudinaryService: CloudinaryService,
//   ) {}

//   /**
//    * Registra un nuevo usuario en la base de datos.
//    * Incluye validación de existencia, subida de avatar (si aplica),
//    * hasheo de contraseña y generación de JWT para inicio de sesión automático.
//    * @param dto Datos de registro.
//    * @param file Archivo de imagen para el avatar (opcional).
//    * @returns Respuesta con el nuevo token y los datos del usuario.
//    * @throws ConflictException si el email o nombre de usuario ya existen.
//    */
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

//     // 1. Verificar si el usuario o email ya existen
//     const exists = await this.userModel.findOne({
//       $or: [{ email }, { nombre_usuario }],
//     });
//     if (exists)
//       throw new ConflictException('El email o nombre de usuario ya existen');

//     // 2. Subir imagen (si existe) a Cloudinary
//     let avatar: string | undefined = undefined;
//     if (file) {
//       const upload = await this.cloudinaryService.uploadImage(file);
//       avatar = upload.secure_url;
//     }

//     // 3. Crear usuario
//     const hashed = await bcrypt.hash(password, 10);
//     const newUser = new this.userModel({
//       nombre,
//       apellido,
//       email,
//       nombre_usuario,
//       password: hashed,
//       fecha_nacimiento,
//       descripcion,
//       perfil: perfil || 'usuario', // Asigna 'usuario' por defecto
//       avatar,
//       activo: true,
//     });
//     await newUser.save();

//     // 4. Generar Payload y Token JWT
//     const payload = {
//       sub: newUser._id.toString(), // ID del usuario como 'subject'
//       email: newUser.email,
//       nombre: newUser.nombre,
//       nombre_usuario: newUser.nombre_usuario,
//       perfil: newUser.perfil,
//       // Nota: El tiempo de expiración se configura en JwtModule.register()
//     };
//     const token = this.jwtService.sign(payload);

//     // 5. Obtener datos limpios del usuario (sin password)
//     const cleanUser = {
//         _id: newUser._id,
//         nombre: newUser.nombre,
//         apellido: newUser.apellido,
//         email: newUser.email,
//         nombre_usuario: newUser.nombre_usuario,
//         fecha_nacimiento: newUser.fecha_nacimiento,
//         descripcion: newUser.descripcion,
//         perfil: newUser.perfil,
//         avatar: newUser.avatar,
//         activo: newUser.activo,
//         createdAt: newUser['createdAt'],
//         updatedAt: newUser['updatedAt'],
//     };
    
//     // 6. Devolver la respuesta con el token y los datos limpios
//     return {
//       success: true,
//       message: 'Usuario registrado correctamente',
//       token, // Token para el inicio de sesión automático
//       data: cleanUser,
//     };
//   }

//   /**
//    * Autentica a un usuario y genera un token JWT.
//    * @param dto Datos de login (identificador puede ser email o nombre_usuario, y password).
//    * @returns Respuesta con el token JWT y los datos limpios del usuario.
//    * @throws UnauthorizedException si las credenciales son incorrectas o el usuario está inactivo.
//    */
//   async login(dto: LoginDto) {
//     const { identificador, password } = dto;

//     // Buscar por email o nombre de usuario
//     const user = await this.userModel.findOne({
//       $or: [{ email: identificador }, { nombre_usuario: identificador }],
//     });

//     if (!user || !user.activo)
//       throw new UnauthorizedException('Usuario o contraseña incorrectos');

//     // Comparar contraseña hasheada
//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok)
//       throw new UnauthorizedException('Usuario o contraseña incorrectos');

//     // Generar Payload
//     const payload = {
//       sub: user._id.toString(),
//       email: user.email,
//       nombre: user.nombre,
//       nombre_usuario: user.nombre_usuario,
//       perfil: user.perfil,
//     };

//     const token = this.jwtService.sign(payload);

//     // Obtener datos limpios sin la contraseña
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

//   /**
//    * Autoriza/Verifica la validez de un token JWT.
//    * @param token Token JWT a verificar.
//    * @returns Datos del usuario si el token es válido.
//    * @throws UnauthorizedException si el token es inválido, vencido o el usuario está inactivo.
//    */
//   async authorizeToken(token: string) {
//     try {
//       // Verifica el token y obtiene el payload
//       const payload = this.jwtService.verify(token, {
//         secret: process.env.JWT_SECRET, // Se asume que JWT_SECRET está en el .env
//       });

//       // Busca el usuario y excluye la contraseña
//       const user = await this.userModel
//         .findById(payload.sub)
//         .select('-password');

//       if (!user || !user.activo)
//         throw new UnauthorizedException('Usuario no autorizado');

//       return { success: true, data: user };
//     } catch {
//       // Captura errores de verificación (token expirado, firma inválida, etc.)
//       throw new UnauthorizedException('Token inválido o vencido');
//     }
//   }

//   /**
//    * Genera un nuevo token de acceso a partir de un token existente (o un refresh token).
//    * @param token Token JWT (generalmente un token de acceso a punto de expirar).
//    * @returns Nuevo token JWT.
//    * @throws UnauthorizedException si el token es inválido o el usuario no está activo.
//    */
//   async refreshToken(token: string) {
//     // Nota: El token a refrescar debe tener una expiración más larga o
//     // este endpoint debería usar un Refresh Token aparte. Aquí se usa el token de acceso.
//     let payload;
//     try {
//         payload = this.jwtService.decode(token);
//     } catch {
//         throw new UnauthorizedException('Token inválido');
//     }
    
//     if (!payload || !payload.sub)
//       throw new UnauthorizedException('Token inválido');

//     const user = await this.userModel.findById(payload.sub);
//     if (!user || !user.activo)
//       throw new UnauthorizedException('Usuario no autorizado');

//     // Crear un nuevo payload con datos actualizados
//     const newPayload = {
//       sub: user._id.toString(),
//       email: user.email,
//       nombre: user.nombre,
//       nombre_usuario: user.nombre_usuario,
//       perfil: user.perfil,
//     };

//     // Generar el nuevo token con una nueva expiración (por ejemplo, 15 minutos)
//     const newToken = this.jwtService.sign(newPayload, {
//       secret: process.env.JWT_SECRET,
//       expiresIn: '15m', // Se asume la configuración por defecto o se sobreescribe aquí
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