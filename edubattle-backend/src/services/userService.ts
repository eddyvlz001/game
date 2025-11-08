import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../middleware/auth';

const prisma = new PrismaClient();

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role?: string;
  imageUrl?: string;
}

export interface UpdateUserData {
  name?: string;
  imageUrl?: string;
  level?: number;
}

export class UserService {
  // Create a new user
  static async createUser(userData: CreateUserData) {
    const { email, name, password, role = 'STUDENT', imageUrl } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS!) || 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role as any,
        imageUrl: imageUrl || 'https://picsum.photos/seed/user/200/200'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
        level: true,
        experience: true,
        createdAt: true
      }
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    return {
      user,
      token
    };
  }

  // Find user by email
  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
        level: true,
        experience: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  // Find user by ID
  static async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
        level: true,
        experience: true,
        createdAt: true,
        updatedAt: true,
        achievements: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true,
            points: true
          }
        }
      }
    });
  }

  // Verify password
  static async verifyPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
  static async updateUser(id: string, updateData: UpdateUserData) {
    return await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
        level: true,
        experience: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  // Change user role
  static async changeUserRole(id: string, newRole: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        role: newRole as any,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
        level: true,
        experience: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  // Delete user
  static async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
  }

  // Get all users with pagination
  static async getAllUsers(page: number = 1, limit: number = 10, role?: string) {
    const skip = (page - 1) * limit;
    
    const where = role ? { role: role as any } : {};
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          imageUrl: true,
          level: true,
          experience: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);
    
    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Add achievement to user
  static async addAchievementToUser(userId: string, achievementId: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        achievements: {
          connect: { id: achievementId }
        }
      },
      select: {
        id: true,
        name: true,
        achievements: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true,
            points: true
          }
        }
      }
    });
  }

  // Update user experience and level
  static async updateExperience(userId: string, experienceGained: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { experience: true, level: true }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const newExperience = user.experience + experienceGained;
    const newLevel = Math.floor(newExperience / 100) + 1; // 100 XP per level
    
    return await prisma.user.update({
      where: { id: userId },
      data: {
        experience: newExperience,
        level: newLevel,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        level: true,
        experience: true,
        imageUrl: true,
        role: true
      }
    });
  }

  // Get user statistics
  static async getUserStats(userId: string) {
    const [user, battleStats] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          level: true,
          experience: true,
          role: true,
          achievements: {
            select: {
              id: true,
              name: true,
              icon: true,
              description: true,
              points: true
            }
          }
        }
      }),
      prisma.userBattleStats.findUnique({
        where: { userId }
      })
    ]);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      user,
      battleStats: battleStats || {
        totalGames: 0,
        wins: 0,
        losses: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        experience: 0
      }
    };
  }
}