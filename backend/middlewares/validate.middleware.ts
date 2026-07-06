import type { RequestHandler } from 'express'
import { validationResult } from 'express-validator'

const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Invalid data',
      details: errors.array().map((e) => ({
        field: e.type === 'field' ? e.path : e.type,
        message: e.msg,
      })),
    })
    return
  }
  next()
}

export default validate
