import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { GameManager } from './src/server/game-manager';
import { setupSocketHandlers } from './src/server/socket-handlers';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    // Let Socket.IO handle /socket.io requests exclusively
    if (req.url && req.url.startsWith('/socket.io')) {
      return;
    }

    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Attach Socket.IO to the shared HTTP server
  const io = new SocketIOServer(httpServer, {
    path: '/socket.io',
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST']
    },
    pingTimeout: 20000,
    pingInterval: 10000,
    transports: ['polling', 'websocket']
  });

  const gameManager = new GameManager(io);
  setupSocketHandlers(io, gameManager);

  httpServer.listen(port, () => {
    console.log(`> MentalMath Engine is ready on http://localhost:${port}`);
    console.log(`> Realtime WebSockets listening on path /socket.io`);
  });
});
