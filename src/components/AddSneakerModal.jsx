import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playCatchSuccess, playPokedexBeep } from '../utils/audio';

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
  
  // Images list
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    if (!name.trim()) {
      setErrorMsg('INDICA EL NOMBRE DE LA ZAPATILLA');
      playPokedexBeep(250, 0.1);
      return;
    }

    // Default fallback image if none provided
    const finalImages = images.length > 0 
      ? images 
      : ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'];

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
      images: finalImages
    };

    onAdd(newSneaker);
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
              />
            </div>
            <div className="form-group">
              <label className="pixel-label">TIPO / CATEGORÍA</label>
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
            />
          </div>

          {/* Images Section */}
          <div className="form-group images-uploader-section">
            <label className="pixel-label">
              IMÁGENES ({images.length} AÑADIDAS)
            </label>
            <div className="uploader-help-pixel">
              Puedes subir múltiples fotos de tu par (frontal, lateral, suela...)
            </div>

            {/* Buttons to upload file or paste URL */}
            <div className="upload-actions-bar">
              <label className="pixel-file-btn">
                <span>📁 SUBIR FOTOS (CÁMARA / GALERÍA)</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
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
              <div className="pixel-loading-bar">PROCESANDO IMAGENES...</div>
            )}

            {/* Preview Grid of Uploaded Images */}
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

          {/* Description (Pixel Art centered flavor text) */}
          <div className="form-group">
            <label className="pixel-label">DESCRIPCIÓN DE LA ENTRADA</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Historia, detalles, materiales o recuerdos de este par..."
              className="pixel-textarea"
              rows={3}
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
              />
            </div>
            <div className="form-group">
              <label className="pixel-label">ESTADO</label>
              <select 
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="pixel-select"
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
            >
              ★ REGISTRAR EN SNEAKDEX ★
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
