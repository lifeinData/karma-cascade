/**
 * Cascade System - Main Export
 * 
 * This file provides the main exports for the cascade system, making it easy
 * to import and use the cascade functionality from other parts of the application.
 * 
 * The cascade system is responsible for handling the chain reactions that occur
 * when gems are matched, including gravity simulation, new gem generation,
 * and recursive match detection.
 */

// Main orchestrator functions
export { 
  orchestrateCascade, 
  startCascade, 
  validateCascadePrerequisites 
} from './cascadeOrchestrator';

// Individual step processors (for testing or custom flows)
export {
  processMatchPhase,
  processGravityPhase,
  processGravityMatchCheck,
  processNewGemAnimation,
  processFinalMatchCheck
} from './cascadeSteps';

// Board transformation utilities
export {
  createMatchedGemsBoard,
  createCleanBoard,
  createGravityCheckBoard,
  createFallingGemsBoard,
  createFinalBoard,
  extractNewGemPositions
} from './boardTransformations';

// Type definitions
export type {
  CascadeStep,
  CascadeConfig,
  CascadeStepResult,
  CascadeContext,
  BoardTransformation,
  AnimationPhase
} from './types';

/**
 * Quick Start Guide for the Cascade System
 * 
 * To use the cascade system in your game:
 * 
 * 1. Import the main function:
 *    import { startCascade } from './gameMechanics/cascade';
 * 
 * 2. Call it when you need to process a cascade:
 *    startCascade(
 *      board,                    // Current board state
 *      'initial',               // Step type: 'initial', 'gravity', or 'newGems'
 *      setBoard,                // Function to update board state
 *      setIsProcessingCascade,  // Function to update processing flag
 *      generatorConfig          // Board generation configuration
 *    );
 * 
 * 3. The system will automatically:
 *    - Find and animate matches
 *    - Apply gravity and fill holes
 *    - Check for new matches recursively
 *    - Update your board state through the provided functions
 *    - Set the processing flag to false when complete
 * 
 * The system is fully async and handles all timing and animation coordination
 * internally, so you don't need to worry about managing the complex state
 * transitions manually.
 */