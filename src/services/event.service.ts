import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Event, CreateEventDTO, UpdateEventDTO, EventQuery } from '../domain/event.ts';
import { HttpError } from '../errors/HttpError.ts';

class EventService {
  private events: Map<string, Event> = new Map();
  private isLoaded = false;

  async loadEvents(): Promise<void> {
    if (this.isLoaded) return;
    const dataPath = join(process.cwd(), 'data', 'events.json');
    const data = await readFile(dataPath, 'utf8');
    const parsed = JSON.parse(data) as Event[];
    for (const evt of parsed) {
      this.events.set(evt.id, evt);
    }
    this.isLoaded = true;
  }

  create(data: CreateEventDTO): Event {
    const id = randomUUID();
    const newEvent: Event = {
      ...data,
      id,
      organizerId: 'usr-1', // Hardcoded until Session 4
      createdAt: new Date().toISOString(),
    };
    this.events.set(id, newEvent);
    return newEvent;
  }

  list(query: EventQuery): { data: Event[]; page: number; limit: number; total: number } {
    let allEvents = Array.from(this.events.values());

    // Filtering
    if (query.venue) {
      allEvents = allEvents.filter(e => e.venue === query.venue);
    }
    if (query.from) {
      const fromTime = new Date(query.from).getTime();
      allEvents = allEvents.filter(e => new Date(e.startsAt).getTime() >= fromTime);
    }
    if (query.to) {
      const toTime = new Date(query.to).getTime();
      allEvents = allEvents.filter(e => new Date(e.startsAt).getTime() <= toTime);
    }

    // Total must be calculated AFTER filtering, before pagination
    const total = allEvents.length;

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const data = allEvents.slice(startIndex, endIndex);

    return {
      data,
      page,
      limit,
      total,
    };
  }

  getById(id: string): Event {
    const event = this.events.get(id);
    if (!event) {
      throw new HttpError(404, 'Event not found');
    }
    return event;
  }

  update(id: string, data: UpdateEventDTO): Event {
    const existing = this.getById(id);
    const updated: Event = {
      ...existing,
      ...data,
      // Protect server-controlled fields from being overwritten even if they sneak in somehow
      id: existing.id,
      organizerId: existing.organizerId,
      createdAt: existing.createdAt,
    };
    this.events.set(id, updated);
    return updated;
  }

  delete(id: string): void {
    const existing = this.getById(id);
    this.events.delete(id);
  }
}

export const eventService = new EventService();
