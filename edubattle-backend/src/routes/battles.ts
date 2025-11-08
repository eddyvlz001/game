import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateObjectId } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to generate unique battle codes
const generateBattleCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// POST /api/battles/create - Create a new battle session
router.post('/create',
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const {
        name,
        maxPlayers = 4,
        questions = []
      } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Battle name is required'
        });
      }
      
      if (maxPlayers < 2 || maxPlayers > 8) {
        return res.status(400).json({
          success: false,
          message: 'Max players must be between 2 and 8'
        });
      }
      
      // Generate unique battle code
      let battleCode = generateBattleCode();
      let attempts = 0;
      
      while (attempts < 10) {
        const existingBattle = await prisma.battleSession.findUnique({
          where: { code: battleCode }
        });
        
        if (!existingBattle) {
          break;
        }
        
        battleCode = generateBattleCode();
        attempts++;
      }
      
      if (attempts >= 10) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate unique battle code'
        });
      }
      
      // Validate questions if provided
      if (questions.length > 0) {
        const questionIds = Array.isArray(questions) ? questions : [];
        const validQuestions = await prisma.question.findMany({
          where: {
            id: { in: questionIds }
          },
          select: { id: true }
        });
        
        if (validQuestions.length !== questionIds.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more provided question IDs are invalid'
          });
        }
      }
      
      const battle = await prisma.battleSession.create({
        data: {
          code: battleCode,
          hostId: req.user!.id,
          name: name.trim(),
          maxPlayers,
          questions: questions.length > 0 ? questions : [],
          status: 'waiting'
        }
      });
      
      // Create battle stats for host
      await prisma.userBattleStats.upsert({
        where: { userId: req.user!.id },
        create: { userId: req.user!.id },
        update: {}
      });
      
      res.status(201).json({
        success: true,
        message: 'Battle created successfully',
        data: {
          battle,
          joinUrl: `${req.protocol}://${req.get('host')}/api/battles/join/${battleCode}`
        }
      });
      
    } catch (error: any) {
      console.error('Create battle error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/battles/:id - Get battle session details
router.get('/:id',
  authenticateToken,
  validateObjectId('id'),
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const battle = await prisma.battleSession.findUnique({
        where: { id },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              level: true,
              imageUrl: true
            }
          }
        }
      });
      
      if (!battle) {
        return res.status(404).json({
          success: false,
          message: 'Battle not found'
        });
      }
      
      res.json({
        success: true,
        data: battle
      });
      
    } catch (error: any) {
      console.error('Get battle error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/battles/join/:code - Join a battle session
router.post('/join/:code',
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { code } = req.params;
      
      const battle = await prisma.battleSession.findUnique({
        where: { code: code.toUpperCase() }
      });
      
      if (!battle) {
        return res.status(404).json({
          success: false,
          message: 'Battle not found'
        });
      }
      
      if (battle.status !== 'waiting') {
        return res.status(400).json({
          success: false,
          message: 'Battle is not accepting new players'
        });
      }
      
      if (battle.currentPlayers >= battle.maxPlayers) {
        return res.status(400).json({
          success: false,
          message: 'Battle is full'
        });
      }
      
      // Check if user is already in the battle
      if (battle.hostId === req.user!.id) {
        return res.status(400).json({
          success: false,
          message: 'You are already the host of this battle'
        });
      }
      
      // Update battle with new player count
      const updatedBattle = await prisma.battleSession.update({
        where: { id: battle.id },
        data: {
          currentPlayers: {
            increment: 1
          }
        }
      });
      
      // Create battle stats for user if they don't exist
      await prisma.userBattleStats.upsert({
        where: { userId: req.user!.id },
        create: { userId: req.user!.id },
        update: {}
      });
      
      res.json({
        success: true,
        message: 'Joined battle successfully',
        data: {
          battle: updatedBattle
        }
      });
      
    } catch (error: any) {
      console.error('Join battle error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/battles/:id/start - Start a battle session
router.put('/:id/start',
  authenticateToken,
  validateObjectId('id'),
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const battle = await prisma.battleSession.findUnique({
        where: { id }
      });
      
      if (!battle) {
        return res.status(404).json({
          success: false,
          message: 'Battle not found'
        });
      }
      
      if (battle.hostId !== req.user!.id) {
        return res.status(403).json({
          success: false,
          message: 'Only the host can start the battle'
        });
      }
      
      if (battle.status !== 'waiting') {
        return res.status(400).json({
          success: false,
          message: 'Battle has already started'
        });
      }
      
      if (battle.currentPlayers < 2) {
        return res.status(400).json({
          success: false,
          message: 'Need at least 2 players to start the battle'
        });
      }
      
      const updatedBattle = await prisma.battleSession.update({
        where: { id },
        data: {
          status: 'active',
          startedAt: new Date()
        }
      });
      
      res.json({
        success: true,
        message: 'Battle started successfully',
        data: updatedBattle
      });
      
    } catch (error: any) {
      console.error('Start battle error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/battles/:id/end - End a battle session
router.put('/:id/end',
  authenticateToken,
  validateObjectId('id'),
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const { winnerId, results } = req.body;
      
      const battle = await prisma.battleSession.findUnique({
        where: { id }
      });
      
      if (!battle) {
        return res.status(404).json({
          success: false,
          message: 'Battle not found'
        });
      }
      
      if (!['active', 'waiting'].includes(battle.status)) {
        return res.status(400).json({
          success: false,
          message: 'Battle is already finished'
        });
      }
      
      if (battle.hostId !== req.user!.id) {
        return res.status(403).json({
          success: false,
          message: 'Only the host can end the battle'
        });
      }
      
      const updatedBattle = await prisma.battleSession.update({
        where: { id },
        data: {
          status: 'finished',
          finishedAt: new Date()
        }
      });
      
      // Update battle stats for all participants
      if (results && Array.isArray(results)) {
        const updatePromises = results.map(async (result: any) => {
          const isWinner = result.userId === winnerId;
          
          return prisma.userBattleStats.upsert({
            where: { userId: result.userId },
            create: {
              userId: result.userId,
              totalGames: 1,
              wins: isWinner ? 1 : 0,
              losses: isWinner ? 0 : 1,
              totalQuestions: result.totalQuestions || 0,
              correctAnswers: result.correctAnswers || 0,
              experience: isWinner ? 50 : 25 // Award experience
            },
            update: {
              totalGames: { increment: 1 },
              wins: isWinner ? { increment: 1 } : undefined,
              losses: isWinner ? undefined : { increment: 1 },
              totalQuestions: { increment: result.totalQuestions || 0 },
              correctAnswers: { increment: result.correctAnswers || 0 },
              experience: { increment: isWinner ? 50 : 25 }
            }
          });
        });
        
        await Promise.all(updatePromises);
      }
      
      res.json({
        success: true,
        message: 'Battle ended successfully',
        data: updatedBattle
      });
      
    } catch (error: any) {
      console.error('End battle error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/battles - Get user's battle sessions
router.get('/',
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { status, role } = req.query;
      
      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      if (role === 'host') {
        where.hostId = req.user!.id;
      } else if (role === 'participant') {
        // This would need a participants table in a real implementation
        where.hostId = { not: req.user!.id };
      } else {
        // Show battles where user is either host or participant
        where.OR = [
          { hostId: req.user!.id }
          // { participants: { some: { userId: req.user!.id } } } // Would need participants table
        ];
      }
      
      const battles = await prisma.battleSession.findMany({
        where,
        include: {
          host: {
            select: {
              id: true,
              name: true,
              level: true,
              imageUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      
      res.json({
        success: true,
        data: battles
      });
      
    } catch (error: any) {
      console.error('Get user battles error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// DELETE /api/battles/:id - Cancel/delete a battle session
router.delete('/:id',
  authenticateToken,
  validateObjectId('id'),
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const battle = await prisma.battleSession.findUnique({
        where: { id }
      });
      
      if (!battle) {
        return res.status(404).json({
          success: false,
          message: 'Battle not found'
        });
      }
      
      if (battle.hostId !== req.user!.id) {
        return res.status(403).json({
          success: false,
          message: 'Only the host can cancel the battle'
        });
      }
      
      if (battle.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel an active battle'
        });
      }
      
      const deletedBattle = await prisma.battleSession.delete({
        where: { id }
      });
      
      res.json({
        success: true,
        message: 'Battle cancelled successfully',
        data: deletedBattle
      });
      
    } catch (error: any) {
      console.error('Delete battle error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

export default router;