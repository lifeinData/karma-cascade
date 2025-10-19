import { useState, useEffect } from 'react';
import Game from './Game';
import { loadAsset, ASSET_PATHS } from './support/assetUtils';

export const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [blitzImageUrl, setBlitzImageUrl] = useState<string>('');

  // Load the blitz button asset
  useEffect(() => {
    const loadBlitzAsset = async () => {
      try {
        const imageUrl = await loadAsset(ASSET_PATHS.BLITZ_BUTTON);
        setBlitzImageUrl(imageUrl);
      } catch (error) {
        console.error('Failed to load blitz button asset:', error);
      }
    };

    loadBlitzAsset();
  }, []);

  const startBlitzMode = () => {
    setGameStarted(true);
  };

  if (gameStarted) {
    return <Game />;
  }

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="game-title">KARMA CASCADE</h1>
        <p className="game-subtitle">Match gems to create cascading combos!</p>

        <button
          className="blitz-button"
          onClick={startBlitzMode}
          style={{
            backgroundImage: blitzImageUrl ? `url(${blitzImageUrl})` : 'none',
          }}
        >
          {!blitzImageUrl && 'BLITZ MODE'}
        </button>
      </div>
    </div>
  );
};
