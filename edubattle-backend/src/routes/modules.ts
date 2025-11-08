import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import {
  validateCustomModule,
  validateObjectId,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/modules - Get all custom modules
router.get('/', 
  async (req: express.Request, res: express.Response) => {
    try {
      const { role, enabled } = req.query;
      
      const where: any = {};
      
      if (role) {
        where.role = role;
      }
      
      if (enabled !== undefined) {
        where.enabled = enabled === 'true';
      }
      
      const modules = await prisma.customModule.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
      
      res.json({
        success: true,
        data: modules
      });
      
    } catch (error: any) {
      console.error('Get modules error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/modules/:id - Get custom module by ID
router.get('/:id',
  validateObjectId('id'),
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const module = await prisma.customModule.findUnique({
        where: { id }
      });
      
      if (!module) {
        return res.status(404).json({
          success: false,
          message: 'Module not found'
        });
      }
      
      res.json({
        success: true,
        data: module
      });
      
    } catch (error: any) {
      console.error('Get module error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/modules - Create new custom module (Admin only)
router.post('/',
  authenticateToken,
  requireAdmin,
  validateCustomModule,
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const {
        name,
        icon,
        role,
        gameMode,
        accessMethod,
        enabled = true
      } = req.body;
      
      const module = await prisma.customModule.create({
        data: {
          name,
          icon,
          role: role as any,
          gameMode: gameMode as any,
          accessMethod: accessMethod as any,
          enabled
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'Custom module created successfully',
        data: module
      });
      
    } catch (error: any) {
      console.error('Create module error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/modules/:id - Update custom module (Admin only)
router.put('/:id',
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const {
        name,
        icon,
        role,
        gameMode,
        accessMethod,
        enabled
      } = req.body;
      
      // Check if module exists
      const existingModule = await prisma.customModule.findUnique({
        where: { id }
      });
      
      if (!existingModule) {
        return res.status(404).json({
          success: false,
          message: 'Module not found'
        });
      }
      
      const module = await prisma.customModule.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(icon !== undefined && { icon }),
          ...(role !== undefined && { role: role as any }),
          ...(gameMode !== undefined && { gameMode: gameMode as any }),
          ...(accessMethod !== undefined && { accessMethod: accessMethod as any }),
          ...(enabled !== undefined && { enabled }),
          updatedAt: new Date()
        }
      });
      
      res.json({
        success: true,
        message: 'Custom module updated successfully',
        data: module
      });
      
    } catch (error: any) {
      console.error('Update module error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// DELETE /api/modules/:id - Delete custom module (Admin only)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Check if module exists
      const existingModule = await prisma.customModule.findUnique({
        where: { id }
      });
      
      if (!existingModule) {
        return res.status(404).json({
          success: false,
          message: 'Module not found'
        });
      }
      
      const module = await prisma.customModule.delete({
        where: { id }
      });
      
      res.json({
        success: true,
        message: 'Custom module deleted successfully',
        data: module
      });
      
    } catch (error: any) {
      console.error('Delete module error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/modules/enabled/:role - Get enabled modules for a specific role
router.get('/enabled/:role',
  async (req: express.Request, res: express.Response) => {
    try {
      const { role } = req.params;
      
      if (!['STUDENT', 'TEACHER'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role must be STUDENT or TEACHER'
        });
      }
      
      const modules = await prisma.customModule.findMany({
        where: {
          role: role as any,
          enabled: true
        },
        orderBy: { name: 'asc' }
      });
      
      res.json({
        success: true,
        data: {
          role,
          modules,
          total: modules.length
        }
      });
      
    } catch (error: any) {
      console.error('Get enabled modules error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/modules/:id/toggle - Toggle module enabled/disabled (Admin only)
router.put('/:id/toggle',
  authenticateToken,
  requireAdmin,
  validateObjectId('id'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Check if module exists
      const existingModule = await prisma.customModule.findUnique({
        where: { id }
      });
      
      if (!existingModule) {
        return res.status(404).json({
          success: false,
          message: 'Module not found'
        });
      }
      
      const module = await prisma.customModule.update({
        where: { id },
        data: {
          enabled: !existingModule.enabled,
          updatedAt: new Date()
        }
      });
      
      res.json({
        success: true,
        message: `Module ${module.enabled ? 'enabled' : 'disabled'} successfully`,
        data: module
      });
      
    } catch (error: any) {
      console.error('Toggle module error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/modules/bulk - Create multiple modules (Admin only)
router.post('/bulk',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { modules } = req.body;
      
      if (!Array.isArray(modules) || modules.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Modules array is required'
        });
      }
      
      if (modules.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 modules can be created at once'
        });
      }
      
      // Validate each module
      for (const module of modules) {
        if (!module.name || !module.icon || !module.role || !module.gameMode || !module.accessMethod) {
          return res.status(400).json({
            success: false,
            message: 'Each module must have name, icon, role, gameMode, and accessMethod'
          });
        }
        
        if (!['STUDENT', 'TEACHER'].includes(module.role)) {
          return res.status(400).json({
            success: false,
            message: 'Role must be STUDENT or TEACHER'
          });
        }
        
        if (!['INDIVIDUAL', 'GROUP'].includes(module.gameMode)) {
          return res.status(400).json({
            success: false,
            message: 'Game mode must be INDIVIDUAL or GROUP'
          });
        }
        
        if (!['CODE', 'QR', 'BOTH'].includes(module.accessMethod)) {
          return res.status(400).json({
            success: false,
            message: 'Access method must be CODE, QR, or BOTH'
          });
        }
      }
      
      const createdModules = await prisma.$transaction(
        modules.map(module =>
          prisma.customModule.create({
            data: {
              name: module.name,
              icon: module.icon,
              role: module.role as any,
              gameMode: module.gameMode as any,
              accessMethod: module.accessMethod as any,
              enabled: module.enabled !== undefined ? module.enabled : true
            }
          })
        )
      );
      
      res.status(201).json({
        success: true,
        message: `${createdModules.length} modules created successfully`,
        data: createdModules
      });
      
    } catch (error: any) {
      console.error('Bulk create modules error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

export default router;