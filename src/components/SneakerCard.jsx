import React from 'react';
import { playPokedexBeep, playSelectSound } from '../utils/audio';
import { TYPE_COLORS } from '../data/defaultSneakers';

export default function SneakerCard({ sneaker, onSelect }) {
  const primaryImage = (sneaker.images && sneaker.images.length > 0)
    ? sneaker.images[0]
    : 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80';

  const typeStyle = TYPE_COLORS[sneaker.type] || TYPE_COLORS.CLASSIC;
  const imageCount = sneaker.images ? sneaker.images.length : 1;

  const handleClick = () => {
    playSelectSound();
    onSelect(sneaker);
  };

  return (
    <div 
      className="sneaker-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label={`Ver detalles de ${sneaker.name}`}
    >
      <div className="card-screen-glass">
        {/* Top Header Badge */}
        <div className="card-top-bar">
          <span className="card-number-pixel">{sneaker.number || '#---'}</span>
          {imageCount > 1 && (
            <span className="card-images-badge" title={`${imageCount} fotos disponibles`}>
              {imageCount}📸
            </span>
          )}
        </div>

        {/* Sneaker Thumbnail */}
        <div className="card-image-wrap">
          <img 
            src={primaryImage} 
            alt={sneaker.name}
            loading="lazy"
            onError={(e) => {
              // Fallback image in case of broken link
              e.target.src = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="card-scanline-overlay"></div>
        </div>

        {/* Bottom Tag */}
        <div className="card-bottom-bar">
          <div className="card-name-snippet">
            {sneaker.name}
          </div>
          {sneaker.type && (
            <span 
              className="card-type-tag"
              style={{ 
                backgroundColor: typeStyle.bg,
                color: typeStyle.text,
                borderColor: typeStyle.border
              }}
            >
              {sneaker.type}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
