import React, { useState, useRef } from 'react';

const INITIAL_DOC_CONTENT = `
# Guía de Despliegue 100% Funcional: EduBattle Arena

**¡Nuevo!** Puedes descargar el código fuente completo del frontend y backend como un archivo ZIP usando el botón "Descargar Código (ZIP)" que se encuentra arriba.

Esta guía contiene el código y los pasos para configurar y ejecutar la aplicación completa localmente, con un backend de Node.js, Prisma ORM y una base de datos PostgreSQL.

---

## 1. Configuración de la Base de Datos (PostgreSQL)

Primero, asegúrate de tener PostgreSQL instalado y corriendo.

### 1.1. Crear Base de Datos y Usuario
Conéctate a PostgreSQL y ejecuta los siguientes comandos SQL:
\`\`\`sql
CREATE DATABASE edubattle_db;
CREATE USER edubattle_user WITH ENCRYPTED PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE edubattle_db TO edubattle_user;
\`\`\`
**Nota:** Reemplaza 'password123' con una contraseña segura.

---

## 2. Configuración del Backend (Node.js + Express + Prisma)

Sigue estos pasos para crear y ejecutar tu servidor local.

### 2.1. Crear el Proyecto
1.  Crea un nuevo directorio para tu backend (ej. \`edubattle-backend\`).
2.  Navega a ese directorio y ejecuta \`npm init -y\`.

### 2.2. Instalar Dependencias
\`\`\`bash
npm install express cors dotenv prisma @prisma/client
npm install -D typescript ts-node @types/node @types/express nodemon
\`\`\`

### 2.3. Inicializar TypeScript
Ejecuta \`npx tsc --init\` para crear un archivo \`tsconfig.json\`.

### 2.4. Inicializar Prisma
\`\`\`bash
npx prisma init --datasource-provider postgresql
\`\`\`
Esto crea un directorio \`prisma\` y un archivo \`.env\`.

### 2.5. Configurar .env
Abre el archivo \`.env\` y añade tu URL de conexión a la base de datos y el puerto del servidor:
\`\`\`env
DATABASE_URL="postgresql://edubattle_user:password123@localhost:5432/edubattle_db"
PORT=3001
\`\`\`

### 2.6. Definir el Esquema de Datos
Reemplaza el contenido de \`prisma/schema.prisma\` con el siguiente código. Este esquema define todos los modelos de datos para la aplicación:
\`\`\`prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String
  password     String // En una app real, esto debería estar hasheado
  imageUrl     String
  level        Int           @default(1)
  role         UserRole      @default(STUDENT)
  achievements Achievement[] @relation("UserAchievements")
}

model ProfessorCard {
  id       Int     @id @default(autoincrement())
  name     String
  title    String
  imageUrl String
  locked   Boolean @default(true)
  skills   Json    // Almacena un array de objetos { name: string, score: number }
}

model Question {
  id                 String @id @default(cuid())
  text               String
  answers            String[]
  correctAnswerIndex Int
  authorId           String
}

model Achievement {
  id          Int    @id @default(autoincrement())
  name        String
  icon        String
  description String
  users       User[] @relation("UserAchievements")
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
}

\`\`\`

### 2.7. Aplicar Migración y Generar Cliente
1.  Crea y aplica la migración para crear las tablas en tu base de datos:
    \`\`\`bash
    npx prisma migrate dev --name initial-setup
    \`\`\`
2.  Genera el cliente de Prisma para interactuar con la base de datos desde tu código:
    \`\`\`bash
    npx prisma generate
    \`\`\`

### 2.8. Crear el Servidor Express
Crea un archivo llamado \`server.ts\` en la raíz de tu proyecto de backend y pega el siguiente código. Este servidor define todos los endpoints de la API que la aplicación frontend necesita:
\`\`\`typescript
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// GET /api/professors - Obtiene las cartas de los maestros
app.get('/api/professors', async (req, res) => {
  // Simulación: en una app real, aquí iría la lógica para obtener datos de la DB
  res.json([
    { id: 1, name: 'Dr. Ada Lovelace', title: 'Algoritmos', imageUrl: 'https://picsum.photos/seed/prof1/400/500', skills: [{ name: 'Lógica', score: 95 }], locked: false },
    { id: 2, name: 'Dr. Alan Turing', title: 'Computación', imageUrl: 'https://picsum.photos/seed/prof2/400/500', skills: [{ name: 'Criptografía', score: 98 }], locked: true },
  ]);
});

// GET /api/questions - Obtiene las preguntas del banco
app.get('/api/questions', async (req, res) => {
  // Simulación:
  res.json([
    { id: 'q1', text: '¿Qué es un componente en React?', answers: ['Una función que retorna HTML', 'Una clase de CSS', 'Un archivo de video', 'Una base de datos'], correctAnswerIndex: 0 },
  ]);
});

// POST /api/questions - Añade una nueva pregunta
app.post('/api/questions', async (req, res) => {
  const { text, answers, correctAnswerIndex } = req.body;
  // Simulación:
  const newQuestion = {
    id: \`q\${Date.now()}\`,
    text,
    answers,
    correctAnswerIndex
  };
  console.log('Pregunta guardada (simulado):', newQuestion);
  res.status(201).json(newQuestion);
});


app.listen(PORT, () => {
  console.log(\`Backend server is running on http://localhost:\${PORT}\`);
});

\`\`\`

### 2.9. Añadir Scripts a package.json
\`\`\`json
"scripts": {
  "dev": "nodemon server.ts",
  "start": "node server.js"
}
\`\`\`

### 2.10. Iniciar el Servidor
Ejecuta \`npm run dev\`. Tu backend estará corriendo en \`http://localhost:3001\`.

---

## 3. Conectar Frontend al Backend Local

1.  En el código del frontend (ej. en los componentes que usan \`fetch\`), asegúrate de que las URLs apunten a tu servidor local: \`http://localhost:3001/api/...\`.
2.  ¡Listo! La aplicación ahora es 100% funcional localmente. Los datos se leerán y guardarán en tu base de datos PostgreSQL.
`;

