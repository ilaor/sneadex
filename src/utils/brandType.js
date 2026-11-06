import tipo1 from '../images/tipo1.png';
import tipo2 from '../images/tipo2.png';
import tipo3 from '../images/tipo3.png';
import tipo4 from '../images/tipo4.png';
import tipo5 from '../images/tipo5.png';
import tipo6 from '../images/tipo6.png';
import tipo7 from '../images/tipo7.png';
import tipo8 from '../images/tipo8.png';

export const TYPE_ICONS = {
  1: tipo1,
  2: tipo2,
  3: tipo3,
  4: tipo4,
  5: tipo5,
  6: tipo6,
  7: tipo7,
  8: tipo8
};

// Deterministic brand-to-type number mapping (1..8)
export function getBrandTypeNumber(brand) {
  if (!brand) return 1;
  const clean = brand.trim().toLowerCase();

  // If Yeezy / YZY -> tipo2 (Planta / Grass)
  if (clean.includes('yeezy') || clean === 'yzy') {
    return 2;
  }

  // Consistent pseudo-random hash according to brand string
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 8) + 1;
}

export function getBrandTypeIcon(brand, typeIconNum) {
  if (typeIconNum && TYPE_ICONS[typeIconNum]) {
    return TYPE_ICONS[typeIconNum];
  }
  if (!brand) return null;
  const num = getBrandTypeNumber(brand);
  return TYPE_ICONS[num] || null;
}

