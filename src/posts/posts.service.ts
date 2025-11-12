import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
    const newPost = new this.postModel({
      titulo,
      contenido,
      imagen: imageUrl || null,
      autor: authorId,
      activo: true,
    });

    await newPost.save();

    const saved = await this.postModel
      .findById(newPost._id)
      .populate('autor', 'nombre apellido email nombre_usuario avatar');

    return { success: true, message: 'Publicación creada correctamente', data: saved };
  }

  async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
    const sortOption: { likesCount?: 1 | -1; createdAt: 1 | -1 } =
      orderBy === 'likes'
        ? { likesCount: -1, createdAt: -1 }
        : { createdAt: -1 };

    const posts = await this.postModel
      .aggregate([
        { $match: { activo: true } },
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: sortOption },
        { $skip: offset },
        { $limit: limit },
      ]);

    const populated = await this.postModel.populate(posts, {
      path: 'autor',
      select: 'nombre apellido nombre_usuario email avatar',
    });

    return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
  }

  async likePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    const userObjId = new Types.ObjectId(userId);
    if (post.likes.some(id => id.equals(userObjId))) {
      return { success: false, message: 'Ya diste me gusta a esta publicación' };
    }

    post.likes.push(userObjId);
    await post.save();

    return { success: true, message: 'Me gusta agregado correctamente' };
  }

  async unlikePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    post.likes = post.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
    await post.save();

    return { success: true, message: 'Me gusta eliminado correctamente' };
  }

  async delete(id: string, userId: string, isAdmin = false) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    if (!isAdmin && post.autor.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
    }

    post.activo = false;
    await post.save();

    return { success: true, message: 'Publicación eliminada correctamente' };
  }

  // 🟢 Buscar publicaciones por autor (para el perfil)
  async findByAuthor(autorId: string) {
    const posts = await this.postModel
      .find({ autor: autorId, activo: true })
      .populate('autor', 'nombre apellido nombre_usuario email avatar')
      .sort({ createdAt: -1 });

    return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
  }
}
