import { Router } from 'express';
import { validateBody, validateQuery } from '../middleware/validate.ts';
import { CreateVenueSchema, UpdateVenueSchema, ListVenuesQuerySchema } from '../domain/venue.ts';
import { createVenue, listVenues, getVenue, updateVenue, deleteVenue } from '../controllers/venue.controller.ts';

const router = Router();

// Create Venue
router.post('/', validateBody(CreateVenueSchema), createVenue);

// List Venues (with optional limit)
router.get('/', validateQuery(ListVenuesQuerySchema), listVenues);

// Get Venue by ID
router.get('/:id', getVenue);

// Partial Update Venue
router.patch('/:id', validateBody(UpdateVenueSchema), updateVenue);

// Delete Venue
router.delete('/:id', deleteVenue);

export default router;
