import crypto from 'crypto';

// Shared token generator
export function getExpectedToken() {
  const secret = process.env.SNEADEX_PASSWORD || 'Ivan$$$13';
  const salt = process.env.AUTH_SALT || 'sneakdex_salt_key_secure_2026';
  return crypto.createHash('sha256').update(`${secret}:${salt}`).digest('hex');
}

// Authentication verification helper for serverless routes
export function verifyAuth(req) {
  const authHeader = req.headers['authorization'] || req.headers['x-sneakdex-key'];
  if (!authHeader) return false;

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  const expectedToken = getExpectedToken();
  const rawPassword = process.env.SNEADEX_PASSWORD || 'Ivan$$$13';

  return token === expectedToken || token === rawPassword;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { password } = body || {};

    const serverPassword = process.env.SNEADEX_PASSWORD || 'Ivan$$$13';

    if (!password) {
      return res.status(400).json({ success: false, error: 'Password required' });
    }

    if (password !== serverPassword) {
      return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
    }

    const token = getExpectedToken();
    return res.status(200).json({
      success: true,
      token,
      message: 'Autenticado correctamente'
    });
  } catch (error) {
    console.error('API /api/auth error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}

