import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// 🔥 ESTA es la forma correcta con Mongoose 8
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  nombre_usuario: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fecha_nacimiento: string;

  @Prop()
  descripcion?: string;

  @Prop({ default: 'usuario', enum: ['usuario', 'administrador'] })
  perfil: string;

  @Prop()
  avatar?: string;

  @Prop({ default: true })
  activo: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

