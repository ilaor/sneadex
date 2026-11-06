import React, { useState } from 'react';
import { uploadImageToBlobApi } from '../services/api';

const SNEAKER_TYPES = [
  'BASKETBALL',
  'SKATE',
  'RUNNER',
  'CLASSIC',
  'HERITAGE',
  'TECH',
  'GRAIL',
  'CUSTOM'
];

export default function EditSneakerModal({ 
  sneaker, 
  onClose, 
  onUpdate 
}) {
  const [name, setName] = useState(sneaker.name || '');
  const [type, setType] = useState(sneaker.type || 'BASKETBALL');
  const [brand, setBrand] = useState(sneaker.brand || '');
  const [size, setSize] = useState(sneaker.size || '');
  const [description, setDescription] = useState(sneaker.description || '');
  
  const [images, setImages] = useState(
    (sneaker.images || []).map((img) => 
      typeof img === 'string' 
        ? { isLocal: false, dataUrl: img, filename: 'existing.jpg' } 
        : img
    )
  );
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const moveImage = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return copy;
    });
  };

  const makeCover = (idx) => {
    if (idx === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(idx, 1);
      return [selected, ...copy];
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    let loadedCount = 0;
    const newItems = [...images];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newItems.push({
          isLocal: true,
          filename: file.name,
          contentType: file.type || 'image/jpeg',
          dataUrl: event.target.result
        });
        loadedCount++;
        if (loadedCount === files.length) {
          setImages(newItems);
        }
      };
      reader.onerror = () => {
        loadedCount++;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setImages([
      ...images,
      {
        isLocal: false,
        dataUrl: imageUrlInput.trim(),
        filename: 'external.jpg'
      }
    ]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('INDICA EL NOMBRE DE LA ZAPATILLA');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const finalImageUrls = [];

      if (images.length === 0) {
        finalImageUrls.push(
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
        );
      } else {
        for (let i = 0; i < images.length; i++) {
          const item = images[i];
          if (item.isLocal && item.dataUrl.startsWith('data:image/')) {
            setUploadStatus(`SUBIENDO FOTO ${i + 1}/${images.length}...`);
            const blobUrl = await uploadImageToBlobApi(
              item.filename || `sneaker-edit-${i + 1}.jpg`,
              item.dataUrl,
              item.contentType
            );
            finalImageUrls.push(blobUrl);
          } else {
            finalImageUrls.push(item.dataUrl);
          }
        }
      }

      const updatedSneaker = {
        ...sneaker,
        name: name.trim().toUpperCase(),
        description: description.trim().toUpperCase() || '',
        type,
        brand: brand.trim() || 'Custom',
        size: size.trim() || '',
        images: finalImageUrls
      };

      setUploadStatus('ACTUALIZANDO...');
      await onUpdate(updatedSneaker);
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setErrorMsg(err.message || 'Error al actualizar');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="yzy-modal-overlay" onClick={onClose}>
      <div 
        className="yzy-modal-box" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="yzy-modal-header">
          <div className="yzy-modal-title">EDITAR ZAPATILLA</div>
          <button 
            type="button"
            className="yzy-modal-close" 
            disabled={isUploading}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="yzy-modal-error">{errorMsg}</div>
        )}

        {isUploading && (
          <div className="yzy-modal-status">{uploadStatus}</div>
        )}

        <form onSubmit={handleSubmit} className="yzy-modal-form">
          <div className="yzy-form-field">
            <div className="yzy-photos-header-row">
              <label className="yzy-label">FOTOS ({images.length})</label>
              <span className="yzy-label-hint">LA FOTO #1 ES LA PORTADA</span>
            </div>

            {images.length > 0 && (
              <div className="yzy-reorder-grid">
                {images.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`yzy-reorder-card ${idx === 0 ? 'is-cover' : ''}`}
                  >
                    <div className="yzy-reorder-img-wrap">
                      <img src={item.dataUrl} alt={`Foto ${idx + 1}`} />
                      {idx === 0 && (
                        <span className="yzy-cover-badge">PORTADA</span>
                      )}
                      {!isUploading && (
                        <button 
                          type="button"
                          className="yzy-reorder-remove-btn"
                          onClick={() => handleRemoveImage(idx)}
                          title="Eliminar foto"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="yzy-reorder-actions">
                      <button
                        type="button"
                        className="yzy-reorder-arrow-btn"
                        disabled={idx === 0 || isUploading}
                        onClick={() => moveImage(idx, idx - 1)}
                        title="Mover hacia la izquierda"
                      >
                        ◀
                      </button>

                      {idx !== 0 ? (
                        <button
                          type="button"
                          className="yzy-make-cover-btn"
                          disabled={isUploading}
                          onClick={() => makeCover(idx)}
                          title="Poner como foto de portada"
                        >
                          PORTADA
                        </button>
                      ) : (
                        <span className="yzy-cover-active-label">#1</span>
                      )}

                      <button
                        type="button"
                        className="yzy-reorder-arrow-btn"
                        disabled={idx === images.length - 1 || isUploading}
                        onClick={() => moveImage(idx, idx + 1)}
                        title="Mover hacia la derecha"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="yzy-add-more-photos-row" style={{ marginTop: '8px' }}>
              <label className={`yzy-btn-mini ${isUploading ? 'disabled' : ''}`}>
                <span>📁 AÑADIR DE GALERÍA</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="yzy-url-row" style={{ marginTop: '6px' }}>
              <input 
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="O pegar URL de imagen..."
                className="yzy-input"
                disabled={isUploading}
              />
              <button 
                type="button"
                onClick={handleAddImageUrl}
                className="yzy-button secondary"
                disabled={isUploading}
              >
                +
              </button>
            </div>
          </div>

          <div className="yzy-form-field">
            <label className="yzy-label">NOMBRE DEL MODELO</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="yzy-input"
              required
              disabled={isUploading}
            />
          </div>

          <div className="yzy-form-field">
            <label className="yzy-label">TIPO / CATEGORÍA</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="yzy-select"
              disabled={isUploading}
            >
              {SNEAKER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="yzy-form-field">
            <label className="yzy-label">DESCRIPCIÓN</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve..."
              className="yzy-textarea"
              rows={2}
              disabled={isUploading}
            />
          </div>

          <div className="yzy-form-row">
            <div className="yzy-form-field half">
              <label className="yzy-label">MARCA</label>
              <input 
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="yzy-input"
                disabled={isUploading}
              />
            </div>
            <div className="yzy-form-field half">
              <label className="yzy-label">TALLA</label>
              <input 
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="yzy-input"
                disabled={isUploading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="yzy-button primary"
            disabled={isUploading}
          >
            {isUploading ? 'ACTUALIZANDO...' : 'GUARDAR CAMBIOS'}
          </button>
        </form>
      </div>
    </div>
  );
}
