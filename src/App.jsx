import React, { useState, useEffect } from 'react';
import PokedexShell from './components/PokedexShell';
import SneakerGrid from './components/SneakerGrid';
import SneakerDetailModal from './components/SneakerDetailModal';
import AddSneakerModal from './components/AddSneakerModal';
import EditSneakerModal from './components/EditSneakerModal';
import { DEFAULT_SNEAKERS } from './data/defaultSneakers';
import { 
  fetchSneakersApi, 
  addSneakerApi, 
  updateSneakerApi, 
  deleteSneakerApi, 
  resetSneakersApi 
} from './services/api';
import './App.css';

export default function App() {
  const [sneakers, setSneakers] = useState(DEFAULT_SNEAKERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  // Active view states
  const [selectedSneaker, setSelectedSneaker] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSneaker, setEditingSneaker] = useState(null);

  // Fetch from Vercel KV via Serverless API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCollection() {
      try {
        setIsLoading(true);
        const data = await fetchSneakersApi();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setSneakers(data);
        }
      } catch (err) {
        console.error('Error fetching sneakers from API:', err);
        if (isMounted) {
          setSyncError('MODO SIN CONEXIÓN O KV NO DISPONIBLE');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadCollection();
    return () => {
      isMounted = false;
    };
  }, []);

  // Add new sneaker
  const handleAddSneaker = async (newSneaker) => {
    try {
      setIsSyncing(true);
      // Optimistic update
      setSneakers((prev) => [newSneaker, ...prev]);
      setSelectedSneaker(newSneaker);
      // Persist to Vercel KV
      await addSneakerApi(newSneaker);
    } catch (err) {
      console.error('Failed to add sneaker via API:', err);
      setSyncError('ERROR AL GUARDAR EN VERCEL KV');
    } finally {
      setIsSyncing(false);
    }
  };

  // Update existing sneaker
  const handleUpdateSneaker = async (updatedSneaker) => {
    try {
      setIsSyncing(true);
      setSneakers((prev) =>
        prev.map((s) => (s.id === updatedSneaker.id ? updatedSneaker : s))
      );
      if (selectedSneaker && selectedSneaker.id === updatedSneaker.id) {
        setSelectedSneaker(updatedSneaker);
      }
      await updateSneakerApi(updatedSneaker);
    } catch (err) {
      console.error('Failed to update sneaker via API:', err);
      setSyncError('ERROR AL ACTUALIZAR EN VERCEL KV');
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete sneaker
  const handleDeleteSneaker = async (id) => {
    try {
      setIsSyncing(true);
      setSneakers((prev) => prev.filter((s) => s.id !== id));
      if (selectedSneaker && selectedSneaker.id === id) {
        setSelectedSneaker(null);
      }
      await deleteSneakerApi(id);
    } catch (err) {
      console.error('Failed to delete sneaker via API:', err);
      setSyncError('ERROR AL ELIMINAR EN VERCEL KV');
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset collection to starter Pokémon sneakers
  const handleResetCollection = async () => {
    try {
      setIsSyncing(true);
      const res = await resetSneakersApi();
      setSneakers(res || DEFAULT_SNEAKERS);
      setSelectedSneaker(null);
    } catch (err) {
      console.error('Failed to reset collection via API:', err);
      setSneakers(DEFAULT_SNEAKERS);
    } finally {
      setIsSyncing(false);
    }
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
        isSyncing={isSyncing}
      >
        {isLoading ? (
          <div className="pokedex-loading-screen">
            <div className="loading-pokeball-spinner"></div>
            <p className="loading-pixel-text">CONECTANDO A VERCEL KV...</p>
            <p className="loading-sub-text">SINCRONIZANDO SNEAKDEX</p>
          </div>
        ) : selectedSneaker ? (
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
