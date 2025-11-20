// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Comment } from './schemas/comment.schema';

// @Injectable()
// export class CommentsService {
//   constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

//   async create(userId: string, postId: string, contenido: string) {
//     const comment = new this.commentModel({
//       contenido,
//       autor: new Types.ObjectId(userId),
//       post: new Types.ObjectId(postId),
//       activo: true,
//     });

//     await comment.save();

//     return {
//       success: true,
//       message: 'Comentario creado correctamente',
//       data: comment,
//     };
//   }

//   async findByPost(postId: string) {
//     const comments = await this.commentModel
//       .find({ post: new Types.ObjectId(postId), activo: true })
//       .populate('autor', 'nombre apellido nombre_usuario avatar')
//       .sort({ createdAt: -1 });

//     return { success: true, data: comments };
//   }

//   async delete(commentId: string, userId: string, isAdmin = false) {
//     const comment = await this.commentModel.findById(commentId);
//     if (!comment) throw new NotFoundException('Comentario no encontrado');

//     if (!isAdmin && comment.autor.toString() !== userId) {
//       throw new ForbiddenException('No puedes eliminar este comentario');
//     }

//     comment.activo = false;
//     await comment.save();

//     return { success: true, message: 'Comentario eliminado' };
//   }

//   async like(commentId: string, userId: string) {
//     const comment = await this.commentModel.findById(commentId);
//     if (!comment) throw new NotFoundException('Comentario no encontrado');

//     const userObjId = new Types.ObjectId(userId);

//     if (comment.likes.some(id => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste like a este comentario' };
//     }

//     comment.likes.push(userObjId);
//     await comment.save();

//     return { success: true, message: 'Like agregado' };
//   }

//   async unlike(commentId: string, userId: string) {
//     const comment = await this.commentModel.findById(commentId);
//     if (!comment) throw new NotFoundException('Comentario no encontrado');

//     comment.likes = comment.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
//     await comment.save();

//     return { success: true, message: 'Like quitado' };
//   }
// }

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

  // 🔹 UPDATE COMENTARIO + BANDERA modificado
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
}
