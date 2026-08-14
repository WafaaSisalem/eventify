import { randomUUID } from 'node:crypto';
import type { Booking, CreateBookingDTO } from '../domain/booking.ts';
import { HttpError } from '../errors/HttpError.ts';
import { eventService } from './event.service.ts';

class BookingService {
  private bookings: Map<string, Booking> = new Map();

  create(data: CreateBookingDTO): Booking {
    // For now, hardcode user until Session 4
    const userId = 'usr-2';

    // 1. Ensure event exists (eventService will throw 404 if not)
    const event = eventService.getById(data.eventId);

    // 2. Check for duplicate booking
    const allBookings = Array.from(this.bookings.values());
    const existingBooking = allBookings.find(b => b.eventId === data.eventId && b.userId === userId);
    if (existingBooking) {
      throw new HttpError(409, 'Duplicate booking');
    }

    // 3. Check capacity
    const currentBookings = allBookings.filter(b => b.eventId === data.eventId && b.status !== 'CANCELLED');
    if (currentBookings.length >= event.capacity) {
      throw new HttpError(409, 'Event is at capacity');
    }

    const newBooking: Booking = {
      id: randomUUID(),
      eventId: data.eventId,
      userId,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(newBooking.id, newBooking);
    return newBooking;
  }
}

export const bookingService = new BookingService();
