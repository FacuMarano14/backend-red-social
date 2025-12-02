// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Event, EventDocument } from './schemas/event.schema';
// import { Model } from 'mongoose';

// @Injectable()
// export class StatsService {
//   constructor(
//     @InjectModel(Event.name)
//     private readonly eventModel: Model<EventDocument>,
//   ) {}

//   async register(type: string, userId: string, targetId?: string, metadata: any = {}) {
//     return this.eventModel.create({
//       type,
//       userId,
//       targetId,
//       metadata,
//     });
//   }

//   async aggregateByUser(type: string) {
//     return this.eventModel.aggregate([
//       { $match: { type } },
//       {
//         $group: {
//           _id: '$userId',
//           count: { $sum: 1 }
//         }
//       }
//     ]);
//   }

//   async aggregateByDay(type: string) {
//     return this.eventModel.aggregate([
//       { $match: { type } },
//       {
//         $group: {
//           _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);
//   }
// }
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Event, EventDocument } from './schemas/event.schema';
// import { Model } from 'mongoose';

// @Injectable()
// export class StatsService {
//   constructor(
//     @InjectModel(Event.name)
//     private readonly eventModel: Model<EventDocument>,
//   ) {}

//   async register(type: string, userId: string, targetId?: string, metadata: any = {}) {
//     return this.eventModel.create({
//       type,
//       userId,
//       targetId,
//       metadata,
//     });
//   }

//   // =====================================
//   // 🔹 Filtro de fechas reutilizable
//   // =====================================
//   private buildDateFilter(from?: string, to?: string) {
//     const filter: any = {};

//     if (from || to) {
//       filter.createdAt = {};
//       if (from) filter.createdAt.$gte = new Date(from);
//       if (to)   filter.createdAt.$lte = new Date(to);
//     }

//     return filter;
//   }

//   // =====================================
//   // 🔹 AGRUPAR POR USUARIO
//   // =====================================
//   async aggregateByUser(type: string, from?: string, to?: string) {
//     const dateFilter = this.buildDateFilter(from, to);

//     return this.eventModel.aggregate([
//       { $match: { type, ...dateFilter } },
//       {
//         $group: {
//           _id: '$userId',
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           nombre_usuario: '$user.nombre_usuario',
//           count: 1
//         }
//       }
//     ]);
//   }

//   // =====================================
//   // 🔹 AGRUPAR POR DÍA
//   // =====================================
//   async aggregateByDay(type: string, from?: string, to?: string) {
//     const dateFilter = this.buildDateFilter(from, to);

//     return this.eventModel.aggregate([
//       { $match: { type, ...dateFilter } },
//       {
//         $group: {
//           _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           day: '$_id',
//           count: 1,
//           _id: 0
//         }
//       },
//       { $sort: { day: 1 } }
//     ]);
//   }
// }
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Event, EventDocument } from './schemas/event.schema';
// import { Model } from 'mongoose';

// @Injectable()
// export class StatsService {
//   constructor(
//     @InjectModel(Event.name)
//     private readonly eventModel: Model<EventDocument>,
//   ) {}

//   async register(type: string, userId: string, targetId?: string, metadata: any = {}) {
//     return this.eventModel.create({
//       type,
//       userId,
//       targetId,
//       metadata,
//     });
//   }

//   // =====================================
//   // 🔹 Filtro de fechas reutilizable
//   // =====================================
//   private buildDateFilter(from?: string, to?: string) {
//     const filter: any = {};

//     if (from || to) {
//       filter.createdAt = {};
//       if (from) filter.createdAt.$gte = new Date(from);
//       if (to)   filter.createdAt.$lte = new Date(to);
//     }

//     return filter;
//   }

//   // =====================================
//   // 🔹 AGRUPAR POR USUARIO (usa events collection)
//   // =====================================
//   async aggregateByUser(type: string, from?: string, to?: string) {
//     const dateFilter = this.buildDateFilter(from, to);

//     return this.eventModel.aggregate([
//       { $match: { type, ...dateFilter } },
//       {
//         $group: {
//           _id: '$userId',
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           nombre_usuario: '$user.nombre_usuario',
//           count: 1
//         }
//       }
//     ]);
//   }

//   // =====================================
//   // 🔹 AGRUPAR POR DÍA
//   // =====================================
//   async aggregateByDay(type: string, from?: string, to?: string) {
//     const dateFilter = this.buildDateFilter(from, to);

