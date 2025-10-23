# Cascade System Documentation

The cascade system is responsible for handling the chain reactions that occur when gems are matched in the game. It manages the complex flow of match detection, gravity simulation, animation coordination, and recursive processing.

## 🏗️ Architecture Overview

The cascade system is built with a modular architecture that separates concerns and makes the code easier to understand, test, and maintain:

```
cascade/
├── types.ts                 # TypeScript interfaces and type definitions
├── boardTransformations.ts  # Board state transformation utilities
├── cascadeSteps.ts          # Individual step processors
├── cascadeOrchestrator.ts   # Main coordination logic
├── index.ts                 # Public API exports
└── README.md               # This documentation
```

## 🔄 Cascade Flow

The cascade system processes matches through several distinct phases:

### 1. Match Detection Phase
- Finds connected gems of the same color
- Marks matched gems for animation
- Starts sparkle effects (500ms duration)

### 2. Gravity Operations Phase
- Removes matched gems from the board
- Applies gravity to make remaining gems fall
- Fills empty spaces with new gems

### 3. Gravity Match Check Phase
- Checks if falling gems created new matches
- Uses special board version that ignores 'isNew' markers
- Recursively processes gravity matches if found

### 4. New Gem Animation Phase
- Shows falling animation for newly generated gems
- Uses staggered timing (100ms delay per row)
- Total duration: 800ms + stagger delays

### 5. Final Match Check Phase
- Checks if new gems created matches
- Recursively processes new gem matches if found
- Completes cascade if no matches remain

## 📁 File Breakdown

### `types.ts`
Contains all TypeScript interfaces and type definitions used throughout the cascade system:

- `CascadeStep`: The three types of cascade steps ('initial', 'gravity', 'newGems')
- `CascadeConfig`: Configuration object with board update functions
- `CascadeContext`: Context passed through cascade operations
- `BoardTransformation`: Result of board transformation operations
- `AnimationPhase`: Animation configuration and callbacks

### `boardTransformations.ts`
Utilities for creating different versions of the board for different purposes:

- `createMatchedGemsBoard()`: Marks gems for disappearing animation
- `createCleanBoard()`: Strips animation states for gravity operations
- `createGravityCheckBoard()`: Ignores 'isNew' markers for match detection
- `createFallingGemsBoard()`: Sets falling animation for new gems
- `createFinalBoard()`: Resets all gems to normal state
- `extractNewGemPositions()`: Finds positions of new gems for animation

### `cascadeSteps.ts`
Individual processors for each phase of the cascade:

- `processMatchPhase()`: Handles match detection and sparkle animation
- `processGravityPhase()`: Manages gravity operations (remove, fall, fill)
- `processGravityMatchCheck()`: Checks for gravity-created matches
- `processNewGemAnimation()`: Handles falling animation for new gems
- `processFinalMatchCheck()`: Checks for new gem matches

### `cascadeOrchestrator.ts`
Main coordination logic that manages the overall cascade flow:

- `orchestrateCascade()`: Main orchestrator function
- `startCascade()`: Simplified entry point for Game.tsx
- `validateCascadePrerequisites()`: Validates inputs before processing

## 🚀 Usage

### Basic Usage in Game.tsx

```typescript
import { startCascade, validateCascadePrerequisites } from './gameMechanics/cascade';

// In your game component
const initiateCascade = (board: Gem[][], step: CascadeStep) => {
  const config: GeneratorConfig = { gridSize, numColors, minMoves };
  
  if (!validateCascadePrerequisites(board, step)) {
    console.error('Cascade prerequisites not met');
    return;
  }
  
  startCascade(
    board,                    // Current board state
    step,                     // 'initial', 'gravity', or 'newGems'
    setBoard,                 // Function to update board state
    setIsProcessingCascade,   // Function to update processing flag
    config                    // Generator configuration
  );
};
```

### Advanced Usage with Individual Steps

