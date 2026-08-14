import { z } from 'zod';

export const EventSchema = z.object({
  id: z.uuid(),//here
  title: z.string().min(3).max(120),
  description: z.string().max(2000),
  venue: z.string().min(1).max(120),
  startsAt: z.iso.datetime(),
  capacity: z.number().int().positive(),
  priceCents: z.number().int().nonnegative(),
  organizerId: z.string(),
  createdAt: z.iso.datetime(),
});

export type Event = z.infer<typeof EventSchema>;

export const CreateEventSchema = z.strictObject({
  title: z.string().min(3).max(120),
  description: z.string().max(2000),
  venue: z.string().min(1),
  startsAt: z.coerce.date().transform(d => d.toISOString()),
  capacity: z.number().int().positive(),
  priceCents: z.number().int().nonnegative(),
});

export type CreateEventDTO = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = CreateEventSchema.partial();
export type UpdateEventDTO = z.infer<typeof UpdateEventSchema>;

export const EventQuerySchema = z.strictObject({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  venue: z.string().optional(),
  from: z.coerce.date().transform(d => d.toISOString()).optional(),
  to: z.coerce.date().transform(d => d.toISOString()).optional(),
});

export type EventQuery = z.infer<typeof EventQuerySchema>;
