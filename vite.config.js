import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev middleware that mimics Vercel Serverless Functions during local `npm run dev`
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        let body = null;
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {
            body = raw;
          }
        }

        req.query = Object.fromEntries(url.searchParams.entries());
        req.body = body;

        if (!res.status) {
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
        }
        if (!res.json) {
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };
        }

        try {
          if (pathname === '/api/auth') {
            const { default: handler } = await import('./api/auth.js');
            return await handler(req, res);
          }
          if (pathname === '/api/sneakers') {
            const { default: handler } = await import('./api/sneakers.js');
            return await handler(req, res);
          }
          if (pathname === '/api/upload') {
            const { default: handler } = await import('./api/upload.js');
            return await handler(req, res);
          }
          next();
        } catch (err) {
          console.error('[Vite Dev API Error]:', err);
          res.status(500).json({ error: err.message });
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
});
