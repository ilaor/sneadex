import { kv } from '@vercel/kv';

const COLLECTION_KEY = 'sneakdex:collection';

// Starter default sneakers if KV is empty
const DEFAULT_SNEAKERS = [
  {
    id: 'snk-001',
    number: '#001',
    name: 'AIR JORDAN 1 RETRO HIGH OG "CHICAGO"',
    description: 'N° 001. EL GRIAL DEL BASKETBALL. LANZADA EN 1985 POR PETER MOORE. FUE MULTADA POR LA LIGA DEBIDO A SUS COLORES Y SE CONVIRTIO EN LEYENDA URBANA.',
    type: 'BASKETBALL',
    brand: 'Jordan',
    colorway: 'White / Black / Varsity Red',
    year: '1985 / 2022',
    size: 'US 10 / EU 44',
    condition: 'Deadstock (DS)',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'snk-002',
    number: '#002',
    name: 'TRAVIS SCOTT X NIKE SB DUNK LOW',
    description: 'N° 002. RARO EJEMPLAR DE SKATEBOARDING. CAPA EXTERNA DE TELA PAISLEY DESGASTABLE QUE REVELA ESTAMPADO ELEPHANT PRINT BAJO EL TEJIDO.',
    type: 'SKATE',
    brand: 'Nike SB',
    colorway: 'Black / Parachute Beige / Petra Brown',
    year: '2020',
    size: 'US 9.5 / EU 43',
    condition: 'VNDS (Near Mint)',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'snk-003',
    number: '#003',
    name: 'ADIDAS YEEZY BOOST 350 V2 "ZEBRA"',
    description: 'N° 003. SILUETA AERODINAMICA DE HYPE. TEJIDO PRIMEKNIT BICOLOR CON TEXTO ROJO SPLY-350 EN ESPEJO Y AMORTIGUACION BOOST COMPLETA.',
    type: 'RUNNER',
    brand: 'adidas',
    colorway: 'White / Core Black / Red',
    year: '2017',
    size: 'US 10 / EU 44',
    condition: 'Deadstock (DS)',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'snk-004',
    number: '#004',
    name: 'NEW BALANCE 990V3 MADE IN USA "GREY"',
    description: 'N° 004. EL MAXIMO ESTANDAR DEL DAD-SHOE. ANTE DE CERDO PREMIUM, MALLA TRANSPIRABLE Y SUELA ENCAP CON ESTABILIDAD LEGENDARIA.',
    type: 'CLASSIC',
    brand: 'New Balance',
    colorway: 'Marblehead Grey / White',
    year: '2012 / 2021',
    size: 'US 10.5 / EU 44.5',
    condition: 'Excellent 9/10',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'snk-005',
    number: '#005',
    name: 'NIKE AIR MAX 1 86 OG "BIG BUBBLE"',
    description: 'N° 005. LA REVOLUCION VISIBLE DE TINKER HATFIELD. INSPIRADA EN EL CENTRO POMPIDOU DE PARIS. CAMBIO PARA SIEMPRE EL DISENO DEPORTIVO.',
    type: 'HERITAGE',
    brand: 'Nike',
    colorway: 'White / University Red / Neutral Grey',
    year: '1986 / 2023',
    size: 'US 11 / EU 45',
    condition: 'Deadstock (DS)',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'snk-006',
    number: '#006',
    name: 'ASICS GEL-KAYANO 14 "METALLIC SILVER"',
    description: 'N° 006. LA CUMBRE DEL RUNNER TECNICO DE LOS ANOS 2000. MALLA METALICA REFLECTANTE Y SISTEMA DE ABSORCION DE IMPACTO GEL EN TALON Y ANTEPIE.',
    type: 'TECH',
    brand: 'Asics',
    colorway: 'Pure Silver / Cream / Black',
    year: '2008 / 2022',
    size: 'US 10 / EU 44',
    condition: 'VNDS (Near Mint)',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80'
    ]
  }
];

export default async function handler(req, res) {
  // CORS & headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
        // Seed default sneakers if empty
        await kv.set(COLLECTION_KEY, DEFAULT_SNEAKERS);
        return DEFAULT_SNEAKERS;
      } catch (err) {
        console.error('KV get error:', err);
        return DEFAULT_SNEAKERS;
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

    // 2. POST: Add sneaker or Reset
    if (req.method === 'POST') {
      const { action } = req.query;

      // Reset to defaults action
      if (action === 'reset') {
        await saveCollection(DEFAULT_SNEAKERS);
        return res.status(200).json({ success: true, data: DEFAULT_SNEAKERS });
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