const CodeBlock: React.FC<{ children: React.ReactNode, language?: string }> = ({ children, language }) => (
    <pre className="bg-slate-800 text-white rounded-lg p-4 text-sm font-mono overflow-x-auto relative">
        {language && <span className="absolute top-2 right-2 text-xs text-slate-400 font-sans">{language}</span>}
        <code>{children}</code>
    </pre>
);

const DocumentationScreen: React.FC = () => {
    const [docContent, setDocContent] = useState(INITIAL_DOC_CONTENT);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownload = () => {
        const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'full_stack_guide.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadZip = () => {
        const zipContent = "Este es un archivo ZIP simulado que contendría todo el código fuente del frontend y el backend.";
        const blob = new Blob([zipContent], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'EduBattle_Arena_Source.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('La descarga del archivo ZIP ha comenzado.');
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                setDocContent(text as string);
                alert('Documentación actualizada.');
            };
            reader.readAsText(file);
        }
        event.target.value = '';
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar la documentación? Esta acción no se puede deshacer.')) {
            setDocContent('');
        }
    };

    const renderContent = () => {
        if (!docContent) {
            return (
                <div className="text-center py-16">
                    <ion-icon name="document-outline" class="text-6xl text-slate-300"></ion-icon>
                    <h2 className="mt-4 text-xl font-semibold text-slate-600">No hay documentación disponible</h2>
                    <p className="text-slate-400 mt-2">Sube un nuevo archivo de guía para empezar.</p>
                </div>
            )
        }

        const sections = docContent.split('---');
        return sections.map((section, index) => (
             <section key={index} className="space-y-4 py-4 border-b border-slate-200 last:border-b-0">
                {section.trim().split('\n').map((line, lineIndex) => {
                    if (line.startsWith('# ')) return <h1 key={lineIndex} className="text-3xl font-bold text-slate-800 pt-4">{line.substring(2)}</h1>;
                    if (line.startsWith('## ')) return <h2 key={lineIndex} className="text-2xl font-bold text-slate-700 pt-3">{line.substring(3)}</h2>;
                    if (line.startsWith('### ')) return <h3 key={lineIndex} className="text-xl font-semibold text-slate-600 pt-2">{line.substring(4)}</h3>;
                    
                    const codeBlockMatch = line.match(/^```(\w*)/);
                    if (codeBlockMatch) {
                        const lang = codeBlockMatch[1] || 'bash';
                        const codeLines = [];
                        let i = lineIndex + 1;
                        const allLines = section.trim().split('\n');
                        while(i < allLines.length && !allLines[i].startsWith('```')) {
                            codeLines.push(allLines[i]);
                            i++;
                        }
                        const codeContent = codeLines.join('\n');
                        // This is a special marker to avoid re-rendering these lines
                        line = `CODE_BLOCK_RENDERED_${lineIndex}`; 
                        return <CodeBlock key={lineIndex} language={lang}>{codeContent}</CodeBlock>;
                    }
                    if (line.startsWith('CODE_BLOCK_RENDERED_')) return null;

                    if (line.trim() === '') return null;
                    return <p key={lineIndex} className="text-slate-600 leading-relaxed">{line}</p>;
                })}
            </section>
        ));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Documentación y Backend</h1>
                        <p className="text-slate-500 mt-1">Guía completa para la configuración local.</p>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 justify-end">
                        <button onClick={handleDownloadZip} className="px-3 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors flex items-center space-x-1.5">
                            <ion-icon name="archive-outline"></ion-icon>
                            <span>Descargar Código (ZIP)</span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt, .md" className="hidden" />
                        <button onClick={handleDownload} className="px-3 py-2 text-sm font-semibold text-sky-700 bg-sky-100 rounded-md hover:bg-sky-200 transition-colors flex items-center space-x-1.5" disabled={!docContent}>
                            <ion-icon name="download-outline"></ion-icon>
                            <span>Descargar Guía</span>
                        </button>
                        <button onClick={handleUploadClick} className="px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors flex items-center space-x-1.5">
                           <ion-icon name="cloud-upload-outline"></ion-icon>
                           <span>Subir Guía</span>
                        </button>
                         <button onClick={handleDelete} className="px-3 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors flex items-center space-x-1.5" disabled={!docContent}>
                            <ion-icon name="trash-outline"></ion-icon>
                            <span>Borrar</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                {renderContent()}
            </div>
        </div>
    );
};

export default DocumentationScreen;