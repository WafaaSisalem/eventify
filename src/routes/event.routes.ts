import { Router } from 'express';
import { validateBody, validateQuery } from '../middleware/validate.ts';
import { CreateEventSchema, UpdateEventSchema, EventQuerySchema } from '../domain/event.ts';
import { createEvent, listEvents, getEvent, updateEvent, deleteEvent } from '../controllers/event.controller.ts';

const router = Router();

router.post('/', validateBody(CreateEventSchema), createEvent);
router.get('/', validateQuery(EventQuerySchema), listEvents);
router.get('/:id', getEvent);
router.patch('/:id', validateBody(UpdateEventSchema), updateEvent);
router.delete('/:id', deleteEvent);

export default router;
