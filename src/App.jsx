import React, { useState, useEffect } from 'react';
import PokedexShell from './components/PokedexShell';
import YZYSneakerGrid from './components/YZYSneakerGrid';
import YZYSneakerDetail from './components/YZYSneakerDetail';
import AuthGate from './components/AuthGate';
import AddSneakerModal from './components/AddSneakerModal';
import EditSneakerModal from './components/EditSneakerModal';
import { DEFAULT_SNEAKERS } from './data/defaultSneakers';
import { 
  fetchSneakersApi, 
  addSneakerApi, 
  updateSneakerApi, 
  deleteSneakerApi,
  isAuthenticated
} from './services/api';
import './App.css';

export default function App() {
  const [sneakers, setSneakers] = useState(DEFAULT_SNEAKERS);
  const [isAuth, setIsAuth] = useState(() => isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSneaker, setSelectedSneaker] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSneaker, setEditingSneaker] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    if (isAuth) {
      fetchSneakersApi()
        .then((data) => {
          if (!isCancelled && Array.isArray(data) && data.length > 0) {
            setSneakers(data);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error('Error fetching sneakers:', err);
            if (err.isAuthError || !isAuthenticated()) {
              setIsAuth(false);
            }
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [isAuth]);

  const handleAuthenticated = () => {
    setIsLoading(true);
    setIsAuth(true);
    fetchSneakersApi()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSneakers(data);
        }
      })
      .catch((err) => {
        console.error('Error after authentication:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Add new sneaker
  const handleAddSneaker = async (newSneaker) => {
    try {
      setSneakers((prev) => [newSneaker, ...prev]);
      setSelectedSneaker(newSneaker); // focus on newly added sneaker
      await addSneakerApi(newSneaker);
    } catch (err) {
      console.error('Failed to add sneaker:', err);
      if (err.isAuthError) {
        setIsAuth(false);
      }
    }
  };

  // Update existing sneaker
  const handleUpdateSneaker = async (updatedSneaker) => {
    try {
      setSneakers((prev) =>
        prev.map((s) => (s.id === updatedSneaker.id ? updatedSneaker : s))
      );
      if (selectedSneaker && selectedSneaker.id === updatedSneaker.id) {
        setSelectedSneaker(updatedSneaker);
      }
      await updateSneakerApi(updatedSneaker);
    } catch (err) {
      console.error('Failed to update sneaker:', err);
      if (err.isAuthError) {
        setIsAuth(false);
      }
    }
  };

  // Delete sneaker
  const handleDeleteSneaker = async (id) => {
    try {
      setSneakers((prev) => prev.filter((s) => s.id !== id));
      if (selectedSneaker && selectedSneaker.id === id) {
        setSelectedSneaker(null);
      }
      await deleteSneakerApi(id);
    } catch (err) {
      console.error('Failed to delete sneaker:', err);
      if (err.isAuthError) {
        setIsAuth(false);
      }
    }
  };

  const computeNextNumber = () => {
    const nextNum = sneakers.length + 1;
    return `#${String(nextNum).padStart(3, '0')}`;
  };

  return (
    <main className="sneakdex-app-wrapper">
      <PokedexShell
        onOpenAdd={() => {
          if (!isAuth) return;
          setIsAddModalOpen(true);
        }}
      >
        {!isAuth ? (
          <AuthGate onAuthenticated={handleAuthenticated} />
        ) : isLoading ? (
          <div className="yzy-loading-screen">
            <div className="yzy-loading-indicator">CARGANDO...</div>
          </div>
        ) : selectedSneaker ? (
          <YZYSneakerDetail
            sneaker={selectedSneaker}
            onBack={() => setSelectedSneaker(null)}
            onEdit={(snk) => setEditingSneaker(snk)}
            onDelete={(id) => handleDeleteSneaker(id)}
          />
        ) : (
          <YZYSneakerGrid
            sneakers={sneakers}
            onSelectSneaker={(snk) => setSelectedSneaker(snk)}
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
