import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  // Crear una nueva publicación
  async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
    const newPost = new this.postModel({
      titulo,
      contenido,
      imagen: imageUrl || null,
      autor: authorId,
      activo: true, // En lugar de borrar, se usa este flag para marcar si está activa o no
    });

    await newPost.save();

    // Se vuelve a buscar el post con los datos del autor populados
    const saved = await this.postModel
      .findById(newPost._id)
      .populate('autor', 'nombre apellido email nombre_usuario avatar');

    return { success: true, message: 'Publicación creada correctamente', data: saved };
  }

  // Obtener todas las publicaciones activas (ordenadas por fecha o likes)
  async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
    const sortOption: { likesCount?: 1 | -1; createdAt: 1 | -1 } =
      orderBy === 'likes'
        ? { likesCount: -1, createdAt: -1 } // Si se ordena por likes
        : { createdAt: -1 }; // Si se ordena por fecha

    // Consulta usando agregación para calcular cantidad de likes
    const posts = await this.postModel
      .aggregate([
        { $match: { activo: true } },
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: sortOption },
        { $skip: offset },
        { $limit: limit },
      ]);

    // Se populan los datos del autor
    const populated = await this.postModel.populate(posts, {
      path: 'autor',
      select: 'nombre apellido nombre_usuario email avatar',
    });

    return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
  }

  // Dar "me gusta"
  async likePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    const userObjId = new Types.ObjectId(userId);
    // Si el usuario ya dio like, no se repite
    if (post.likes.some(id => id.equals(userObjId))) {
      return { success: false, message: 'Ya diste me gusta a esta publicación' };
    }

    post.likes.push(userObjId);
    await post.save();

    return { success: true, message: 'Me gusta agregado correctamente' };
  }

  // Quitar "me gusta"
  async unlikePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    post.likes = post.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
    await post.save();

    return { success: true, message: 'Me gusta eliminado correctamente' };
  }

  // Eliminar (solo si es el autor o admin)
  async delete(id: string, userId: string, isAdmin = false) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    // Verifica si el usuario es el autor
    if (!isAdmin && post.autor.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
    }

    // Se marca como inactiva en lugar de borrar
    post.activo = false;
    await post.save();

    return { success: true, message: 'Publicación eliminada correctamente' };
  }

  // Buscar publicaciones por autor (para el perfil)
  async findByAuthor(autorId: string) {
    const posts = await this.postModel
      .find({ autor: autorId, activo: true })
      .populate('autor', 'nombre apellido nombre_usuario email avatar')
      .sort({ createdAt: -1 });

    return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
  }

  async findOne(postId: string) {
  const post = await this.postModel
    .findById(postId)
    .populate('autor', 'nombre apellido email nombre_usuario avatar');

  if (!post) {
    throw new NotFoundException('Publicación no encontrada');
  }

  // calcular cantidad de likes
  const likesCount = post.likes?.length || 0;

  return {
    success: true,
    data: {
      ...post.toObject(),
      likesCount,
    },
  };
}
}
