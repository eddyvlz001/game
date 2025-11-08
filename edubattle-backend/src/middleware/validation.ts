import { body, param, query, ValidationChain } from 'express-validator';

// User validation rules
export const validateUserRegistration: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['STUDENT', 'TEACHER', 'ADMIN'])
    .withMessage('Role must be STUDENT, TEACHER, or ADMIN')
];

export const validateUserLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateUserUpdate: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('level')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Level must be between 1 and 100')
];

// Question validation rules
export const validateQuestion: ValidationChain[] = [
  body('text')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Question text must be between 10 and 500 characters'),
  body('answers')
    .isArray({ min: 2, max: 6 })
    .withMessage('Must have between 2 and 6 answers'),
  body('answers.*')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Each answer must be between 1 and 200 characters'),
  body('correctAnswerIndex')
    .isInt({ min: 0 })
    .withMessage('Correct answer index must be a non-negative integer'),
  body('difficulty')
    .optional()
    .isIn(['EASY', 'MEDIUM', 'HARD'])
    .withMessage('Difficulty must be EASY, MEDIUM, or HARD'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
];

// Professor card validation rules
export const validateProfessorCard: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('imageUrl')
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('skills')
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*.name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Skill name must be between 1 and 50 characters'),
  body('skills.*.score')
    .isInt({ min: 0, max: 100 })
    .withMessage('Skill score must be between 0 and 100'),
  body('locked')
    .optional()
    .isBoolean()
    .withMessage('Locked must be a boolean value')
];

// Achievement validation rules
export const validateAchievement: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('icon')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Icon must be between 1 and 50 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Description must be between 10 and 200 characters'),
  body('points')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Points must be between 1 and 1000')
];

// Module validation rules
export const validateCustomModule: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('icon')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Icon must be between 1 and 50 characters'),
  body('role')
    .isIn(['STUDENT', 'TEACHER'])
    .withMessage('Role must be STUDENT or TEACHER'),
  body('gameMode')
    .isIn(['INDIVIDUAL', 'GROUP'])
    .withMessage('Game mode must be INDIVIDUAL or GROUP'),
  body('accessMethod')
    .isIn(['CODE', 'QR', 'BOTH'])
    .withMessage('Access method must be CODE, QR, or BOTH')
];

// Parameter validation rules
export const validateObjectId = (paramName: string = 'id'): ValidationChain[] => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid ID`)
];

// Query validation rules
export const validatePagination: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name', 'level'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Error handler middleware
export const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = req.validationErrors();
  
  if (errors) {
    const formattedErrors = errors.map((error: any) => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  next();
};