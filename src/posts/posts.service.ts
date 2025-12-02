// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Post } from './schemas/post.schema';
// import { CreatePostDto } from './dto/create-post.dto';
// import { CommentsService } from 'src/comments/comments.service';

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private postModel: Model<Post>,
//     private commentsService: CommentsService, // <-- para desactivar comentarios
//   ) {}

//   // Crear nueva publicación
//   async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
//     const newPost = new this.postModel({
//       titulo,
//       contenido,
//       imagen: imageUrl || null,
//       autor: authorId,
//       activo: true,
//     });

//     await newPost.save();

//     const saved = await this.postModel
//       .findById(newPost._id)
//       .populate('autor', 'nombre apellido email nombre_usuario avatar');

//     return { success: true, message: 'Publicación creada correctamente', data: saved };
//   }

//   // Obtener todas las publicaciones activas
//   async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
//     const sortOption: { likesCount?: 1 | -1; createdAt: 1 | -1 } =
//       orderBy === 'likes'
//         ? { likesCount: -1, createdAt: -1 }
//         : { createdAt: -1 };

//     const posts = await this.postModel
//       .aggregate([
//         { $match: { activo: true } },
//         { $addFields: { likesCount: { $size: '$likes' } } },
//         { $sort: sortOption },
//         { $skip: offset },
//         { $limit: limit },
//       ]);

//     const populated = await this.postModel.populate(posts, {
//       path: 'autor',
//       select: 'nombre apellido nombre_usuario email avatar',
//     });

//     return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
//   }

//   // Obtener una publicación por ID
//   async findOne(postId: string) {
//     const post = await this.postModel
//       .findById(postId)
//       .populate('autor', 'nombre apellido email nombre_usuario avatar');

//     if (!post) {
//       throw new NotFoundException('Publicación no encontrada');
//     }

//     const likesCount = post.likes?.length || 0;

//     return {
//       success: true,
//       data: {
//         ...post.toObject(),
//         likesCount,
//       },
//     };
//   }

//   // Dar "like" a una publicación
//   async likePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     const userObjId = new Types.ObjectId(userId);

//     if (post.likes.some(id => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste me gusta a esta publicación' };
//     }

//     post.likes.push(userObjId);
//     await post.save();

//     return { success: true, message: 'Me gusta agregado correctamente' };
//   }

//   // Quitar "like"
//   async unlikePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     post.likes = post.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
//     await post.save();

//     return { success: true, message: 'Me gusta eliminado correctamente' };
//   }

//   // Eliminar publicación (solo autor o administrador)
//   async delete(id: string, userId: string, isAdmin = false) {
//     const post = await this.postModel.findById(id);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     if (!isAdmin && post.autor.toString() !== userId) {
//       throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
//     }

//     post.activo = false;
//     await post.save();

//     // Desactivar comentarios asociados
//     try {
//       await this.commentsService.disableByPost(id);
//     } catch (e) {
//       console.error('Error al desactivar comentarios asociados:', e);
//     }

//     return { success: true, message: 'Publicación eliminada correctamente' };
//   }

//   // Buscar publicaciones por autor
//   async findByAuthor(autorId: string) {
//     const posts = await this.postModel
//       .find({ autor: autorId, activo: true })
//       .populate('autor', 'nombre apellido nombre_usuario email avatar')
//       .sort({ createdAt: -1 });

//     return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
//   }


//   async statsPostsByUser(from?: string, to?: string) {
//   const match: any = { activo: true };

//   if (from || to) {
//     match.createdAt = {};
//     if (from) match.createdAt.$gte = new Date(from);
//     if (to) match.createdAt.$lte = new Date(to);
//   }

//   const agg = await this.postModel.aggregate([
//     { $match: match },

//     { $group: { _id: '$autor', count: { $sum: 1 } } },

//     {
//       $lookup: {
//         from: 'users',
//         let: { userId: '$_id' },   // PASAMOS EL ID DEL AUTOR
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ['$_id', '$$userId'] }
//             }
//           }
//         ],
//         as: 'user'
//       }
//     },

//     { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//     {
//       $project: {
//         _id: 0,
//         userId: '$_id',

//         nombre: {
//           $ifNull: [
//             {
//               $cond: [
//                 { $and: ['$user.nombre', '$user.apellido'] },
//                 { $concat: ['$user.nombre', ' ', '$user.apellido'] },
//                 '$user.nombre_usuario'
//               ]
//             },
//             'Sin nombre'
//           ]
//         },

//         nombre_usuario: '$user.nombre_usuario',
//         count: 1,
//       },
//     },

//     { $sort: { count: -1 } },
//   ]);

//   return { success: true, data: agg };
// }

// }
// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Post } from './schemas/post.schema';
// import { CreatePostDto } from './dto/create-post.dto';
// import { CommentsService } from 'src/comments/comments.service';
// import { AnalyticsService } from '../analytics/analytics.service'; // <-- Agregado

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private postModel: Model<Post>,
//     private commentsService: CommentsService, // <-- para desactivar comentarios
//     private analyticsService: AnalyticsService, // <-- Agregado
//   ) {}

//   // Crear nueva publicación
//   async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
//     const newPost = new this.postModel({
//       titulo,
//       contenido,
//       imagen: imageUrl || null,
//       autor: authorId,
//       activo: true,
//     });

//     await newPost.save();

//     const saved = await this.postModel
//       .findById(newPost._id)
//       .populate('autor', 'nombre apellido email nombre_usuario avatar');

//     return { success: true, message: 'Publicación creada correctamente', data: saved };
//   }

