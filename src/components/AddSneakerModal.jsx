import React, { useState, useRef, useEffect } from 'react';
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
  // Step: 'camera' by default, then 'form'
  const [step, setStep] = useState('camera');
  
  // Camera state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);
  const [flash, setFlash] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [type, setType] = useState('BASKETBALL');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  
  // Images list: array of { isLocal, dataUrl, filename, contentType }
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Open camera when on 'camera' step
  useEffect(() => {
    let activeStream = null;
    let isCancelled = false;

    if (step === 'camera') {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices?.enumerateDevices?.();
        return;
      }

      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        },
        audio: false
      })
      .then((stream) => {
        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        activeStream = stream;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn('Unable to access device camera:', err);
          setCameraError(true);
        }
      });
    }

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [step]);

  // Capture photo from video stream without closing camera
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const width = video.videoWidth || 1080;
    const height = video.videoHeight || 1080;

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

    // Shutter flash animation
    setFlash(true);
    setTimeout(() => setFlash(false), 180);

    // Add captured photo to collection immediately
    setImages((prev) => [
      ...prev,
      {
        isLocal: true,
        dataUrl,
        filename: `sneaker-${Date.now()}-${prev.length + 1}.jpg`,
        contentType: 'image/jpeg'
      }
    ]);
  };

  // Reorder photos: move from index to index
  const moveImage = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return copy;
    });
  };

  // Make a photo the first (cover photo for main screen)
  const makeCover = (idx) => {
    if (idx === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(idx, 1);
      return [selected, ...copy];
    });
  };

  // Remove an image from the list
  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle local file uploads (Camera or Photos from gallery)
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
  };

  // Form submit with upload to @vercel/blob
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
              item.filename || `sneaker-${i + 1}.jpg`,
              item.dataUrl,
              item.contentType
            );
            finalImageUrls.push(blobUrl);
          } else {
            finalImageUrls.push(item.dataUrl);
          }
        }
      }

      const newSneaker = {
        id: `snk-${Date.now()}`,
        number: nextNumber || '#001',
        name: name.trim().toUpperCase(),
        description: description.trim().toUpperCase() || '',
        type,
        brand: brand.trim() || 'Custom',
        colorway: '',
        size: size.trim() || '',
        condition: 'Deadstock (DS)',
        images: finalImageUrls
      };

      setUploadStatus('GUARDANDO...');
      await onAdd(newSneaker);
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'Error al guardar');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="yzy-modal-overlay" onClick={onClose}>
      <div 
        className={`yzy-modal-box ${step === 'camera' ? 'camera-mode' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* =========================================================
            VIEW 1: CAMERA BY DEFAULT
            ========================================================= */}
        {step === 'camera' ? (
          <div className="yzy-camera-view">
            {/* Camera Top Bar */}
            <div className="yzy-camera-top-bar">
              <button
                type="button"
                className="yzy-camera-nav-btn"
                onClick={onClose}
                aria-label="Cerrar"
                title="Cerrar"
              >
                ✕
              </button>

              <div className="yzy-camera-counter">
                {images.length === 0 ? (
                  <span>ENFOCA LA ZAPATILLA</span>
                ) : (
                  <span>{images.length} FOTO{images.length !== 1 ? 'S' : ''} CAPTURADA{images.length !== 1 ? 'S' : ''}</span>
                )}
              </div>

              <button
                type="button"
                className="yzy-camera-done-btn"
                onClick={() => setStep('form')}
              >
                {images.length > 0 ? 'CONTINUAR →' : 'SALTAR →'}
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className="yzy-camera-viewfinder">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="yzy-camera-video"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Shutter flash overlay */}
              {flash && <div className="yzy-camera-flash" />}

              {/* Camera Error / Fallback message if permissions denied */}
              {cameraError && (
                <div className="yzy-camera-fallback-msg">
                  <p>NO SE PUDO ACCEDER A LA CÁMARA</p>
                  <label className="yzy-camera-fallback-file-btn">
                    <span>SELECCIONAR FOTO DE GALERÍA</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        handleFileUpload(e);
                        setStep('form');
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button
                    type="button"
                    className="yzy-button secondary"
                    onClick={() => setStep('form')}
                    style={{ marginTop: '8px' }}
                  >
                    CONTINUAR SIN CÁMARA
                  </button>
                </div>
              )}
            </div>

            {/* Camera Bottom Controls: Shutter button is favicon.svg */}
            <div className="yzy-camera-bottom-bar">
              {/* Gallery upload shortcut */}
              <label className="yzy-camera-gallery-shortcut" title="Subir desde galería">
                <span className="yzy-camera-gallery-icon">📁</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {/* SHUTTER BUTTON: Circular button with favicon.svg */}
              <button
                type="button"
                className="yzy-camera-shutter-btn"
                onClick={handleCapturePhoto}
                aria-label="Hacer foto"
                title="Hacer foto"
              >
                <img 
                  src="/favicon.svg" 
                  alt="Disparar foto" 
                  className="yzy-shutter-favicon" 
                />
              </button>

              {/* Recent thumbnail preview */}
              <div 
                className="yzy-camera-thumb-shortcut"
                onClick={() => setStep('form')}
                title={images.length > 0 ? "Ver fotos y continuar" : ""}
              >
                {images.length > 0 ? (
                  <div className="yzy-camera-last-thumb">
                    <img src={images[images.length - 1].dataUrl} alt="Última foto" />
                    <span className="yzy-camera-thumb-badge">{images.length}</span>
                  </div>
                ) : (
                  <div className="yzy-camera-empty-thumb" />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================
             VIEW 2: FORM WITH PHOTO REORDERING & PRODUCT DETAILS
             ========================================================= */
          <div className="yzy-form-view">
            <div className="yzy-modal-header">
              <button
                type="button"
                className="yzy-modal-back-to-cam"
                onClick={() => setStep('camera')}
                title="Volver a hacer fotos"
              >
                ‹ CÁMARA
              </button>
              <div className="yzy-modal-title">NUEVA ZAPATILLA</div>
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
              {/* Photo Reorder & Management Section */}
              <div className="yzy-form-field">
                <div className="yzy-photos-header-row">
                  <label className="yzy-label">
                    FOTOS ({images.length})
                  </label>
                  <span className="yzy-label-hint">
                    LA FOTO #1 ES LA PORTADA EN LA PANTALLA PRINCIPAL
                  </span>
                </div>

                {/* Thumbnails with Reordering Controls */}
                {images.length > 0 ? (
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

                        {/* Reordering actions */}
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
                ) : (
                  <div className="yzy-no-photos-box">
                    <p>NO HAS CAPTURADO NINGUNA FOTO</p>
                    <button
                      type="button"
                      className="yzy-button secondary"
                      onClick={() => setStep('camera')}
                    >
                      📸 ABRIR CÁMARA
                    </button>
                  </div>
                )}

                {/* Additional upload options in form */}
                <div className="yzy-add-more-photos-row">
                  <button
                    type="button"
                    className="yzy-btn-mini"
                    onClick={() => setStep('camera')}
                    disabled={isUploading}
                  >
                    📸 HACER MÁS FOTOS
                  </button>
                  
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

              {/* Sneaker Details */}
              <div className="yzy-form-field">
                <label className="yzy-label">NOMBRE DEL MODELO (EJ: YZY PODS)</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="NOMBRE"
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
                    placeholder="EJ: ADIDAS"
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
                    placeholder="US 10"
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
                {isUploading ? 'GUARDANDO...' : 'REGISTRAR'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
