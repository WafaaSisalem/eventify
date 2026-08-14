import type { Request, Response, NextFunction } from 'express';
import { venueService } from '../services/venue.service.ts';
import type { CreateVenueDTO, UpdateVenueDTO } from '../domain/venue.ts';

export const createVenue = (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as CreateVenueDTO;
    const venue = venueService.create(data);
    res.status(201).json(venue);
  } catch (error) {
    next(error);
  }
};

export const listVenues = (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit as number | undefined;
    const offset = req.query.offset as number | undefined;
    const venues = venueService.list(limit, offset);
    res.json(venues);
  } catch (error) {
    next(error);
  }
};

export const getVenue = (req: Request, res: Response, next: NextFunction) => {
  try {
    const venue = venueService.getById(req.params.id as string);
    res.json(venue);
  } catch (error) {
    next(error);
  }
};

export const updateVenue = (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as UpdateVenueDTO;
    const venue = venueService.update(req.params.id as string, data);
    res.json(venue);
  } catch (error) {
    next(error);
  }
};

export const deleteVenue = (req: Request, res: Response, next: NextFunction) => {
  try {
    venueService.delete(req.params.id as string);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
};
