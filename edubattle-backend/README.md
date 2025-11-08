# EduBattle Arena - Backend API

Backend API completo para la plataforma educativa EduBattle Arena, desarrollado con Node.js, TypeScript, Express y Prisma ORM.

## 🚀 Características

- **Autenticación JWT** con roles de usuario (Estudiante, Profesor, Admin)
- **Gestión de usuarios** con perfiles y estadísticas
- **Banco de preguntas** con categorización y dificultad
- **Sistema de cartas de profesores** desbloqueables
- **Logros y recompensas** por participación
- **Módulos dinámicos** gestionados por admin
- **Batallas en tiempo real** con códigos de acceso
- **API RESTful** completamente documentada
- **Base de datos PostgreSQL** con migraciones
- **Validación completa** de datos de entrada
- **Manejo de errores** robusto

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Tipado estático
- **Express** - Framework web
- **Prisma ORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hashing de contraseñas
- **Express Validator** - Validación de datos
- **Morgan** - Logging
- **Helmet** - Seguridad

## 📋 Requisitos

- Node.js 18.0 o superior
- PostgreSQL 13 o superior
- npm o yarn

## 🏗️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd edubattle-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos PostgreSQL**
```sql
CREATE DATABASE edubattle_db;
CREATE USER edubattle_user WITH ENCRYPTED PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE edubattle_db TO edubattle_user;
```

5. **Ejecutar migraciones**
```bash
npm run prisma:migrate
```

6. **Poblar base de datos con datos iniciales**
```bash
npm run db:seed
```

7. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## 🗄️ Configuración de Base de Datos

### Esquema Principal

El esquema de la base de datos incluye los siguientes modelos:

- **User**: Usuarios con roles y estadísticas
- **ProfessorCard**: Cartas de profesores desbloqueables
- **Question**: Preguntas para batallas
- **Achievement**: Sistema de logros
- **Student**: Perfiles de estudiantes
- **CustomModule**: Módulos dinámicos de la aplicación
- **BattleSession**: Sesiones de batalla
- **UserBattleStats**: Estadísticas de batalla por usuario

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name migration_name

# Aplicar migraciones a producción
npm run prisma:deploy

# Resetear base de datos
npm run db:reset
```

## 🔐 Autenticación

### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "Usuario Ejemplo",
  "password": "password123",
  "role": "STUDENT"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Token
El token JWT debe incluirse en el header:
```
Authorization: Bearer <token>
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario actual
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `PUT /api/users/:id/role` - Cambiar rol (Admin)
- `DELETE /api/users/:id` - Eliminar usuario (Admin)
- `GET /api/users/:id/achievements` - Logros del usuario
- `GET /api/users/:id/stats` - Estadísticas del usuario

### Preguntas
- `GET /api/questions` - Listar preguntas
- `GET /api/questions/:id` - Obtener pregunta por ID
- `POST /api/questions` - Crear pregunta (Profesor/Admin)
- `PUT /api/questions/:id` - Actualizar pregunta
- `DELETE /api/questions/:id` - Eliminar pregunta
- `GET /api/questions/categories/list` - Listar categorías
- `POST /api/questions/bulk` - Crear múltiples preguntas

### Cartas de Profesores
- `GET /api/professors` - Listar cartas
- `GET /api/professors/:id` - Obtener carta por ID
- `POST /api/professors` - Crear carta (Admin)
- `PUT /api/professors/:id` - Actualizar carta
- `DELETE /api/professors/:id` - Eliminar carta
- `PUT /api/professors/:id/unlock` - Desbloquear carta
- `GET /api/professors/available/unlocked` - Cartas disponibles

### Logros
- `GET /api/achievements` - Listar logros
- `GET /api/achievements/:id` - Obtener logro por ID
- `POST /api/achievements` - Crear logro (Admin)
- `PUT /api/achievements/:id` - Actualizar logro
- `DELETE /api/achievements/:id` - Eliminar logro
- `GET /api/achievements/user/:userId` - Logros del usuario
- `POST /api/achievements/:id/award` - Otorgar logro (Admin)

