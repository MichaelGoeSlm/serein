import { useState, useRef } from 'react';
import './LinkInput.css';

function LinkInput({ onAnalyzeUrl, onAnalyzeImage, isLoading }) {
  const [url, setUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmitUrl = (e) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onAnalyzeUrl(url.trim());
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image trop volumineuse. Maximum 5 Mo.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image.');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = () => {
    if (imagePreview && !isLoading) {
      onAnalyzeImage(imagePreview);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="link-input">
      {/* URL Input Section */}
      <form onSubmit={handleSubmitUrl}>
        <div className="input-container">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Collez votre lien ici (ex: https://exemple.com)"
            disabled={isLoading}
            className="url-input"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="analyze-button"
          >
            {isLoading ? (
              <span className="loading-text">
                <span className="spinner"></span>
                Analyse...
              </span>
            ) : (
              'Analyser'
            )}
          </button>
        </div>
      </form>

      {/* Separator */}
      <div className="separator">
        <span>ou</span>
      </div>

      {/* Image Upload Section */}
      <div className="image-upload-section">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/png,image/jpeg,image/gif,image/webp"
          style={{ display: 'none' }}
          disabled={isLoading}
        />

        {!imagePreview ? (
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isLoading}
            className="upload-button"
          >
            <span className="upload-icon">📷</span>
            Analyser une image / capture d'écran
          </button>
        ) : (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Aperçu" className="image-preview" />
            <div className="image-actions">
              <button
                type="button"
                onClick={handleAnalyzeImage}
                disabled={isLoading}
                className="analyze-button"
              >
                {isLoading ? (
                  <span className="loading-text">
                    <span className="spinner"></span>
                    Analyse...
                  </span>
                ) : (
                  'Analyser cette image'
                )}
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="remove-button"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="input-hint">
        Analysez un lien ou une capture d'écran pour vérifier sa fiabilité
      </p>
    </div>
  );
}

export default LinkInput;
