import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Post } from './schemas/post.schema';

import { Model, Types } from 'mongoose';

import { CommentsService } from 'src/comments/comments.service';

import { StatsService } from 'src/stats/stats.service';



@Injectable()

export class PostsService {

  constructor(

    @InjectModel(Post.name) private postModel: Model<Post>,

    private commentsService: CommentsService,

    private readonly statsService: StatsService,

  ) {}



  // Crear publicación

  async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {

    const newPost = new this.postModel({

      titulo,

      contenido,

      imagen: imageUrl || null,

      autor: new Types.ObjectId(authorId),

      activo: true,

    });



    await newPost.save();



    const saved = await this.postModel

      .findById(newPost._id)

      .populate('autor', 'nombre apellido nombre_usuario email avatar');



    return { success: true, message: 'Publicación creada correctamente', data: saved };

  }



  // Listado general con paginado/orden

  async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {

    const sortOption: any =

      orderBy === 'likes'

        ? { likesCount: -1, createdAt: -1 }

        : { createdAt: -1 };



    const posts = await this.postModel.aggregate([

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



  // Obtener uno

  async findOne(postId: string) {

    const post = await this.postModel

      .findById(postId)

      .populate('autor', 'nombre apellido nombre_usuario email avatar');



    if (!post) throw new NotFoundException('Publicación no encontrada');



    return {

      success: true,

      data: {

        ...post.toObject(),

        likesCount: post.likes?.length || 0,

      },

    };

  }



  // Dar like

  async likePost(postId: string, userId: string) {

    const post = await this.postModel.findById(postId);

    if (!post) throw new NotFoundException('Publicación no encontrada');



    const userObjId = new Types.ObjectId(userId);



    if (post.likes.some((id: Types.ObjectId) => id.equals(userObjId))) {

      return { success: false, message: 'Ya diste me gusta a esta publicación' };

    }



    post.likes.push(userObjId);

    await post.save();



    // Registrar evento en stats

    await this.statsService.register('like', userId, postId, {});



    return { success: true, message: 'Me gusta agregado correctamente' };

  }



  // Quitar like

  async unlikePost(postId: string, userId: string) {

    const post = await this.postModel.findById(postId);

    if (!post) throw new NotFoundException('Publicación no encontrada');



    post.likes = post.likes.filter((id: Types.ObjectId) => !id.equals(new Types.ObjectId(userId)));

    await post.save();



    return { success: true, message: 'Me gusta eliminado correctamente' };

  }



  // Eliminar (baja lógica)

  async delete(id: string, userId: string, isAdmin = false) {

    const post = await this.postModel.findById(id);

    if (!post) throw new NotFoundException('Publicación no encontrada');



    if (!isAdmin && post.autor.toString() !== userId) {

      throw new ForbiddenException('No tienes permiso para eliminar esta publicación');

    }



    post.activo = false;

    await post.save();

    await this.commentsService.disableByPost(id);



    return { success: true, message: 'Publicación eliminada correctamente' };

  }



  // Obtener últimas 3 publicaciones de un autor (usado por perfil)

  async findByAuthor(autorId: string) {
  // 💡 CORRECCIÓN: Quitamos new Types.ObjectId(). Mongoose convierte el string automáticamente.
  const posts = await this.postModel
    .find({ autor: autorId, activo: true }) 
    .populate('autor', 'nombre apellido nombre_usuario email avatar')
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return posts;
}



  // ============================

  // Estadística: publicaciones por usuario (usado por StatsController de posts)

  // ============================

  async statsPostsByUser(from?: string, to?: string) {

    const match: any = { activo: true };



    if (from || to) {

      match.createdAt = {};

      if (from) match.createdAt.$gte = new Date(from);

      if (to) match.createdAt.$lte = new Date(to);

    }



    const agg = await this.postModel.aggregate([

      { $match: match },



      {

        $group: {

          _id: '$autor',

          count: { $sum: 1 }

        }

      },



      {

        $lookup: {

          from: 'users',

          localField: '_id',

          foreignField: '_id',

          as: 'user'

        }

      },



      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },



      {

        $project: {

          _id: 0,

          userId: '$_id',

          nombre_usuario: { $ifNull: ['$user.nombre_usuario', 'Sin nombre'] },

          count: 1

        }

      },



      { $sort: { count: -1 } }

    ]);



    return { success: true, data: agg };

  }

}