//     return this.eventModel.aggregate([
//       { $match: { type, ...dateFilter } },
//       {
//         $group: {
//           _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           day: '$_id',
//           count: 1,
//           _id: 0
//         }
//       },
//       { $sort: { day: 1 } }
//     ]);
//   }

//   // =====================================
//   // 🔹 AGRUPAR POR TARGET (por ejemplo: comentarios por post)
//   //   - agrupa por targetId y devuelve lookup con la colección especificada
//   // =====================================
//   async aggregateByTarget(type: string, targetCollection: string, targetFieldForTitle = 'titulo', from?: string, to?: string) {
//     const dateFilter = this.buildDateFilter(from, to);

//     return this.eventModel.aggregate([
//       { $match: { type, ...dateFilter } },
//       {
//         $group: {
//           _id: '$targetId',
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $lookup: {
//           from: targetCollection,
//           localField: '_id',
//           foreignField: '_id',
//           as: 'target'
//         }
//       },
//       { $unwind: { path: '$target', preserveNullAndEmptyArrays: true } },
//       {
//         $project: {
//           _id: 0,
//           targetId: '$_id',
//           title: `$target.${targetFieldForTitle}`,
//           count: 1
//         }
//       },
//       { $sort: { count: -1 } }
//     ]);
//   }
// }
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Event, EventDocument } from './schemas/event.schema';

// @Injectable()
// export class StatsService {
//   constructor(
//     @InjectModel(Event.name)
//     private eventModel: Model<EventDocument>,
//   ) {}

//   // ✔ Ahora acepta metadata
//   async register(
//     type: string,
//     userId: string,
//     targetId?: string,
//     metadata: any = {}
//   ) {
//     return this.eventModel.create({
//       type,
//       userId,
//       targetId: targetId || null,
//       metadata,
//       createdAt: new Date(),
//     });
//   }

//   // 🔥 LOGINs agrupados por usuario
//   async loginsByUser() {
//     const result = await this.eventModel.aggregate([
//       { $match: { type: 'login' } },
//       {
//         $group: {
//           _id: '$userId',
//           count: { $sum: 1 },
//         },
//       },
//       { $project: { userId: '$_id', count: 1, _id: 0 } },
//     ]);

//     return result;
//   }

//   // 🔥 visitas a perfil agrupadas por usuario visitado
//   async profileVisitsByUser() {
//     const result = await this.eventModel.aggregate([
//       { $match: { type: 'profile_visit' } },
//       {
//         $group: {
//           _id: '$targetId',
//           count: { $sum: 1 },
//         },
//       },
//       { $project: { targetId: '$_id', count: 1, _id: 0 } },
//     ]);

//     return result;
//   }

//   // 🔥 likes agrupados por post
//   async likesByPost() {
//     const result = await this.eventModel.aggregate([
//       { $match: { type: 'like' } },
//       {
//         $group: {
//           _id: '$targetId',
//           count: { $sum: 1 },
//         },
//       },
//       { $project: { postId: '$_id', count: 1, _id: 0 } },
//     ]);

//     return result;
//   }

//    async likesByDay() {
//     const result = await this.eventModel.aggregate([
//       { $match: { type: 'like' } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           day: '$_id',
//           count: 1,
//           _id: 0,
//         },
//       },
//       { $sort: { day: 1 } },
//     ]);

//     return result;
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Event, EventDocument } from './schemas/event.schema';

// @Injectable()
// export class StatsService {
//   constructor(
//     @InjectModel(Event.name)
//     private eventModel: Model<EventDocument>,
//   ) {}

//   private buildDateMatch(from?: string, to?: string) {
//     if (!from && !to) return {};

//     const createdAt: any = {};
//     if (from) createdAt.$gte = new Date(from);
//     if (to) createdAt.$lte = new Date(to);

//     return { createdAt };
//   }

//   async register(type: string, userId: string, targetId?: string, metadata: any = {}) {
//     return this.eventModel.create({
//       type,
//       userId,
//       targetId: targetId || null,
//       metadata,
//       createdAt: new Date(),
//     });
//   }

//   async loginsByUser(from?: string, to?: string) {
//     const dateMatch = this.buildDateMatch(from, to);

