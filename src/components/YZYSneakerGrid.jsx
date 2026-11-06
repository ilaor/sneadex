import React from 'react';

export default function YZYSneakerGrid({ 
  sneakers = [], 
  onSelectSneaker 
}) {
  if (!sneakers || sneakers.length === 0) {
    return (
      <div className="yzy-empty-screen">
        <div className="yzy-empty-text">NO HAY ZAPATILLAS</div>
        <div className="yzy-empty-subtext">PULSA LA POKEBALL PARA REGISTRAR</div>
      </div>
    );
  }

  return (
    <div className="yzy-grid-viewport">
      <div className="yzy-grid-two-columns">
        {sneakers.map((sneaker) => {
          const primaryImage = (sneaker.images && sneaker.images.length > 0)
            ? sneaker.images[0]
            : 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80';

          return (
            <div
              key={sneaker.id}
              className="yzy-grid-card"
              onClick={() => onSelectSneaker(sneaker)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectSneaker(sneaker);
                }
              }}
              title={sneaker.name}
              aria-label={`Ver ${sneaker.name}`}
            >
              <img
                src={primaryImage}
                alt={sneaker.name}
                className="yzy-grid-img"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

