import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  // UnauthorizedException // No usada en las funciones que proporcionaste
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  // Inyección del modelo Mongoose 'User'
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ===================================
  // MÉTODOS DE BÚSQUEDA Y PERFIL
  // ===================================

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      // Excluye la contraseña del resultado
      .select('-password')
      .exec();

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // Alias para findById (obtiene el usuario sin la contraseña)
  async findByIdNoPassword(id: string) {
    return this.findById(id);
  }

  // Actualiza los datos del perfil (solo campos permitidos)
  async updateProfile(id: string, updateData: any) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const allowed = [
      'descripcion',
      'avatar',
      'nombre',
      'apellido',
      'email',
      'nombre_usuario',
      'fecha_nacimiento',
      'perfil',
    ];

    // Itera y actualiza solo los campos presentes y permitidos
    for (const key of allowed) {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        user[key] = updateData[key];
      }
    }

    await user.save();
    return this.findByIdNoPassword(id);
  }

  // Cambia la contraseña del usuario
  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Compara la contraseña antigua con el hash almacenado
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok)
      throw new BadRequestException('La contraseña actual es incorrecta');

    // Hashea la nueva contraseña y la guarda
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
  }

  // -----------------------
  // MÉTODOS ADMIN
  // -----------------------

  // Lista todos los usuarios, excluyendo la contraseña
  async listAll() {
    return this.userModel.find({}, { password: 0 }).sort({ createdAt: -1 });
  }

  // Creación de un usuario por un administrador
  async createByAdmin(dto: RegisterDto) {
    const { email, nombre_usuario, password } = dto;

    // Comprueba si el email o nombre de usuario ya existen
    const exists = await this.userModel.findOne({
      $or: [{ email }, { nombre_usuario }],
    });
    if (exists)
      throw new ConflictException('Email o nombre de usuario ya registrado');

    // Hashea la contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Crea el nuevo usuario
    const u = new this.userModel({
      ...dto,
      password: hashed,
      activo: true, // Establece como activo por defecto
      perfil: dto.perfil || 'usuario', // Asigna perfil, por defecto 'usuario'
    });

    await u.save();
    return this.userModel.findById(u._id).select('-password');
  }

  // Deshabilita un usuario por ID
  async disableUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.activo = false;
    await user.save();
  }

  // Habilita un usuario por ID
  async enableUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.activo = true;
    await user.save();
  }

  // Cambia el perfil a administrador
  async makeAdmin(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.perfil = 'administrador';
    await user.save();
  }

  // Cambia el perfil a usuario normal
  async makeUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.perfil = 'usuario';
    await user.save();
  }

  // Función para crear usuario desde el Admin
  async createUserFromAdmin(data: any, imagen: string | null) { // <--- CORRECCIÓN DE TIPO AQUÍ
    // 1. Validar existencia previa
    const exists = await this.userModel.findOne({
      $or: [{ email: data.email }, { nombre_usuario: data.nombre_usuario }],
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe un usuario con ese email o nombre de usuario.',
      );
    }

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Crear usuario
    const newUser = new this.userModel({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      nombre_usuario: data.nombre_usuario,
      password: hashedPassword, // ✅ HASH CORRECTO
      fecha_nacimiento: data.fecha_nacimiento,
      descripcion: data.descripcion ?? '',
      perfil: data.perfil || 'usuario',
      activo: true,
      avatar: imagen || null,
    });

    await newUser.save();

    // 4. Buscar nuevamente sin password (limpio)
    const cleanUser = await this.userModel
      .findById(newUser._id)
      .select('-password');

    return {
      message: 'Usuario creado correctamente',
      data: cleanUser,
    };
  }
}