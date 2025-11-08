#!/bin/bash

# EduBattle Arena - Script de configuración de base de datos
# Este script ayuda a configurar PostgreSQL para el proyecto

echo "🚀 Configuración de PostgreSQL para EduBattle Arena"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si PostgreSQL está instalado
check_postgres() {
    print_status "Verificando instalación de PostgreSQL..."
    
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL está instalado"
        psql --version
    else
        print_error "PostgreSQL no está instalado"
        echo "Por favor instala PostgreSQL primero:"
        echo "  - Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
        echo "  - macOS: brew install postgresql"
        echo "  - Windows: Descarga desde https://www.postgresql.org/download/"
        exit 1
    fi
}

# Función para crear base de datos y usuario
setup_database() {
    print_status "Configurando base de datos y usuario..."
    
    # Credenciales (estas deberían ser personalizadas en un entorno real)
    DB_NAME="edubattle_db"
    DB_USER="edubattle_user"
    DB_PASS="password123"
    
    # Verificar si ya existen
    if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_warning "La base de datos '$DB_NAME' ya existe"
        read -p "¿Deseas continuar de todos modos? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Configuración cancelada"
            exit 0
        fi
    fi
    
    # Crear usuario y base de datos
    print_status "Creando usuario '$DB_USER' y base de datos '$DB_NAME'..."
    
    sudo -u postgres psql << EOF
-- Crear usuario si no existe
DO 
\$do\$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = '$DB_USER') THEN
      CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
   END IF;
END
\$do\$;

-- Crear base de datos si no existe
SELECT 'CREATE DATABASE $DB_NAME'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Configurar para que los nuevos objetos tengan los permisos correctos por defecto
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Base de datos y usuario configurados correctamente"
    else
        print_error "Error al configurar la base de datos"
        exit 1
    fi
}

# Función para probar conexión
test_connection() {
    print_status "Probando conexión a la base de datos..."
    
    DB_NAME="edubattle_db"
    DB_USER="edubattle_user"
    DB_PASS="password123"
    
    # Probar conexión
    PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        print_success "Conexión exitosa a la base de datos"
    else
        print_error "Error al conectar a la base de datos"
        print_status "Posibles soluciones:"
        echo "  1. Verificar que PostgreSQL esté ejecutándose"
        echo "  2. Verificar credenciales en el archivo .env"
        echo "  3. Verificar configuración de pg_hba.conf"
    fi
}

# Función para mostrar instrucciones
show_instructions() {
    print_success "¡Configuración completada!"
    echo
    echo -e "${BLUE}Próximos pasos:${NC}"
    echo "1. Verificar variables en el archivo .env:"
    echo "   DATABASE_URL=\"postgresql://edubattle_user:password123@localhost:5432/edubattle_db\""
    echo
    echo "2. Instalar dependencias del proyecto:"
    echo "   npm install"
    echo
    echo "3. Ejecutar migraciones:"
    echo "   npm run prisma:migrate"
    echo
    echo "4. Poblar base de datos con datos iniciales:"
    echo "   npm run db:seed"
    echo
    echo "5. Iniciar servidor de desarrollo:"
    echo "   npm run dev"
    echo
    echo -e "${YELLOW}Credenciales por defecto:${NC}"
    echo "  Email: admin@edubattle.com"
    echo "  Contraseña: password123"
    echo "  Rol: ADMIN"
    echo
    echo -e "${YELLOW}Credenciales de profesor:${NC}"
    echo "  Email: teacher@edubattle.com"
    echo "  Contraseña: password123"
    echo "  Rol: TEACHER"
    echo
    echo -e "${YELLOW}Credenciales de estudiante:${NC}"
    echo "  Email: student@edubattle.com"
    echo "  Contraseña: password123"
    echo "  Rol: STUDENT"
}

# Menú principal
main_menu() {
    echo
    echo "Selecciona una opción:"
    echo "1) Configurar base de datos PostgreSQL (completo)"
    echo "2) Solo verificar instalación de PostgreSQL"
    echo "3) Probar conexión a la base de datos"
    echo "4) Mostrar instrucciones"
    echo "5) Salir"
    echo
    read -p "Opción [1-5]: " choice
    
    case $choice in
        1)
            check_postgres
            setup_database
            test_connection
            show_instructions
            ;;
        2)
            check_postgres
            ;;
        3)
            test_connection
            ;;
        4)
            show_instructions
            ;;
        5)
            print_status "Saliendo..."
            exit 0
            ;;
        *)
            print_error "Opción inválida"
            main_menu
            ;;
    esac
}

# Verificar argumentos de línea de comandos
if [ "$1" == "auto" ]; then
    print_status "Modo automático - configurando base de datos..."
    check_postgres
    setup_database
    test_connection
    show_instructions
else
    main_menu
fi