import { body, type ValidationChain } from 'express-validator'
import { EVENT_CATEGORIES } from '../models/Event.model'

export const createEventRules: ValidationChain[] = [
  body('title').isString().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
  body('description')
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('date').isISO8601().withMessage('Date must be a valid date (ISO 8601)').toDate(),
  body('location').isString().trim().notEmpty().withMessage('Location is required'),
  body('category')
    .isIn([...EVENT_CATEGORIES])
    .withMessage(`Category must be one of: ${EVENT_CATEGORIES.join(', ')}`),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer')
    .toInt(),
]
