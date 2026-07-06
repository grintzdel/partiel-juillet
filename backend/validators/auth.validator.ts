import { body, type ValidationChain } from 'express-validator'

export const registerRules: ValidationChain[] = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is invalid').normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
]

export const loginRules: ValidationChain[] = [
  body('email').isEmail().withMessage('Email is invalid').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required'),
]
