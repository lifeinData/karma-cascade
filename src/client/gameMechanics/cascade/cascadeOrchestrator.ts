/**
 * Cascade Orchestrator
 * 
 * This is the main controller for the cascade system. It coordinates the
 * different phases of cascade processing and manages the overall flow.
 * 
 * The orchestrator replaces the complex processStepByCascade function with
 * a cleaner, more maintainable approach using separate step processors.
 */

import { Gem } from '../../levelGeneration';
import { CascadeStep, CascadeConfig, CascadeContext } from './types';
import { 
  processMatchPhase, 
  processGravityPhase, 
  processGravityMatchCheck,
  processNewGemAnimation,
  processFinalMatchCheck
} from './cascadeSteps';

/**
 * Main cascade orchestrator function
 * 
 * This function replaces the original processStepByCascade and provides
 * a cleaner, more maintainable approach to cascade processing.
 * 
 * @param board - Current board state
 * @param step - Type of cascade step to process
 * @param config - Configuration for cascade operations
 */
export async function orchestrateCascade(
  board: Gem[][], 
  step: CascadeStep, 
  config: CascadeConfig
): Promise<void> {
  console.log(`🎭 Starting cascade orchestration for step: ${step}`);
  console.log(`   Board size: ${board.length}x${board[0]?.length || 0}`);
  
  // Create the context object that will be passed through all steps
  const context: CascadeContext = {
    currentBoard: board,
    step,
    config
  };

  try {
    // Phase 1: Match Detection and Animation
    const matchResult = await processMatchPhase(context);
    
    if (!matchResult.shouldContinue) {
      // No matches found - cascade is complete
      console.log('🏁 Cascade orchestration complete - no matches found');
      config.setIsProcessingCascade(false);
      return;
    }

    // Update context with match information
    const matchContext = {
      ...context,
      currentBoard: matchResult.nextBoard!,
      matches: await getMatchesFromBoard(matchResult.nextBoard!)
    };

    // Phase 2: Gravity Operations
    console.log('⚙️ Proceeding to gravity operations');
    const gravityResult = processGravityPhase(matchContext);
    
    if (!gravityResult.shouldContinue) {
      console.log('❌ Gravity phase failed');
      config.setIsProcessingCascade(false);
      return;
    }

    // Phase 3: Gravity Match Check
    console.log('🔍 Checking for gravity-created matches');
    const gravityCheckContext = {
      ...context,
      currentBoard: gravityResult.nextBoard!
    };
    
    const gravityCheckResult = await processGravityMatchCheck(gravityCheckContext);
    
    if (gravityCheckResult.nextStep === 'gravity') {
      // Gravity created matches - recursively process gravity step
      console.log('🔄 Recursively processing gravity matches');
      await orchestrateCascade(gravityCheckResult.nextBoard!, 'gravity', config);
      return;
    }

    // Phase 4: New Gem Animation
    console.log('🎬 Starting new gem animation phase');
    const animationContext = {
      ...context,
      currentBoard: gravityCheckResult.nextBoard!
    };
    
    const animationResult = await processNewGemAnimation(animationContext);
    
    if (!animationResult.shouldContinue) {
      console.log('❌ Animation phase failed');
      config.setIsProcessingCascade(false);
      return;
    }

    // Phase 5: Final Match Check
    console.log('🎯 Final match check phase');
    const finalCheckContext = {
      ...context,
      currentBoard: animationResult.nextBoard!
    };
    
    const finalResult = await processFinalMatchCheck(finalCheckContext);
    
    if (finalResult.shouldContinue && finalResult.nextStep === 'newGems') {
      // New gems created matches - recursively process newGems step
      console.log('🔄 Recursively processing new gem matches');
      await orchestrateCascade(finalResult.nextBoard!, 'newGems', config);
      return;
    }

    // Cascade is complete
    console.log('🎉 Cascade orchestration complete - all phases finished');
    config.setIsProcessingCascade(false);

  } catch (error) {
    console.error('💥 Error during cascade orchestration:', error);
    config.setIsProcessingCascade(false);
    throw error;
  }
}

/**
 * Helper function to extract matches from a board
 * This is used to get match information for context passing
 */
async function getMatchesFromBoard(board: Gem[][]): Promise<Set<string>> {
  const { findGemMatches } = await import('../../levelGeneration/matchDetection');
  const result = findGemMatches(board);
  return result.matches;
}

/**
 * Simplified cascade starter function
 * 
 * This is the main entry point that should be called from Game.tsx
 * It provides a clean interface for starting cascade processing.
 * 
 * @param board - Current board state
 * @param step - Type of cascade step ('initial', 'gravity', or 'newGems')
 * @param setBoard - Function to update board state
 * @param setIsProcessingCascade - Function to update processing flag
 * @param generatorConfig - Configuration for board generation
 */
export function startCascade(
  board: Gem[][],
  step: CascadeStep,
  setBoard: (board: Gem[][]) => void,
  setIsProcessingCascade: (processing: boolean) => void,
  generatorConfig: any
): void {
  console.log(`🚀 Starting cascade system with step: ${step}`);
  
  const config: CascadeConfig = {
    generatorConfig,
    setBoard,
    setIsProcessingCascade
  };

  // Start the cascade orchestration
  orchestrateCascade(board, step, config).catch((error) => {
    console.error('💥 Cascade system error:', error);
    setIsProcessingCascade(false);
  });
}

/**
 * Utility function to validate cascade prerequisites
 * 
 * This function checks if the cascade system can safely start processing
 * with the given parameters.
 * 
 * @param board - Board to validate
 * @param step - Step to validate
 * @returns Whether the cascade can proceed
 */
export function validateCascadePrerequisites(board: Gem[][], step: CascadeStep): boolean {
  // Check if board is valid
  if (!board || board.length === 0 || !board[0] || board[0].length === 0) {
    console.error('❌ Invalid board for cascade processing');
    return false;
  }

  // Check if step is valid
  if (!['initial', 'gravity', 'newGems'].includes(step)) {
    console.error('❌ Invalid cascade step:', step);
    return false;
  }

  // Check if all gems have required properties
  const hasInvalidGems = board.some(row => 
    row.some(gem => 
      !gem.id || !gem.color || gem.row === undefined || gem.col === undefined
    )
  );

  if (hasInvalidGems) {
    console.error('❌ Board contains gems with missing required properties');
    return false;
  }

  console.log('✅ Cascade prerequisites validated');
  return true;
}