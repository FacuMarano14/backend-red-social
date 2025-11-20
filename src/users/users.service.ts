// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, UserDocument } from './schemas/user.schema';
// import { ConflictException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

//   async create(email: string, password: string, name: string): Promise<User> {
//   const existingUser = await this.userModel.findOne({ email });
//   if (existingUser) {
   
//     throw new ConflictException('El correo ya está registrado');
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = new this.userModel({ email, password: hashedPassword, name });
  
//   return user.save();
// }

//   async findByEmail(email: string): Promise<User | null> {
//     return this.userModel.findOne({ email });
//   }

//   async findAll(): Promise<User[]> {
//     return this.userModel.find({}, { password: 0 });
//   }

//   async findById(id: string) {
//     const user = await this.userModel
//       .findById(id)
//       .select('-password') // 🔒 no devolvemos el password
//       .exec();

//     if (!user) throw new NotFoundException('Usuario no encontrado');
//     return user;
//   }

//   async updateProfile(id: string, updateData: any): Promise<User> {
//     const user = await this.userModel.findById(id);
//     if (!user) throw new NotFoundException('Usuario no encontrado');

//     const allowedFields = ['descripcion', 'avatar', 'username']//['name', 'bio', 'avatar'];
//     for (const key in updateData) {
//       if (allowedFields.includes(key)) {
//         user[key] = updateData[key];
//       }
//     }

//     return user.save();
//   }


//   async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
//     const user = await this.userModel.findById(id);
//     if (!user) throw new NotFoundException('Usuario no encontrado');

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) throw new BadRequestException('La contraseña actual no es correcta');

//     const hashed = await bcrypt.hash(newPassword, 10);
//     user.password = hashed;
//     await user.save();
//   }
// }
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByIdNoPassword(id: string) {
    return this.findById(id);
  }

  // async updateProfile(id: string, updateData: any) {
  //   const user = await this.userModel.findById(id);
  //   if (!user) throw new NotFoundException('Usuario no encontrado');

  //   const allowed = [
  //     'descripcion',
  //     'avatar',
  //     'nombre',
  //     'apellido',
  //     'email',
  //     'nombre_usuario',
  //     'fecha_nacimiento',
  //   ];

  //   for (const key in updateData) {
  //     if (allowed.includes(key)) {
  //       user[key] = updateData[key];
  //     }
  //   }

  //   await user.save();
  //   return this.findByIdNoPassword(id);
  // }
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
  ];

  for (const key of allowed) {
    // 👇 NO pisar si viene undefined o null
    if (updateData[key] !== undefined && updateData[key] !== null) {
      user[key] = updateData[key];
    }
  }

  await user.save();
  return this.findByIdNoPassword(id);
}


  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) throw new BadRequestException('La contraseña actual es incorrecta');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
  }
}
