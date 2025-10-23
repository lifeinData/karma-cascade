/**
 * Type definitions for the cascade system
 * 
 * This file contains all the TypeScript interfaces and types used throughout
 * the cascade system to ensure type safety and clear data contracts.
 */

import { Gem, GeneratorConfig } from '../../levelGeneration';

/**
 * The three phases of cascade processing
 * 
 * - 'initial': First cascade triggered by player move
 * - 'gravity': Cascade triggered by gems falling due to gravity
 * - 'newGems': Cascade triggered by new gems added to fill holes
 */
export type CascadeStep = 'initial' | 'gravity' | 'newGems';

/**
 * Configuration for cascade processing
 * Contains all the settings needed for the cascade system to operate
 */
export interface CascadeConfig {
  /** Board generation configuration (grid size, colors, etc.) */
  generatorConfig: GeneratorConfig;
  
  /** Function to update the board state in React */
  setBoard: (board: Gem[][]) => void;
  
  /** Function to update the cascade processing flag */
  setIsProcessingCascade: (processing: boolean) => void;
}

/**
 * Result of a cascade step processing
 * Contains information about what happened during the cascade step
 */
export interface CascadeStepResult {
  /** Whether the cascade should continue (more matches found) */
  shouldContinue: boolean;
  
  /** The step that should be processed next (if continuing) */
  nextStep?: CascadeStep;
  
  /** The board state to use for the next step (if continuing) */
  nextBoard?: Gem[][];
  
  /** Any error that occurred during processing */
  error?: string;
}

/**
 * Context object passed through cascade operations
 * Contains all the data and functions needed for cascade processing
 */
export interface CascadeContext {
  /** Current board state being processed */
  currentBoard: Gem[][];
  
  /** Current step in the cascade process */
  step: CascadeStep;
  
  /** Configuration for cascade operations */
  config: CascadeConfig;
  
  /** Set of matched gem positions (if any) */
  matches?: Set<string>;
}

/**
 * Board transformation result
 * Used when creating different versions of the board for different purposes
 */
export interface BoardTransformation {
  /** The transformed board */
  board: Gem[][];
  
  /** Description of what transformation was applied */
  description: string;
  
  /** Any metadata about the transformation */
  metadata?: Record<string, any>;
}

/**
 * Animation phase configuration
 * Defines what animation should be played and what happens after
 */
export interface AnimationPhase {
  /** Type of animation to play */
  type: 'match' | 'gravity';
  
  /** Data needed for the animation */
  animationData: any;
  
  /** Callback to execute when animation completes */
  onComplete: () => void;
  
  /** Expected duration of the animation (for debugging) */
  expectedDuration?: number;
}