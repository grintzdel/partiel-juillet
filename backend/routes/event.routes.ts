import { Router } from 'express'
import { createEvent, deleteEvent, getEvent, listEvents } from '../controllers/event.controller'
import { createEventRules } from '../validators/event.validator'
import validate from '../middlewares/validate.middleware'
import requireAuth from '../middlewares/auth.middleware'

const router = Router()

router.get('/', listEvents)
router.get('/:id', getEvent)

router.post('/', requireAuth, createEventRules, validate, createEvent)
router.delete('/:id', requireAuth, deleteEvent)

export default router
