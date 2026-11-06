import React, { useState } from 'react';
import { loginApi } from '../services/api';

export default function AuthGate({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('INGRESA LA CONTRASEÑA');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await loginApi(password.trim());
      onAuthenticated();
    } catch (err) {
      setError(err.message || 'CONTRASEÑA INCORRECTA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="yzy-auth-container">
      <form onSubmit={handleSubmit} className="yzy-auth-form">
        <div className="yzy-auth-title">ACCESO RESTRINGIDO</div>
        <div className="yzy-auth-subtitle">COLECCIÓN PRIVADA</div>

        <div className="yzy-auth-input-wrap">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="CONTRASEÑA"
            className="yzy-auth-input"
            autoFocus
            disabled={isLoading}
          />
        </div>

        {error && <div className="yzy-auth-error">{error}</div>}

        <button
          type="submit"
          disabled={isLoading || !password.trim()}
          className="yzy-auth-button"
        >
          {isLoading ? 'VERIFICANDO...' : 'ENTRAR'}
        </button>
      </form>
    </div>
  );
}

