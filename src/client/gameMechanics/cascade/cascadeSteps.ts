/**
 * Cascade Step Processors
 * 
 * This module contains the individual step processors that handle each phase
 * of the cascade system. Each step is responsible for a specific part of the
 * cascade logic and can be tested and understood independently.
 */

import { findGemMatches } from '../../levelGeneration/matchDetection';
import { removeMatchedGems, applyGravity, fillTopHoles } from '../../gameLogic';
import { animationManager } from '../../animations/AnimationManager';
import { CascadeContext, CascadeStepResult, AnimationPhase } from './types';
import { 
  createMatchedGemsBoard, 
  createCleanBoard, 
  createGravityCheckBoard,
  createFallingGemsBoard,
  createFinalBoard,
  extractNewGemPositions
} from './boardTransformations';

/**
 * Processes the match detection and animation phase
 * 
 * This is the first step in any cascade iteration. It:
 * 1. Finds matches in the current board
 * 2. If matches exist, marks them for animation and starts the sparkle effect
 * 3. If no matches, signals cascade completion
 * 
 * @param context - Current cascade context
 * @returns Promise that resolves when this step is complete
 */
export async function processMatchPhase(context: CascadeContext): Promise<CascadeStepResult> {
  const { currentBoard, step, config } = context;
  
  console.log(`🔍 Processing match phase for step: ${step}`);
  
  // Find matches in the current board state
  const matches = findGemMatches(currentBoard);
  console.log(`   Found ${matches.matches.size} matched gems:`, 
    matches.matches.size > 0 ? Array.from(matches.matches) : 'None');

  // Log detailed match information for debugging
  matches.components.forEach((component) => {
    console.log(`   🎯 ${component.color} component: ${component.size} gems at positions:`,
      component.positions.map(pos => `${pos.row}-${pos.col}`));
  });

  if (matches.matches.size === 0) {
    // No matches found - cascade is complete
    console.log('✅ No matches found - cascade complete');
    return {
      shouldContinue: false,
      error: undefined
    };
  }

  // Create board with matched gems marked for animation
  const matchedBoard = createMatchedGemsBoard(currentBoard, matches.matches);
  config.setBoard(matchedBoard.board);
  console.log(`   ${matchedBoard.description}`);

  // Start the sparkle animation and wait for it to complete
  return new Promise((resolve) => {
    const animationPhase: AnimationPhase = {
      type: 'match',
      animationData: matches.matches,
      expectedDuration: 500,
      onComplete: () => {
        console.log('✨ Match animation complete - proceeding to gravity phase');
        resolve({
          shouldContinue: true,
          nextStep: step, // Stay in the same step, move to gravity phase
          nextBoard: currentBoard // Use original board for gravity operations
        });
      }
    };

    // Start the sparkle animation
    animationManager.startMatchAnimation(matches.matches, animationPhase.onComplete);
  });
}

/**
 * Processes the gravity operations phase
 * 
 * This step handles the physical simulation of gems falling:
 * 1. Removes matched gems from the board
 * 2. Applies gravity to make remaining gems fall
 * 3. Fills empty spaces with new gems
 * 4. Creates different board versions for different purposes
 * 
 * @param context - Current cascade context with matches
 * @returns The result of gravity operations
 */
export function processGravityPhase(context: CascadeContext): CascadeStepResult {
  const { currentBoard, config } = context;
  const matches = context.matches!; // We know matches exist at this point
  
  console.log('⬇️ Processing gravity phase');
  console.log(`   Removing ${matches.size} matched gems and applying physics`);

  // Step 1: Create a clean board for gravity operations
  const cleanBoardResult = createCleanBoard(currentBoard);
  console.log(`   ${cleanBoardResult.description}`);

  // Step 2: Remove matched gems (creates holes)
  const boardAfterRemoval = removeMatchedGems(cleanBoardResult.board, matches);
  console.log('   💥 Matched gems removed - holes created');

  // Step 3: Apply gravity (existing gems fall down)
  const boardAfterGravity = applyGravity(boardAfterRemoval);
  console.log('   ⬇️ Gravity applied - existing gems fell down');

  // Step 4: Fill holes with new gems
  const completeBoard = fillTopHoles(boardAfterGravity, config.generatorConfig);
  console.log('   ✨ Holes filled with new gems');

  return {
    shouldContinue: true,
    nextStep: context.step,
    nextBoard: completeBoard
  };
}

