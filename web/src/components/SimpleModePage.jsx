import { useState, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './SimpleModePage.css';

function SimpleModePage({ onAnalyzeImages, isLoading }) {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState(null); // 'photo' or 'email'
  const [showEmailInstructions, setShowEmailInstructions] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSelectedImages([]);
    if (type === 'photo') {
      setShowEmailInstructions(false);
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    setSelectedImages([]);
    setShowEmailInstructions(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    });

    // Convert to base64
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImages((prev) => {
          if (prev.length >= 5) return prev;
          return [...prev, event.target.result];
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    if (selectedImages.length > 0 && onAnalyzeImages) {
      onAnalyzeImages(selectedImages);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 1: Type selection
  if (!selectedType) {
    return (
      <div className="simple-mode">
        <h2 className="simple-mode-title">{t('simpleMode.title')}</h2>

        <div className="simple-mode-buttons">
          <button
            className="simple-mode-btn photo-btn"
            onClick={() => handleTypeSelect('photo')}
          >
            <span className="simple-mode-icon">📷</span>
            <span className="simple-mode-label">{t('simpleMode.photo')}</span>
          </button>

          <button
            className="simple-mode-btn email-btn"
            onClick={() => handleTypeSelect('email')}
          >
            <span className="simple-mode-icon">📧</span>
            <span className="simple-mode-label">{t('simpleMode.email')}</span>
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Email selected - show instructions option
  if (selectedType === 'email') {
    return (
      <div className="simple-mode">
        <button className="simple-mode-back" onClick={handleBack}>
          ← {t('payment.back')}
        </button>

        <div className="simple-mode-email-section">
          <label className="simple-mode-checkbox">
            <input
              type="checkbox"
              checked={showEmailInstructions}
              onChange={(e) => setShowEmailInstructions(e.target.checked)}
            />
            <span className="checkbox-label">{t('simpleMode.showEmailInstructions')}</span>
          </label>

          {showEmailInstructions && (
            <div className="simple-mode-instructions">
              <h3 className="instructions-title">
                📌 {t('simpleMode.emailInstructionsTitle')}
              </h3>

              <div className="instruction-step">
                <span className="step-number">1️⃣</span>
                <div className="step-content">
                  <strong>{t('simpleMode.step1Title')}</strong>
                  <p>{t('simpleMode.step1Text')}</p>
                </div>
              </div>

              <div className="instruction-step">
                <span className="step-number">2️⃣</span>
                <div className="step-content">
                  <strong>{t('simpleMode.step2Title')}</strong>
                  <p>{t('simpleMode.step2Text')}</p>
                </div>
              </div>

              <div className="instruction-warning">
                ⚠️ {t('simpleMode.warning')}
              </div>
            </div>
          )}

          {/* Image selection for email */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />

          {selectedImages.length > 0 && (
            <div className="simple-mode-previews">
              {selectedImages.map((img, index) => (
                <div key={index} className="preview-item">
                  <img src={img} alt={`Preview ${index + 1}`} />
                  <button
                    className="remove-preview"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            className="simple-mode-btn action-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <span className="simple-mode-icon">📷</span>
            <span className="simple-mode-label">{t('simpleMode.sendScreenshots')}</span>
          </button>

          {selectedImages.length > 0 && (
            <button
              className="simple-mode-btn analyze-btn"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              <span className="simple-mode-icon">🔍</span>
              <span className="simple-mode-label">{t('simpleMode.analyze')}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Photo selected - show file picker
  if (selectedType === 'photo') {
    return (
      <div className="simple-mode">
        <button className="simple-mode-back" onClick={handleBack}>
          ← {t('payment.back')}
        </button>

        <div className="simple-mode-photo-section">
          <p className="simple-mode-text">{t('simpleMode.selectPhotos')}</p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />

          {selectedImages.length > 0 && (
            <div className="simple-mode-previews">
              {selectedImages.map((img, index) => (
                <div key={index} className="preview-item">
                  <img src={img} alt={`Preview ${index + 1}`} />
                  <button
                    className="remove-preview"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            className="simple-mode-btn action-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <span className="simple-mode-icon">📷</span>
            <span className="simple-mode-label">{t('simpleMode.choosePhotos')}</span>
          </button>

          {selectedImages.length > 0 && (
            <button
              className="simple-mode-btn analyze-btn"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              <span className="simple-mode-icon">🔍</span>
              <span className="simple-mode-label">{t('simpleMode.analyze')}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default SimpleModePage;
