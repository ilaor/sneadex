import React, { useState } from 'react';

// Extract two words for the name, strictly matching the YZY minimalist convention
function formatTwoWords(name) {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  return words.slice(0, 2).join(' ').toUpperCase();
}

export default function YZYSneakerDetail({
  sneaker,
  onBack,
  onEdit,
  onDelete
}) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const images = (sneaker.images && sneaker.images.length > 0)
    ? sneaker.images
    : ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'];

  const totalImages = images.length;
  const currentPhoto = images[photoIndex] || images[0];
  const twoWordName = formatTwoWords(sneaker.name);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setPhotoIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setPhotoIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  // Mobile touch swipe support
  const [touchStartX, setTouchStartX] = useState(null);
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="yzy-detail-viewport">
      {/* Top back button: "<" para salir para atras a la pantalla central */}
      <div className="yzy-detail-header">
        <button
          type="button"
          className="yzy-detail-back-btn"
          onClick={onBack}
          aria-label="Volver a la pantalla central"
          title="Volver"
        >
          &lt;
        </button>
      </div>

      <div className="yzy-detail-content">
        {/* Central Photo with "<" and ">" controls */}
        <div 
          className="yzy-detail-photo-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {totalImages > 1 && (
            <button
              type="button"
              className="yzy-detail-arrow prev"
              onClick={handlePrev}
              aria-label="Foto anterior"
              title="Foto anterior"
            >
              &lt;
            </button>
          )}

          <div className="yzy-detail-photo-box">
            <img
              src={currentPhoto}
              alt={`${sneaker.name} foto ${photoIndex + 1}`}
              className="yzy-detail-main-photo"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {totalImages > 1 && (
            <button
              type="button"
              className="yzy-detail-arrow next"
              onClick={handleNext}
              aria-label="Foto siguiente"
              title="Foto siguiente"
            >
              &gt;
            </button>
          )}
        </div>

        {/* Dos palabras en negrita con tamaño 12px que indique el nombre */}
        <h2 className="yzy-sneaker-name">
          {twoWordName}
        </h2>

        {/* Bajo: el tipo de la zapatilla */}
        <div className="yzy-sneaker-type">
          {sneaker.type || 'SNEAKER'}
        </div>

        {/* Bajo: centrada la descripción */}
        <p className="yzy-sneaker-description">
          {sneaker.description || 'SIN DESCRIPCION'}
        </p>

        {/* Acciones discretas para editar o eliminar */}
        <div className="yzy-sneaker-actions">
          <button 
            type="button" 
            className="yzy-action-link"
            onClick={() => {
              if (onEdit) {
                onEdit(sneaker);
              }
            }}
          >
            EDITAR
          </button>
          <span className="yzy-action-divider">/</span>
          <button 
            type="button" 
            className="yzy-action-link danger"
            onClick={() => {
              if (window.confirm(`¿Eliminar ${sneaker.name}?`)) {
                if (onDelete) {
                  onDelete(sneaker.id);
                }
              }
            }}
          >
            ELIMINAR
          </button>
        </div>
      </div>
    </div>
  );
}

