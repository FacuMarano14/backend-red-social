import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private commentsService: CommentsService, // <-- para desactivar comentarios
  ) {}

  // Crear nueva publicación
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

  // Obtener todas las publicaciones activas
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

  // Obtener una publicación por ID
  async findOne(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('autor', 'nombre apellido email nombre_usuario avatar');

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const likesCount = post.likes?.length || 0;

    return {
      success: true,
      data: {
        ...post.toObject(),
        likesCount,
      },
    };
  }

  // Dar "like" a una publicación
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

  // Quitar "like"
  async unlikePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    post.likes = post.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
    await post.save();

    return { success: true, message: 'Me gusta eliminado correctamente' };
  }

  // Eliminar publicación (solo autor o administrador)
  async delete(id: string, userId: string, isAdmin = false) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    if (!isAdmin && post.autor.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
    }

    post.activo = false;
    await post.save();

    // Desactivar comentarios asociados
    try {
      await this.commentsService.disableByPost(id);
    } catch (e) {
      console.error('Error al desactivar comentarios asociados:', e);
    }

    return { success: true, message: 'Publicación eliminada correctamente' };
  }

  // Buscar publicaciones por autor
  async findByAuthor(autorId: string) {
    const posts = await this.postModel
      .find({ autor: autorId, activo: true })
      .populate('autor', 'nombre apellido nombre_usuario email avatar')
      .sort({ createdAt: -1 });

    return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
  }

  // async statsPostsByUser(from?: string, to?: string) {
  // const match: any = { activo: true };

  // if (from || to) {
  //   match.createdAt = {};
  //   if (from) match.createdAt.$gte = new Date(from);
  //   if (to) match.createdAt.$lte = new Date(to);
  // }

  // const agg = await this.postModel.aggregate([
  //   { $match: match },
  //   { $group: { _id: '$autor', count: { $sum: 1 } } },
  //   {
  //     $lookup: {
  //       from: 'users',
  //       localField: '_id',
  //       foreignField: '_id',
  //       as: 'user',
  //     },
  //   },
  //   { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
  //   {
  //     $project: {
  //       _id: 0,
  //       userId: '$_id',
  //       nombre: { $concat: ['$user.nombre', ' ', '$user.apellido'] },
  //       nombre_usuario: '$user.nombre_usuario',
  //       count: 1,
  //     },
  //   },
  //   { $sort: { count: -1 } },
  // ]);

  // return { success: true, data: agg };
  // }
  async statsPostsByUser(from?: string, to?: string) {
  const match: any = { activo: true };

  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const agg = await this.postModel.aggregate([
    { $match: match },

    { $group: { _id: '$autor', count: { $sum: 1 } } },

    {
      $lookup: {
        from: 'users',
        let: { userId: '$_id' },   // PASAMOS EL ID DEL AUTOR
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$userId'] }
            }
          }
        ],
        as: 'user'
      }
    },

    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

    {
      $project: {
        _id: 0,
        userId: '$_id',

        nombre: {
          $ifNull: [
            {
              $cond: [
                { $and: ['$user.nombre', '$user.apellido'] },
                { $concat: ['$user.nombre', ' ', '$user.apellido'] },
                '$user.nombre_usuario'
              ]
            },
            'Sin nombre'
          ]
        },

        nombre_usuario: '$user.nombre_usuario',
        count: 1,
      },
    },

    { $sort: { count: -1 } },
  ]);

  return { success: true, data: agg };
}

}