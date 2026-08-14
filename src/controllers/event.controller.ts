import type { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/event.service.ts';
import type { CreateEventDTO, UpdateEventDTO, EventQuery } from '../domain/event.ts';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.loadEvents(); // Ensure data is loaded
    const data = req.body as CreateEventDTO;
    const event = eventService.create(data);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const listEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.loadEvents();
    // Use validated query from res.locals.query
    const query = res.locals.query as EventQuery;
    const result = eventService.list(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.loadEvents();
    const event = eventService.getById(req.params.id as string);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.loadEvents();
    const data = req.body as UpdateEventDTO;
    const event = eventService.update(req.params.id as string, data);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.loadEvents();
    eventService.delete(req.params.id as string);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
};
