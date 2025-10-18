import { Gem, GeneratorConfig } from './levelGeneration';
import { COLOR_MAP } from './levelGeneration/types';
import { findGemMatches } from './levelGeneration/matchDetection';

/**
 * Task 1: Remove matched gems completely (no grey)
 * Takes a board and a set of matched gem keys. Returns a new board where 
 * matched gems are replaced with null placeholders.
 */
export const removeMatchedGems = (board: Gem[][], matches: Set<string>): (Gem | null)[][] => {
  console.log('🗑️ Removing matched gems:', Array.from(matches));
  
  const newBoard: (Gem | null)[][] = board.map(row => 
    row.map(gem => ({ ...gem }))
  );

  // Replace matched gems with null (they disappear completely)
  matches.forEach(matchKey => {
    const parts = matchKey.split('-');
    const row = Number(parts[0]);
    const col = Number(parts[1]);
    
    if (!isNaN(row) && !isNaN(col) && newBoard[row] && newBoard[row][col]) {
      console.log(`  💥 Removing gem at (${row}, ${col})`);
      newBoard[row][col] = null;
    }
  });

  return newBoard;
};

/**
 * Task 2: Apply gravity to existing gems
 * For each column, move existing gems down to fill holes
 */
export const applyGravity = (board: (Gem | null)[][]): (Gem | null)[][] => {
  console.log('⬇️ Applying gravity to existing gems');
  
  const gridSize = board.length;
  const newBoard: (Gem | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

  // Process each column independently
  for (let col = 0; col < gridSize; col++) {
    // Collect all non-null gems in this column (from top to bottom)
    const existingGems: Gem[] = [];
    
    for (let row = 0; row < gridSize; row++) {
      const boardRow = board[row];
      if (!boardRow) continue;
      
      const gem = boardRow[col];
      if (gem !== null && gem !== undefined) {
        existingGems.push({ ...gem });
      }
    }

    console.log(`  📊 Column ${col}: ${existingGems.length} gems falling down`);

    // Place existing gems at the bottom (they fall down due to gravity)
    existingGems.forEach((gem, index) => {
      const newRow = gridSize - existingGems.length + index;
      const targetRow = newBoard[newRow];
      if (targetRow) {
        targetRow[col] = {
          ...gem,
          row: newRow,
          col: col
        };
        console.log(`    ⬇️ Gem moved from row ${gem.row} to row ${newRow}`);
      }
    });
  }

  return newBoard;
};

/**
 * Task 3: Fill top holes with new gems
 * Generate new random gems to fill empty spaces at the top
 */
export const fillTopHoles = (board: (Gem | null)[][], config: GeneratorConfig): Gem[][] => {
  console.log('✨ Filling top holes with new gems');
  
  const { gridSize, numColors } = config;
  const newBoard: Gem[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  const colorLetters = Object.keys(COLOR_MAP).slice(0, numColors);

  // Copy existing gems and fill holes
  for (let col = 0; col < gridSize; col++) {
    // Count holes at the top
    let holesAtTop = 0;
    for (let row = 0; row < gridSize; row++) {
      const boardRow = board[row];
      if (!boardRow || boardRow[col] === null || boardRow[col] === undefined) {
        holesAtTop++;
      } else {
        break; // Stop counting when we hit the first non-null gem
      }
    }

    console.log(`  🕳️ Column ${col}: ${holesAtTop} holes at top`);

    // Fill holes at top with new gems (marked as new for animation)
    for (let row = 0; row < holesAtTop; row++) {
      const randomColorIndex = Math.floor(Math.random() * numColors);
      const colorLetter = colorLetters[randomColorIndex];
      if (!colorLetter) continue;
      
      const newColor = COLOR_MAP[colorLetter] || 'red';
      
      const newGem: Gem = {
        id: crypto.randomUUID(),
        color: newColor,
        row: row,
        col: col,
        isNew: true, // Mark as new for falling animation
        animationState: 'falling'
      };
      
      const targetRow = newBoard[row];
      if (targetRow) {
        targetRow[col] = newGem;
        console.log(`    ✨ New ${newColor} gem at (${row}, ${col})`);
      }
    }

    // Copy existing gems (reset animation states)
    for (let row = holesAtTop; row < gridSize; row++) {
      const boardRow = board[row];
      if (boardRow) {
        const gem = boardRow[col];
        if (gem) {
          const targetRow = newBoard[row];
          if (targetRow) {
            targetRow[col] = { 
              ...gem, 
              isNew: false,
              isMatched: false,
              animationState: 'normal'
            };
          }
        }
      }
    }
  }

  return newBoard;
};

/**
 * Task 4-6: Complete gravity cascade loop
 * Handles the full cascade: remove matches → gravity → fill holes → repeat until stable
 */
export const processGravityCascade = (initialBoard: Gem[][], config: GeneratorConfig): Gem[][] => {
  console.log('🌊 Starting gravity cascade');
  
  let currentBoard = initialBoard;
  let cascadeStep = 0;
  
  while (true) {
    cascadeStep++;
    console.log(`\n🔄 Cascade step ${cascadeStep}`);
    
    // Check for matches
    const matchResult = findGemMatches(currentBoard);
    const matches = matchResult.matches;
    
    if (matches.size === 0) {
      console.log('✅ No more matches - cascade complete!');
      break;
    }
    
    console.log(`🎯 Found ${matches.size} matches:`, Array.from(matches));
    
    // Task 1: Remove matched gems
    const boardAfterRemoval = removeMatchedGems(currentBoard, matches);
    
    // Task 2: Apply gravity
    const boardAfterGravity = applyGravity(boardAfterRemoval);
    
    // Task 3: Fill top holes
    const boardAfterFill = fillTopHoles(boardAfterGravity, config);
    
    currentBoard = boardAfterFill;
    
    // Log the result of this cascade step
    console.log('📋 Board after cascade step:');
    console.table(currentBoard.map(row => row.map(gem => gem.color)));
  }
  
  console.log(`🎉 Gravity cascade completed in ${cascadeStep} steps`);
  return currentBoard;
};