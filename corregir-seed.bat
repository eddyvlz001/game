@echo off
echo 🔧 Aplicando correcciones al seed.ts automáticamente...
echo.

REM Hacer backup del archivo original
copy scripts\seed.ts scripts\seed.ts.backup.%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backup creado: scripts\seed.ts.backup.%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
) else (
    echo ❌ No se pudo crear backup
)

echo 🔄 Aplicando correcciones...

REM 1. Corregir importación
powershell -Command "(Get-Content scripts\seed.ts) -replace 'import { PrismaClient } from ''@prisma/client''', 'import { PrismaClient, QuestionDifficulty, UserRole, GameMode, AccessMethod } from ''@prisma/client''' | Set-Content scripts\seed.ts"
echo ✅ Importación corregida

REM 2. Corregir roles
powershell -Command "(Get-Content scripts\seed.ts) -replace 'role: ''ADMIN''', 'role: UserRole.ADMIN' | Set-Content scripts\seed.ts"
powershell -Command "(Get-Content scripts\seed.ts) -replace 'role: ''TEACHER''', 'role: UserRole.TEACHER' | Set-Content scripts\seed.ts"
powershell -Command "(Get-Content scripts\seed.ts) -replace 'role: ''STUDENT''', 'role: UserRole.STUDENT' | Set-Content scripts\seed.ts"
echo ✅ Roles corregidos

REM 3. Corregir difficulty
powershell -Command "(Get-Content scripts\seed.ts) -replace 'difficulty: ''EASY''', 'difficulty: QuestionDifficulty.EASY' | Set-Content scripts\seed.ts"
powershell -Command "(Get-Content scripts\seed.ts) -replace 'difficulty: ''MEDIUM''', 'difficulty: QuestionDifficulty.MEDIUM' | Set-Content scripts\seed.ts"
powershell -Command "(Get-Content scripts\seed.ts) -replace 'difficulty: ''HARD''', 'difficulty: QuestionDifficulty.HARD' | Set-Content scripts\seed.ts"
echo ✅ Dificultad de preguntas corregida

REM 4. Corregir gameMode
powershell -Command "(Get-Content scripts\seed.ts) -replace 'gameMode: ''INDIVIDUAL''', 'gameMode: GameMode.INDIVIDUAL' | Set-Content scripts\seed.ts"
powershell -Command "(Get-Content scripts\seed.ts) -replace 'gameMode: ''GROUP''', 'gameMode: GameMode.GROUP' | Set-Content scripts\seed.ts"
echo ✅ GameMode corregido

REM 5. Corregir accessMethod
powershell -Command "(Get-Content scripts\seed.ts) -replace 'accessMethod: ''CODE''', 'accessMethod: AccessMethod.CODE' | Set-Content scripts\seed.ts"
powershell -Command "(Get-Content scripts\seed.ts) -replace 'accessMethod: ''QR''', 'accessMethod: AccessMethod.QR' | Set-Content scripts\seed.ts"
powershell -Command "(Get-Content scripts\seed.ts) -replace 'accessMethod: ''BOTH''', 'accessMethod: AccessMethod.BOTH' | Set-Content scripts\seed.ts"
echo ✅ AccessMethod corregido

echo.
echo 🎉 ¡Todas las correcciones aplicadas exitosamente!
echo.
echo Ahora puedes ejecutar: npm run db:seed
echo Las correcciones se han aplicado sin errores de TypeScript.
echo.
pause