### Módulos
- `GET /api/modules` - Listar módulos
- `GET /api/modules/:id` - Obtener módulo por ID
- `POST /api/modules` - Crear módulo (Admin)
- `PUT /api/modules/:id` - Actualizar módulo
- `DELETE /api/modules/:id` - Eliminar módulo
- `GET /api/modules/enabled/:role` - Módulos habilitados por rol
- `PUT /api/modules/:id/toggle` - Habilitar/deshabilitar módulo

### Batallas
- `POST /api/battles/create` - Crear batalla
- `GET /api/battles/:id` - Obtener batalla
- `POST /api/battles/join/:code` - Unirse a batalla
- `PUT /api/battles/:id/start` - Iniciar batalla
- `PUT /api/battles/:id/end` - Terminar batalla
- `GET /api/battles` - Listar batallas del usuario
- `DELETE /api/battles/:id` - Cancelar batalla

## 🔒 Roles de Usuario

### Estudiante (STUDENT)
- Participar en batallas
- Ver perfil y estadísticas
- Desbloquear cartas de profesores
- Obtener logros

### Profesor (TEACHER)
- Todas las funciones de estudiante
- Crear y gestionar preguntas
- Ver estadísticas de estudiantes
- Crear batallas

### Administrador (ADMIN)
- Todas las funciones de profesor
- Gestionar usuarios
- Crear y gestionar cartas de profesores
- Crear logros
- Gestionar módulos
- Configuraciones del sistema

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev                    # Iniciar servidor con nodemon
npm run build                  # Compilar TypeScript
npm run start                  # Iniciar servidor en producción

# Base de datos
npm run prisma:generate        # Generar cliente de Prisma
npm run prisma:migrate         # Aplicar migraciones
npm run prisma:deploy          # Deployar migraciones
npm run db:seed                # Poblar base de datos
npm run db:reset               # Resetear y repoblar BD

# Utilidades
npm run dev:db                 # Migrar y iniciar en dev
```

## 🌐 Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/edubattle_db"

# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET="tu-secreto-jwt-aqui"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# Seguridad
BCRYPT_ROUNDS=12

# Logging
LOG_LEVEL=info
```

## 📊 Datos de Ejemplo

El sistema incluye un script de seeds que crea:

- **3 usuarios por defecto** (Admin, Profesor, Estudiante)
- **4 cartas de profesores** con diferentes habilidades
- **8 preguntas de ejemplo** en varias categorías
- **6 logros** para激励机制
- **4 módulos personalizados** para diferentes roles
- **Estadísticas de batalla** para usuarios

### Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@edubattle.com | password123 | ADMIN |
| teacher@edubattle.com | password123 | TEACHER |
| student@edubattle.com | password123 | STUDENT |

## 🧪 Pruebas

```bash
# Ejecutar pruebas (si están configuradas)
npm test

# Verificar tipos
npm run type-check

# Linter
npm run lint
```

## 📈 Monitoreo

### Health Check
```http
GET /api/health
```

Respuesta:
```json
{
  "status": "OK",
  "timestamp": "2025-11-09T07:05:42.000Z",
  "database": "Connected",
  "version": "1.0.0"
}
```

## 🔧 Configuración de Producción

1. **Variables de entorno**: Configurar todas las variables para producción
2. **Base de datos**: Usar PostgreSQL en producción
3. **HTTPS**: Configurar certificados SSL
4. **Rate limiting**: Implementar limitación de tasa
5. **Logging**: Configurar logs de producción
6. **Monitoreo**: Configurar alertas y métricas

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear issue en GitHub
- Documentación de la API en `/api/docs` (si está habilitada)
- Logs del servidor para debugging

## 🎯 Características Futuras

- [ ] WebSockets para tiempo real
- [ ] Sistema de notificaciones
- [ ] Análisis avanzados
- [ ] API de exportación de datos
- [ ] Integración con LMS
- [ ] Sistema de pagos
- [ ] Aplicación móvil API
- [ ] Cache Redis
- [ ] Microservicios

---

**Desarrollado por**: MiniMax Agent  
**Versión**: 1.0.0  
**Fecha**: Noviembre 2025