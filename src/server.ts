import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { type Event, findById } from './domain.ts';

let eventsCache: Event[] | null = null;

async function loadEvents(): Promise<Event[]> {
  if (eventsCache) {
    return eventsCache;
  }
  
  const dataPath = join(process.cwd(), 'data', 'events.json');
  const data = await readFile(dataPath, 'utf8');
  eventsCache = JSON.parse(data);
  return eventsCache as Event[];
}

const server = createServer(async (req, res) => {
  try {
    const url = req.url || '';
    const method = req.method;

    if (method === 'GET' && url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    if (method === 'GET' && url === '/events') {
      const events = await loadEvents();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(events));
      return;
    }

    if (method === 'GET' && url.startsWith('/events/')) {
      const parts = url.split('/');
      // url is something like /events/evt-1
      // parts will be ['', 'events', 'evt-1']
      if (parts.length === 3 && parts[2]) {
        const id = parts[2];
        const events = await loadEvents();
        const event = findById(events, id);
        
        if (event) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(event));
          return;
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Event not found' }));
          return;
        }
      }
    }

    // 404 for all other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});