import React from 'react';

export default function PokedexShell({ children, onOpenAdd }) {
  return (
    <div className="pokedex-mobile-device">
      {/* Top of red casing: ONLY the blue decorative lens */}
      <div className="pokedex-top-casing">
        <div className="pokedex-main-lens" aria-hidden="true">
          <div className="lens-reflection"></div>
          <div className="lens-inner-dot"></div>
        </div>
      </div>

      {/* Screen container: pure white central screen */}
      <div className="pokedex-screen-container">
        {children}
      </div>

      {/* Bottom of red casing: ONLY the Pokéball button for registering */}
      <div className="pokedex-bottom-controls">
        <button
          type="button"
          className="pokedex-pokeball-add-btn"
          onClick={onOpenAdd}
          aria-label="Registrar nueva zapatilla"
          title="Registrar nueva zapatilla"
        >
          <div className="pokeball-top-half"></div>
          <div className="pokeball-line"></div>
          <div className="pokeball-center-button"></div>
          <div className="pokeball-bottom-half"></div>
        </button>
      </div>
    </div>
  );
}
