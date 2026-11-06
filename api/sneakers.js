import { kv } from '@vercel/kv';
import { verifyAuth } from './auth.js';

const COLLECTION_KEY = 'sneakdex:collection';

// Empty default sneakers for fresh start
const DEFAULT_SNEAKERS = [];

export default async function handler(req, res) {
  // CORS & headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security check: Verify backend password/token
  if (!verifyAuth(req)) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado. Se requiere contraseña del backend.'
    });
  }

  try {
    // Check if KV credentials are available
    const hasKvConfig = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

    // Helper: read collection
    const getCollection = async () => {
      if (!hasKvConfig) {
        return DEFAULT_SNEAKERS;
      }
      try {
        const data = await kv.get(COLLECTION_KEY);
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (err) {
        console.error('KV get error:', err);
        return [];
      }
    };

    // Helper: write collection
    const saveCollection = async (collection) => {
      if (hasKvConfig) {
        await kv.set(COLLECTION_KEY, collection);
      }
    };

    // 1. GET: Fetch sneaker collection
    if (req.method === 'GET') {
      const collection = await getCollection();
      return res.status(200).json({ success: true, data: collection });
    }

    // 2. POST: Add sneaker, Clear or Reset
    if (req.method === 'POST') {
      const { action } = req.query;

      // Clear / Reset to empty collection action
      if (action === 'clear' || action === 'reset') {
        await saveCollection([]);
        return res.status(200).json({ success: true, data: [] });
      }

      // Parse body if string
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const newSneaker = body;

      if (!newSneaker || !newSneaker.name) {
        return res.status(400).json({ success: false, error: 'Sneaker name is required' });
      }

      const collection = await getCollection();
      const updated = [newSneaker, ...collection];
      await saveCollection(updated);

      return res.status(201).json({ success: true, data: newSneaker });
    }

    // 3. PUT: Update existing sneaker
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const updatedSneaker = body;

      if (!updatedSneaker || !updatedSneaker.id) {
        return res.status(400).json({ success: false, error: 'Sneaker ID is required for update' });
      }

      const collection = await getCollection();
      const updated = collection.map((item) =>
        item.id === updatedSneaker.id ? { ...item, ...updatedSneaker } : item
      );

      await saveCollection(updated);
      return res.status(200).json({ success: true, data: updatedSneaker });
    }

    // 4. DELETE: Remove a sneaker by ID
    if (req.method === 'DELETE') {
      const id = req.query.id || (typeof req.body === 'object' ? req.body.id : null);

      if (!id) {
        return res.status(400).json({ success: false, error: 'Sneaker ID is required for deletion' });
      }

      const collection = await getCollection();
      const updated = collection.filter((item) => item.id !== id);

      await saveCollection(updated);
      return res.status(200).json({ success: true, message: 'Sneaker removed', id });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API /api/sneakers error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
