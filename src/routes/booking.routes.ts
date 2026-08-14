import { Router } from 'express';
import { validateBody } from '../middleware/validate.ts';
import { CreateBookingSchema } from '../domain/booking.ts';
import { createBooking } from '../controllers/booking.controller.ts';

const router = Router();

router.post('/', validateBody(CreateBookingSchema), createBooking);

export default router;
