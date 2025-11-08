# Plan de Implementación del Backend - EduBattle Arena

## Resumen del Análisis

Basándome en la guía proporcionada y el código del frontend, he identificado los siguientes requisitos para crear un backend 100% funcional:

### Tecnologías Identificadas
- **Node.js + Express + TypeScript**
- **Prisma ORM + PostgreSQL**
- **Puerto**: 3001

### Estructura de Datos (Prisma Schema)

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String
  password     String
  imageUrl     String
  level        Int           @default(1)
  role         UserRole      @default(STUDENT)
  achievements Achievement[] @relation("UserAchievements")
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model ProfessorCard {
  id       Int     @id @default(autoincrement())
  name     String
  title    String
  imageUrl String
  locked   Boolean @default(true)
  skills   Json    // Almacena un array de objetos { name: string, score: number }
  createdAt DateTime @default(now())
}

model Question {
  id                 String @id @default(cuid())
  text               String
  answers            String[]
  correctAnswerIndex Int
  authorId           String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Achievement {
  id          Int    @id @default(autoincrement())
  name        String
  icon        String
  description String
  users       User[] @relation("UserAchievements")
  createdAt   DateTime @default(now())
}

model Student {
  id       String @id @default(cuid())
  name     String
  level    Int
  imageUrl String
  userId   String @unique
  createdAt DateTime @default(now())
}

model CustomModule {
  id           String @id @default(cuid())
  name         String
  icon         String
  role         UserRole
  gameMode     String  // 'individual' | 'group'
  accessMethod String  // 'code' | 'qr' | 'both'
  createdAt    DateTime @default(now())
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
}
```

### API Endpoints Requeridos

#### Autenticación
- `POST /api/auth/login` - Login de usuarios
- `POST /api/auth/register` - Registro de usuarios
- `GET /api/user/profile` - Obtener perfil del usuario

#### Gestión de Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `PUT /api/users/:id/role` - Cambiar rol de usuario
- `DELETE /api/users/:id` - Eliminar usuario

#### Banco de Preguntas
- `GET /api/questions` - Listar preguntas
- `POST /api/questions` - Crear nueva pregunta
- `PUT /api/questions/:id` - Editar pregunta
- `DELETE /api/questions/:id` - Eliminar pregunta

#### Cartas de Profesores
- `GET /api/professors` - Listar cartas de profesores
- `POST /api/professors` - Crear nueva carta
- `PUT /api/professors/:id` - Editar carta
- `DELETE /api/professors/:id` - Eliminar carta

#### Logros
- `GET /api/achievements` - Listar logros
- `POST /api/achievements` - Crear logro
- `PUT /api/achievements/:id` - Editar logro

#### Módulos (Admin)
- `GET /api/modules` - Listar módulos habilitados
- `POST /api/modules` - Crear módulo personalizado
- `PUT /api/modules/:id` - Habilitar/deshabilitar módulo

### Características Especiales
- Sistema de niveles y experiencia para usuarios
- Progresión y desbloqueo de cartas de profesores
- Gestión de roles y permisos (Student/Teacher/Admin)
- API CORS configurada para permitir el frontend
- Validación de datos y manejo robusto de errores
- Hash de passwords para seguridad
- Timestamps automáticos (createdAt, updatedAt)

### Estructura de Archivos del Proyecto

```
edubattle-backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── questions.ts
│   │   ├── professors.ts
│   │   ├── achievements.ts
│   │   └── modules.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── services/
│   │   └── userService.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts de Configuración
- Configuración automática de base de datos PostgreSQL
- Migraciones de Prisma
- Seeds de datos iniciales
- Scripts de desarrollo y producción

Este backend proporcionará una API completa que soportará todas las funcionalidades identificadas en el frontend de EduBattle Arena.