import { BoardSchema, COLOR_MAP } from './types';
import { cleanupGrayGems } from './cleanup';

// Gem interface for React components
export interface Gem {
  id: string;
  color: string;
  row: number;
  col: number;
}

// Hydration function: Convert schema to full React state
export const hydrateBoard = (schema: BoardSchema, numColors: number): Gem[][] => {
  console.log('💧 Hydrating schema to full board state');

  const hydratedBoard: Gem[][] = [];

  for (let row = 0; row < schema.length; row++) {
    const boardRow: Gem[] = [];
    const schemaRow = schema[row];
    if (!schemaRow) continue;
    
    for (let col = 0; col < schemaRow.length; col++) {
      const schemaColor = schemaRow[col];
      if (!schemaColor) continue;
      
      const actualColor = COLOR_MAP[schemaColor] || 'red'; // Fallback to red

      const gem: Gem = {
        id: crypto.randomUUID(),
        color: actualColor,
        row: row,
        col: col,
      };

      boardRow.push(gem);
    }
    hydratedBoard.push(boardRow);
  }

  console.log('✅ Board hydration complete');
  console.log(`📏 Board dimensions: ${hydratedBoard.length}x${hydratedBoard[0]?.length || 0}`);
  
  // Clean up any gray gems that might appear
  try {
    const cleanBoard = cleanupGrayGems(hydratedBoard, numColors);
    return cleanBoard;
  } catch (error) {
    console.log('🔄 Cleanup failed, need to regenerate board');
    throw error; // Re-throw to signal regeneration needed
  }
};