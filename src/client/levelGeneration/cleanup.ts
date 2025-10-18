import { Gem } from './hydration';
import { COLOR_MAP } from './types';
import { hasInitialMatches } from './validation';

// Convert Gem board back to schema for validation
const boardToSchema = (board: Gem[][]): string[][] => {
  const colorToLetter: { [key: string]: string } = {};
  Object.entries(COLOR_MAP).forEach(([letter, color]) => {
    colorToLetter[color] = letter;
  });

  return board.map((row) => row.map((gem) => colorToLetter[gem.color] || 'A'));
};

// Clean up any gray gems that appear after hydration
export const cleanupGrayGems = (board: Gem[][], numColors: number): Gem[][] => {
  console.log('🧹 Starting gray gem cleanup...');

  let cleanBoard = board.map((row) => row.map((gem) => ({ ...gem })));
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    attempts++;

    // Find all gray gems
    const grayGems: { row: number; col: number }[] = [];
    for (let row = 0; row < cleanBoard.length; row++) {
      const currentRow = cleanBoard[row];
      if (!currentRow) continue;
      for (let col = 0; col < currentRow.length; col++) {
        const gem = currentRow[col];
        if (gem && gem.color === 'gray') {
          grayGems.push({ row, col });
        }
      }
    }

    if (grayGems.length === 0) {
      console.log(`✅ No gray gems found after ${attempts} cleanup attempts`);
      return cleanBoard;
    }

    console.log(`🔄 Cleanup attempt ${attempts}: Found ${grayGems.length} gray gems`);

    // Replace each gray gem with a random color
    const colorLetters = Object.keys(COLOR_MAP).slice(0, numColors);
    grayGems.forEach(({ row, col }) => {
      const randomColorIndex = Math.floor(Math.random() * numColors);
      const colorLetter = colorLetters[randomColorIndex];
      if (colorLetter) {
        const newColor = COLOR_MAP[colorLetter] || 'red';
        const targetRow = cleanBoard[row];
        if (targetRow && targetRow[col]) {
          targetRow[col].color = newColor;
          console.log(`🎨 Replaced gray gem at (${row},${col}) with ${newColor}`);
        }
      }
    });

    // Convert to schema and validate
    const schema = boardToSchema(cleanBoard);
    const hasMatches = hasInitialMatches(schema);

    if (!hasMatches) {
      console.log(`✅ Gray cleanup successful after ${attempts} attempts`);
      return cleanBoard;
    }

    console.log(`❌ Cleanup attempt ${attempts} still has matches, retrying...`);
  }

  console.warn(`⚠️ Gray cleanup failed after ${maxAttempts} attempts, regenerating entire board`);
  throw new Error('Gray cleanup failed'); // Signal to regenerate entire board
};
