# FILMZONE

Proyecto de streaming tipo Netflix para nuestra materia de Desarrollo de Aplicaciones y Servicios Web, pero solo con tráilers. Incluye frontend, REST API, autenticación, roles, MongoDB y panel de administrador.

## Requisitos

- Node.js 18 o superior
- MongoDB local o MongoDB Atlas

## Instalación local

```bash
npm install
cp .env.example .env
npm run seed
npm start
```

Después abre:

```text
http://localhost:3000
```

## Usuarios de prueba

Administrador:

```text
admin@filmzone.com
admin123
```

Usuario común:

```text
user@filmzone.com
user123
```

## Variables para Render

En Render crea un Web Service y agrega estas variables:

```text
MONGODB_URI=tu_cadena_de_mongodb_atlas
JWT_SECRET=un_secreto_largo
PORT=3000
```

Comandos en Render:

```text
Build Command: npm install
Start Command: npm start
```

Para precargar la base, puedes correr localmente `npm run seed` usando la misma cadena de MongoDB Atlas.

## Endpoints principales

### Usuarios

- POST `/users/register`
- POST `/users/login`
- GET `/users` solo admin, con header `x-auth`
- PUT `/users/:id` solo admin, cambia `tipo_usuario`

### Películas

- GET `/movies`
- GET `/movies?query=texto`
- GET `/movies/:id`
- GET `/movies/category/:id`
- POST `/admin/movies` solo admin
- PUT `/admin/movies/:id` solo admin
- DELETE `/admin/movies/:id` solo admin

### Series

- GET `/series`
- GET `/series/:id`
- GET `/series/category/:id`
- POST `/admin/series` solo admin
- PUT `/admin/series/:id` solo admin
- DELETE `/admin/series/:id` solo admin

### Categorías

- GET `/categories`
- POST `/admin/categories` solo admin
- PUT `/admin/categories/:id` solo admin
- DELETE `/admin/categories/:id` solo admin

### Tráilers e historial

- GET `/content/:id/trailer`
- POST `/history`
- GET `/history`

## Pantallas incluidas

- `index.html`: inicio
- `registro.html`: registro conectado al backend
- `login.html`: login con token
- `perfiles.html`: gestión básica de perfiles
- `filmzone.html`: catálogo dinámico con búsqueda y categorías
- `content.html`: detalle y reproducción de tráiler
- `admin.html`: panel para administrar usuarios, categorías, películas y series
