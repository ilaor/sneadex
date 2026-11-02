import React, { useState } from 'react';
import { playPokedexBeep } from '../utils/audio';
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
  const [number, setNumber] = useState(sneaker.number || '#001');
  const [type, setType] = useState(sneaker.type || 'BASKETBALL');
  const [brand, setBrand] = useState(sneaker.brand || '');
  const [colorway, setColorway] = useState(sneaker.colorway || '');
  const [size, setSize] = useState(sneaker.size || '');
  const [condition, setCondition] = useState(sneaker.condition || 'Deadstock (DS)');
  const [description, setDescription] = useState(sneaker.description || '');
  
  // Images list: elements can be string URL or { isLocal, dataUrl, filename, contentType }
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

  // Handle local file uploads (Camera or Photos)
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
          playPokedexBeep(750, 0.05);
        }
      };
      reader.onerror = () => {
        loadedCount++;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle URL image addition
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
    playPokedexBeep(700, 0.04);
  };

  // Remove an image from the list
  const handleRemoveImage = (indexToRemove) => {
    playPokedexBeep(350, 0.04);
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUploading(true);
    setErrorMsg('');

    try {
      const finalImageUrls = [];

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        if (item.isLocal && item.dataUrl.startsWith('data:image/')) {
          setUploadStatus(`SUBIENDO A VERCEL BLOB (${i + 1}/${images.length})...`);
          const blobUrl = await uploadImageToBlobApi(
            item.filename || `sneaker-${i + 1}.jpg`,
            item.dataUrl,
            item.contentType
          );
          finalImageUrls.push(blobUrl);
        } else {
          finalImageUrls.push(item.dataUrl);
        }
      }

      const updatedSneaker = {
        ...sneaker,
        number: number.trim().startsWith('#') ? number.trim() : `#${number.trim()}`,
        name: name.trim().toUpperCase(),
        description: description.trim().toUpperCase(),
        type,
        brand: brand.trim(),
        colorway: colorway.trim(),
        size: size.trim(),
        condition,
        images: finalImageUrls.length > 0 ? finalImageUrls : sneaker.images
      };

      setUploadStatus('ACTUALIZANDO EN VERCEL KV...');
      await onUpdate(updatedSneaker);
      playPokedexBeep(850, 0.08);
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setErrorMsg(err.message || 'Error al actualizar en Vercel KV');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="modal-content-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header-retro">
          <div className="modal-header-lights">
            <span className="mini-dot-led red"></span>
            <span className="mini-dot-led yellow"></span>
            <span className="mini-dot-led green"></span>
          </div>
          <h3 className="modal-title-pixel">EDITAR ENTRADA</h3>
          <button 
            className="modal-close-btn" 
            disabled={isUploading}
            onClick={() => {
              playPokedexBeep(400, 0.05);
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="modal-error-alert-pixel">
            ! {errorMsg}
          </div>
        )}

        {isUploading && (
          <div className="modal-uploading-banner">
            <span className="upload-spinner-pixel">⚡</span>
            <span>{uploadStatus}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-row-duo">
            <div className="form-group">
              <label className="pixel-label">N° POKÉDEX</label>
              <input 
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="pixel-input"
                disabled={isUploading}
              />
            </div>
            <div className="form-group">
              <label className="pixel-label">TIPO</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="pixel-select"
                disabled={isUploading}
              >
                {SNEAKER_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="pixel-label">NOMBRE DEL MODELO *</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pixel-input"
              required
              disabled={isUploading}
            />
          </div>

          {/* Images Section */}
          <div className="form-group images-uploader-section">
            <label className="pixel-label">
              IMÁGENES ({images.length}) → VERCEL BLOB
            </label>

            <div className="upload-actions-bar">
              <label className={`pixel-file-btn ${isUploading ? 'disabled' : ''}`}>
                <span>📁 SUBIR MÁS FOTOS</span>
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

            <div className="url-add-row">
              <input 
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="O añade URL..."
                className="pixel-input url-input"
                disabled={isUploading}
              />
              <button 
                type="button"
                onClick={handleAddImageUrl}
                className="pixel-btn-action-small"
                disabled={isUploading}
              >
                + URL
              </button>
            </div>

            {images.length > 0 && (
              <div className="images-preview-strip">
                {images.map((item, idx) => (
                  <div key={idx} className="preview-thumb-box">
                    <img src={item.dataUrl} alt={`Foto ${idx + 1}`} />
                    {!isUploading && (
                      <button 
                        type="button"
                        className="preview-remove-btn"
                        onClick={() => handleRemoveImage(idx)}
                        title="Eliminar foto"
                      >
                        ✕
                      </button>
                    )}
                    <span className="preview-idx-badge">{idx + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="pixel-label">DESCRIPCIÓN (PIXEL ART)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pixel-textarea"
              rows={3}
              disabled={isUploading}
            />
          </div>

          <div className="form-row-duo">
            <div className="form-group">
              <label className="pixel-label">MARCA</label>
              <input 
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="pixel-input"
                disabled={isUploading}
              />
            </div>
            <div className="form-group">
              <label className="pixel-label">TALLA</label>
              <input 
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="pixel-input"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="modal-footer-retro">
            <button 
              type="submit" 
              className="pixel-submit-btn"
              disabled={isUploading}
            >
              {isUploading ? '⚡ ACTUALIZANDO EN VERCEL...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
