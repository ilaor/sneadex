import React, { useState } from 'react';
import { playPokedexBeep } from '../utils/audio';

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
  
  // Images list
  const [images, setImages] = useState(sneaker.images || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  // Handle local file uploads (Camera or Photos)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsProcessingFiles(true);
    let loadedCount = 0;
    const newImages = [...images];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push(event.target.result);
        loadedCount++;
        if (loadedCount === files.length) {
          setImages(newImages);
          setIsProcessingFiles(false);
          playPokedexBeep(750, 0.05);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === files.length) setIsProcessingFiles(false);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle URL image addition
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
    playPokedexBeep(700, 0.04);
  };

  // Remove an image from the list
  const handleRemoveImage = (indexToRemove) => {
    playPokedexBeep(350, 0.04);
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalImages = images.length > 0 
      ? images 
      : ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'];

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
      images: finalImages
    };

    onUpdate(updatedSneaker);
    playPokedexBeep(850, 0.08);
    onClose();
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
            onClick={() => {
              playPokedexBeep(400, 0.05);
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-row-duo">
            <div className="form-group">
              <label className="pixel-label">N° POKÉDEX</label>
              <input 
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="pixel-input"
              />
            </div>
            <div className="form-group">
              <label className="pixel-label">TIPO</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="pixel-select"
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
            />
          </div>

          {/* Images Section */}
          <div className="form-group images-uploader-section">
            <label className="pixel-label">
              IMÁGENES ({images.length})
            </label>

            <div className="upload-actions-bar">
              <label className="pixel-file-btn">
                <span>📁 SUBIR MÁS FOTOS</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
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
              />
              <button 
                type="button"
                onClick={handleAddImageUrl}
                className="pixel-btn-action-small"
              >
                + URL
              </button>
            </div>

            {isProcessingFiles && (
              <div className="pixel-loading-bar">PROCESANDO...</div>
            )}

            {images.length > 0 && (
              <div className="images-preview-strip">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="preview-thumb-box">
                    <img src={imgUrl} alt={`Foto ${idx + 1}`} />
                    <button 
                      type="button"
                      className="preview-remove-btn"
                      onClick={() => handleRemoveImage(idx)}
                      title="Eliminar foto"
                    >
                      ✕
                    </button>
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
              />
            </div>
            <div className="form-group">
              <label className="pixel-label">TALLA</label>
              <input 
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="pixel-input"
              />
            </div>
          </div>

          <div className="modal-footer-retro">
            <button 
              type="submit" 
              className="pixel-submit-btn"
            >
              GUARDAR CAMBIOS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
