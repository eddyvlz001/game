import { PrismaClient, QuestionDifficulty, UserRole, GameMode, AccessMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@edubattle.com' },
    update: {},
    create: {
      email: 'admin@edubattle.com',
      name: 'Admin User',
      password: 'password123', // In production, this should be hashed
      role: UserRole.ADMIN,
      level: 99,
      experience: 9999,
      imageUrl: 'https://picsum.photos/seed/admin/200/200'
    }
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@edubattle.com' },
    update: {},
    create: {
      email: 'teacher@edubattle.com',
      name: 'Prof. Diana Salas',
      password: 'password123',
      role: UserRole.TEACHER,
      level: 25,
      experience: 2500,
      imageUrl: 'https://picsum.photos/seed/teacher123/200/200'
    }
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@edubattle.com' },
    update: {},
    create: {
      email: 'student@edubattle.com',
      name: 'Alex Innovator',
      password: 'password123',
      role: UserRole.STUDENT,
      level: 12,
      experience: 1200,
      imageUrl: 'https://picsum.photos/seed/user123/200/200'
    }
  });

  console.log('✅ Default users created');

  // Create professor cards
  const professorCards = [
    {
      name: 'Dr. Ada Lovelace',
      title: 'Algoritmos y Lógica',
      imageUrl: 'https://picsum.photos/seed/prof1/400/500',
      skills: [
        { name: 'Lógica Computacional', score: 95 },
        { name: 'Algoritmos', score: 92 },
        { name: 'Matemáticas', score: 88 }
      ],
      locked: false
    },
    {
      name: 'Dr. Alan Turing',
      title: 'Computación y Criptografía',
      imageUrl: 'https://picsum.photos/seed/prof2/400/500',
      skills: [
        { name: 'Criptografía', score: 98 },
        { name: 'Inteligencia Artificial', score: 90 },
        { name: 'Lógica', score: 95 }
      ],
      locked: true
    },
    {
      name: 'Dr. Marie Curie',
      title: 'Ciencias y Investigación',
      imageUrl: 'https://picsum.photos/seed/prof3/400/500',
      skills: [
        { name: 'Física', score: 97 },
        { name: 'Química', score: 93 },
        { name: 'Metodología Científica', score: 91 }
      ],
      locked: true
    },
    {
      name: 'Dr. Nikola Tesla',
      title: 'Física e Ingeniería',
      imageUrl: 'https://picsum.photos/seed/prof4/400/500',
      skills: [
        { name: 'Electromagnetismo', score: 99 },
        { name: 'Ingeniería', score: 94 },
        { name: 'Física Aplicada', score: 96 }
      ],
      locked: true
    }
  ];

  for (const card of professorCards) {
    await prisma.professorCard.upsert({
      where: { id: professorCards.indexOf(card) + 1 },
      update: card,
      create: card
    });
  }

  console.log('✅ Professor cards created');

  // Create achievements
  const achievements = [
    {
      name: 'Primera Victoria',
      icon: 'trophy',
      description: 'Gana tu primera batalla',
      points: 50
    },
    {
      name: 'Experto en Preguntas',
      icon: 'help-circle',
      description: 'Responde 100 preguntas correctamente',
      points: 100
    },
    {
      name: 'Nivel 10',
      icon: 'trending-up',
      description: 'Alcanza el nivel 10',
      points: 75
    },
    {
      name: 'Maestro de la Casa',
      icon: 'home',
      description: 'Crea 5 batallas',
      points: 80
    },
    {
      name: 'Jugador Activo',
      icon: 'flash',
      description: 'Participa en 20 batallas',
      points: 120
    },
    {
      name: 'Conocimiento Universal',
      icon: 'library',
      description: 'Responde preguntas de 5 categorías diferentes',
      points: 90
    }
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievements.indexOf(achievement) + 1 },
      update: achievement,
      create: achievement
    });
  }

  console.log('✅ Achievements created');

  // Create sample questions
  const questions = [
    {
      text: '¿Qué es un componente en React?',
      answers: [
        'Una función que retorna HTML',
        'Una clase de CSS',
        'Un archivo de video',
        'Una base de datos'
      ],
      correctAnswerIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Programación',
      authorId: teacherUser.id
    },
    {
      text: '¿Cuál de estos es un hook de React?',
      answers: [
        'useLoop',
        'useEffect',
        'useIf',
        'useStyle'
      ],
      correctAnswerIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: 'Programación',
      authorId: teacherUser.id
    },
    {
      text: '¿Qué significa CSS?',
      answers: [
        'Computer Style Sheets',
        'Cascading Style Sheets',
        'Creative Style System',
        'Cascading System Sheets'
      ],
      correctAnswerIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: 'Programación',
      authorId: teacherUser.id
    },
    {
      text: '¿Cuál es la complejidad temporal del algoritmo de búsqueda binaria?',
      answers: [
        'O(n)',
        'O(log n)',
        'O(n²)',
        'O(1)'
      ],
      correctAnswerIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Algoritmos',
      authorId: teacherUser.id
    },
    {
      text: '¿Qué es un algoritmo de ordenamiento estable?',
      answers: [
        'Un algoritmo que nunca falla',
        'Un algoritmo que mantiene el orden relativo de elementos iguales',
        'Un algoritmo que ordena en tiempo O(n)',
        'Un algoritmo que usa solo comparaciones'
      ],
      correctAnswerIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: 'Algoritmos',
      authorId: teacherUser.id
    },
    {
      text: '¿Cuántos planetas hay en nuestro sistema solar?',
      answers: [
        '7',
        '8',
        '9',
        '10'
      ],
      correctAnswerIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: 'Ciencias',
      authorId: teacherUser.id
    },
    {
      text: '¿Cuál es la unidad básica de la vida?',
      answers: [
        'El átomo',
        'La célula',
        'La molécula',
        'El órgano'
      ],
      correctAnswerIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: 'Biología',
      authorId: teacherUser.id
    },
    {
      text: '¿Qué scientist propuso las tres leyes del movimiento?',
      answers: [
        'Albert Einstein',
        'Isaac Newton',
        'Galileo Galilei',
        'Niels Bohr'
      ],
      correctAnswerIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Física',
      authorId: teacherUser.id
    }
  ];

  for (const question of questions) {
    await prisma.question.create({
      data: question
    });
  }

  console.log('✅ Sample questions created');

  // Create custom modules
  const customModules = [
    {
      name: 'Batalla Rápida',
      icon: 'flash',
      role: UserRole.STUDENT,
      gameMode: GameMode.INDIVIDUAL,
      accessMethod: AccessMethod.CODE,
      enabled: true
    },
    {
      name: 'Desafío Grupal',
      icon: 'people',
      role: UserRole.STUDENT,
      gameMode: GameMode.GROUP,
      accessMethod: AccessMethod.QR,
      enabled: true
    },
    {
      name: 'Gestión de Batallas',
      icon: 'settings',
      role: UserRole.TEACHER,
      gameMode: GameMode.INDIVIDUAL,
      accessMethod: AccessMethod.CODE,
      enabled: true
    },
    {
      name: 'Análisis de Estudiantes',
      icon: 'analytics',
      role: UserRole.TEACHER,
      gameMode: GameMode.INDIVIDUAL,
      accessMethod: AccessMethod.BOTH,
      enabled: true
    }
  ];

  for (const module of customModules) {
    await prisma.customModule.create({
      data: module
    });
  }

  console.log('✅ Custom modules created');

  // Create user battle stats
  await prisma.userBattleStats.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      totalGames: 10,
      wins: 8,
      losses: 2,
      totalQuestions: 100,
      correctAnswers: 85,
      experience: 500
    }
  });

  await prisma.userBattleStats.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      totalGames: 5,
      wins: 3,
      losses: 2,
      totalQuestions: 50,
      correctAnswers: 40,
      experience: 300
    }
  });

  console.log('✅ User battle stats created');

  // Assign some achievements to users
  const firstAchievement = await prisma.achievement.findFirst({
    where: { name: 'Primera Victoria' }
  });

  if (firstAchievement) {
    await prisma.user.update({
      where: { id: studentUser.id },
      data: {
        achievements: {
          connect: { id: firstAchievement.id }
        }
      }
    });
  }

  console.log('✅ Sample achievement assigned');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Professor Cards: ${await prisma.professorCard.count()}`);
  console.log(`- Questions: ${await prisma.question.count()}`);
  console.log(`- Achievements: ${await prisma.achievement.count()}`);
  console.log(`- Custom Modules: ${await prisma.customModule.count()}`);
  console.log(`- Battle Stats: ${await prisma.userBattleStats.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });