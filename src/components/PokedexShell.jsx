import React, { useState } from 'react';
import { Volume2, VolumeX, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { toggleSound, isSoundEnabled, playPokedexBeep } from '../utils/audio';

export default function PokedexShell({ 
  children, 
  onOpenAdd, 
  onResetCollection,
  totalSneakers,
  isSyncing = false
}) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showOptions, setShowOptions] = useState(false);

  const handleToggleSound = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
  };

  return (
    <div className="pokedex-mobile-device">
      {/* Top Casing with Big Blue Scanner Gem & 3 Indicator LEDs */}
      <div className="pokedex-top-casing">
        <div className="pokedex-lens-cluster">
          {/* Main Blue Sensor Lens with glossy shine */}
          <div className="pokedex-main-lens" title="Sneakdex Scanner Core">
            <div className="lens-reflection"></div>
            <div className="lens-inner-dot"></div>
          </div>
          {/* Trio of Mini Signal LEDs */}
          <div className="pokedex-led-trio">
            <span className="pokedex-led red"></span>
            <span className={`pokedex-led yellow ${isSyncing ? 'pulse-led' : ''}`} title={isSyncing ? 'Sincronizando con Vercel' : 'En línea'}></span>
            <span className="pokedex-led green"></span>
          </div>
        </div>

        {/* Audio Mute, Add & Menu Options */}
        <div className="pokedex-top-actions">
          {isSyncing && (
            <span className="pokedex-sync-badge-pixel">KV SYNC</span>
          )}
          <button 
            className="pokedex-icon-btn add-btn-top"
            onClick={() => {
              playPokedexBeep(800, 0.08);
              onOpenAdd();
            }}
            title="Registrar nueva zapatilla"
            aria-label="Registrar zapatilla"
          >
            <Plus size={16} />
          </button>
          <button 
            className="pokedex-icon-btn"
            onClick={handleToggleSound}
            title={soundOn ? 'Desactivar Sonido 8-bit' : 'Activar Sonido 8-bit'}
            aria-label="Alternar sonido"
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          <button 
            className="pokedex-icon-btn"
            onClick={() => {
              playPokedexBeep(500, 0.04);
              setShowOptions(!showOptions);
            }}
            title="Opciones de la Sneakdex"
            aria-label="Opciones"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Options Dropdown if clicked */}
      {showOptions && (
        <div className="pokedex-options-popup">
          <div className="options-popup-header">AJUSTES SNEAKDEX</div>
          <button 
            className="options-popup-item danger"
            onClick={() => {
              if (window.confirm('¿Reiniciar la colección a las 6 zapatillas iniciales por defecto?')) {
                onResetCollection();
                setShowOptions(false);
              }
            }}
          >
            Restaurar zapatillas de muestra
          </button>
          <button 
            className="options-popup-item"
            onClick={() => setShowOptions(false)}
          >
            Cerrar
          </button>
        </div>
      )}

      {/* 
        CENTERED HEADER: "SNEAKDEX"
        User explicitly requested:
        "en la que se muestre centrado en el header la palabra senakdex (centrado)"
      */}
      <header className="pokedex-header-centered">
        <div className="header-decor-line left"></div>
        <h1 className="pokedex-title-main">
          SNEAKDEX
        </h1>
        <div className="header-decor-line right"></div>
      </header>
      <div className="pokedex-subtitle-tag">
        SNEAKER POKÉDEX v1.0
      </div>

      {/* Main Screen Bezel (LCD Display) */}
      <div className="pokedex-screen-housing">
        <div className="screen-top-bezel-dots">
          <span className="bezel-screw top-left"></span>
          <div className="bezel-mic-indicator">
            <span className="bezel-light red"></span>
            <span className="bezel-light red"></span>
          </div>
          <span className="bezel-screw top-right"></span>
        </div>

        {/* The Active LCD Screen Viewport */}
        <div className="pokedex-lcd-screen">
          {children}
        </div>

        <div className="screen-bottom-bezel-row">
          <span className="bezel-screw bottom-left"></span>
          <div className="bezel-speaker-slits">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="bezel-screw bottom-right"></span>
        </div>
      </div>

      {/* Bottom Physical Controls & Add Action Pad */}
      <div className="pokedex-bottom-controls">
        {/* D-Pad Decorative Element */}
        <div className="pokedex-dpad-visual">
          <div className="dpad-cross">
            <span className="dpad-arm up">▲</span>
            <span className="dpad-arm left">◀</span>
            <span className="dpad-arm center"></span>
            <span className="dpad-arm right">▶</span>
            <span className="dpad-arm down">▼</span>
          </div>
        </div>

        {/* Central Pokéball Button: Add / Register Sneaker */}
        <button 
          className="pokedex-pokeball-add-btn"
          onClick={() => {
            playPokedexBeep(800, 0.08);
            onOpenAdd();
          }}
          title="Dar de alta una nueva zapatilla"
          aria-label="Registrar nueva zapatilla"
        >
          <div className="pokeball-top-half"></div>
          <div className="pokeball-line"></div>
          <div className="pokeball-center-button">
            <Plus size={16} strokeWidth={3} />
          </div>
          <div className="pokeball-bottom-half"></div>
          <span className="pokeball-action-label">REGISTRAR</span>
        </button>

        {/* Mini Pill Buttons */}
        <div className="pokedex-action-buttons">
          <div className="pill-button-group">
            <div className="pill-btn select" title="Sneakers registradas">
              <span className="pill-key">TOTAL</span>
              <span className="pill-val">{totalSneakers}</span>
            </div>
            <div className="pill-btn start" onClick={handleToggleSound}>
              <span className="pill-key">SFX</span>
              <span className="pill-val">{soundOn ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
