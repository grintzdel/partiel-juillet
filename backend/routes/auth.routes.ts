import { Router } from 'express'
import { login, register } from '../controllers/auth.controller'
import { loginRules, registerRules } from '../validators/auth.validator'
import validate from '../middlewares/validate.middleware'

const router = Router()

router.post('/register', registerRules, validate, register)
router.post('/login', loginRules, validate, login)

export default router
