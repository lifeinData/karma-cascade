/**
 * Asset utility functions for loading and managing game assets
 */

/**
 * Loads an asset by importing it directly (for build-time assets)
 * @param assetPath - The path to the asset relative to the assets folder
 * @returns Promise resolving to the asset URL
 */
export const loadAsset = async (assetPath: string): Promise<string> => {
  try {
    // Use explicit imports for known assets to avoid Vite warnings
    switch (assetPath) {
      case 'start_blitz.png':
        const blitzAsset = await import('../assets/start_blitz.png');
        return blitzAsset.default;
      default:
        throw new Error(`Unknown asset: ${assetPath}`);
    }
  } catch (error) {
    console.error(`Failed to load asset: ${assetPath}`, error);
    throw new Error(`Asset not found: ${assetPath}`);
  }
};

/**
 * Preloads multiple assets for better performance
 * @param assetPaths - Array of asset paths to preload
 * @returns Promise resolving to an object with asset URLs
 */
export const preloadAssets = async (assetPaths: string[]): Promise<Record<string, string>> => {
  const assets: Record<string, string> = {};
  
  await Promise.all(
    assetPaths.map(async (path) => {
      try {
        const assetUrl = await loadAsset(path);
        // Use filename without extension as key
        const key = path.split('/').pop()?.split('.')[0] || path;
        assets[key] = assetUrl;
      } catch (error) {
        console.warn(`Failed to preload asset: ${path}`, error);
      }
    })
  );
  
  return assets;
};

/**
 * Asset paths used in the game
 */
export const ASSET_PATHS = {
  BLITZ_BUTTON: 'start_blitz.png',
} as const;