//   // Obtener todas las publicaciones activas
//   async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
//     const sortOption: { likesCount?: 1 | -1; createdAt: 1 | -1 } =
//       orderBy === 'likes'
//         ? { likesCount: -1, createdAt: -1 }
//         : { createdAt: -1 };

//     const posts = await this.postModel
//       .aggregate([
//         { $match: { activo: true } },
//         { $addFields: { likesCount: { $size: '$likes' } } },
//         { $sort: sortOption },
//         { $skip: offset },
//         { $limit: limit },
//       ]);

//     const populated = await this.postModel.populate(posts, {
//       path: 'autor',
//       select: 'nombre apellido nombre_usuario email avatar',
//     });

//     return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
//   }

//   // Obtener una publicación por ID
//   async findOne(postId: string) {
//     const post = await this.postModel
//       .findById(postId)
//       .populate('autor', 'nombre apellido email nombre_usuario avatar');

//     if (!post) {
//       throw new NotFoundException('Publicación no encontrada');
//     }

//     const likesCount = post.likes?.length || 0;

//     return {
//       success: true,
//       data: {
//         ...post.toObject(),
//         likesCount,
//       },
//     };
//   }

//   // Dar "like" a una publicación
//   async likePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     const userObjId = new Types.ObjectId(userId);

//     if (post.likes.some(id => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste me gusta a esta publicación' };
//     }

//     post.likes.push(userObjId);
//     await post.save();
    
//     // registrar like en analytics (no bloqueante) // <-- Agregado
//     try {
//       await this.analyticsService.recordLike(userId, postId);
//     } catch (e) {
//       console.error('Analytics: recordLike failed', e);
//     }

//     return { success: true, message: 'Me gusta agregado correctamente' };
//   }

//   // Quitar "like"
//   async unlikePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     post.likes = post.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
//     await post.save();

//     return { success: true, message: 'Me gusta eliminado correctamente' };
//   }

//   // Eliminar publicación (solo autor o administrador)
//   async delete(id: string, userId: string, isAdmin = false) {
//     const post = await this.postModel.findById(id);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     if (!isAdmin && post.autor.toString() !== userId) {
//       throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
//     }

//     post.activo = false;
//     await post.save();

//     // Desactivar comentarios asociados
//     try {
//       await this.commentsService.disableByPost(id);
//     } catch (e) {
//       console.error('Error al desactivar comentarios asociados:', e);
//     }

//     return { success: true, message: 'Publicación eliminada correctamente' };
//   }

//   // Buscar publicaciones por autor
//   async findByAuthor(autorId: string) {
//     const posts = await this.postModel
//       .find({ autor: autorId, activo: true })
//       .populate('autor', 'nombre apellido nombre_usuario email avatar')
//       .sort({ createdAt: -1 });

//     return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
//   }


//   async statsPostsByUser(from?: string, to?: string) {
//   const match: any = { activo: true };

//   if (from || to) {
//     match.createdAt = {};
//     if (from) match.createdAt.$gte = new Date(from);
//     if (to) match.createdAt.$lte = new Date(to);
//   }

//   const agg = await this.postModel.aggregate([
//     { $match: match },

//     { $group: { _id: '$autor', count: { $sum: 1 } } },

//     {
//       $lookup: {
//         from: 'users',
//         let: { userId: '$_id' },   // PASAMOS EL ID DEL AUTOR
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ['$_id', '$$userId'] }
//             }
//           }
//         ],
//         as: 'user'
//       }
//     },

//     { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//     {
//       $project: {
//         _id: 0,
//         userId: '$_id',

//         nombre: {
//           $ifNull: [
//             {
//               $cond: [
//                 { $and: ['$user.nombre', '$user.apellido'] },
//                 { $concat: ['$user.nombre', ' ', '$user.apellido'] },
//                 '$user.nombre_usuario'
//               ]
//             },
//             'Sin nombre'
//           ]
//         },

//         nombre_usuario: '$user.nombre_usuario',
//         count: 1,
//       },
//     },

//     { $sort: { count: -1 } },
//   ]);

//   return { success: true, data: agg };
// }

// }

// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Post } from './schemas/post.schema';
// import { CommentsService } from 'src/comments/comments.service';

// /**
//  * Servicio para gestionar las operaciones relacionadas con las publicaciones (Posts).
//  */
// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private postModel: Model<Post>,
//     private commentsService: CommentsService, // Servicio de comentarios, usado para desactivar comentarios asociados.
//   ) {}

//   /**
//    * Crea una nueva publicación.
//    * @param authorId ID del autor.
//    * @param titulo Título de la publicación.
//    * @param contenido Contenido de la publicación.
//    * @param imageUrl URL de la imagen (opcional).
//    * @returns Objeto de respuesta con la publicación creada.
//    */
//   async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
//     const newPost = new this.postModel({
//       titulo,
//       contenido,
//       imagen: imageUrl || null,
//       autor: authorId,
//       activo: true,
//     });

//     await newPost.save();

//     // Obtener y poblar el documento guardado para devolverlo.
//     const saved = await this.postModel
//       .findById(newPost._id)
//       .populate('autor', 'nombre apellido email nombre_usuario avatar');

//     return { success: true, message: 'Publicación creada correctamente', data: saved };
//   }

//   /**
//    * Obtiene todas las publicaciones activas con opciones de paginación y ordenamiento.
//    * @param orderBy Criterio de ordenamiento ('fecha' o 'likes').
//    * @param limit Límite de resultados.
//    * @param offset Desplazamiento de la paginación.
//    * @returns Lista de publicaciones activas.
//    */
//   async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
//     const sortOption: { likesCount?: 1 | -1; createdAt: 1 | -1 } =
//       orderBy === 'likes'
//         ? { likesCount: -1, createdAt: -1 } // Ordenar por likes descendente, luego por fecha descendente
//         : { createdAt: -1 }; // Ordenar por fecha descendente

