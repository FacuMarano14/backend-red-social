# Red Social — Backend

API REST para una red social desarrollada como TP integrador de Programación IV (UTN Avellaneda). Construida con **NestJS** y **MongoDB**, con autenticación JWT, roles de usuario, publicaciones con likes/comentarios, guardados, compartidos y estadísticas para dashboards.

🔗 **Repo del frontend:** [frontend-red-social](https://github.com/FacuMarano14/frontend-red-social)
🔗 **Demo en vivo:** [frontend-red-social-vert.vercel.app](https://frontend-red-social-vert.vercel.app/)

> ⚠️ El backend corre en el free tier de Render, así que la primera petición después de un rato de inactividad puede tardar hasta 50 segundos en responder (se "duerme" el servidor).

---

## 🛠️ Stack

<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=nestjs,mongodb,ts,nodejs" />
</a>

- **NestJS 11** — framework backend bajo arquitectura modular (MVC)
- **MongoDB + Mongoose 8** — base de datos y modelado de esquemas
- **Passport + JWT** — autenticación y autorización basada en roles
- **Bcrypt** — hash de contraseñas
- **Cloudinary** — almacenamiento y entrega de imágenes (perfil y publicaciones)
- **Class Validator / Class Transformer** — validación de DTOs

---

## 📦 Módulos

| Módulo | Responsabilidad |
|---|---|
| `auth` | Registro, login, generación/validación/refresco de tokens JWT (expiran a los 15 min), roles `usuario` / `administrador` |
| `users` | CRUD de usuarios, alta y baja lógica (habilitar/deshabilitar), solo accesible por administradores |
| `posts` | Publicaciones: alta, baja lógica, likes, guardados, compartidos, paginación y ordenamiento (fecha / likes / guardados / compartidos) |
| `comments` | Comentarios de una publicación: creación, edición (con marca de "editado"), listado paginado |
| `stats` | Endpoints de estadísticas para los gráficos del dashboard (publicaciones y comentarios por usuario/tiempo, likes por día, logins, visitas a perfil) |
| `cloudinary` | Subida y gestión de imágenes de perfil y publicaciones |
| `database` | Conexión y configuración de Mongoose |
| `common` | Guards, decoradores y utilidades compartidas entre módulos |

---

## ⚙️ Variables de entorno

Creá un archivo `.env` en la raíz con:

```env
PORT=3000
MONGO_URI=tu_connection_string_de_mongodb_atlas
JWT_SECRET=tu_secreto_para_firmar_los_tokens
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## 🚀 Instalación y uso

```bash
# Instalar dependencias
npm install

# Modo desarrollo (con recarga automática)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 🧪 Tests

```bash
npm run test        # unit tests
npm run test:e2e     # end-to-end
npm run test:cov     # coverage
```

---

## 🔐 Autenticación

- El login/registro devuelve un **JWT** que expira a los **15 minutos**.
- `POST /auth/authorize` — valida si un token sigue vigente y devuelve los datos del usuario (401 si no).
- `POST /auth/refresh` — renueva el token manteniendo el mismo payload.
- Todas las respuestas usan códigos de estado correctos (`201` creado, `400` bad request, `401` no autorizado, etc.), sin `200` en errores.

---

## 👤 Autor

**Facundo Marano** — [GitHub](https://github.com/FacuMarano14) · [LinkedIn](https://www.linkedin.com/in/facundo-marano-1b189628b) · [Portfolio](https://portfolio-hazel-seven-37.vercel.app/)

Proyecto académico — Tecnicatura Universitaria en Programación, UTN Avellaneda.
