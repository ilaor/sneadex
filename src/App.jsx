import React, { useState, useEffect } from 'react';
import PokedexShell from './components/PokedexShell';
import SneakerGrid from './components/SneakerGrid';
import SneakerDetailModal from './components/SneakerDetailModal';
import AddSneakerModal from './components/AddSneakerModal';
import EditSneakerModal from './components/EditSneakerModal';
import { DEFAULT_SNEAKERS } from './data/defaultSneakers';
import './App.css';

const STORAGE_KEY = 'sneakdex_collection_v1';

export default function App() {
  // Load collection from LocalStorage or initialize with defaults
  const [sneakers, setSneakers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading Sneakdex from storage:', e);
    }
    return DEFAULT_SNEAKERS;
  });

  // Active view states
  const [selectedSneaker, setSelectedSneaker] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSneaker, setEditingSneaker] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sneakers));
    } catch (e) {
      console.error('Error saving to storage:', e);
    }
  }, [sneakers]);

  // Add new sneaker
  const handleAddSneaker = (newSneaker) => {
    const updated = [newSneaker, ...sneakers];
    setSneakers(updated);
    // Optionally open the newly registered sneaker in detail view
    setSelectedSneaker(newSneaker);
  };

  // Update existing sneaker
  const handleUpdateSneaker = (updatedSneaker) => {
    const updated = sneakers.map((s) => 
      s.id === updatedSneaker.id ? updatedSneaker : s
    );
    setSneakers(updated);
    if (selectedSneaker && selectedSneaker.id === updatedSneaker.id) {
      setSelectedSneaker(updatedSneaker);
    }
  };

  // Delete sneaker
  const handleDeleteSneaker = (id) => {
    const updated = sneakers.filter((s) => s.id !== id);
    setSneakers(updated);
    if (selectedSneaker && selectedSneaker.id === id) {
      setSelectedSneaker(null);
    }
  };

  // Reset collection to starter Pokémon sneakers
  const handleResetCollection = () => {
    setSneakers(DEFAULT_SNEAKERS);
    setSelectedSneaker(null);
  };

  // Compute next Pokédex number e.g. #007
  const computeNextNumber = () => {
    const nextNum = sneakers.length + 1;
    return `#${String(nextNum).padStart(3, '0')}`;
  };

  return (
    <main className="sneakdex-app-wrapper">
      <PokedexShell
        onOpenAdd={() => setIsAddModalOpen(true)}
        onResetCollection={handleResetCollection}
        totalSneakers={sneakers.length}
      >
        {selectedSneaker ? (
          <SneakerDetailModal
            sneaker={selectedSneaker}
            onClose={() => setSelectedSneaker(null)}
            onEdit={(snk) => setEditingSneaker(snk)}
            onDelete={handleDeleteSneaker}
          />
        ) : (
          <SneakerGrid
            sneakers={sneakers}
            onSelectSneaker={(snk) => setSelectedSneaker(snk)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </PokedexShell>

      {/* Modal to Register a new Sneaker */}
      {isAddModalOpen && (
        <AddSneakerModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddSneaker}
          nextNumber={computeNextNumber()}
        />
      )}

      {/* Modal to Edit an existing Sneaker */}
      {editingSneaker && (
        <EditSneakerModal
          sneaker={editingSneaker}
          onClose={() => setEditingSneaker(null)}
          onUpdate={handleUpdateSneaker}
        />
      )}
    </main>
  );
}
