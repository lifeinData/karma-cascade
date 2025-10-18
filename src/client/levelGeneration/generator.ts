import { BoardSchema, GeneratorConfig, COLOR_MAP } from './types';
import { hasInitialMatches, hasMinimumMoves } from './validation';
import { hydrateBoard, type Gem } from './hydration';
import {
  generateOptimizedBoard,
  generatePatternBasedBoard,
  generateBacktrackingBoard,
} from './optimizedGenerator';

// Generate a random schema without validation
const generateRandomSchema = (gridSize: number, numColors: number): BoardSchema => {
  const schema: BoardSchema = [];
  const colorLetters = Object.keys(COLOR_MAP).slice(0, numColors);

  for (let row = 0; row < gridSize; row++) {
    const schemaRow: string[] = [];
    for (let col = 0; col < gridSize; col++) {
      const randomColorIndex = Math.floor(Math.random() * numColors);
      schemaRow.push(colorLetters[randomColorIndex] || 'A');
    }
    schema.push(schemaRow);
  }

  return schema;
};

// Core generator function - main orchestrator with optimized algorithms
export const generateValidBoard = (config: GeneratorConfig): Gem[][] => {
  const { gridSize, numColors, minMoves } = config;

  console.log(
    `🏗️ Generating board: ${gridSize}x${gridSize}, ${numColors} colors, ${minMoves} min moves`
  );

  const startTime = performance.now();

  // Try optimized approaches in order of speed vs reliability
  const approaches = [
    { name: 'Pattern-Based', fn: generatePatternBasedBoard },
    { name: 'Constraint-Based', fn: generateOptimizedBoard },
    { name: 'Backtracking', fn: generateBacktrackingBoard },
    {
      name: 'Random (Fallback)',
      fn: (config: GeneratorConfig) => generateRandomSchema(config.gridSize, config.numColors),
    },
  ];

  for (const approach of approaches) {
    console.log(`🚀 Trying ${approach.name} generation...`);
    const attemptStart = performance.now();

    try {
      const schema = approach.fn(config);

      // Quick validation
      const hasMatches = hasInitialMatches(schema);
      console.log(`🔍 ${approach.name}: Initial matches = ${hasMatches}`);

      if (!hasMatches) {
        const hasEnoughMoves = hasMinimumMoves(schema, minMoves);
        console.log(`🎯 ${approach.name}: Minimum moves (${minMoves}) = ${hasEnoughMoves}`);

        if (hasEnoughMoves) {
          const attemptTime = performance.now() - attemptStart;
          console.log(`✅ ${approach.name} succeeded in ${attemptTime.toFixed(2)}ms`);

          // Hydrate and cleanup
          try {
            const hydratedBoard = hydrateBoard(schema, numColors);
            const totalTime = performance.now() - startTime;
            console.log(`✅ Board generation complete in ${totalTime.toFixed(2)}ms total`);
            return hydratedBoard;
          } catch (error) {
            console.log(
              `❌ Hydration cleanup failed for ${approach.name}, trying next approach...`
            );
            continue;
          }
        }
      }

      const attemptTime = performance.now() - attemptStart;
      console.log(
        `❌ ${approach.name} failed validation in ${attemptTime.toFixed(2)}ms, trying next approach...`
      );
    } catch (error) {
      console.log(`❌ ${approach.name} threw error:`, error);
      continue;
    }
  }

  // If all optimized approaches fail, fall back to original random generation
  console.warn(`⚠️ All optimized approaches failed, falling back to original random generation`);
  return generateValidBoardOriginal(config);
};

// Original random generation as fallback
const generateValidBoardOriginal = (config: GeneratorConfig): Gem[][] => {
  const { gridSize, numColors, minMoves } = config;
  const maxAttempts = 100; // Reduced for fallback
  let attempts = 0;

  do {
    attempts++;
    const schema = generateRandomSchema(gridSize, numColors);

    if (!hasInitialMatches(schema) && hasMinimumMoves(schema, minMoves)) {
      try {
        return hydrateBoard(schema, numColors);
      } catch (error) {
        continue;
      }
    }

    if (attempts >= maxAttempts) {
      attempts = 0; // Reset and try again
    }
  } while (true);
};
