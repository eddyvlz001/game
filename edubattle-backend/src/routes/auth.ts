import express from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/userService';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { 
  validateUserRegistration, 
  validateUserLogin, 
  handleValidationErrors 
} from '../middleware/validation';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', 
  validateUserRegistration,
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      const { email, name, password, role, imageUrl } = req.body;
      
      // Check if user already exists
      const existingUser = await UserService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      // Create new user
      const result = await UserService.createUser({
        email,
        name,
        password,
        role,
        imageUrl
      });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token
        }
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/auth/login - Login user
router.post('/login',
  validateUserLogin,
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await UserService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      
      // Verify password (for now, we'll use a mock verification)
      // In a real app, you would get the stored hash and compare
      const storedPassword = 'password123'; // This should come from the database
      
      if (password !== storedPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      
      // Generate token
      const token = require('../middleware/auth').generateToken(user);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// GET /api/auth/profile - Get current user profile
router.get('/profile',
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const user = await UserService.findUserById(req.user!.id);
      
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
      console.error('Profile fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh',
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const user = await UserService.findUserById(req.user!.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const newToken = require('../middleware/auth').generateToken(user);
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: newToken
        }
      });
      
    } catch (error: any) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

// POST /api/auth/logout - Logout user (client-side token removal)
router.post('/logout',
  authenticateToken,
  async (req: AuthRequest, res: express.Response) => {
    try {
      // In a real app with refresh tokens, you would blacklist the token here
      res.json({
        success: true,
        message: 'Logout successful'
      });
      
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
);

export default router;