//     const posts = await this.postModel
//       .aggregate([
//         { $match: { activo: true } },
//         { $addFields: { likesCount: { $size: '$likes' } } }, // Contar el número de likes
//         { $sort: sortOption },
//         { $skip: offset },
//         { $limit: limit },
//       ]);

//     // Poblamos el campo 'autor' después de la agregación
//     const populated = await this.postModel.populate(posts, {
//       path: 'autor',
//       select: 'nombre apellido nombre_usuario email avatar',
//     });

//     return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
//   }

//   /**
//    * Obtiene una publicación activa por su ID.
//    * @param postId ID de la publicación.
//    * @returns Publicación encontrada con el conteo de likes.
//    * @throws NotFoundException si la publicación no existe.
//    */
//   async findOne(postId: string) {
//     const post = await this.postModel
//       .findById(postId)
//       .populate('autor', 'nombre apellido email nombre_usuario avatar');

//     if (!post) {
//       throw new NotFoundException('Publicación no encontrada');
//     }

//     const likesCount = post.likes?.length || 0;

//     return {
//       success: true,
//       data: {
//         ...post.toObject(),
//         likesCount,
//       },
//     };
//   }

//   /**
//    * Agrega el ID del usuario a la lista de 'likes' de una publicación.
//    * @param postId ID de la publicación.
//    * @param userId ID del usuario.
//    * @returns Objeto de respuesta.
//    * @throws NotFoundException si la publicación no existe.
//    */
//   async likePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     const userObjId = new Types.ObjectId(userId);

//     if (post.likes.some(id => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste me gusta a esta publicación' };
//     }

//     post.likes.push(userObjId);
//     await post.save();

//     return { success: true, message: 'Me gusta agregado correctamente' };
//   }

//   /**
//    * Elimina el ID del usuario de la lista de 'likes' de una publicación.
//    * @param postId ID de la publicación.
//    * @param userId ID del usuario.
//    * @returns Objeto de respuesta.
//    * @throws NotFoundException si la publicación no existe.
//    */
//   async unlikePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     // Filtrar la lista de likes para remover el ID del usuario
//     post.likes = post.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
//     await post.save();

//     return { success: true, message: 'Me gusta eliminado correctamente' };
//   }

//   /**
//    * Deshabilita (desactiva) una publicación (soft delete).
//    * Solo puede ser eliminada por el autor o un administrador.
//    * @param id ID de la publicación.
//    * @param userId ID del usuario que intenta eliminar.
//    * @param isAdmin Indica si el usuario es administrador.
//    * @returns Objeto de respuesta.
//    * @throws NotFoundException si la publicación no existe.
//    * @throws ForbiddenException si el usuario no tiene permiso.
//    */
//   async delete(id: string, userId: string, isAdmin = false) {
//     const post = await this.postModel.findById(id);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     // Verificar si el usuario es el autor o un administrador
//     if (!isAdmin && post.autor.toString() !== userId) {
//       throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
//     }

//     post.activo = false;
//     await post.save();

//     // Desactivar comentarios asociados (dependencia del CommentsService)
//     try {
//       await this.commentsService.disableByPost(id);
//     } catch (e) {
//       console.error('Error al desactivar comentarios asociados:', e);
//     }

//     return { success: true, message: 'Publicación eliminada correctamente' };
//   }

//   /**
//    * Busca todas las publicaciones activas de un autor específico.
//    * @param autorId ID del autor.
//    * @returns Lista de publicaciones del autor.
//    */
//   async findByAuthor(autorId: string) {
//     const posts = await this.postModel
//       .find({ autor: autorId, activo: true })
//       .populate('autor', 'nombre apellido nombre_usuario email avatar')
//       .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

//     return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
//   }

//   /**
//    * Genera estadísticas de publicaciones por usuario (conteo).
//    * @param from Fecha de inicio opcional para filtrar.
//    * @param to Fecha de fin opcional para filtrar.
//    * @returns Estadísticas de conteo de posts por usuario.
//    */
//   async statsPostsByUser(from?: string, to?: string) {
//     const match: any = { activo: true };

//     if (from || to) {
//       match.createdAt = {};
//       if (from) match.createdAt.$gte = new Date(from);
//       if (to) match.createdAt.$lte = new Date(to);
//     }

//     const agg = await this.postModel.aggregate([
//       // 1. Filtrar por publicaciones activas y rango de fechas (si aplica)
//       { $match: match },

//       // 2. Agrupar por autor y contar publicaciones
//       { $group: { _id: '$autor', count: { $sum: 1 } } },

//       // 3. Unir con la colección 'users' para obtener datos del autor
//       {
//         $lookup: {
//           from: 'users',
//           let: { userId: '$_id' }, // El _id del grupo es el ID del autor
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ['$_id', '$$userId'] }
//               }
//             }
//           ],
//           as: 'user'
//         }
//       },

//       // 4. Desenrollar el array 'user' resultante del $lookup
//       { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//       // 5. Proyectar los campos deseados y formatear el nombre
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',

//           // Crear un campo 'nombre' que combine nombre y apellido si existen,
//           // o usa el nombre de usuario, o 'Sin nombre' si no hay datos de usuario.
//           nombre: {
//             $ifNull: [
//               {
//                 $cond: [
//                   { $and: ['$user.nombre', '$user.apellido'] },
//                   { $concat: ['$user.nombre', ' ', '$user.apellido'] },
//                   '$user.nombre_usuario'
//                 ]
//               },
//               'Sin nombre'
//             ]
//           },

