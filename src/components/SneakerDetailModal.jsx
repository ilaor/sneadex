import React, { useState, useEffect } from 'react';
import { playSlideSound, playPokedexBeep } from '../utils/audio';
import { TYPE_COLORS } from '../data/defaultSneakers';

export default function SneakerDetailModal({ 
  sneaker, 
  onClose, 
  onEdit, 
  onDelete 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = (sneaker.images && sneaker.images.length > 0) 
    ? sneaker.images 
    : ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'];

  const totalImages = images.length;
  const currentImage = images[currentImageIndex] || images[0];
  const typeStyle = TYPE_COLORS[sneaker.type] || TYPE_COLORS.CLASSIC;

  // Previous image navigation (<)
  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    playSlideSound();
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  // Next image navigation (>)
  const handleNext = (e) => {
    if (e) e.stopPropagation();
    playSlideSound();
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        playPokedexBeep(400, 0.05);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalImages]);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState(null);
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="detail-view-container">
      {/* Top Status & Close Row */}
      <div className="detail-top-bar">
        <button 
          className="detail-back-btn" 
          onClick={() => {
            playPokedexBeep(450, 0.06);
            onClose();
          }}
          aria-label="Volver a la Pokédex"
        >
          <span className="btn-pixel-arrow">‹</span>
          <span className="btn-pixel-text">VOLVER</span>
        </button>

        <span className="detail-pokedex-number-pixel">
          {sneaker.number || '#001'}
        </span>

        <div className="detail-actions-cluster">
          <button 
            className="detail-mini-action-btn edit-btn"
            onClick={() => {
              playPokedexBeep(700, 0.05);
              onEdit(sneaker);
            }}
            title="Editar zapatilla y fotos"
          >
            EDIT
          </button>
          <button 
            className="detail-mini-action-btn delete-btn"
            onClick={() => {
              playPokedexBeep(300, 0.08);
              if (window.confirm(`¿Liberar ${sneaker.name} de tu Sneakdex?`)) {
                onDelete(sneaker.id);
              }
            }}
            title="Eliminar zapatilla"
          >
            DEL
          </button>
        </div>
      </div>

      {/* Main Central Image Frame with <> Side Controls */}
      <div 
        className="detail-central-image-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow Button < */}
        <button 
          className="detail-nav-arrow-btn prev-arrow"
          onClick={handlePrev}
          aria-label="Foto anterior"
          title="Foto anterior (o flecha izquierda del teclado)"
        >
          &lt;
        </button>

        {/* Central Sneaker Image */}
        <div className="detail-image-box">
          <img 
            key={currentImageIndex}
            src={currentImage} 
            alt={`${sneaker.name} vista ${currentImageIndex + 1}`}
            className="detail-main-photo"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="detail-screen-scanlines"></div>
        </div>

        {/* Right Arrow Button > */}
        <button 
          className="detail-nav-arrow-btn next-arrow"
          onClick={handleNext}
          aria-label="Foto siguiente"
          title="Foto siguiente (o flecha derecha del teclado)"
        >
          &gt;
        </button>
      </div>

      {/* Photo Counter Indicator in Pixel Font */}
      <div className="detail-photo-counter-pixel">
        FOTO {currentImageIndex + 1} / {totalImages}
      </div>

      {/* Centered Name and Small Centered Description in Grey Pixel Art Font */}
      <div className="detail-info-block">
        {/* Nombre Centrado Pixel Art */}
        <h2 className="detail-name-pixel">
          {sneaker.name}
        </h2>

        {/* Pequeña Descripción Centrada Pixel Art Gris */}
        <p className="detail-desc-pixel">
          {sneaker.description || 'SIN DATOS REGISTRADOS EN LA SNEAKDEX PARA ESTA ZAPATILLA.'}
        </p>

        {/* Extra Specs Badges (Discreet Pixel Pills) */}
        <div className="detail-specs-pills">
          {sneaker.type && (
            <span 
              className="spec-pill"
              style={{
                backgroundColor: typeStyle.bg,
                color: typeStyle.text,
                borderColor: typeStyle.border
              }}
            >
              {sneaker.type}
            </span>
          )}
          {sneaker.brand && (
            <span className="spec-pill brand-pill">
              {sneaker.brand}
            </span>
          )}
          {sneaker.size && (
            <span className="spec-pill">
              TALLA: {sneaker.size}
            </span>
          )}
          {sneaker.condition && (
            <span className="spec-pill condition-pill">
              {sneaker.condition}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
