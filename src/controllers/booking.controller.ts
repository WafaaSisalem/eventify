import type { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service.ts';
import type { CreateBookingDTO } from '../domain/booking.ts';
import { eventService } from '../services/event.service.ts';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.loadEvents(); // Ensure events are loaded so event exists check works
    const data = req.body as CreateBookingDTO;
    const booking = bookingService.create(data);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};