//           nombre_usuario: '$user.nombre_usuario',
//           count: 1,
//         },
//       },

//       // 6. Ordenar por conteo de publicaciones descendente
//       { $sort: { count: -1 } },
//     ]);

//     return { success: true, data: agg };
//   }
// }
// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Post } from './schemas/post.schema';
// import { CommentsService } from 'src/comments/comments.service';
// import { StatsService } from '../stats/stats.service'; // <-- AGREGADO

// /**
//  * Servicio para gestionar las operaciones relacionadas con las publicaciones (Posts).
//  */
// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private postModel: Model<Post>,
//     private commentsService: CommentsService, // Servicio de comentarios, usado para desactivar comentarios asociados.
//     private readonly statsService: StatsService, // <-- AGREGADO
//   ) {}

//   /**
//    * Crea una nueva publicación.
//    * @param authorId ID del autor.
//    * @param titulo Título de la publicación.
//    * @param contenido Contenido de la publicación.
//    * @param imageUrl URL de la imagen (opcional).
//    * @returns Objeto de respuesta con la publicación creada.
//    */
//   async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
//     const newPost = new this.postModel({
//       titulo,
//       contenido,
//       imagen: imageUrl || null,
//       autor: authorId,
//       activo: true,
//     });

//     await newPost.save();

//     // Obtener y poblar el documento guardado para devolverlo.
//     const saved = await this.postModel
//       .findById(newPost._id)
//       .populate('autor', 'nombre apellido email nombre_usuario avatar');

//     return { success: true, message: 'Publicación creada correctamente', data: saved };
//   }

//   /**
//    * Obtiene todas las publicaciones activas con opciones de paginación y ordenamiento.
//    * @param orderBy Criterio de ordenamiento ('fecha' o 'likes').
//    * @param limit Límite de resultados.
//    * @param offset Desplazamiento de la paginación.
//    * @returns Lista de publicaciones activas.
//    */
//   async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
//     const sortOption: { likesCount?: 1 | -1; createdAt: 1 | -1 } =
//       orderBy === 'likes'
//         ? { likesCount: -1, createdAt: -1 } // Ordenar por likes descendente, luego por fecha descendente
//         : { createdAt: -1 }; // Ordenar por fecha descendente

//     const posts = await this.postModel
//       .aggregate([
//         { $match: { activo: true } },
//         { $addFields: { likesCount: { $size: '$likes' } } }, // Contar el número de likes
//         { $sort: sortOption },
//         { $skip: offset },
//         { $limit: limit },
//       ]);

//     // Poblamos el campo 'autor' después de la agregación
//     const populated = await this.postModel.populate(posts, {
//       path: 'autor',
//       select: 'nombre apellido nombre_usuario email avatar',
//     });

//     return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
//   }

//   /**
//    * Obtiene una publicación activa por su ID.
//    * @param postId ID de la publicación.
//    * @returns Publicación encontrada con el conteo de likes.
//    * @throws NotFoundException si la publicación no existe.
//    */
//   async findOne(postId: string) {
//     const post = await this.postModel
//       .findById(postId)
//       .populate('autor', 'nombre apellido email nombre_usuario avatar');

//     if (!post) {
//       throw new NotFoundException('Publicación no encontrada');
//     }

//     const likesCount = post.likes?.length || 0;

//     return {
//       success: true,
//       data: {
//         ...post.toObject(),
//         likesCount,
//       },
//     };
//   }

//   /**
//    * Agrega el ID del usuario a la lista de 'likes' de una publicación.
//    * @param postId ID de la publicación.
//    * @param userId ID del usuario.
//    * @returns Objeto de respuesta.
//    * @throws NotFoundException si la publicación no existe.
//    */
//   async likePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     const userObjId = new Types.ObjectId(userId);

//     if (post.likes.some(id => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste me gusta a esta publicación' };
//     }

//     post.likes.push(userObjId);
//     await post.save();

//     // 📍 PASO 3. Registrar LIKE
//     await this.statsService.register(
//       'like',
//       userId, // El ID del que da like
//       postId // El ID del post
//     );
//     // -------------------------------------

//     return { success: true, message: 'Me gusta agregado correctamente' };
//   }

//   /**
//    * Elimina el ID del usuario de la lista de 'likes' de una publicación.
//    * @param postId ID de la publicación.
//    * @param userId ID del usuario.
//    * @returns Objeto de respuesta.
//    * @throws NotFoundException si la publicación no existe.
//    */
//   async unlikePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     // Filtrar la lista de likes para remover el ID del usuario
//     post.likes = post.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
//     await post.save();

//     return { success: true, message: 'Me gusta eliminado correctamente' };
//   }

//   /**
//    * Deshabilita (desactiva) una publicación (soft delete).
//    * Solo puede ser eliminada por el autor o un administrador.
//    * @param id ID de la publicación.
//    * @param userId ID del usuario que intenta eliminar.
//    * @param isAdmin Indica si el usuario es administrador.
//    * @returns Objeto de respuesta.
//    * @throws NotFoundException si la publicación no existe.
//    * @throws ForbiddenException si el usuario no tiene permiso.
//    */
//   async delete(id: string, userId: string, isAdmin = false) {
//     const post = await this.postModel.findById(id);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     // Verificar si el usuario es el autor o un administrador
//     if (!isAdmin && post.autor.toString() !== userId) {
//       throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
//     }

