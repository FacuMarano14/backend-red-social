import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel('Event') private eventModel: Model<any>,
    @InjectModel('User') private userModel: Model<any>,
    @InjectModel('Post') private postModel: Model<any>,
    @InjectModel('Comment') private commentModel: Model<any>,
  ) {}

  // Registrar evento
  // Firma: (type, userId, targetId?, metadata?)
  async register(type: string, userId: string, targetId?: string, metadata: any = {}) {
    const doc = await this.eventModel.create({
      type,
      userId: userId || null,
      targetId: targetId || null,
      metadata: metadata || {},
      createdAt: new Date(),
    });
    return doc;
  }

  // ============================
  // LOGINS POR USUARIO (nombre_usuario, count)
  // ============================
  async loginsByUser(from?: string, to?: string) {
    const match: any = { type: 'login' };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const agg = await this.eventModel.aggregate([
      { $match: match },
      { $addFields: { userObj: { $toObjectId: '$userId' } } },
      { $group: { _id: '$userObj', count: { $sum: 1 } } },
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

    return agg;
  }

  // ============================
  // VISITAS A PERFIL POR USUARIO (nombre_usuario, count)
  // ============================
  async profileVisitsByUser(from?: string, to?: string) {
    const match: any = { type: 'profile_visit' };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const agg = await this.eventModel.aggregate([
      { $match: match },
      // filtrar targetId válido
      { $match: { targetId: { $regex: /^[0-9a-fA-F]{24}$/ } } },
      { $addFields: { targetObj: { $toObjectId: '$targetId' } } },
      { $group: { _id: '$targetObj', count: { $sum: 1 } } },
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

    return agg;
  }

  // ============================
  // LIKES POR DÍA (day, count)
  // ============================
  async likesByDay(from?: string, to?: string) {
    const match: any = { type: 'like' };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const agg = await this.eventModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          day: { $first: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, day: '$day', count: 1 } },
      { $sort: { day: 1 } }
    ]);

    return agg;
  }

  // ============================
  // LIKES POR POST (postId, titulo, count)
  // ============================
  async likesByPost(from?: string, to?: string) {
    const match: any = { type: 'like' };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const agg = await this.eventModel.aggregate([
      { $match: match },
      { $addFields: { postObj: { $toObjectId: '$targetId' } } },
      { $group: { _id: '$postObj', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'post'
        }
      },
      { $unwind: { path: '$post', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          postId: '$_id',
          titulo: '$post.titulo',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    return agg;
  }
}