/**
 * Processes the gravity match check phase
 * 
 * After gravity operations, we need to check if the falling gems created
 * new matches. This uses a special board version that ignores 'isNew' markers.
 * 
 * @param context - Context with board after gravity operations
 * @returns Result indicating whether gravity matches were found
 */
export async function processGravityMatchCheck(context: CascadeContext): Promise<CascadeStepResult> {
  const { currentBoard, step, config } = context;
  
  console.log('⚖️ Checking for matches created by gravity');

  // Create a special board for gravity match detection
  const gravityCheckResult = createGravityCheckBoard(currentBoard);
  config.setBoard(gravityCheckResult.board);
  console.log(`   ${gravityCheckResult.description}`);

  // Wait a brief moment for visual smoothness
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check for matches in the gravity board
      const gravityMatches = findGemMatches(gravityCheckResult.board);
      console.log(`   Found ${gravityMatches.matches.size} gravity-created matches`);

      if (gravityMatches.matches.size > 0) {
        // Gravity created new matches - continue cascade with gravity step
        console.log('🔄 Gravity created matches - continuing cascade');
        resolve({
          shouldContinue: true,
          nextStep: 'gravity',
          nextBoard: gravityCheckResult.board
        });
      } else {
        // No gravity matches - proceed to new gem animation
        console.log('✅ No gravity matches - proceeding to new gem animation');
        resolve({
          shouldContinue: true,
          nextStep: step, // Continue with current step logic
          nextBoard: currentBoard // Use the complete board with new gems
        });
      }
    }, 100); // Brief delay for visual smoothness
  });
}

/**
 * Processes the new gem animation phase
 * 
 * This step handles the falling animation for newly generated gems:
 * 1. Creates a board with falling animation states
 * 2. Starts the falling animation with staggered timing
 * 3. Waits for animation to complete
 * 
 * @param context - Context with board containing new gems
 * @returns Promise that resolves when falling animation is complete
 */
export async function processNewGemAnimation(context: CascadeContext): Promise<CascadeStepResult> {
  const { currentBoard, config } = context;
  
  console.log('🍃 Processing new gem falling animation');

  // Extract positions of new gems
  const newGemPositions = extractNewGemPositions(currentBoard);
  
  if (newGemPositions.length === 0) {
    console.log('   No new gems to animate - skipping animation phase');
    return {
      shouldContinue: true,
      nextStep: context.step,
      nextBoard: currentBoard
    };
  }

  // Create board with falling animation states
  const fallingBoard = createFallingGemsBoard(currentBoard);
  config.setBoard(fallingBoard.board);
  console.log(`   ${fallingBoard.description}`);

  // Start falling animation and wait for completion
  return new Promise((resolve) => {
    const animationPhase: AnimationPhase = {
      type: 'gravity',
      animationData: newGemPositions,
      expectedDuration: 800 + (Math.max(...newGemPositions.map(pos => pos.row)) * 100),
      onComplete: () => {
        console.log('🏁 Falling animation complete');
        resolve({
          shouldContinue: true,
          nextStep: context.step,
          nextBoard: currentBoard
        });
      }
    };

    animationManager.startGravityAnimation(newGemPositions, animationPhase.onComplete);
  });
}

/**
 * Processes the final match check phase
 * 
 * After new gems have fallen and settled, we check if they created any
 * new matches. This determines whether the cascade continues or completes.
 * 
 * @param context - Context with settled board
 * @returns Result indicating whether new gem matches were found
 */
export async function processFinalMatchCheck(context: CascadeContext): Promise<CascadeStepResult> {
  const { currentBoard, config } = context;
  
  console.log('🎯 Checking for matches created by new gems');

  // Create final board with all gems in normal state
  const finalBoardResult = createFinalBoard(currentBoard);
  config.setBoard(finalBoardResult.board);
  console.log(`   ${finalBoardResult.description}`);

  // Wait a brief moment for visual smoothness
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check for matches in the final board
      const newGemMatches = findGemMatches(finalBoardResult.board);
      console.log(`   Found ${newGemMatches.matches.size} new gem matches`);

      if (newGemMatches.matches.size > 0) {
        // New gems created matches - continue cascade with newGems step
        console.log('🔄 New gems created matches - continuing cascade');
        resolve({
          shouldContinue: true,
          nextStep: 'newGems',
          nextBoard: finalBoardResult.board
        });
      } else {
        // No new gem matches - cascade is complete
        console.log('✅ No new gem matches - cascade complete');
        resolve({
          shouldContinue: false
        });
      }
    }, 100); // Brief delay for visual smoothness
  });
}