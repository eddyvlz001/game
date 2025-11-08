import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireTeacherOrAdmin } from '../middleware/auth';
import {
  validateQuestion,
  validateObjectId,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/questions - Get all questions
router.get('/', 
  async (req: express.Request, res: express.Response) => {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        difficulty,
        authorId
      } = req.query;
      
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const where: any = {};
      
      if (category) {
        where.category = category;
      }
      
      if (difficulty) {
        where.difficulty = difficulty;
      }
      
      if (authorId) {
        where.authorId = authorId;
      }
      
      const [questions, total] = await Promise.all([
        prisma.question.findMany({
          where,
          select: {
            id: true,
            text: true,
            answers: true,
            correctAnswerIndex: true,
            difficulty: true,
            category: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
            author: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit as string)
        }),
        prisma.question.count({ where })
      ]);
      
      res.json({
        success: true,
        data: questions,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      });
      
    } catch (error: any) {
      console.error('Get questions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/questions/:id - Get question by ID
router.get('/:id',
  validateObjectId('id'),
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      
      const question = await prisma.question.findUnique({
        where: { id },
        select: {
          id: true,
          text: true,
          answers: true,
          correctAnswerIndex: true,
          difficulty: true,
          category: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      });
      
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }
      
      res.json({
        success: true,
        data: question
      });
      
    } catch (error: any) {
      console.error('Get question error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/questions - Create new question (Teachers and Admins only)
router.post('/',
  authenticateToken,
  requireTeacherOrAdmin,
  validateQuestion,
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const {
        text,
        answers,
        correctAnswerIndex,
        difficulty = 'MEDIUM',
        category = 'General'
      } = req.body;
      
      // Validate that correctAnswerIndex is within bounds
      if (correctAnswerIndex >= answers.length) {
        return res.status(400).json({
          success: false,
          message: 'Correct answer index is out of bounds'
        });
      }
      
      const question = await prisma.question.create({
        data: {
          text,
          answers,
          correctAnswerIndex,
          difficulty: difficulty as any,
          category,
          authorId: req.user!.id
        },
        select: {
          id: true,
          text: true,
          answers: true,
          correctAnswerIndex: true,
          difficulty: true,
          category: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: question
      });
      
    } catch (error: any) {
      console.error('Create question error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// PUT /api/questions/:id - Update question
router.put('/:id',
  authenticateToken,
  requireTeacherOrAdmin,
  validateObjectId('id'),
  validateQuestion,
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const {
        text,
        answers,
        correctAnswerIndex,
        difficulty,
        category
      } = req.body;
      
      // Check if question exists
      const existingQuestion = await prisma.question.findUnique({
        where: { id },
        select: { authorId: true }
      });
      
      if (!existingQuestion) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }
      
      // Check if user is the author or admin
      if (existingQuestion.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'You can only edit your own questions'
        });
      }
      
      // Validate that correctAnswerIndex is within bounds
      if (correctAnswerIndex >= answers.length) {
        return res.status(400).json({
          success: false,
          message: 'Correct answer index is out of bounds'
        });
      }
      
      const question = await prisma.question.update({
        where: { id },
        data: {
          text,
          answers,
          correctAnswerIndex,
          difficulty: difficulty as any,
          category,
          updatedAt: new Date()
        },
        select: {
          id: true,
          text: true,
          answers: true,
          correctAnswerIndex: true,
          difficulty: true,
          category: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      });
      
      res.json({
        success: true,
        message: 'Question updated successfully',
        data: question
      });
      
    } catch (error: any) {
      console.error('Update question error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// DELETE /api/questions/:id - Delete question
router.delete('/:id',
  authenticateToken,
  requireTeacherOrAdmin,
  validateObjectId('id'),
  handleValidationErrors,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      
      // Check if question exists
      const existingQuestion = await prisma.question.findUnique({
        where: { id },
        select: { authorId: true }
      });
      
      if (!existingQuestion) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }
      
      // Check if user is the author or admin
      if (existingQuestion.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own questions'
        });
      }
      
      const question = await prisma.question.delete({
        where: { id },
        select: {
          id: true,
          text: true,
          category: true
        }
      });
      
      res.json({
        success: true,
        message: 'Question deleted successfully',
        data: question
      });
      
    } catch (error: any) {
      console.error('Delete question error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/questions/categories - Get all unique categories
router.get('/categories/list',
  async (req: express.Request, res: express.Response) => {
    try {
      const categories = await prisma.question.findMany({
        select: { category: true },
        distinct: ['category']
      });
      
      res.json({
        success: true,
        data: categories.map(c => c.category)
      });
      
    } catch (error: any) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/questions/bulk - Create multiple questions (Admin only)
router.post('/bulk',
  authenticateToken,
  requireTeacherOrAdmin,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const { questions } = req.body;
      
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Questions array is required'
        });
      }
      
      if (questions.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 50 questions can be created at once'
        });
      }
      
      // Validate each question
      for (const question of questions) {
        if (!question.text || !Array.isArray(question.answers) || typeof question.correctAnswerIndex !== 'number') {
          return res.status(400).json({
            success: false,
            message: 'Each question must have text, answers array, and correctAnswerIndex'
          });
        }
        
        if (question.correctAnswerIndex >= question.answers.length) {
          return res.status(400).json({
            success: false,
            message: 'Correct answer index is out of bounds for one or more questions'
          });
        }
      }
      
      const createdQuestions = await prisma.$transaction(
        questions.map(question =>
          prisma.question.create({
            data: {
              text: question.text,
              answers: question.answers,
              correctAnswerIndex: question.correctAnswerIndex,
              difficulty: (question.difficulty || 'MEDIUM') as any,
              category: question.category || 'General',
              authorId: req.user!.id
            },
            select: {
              id: true,
              text: true,
              category: true,
              createdAt: true
            }
          })
        )
      );
      
      res.status(201).json({
        success: true,
        message: `${createdQuestions.length} questions created successfully`,
        data: createdQuestions
      });
      
    } catch (error: any) {
      console.error('Bulk create questions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

export default router;