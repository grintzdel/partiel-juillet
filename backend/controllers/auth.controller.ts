import type { RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'
import type { HydratedDocument } from 'mongoose'
import User, { type IUser } from '../models/User.model'

const SALT_ROUNDS = 10

interface RegisterBody {
  name: string
  email: string
  password: string
}

interface LoginBody {
  email: string
  password: string
}

function signToken(user: HydratedDocument<IUser>): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn']
  return jwt.sign({ sub: user._id.toString(), email: user.email }, secret, { expiresIn })
}

export const register: RequestHandler<unknown, unknown, RegisterBody> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      res.status(409).json({ error: 'An account already exists with this email' })
      return
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await User.create({ name, email, passwordHash })

    const token = signToken(user)
    res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
}

export const login: RequestHandler<unknown, unknown, LoginBody> = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = signToken(user)
    res.status(200).json({ user, token })
  } catch (err) {
    next(err)
  }
}