```typescript
import { 
  processMatchPhase, 
  processGravityPhase,
  CascadeContext 
} from './gameMechanics/cascade';

// Create context
const context: CascadeContext = {
  currentBoard: board,
  step: 'initial',
  config: cascadeConfig
};

// Process individual steps
const matchResult = await processMatchPhase(context);
if (matchResult.shouldContinue) {
  const gravityResult = processGravityPhase({
    ...context,
    currentBoard: matchResult.nextBoard!,
    matches: await getMatches(matchResult.nextBoard!)
  });
}
```

## 🎯 Key Benefits

### 1. **Separation of Concerns**
Each file has a single, clear responsibility:
- Types define data contracts
- Transformations handle board state changes
- Steps handle individual phases
- Orchestrator coordinates the flow

### 2. **Testability**
Each function can be tested independently:
```typescript
// Test individual transformations
const result = createMatchedGemsBoard(testBoard, testMatches);
expect(result.board[0][0].isMatched).toBe(true);

// Test individual steps
const stepResult = await processMatchPhase(testContext);
expect(stepResult.shouldContinue).toBe(true);
```

### 3. **Maintainability**
- Clear function names and documentation
- Extensive logging for debugging
- Type safety throughout
- Modular structure allows easy modifications

### 4. **Readability**
- Each function does one thing well
- Clear data flow through the system
- Comprehensive comments explaining the "why"
- Logical organization of related functionality

## 🔧 Debugging

The cascade system includes extensive logging to help with debugging:

```
🎭 Starting cascade orchestration for step: initial
   Board size: 8x8
🔍 Processing match phase for step: initial
   Found 4 matched gems: ["2-3", "2-4", "3-3", "3-4"]
   🎯 red component: 4 gems at positions: ["2-3", "2-4", "3-3", "3-4"]
🎨 Creating board with matched gems marked for animation
✨ Match animation complete - proceeding to gravity phase
⬇️ Processing gravity phase
   Removing 4 matched gems and applying physics
🧹 Creating clean board for gravity operations
   💥 Matched gems removed - holes created
   ⬇️ Gravity applied - existing gems fell down
   ✨ Holes filled with new gems
⚖️ Checking for matches created by gravity
   Found 0 gravity-created matches
✅ No gravity matches - proceeding to new gem animation
🍃 Processing new gem falling animation
   Board with 4 new gems set to falling animation
🏁 Falling animation complete
🎯 Checking for matches created by new gems
   Found 0 new gem matches
✅ No new gem matches - cascade complete
🎉 Cascade orchestration complete - all phases finished
```

## 🧪 Testing

The modular structure makes testing straightforward:

```typescript
// Test board transformations
describe('Board Transformations', () => {
  it('should mark matched gems correctly', () => {
    const result = createMatchedGemsBoard(testBoard, new Set(['0-0', '0-1']));
    expect(result.board[0][0].isMatched).toBe(true);
    expect(result.board[0][1].isMatched).toBe(true);
    expect(result.board[1][0].isMatched).toBe(false);
  });
});

// Test cascade steps
describe('Cascade Steps', () => {
  it('should detect matches correctly', async () => {
    const result = await processMatchPhase(testContext);
    expect(result.shouldContinue).toBe(true);
  });
});
```

## 🔮 Future Enhancements

The modular structure makes it easy to add new features:

1. **Special Effects**: Add new animation types by extending `AnimationPhase`
2. **Power-ups**: Add special gem processing in transformation functions
3. **Scoring**: Add score calculation in step processors
4. **Analytics**: Add performance tracking in the orchestrator
5. **Multiplayer**: Add network synchronization points between steps

## 🤝 Contributing

When modifying the cascade system:

1. **Keep functions pure** when possible (no side effects)
2. **Add comprehensive logging** for debugging
3. **Update type definitions** when changing data structures
4. **Write tests** for new functionality
5. **Update documentation** when changing behavior

The cascade system is designed to be maintainable and extensible. Each component has a clear purpose and well-defined interfaces, making it easy to understand and modify.