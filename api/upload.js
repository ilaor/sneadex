import { put } from '@vercel/blob';
import { verifyAuth } from './auth.js';

// Disable default bodyParser size limit in Next/Vercel serverless if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  // CORS & preflight
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security check: Verify backend password/token
  if (!verifyAuth(req)) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado. Se requiere contraseña del backend para subir fotos.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const hasBlobConfig = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

    // Parse body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { filename, base64, contentType } = body || {};

    if (!base64) {
      return res.status(400).json({ success: false, error: 'No image data provided (base64 is required)' });
    }

    const cleanFilename = (filename || 'sneaker.jpg')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase();

    // Fallback if running locally without BLOB_READ_WRITE_TOKEN configured yet
    if (!hasBlobConfig) {
      console.warn('BLOB_READ_WRITE_TOKEN is not defined. Using local base64 fallback.');
      return res.status(200).json({
        success: true,
        url: base64,
        pathname: cleanFilename,
        isFallback: true,
        warning: 'BLOB_READ_WRITE_TOKEN no configurado en entorno local.'
      });
    }

    // Extract base64 binary
    const matches = base64.match(/^data:([A-Za-z-+]+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : (contentType || 'image/jpeg');
    const base64Data = matches ? matches[2] : base64;
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique pathname in Vercel Blob store
    const uniquePathname = `sneakers/${Date.now()}-${cleanFilename}`;

    // Upload to @vercel/blob
    const blob = await put(uniquePathname, buffer, {
      access: 'public',
      contentType: mimeType
    });

    return res.status(200).json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType
    });
  } catch (error) {
    console.error('API /api/upload error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error uploading file to Vercel Blob'
    });
  }
}
