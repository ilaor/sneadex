import React, { useState } from 'react';
import SneakerCard from './SneakerCard';
import { playPokedexBeep } from '../utils/audio';

export default function SneakerGrid({ 
  sneakers, 
  onSelectSneaker, 
  onOpenAddModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  // Filter sneakers
  const filteredSneakers = sneakers.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.brand && s.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (s.number && s.number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'ALL' || s.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="sneaker-grid-wrapper">
      {/* Sub-header with collection stats and quick search */}
      <div className="grid-status-bar">
        <div className="status-counter-pixel">
          REGISTRADAS: <span className="highlight-green">{sneakers.length}</span>
        </div>
        
        {sneakers.length > 4 && (
          <div className="grid-quick-search">
            <input 
              type="text"
              placeholder="BUSCAR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pixel-search-input"
            />
          </div>
        )}
      </div>

      {/* 
        The 2-Column, 2.5-Rows Grid Viewport
        Calculated so that 2 full rows and half of the third row are visible,
        letting users know they can scroll downwards.
      */}
      <div className="sneaker-grid-scroll-area">
        {filteredSneakers.length === 0 ? (
          <div className="empty-pokedex-state">
            <div className="empty-pixel-icon">👟</div>
            <p className="empty-pixel-title">NO HAY ZAPATILLAS</p>
            <p className="empty-pixel-desc">
              TU SNEAKDEX ESTA VACIA. PULSA EL BOTON INFERIOR PARA REGISTRAR TU PRIMER PAR.
            </p>
            <button 
              className="empty-add-btn"
              onClick={() => {
                playPokedexBeep(650, 0.08);
                onOpenAddModal();
              }}
            >
              + REGISTRAR PAR
            </button>
          </div>
        ) : (
          <div className="sneaker-grid-two-columns">
            {filteredSneakers.map((sneaker) => (
              <SneakerCard
                key={sneaker.id}
                sneaker={sneaker}
                onSelect={onSelectSneaker}
              />
            ))}
          </div>
        )}
      </div>

      {/* Visual Scroll Hint if more than 4 sneakers */}
      {filteredSneakers.length > 4 && (
        <div className="grid-scroll-hint">
          <span className="scroll-arrow-anim">▼ DESLIZA PARA VER MÁS ▼</span>
        </div>
      )}
    </div>
  );
}
