import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from './middleware/errorHandler.ts';
import { HttpError } from './errors/HttpError.ts';
import venueRoutes from './routes/venue.routes.ts';
import eventRoutes from './routes/event.routes.ts';
import bookingRoutes from './routes/booking.routes.ts';

export const app = express();
app.use(express.json());

// Basic logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Mount Routes
app.use('/v1/venues', venueRoutes);
app.use('/v1/events', eventRoutes);
app.use('/v1/bookings', bookingRoutes);

// 404 for all other routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpError(404, 'Not Found'));
});

// Global error handler (must be last)
app.use(errorHandler);
