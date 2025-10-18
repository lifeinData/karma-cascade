// Main exports for level generation
export { generateValidBoard } from './generator';
export { generateOptimizedBoard, generatePatternBasedBoard, generateBacktrackingBoard } from './optimizedGenerator';
export { findGemMatches, findSchemaMatches, hasMatches, wouldCreateMatches } from './matchDetection';
export type { BoardSchema, GeneratorConfig } from './types';
export type { Gem } from './hydration';
export type { Position, MatchResult } from './matchDetection';