//     post.activo = false;
//     await post.save();

//     // Desactivar comentarios asociados (dependencia del CommentsService)
//     try {
//       await this.commentsService.disableByPost(id);
//     } catch (e) {
//       console.error('Error al desactivar comentarios asociados:', e);
//     }

//     return { success: true, message: 'Publicación eliminada correctamente' };
//   }

//   /**
//    * Busca todas las publicaciones activas de un autor específico.
//    * @param autorId ID del autor.
//    * @returns Lista de publicaciones del autor.
//    */
//   async findByAuthor(autorId: string) {
//     const posts = await this.postModel
//       .find({ autor: autorId, activo: true })
//       .populate('autor', 'nombre apellido nombre_usuario email avatar')
//       .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

//     return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
//   }

//   /**
//    * Genera estadísticas de publicaciones por usuario (conteo).
//    * @param from Fecha de inicio opcional para filtrar.
//    * @param to Fecha de fin opcional para filtrar.
//    * @returns Estadísticas de conteo de posts por usuario.
//    */
//   async statsPostsByUser(from?: string, to?: string) {
//     const match: any = { activo: true };

//     if (from || to) {
//       match.createdAt = {};
//       if (from) match.createdAt.$gte = new Date(from);
//       if (to) match.createdAt.$lte = new Date(to);
//     }

//     const agg = await this.postModel.aggregate([
//       // 1. Filtrar por publicaciones activas y rango de fechas (si aplica)
//       { $match: match },

//       // 2. Agrupar por autor y contar publicaciones
//       { $group: { _id: '$autor', count: { $sum: 1 } } },

//       // 3. Unir con la colección 'users' para obtener datos del autor
//       {
//         $lookup: {
//           from: 'users',
//           let: { userId: '$_id' }, // El _id del grupo es el ID del autor
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ['$_id', '$$userId'] }
//               }
//             }
//           ],
//           as: 'user'
//         }
//       },

//       // 4. Desenrollar el array 'user' resultante del $lookup
//       { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//       // 5. Proyectar los campos deseados y formatear el nombre
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',

//           // Crear un campo 'nombre' que combine nombre y apellido si existen,
//           // o usa el nombre de usuario, o 'Sin nombre' si no hay datos de usuario.
//           nombre: {
//             $ifNull: [
//               {
//                 $cond: [
//                   { $and: ['$user.nombre', '$user.apellido'] },
//                   { $concat: ['$user.nombre', ' ', '$user.apellido'] },
//                   '$user.nombre_usuario'
//                 ]
//               },
//               'Sin nombre'
//             ]
//           },

//           nombre_usuario: '$user.nombre_usuario',
//           count: 1,
//         },
//       },

//       // 6. Ordenar por conteo de publicaciones descendente
//       { $sort: { count: -1 } },
//     ]);

//     return { success: true, data: agg };
//   }
// }
// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Post } from './schemas/post.schema';
// import { CommentsService } from 'src/comments/comments.service';
// import { StatsService } from '../stats/stats.service';

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private postModel: Model<Post>,
//     private commentsService: CommentsService,
//     private readonly statsService: StatsService,
//   ) {}

//   async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
//     const newPost = new this.postModel({
//       titulo,
//       contenido,
//       imagen: imageUrl || null,
//       autor: new Types.ObjectId(authorId),
//       activo: true,
//     });

//     await newPost.save();

//     const saved = await this.postModel
//       .findById(newPost._id)
//       .populate('autor', 'nombre apellido nombre_usuario email avatar');

//     return { success: true, message: 'Publicación creada correctamente', data: saved };
//   }

//   async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
//     const sortOption: any =
//       orderBy === 'likes'
//         ? { likesCount: -1, createdAt: -1 }
//         : { createdAt: -1 };

//     const posts = await this.postModel.aggregate([
//       { $match: { activo: true } },
//       { $addFields: { likesCount: { $size: '$likes' } } },
//       { $sort: sortOption },
//       { $skip: offset },
//       { $limit: limit },
//     ]);

//     const populated = await this.postModel.populate(posts, {
//       path: 'autor',
//       select: 'nombre apellido nombre_usuario email avatar',
//     });

//     return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
//   }

//   async findOne(postId: string) {
//     const post = await this.postModel
//       .findById(postId)
//       .populate('autor', 'nombre apellido nombre_usuario email avatar');

//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     return {
//       success: true,
//       data: {
//         ...post.toObject(),
//         likesCount: post.likes?.length || 0,
//       },
//     };
//   }

//   async likePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     const userObjId = new Types.ObjectId(userId);

//     if (post.likes.some(id => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste me gusta a esta publicación' };
//     }

//     post.likes.push(userObjId);
//     await post.save();

//     await this.statsService.register('like', userId, postId);

//     return { success: true, message: 'Me gusta agregado correctamente' };
//   }

//   async unlikePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     post.likes = post.likes.filter(id => !id.equals(new Types.ObjectId(userId)));
//     await post.save();

//     return { success: true, message: 'Me gusta eliminado correctamente' };
//   }

//   async delete(id: string, userId: string, isAdmin = false) {
//     const post = await this.postModel.findById(id);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     if (!isAdmin && post.autor.toString() !== userId) {
//       throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
//     }

//     post.activo = false;
//     await post.save();
//     await this.commentsService.disableByPost(id);

//     return { success: true, message: 'Publicación eliminada correctamente' };
//   }

//   async findByAuthor(autorId: string) {
//     const posts = await this.postModel
//       .find({ autor: new Types.ObjectId(autorId), activo: true })
//       .populate('autor', 'nombre apellido nombre_usuario email avatar')
//       .sort({ createdAt: -1 });

