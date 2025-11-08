import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import {
  validateAchievement,
  validateObjectId,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/achievements - Get all achievements
router.get('/', 
  async (req: express.Request, res: express.Response) => {
    try {
      const achievements = await prisma.achievement.findMany({
        orderBy: { id: 'asc' }
      });
      
      res.json({
        success: true,
        data: achievements
      });
      
    } catch (error: any) {
      console.error('Get achievements error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/achievements/:id - Get achievement by ID
router.get('/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const achievement = await prisma.achievement.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement not found'
        });
      }
      
      res.json({
        success: true,
        data: achievement
      });
      
    } catch (error: any) {
      console.error('Get achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/achievements - Create new achievement (Admin only)
router.post('/',
  authenticateToken,
  requireAdmin,
  validateAchievement,
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const {
        name,
        icon,
        description,
        points = 10
      } = req.body;
      
      const achievement = await prisma.achievement.create({
        data: {
          name,
          icon,
          description,
          points
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'Achievement created successfully',
        data: achievement
      });
      
    } catch (error: any) {
      console.error('Create achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/achievements/:id - Update achievement (Admin only)
router.put('/:id',
  authenticateToken,
  requireAdmin,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const {
        name,
        icon,
        description,
        points
      } = req.body;
      
      // Check if achievement exists
      const existingAchievement = await prisma.achievement.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!existingAchievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement not found'
        });
      }
      
      const achievement = await prisma.achievement.update({
        where: { id: parseInt(id) },
        data: {
          ...(name !== undefined && { name }),
          ...(icon !== undefined && { icon }),
          ...(description !== undefined && { description }),
          ...(points !== undefined && { points }),
          updatedAt: new Date()
        }
      });
      
      res.json({
        success: true,
        message: 'Achievement updated successfully',
        data: achievement
      });
      
    } catch (error: any) {
      console.error('Update achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// DELETE /api/achievements/:id - Delete achievement (Admin only)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Check if achievement exists
      const existingAchievement = await prisma.achievement.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!existingAchievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement not found'
        });
      }
      
      const achievement = await prisma.achievement.delete({
        where: { id: parseInt(id) }
      });
      
      res.json({
        success: true,
        message: 'Achievement deleted successfully',
        data: achievement
      });
      
    } catch (error: any) {
      console.error('Delete achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/achievements/user/:userId - Get user achievements
router.get('/user/:userId',
  authenticateToken,
  validateObjectId('userId'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { userId } = req.params;
      
      // Users can only view their own achievements unless they're admin or teacher
      if (req.user!.id !== userId && !['ADMIN', 'TEACHER'].includes(req.user!.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          level: true,
          achievements: {
            orderBy: { id: 'asc' }
          }
        }
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            level: user.level,
            totalAchievements: user.achievements.length
          },
          achievements: user.achievements
        }
      });
      
    } catch (error: any) {
      console.error('Get user achievements error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/achievements/:id/award - Award achievement to user (Admin only)
router.post('/:id/award',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      // Check if achievement exists
      const achievement = await prisma.achievement.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement not found'
        });
      }
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check if user already has this achievement
      const existingUserAchievement = await prisma.user.findFirst({
        where: {
          id: userId,
          achievements: {
            some: {
              id: parseInt(id)
            }
          }
        }
      });
      
      if (existingUserAchievement) {
        return res.status(400).json({
          success: false,
          message: 'User already has this achievement'
        });
      }
      
      // Award the achievement
      const result = await prisma.user.update({
        where: { id: userId },
        data: {
          achievements: {
            connect: { id: parseInt(id) }
          }
        },
        select: {
          id: true,
          name: true,
          level: true,
          achievements: {
            orderBy: { id: 'asc' }
          }
        }
      });
      
      // Award experience points
      if (achievement.points > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            experience: {
              increment: achievement.points
            },
            level: {
              // Level up if experience reaches threshold
              increment: Math.floor((user.experience + achievement.points) / 100) - Math.floor(user.experience / 100)
            }
          }
        });
      }
      
      res.json({
        success: true,
        message: 'Achievement awarded successfully',
        data: {
          user: result,
          achievement: {
            name: achievement.name,
            points: achievement.points
          }
        }
      });
      
    } catch (error: any) {
      console.error('Award achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/achievements/bulk - Create multiple achievements (Admin only)
router.post('/bulk',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { achievements } = req.body;
      
      if (!Array.isArray(achievements) || achievements.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Achievements array is required'
        });
      }
      
      if (achievements.length > 20) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 20 achievements can be created at once'
        });
      }
      
      // Validate each achievement
      for (const achievement of achievements) {
        if (!achievement.name || !achievement.icon || !achievement.description) {
          return res.status(400).json({
            success: false,
            message: 'Each achievement must have name, icon, and description'
          });
        }
      }
      
      const createdAchievements = await prisma.$transaction(
        achievements.map(achievement =>
          prisma.achievement.create({
            data: {
              name: achievement.name,
              icon: achievement.icon,
              description: achievement.description,
              points: achievement.points || 10
            }
          })
        )
      );
      
      res.status(201).json({
        success: true,
        message: `${createdAchievements.length} achievements created successfully`,
        data: createdAchievements
      });
      
    } catch (error: any) {
      console.error('Bulk create achievements error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

export default router;