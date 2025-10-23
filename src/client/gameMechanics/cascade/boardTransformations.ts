/**
 * Board Transformation Utilities
 * 
 * This module handles creating different versions of the board for different
 * phases of the cascade process. Each transformation serves a specific purpose
 * in the cascade logic.
 */

import { Gem } from '../../levelGeneration';
import { BoardTransformation } from './types';

/**
 * Creates a board with matched gems marked for disappearing animation
 * 
 * This transformation is used at the start of each cascade step to visually
 * indicate which gems are about to be removed.
 * 
 * @param board - The current board state
 * @param matches - Set of position keys for matched gems (e.g., "2-3")
 * @returns Board with matched gems marked as disappearing
 */
export function createMatchedGemsBoard(board: Gem[][], matches: Set<string>): BoardTransformation {
  console.log('🎨 Creating board with matched gems marked for animation');
  
  const transformedBoard = board.map((row) =>
    row.map((gem) => {
      const gemKey = `${gem.row}-${gem.col}`;
      
      if (matches.has(gemKey)) {
        // Mark this gem as matched and set it to disappearing animation
        return { 
          ...gem, 
          isMatched: true, 
          animationState: 'disappearing' as const 
        };
      } else {
        // Reset other gems to normal state
        return { 
          ...gem, 
          isMatched: false, 
          animationState: 'normal' as const 
        };
      }
    })
  );

  return {
    board: transformedBoard,
    description: `Board with ${matches.size} gems marked for disappearing animation`,
    metadata: {
      matchedPositions: Array.from(matches),
      matchCount: matches.size
    }
  };
}

/**
 * Creates a clean board for gravity operations
 * 
 * This removes all animation states and extra properties, keeping only
 * the essential gem data needed for gravity calculations.
 * 
 * @param board - The current board state
 * @returns Simplified board with only essential properties
 */
export function createCleanBoard(board: Gem[][]): BoardTransformation {
  console.log('🧹 Creating clean board for gravity operations');
  
  const cleanBoard = board.map((row) =>
    row.map((gem) => ({
      id: gem.id,
      color: gem.color,
      row: gem.row,
      col: gem.col
      // Note: Deliberately excluding isNew, isMatched, animationState
      // These will be added back later as needed
    }))
  );

  return {
    board: cleanBoard,
    description: 'Clean board with only essential gem properties',
    metadata: {
      removedProperties: ['isNew', 'isMatched', 'animationState']
    }
  };
}

/**
 * Creates a gravity check board
 * 
 * This board is used specifically for detecting matches after gravity has been applied.
 * It ignores the 'isNew' markers on gems because we want to detect matches among
 * ALL gems, not just the existing ones.
 * 
 * @param board - Board after gravity and hole filling
 * @returns Board optimized for gravity match detection
 */
export function createGravityCheckBoard(board: Gem[][]): BoardTransformation {
  console.log('⚖️ Creating gravity check board (ignoring new gem markers)');
  
  const gravityCheckBoard = board.map((row) =>
    row.map((gem) => ({
      ...gem,
      isNew: false,        // Critical: ignore new gem markers for match detection
      isMatched: false,    // Reset match state
      animationState: 'normal' as const  // Reset animation state
    }))
  );

  return {
    board: gravityCheckBoard,
    description: 'Board for gravity match detection with isNew markers ignored',
    metadata: {
      purpose: 'gravity-match-detection',
      isNewMarkersIgnored: true
    }
  };
}

/**
 * Creates a board with falling animation states for new gems
 * 
 * This board is used to show the falling animation for newly generated gems
 * while keeping existing gems in their normal state.
 * 
 * @param board - Board with new gems marked
 * @returns Board with appropriate animation states for falling effect
 */
export function createFallingGemsBoard(board: Gem[][]): BoardTransformation {
  console.log('🍃 Creating board with falling animation for new gems');
  
  const fallingBoard = board.map((row) =>
    row.map((gem) => ({
      ...gem,
      // New gems get falling animation, existing gems stay normal
      animationState: gem.isNew ? ('falling' as const) : ('normal' as const)
    }))
  );

  // Count how many gems will be falling
  const fallingGemCount = board.flat().filter(gem => gem.isNew).length;

  return {
    board: fallingBoard,
    description: `Board with ${fallingGemCount} new gems set to falling animation`,
    metadata: {
      fallingGemCount,
      animationDuration: '800ms + stagger delays'
    }
  };
}

/**
 * Creates the final board state after all animations complete
 * 
 * This resets all gems to their normal state, clearing animation flags
 * and preparing the board for the next potential cascade or player input.
 * 
 * @param board - Board after all gravity operations
 * @returns Board with all gems in normal, stable state
 */
export function createFinalBoard(board: Gem[][]): BoardTransformation {
  console.log('🏁 Creating final board with all gems in normal state');
  
  const finalBoard = board.map((row) =>
    row.map((gem) => ({
      ...gem,
      isNew: false,                    // Clear new gem markers
      isMatched: false,                // Clear match markers
      animationState: 'normal' as const  // Reset to normal animation state
    }))
  );

  return {
    board: finalBoard,
    description: 'Final board with all gems in stable, normal state',
    metadata: {
      totalGems: finalBoard.flat().length,
      allGemsNormal: true
    }
  };
}

/**
 * Extracts positions of new gems for animation purposes
 * 
 * This utility function finds all the new gems in the board and returns
 * their positions for use in animation systems.
 * 
 * @param board - Board containing new gems
 * @returns Array of positions where new gems are located
 */
export function extractNewGemPositions(board: Gem[][]): Array<{ row: number; col: number }> {
  console.log('📍 Extracting positions of new gems for animation');
  
  const newGemPositions = board.flatMap((row, rowIndex) =>
    row
      .map((gem, colIndex) => (gem.isNew ? { row: rowIndex, col: colIndex } : null))
      .filter((pos) => pos !== null)
  ) as Array<{ row: number; col: number }>;

  console.log(`   Found ${newGemPositions.length} new gems at positions:`, newGemPositions);
  
  return newGemPositions;
}