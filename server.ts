import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Documentation / Schema introspection endpoint
  app.get('/api/v1/endpoints', (req: Request, res: Response) => {
    res.json({
      guest: [
        'GET /api/v1/hotels/search?city=...&checkIn=...&checkOut=...&guests=2',
        'POST /api/v1/bookings/hold',
        'POST /api/v1/payments/verify',
        'GET /api/v1/bookings/:reference',
      ],
      management: [
        'GET /api/v1/admin/timeline?hotelId=...&start=...&end=...',
        'PATCH /api/v1/admin/rooms/:id/assign',
        'PATCH /api/v1/admin/rooms/:id/status',
        'PUT /api/v1/admin/inventory/pricing',
      ],
    });
  });

  // Vite development middleware
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aura PMS Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Aura PMS Server] Failed to start:', err);
  process.exit(1);
});
