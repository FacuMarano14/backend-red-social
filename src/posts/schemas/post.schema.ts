import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Post extends Document {
  // 🟢 título del post
  @Prop({ required: true })
  titulo: string;

  // 🟢 contenido o mensaje
  @Prop({ required: true })
  contenido: string;

  // 🟢 imagen opcional (URL de Cloudinary)
  @Prop()
  imagen?: string;

  // 🟢 baja lógica (si está activo o no)
  @Prop({ default: true })
  activo: boolean;

  // 🟢 autor del post (referencia al usuario)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  autor: User;

  // 🟢 array de usuarios que dieron “me gusta”
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

