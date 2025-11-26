import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async create(userId: string, postId: string, contenido: string) {
    const comment = new this.commentModel({
      contenido,
      autor: new Types.ObjectId(userId),
      post: new Types.ObjectId(postId),
      activo: true,
    });

    await comment.save();

    return {
      success: true,
      message: 'Comentario creado correctamente',
      data: comment,
    };
  }

  // 🔹 PAGINACIÓN
  async findByPost(postId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const comments = await this.commentModel
      .find({ post: new Types.ObjectId(postId), activo: true })
      .populate('autor', 'nombre apellido nombre_usuario avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.commentModel.countDocuments({
      post: new Types.ObjectId(postId),
      activo: true,
    });

    return {
      success: true,
      page,
      limit,
      total,
      data: comments,
    };
  }


  async update(commentId: string, userId: string, contenido: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comentario no encontrado');

    if (comment.autor.toString() !== userId) {
      throw new ForbiddenException('No puedes modificar este comentario');
    }

    comment.contenido = contenido;
    comment.modificado = true;
    await comment.save();

    return { success: true, message: 'Comentario modificado', data: comment };
  }

  async delete(commentId: string, userId: string, isAdmin = false) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comentario no encontrado');

    if (!isAdmin && comment.autor.toString() !== userId) {
      throw new ForbiddenException('No puedes eliminar este comentario');
    }

    comment.activo = false;
    await comment.save();

    return { success: true, message: 'Comentario eliminado' };
  }

  async like(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comentario no encontrado');

    const userObjId = new Types.ObjectId(userId);

    if (comment.likes.some(id => id.equals(userObjId))) {
      return { success: false, message: 'Ya diste like a este comentario' };
    }

    comment.likes.push(userObjId);
    await comment.save();

    return { success: true, message: 'Like agregado' };
  }

  async unlike(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comentario no encontrado');

    comment.likes = comment.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
    await comment.save();

    return { success: true, message: 'Like quitado' };
  }

  async disableByPost(postId: string) {
    await this.commentModel.updateMany(
      { post: new Types.ObjectId(postId) },
      { $set: { activo: false } }
    );
    return { success: true, message: 'Comentarios relacionados deshabilitados' };
  }

  async statsCommentsByUser(from?: string, to?: string) {
  const match: any = { activo: true };

  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const agg = await this.commentModel.aggregate([
    { $match: match },
    { $group: { _id: '$autor', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        nombre: { $concat: ['$user.nombre', ' ', '$user.apellido'] },
        nombre_usuario: '$user.nombre_usuario',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]);

  return { success: true, data: agg };
}

async statsCommentsByPost(from?: string, to?: string) {
  const match: any = { activo: true };

  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const agg = await this.commentModel.aggregate([
    { $match: match },
    { $group: { _id: '$post', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: '_id',
        as: 'post',
      },
    },
    { $unwind: { path: '$post', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        postId: '$_id',
        titulo: '$post.titulo',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]);

  return { success: true, data: agg };
}

}
