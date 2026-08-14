import { z } from 'zod';

export const VenueSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(255),
  capacity: z.number().int().positive().max(100000),
  contactEmail: z.email().max(255),//here
  createdAt: z.iso.datetime(),//here
});

export type Venue = z.infer<typeof VenueSchema>;

// For creation, we don't expect id or createdAt from the user
export const CreateVenueSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(255),
  capacity: z.number().int().positive().max(100000),
  contactEmail: z.email().max(255),
}).strict();

export type CreateVenueDTO = z.infer<typeof CreateVenueSchema>;

// For partial updates, all fields are optional
export const UpdateVenueSchema = CreateVenueSchema.partial();
export type UpdateVenueDTO = z.infer<typeof UpdateVenueSchema>;

// For list query parameters
export const ListVenuesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
}).strict();
