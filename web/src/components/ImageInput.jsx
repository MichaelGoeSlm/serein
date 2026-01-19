import { useState, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './ImageInput.css';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function ImageInput({ onAnalyzeImages, isLoading }) {
  const { t } = useLanguage();
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    if (selectedImages.length + files.length > MAX_IMAGES) {
      alert(t('maxImagesAlert'));
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" ${t('imageTooLarge')}`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}" ${t('invalidImage')}`);
        continue;
      }
      validFiles.push(file);
    }

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
          <span className="upload-text">{t('imageButton')}</span>
          <span className="upload-hint">{t('imageDragHint')}</span>
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
                  title={t('removeAll')}
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
                <small>{t('addMore')}</small>
              </button>
            )}
          </div>
          <p className="images-count">
            {selectedImages.length} / {MAX_IMAGES} {t('imageLimit')}
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
                  {t('analyzing')}
                </span>
              ) : (
                selectedImages.length > 1 ? t('analyzeImages') : t('analyzeImage')
              )}
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isLoading}
              className="remove-button"
            >
              {t('removeAll')}
            </button>
          </div>
        </div>
      )}

      <p className="input-hint">{t('imageFormats')}</p>
    </div>
  );
}

export default ImageInput;
