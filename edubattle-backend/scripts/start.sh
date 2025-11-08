#!/bin/bash

# EduBattle Arena - Script de inicio rápido
# Este script ayuda a configurar y ejecutar el proyecto

echo "🎮 EduBattle Arena - Inicio Rápido"
echo "=================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
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

# Verificar Node.js
check_node() {
    print_info "Verificando Node.js..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado"
        echo "Instala Node.js desde: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        print_success "Node.js $NODE_VERSION está instalado"
    else
        print_error "Node.js versión $NODE_VERSION es demasiado antigua. Se requiere $REQUIRED_VERSION o superior."
        exit 1
    fi
}

# Verificar archivo .env
check_env() {
    print_info "Verificando archivo de configuración..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            print_warning "Archivo .env no encontrado, copiando desde .env.example..."
            cp .env.example .env
            print_warning "IMPORTANTE: Personaliza las configuraciones en el archivo .env"
        else
            print_error "No se encontró archivo .env o .env.example"
            exit 1
        fi
    else
        print_success "Archivo .env encontrado"
    fi
}

# Instalar dependencias
install_deps() {
    print_info "Verificando dependencias..."
    
    if [ ! -d "node_modules" ]; then
        print_info "Instalando dependencias..."
        npm install
        
        if [ $? -eq 0 ]; then
            print_success "Dependencias instaladas correctamente"
        else
            print_error "Error al instalar dependencias"
            exit 1
        fi
    else
        print_success "Dependencias ya instaladas"
    fi
}

# Generar cliente Prisma
generate_prisma() {
    print_info "Generando cliente de Prisma..."
    
    npx prisma generate
    
    if [ $? -eq 0 ]; then
        print_success "Cliente de Prisma generado"
    else
        print_error "Error al generar cliente de Prisma"
        exit 1
    fi
}

# Ejecutar migraciones
run_migrations() {
    print_info "Ejecutando migraciones de base de datos..."
    
    npx prisma migrate dev --name initial-setup
    
    if [ $? -eq 0 ]; then
        print_success "Migraciones ejecutadas correctamente"
    else
        print_error "Error al ejecutar migraciones"
        print_info "Verifica que PostgreSQL esté ejecutándose y la base de datos esté configurada"
        exit 1
    fi
}

# Poblar base de datos
seed_database() {
    print_info "¿Deseas poblar la base de datos con datos de ejemplo? (y/N)"
    read -p "Respuesta: " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Poblando base de datos..."
        
        npm run db:seed
        
        if [ $? -eq 0 ]; then
            print_success "Base de datos poblada con datos de ejemplo"
        else
            print_error "Error al poblar la base de datos"
            exit 1
        fi
    else
        print_info "Base de datos sin datos de ejemplo"
    fi
}

# Función principal
main() {
    echo
    print_info "Configurando proyecto..."
    echo
    
    check_node
    check_env
    install_deps
    generate_prisma
    run_migrations
    seed_database
    
    echo
    print_success "¡Configuración completada!"
    echo
    print_info "Para iniciar el servidor de desarrollo:"
    echo "  npm run dev"
    echo
    print_info "Para iniciar en producción:"
    echo "  npm run build && npm start"
    echo
    print_info "El servidor estará disponible en: http://localhost:3001"
    echo
    print_info "API Health Check: http://localhost:3001/api/health"
    echo
    
    # Preguntar si iniciar servidor
    echo -n "¿Deseas iniciar el servidor ahora? (y/N): "
    read -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Iniciando servidor de desarrollo..."
        npm run dev
    else
        print_info "Para iniciar más tarde, ejecuta: npm run dev"
    fi
}

# Ejecutar función principal
main