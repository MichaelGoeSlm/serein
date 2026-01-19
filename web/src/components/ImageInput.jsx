import { useState, useRef } from 'react';
import './ImageInput.css';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function ImageInput({ onAnalyzeImages, isLoading }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Check total count
    if (selectedImages.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images autorisées.`);
      return;
    }

    // Process each file
    const validFiles = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" est trop volumineuse. Maximum 5 Mo par image.`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}" n'est pas une image valide.`);
        continue;
      }
      validFiles.push(file);
    }

    // Read files and create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImages(prev => {
          if (prev.length >= MAX_IMAGES) return prev;
          return [...prev, {
            id: Date.now() + Math.random(),
            name: file.name,
            preview: e.target.result
          }];
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleClearAll = () => {
    setSelectedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeImages = () => {
    if (selectedImages.length > 0 && !isLoading) {
      const imagesBase64 = selectedImages.map(img => img.preview);
      onAnalyzeImages(imagesBase64);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-input">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/png,image/jpeg,image/gif,image/webp"
        multiple
        style={{ display: 'none' }}
        disabled={isLoading || selectedImages.length >= MAX_IMAGES}
      />

      {selectedImages.length === 0 ? (
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isLoading}
          className="upload-button"
        >
          <span className="upload-icon">📷</span>
          <span className="upload-text">Cliquez pour sélectionner des images</span>
          <span className="upload-hint">ou glissez-déposez vos fichiers ici</span>
        </button>
      ) : (
        <div className="images-preview-container">
          <div className="images-grid">
            {selectedImages.map((img) => (
              <div key={img.id} className="image-thumb">
                <img src={img.preview} alt={img.name} />
                <button
                  type="button"
                  className="remove-thumb"
                  onClick={() => handleRemoveImage(img.id)}
                  disabled={isLoading}
                  title="Supprimer"
                >
                  ×
                </button>
              </div>
            ))}
            {selectedImages.length < MAX_IMAGES && (
              <button
                type="button"
                className="add-more-button"
                onClick={triggerFileInput}
                disabled={isLoading}
              >
                <span>+</span>
                <small>Ajouter</small>
              </button>
            )}
          </div>
          <p className="images-count">
            {selectedImages.length} / {MAX_IMAGES} image{selectedImages.length > 1 ? 's' : ''}
          </p>
          <div className="image-actions">
            <button
              type="button"
              onClick={handleAnalyzeImages}
              disabled={isLoading}
              className="analyze-button"
            >
              {isLoading ? (
                <span className="loading-text">
                  <span className="spinner"></span>
                  Analyse...
                </span>
              ) : (
                `Analyser ${selectedImages.length > 1 ? 'ces images' : 'cette image'}`
              )}
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isLoading}
              className="remove-button"
            >
              Tout supprimer
            </button>
          </div>
        </div>
      )}

      <p className="input-hint">
        Formats acceptés : PNG, JPEG, GIF, WebP (max 5 Mo par image)
      </p>
    </div>
  );
}

export default ImageInput;