//     return { success: true, message: 'Publicaciones del usuario obtenidas correctamente', data: posts };
//   }

//   // ============================
//   // 📊 Publicaciones por usuario
//   // ============================
// //   async statsPostsByUser(from?: string, to?: string) {
// //     const match: any = { activo: true };

// //     if (from || to) {
// //       match.createdAt = {};
// //       if (from) match.createdAt.$gte = new Date(from);
// //       if (to) match.createdAt.$lte = new Date(to);
// //     }

// //     const agg = await this.postModel.aggregate([
// //       { $match: match },

// //       { $group: { _id: '$autor', count: { $sum: 1 } } },

// //       {
// //         $lookup: {
// //           from: 'users',
// //           localField: '_id',
// //           foreignField: '_id',
// //           as: 'user'
// //         }
// //       },

// //       { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

// //       {
// //         $project: {
// //           _id: 0,
// //           userId: '$_id',

// //           nombre_usuario: {
// //             $ifNull: ['$user.nombre_usuario', 'Sin nombre']
// //           },

// //           nombre: {
// //             $ifNull: [
// //               { $concat: ['$user.nombre', ' ', '$user.apellido'] },
// //               '$user.nombre_usuario'
// //             ]
// //           },

// //           count: 1
// //         }
// //       },

// //       { $sort: { count: -1 } }
// //     ]);

// //     return { success: true, data: agg };
// //   }
// // }
// async statsPostsByUser(from?: string, to?: string) {
//   const match: any = { activo: true };

//   if (from || to) {
//     match.createdAt = {};
//     if (from) match.createdAt.$gte = new Date(from);
//     if (to) match.createdAt.$lte = new Date(to);
//   }

//   const agg = await this.postModel.aggregate([
//     { $match: match },

//     {
//       $group: {
//         _id: {
//           $cond: [
//             { $eq: [{ $type: "$autor" }, "string"] },
//             { $toObjectId: "$autor" },
//             "$autor"
//           ]
//         },
//         count: { $sum: 1 }
//       }
//     },

//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "_id",
//         as: "user"
//       }
//     },

//     { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

//     {
//       $project: {
//         _id: 0,
//         userId: "$_id",
//         nombre_usuario: {
//           $ifNull: ["$user.nombre_usuario", "Usuario desconocido"]
//         },
//         count: 1
//       }
//     },

//     { $sort: { count: -1 } }
//   ]);

//   return { success: true, data: agg };
// }
// }
// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Post } from './schemas/post.schema';
// import { Model, Types } from 'mongoose';
// import { CommentsService } from 'src/comments/comments.service';
// import { StatsService } from 'src/stats/stats.service';

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private postModel: Model<Post>,
//     private commentsService: CommentsService,
//     private readonly statsService: StatsService,
//   ) {}

//   // Crear publicación
//   async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
//     const newPost = new this.postModel({
//       titulo,
//       contenido,
//       imagen: imageUrl || null,
//       autor: new Types.ObjectId(authorId),
//       activo: true,
//     });

//     await newPost.save();

//     const saved = await this.postModel
//       .findById(newPost._id)
//       .populate('autor', 'nombre apellido nombre_usuario email avatar');

//     return { success: true, message: 'Publicación creada correctamente', data: saved };
//   }

//   // Listado general con paginado/orden
//   async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
//     const sortOption: any =
//       orderBy === 'likes'
//         ? { likesCount: -1, createdAt: -1 }
//         : { createdAt: -1 };

//     const posts = await this.postModel.aggregate([
//       { $match: { activo: true } },
//       { $addFields: { likesCount: { $size: '$likes' } } },
//       { $sort: sortOption },
//       { $skip: offset },
//       { $limit: limit },
//     ]);

//     const populated = await this.postModel.populate(posts, {
//       path: 'autor',
//       select: 'nombre apellido nombre_usuario email avatar',
//     });

//     return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
//   }

//   // Obtener uno
//   async findOne(postId: string) {
//     const post = await this.postModel
//       .findById(postId)
//       .populate('autor', 'nombre apellido nombre_usuario email avatar');

//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     return {
//       success: true,
//       data: {
//         ...post.toObject(),
//         likesCount: post.likes?.length || 0,
//       },
//     };
//   }

//   // Dar like
//   async likePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     const userObjId = new Types.ObjectId(userId);

//     if (post.likes.some((id: Types.ObjectId) => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste me gusta a esta publicación' };
//     }

//     post.likes.push(userObjId);
//     await post.save();

//     // Registrar evento en stats
//     await this.statsService.register('like', userId, postId, {});

//     return { success: true, message: 'Me gusta agregado correctamente' };
//   }

//   // Quitar like
//   async unlikePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     post.likes = post.likes.filter((id: Types.ObjectId) => !id.equals(new Types.ObjectId(userId)));
//     await post.save();

//     return { success: true, message: 'Me gusta eliminado correctamente' };
//   }

//   // Eliminar (baja lógica)
//   async delete(id: string, userId: string, isAdmin = false) {
//     const post = await this.postModel.findById(id);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     if (!isAdmin && post.autor.toString() !== userId) {
//       throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
//     }

//     post.activo = false;
//     await post.save();
//     await this.commentsService.disableByPost(id);

//     return { success: true, message: 'Publicación eliminada correctamente' };
//   }

//   // Obtener últimas 3 publicaciones de un autor (usado por perfil)
// //   async findByAuthor(autorId: string) {
// //     const posts = await this.postModel
// //       .find({ autor: new Types.ObjectId(autorId), activo: true })
// //       .populate('autor', 'nombre apellido nombre_usuario email avatar')
// //       .sort({ createdAt: -1 })
// //       .limit(3)
// //       .lean();