//     return this.eventModel.aggregate([
//       { $match: { type: 'login', ...dateMatch } },
//       { $group: { _id: '$userId', count: { $sum: 1 } } },
//       { $project: { userId: '$_id', count: 1, _id: 0 } }
//     ]);
//   }

//   async profileVisitsByUser(from?: string, to?: string) {
//     const dateMatch = this.buildDateMatch(from, to);

//     return this.eventModel.aggregate([
//       { $match: { type: 'profile_visit', ...dateMatch } },
//       { $group: { _id: '$targetId', count: { $sum: 1 } } },
//       { $project: { userId: '$_id', count: 1, _id: 0 } }
//     ]);
//   }

//   async likesByDay(from?: string, to?: string) {
//     const dateMatch = this.buildDateMatch(from, to);

//     return this.eventModel.aggregate([
//       { $match: { type: 'like', ...dateMatch } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           count: { $sum: 1 },
//         }
//       },
//       { $project: { day: '$_id', count: 1, _id: 0 } },
//       { $sort: { day: 1 } }
//     ]);
//   }
// }
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Event, EventDocument } from './schemas/event.schema';

// @Injectable()
// export class StatsService {
//   constructor(
//     @InjectModel(Event.name)
//     private eventModel: Model<EventDocument>,
//   ) {}

//   // Registrar evento
//   async register(
//     type: string,
//     userId: string,
//     targetId?: string,
//     metadata: any = {}
//   ) {
//     return this.eventModel.create({
//       type,
//       userId,
//       targetId: targetId || null,
//       metadata,
//       createdAt: new Date(),
//     });
//   }

//   // =============================
//   //      LOGINs por usuario
//   // =============================
//   async loginsByUser() {
//     return await this.eventModel.aggregate([
//       { $match: { type: 'login' } },
//       { $group: { _id: '$userId', count: { $sum: 1 } } },

//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },

//       { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           nombre_usuario: { $ifNull: ['$user.nombre_usuario', 'Sin nombre'] },
//           count: 1
//         }
//       },

//       { $sort: { count: -1 } }
//     ]);
//   }

//   // =============================
//   //  Visitas a perfil por usuario
//   // =============================
//   async profileVisitsByUser() {
//     return await this.eventModel.aggregate([
//       { $match: { type: 'profile_visit' } },
//       { $group: { _id: '$targetId', count: { $sum: 1 } } },

//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },

//       { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           nombre_usuario: { $ifNull: ['$user.nombre_usuario', 'Sin nombre'] },
//           count: 1
//         }
//       },

//       { $sort: { count: -1 } }
//     ]);
//   }

//   // =============================
//   //   Likes agrupados por post
//   // =============================
//   async likesByPost() {
//     return await this.eventModel.aggregate([
//       { $match: { type: 'like' } },
//       { $group: { _id: '$targetId', count: { $sum: 1 } } },

//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'post'
//         }
//       },

//       { $unwind: { path: '$post', preserveNullAndEmptyArrays: true } },

//       {
//         $project: {
//           _id: 0,
//           postId: '$_id',
//           titulo: '$post.titulo',
//           count: 1
//         }
//       },

//       { $sort: { count: -1 } }
//     ]);
//   }

//   // =============================
//   //     Likes agrupados por día
//   // =============================
//   async likesByDay() {
//     return await this.eventModel.aggregate([
//       { $match: { type: 'like' } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           day: '$_id',
//           count: 1,
//           _id: 0
//         }
//       },
//       { $sort: { day: 1 } }
//     ]);
//   }
// }
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Event, EventDocument } from './schemas/event.schema';

// @Injectable()
// export class StatsService {
//   constructor(
//     @InjectModel(Event.name)
//     private eventModel: Model<EventDocument>,
//   ) {}

//   // Registrar evento
//   async register(
//     type: string,
//     userId: string,
//     targetId?: string,
//     metadata: any = {}
//   ) {
//     return this.eventModel.create({
//       type,
//       userId,
//       targetId: targetId || null,
//       metadata,
//       createdAt: new Date(),
//     });
//   }

//   // =====================================================================
//   //                           LOGINs por usuario
//   // =====================================================================
//   async loginsByUser() {
//     return await this.eventModel.aggregate([
//       { $match: { type: 'login' } },

//       // 🔥 Convertir userId en ObjectId real
//       { $addFields: { userObj: { $toObjectId: '$userId' } } },

