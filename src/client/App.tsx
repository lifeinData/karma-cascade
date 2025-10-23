import { useState, useEffect } from 'react';
import BlitzGame from './Game';
import { loadAsset, ASSET_PATHS } from './support/assetUtils';

export const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [blitzImageUrl, setBlitzImageUrl] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Load the blitz button asset and get its dimensions
  useEffect(() => {
    const loadBlitzAsset = async () => {
      try {
        const imageUrl = await loadAsset(ASSET_PATHS.BLITZ_BUTTON);
        setBlitzImageUrl(imageUrl);

        // Create an image element to get natural dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
          setImageLoaded(true);
        };
        img.src = imageUrl;
      } catch (error) {
        console.error('Failed to load blitz button asset:', error);
        // Fallback dimensions if image fails to load
        setImageDimensions({ width: 300, height: 100 });
        setImageLoaded(true);
      }
    };

    loadBlitzAsset();
  }, []);

  const startBlitzMode = () => {
    setGameStarted(true);
  };

  if (gameStarted) {
    return <BlitzGame />;
  }

  return (
    <div className="app-container">
      <div className="start-screen">
        {/* Header Section */}
        <header className="game-header">
          <h1 className="game-title">KARMA CASCADE</h1>
          <p className="game-subtitle">Match gems to create cascading combos!</p>
        </header>

        {/* Main Content Section */}
        <main className="game-main">
          <div className="button-container">
            <button
              className={`blitz-button ${imageLoaded ? 'image-loaded' : 'loading'}`}
              onClick={startBlitzMode}
              style={{
                backgroundImage: blitzImageUrl ? `url(${blitzImageUrl})` : 'none',
                aspectRatio:
                  imageDimensions.width && imageDimensions.height
                    ? `${imageDimensions.width} / ${imageDimensions.height}`
                    : '3 / 1',
              }}
              aria-label="Start Blitz Mode"
            >
              {!blitzImageUrl && <span className="button-text">BLITZ MODE</span>}
            </button>

            {/* Loading indicator */}
            {!imageLoaded && (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
                <span>Loading...</span>
              </div>
            )}
          </div>
        </main>

        {/* Footer Section */}
        <footer className="game-footer">
          <p className="game-hint">Tap to start your cascade adventure!</p>
        </footer>
      </div>
    </div>
  );
};
