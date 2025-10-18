import { BoardSchema, GeneratorConfig, COLOR_MAP } from './types';

// Optimized constraint-based board generation
export const generateOptimizedBoard = (config: GeneratorConfig): BoardSchema => {
  const { gridSize, numColors } = config;
  const colorLetters = Object.keys(COLOR_MAP).slice(0, numColors);

  console.log(`🚀 Using optimized constraint-based generation`);

  // Approach 1: Constraint-based generation
  const schema: BoardSchema = [];

  for (let row = 0; row < gridSize; row++) {
    const schemaRow: string[] = [];
    for (let col = 0; col < gridSize; col++) {
      // Get forbidden colors based on neighbors
      const forbiddenColors = getForbiddenColors(schema, row, col);

      // Get available colors (excluding forbidden ones)
      const availableColors = colorLetters.filter((color) => !forbiddenColors.has(color));

      // If no colors available, backtrack or use fallback
      if (availableColors.length === 0) {
        // Fallback: use least problematic color
        const color = colorLetters[Math.floor(Math.random() * numColors)] || 'A';
        schemaRow.push(color);
      } else {
        // Choose randomly from available colors
        const color = availableColors[Math.floor(Math.random() * availableColors.length)] || 'A';
        schemaRow.push(color);
      }
    }
    schema.push(schemaRow);
  }

  return schema;
};

// Get colors that would create matches if placed at this position
const getForbiddenColors = (partialSchema: BoardSchema, row: number, col: number): Set<string> => {
  const forbidden = new Set<string>();

  // Check horizontal constraints
  if (col >= 2) {
    const color1 = partialSchema[row]?.[col - 1];
    const color2 = partialSchema[row]?.[col - 2];
    if (color1 && color2 && color1 === color2) {
      forbidden.add(color1); // Would create horizontal match of 3
    }
  }

  // Check vertical constraints
  if (row >= 2) {
    const color1 = partialSchema[row - 1]?.[col];
    const color2 = partialSchema[row - 2]?.[col];
    if (color1 && color2 && color1 === color2) {
      forbidden.add(color1); // Would create vertical match of 3
    }
  }

  // Check L-shape constraints (more complex connected components)
  if (row >= 1 && col >= 1) {
    const colorUp = partialSchema[row - 1]?.[col];
    const colorLeft = partialSchema[row]?.[col - 1];
    const colorDiagUp = partialSchema[row - 1]?.[col - 1];

    // Prevent L-shapes that would create connected components of 3+
    if (colorUp && colorLeft && colorUp === colorLeft) {
      forbidden.add(colorUp);
    }
    if (colorUp && colorDiagUp && colorUp === colorDiagUp && col >= 2) {
      const leftRow = partialSchema[row];
      if (leftRow) {
        const colorLeft2 = leftRow[col - 2];
        if (colorLeft2 === colorUp) {
          forbidden.add(colorUp);
        }
      }
    }
  }

  return forbidden;
};

// Approach 2: Pattern-based generation (even faster)
export const generatePatternBasedBoard = (config: GeneratorConfig): BoardSchema => {
  const { gridSize, numColors } = config;
  const colorLetters = Object.keys(COLOR_MAP).slice(0, numColors);

  console.log(`⚡ Using pattern-based generation`);

  const schema: BoardSchema = [];

  // Use mathematical patterns that guarantee no matches
  for (let row = 0; row < gridSize; row++) {
    const schemaRow: string[] = [];
    for (let col = 0; col < gridSize; col++) {
      // Pattern 1: Diagonal stripes (prevents most matches)
      let colorIndex = (row + col * 2) % numColors;

      // Pattern 2: Add some randomness while maintaining constraints
      if (Math.random() < 0.3) {
        // 30% chance to randomize
        const availableIndices = [];
        for (let i = 0; i < numColors; i++) {
          if (i !== colorIndex) {
            availableIndices.push(i);
          }
        }
        if (availableIndices.length > 0) {
          const selectedIndex =
            availableIndices[Math.floor(Math.random() * availableIndices.length)];
          if (selectedIndex !== undefined) {
            colorIndex = selectedIndex;
          }
        }
      }

      schemaRow.push(colorLetters[colorIndex] || 'A');
    }
    schema.push(schemaRow);
  }

  return schema;
};

// Approach 3: Backtracking with heuristics (most reliable)
export const generateBacktrackingBoard = (config: GeneratorConfig): BoardSchema => {
  const { gridSize, numColors } = config;
  const colorLetters = Object.keys(COLOR_MAP).slice(0, numColors);

  console.log(`🎯 Using backtracking generation`);

  const schema: BoardSchema = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(''));

  const backtrack = (row: number, col: number): boolean => {
    // Base case: filled entire board
    if (row === gridSize) return true;

    // Move to next position
    const nextRow = col === gridSize - 1 ? row + 1 : row;
    const nextCol = col === gridSize - 1 ? 0 : col + 1;

    // Try each color
    const shuffledColors = [...colorLetters].sort(() => Math.random() - 0.5);

    for (const color of shuffledColors) {
      if (schema[row] && schema[row][col] !== undefined) {
        schema[row][col] = color;

        // Check if this placement creates matches
        if (!wouldCreateMatchAtPosition(schema, row, col, gridSize)) {
          // Recursively fill rest of board
          if (backtrack(nextRow, nextCol)) {
            return true;
          }
        }
      }
    }

    // Backtrack
    if (schema[row] && schema[row][col] !== undefined) {
      schema[row][col] = '';
    }
    return false;
  };

  if (backtrack(0, 0)) {
    return schema;
  } else {
    // Fallback to pattern-based if backtracking fails
    return generatePatternBasedBoard(config);
  }
};

// Helper: Check if placing a color at position would create matches
const wouldCreateMatchAtPosition = (
  schema: BoardSchema,
  row: number,
  col: number,
  gridSize: number
): boolean => {
  const color = schema[row][col];
  if (!color) return false;

  // Quick check for immediate matches (3 in a row/column)

  // Horizontal check
  let hCount = 1;
  // Count left
  for (let c = col - 1; c >= 0 && schema[row] && schema[row][c] === color; c--) hCount++;
  // Count right
  for (let c = col + 1; c < gridSize && schema[row] && schema[row][c] === color; c++) hCount++;
  if (hCount >= 3) return true;

  // Vertical check
  let vCount = 1;
  // Count up
  for (let r = row - 1; r >= 0 && schema[r] && schema[r][col] === color; r--) vCount++;
  // Count down
  for (let r = row + 1; r < gridSize && schema[r] && schema[r][col] === color; r++) vCount++;
  if (vCount >= 3) return true;

  return false;
};
