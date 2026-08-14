import { randomUUID } from 'node:crypto';
import type { Venue, CreateVenueDTO, UpdateVenueDTO } from '../domain/venue.ts';
import { HttpError } from '../errors/HttpError.ts';

class VenueService {
  // In-memory Map store as requested
  private venues: Map<string, Venue> = new Map();

  create(data: CreateVenueDTO): Venue {
    // Check for unique name duplicate -> 409
    for (const venue of this.venues.values()) {
      if (venue.name === data.name) {
        throw new HttpError(409, 'Venue name already exists');
      }
    }

    const newVenue: Venue = {
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.venues.set(newVenue.id, newVenue);
    return newVenue;
  }

  list(limit?: number, offset?: number): Venue[] {
    const allVenues = Array.from(this.venues.values());
    const start = offset || 0;
    
    if (limit && limit > 0) {
      return allVenues.slice(start, start + limit);
    }
    return allVenues.slice(start);
  }

  getById(id: string): Venue {
    const venue = this.venues.get(id);
    if (!venue) {
      throw new HttpError(404, 'Venue not found');
    }
    return venue;
  }

  update(id: string, data: UpdateVenueDTO): Venue {
    const existing = this.getById(id);

    // If updating name, check for duplicates
    if (data.name && data.name !== existing.name) {
      for (const venue of this.venues.values()) {
        if (venue.name === data.name) {
          throw new HttpError(409, 'Venue name already exists');
        }
      }
    }

    const updatedVenue: Venue = { ...existing, ...data };
    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  delete(id: string): void {
    // Check if exists first
    this.getById(id);
    this.venues.delete(id);
  }
}

// Export a singleton instance
export const venueService = new VenueService();