//       { $group: { _id: '$userObj', count: { $sum: 1 } } },

//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },

//       { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           nombre_usuario: { $ifNull: ['$user.nombre_usuario', 'Sin nombre'] },
//           count: 1
//         }
//       },

//       { $sort: { count: -1 } },
//     ]);
//   }

//   // =====================================================================
//   //                     Visitas a perfil por usuario
//   // =====================================================================
//   // async profileVisitsByUser() {
//   //   return await this.eventModel.aggregate([
//   //     { $match: { type: 'profile_visit' } },

//   //     // 🔥 Convertir targetId en ObjectId real
//   //     { $addFields: { targetObj: { $toObjectId: '$targetId' } } },

//   //     { $group: { _id: '$targetObj', count: { $sum: 1 } } },

//   //     {
//   //       $lookup: {
//   //         from: 'users',
//   //         localField: '_id',
//   //         foreignField: '_id',
//   //         as: 'user'
//   //       }
//   //     },

//   //     { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//   //     {
//   //       $project: {
//   //         _id: 0,
//   //         userId: '$_id',
//   //         nombre_usuario: { $ifNull: ['$user.nombre_usuario', 'Sin nombre'] },
//   //         count: 1
//   //       }
//   //     },

//   //     { $sort: { count: -1 } },
//   //   ]);
//   // }

// //   async profileVisitsByUser() {
// //   return await this.eventModel.aggregate([
// //     { $match: { type: 'profile_visit', targetId: { $ne: null } } },

// //     {
// //       $group: {
// //         _id: { $toObjectId: "$targetId" },
// //         count: { $sum: 1 }
// //       }
// //     },

// //     {
// //       $lookup: {
// //         from: 'users',
// //         localField: '_id',
// //         foreignField: '_id',
// //         as: 'user'
// //       }
// //     },

// //     { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

// //     {
// //       $project: {
// //         _id: 0,
// //         userId: '$_id',
// //         nombre_usuario: {
// //           $ifNull: ['$user.nombre_usuario', 'Usuario desconocido']
// //         },
// //         count: 1
// //       }
// //     },

// //     { $sort: { count: -1 } }
// //   ]);
// // }
//   async profileVisitsByUser() {
//   return await this.eventModel.aggregate([
//     { $match: { type: 'profile_visit', targetId: { $ne: null } } },

//     // SOLO aceptar strings de ObjectId válidos
//     {
//       $match: {
//         targetId: { $regex: /^[0-9a-fA-F]{24}$/ }
//       }
//     },

//     // Convertir solo IDs válidos
//     {
//       $addFields: {
//         targetObj: { $toObjectId: "$targetId" }
//       }
//     },

//     {
//       $group: {
//         _id: "$targetObj",
//         count: { $sum: 1 }
//       }
//     },

//     {
//       $lookup: {
//         from: 'users',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'user'
//       }
//     },

//     { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//     {
//       $project: {
//         _id: 0,
//         userId: '$_id',
//         nombre_usuario: {
//           $ifNull: ["$user.nombre_usuario", "Usuario desconocido"]
//         },
//         count: 1
//       }
//     },

//     { $sort: { count: -1 } }
//   ]);
// }



//   // =====================================================================
//   //                         Likes agrupados por post
//   // =====================================================================
//   async likesByPost() {
//     return await this.eventModel.aggregate([
//       { $match: { type: 'like' } },

//       // 🔥 Convertir targetId en ObjectId real
//       { $addFields: { targetObj: { $toObjectId: '$targetId' } } },

//       { $group: { _id: '$targetObj', count: { $sum: 1 } } },

//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'post'
//         }
//       },

//       { $unwind: { path: '$post', preserveNullAndEmptyArrays: true } },

//       {
//         $project: {
//           _id: 0,
//           postId: '$_id',
//           titulo: '$post.titulo',
//           count: 1
//         }
//       },

//       { $sort: { count: -1 } },
//     ]);
//   }

//   // =====================================================================
//   //                        Likes agrupados por día
//   // =====================================================================
//   async likesByDay() {
//     return await this.eventModel.aggregate([
//       { $match: { type: 'like' } },

//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },

//       {
//         $project: {
//           _id: 0,
//           day: '$_id',
//           count: 1
//         }
//       },

//       { $sort: { day: 1 } },
//     ]);
//   }
// }
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
