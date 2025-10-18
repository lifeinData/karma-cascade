import { BoardSchema } from './types';
import { hasMatches, wouldCreateMatches as wouldCreateMatchesUnified } from './matchDetection';

// Validation helper: Check for initial matches of 3 or more using connected components
export const hasInitialMatches = (schema: BoardSchema): boolean => {
  console.log('🔍 Checking for initial connected component matches in schema:');
  // Log the schema for debugging
  schema.forEach((row, i) => {
    console.log(`Row ${i}: ${row.join(' ')}`);
  });

  const foundMatches = hasMatches(schema);
  
  if (foundMatches) {
    console.log('❌ Found connected component matches in schema');
  } else {
    console.log('✅ No initial connected component matches found in schema');
  }
  
  return foundMatches;
};

// Helper: Check if a position would create matches in the schema using unified system
export const wouldCreateMatches = (schema: BoardSchema, row: number, col: number): boolean => {
  return wouldCreateMatchesUnified(schema, row, col);
};

// Validation helper: Check if schema has minimum number of possible moves
export const hasMinimumMoves = (schema: BoardSchema, minMoves: number): boolean => {
  const gridSize = schema.length;
  if (gridSize === 0) return false;
  let moveCount = 0;

  console.log(`🔍 Checking for minimum ${minMoves} moves...`);

  // Check all possible adjacent swaps
  for (let row = 0; row < gridSize; row++) {
    const currentRow = schema[row];
    if (!currentRow) continue;
    for (let col = 0; col < gridSize; col++) {
      // Check right neighbor
      if (col < gridSize - 1 && currentRow[col] && currentRow[col + 1]) {
        // Create temporary swap
        const tempSchema = schema.map((r) => [...r]);
        const tempRow = tempSchema[row];
        if (!tempRow) continue;

        const tempCurrentValue = tempRow[col];
        const tempNextValue = tempRow[col + 1];
        if (!tempCurrentValue || !tempNextValue) continue;

        tempRow[col] = tempNextValue;
        tempRow[col + 1] = tempCurrentValue;

        // Check if this swap creates matches
        if (
          wouldCreateMatches(tempSchema, row, col) ||
          wouldCreateMatches(tempSchema, row, col + 1)
        ) {
          moveCount++;
          console.log(
            `✅ Found valid move ${moveCount}: swap (${row},${col}) ↔ (${row},${col + 1})`
          );
          if (moveCount >= minMoves) {
            return true; // Early exit - found enough moves
          }
        }
      }

      // Check bottom neighbor
      if (row < gridSize - 1 && currentRow[col]) {
        const nextRow = schema[row + 1];
        if (nextRow && nextRow[col]) {
          // Create temporary swap
          const tempSchema = schema.map((r) => [...r]);
          const tempCurrentRow = tempSchema[row];
          const tempNextRow = tempSchema[row + 1];
          if (!tempCurrentRow || !tempNextRow) continue;

          const tempCurrentValue = tempCurrentRow[col];
          const tempNextValue = tempNextRow[col];
          if (!tempCurrentValue || !tempNextValue) continue;

          tempCurrentRow[col] = tempNextValue;
          tempNextRow[col] = tempCurrentValue;

          // Check if this swap creates matches
          if (
            wouldCreateMatches(tempSchema, row, col) ||
            wouldCreateMatches(tempSchema, row + 1, col)
          ) {
            moveCount++;
            console.log(
              `✅ Found valid move ${moveCount}: swap (${row},${col}) ↔ (${row + 1},${col})`
            );
            if (moveCount >= minMoves) {
              return true; // Early exit - found enough moves
            }
          }
        }
      }
    }
  }

  console.log(`❌ Only found ${moveCount} moves, need ${minMoves}`);
  return false; // Not enough moves found
};
