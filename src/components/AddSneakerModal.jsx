import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playCatchSuccess, playPokedexBeep } from '../utils/audio';
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

export default function AddSneakerModal({ 
  onClose, 
  onAdd, 
  nextNumber 
}) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(nextNumber || '#001');
  const [type, setType] = useState('BASKETBALL');
  const [brand, setBrand] = useState('');
  const [colorway, setColorway] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('Deadstock (DS)');
  const [description, setDescription] = useState('');
  
  // Images list (can contain local { filename, dataUrl } or direct URLs)
  const [images, setImages] = useState([]);
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

  // Form submit with upload to @vercel/blob
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('INDICA EL NOMBRE DE LA ZAPATILLA');
      playPokedexBeep(250, 0.1);
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const finalImageUrls = [];

      // If no images attached, provide a default fallback
      if (images.length === 0) {
        finalImageUrls.push(
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
        );
      } else {
        for (let i = 0; i < images.length; i++) {
          const item = images[i];
          if (item.isLocal && item.dataUrl.startsWith('data:image/')) {
            setUploadStatus(`SUBIENDO FOTO ${i + 1}/${images.length} A VERCEL BLOB...`);
            const blobUrl = await uploadImageToBlobApi(
              item.filename || `sneaker-${i + 1}.jpg`,
              item.dataUrl,
              item.contentType
            );
            finalImageUrls.push(blobUrl);
          } else {
            // Already a remote URL
            finalImageUrls.push(item.dataUrl);
          }
        }
      }

      const newSneaker = {
        id: `snk-${Date.now()}`,
        number: number.trim().startsWith('#') ? number.trim() : `#${number.trim()}`,
        name: name.trim().toUpperCase(),
        description: description.trim().toUpperCase() || 'DATOS REGISTRADOS POR EL COLECCIONISTA EN LA SNEAKDEX.',
        type,
        brand: brand.trim() || 'Custom',
        colorway: colorway.trim() || 'OG Colorway',
        size: size.trim() || 'US 10',
        condition,
        images: finalImageUrls
      };

      setUploadStatus('GUARDANDO EN VERCEL KV...');
      await onAdd(newSneaker);
      playCatchSuccess();

      // Celebratory Pokédex confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#e63946', '#facc15', '#38bdf8', '#22c55e']
        });
      } catch (err) {}

      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'Error al subir a Vercel Blob / KV');
      playPokedexBeep(200, 0.15);
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
        {/* Modal Header */}
        <div className="modal-header-retro">
          <div className="modal-header-lights">
            <span className="mini-dot-led red"></span>
            <span className="mini-dot-led yellow"></span>
            <span className="mini-dot-led green"></span>
          </div>
          <h3 className="modal-title-pixel">REGISTRAR ZAPATILLA</h3>
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
          {/* Row 1: Number & Type */}
          <div className="form-row-duo">
            <div className="form-group">
              <label className="pixel-label">N° POKÉDEX</label>
              <input 
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="pixel-input"
                placeholder="#007"
                disabled={isUploading}
              />
            </div>
            <div className="form-group">
              <label className="pixel-label">TIPO / CATEGORÍA</label>
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

          {/* Name */}
          <div className="form-group">
            <label className="pixel-label">NOMBRE DEL MODELO *</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Ej: AIR JORDAN 4 RETRO BRED"
              className="pixel-input"
              required
              disabled={isUploading}
            />
          </div>

          {/* Images Section with Vercel Blob support */}
          <div className="form-group images-uploader-section">
            <label className="pixel-label">
              IMÁGENES ({images.length} AÑADIDAS) → VERCEL BLOB
            </label>
            <div className="uploader-help-pixel">
              Las fotos se alojarán de forma segura en Vercel Blob Storage.
            </div>

            {/* Buttons to upload file or paste URL */}
            <div className="upload-actions-bar">
              <label className={`pixel-file-btn ${isUploading ? 'disabled' : ''}`}>
                <span>📁 SUBIR FOTOS (CÁMARA / GALERÍA)</span>
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

            {/* Or add via URL */}
            <div className="url-add-row">
              <input 
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="O pega URL de imagen..."
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

            {/* Preview Grid of Uploaded Images */}
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

          {/* Description (Pixel Art centered flavor text) */}
          <div className="form-group">
            <label className="pixel-label">DESCRIPCIÓN DE LA ENTRADA</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Historia, detalles, materiales o recuerdos de este par..."
              className="pixel-textarea"
              rows={3}
              disabled={isUploading}
            />
          </div>

          {/* Optional Specs */}
          <div className="form-row-duo">
            <div className="form-group">
              <label className="pixel-label">MARCA</label>
              <input 
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Nike, adidas, Jordan..."
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
                placeholder="US 10 / EU 44"
                className="pixel-input"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="form-row-duo">
            <div className="form-group">
              <label className="pixel-label">COLORWAY</label>
              <input 
                type="text"
                value={colorway}
                onChange={(e) => setColorway(e.target.value)}
                placeholder="Black / Cement Grey"
                className="pixel-input"
                disabled={isUploading}
              />
            </div>
            <div className="form-group">
              <label className="pixel-label">ESTADO</label>
              <select 
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="pixel-select"
                disabled={isUploading}
              >
                <option value="Deadstock (DS)">Deadstock (DS) - A estrenar</option>
                <option value="VNDS (Near Mint)">VNDS - Como nuevo</option>
                <option value="Used 9/10">Used 9/10 - Excelente</option>
                <option value="Used 8/10">Used 8/10 - Buen estado</option>
                <option value="Beat / Beater">Beater - Uso diario</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="modal-footer-retro">
            <button 
              type="submit" 
              className="pixel-submit-btn"
              disabled={isUploading}
            >
              {isUploading ? '⚡ SINCRONIZANDO CON VERCEL...' : '★ REGISTRAR EN SNEAKDEX ★'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
