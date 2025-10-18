## Karma Cascade - Advanced Bejeweled Game for Reddit

A sophisticated match-3 puzzle game with an intelligent level generator, revolutionary gravity cascade system, and stunning visual effects, built with React and designed for Reddit's Devvit platform. This game brings classic gem-matching gameplay directly to Reddit, featuring strategic gem swapping, advanced board generation, realistic physics simulation, animated sparkle effects, and smooth visual feedback - all playable without leaving your favorite social platform.

### What This Game Is

Karma Cascade is a modern implementation of the classic Bejeweled match-3 puzzle game, designed specifically for Reddit's social gaming ecosystem. Players interact with fully customizable grids of colorful gems (red, blue, green, yellow, purple, orange, cyan), strategically swapping adjacent pieces to create matches of three or more identical gems using an advanced **connected component matching system**. 

Unlike traditional match-3 games that only detect straight lines, Karma Cascade uses sophisticated flood-fill algorithms to find connected groups of identical gems in any shape - including L-shapes, T-shapes, and irregular clusters. When matches are formed, the gems **completely disappear** with dazzling sparkle effects, triggering a realistic **step-by-step gravity cascade system** where:

1. **Matched gems explode with golden sparkles** (5 animated particles per gem with radial gradients) and disappear completely using `gem-disappear-with-sparkles` animation
2. **Remaining gems fall down smoothly** with cubic-bezier physics curves (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`) to fill empty spaces naturally
3. **New gems appear at the top** and fall with staggered timing (100ms delay per row) using `gravity-fall` animation with realistic physics
4. **System checks for new matches** created by fallen or new gems using connected component detection
5. **Cascade continues automatically** until the board reaches a stable state with no matches, coordinated by the centralized AnimationManager

The game features an intuitive two-click interaction system: first click selects a gem (highlighted with bright yellow border, glow effects, and 1.1x scaling), second click attempts to swap with an adjacent gem. Only moves that create valid matches are accepted, ensuring strategic gameplay that rewards planning and pattern recognition. The revolutionary multi-algorithm level generator creates perfectly balanced boards with real-time configurable parameters - ensuring no initial matches while mathematically guaranteeing a minimum number of possible moves.

Built with modern React architecture, the game uses a clean component hierarchy (App → Game → Board → Gem → MatchEffects) with full TypeScript integration and a sophisticated centralized AnimationManager singleton. The responsive absolute positioning layout automatically adapts to any board size from 3x3 to 15x15, with smooth CSS animations and visual effects providing consistent gameplay across all devices.

### What Makes This Game Innovative

**🧠 Revolutionary Match Detection System**
- **Connected Component Matching**: Uses advanced flood-fill algorithms to detect matches in any connected shape (L-shapes, T-shapes, clusters) - not just straight lines like traditional match-3 games
- **Complete Gem Disappearance**: Matched gems completely vanish from the board (no gray placeholders), creating realistic empty spaces for gravity physics
- **Generic Color Extraction**: Unified match detection system works with both string schemas (for generation) and full Gem objects (for gameplay) using polymorphic color extractors

**⚡ Revolutionary Step-by-Step Gravity Cascade System**
- **Realistic Physics Simulation**: When gems are matched and removed, remaining gems fall down due to gravity, filling empty spaces naturally with smooth cubic-bezier animations
- **Automatic Refill Mechanism**: New random gems appear at the top to fill holes left by falling gems, maintaining full board coverage with staggered falling animations
- **Infinite Cascade Logic**: The system continues processing gravity → new gems → match detection → removal until the board reaches a stable state with no matches
- **Coordinated Animation System**: Centralized AnimationManager coordinates match sparkles (0.5s), gravity falling (0.8s), and cascade timing with proper callback handling
- **Step-by-Step Processing**: Each cascade step (initial/gravity/newGems) is processed individually with visual feedback and proper state management to prevent loops

**🎯 Multi-Algorithm Level Generator**
- **Four-Tier Generation System**: Pattern-Based (fastest), Constraint-Based (efficient), Backtracking (most reliable), Random Fallback - automatically selects optimal approach
- **Mathematical Playability Guarantee**: Every board ensures no initial matches while guaranteeing your specified minimum number of possible moves
- **Three-Phase Pipeline**: Lightweight schema generation → validation → hydration to React state → automatic cleanup with retry fallback
- **Constraint-Based Prevention**: Intelligent forbidden color detection prevents matches during generation rather than fixing them afterward

**🎮 Advanced Game Mechanics & Visual Effects**
- **Strategic Move Validation**: Only swaps that create connected component matches are accepted - encourages planning over random clicking
- **Cascading Chain Reactions**: Single moves can trigger multiple cascade steps, creating satisfying chain reactions and combo opportunities
- **Live Parameter Control**: Real-time adjustment of grid size (3-15), colors (2-7), and minimum moves (1-20) with instant regeneration
- **Intelligent Selection System**: Click to select with visual feedback, click adjacent to swap, click same gem to deselect, click distant gem to reselect
- **Dazzling Match Effects**: Matched gems explode with 5 animated sparkle particles featuring golden radial gradients (`#fff` to `#ffeb3b`) with staggered timing (0-150ms delays) before disappearing completely
- **Smooth Gravity Animations**: New gems fall from above with realistic `cubic-bezier(0.25, 0.46, 0.45, 0.94)` physics curves and row-based staggered timing (100ms delay per row)
- **Centralized Animation System**: AnimationManager singleton coordinates match sparkles (0.5s duration), gravity falling (0.8s + stagger), and cascade timing with proper callback handling and state management
- **Advanced CSS Keyframes**: Sophisticated animations including `gravity-fall`, `gem-disappear-with-sparkles`, `sparkle-burst`, and cascade delay classes (`gem-cascade-delay-1` through `gem-cascade-delay-5`)
- **Cascade Loop Prevention**: Advanced state management prevents infinite loops with `isProcessingCascade` flag and step-by-step processing (initial → gravity → newGems)

**🏗️ Modern Technical Architecture**
- **Type-Safe Development**: Full TypeScript integration with proper interfaces for all game components and level generation systems
- **Decoupled Game Logic**: Step-by-Step gravity cascade system separated from UI rendering for optimal performance and maintainability
- **Component-Based Design**: Clean React hierarchy (`App.tsx` → `Game.tsx` → `Board.tsx` → `Gem.tsx` + `MatchEffects.tsx`) with proper separation of concerns
- **Advanced Animation System**: Centralized `AnimationManager.ts` singleton coordinates gem falling, sparkle effects, and cascade timing with callback management and state tracking
- **Responsive Absolute Positioning**: Dynamic layout with absolute positioning for smooth animations and touch-optimized 40x40px gems (defined in `constants.ts`)
- **CSS Animation Integration**: Sophisticated keyframe animations (`gravity-fall`, `gem-disappear-with-sparkles`, `sparkle-burst`) with cubic-bezier timing functions for realistic physics simulation
- **Modular Styling**: Separate CSS files (`animations/animations.css`, `animations/matchEffects.css`, `index.css`) for core animations, match effects, and responsive design with Tailwind CSS integration
- **Mobile-First Design**: HTML viewport configuration with `user-scalable=no` for touch controls and full-height responsive layout (`class="h-full"`)
- **Entry Point Architecture**: `main.tsx` bootstraps React with StrictMode and imports all CSS files for complete styling system

**📱 Reddit-Native Experience**
- **Seamless Integration**: Built specifically for Reddit's Devvit platform - plays directly in posts without external apps or downloads
- **Cross-Platform Optimization**: Mobile-first responsive design that works perfectly on desktop and mobile browsers
- **Developer-Friendly Debugging**: Extensive console logging for board generation, move validation, match detection, and gravity cascades
- **Social Gaming Ready**: Designed for Reddit's social ecosystem with potential for leaderboards and community features

### Current Implementation Status

**✅ Completed Core Game Features:**
- **Dynamic Game Board**: Fully configurable grid sizes from 3x3 to 15x15 with responsive absolute positioning layout that adapts to any screen size
- **Advanced Level Generator**: High-performance procedural generation with real-time configurable parameters and mathematical validation guarantees
- **Multi-Color Gem System**: Complete support for 2-7 different gem colors (red, blue, green, yellow, purple, orange, cyan) with dynamic color mapping - now defaults to 7 colors for enhanced gameplay complexity
- **Live Generator Testing UI**: Real-time controls for grid size, color count, and minimum moves with instant regeneration and parameter persistence
- **Modern Component Architecture**: Clean React structure (App → Game → Board → Gem → MatchEffects) with full TypeScript integration and proper prop interfaces
- **Cross-Platform Responsive Design**: Mobile-optimized layout with touch-friendly 40x40px gems that scales perfectly across all device sizes
- **Intuitive Gem Selection System**: Click-to-select gems with comprehensive visual highlighting, yellow borders, glow effects, and scaling feedback
- **Smart Gem Deselection**: Click the same gem again to deselect it, or click any other gem to transfer selection seamlessly
- **Comprehensive Click Handling**: Advanced event handling and state management for all player interactions with proper validation
- **Rich Visual Feedback System**: Selected gems show bright yellow 3px borders, glow shadows, 1.1x scaling, plus 1.05x hover effects on all gems
- **Adjacent Gem Swapping**: Complete swap mechanics for neighboring gems (horizontal/vertical only) with instant color swapping
- **Revolutionary Connected Component Matching**: Advanced flood-fill algorithm detecting matches in any connected shape (L-shapes, T-shapes, clusters) - not just straight lines
- **Strategic Move Validation**: Only valid moves that create connected component matches are accepted - invalid moves rejected with immediate console feedback
- **Complete Step-by-Step Gravity Cascade System**: Matched gems disappear completely → remaining gems fall down → new gems fill top holes → cascade continues until stable
- **Infinite Cascade Logic**: Automatic chain reactions where falling gems and new gems can create additional matches, continuing until board stabilizes with proper loop prevention
- **Dazzling Visual Effects**: Matched gems explode with 5 animated golden sparkle particles (radial gradients, staggered timing 0-150ms) before disappearing completely
- **Smooth Animation System**: Centralized AnimationManager singleton coordinates match sparkles (0.5s), gem falling animations (0.8s + row-based stagger), and cascade timing with realistic physics curves
- **Complete Bejeweled Game Loop**: Fully playable mechanics from board generation → selection → swapping → matching → sparkle effects → step-by-step gravity cascade → refill → stabilization

**✅ Advanced Technical Features:**
- **Revolutionary Multi-Algorithm Generation Pipeline**: Four distinct generation approaches (Pattern-Based, Constraint-Based, Backtracking, Random Fallback) in `optimizedGenerator.ts` with automatic algorithm selection for optimal performance and reliability
- **Performance-Optimized Validation**: Early-exit algorithms in `validation.ts` - `hasInitialMatches` stops on first match found, `hasMinimumMoves` returns as soon as minimum count reached
- **Mathematical Playability Guarantee**: Every generated board mathematically ensures no initial matches while guaranteeing your specified minimum possible moves through `generator.ts` orchestration
- **Advanced Step-by-Step Gravity Physics Engine**: Coordinated cascade system in `gameLogic.ts` (Remove → Gravity → Fill → Check → Repeat → Stabilize) with complete gem disappearance and realistic falling mechanics
- **Comprehensive Debug Logging**: Detailed console output tracking board generation, algorithm selection, gem selections, swap attempts, match validation, step-by-step gravity cascades, and complete board state changes
- **Intelligent Fallback System**: Advanced error handling with automatic algorithm fallback - if one approach fails, automatically tries the next most reliable method with retry logic
- **Three-Phase Board Processing**: Lightweight schema generation → validation → hydration (`hydration.ts`) → cleanup (`cleanup.ts`) with automatic retry on any phase failure
- **Centralized Animation Management**: `AnimationManager.ts` singleton coordinates all visual effects, timing, and callbacks for seamless user experience with proper cascade loop prevention
- **Advanced Visual Effects System**: 5 golden sparkle particles per gem in `MatchEffects.tsx` with radial gradients (`#fff` to `#ffeb3b`), staggered timing (0-150ms delays), and burst animations
- **Smooth Physics Animations**: Realistic gravity curves using `cubic-bezier(0.25, 0.46, 0.45, 0.94)` timing functions for natural gem falling motion with row-based staggered delays (100ms per row)
- **CSS Keyframe Integration**: Sophisticated animation system in `animations.css` and `matchEffects.css` with `gravity-fall`, `gem-disappear-with-sparkles`, `sparkle-burst`, and cascade delay keyframes
- **Type-Safe Development**: Full TypeScript integration with proper interfaces for `Gem`, `BoardSchema`, `GeneratorConfig`, `AnimationState`, step-by-step gravity cascade functions, and all component props

**🔧 Current Technical Status:**
- **Core Gameplay**: 100% functional and playable with all major Bejeweled features plus advanced step-by-step gravity cascade system and visual effects fully implemented and tested
- **Gravity Physics**: Complete step-by-step gravity cascade system with gem removal (`removeMatchedGems`), falling mechanics (`applyGravity`), top refill (`fillTopHoles`), and infinite cascade loops until board stabilization with proper loop prevention (`isProcessingCascade` flag)
- **Visual Effects**: Fully implemented 5-particle sparkle system with golden burst animations, smooth gem falling with physics curves, and coordinated timing via `AnimationManager` singleton
- **Animation System**: Centralized `AnimationManager.ts` singleton handles all visual effects, match sparkles (0.5s), gravity animations (0.8s + stagger), and cascade coordination with callback management and state tracking
- **Performance**: Highly optimized for boards up to 15x15 with efficient validation algorithms, early-exit optimizations, and fast step-by-step cascade processing
- **Cross-Platform**: Responsive design works perfectly on desktop and mobile with touch-optimized controls (`user-scalable=no`) and smooth animations using absolute positioning
- **Default Configuration**: Defaults to 10x10 grid, 7 colors, 5 minimum moves for enhanced gameplay complexity with satisfying cascade opportunities
- **TypeScript Integration**: Full type safety with comprehensive interfaces for all game logic (`Gem`, `BoardSchema`, `GeneratorConfig`, `AnimationState`), step-by-step gravity system, and component interactions

**🚧 Future Enhancement Opportunities:**
- **Scoring System**: Point tracking with cascade multipliers, combo bonuses, and high score persistence
- **Power-Up System**: Special gems (bombs, line clearers, color changers) and combo effects that integrate with gravity system
- **Audio Experience**: Sound effects for selections, swaps, matches, cascades, sparkle effects, and background music
- **Social Features**: Reddit user leaderboards, achievements, cascade records, and community challenges
- **Enhanced Visual Polish**: Additional particle effects, gem explosion trails, screen shake effects, and enhanced sparkle variations
- **Advanced Animation States**: Gem bouncing on landing, chain reaction highlighting, and combo celebration effects

### Current Game Architecture

**Component Structure:**
- **App.tsx**: Main application wrapper with Tailwind CSS flexbox layout (`flex relative flex-col justify-center items-center min-h-screen gap-4`) and full-height responsive design
- **Game.tsx**: Core game logic, state management, step-by-step cascade coordination, and live level generator controls with comprehensive logging and `isProcessingCascade` state management
- **Board.tsx**: Dynamic absolute positioning layout that adapts to any board size (3x3 to 15x15) with `MatchEffects` overlay and responsive styling using calculated `gridSize * GEM_SIZE_PX` dimensions
- **Gem.tsx**: Individual gem components with click handling, hover effects, selection feedback, and `AnimationManager` integration for animation state coordination
- **MatchEffects.tsx**: Sparkle particle system that renders 5 golden burst animations per matched gem with radial gradients and absolute positioning

**Advanced Level Generation System:**
- **generator.ts**: Multi-algorithm orchestrator (`generateValidBoard`) with automatic fallback system for guaranteed perfect boards
- **optimizedGenerator.ts**: Three specialized generation algorithms (`generatePatternBasedBoard`, `generateOptimizedBoard`, `generateBacktrackingBoard`)
- **matchDetection.ts**: Unified connected component detection system (`findConnectedComponents`, `findGemMatches`, `findSchemaMatches`) for both schema validation and gameplay matching
- **validation.ts**: Early-exit algorithms (`hasInitialMatches`, `hasMinimumMoves`) for connected component match detection and move counting
- **hydration.ts**: Converts lightweight schemas to full React state (`hydrateBoard`) with automatic cleanup integration and `Gem` interface definition
- **cleanup.ts**: Gray gem cleanup system (`cleanupGrayGems`) with retry logic and fallback to regeneration
- **types.ts**: TypeScript interfaces (`BoardSchema`, `GeneratorConfig`), color mapping (`COLOR_MAP`), and generator configuration definitions
- **index.ts**: Main exports barrel file for clean imports across the application

**Step-by-Step Gravity System:**
- **gameLogic.ts**: Complete gravity cascade implementation with `removeMatchedGems`, `applyGravity`, `fillTopHoles`, and `processGravityCascade` functions
- **AnimationManager.ts**: Centralized animation coordinator managing match effects, gravity timing, callback handling, and visual state coordination with singleton pattern
- **Game.tsx**: Step-by-step cascade processing (`processStepByCascade` with initial/gravity/newGems phases) with proper loop prevention and state management

**Animation & Effects System:**
- **AnimationManager.ts**: Singleton managing match sparkles (0.5s), gravity falling (0.8s + stagger), and cascade timing with callback coordination and animation state tracking
- **MatchEffects.tsx**: React component rendering 5 sparkle particles per gem with golden radial gradients and staggered burst timing using absolute positioning
- **animations/animations.css**: CSS keyframes for `gravity-fall` (cubic-bezier physics), `gem-appear`, `gem-land-bounce`, and cascade delays (`gem-cascade-delay-1` through `gem-cascade-delay-5`)
- **animations/matchEffects.css**: Sparkle particle animations with `sparkle-burst` patterns, radial gradients (`#fff` to `#ffeb3b`), and `gem-disappear-with-sparkles` effects

**Entry Point & Styling:**
- **main.tsx**: React application bootstrap with `StrictMode`, imports all CSS files (`index.css`, `animations/animations.css`, `animations/matchEffects.css`)
- **index.html**: Mobile-optimized HTML structure with responsive viewport (`user-scalable=no`), full-height layout (`class="h-full"`), and touch controls
- **index.css**: Tailwind CSS integration plus custom game styling (40px gems, hover effects, selection highlighting with yellow borders and glow)
- **constants.ts**: Game configuration constants including `GEM_SIZE_PX = 40` for consistent sizing across all components

### Technology Stack

- **[Devvit](https://developers.reddit.com/)**: Reddit's developer platform for seamless integration and hosting
- **[React 18](https://react.dev/)**: Component-based UI framework with StrictMode for smooth interactions and state management
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development with comprehensive interfaces for reliable gameplay and development experience
- **[Vite](https://vite.dev/)**: Lightning-fast build tool and development server with hot module replacement
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for responsive design and mobile-first layout
- **CSS3 Animations**: Advanced keyframe animations with cubic-bezier timing functions for realistic physics simulation
- **Web APIs**: `crypto.randomUUID()` for unique gem IDs, `performance.now()` for timing, and modern browser features

## How to Play

### Game Objective
Create matches of three or more identical gems by swapping adjacent gems. Karma Cascade uses **advanced connected component matching** - gems can form matches in any connected shape (L-shapes, T-shapes, clusters), not just straight lines. Matched gems completely disappear with spectacular sparkle effects, triggering realistic gravity physics that create satisfying chain reactions.

### Step-by-Step Instructions

#### 🚀 Getting Started
1. **Launch the Game**: Open Karma Cascade in your Reddit feed - loads instantly in your browser, no downloads required
2. **Customize Your Board**: Use the Level Generator Controls at the top:
   - **Grid Size** (3-15): Default 10x10 for balanced gameplay, or try smaller sizes for quick games
   - **Number of Colors** (2-7): Default 7 colors provides enhanced strategic depth and complexity
   - **Minimum Moves** (1-20): Default 5 moves guarantees at least this many possible moves on every board
3. **Generate Your Board**: Click the green "Generate New Board" button - the multi-algorithm system automatically creates a perfect, solvable puzzle using Pattern-Based, Constraint-Based, Backtracking, or Random Fallback generation
4. **Study the Board**: Your grid appears with colorful gems (40x40px each) positioned absolutely for smooth animations, zero initial matches, but guaranteed possible moves

#### 🎮 Core Gameplay Loop

**Step 1: Select a Gem**
- Click any gem on the board
- Selected gem highlights with bright yellow border (3px), glow shadow, and 1.1x scaling effect
- Console logs confirm your selection with gem coordinates

**Step 2: Choose Your Move**
- Click an **adjacent gem** (up, down, left, right - no diagonals) to attempt a swap
- The game validates if this swap creates any connected component matches
- Only valid moves that create matches are accepted

**Step 3: Watch the Step-by-Step Gravity Cascade**
- **Valid Move**: Gems swap colors instantly, triggering the revolutionary cascade system coordinated by `AnimationManager`:
  1. **Matched gems explode with golden sparkles** - 5 animated sparkle particles (4-10px sizes) burst from each matched gem with radial gradients (`#fff` to `#ffeb3b`) using `sparkle-burst` animation
  2. **Matched gems disappear completely** after 0.5s sparkle animation using `gem-disappear-with-sparkles` keyframes (no gray placeholders!)
  3. **Remaining gems fall down smoothly** with `cubic-bezier(0.25, 0.46, 0.45, 0.94)` physics curves, filling empty spaces naturally
  4. **New gems appear at the top** and fall with staggered timing (100ms delay per row) using `gravity-fall` animation with cascade delay classes
  5. **System checks for new matches** created by fallen or new gems using connected component detection (`findGemMatches`)
  6. **Cascade continues step-by-step** with coordinated `AnimationManager` callbacks (`processStepByCascade`) until the board reaches a stable state with no matches
- **Invalid Move**: Nothing happens, board stays unchanged, console logs "Invalid move - no matches created"
- Selection automatically clears after any swap attempt

**Step 4: Enjoy Chain Reactions**
- Single moves can trigger **multiple cascade steps** with dazzling visual effects coordinated by AnimationManager
- Watch as falling gems create new matches, which explode with 5-particle sparkle bursts and cause more gems to fall
- Each cascade step is processed individually: initial matches → gravity → new gems → check for matches → repeat
- The cascade continues automatically with coordinated callback timing until no more matches can be made
- Final board state shows the complete result of your strategic move with all animations complete and proper cleanup

#### 🧩 Advanced Connected Component Matching

**What Makes This Different:**
Unlike traditional match-3 games that only find straight lines, Karma Cascade detects **any connected group** of 3+ identical gems:

- **L-Shapes**: ⬜⬜⬜ Gems connected at right angles
                ⬜
- **T-Shapes**: ⬜⬜⬜ Cross patterns and T formations
                  ⬜
- **Clusters**: ⬜⬜ Irregular connected groups
               ⬜⬜⬜
- **Complex Patterns**: Any shape where gems touch up/down/left/right

**Strategic Implications:**
- **Bigger Matches**: Create large connected clusters for more impressive clears and longer cascades
- **Shape Planning**: Think beyond straight lines - visualize connected regions that will disappear together
- **Multiple Components**: One swap can create several separate connected groups simultaneously
- **Cascade Opportunities**: Consider how gems will fall after matches disappear - plan for chain reactions

#### ⚡ Mastering the Step-by-Step Gravity Cascade System

**Understanding Cascade Physics:**
- **Complete Disappearance**: Matched gems vanish entirely with sparkle effects, creating holes for gravity to fill
- **Vertical Falling**: Gems fall straight down in their columns (no diagonal movement) with realistic physics curves
- **Top Refill**: New random gems always appear at the top to maintain full board coverage with staggered falling animations
- **Step-by-Step Processing**: Each cascade step is processed individually (initial → gravity → newGems) to prevent infinite loops
- **Infinite Cascade Logic**: Cascades continue until no more matches exist anywhere on the board

**Advanced Cascade Strategy:**
- **Setup Cascades**: Look for moves that will create matches after gems fall due to gravity
- **Multi-Level Thinking**: Consider what happens 2-3 cascade steps ahead as new gems fall and create additional matches
- **Color Distribution**: With fewer colors, expect longer cascades; with more colors, focus on immediate connected component matches
- **Top-Heavy Boards**: Matches near the top create more dramatic cascades as more gems fall and potentially create new matches

#### 🎯 Game Controls & Interface

**Level Generator Controls:**
- **Real-Time Adjustment**: Change any parameter and click "Generate New Board" for instant results
- **Parameter Persistence**: Settings stay between generations for consistent difficulty
- **Algorithm Selection**: System automatically chooses the best generation approach (Pattern-Based, Constraint-Based, Backtracking, or Random Fallback)

**Gem Selection System:**
- **First Click**: Select any gem (gets visual highlight)
- **Second Click Options**:
  - **Same gem** → Deselect it
  - **Adjacent gem** → Attempt swap (succeeds only if it creates matches)
  - **Non-adjacent gem** → Select that gem instead
- **Visual Feedback**: Hover effects and selection highlighting provide immediate response

#### 🏆 Winning Strategies

**Difficulty Progression:**
- **Beginner**: 5x5 grid, 3 colors, 5+ minimum moves
- **Intermediate**: 8x8 grid, 7 colors, 5+ minimum moves (current default)
- **Expert**: 12x12+ grid, 7 colors, 1-2 minimum moves

**Connected Component Strategy:**
- **Think in Regions**: Scan for potential connected areas, not just lines
- **Adjacency Rules**: Only up/down/left/right connections count (no diagonals)
- **Multi-Component Planning**: Look for swaps that create multiple separate connected groups simultaneously
- **Cascade Setup**: Position gems to create matches after gravity causes gems to fall

**Advanced Techniques:**
- **Flood-Fill Visualization**: Mentally trace how gems connect in all four directions using the same algorithm the game uses
- **Setup Moves**: Create near-matches that can be completed with future swaps or after gravity cascades
- **Step-by-Step Cascade Thinking**: One swap can trigger multiple cascade steps with matches from falling gems and new gems
- **Color Distribution**: With fewer colors, build large clusters; with more colors (up to 7), find quick 3-gem connected groups

**Pro Tips:**
- **Invalid moves are rejected** - take time to plan since random clicking won't work, only moves creating matches are accepted
- **Use the generator controls** - stuck on a board? Generate a fresh one with your preferred difficulty settings
- **Study the console logs** - detailed feedback helps you understand the connected component matching system and cascade steps
- **Central gems have more potential** - they can connect in more directions than edge/corner gems
- **Watch the sparkle effects** - 5 golden particles per matched gem indicate successful connected component detection

## Current Game Experience

### What Players Can Expect Right Now

**🎮 Fully Playable Game**: Karma Cascade is 100% functional with all core Bejeweled mechanics plus revolutionary enhancements. Players can immediately:

- **Generate Perfect Boards**: Use the live controls to create custom boards (3x3 to 15x15, 2-7 colors, 1-20 minimum moves) with mathematical guarantees
- **Strategic Gem Matching**: Click to select gems, click adjacent gems to swap, with only valid moves accepted
- **Watch Spectacular Cascades**: Experience the step-by-step gravity system with golden sparkle effects, smooth falling animations, and automatic chain reactions
- **Enjoy Smooth Animations**: All visual effects are fully implemented with realistic physics curves and coordinated timing
- **Play on Any Device**: Mobile-optimized responsive design works perfectly on desktop and mobile browsers

**🎯 Game Highlights**:
- **Connected Component Matching**: Find matches in any shape (L-shapes, T-shapes, clusters) - not just straight lines
- **Revolutionary Gravity Physics**: Gems disappear completely, remaining gems fall naturally, new gems appear at top with staggered animations
- **Infinite Cascade System**: Single moves can trigger multiple cascade steps until the board stabilizes
- **Advanced Level Generator**: Four different algorithms ensure every board is perfectly balanced and solvable
- **Rich Visual Feedback**: 5-particle sparkle effects, smooth gravity curves, selection highlighting, and hover effects

**🚀 Ready to Play**: The game is production-ready for Reddit deployment with comprehensive TypeScript integration, optimized performance, and extensive debugging capabilities.

## Development Setup

> Make sure you have Node 22 downloaded on your machine before running!

### For New Projects
1. Run `npm create devvit@latest --template=react`
2. Go through the installation wizard. You will need to create a Reddit account and connect it to Reddit developers
3. Copy the command on the success page into your terminal

### For This Project
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server
4. Open the provided Reddit playtest URL to test the game

## Commands

- `npm run dev`: Starts a development server where you can develop your application live on Reddit.
- `npm run build`: Builds your client and server projects
- `npm run deploy`: Uploads a new version of your app
- `npm run launch`: Publishes your app for review
- `npm run login`: Logs your CLI into Reddit
- `npm run check`: Type checks, lints, and prettifies your app

## Cursor Integration

This template comes with a pre-configured cursor environment. To get started, [download cursor](https://www.cursor.com/downloads) and enable the `devvit-mcp` when prompted.
