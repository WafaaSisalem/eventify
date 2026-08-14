import { z } from 'zod';

export const BookingSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  eventId: z.string(),
  status: z.enum(['CONFIRMED', 'CANCELLED', 'WAITLISTED']),
  createdAt: z.string().datetime(),
});

export type Booking = z.infer<typeof BookingSchema>;

export const CreateBookingSchema = z.strictObject({
  eventId: z.string().min(1),
});

export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>;
