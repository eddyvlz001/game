import express from 'express';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../services/userService';
import { authenticateToken, AuthRequest, requireAdmin, requireTeacherOrAdmin } from '../middleware/auth';
import {
  validateUserUpdate,
  validateObjectId,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users - Get all users (Admin only)
router.get('/',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      const result = await UserService.getAllUsers(
        parseInt(page as string),
        parseInt(limit as string),
        role as string
      );
      
      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
      
    } catch (error: any) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/users/:id - Get user by ID
router.get('/:id',
  authenticateToken,
  validateObjectId('id'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Users can only view their own profile unless they're admin
      if (req.user!.id !== id && req.user!.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      
      const user = await UserService.findUserById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
      
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/users/:id - Update user
router.put('/:id',
  authenticateToken,
  validateObjectId('id'),
  validateUserUpdate,
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Users can only update their own profile unless they're admin
      if (req.user!.id !== id && req.user!.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      
      const user = await UserService.updateUser(id, req.body);
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
      
    } catch (error: any) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/users/:id/role - Change user role (Admin only)
router.put('/:id/role',
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (!['STUDENT', 'TEACHER', 'ADMIN'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be STUDENT, TEACHER, or ADMIN'
        });
      }
      
      const user = await UserService.changeUserRole(id, role);
      
      res.json({
        success: true,
        message: 'User role updated successfully',
        data: user
      });
      
    } catch (error: any) {
      console.error('Change user role error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Prevent admin from deleting themselves
      if (req.user!.id === id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }
      
      const user = await UserService.deleteUser(id);
      
      res.json({
        success: true,
        message: 'User deleted successfully',
        data: user
      });
      
    } catch (error: any) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/users/:id/achievements - Get user achievements
router.get('/:id/achievements',
  authenticateToken,
  validateObjectId('id'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const user = await UserService.findUserById(id);
      
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
            level: user.level
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

// POST /api/users/:id/achievements - Add achievement to user (Admin only)
router.post('/:id/achievements',
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const { achievementId } = req.body;
      
      if (!achievementId) {
        return res.status(400).json({
          success: false,
          message: 'Achievement ID is required'
        });
      }
      
      const result = await UserService.addAchievementToUser(id, achievementId);
      
      res.json({
        success: true,
        message: 'Achievement added successfully',
        data: result
      });
      
    } catch (error: any) {
      console.error('Add achievement error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/users/:id/stats - Get user statistics
router.get('/:id/stats',
  authenticateToken,
  validateObjectId('id'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Users can only view their own stats unless they're admin or teacher
      if (req.user!.id !== id && !['ADMIN', 'TEACHER'].includes(req.user!.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      
      const stats = await UserService.getUserStats(id);
      
      res.json({
        success: true,
        data: stats
      });
      
    } catch (error: any) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/users/:id/experience - Update user experience (System only)
router.put('/:id/experience',
  authenticateToken,
  requireTeacherOrAdmin,
  validateObjectId('id'),
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const { experienceGained } = req.body;
      
      if (typeof experienceGained !== 'number' || experienceGained < 0) {
        return res.status(400).json({
          success: false,
          message: 'Experience gained must be a positive number'
        });
      }
      
      const user = await UserService.updateExperience(id, experienceGained);
      
      res.json({
        success: true,
        message: 'Experience updated successfully',
        data: user
      });
      
    } catch (error: any) {
      console.error('Update experience error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

export default router;