// //     return posts;
// //   }
// async findByAuthor(autorId: string) {
//   // 💡 CORRECCIÓN: Quitamos new Types.ObjectId(). Mongoose convierte el string automáticamente.
//   const posts = await this.postModel
//     .find({ autor: autorId, activo: true }) 
//     .populate('autor', 'nombre apellido nombre_usuario email avatar')
//     .sort({ createdAt: -1 })
//     .limit(3)
//     .lean();

//   return posts;
// }

//   // ============================
//   // Estadística: publicaciones por usuario (usado por StatsController de posts)
//   // ============================
//   async statsPostsByUser(from?: string, to?: string) {
//     const match: any = { activo: true };

//     if (from || to) {
//       match.createdAt = {};
//       if (from) match.createdAt.$gte = new Date(from);
//       if (to) match.createdAt.$lte = new Date(to);
//     }

//     const agg = await this.postModel.aggregate([
//       { $match: match },

//       {
//         $group: {
//           _id: '$autor',
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

//     return { success: true, data: agg };
//   }
// }

// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Post } from './schemas/post.schema';
// import { Model, Types } from 'mongoose';
// import { CommentsService } from 'src/comments/comments.service';
// import { StatsService } from 'src/stats/stats.service';

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private postModel: Model<Post>,
//     private commentsService: CommentsService,
//     private readonly statsService: StatsService,
//   ) {}

//   // Crear publicación
//   async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
//     const newPost = new this.postModel({
//       titulo,
//       contenido,
//       imagen: imageUrl || null,
//       autor: new Types.ObjectId(authorId),
//       activo: true,
//     });

//     await newPost.save();

//     const saved = await this.postModel
//       .findById(newPost._id)
//       .populate('autor', 'nombre apellido nombre_usuario email avatar');

//     return { success: true, message: 'Publicación creada correctamente', data: saved };
//   }

//   // Listado general con paginado/orden
//   async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
//     const sortOption: any =
//       orderBy === 'likes'
//         ? { likesCount: -1, createdAt: -1 }
//         : { createdAt: -1 };

//     const posts = await this.postModel.aggregate([
//       { $match: { activo: true } },
//       { $addFields: { likesCount: { $size: '$likes' } } },
//       { $sort: sortOption },
//       { $skip: offset },
//       { $limit: limit },
//     ]);

//     const populated = await this.postModel.populate(posts, {
//       path: 'autor',
//       select: 'nombre apellido nombre_usuario email avatar',
//     });

//     return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
//   }

//   // Obtener uno
//   async findOne(postId: string) {
//     const post = await this.postModel
//       .findById(postId)
//       .populate('autor', 'nombre apellido nombre_usuario email avatar');

//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     return {
//       success: true,
//       data: {
//         ...post.toObject(),
//         likesCount: post.likes?.length || 0,
//       },
//     };
//   }

//   // Dar like
//   async likePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     const userObjId = new Types.ObjectId(userId);

//     if (post.likes.some((id: Types.ObjectId) => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste me gusta a esta publicación' };
//     }

//     post.likes.push(userObjId);
//     await post.save();

//     // Registrar evento en stats
//     await this.statsService.register('like', userId, postId, {});

//     return { success: true, message: 'Me gusta agregado correctamente' };
//   }

//   // Quitar like
//   async unlikePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     post.likes = post.likes.filter((id: Types.ObjectId) => !id.equals(new Types.ObjectId(userId)));
//     await post.save();

//     return { success: true, message: 'Me gusta eliminado correctamente' };
//   }

//   // Eliminar (baja lógica)
//   async delete(id: string, userId: string, isAdmin = false) {
//     const post = await this.postModel.findById(id);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     if (!isAdmin && post.autor.toString() !== userId) {
//       throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
//     }

//     post.activo = false;
//     await post.save();
//     await this.commentsService.disableByPost(id);

//     return { success: true, message: 'Publicación eliminada correctamente' };
//   }

//   // Obtener últimas 3 publicaciones de un autor (usado por perfil)
// //   async findByAuthor(autorId: string) {
// //     // 💡 CORRECCIÓN: Creamos el ObjectId explícitamente para asegurar la consulta.
// //     const authorObjectId = new Types.ObjectId(autorId);

// //     const posts = await this.postModel
// //       .find({ autor: authorObjectId, activo: true })
// //       .populate('autor', 'nombre apellido nombre_usuario email avatar')
// //       .sort({ createdAt: -1 })
// //       .limit(3)
// //       .lean();

// //     return posts;
// //   }
// async findByAuthor(autorId: string) {
//     let authorObjectId: Types.ObjectId;

//     try {
//       // 💡 ÚLTIMA CORRECCIÓN: Intentar crear el ObjectId. Si falla, el ID era inválido.
//       authorObjectId = new Types.ObjectId(autorId);
//     } catch (e) {
//       // Si el ID no es un formato válido de MongoDB, retornamos un array vacío.
//       return [];
//     }
    
//     const posts = await this.postModel
//       .find({ autor: authorObjectId, activo: true })
//       .populate('autor', 'nombre apellido nombre_usuario email avatar')
//       .sort({ createdAt: -1 })
//       .limit(3)
//       .lean();

//     return posts;
//   }

//   // ============================
//   // Estadística: publicaciones por usuario (usado por StatsController de posts)
//   // ============================
//   async statsPostsByUser(from?: string, to?: string) {
//     const match: any = { activo: true };

