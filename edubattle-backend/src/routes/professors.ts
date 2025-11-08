import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import {
  validateProfessorCard,
  validateObjectId,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/professors - Get all professor cards
router.get('/', 
  async (req: express.Request, res: express.Response) => {
    try {
      const { locked } = req.query;
      
      const where = locked !== undefined ? { locked: locked === 'true' } : {};
      
      const professors = await prisma.professorCard.findMany({
        where,
        orderBy: { id: 'asc' }
      });
      
      res.json({
        success: true,
        data: professors
      });
      
    } catch (error: any) {
      console.error('Get professors error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/professors/:id - Get professor card by ID
router.get('/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const professor = await prisma.professorCard.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!professor) {
        return res.status(404).json({
          success: false,
          message: 'Professor card not found'
        });
      }
      
      res.json({
        success: true,
        data: professor
      });
      
    } catch (error: any) {
      console.error('Get professor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/professors - Create new professor card (Admin only)
router.post('/',
  authenticateToken,
  requireAdmin,
  validateProfessorCard,
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const {
        name,
        title,
        imageUrl,
        skills,
        locked = true
      } = req.body;
      
      const professor = await prisma.professorCard.create({
        data: {
          name,
          title,
          imageUrl,
          skills,
          locked
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'Professor card created successfully',
        data: professor
      });
      
    } catch (error: any) {
      console.error('Create professor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/professors/:id - Update professor card (Admin only)
router.put('/:id',
  authenticateToken,
  requireAdmin,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const {
        name,
        title,
        imageUrl,
        skills,
        locked
      } = req.body;
      
      // Check if professor card exists
      const existingProfessor = await prisma.professorCard.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!existingProfessor) {
        return res.status(404).json({
          success: false,
          message: 'Professor card not found'
        });
      }
      
      const professor = await prisma.professorCard.update({
        where: { id: parseInt(id) },
        data: {
          ...(name !== undefined && { name }),
          ...(title !== undefined && { title }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(skills !== undefined && { skills }),
          ...(locked !== undefined && { locked }),
          updatedAt: new Date()
        }
      });
      
      res.json({
        success: true,
        message: 'Professor card updated successfully',
        data: professor
      });
      
    } catch (error: any) {
      console.error('Update professor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// DELETE /api/professors/:id - Delete professor card (Admin only)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Check if professor card exists
      const existingProfessor = await prisma.professorCard.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!existingProfessor) {
        return res.status(404).json({
          success: false,
          message: 'Professor card not found'
        });
      }
      
      const professor = await prisma.professorCard.delete({
        where: { id: parseInt(id) }
      });
      
      res.json({
        success: true,
        message: 'Professor card deleted successfully',
        data: professor
      });
      
    } catch (error: any) {
      console.error('Delete professor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/professors/:id/unlock - Unlock professor card for a user
router.put('/:id/unlock',
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      // Check if professor card exists
      const professor = await prisma.professorCard.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!professor) {
        return res.status(404).json({
          success: false,
          message: 'Professor card not found'
        });
      }
      
      // Check if user has sufficient level to unlock
      const user = await prisma.user.findUnique({
        where: { id: userId || req.user!.id },
        select: { level: true }
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Simple unlocking logic: user must be level 5 or higher
      if (user.level < 5) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient level to unlock this professor card',
          requiredLevel: 5,
          currentLevel: user.level
        });
      }
      
      // Update professor card to be unlocked
      const updatedProfessor = await prisma.professorCard.update({
        where: { id: parseInt(id) },
        data: {
          locked: false,
          updatedAt: new Date()
        }
      });
      
      res.json({
        success: true,
        message: 'Professor card unlocked successfully',
        data: updatedProfessor
      });
      
    } catch (error: any) {
      console.error('Unlock professor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/professors/available/unlocked - Get available unlocked professor cards for user
router.get('/available/unlocked',
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { userId } = req.query;
      const targetUserId = userId as string || req.user!.id;
      
      // Get user's level
      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { level: true, name: true }
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Get unlocked professor cards (simple logic: unlocked or user level >= 5)
      const availableProfessors = await prisma.professorCard.findMany({
        where: {
          OR: [
            { locked: false },
            { id: { in: [] } } // Could add specific unlocked cards based on achievements
          ]
        },
        orderBy: { id: 'asc' }
      });
      
      // Add unlock requirement info
      const professorsWithRequirements = availableProfessors.map(professor => ({
        ...professor,
        unlockRequirement: {
          type: 'level',
          value: 5,
          userLevel: user.level,
          isUnlocked: user.level >= 5
        }
      }));
      
      res.json({
        success: true,
        data: {
          user: {
            id: targetUserId,
            name: user.name,
            level: user.level
          },
          professors: professorsWithRequirements
        }
      });
      
    } catch (error: any) {
      console.error('Get available professors error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

export default router;