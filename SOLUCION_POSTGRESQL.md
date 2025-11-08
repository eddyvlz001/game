# PostgreSQL - Solución EduBattle Backend

## 1. Configurar PostgreSQL

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE juego;
```

## 2. Actualizar .env
```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/juego"
PORT=3001
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_mínimo_32_caracteres
JWT_REFRESH_SECRET=tu_jwt_refresh_secret_aún_más_seguro_mínimo_64_caracteres
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 3. Corregir seed.ts
Ejecuta: `corregir-seed.bat` (Windows) o `bash corregir-seed.sh` (Linux)

## 4. Ejecutar Backend
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

## Resultado
- Servidor en: `http://localhost:3001`
- API en: `http://localhost:3001/api`
- Login test: admin@edubattle.com / password123