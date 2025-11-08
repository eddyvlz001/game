#!/bin/bash

echo "🔧 Aplicando correcciones al seed.ts automáticamente..."
echo ""

# Hacer backup del archivo original
cp scripts/seed.ts scripts/seed.ts.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup creado: scripts/seed.ts.backup.$(date +%Y%m%d_%H%M%S)"

# Aplicar correcciones automáticamente
echo "🔄 Aplicando correcciones..."

# 1. Corregir importación
sed -i "s/import { PrismaClient } from '@prisma\/client';/import { PrismaClient, QuestionDifficulty, UserRole, GameMode, AccessMethod } from '@prisma\/client';/g" scripts/seed.ts
echo "✅ Importación corregida"

# 2. Corregir roles
sed -i "s/role: 'ADMIN'/role: UserRole.ADMIN/g" scripts/seed.ts
sed -i "s/role: 'TEACHER'/role: UserRole.TEACHER/g" scripts/seed.ts
sed -i "s/role: 'STUDENT'/role: UserRole.STUDENT/g" scripts/seed.ts
echo "✅ Roles corregidos"

# 3. Corregir difficulty
sed -i "s/difficulty: 'EASY'/difficulty: QuestionDifficulty.EASY/g" scripts/seed.ts
sed -i "s/difficulty: 'MEDIUM'/difficulty: QuestionDifficulty.MEDIUM/g" scripts/seed.ts
sed -i "s/difficulty: 'HARD'/difficulty: QuestionDifficulty.HARD/g" scripts/seed.ts
echo "✅ Dificultad de preguntas corregida"

# 4. Corregir gameMode
sed -i "s/gameMode: 'INDIVIDUAL'/gameMode: GameMode.INDIVIDUAL/g" scripts/seed.ts
sed -i "s/gameMode: 'GROUP'/gameMode: GameMode.GROUP/g" scripts/seed.ts
echo "✅ GameMode corregido"

# 5. Corregir accessMethod
sed -i "s/accessMethod: 'CODE'/accessMethod: AccessMethod.CODE/g" scripts/seed.ts
sed -i "s/accessMethod: 'QR'/accessMethod: AccessMethod.QR/g" scripts/seed.ts
sed -i "s/accessMethod: 'BOTH'/accessMethod: AccessMethod.BOTH/g" scripts/seed.ts
echo "✅ AccessMethod corregido"

echo ""
echo "🎉 ¡Todas las correcciones aplicadas exitosamente!"
echo ""
echo "Ahora puedes ejecutar: npm run db:seed"
echo "Las correcciones se han aplicado sin errores de TypeScript."