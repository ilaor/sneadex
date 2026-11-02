export const DEFAULT_SNEAKERS = [
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

export const TYPE_COLORS = {
  BASKETBALL: { bg: '#e63946', text: '#ffffff', border: '#b71c1c' },
  SKATE: { bg: '#457b9d', text: '#ffffff', border: '#1d3557' },
  RUNNER: { bg: '#2a9d8f', text: '#ffffff', border: '#1f6f66' },
  CLASSIC: { bg: '#e76f51', text: '#ffffff', border: '#c44527' },
  HERITAGE: { bg: '#9b5de5', text: '#ffffff', border: '#6a36b3' },
  TECH: { bg: '#00b4d8', text: '#02182b', border: '#0077b6' },
  GRAIL: { bg: '#f15bb5', text: '#ffffff', border: '#b0207a' },
  CUSTOM: { bg: '#ffb703', text: '#000000', border: '#d48b00' }
};
