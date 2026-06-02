# Todo App — Backend (Node.js + Express + Prisma)

API REST para la Todo App. Autenticación con Firebase Admin + JWT propio.

## Descripción

Backend que verifica tokens de Firebase, emite JWT propios y gestiona usuarios, listas y tareas con PostgreSQL vía Prisma.

## Tecnologías

- **Node.js + Express**
- **Prisma** (ORM) + **PostgreSQL**
- **Firebase Admin SDK** (verificación de idToken)
- **jsonwebtoken** (JWT propio)
- **CORS, morgan, dotenv**
- Deploy en **Railway**

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` (ver `.env.example`):

```
DATABASE_URL="postgresql://usuario:password@host:5432/railway?sslmode=disable"
JWT_SECRET="tu_secret_seguro"
JWT_EXPIRES_IN="7d"
FIREBASE_PROJECT_ID="todo-app-final-b1517"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxx@todo-app-final-b1517.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY_BASE64="<clave privada en base64>"
PORT=3000
NODE_ENV="development"
```

> **Nota:** `FIREBASE_PRIVATE_KEY_BASE64` es la private key del service account de Firebase codificada en base64. Para generarla:
> ```bash
> node -e "console.log(Buffer.from(require('fs').readFileSync('serviceAccount.json','utf8')).toString('base64'))"
> ```

## Base de datos

```bash
npx prisma migrate dev    # desarrollo
npx prisma migrate deploy # producción
```

## Cómo ejecutar

```bash
npm run dev    # desarrollo (nodemon)
npm start      # producción
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/firebase-login` | Login con idToken de Firebase → devuelve JWT |
| GET | `/api/auth/me` | Perfil del usuario autenticado |
| GET / POST | `/api/lists` | Listar / crear listas |
| GET / PUT / DELETE | `/api/lists/:id` | Detalle / editar / borrar lista |
| GET / POST | `/api/lists/:listId/tasks` | Tareas de una lista |
| PUT / DELETE | `/api/tasks/:id` | Editar / borrar tarea |
| PATCH | `/api/tasks/:id/toggle` | Completar/descompletar tarea |
| GET | `/api/search?q=texto` | Búsqueda de listas y tareas |

## Link deployado

https://todo-app-backend-production-d9c8.up.railway.app

## Usuario de prueba

```
Email:      kp@gmail.com
Contraseña: 12345678
```

## Flujo de autenticación

```
Cliente → Firebase Auth login → getIdToken()
       → POST /api/auth/firebase-login { idToken }
       → Backend verifica con Firebase Admin SDK
       → Backend devuelve JWT propio
       → Cliente guarda JWT y lo envía en cada request (Bearer)
```