//     if (from || to) {
//       match.createdAt = {};
//       if (from) match.createdAt.$gte = new Date(from);
//       if (to) match.createdAt.$lte = new Date(to);
//     }

//     const agg = await this.postModel.aggregate([
//       { $match: match },

//       {
//         $group: {
//           _id: '$autor',
//           count: { $sum: 1 }
//         }
//       },

//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },

//       { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           nombre_usuario: { $ifNull: ['$user.nombre_usuario', 'Sin nombre'] },
//           count: 1
//         }
//       },

//       { $sort: { count: -1 } }
//     ]);

//     return { success: true, data: agg };
//   }
// }
// backend/src/posts/posts.service.ts (Versión Corregida)

// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Post } from './schemas/post.schema';
// import { Model, Types } from 'mongoose';
// import { CommentsService } from 'src/comments/comments.service';
// import { StatsService } from 'src/stats/stats.service';

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private postModel: Model<Post>,
//     private commentsService: CommentsService,
//     private readonly statsService: StatsService,
//   ) {}

//   // Crear publicación
//   async create(authorId: string, titulo: string, contenido: string, imageUrl?: string) {
//     const newPost = new this.postModel({
//       titulo,
//       contenido,
//       imagen: imageUrl || null,
//       autor: new Types.ObjectId(authorId),
//       activo: true,
//     });

//     await newPost.save();

//     const saved = await this.postModel
//       .findById(newPost._id)
//       .populate('autor', 'nombre apellido nombre_usuario email avatar');

//     return { success: true, message: 'Publicación creada correctamente', data: saved };
//   }

//   // Listado general con paginado/orden
//   async findAll(orderBy: 'fecha' | 'likes' = 'fecha', limit = 10, offset = 0) {
//     const sortOption: any =
//       orderBy === 'likes'
//         ? { likesCount: -1, createdAt: -1 }
//         : { createdAt: -1 };

//     const posts = await this.postModel.aggregate([
//       { $match: { activo: true } },
//       { $addFields: { likesCount: { $size: '$likes' } } },
//       { $sort: sortOption },
//       { $skip: offset },
//       { $limit: limit },
//     ]);

//     const populated = await this.postModel.populate(posts, {
//       path: 'autor',
//       select: 'nombre apellido nombre_usuario email avatar',
//     });

//     return { success: true, message: 'Publicaciones obtenidas correctamente', data: populated };
//   }

//   // Obtener uno
//   async findOne(postId: string) {
//     const post = await this.postModel
//       .findById(postId)
//       .populate('autor', 'nombre apellido nombre_usuario email avatar');

//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     return {
//       success: true,
//       data: {
//         ...post.toObject(),
//         likesCount: post.likes?.length || 0,
//       },
//     };
//   }

//   // Dar like
//   async likePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     const userObjId = new Types.ObjectId(userId);

//     if (post.likes.some((id: Types.ObjectId) => id.equals(userObjId))) {
//       return { success: false, message: 'Ya diste me gusta a esta publicación' };
//     }

//     post.likes.push(userObjId);
//     await post.save();

//     // Registrar evento en stats
//     await this.statsService.register('like', userId, postId, {});

//     return { success: true, message: 'Me gusta agregado correctamente' };
//   }

//   // Quitar like
//   async unlikePost(postId: string, userId: string) {
//     const post = await this.postModel.findById(postId);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     post.likes = post.likes.filter((id: Types.ObjectId) => !id.equals(new Types.ObjectId(userId)));
//     await post.save();

//     return { success: true, message: 'Me gusta eliminado correctamente' };
//   }

//   // Eliminar (baja lógica)
//   async delete(id: string, userId: string, isAdmin = false) {
//     const post = await this.postModel.findById(id);
//     if (!post) throw new NotFoundException('Publicación no encontrada');

//     if (!isAdmin && post.autor.toString() !== userId) {
//       throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
//     }

//     post.activo = false;
//     await post.save();
//     await this.commentsService.disableByPost(id);

//     return { success: true, message: 'Publicación eliminada correctamente' };
//   }

//   // Obtener últimas 3 publicaciones de un autor (usado por perfil)
//   async findByAuthor(autorId: string) {
//     // 💡 CORRECCIÓN ROBUSTA: Validamos antes de intentar la conversión.
//     if (!Types.ObjectId.isValid(autorId)) {
//       return []; // Si el ID no es válido, retornamos un array vacío de inmediato.
//     }
    
//     const authorObjectId = new Types.ObjectId(autorId);

//     const posts = await this.postModel
//       .find({ autor: authorObjectId, activo: true })
//       .populate('autor', 'nombre apellido nombre_usuario email avatar')
//       .sort({ createdAt: -1 })
//       .limit(3)
//       .lean();

//     return posts;
//   }

//   // ============================
//   // Estadística: publicaciones por usuario (usado por StatsController de posts)
//   // ============================
//   async statsPostsByUser(from?: string, to?: string) {
//     const match: any = { activo: true };

//     if (from || to) {
//       match.createdAt = {};
//       if (from) match.createdAt.$gte = new Date(from);
//       if (to) match.createdAt.$lte = new Date(to);
//     }

//     const agg = await this.postModel.aggregate([
//       { $match: match },

//       {
//         $group: {
//           _id: '$autor',
//           count: { $sum: 1 }
//         }
//       },

//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },

//       { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           nombre_usuario: { $ifNull: ['$user.nombre_usuario', 'Sin nombre'] },
//           count: 1
//         }
//       },

//       { $sort: { count: -1 } }
//     ]);

//     return { success: true, data: agg };
//   }
// }
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