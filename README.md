## Karma Cascade - Advanced Bejeweled Game for Reddit

A sophisticated match-3 puzzle game with an intelligent level generator and revolutionary gravity cascade system, built with React and designed for Reddit's Devvit platform. This game brings classic gem-matching gameplay directly to Reddit, featuring strategic gem swapping, advanced board generation, realistic physics simulation, and smooth visual feedback - all playable without leaving your favorite social platform.

### What This Game Is

Karma Cascade is a modern implementation of the classic Bejeweled match-3 puzzle game, designed specifically for Reddit's social gaming ecosystem. Players interact with fully customizable grids of colorful gems (red, blue, green, yellow, purple, orange, cyan), strategically swapping adjacent pieces to create matches of three or more identical gems using an advanced **connected component matching system**. 

Unlike traditional match-3 games that only detect straight lines, Karma Cascade uses sophisticated flood-fill algorithms to find connected groups of identical gems in any shape - including L-shapes, T-shapes, and irregular clusters. When matches are formed, the gems **completely disappear** from the board, triggering a realistic **gravity cascade system** where remaining gems fall down to fill empty spaces, new gems appear at the top, and the process continues until no more matches can be made.

The game features an intuitive two-click interaction system: first click selects a gem (highlighted with yellow border and scaling effects), second click attempts to swap with an adjacent gem. Only moves that create valid matches are accepted, ensuring strategic gameplay that rewards planning and pattern recognition. The revolutionary multi-algorithm level generator creates perfectly balanced boards with real-time configurable parameters - ensuring no initial matches while mathematically guaranteeing a minimum number of possible moves.

Built with modern React architecture, the game uses a clean component hierarchy (App → Game → Board → Gem) with full TypeScript integration for enhanced development experience. The responsive CSS Grid layout automatically adapts to any board size from 3x3 to 15x15, providing consistent gameplay across all devices.

### What Makes This Game Innovative

**🧠 Revolutionary Match Detection System**
- **Connected Component Matching**: Uses advanced flood-fill algorithms to detect matches in any connected shape (L-shapes, T-shapes, clusters) - not just straight lines like traditional match-3 games
- **Complete Gem Disappearance**: Matched gems completely vanish from the board (no gray placeholders), creating realistic empty spaces for gravity physics
- **Generic Color Extraction**: Unified match detection system works with both string schemas (for generation) and full Gem objects (for gameplay) using polymorphic color extractors

**⚡ Revolutionary Gravity Cascade System**
- **Realistic Physics Simulation**: When gems are matched and removed, remaining gems fall down due to gravity, filling empty spaces naturally
- **Automatic Refill Mechanism**: New random gems appear at the top to fill holes left by falling gems, maintaining full board coverage
- **Infinite Cascade Logic**: The system continues processing gravity → new gems → match detection → removal until the board reaches a stable state with no matches
- **Six-Phase Cascade Pipeline**: Remove matches → Apply gravity → Fill top holes → Check for new matches → Repeat until stable → Final board state

**🎯 Multi-Algorithm Level Generator**
- **Four-Tier Generation System**: Pattern-Based (fastest), Constraint-Based (efficient), Backtracking (most reliable), Random Fallback - automatically selects optimal approach
- **Mathematical Playability Guarantee**: Every board ensures no initial matches while guaranteeing your specified minimum number of possible moves
- **Three-Phase Pipeline**: Lightweight schema generation → validation → hydration to React state → automatic cleanup with retry fallback
- **Constraint-Based Prevention**: Intelligent forbidden color detection prevents matches during generation rather than fixing them afterward

**🎮 Advanced Game Mechanics**
- **Strategic Move Validation**: Only swaps that create connected component matches are accepted - encourages planning over random clicking
- **Cascading Chain Reactions**: Single moves can trigger multiple cascade steps, creating satisfying chain reactions and combo opportunities
- **Live Parameter Control**: Real-time adjustment of grid size (3-15), colors (2-7), and minimum moves (1-20) with instant regeneration
- **Intelligent Selection System**: Click to select with visual feedback, click adjacent to swap, click same gem to deselect, click distant gem to reselect

**🏗️ Modern Technical Architecture**
- **Type-Safe Development**: Full TypeScript integration with proper interfaces for all game components and level generation systems
- **Decoupled Game Logic**: Gravity cascade system separated from UI rendering for optimal performance and maintainability
- **Component-Based Design**: Clean React hierarchy (App → Game → Board → Gem) with proper separation of concerns
- **Responsive CSS Grid**: Dynamic layout that adapts to any board size with touch-optimized gem sizing

**📱 Reddit-Native Experience**
- **Seamless Integration**: Built specifically for Reddit's Devvit platform - plays directly in posts without external apps or downloads
- **Cross-Platform Optimization**: Mobile-first responsive design that works perfectly on desktop and mobile browsers
- **Developer-Friendly Debugging**: Extensive console logging for board generation, move validation, match detection, and gravity cascades
- **Social Gaming Ready**: Designed for Reddit's social ecosystem with potential for leaderboards and community features

### Current Implementation Status

**✅ Completed Core Game Features:**
- **Dynamic Game Board**: Fully configurable grid sizes from 3x3 to 15x15 with responsive CSS Grid layout that adapts to any screen size
- **Advanced Level Generator**: High-performance procedural generation with real-time configurable parameters and mathematical validation guarantees
- **Multi-Color Gem System**: Complete support for 2-7 different gem colors (red, blue, green, yellow, purple, orange, cyan) with dynamic color mapping - now defaults to 7 colors for enhanced gameplay complexity
- **Live Generator Testing UI**: Real-time controls for grid size, color count, and minimum moves with instant regeneration and parameter persistence
- **Modern Component Architecture**: Clean React structure (App → Game → Board → Gem) with full TypeScript integration and proper prop interfaces
- **Cross-Platform Responsive Design**: Mobile-optimized layout with touch-friendly 40x40px gems that scales perfectly across all device sizes
- **Intuitive Gem Selection System**: Click-to-select gems with comprehensive visual highlighting, yellow borders, glow effects, and scaling feedback
- **Smart Gem Deselection**: Click the same gem again to deselect it, or click any other gem to transfer selection seamlessly
- **Comprehensive Click Handling**: Advanced event handling and state management for all player interactions with proper validation
- **Rich Visual Feedback System**: Selected gems show bright yellow 3px borders, glow shadows, 1.1x scaling, plus 1.05x hover effects on all gems
- **Adjacent Gem Swapping**: Complete swap mechanics for neighboring gems (horizontal/vertical only) with instant color swapping
- **Revolutionary Connected Component Matching**: Advanced flood-fill algorithm detecting matches in any connected shape (L-shapes, T-shapes, clusters) - not just straight lines
- **Strategic Move Validation**: Only valid moves that create connected component matches are accepted - invalid moves rejected with immediate console feedback
- **Complete Gravity Cascade System**: Matched gems disappear completely → remaining gems fall down → new gems fill top holes → cascade continues until stable
- **Infinite Cascade Logic**: Automatic chain reactions where falling gems and new gems can create additional matches, continuing until board stabilizes
- **Complete Bejeweled Game Loop**: Fully playable mechanics from board generation → selection → swapping → matching → gravity cascade → refill → stabilization

**✅ Advanced Technical Features:**
- **Revolutionary Multi-Algorithm Generation Pipeline**: Four distinct generation approaches (Pattern-Based, Constraint-Based, Backtracking, Random Fallback) with automatic algorithm selection for optimal performance and reliability
- **Performance-Optimized Validation**: Early-exit algorithms - hasInitialMatches stops on first match found, hasMinimumMoves returns as soon as minimum count reached
- **Mathematical Playability Guarantee**: Every generated board mathematically ensures no initial matches while guaranteeing your specified minimum possible moves
- **Advanced Gravity Physics Engine**: Six-phase cascade system (Remove → Gravity → Fill → Check → Repeat → Stabilize) with complete gem disappearance and realistic falling mechanics
- **Comprehensive Debug Logging**: Detailed console output tracking board generation, algorithm selection, gem selections, swap attempts, match validation, gravity cascades, and complete board state changes
- **Intelligent Fallback System**: Advanced error handling with automatic algorithm fallback - if one approach fails, automatically tries the next most reliable method
- **Three-Phase Board Processing**: Lightweight schema generation → validation → hydration → cleanup with automatic retry on any phase failure
- **Decoupled Game Logic**: Gravity cascade system completely separated from UI rendering for optimal performance and future animation integration
- **Smooth CSS Animations**: Professional hover effects with 1.05x scale on hover, 1.1x scale on selection, plus smooth transitions for all interactions
- **Type-Safe Development**: Full TypeScript integration with proper interfaces for Gem, BoardSchema, GeneratorConfig, gravity cascade functions, and all component props

**🔧 Current Technical Status:**
- **Core Gameplay**: 100% functional and playable with all major Bejeweled features plus advanced gravity cascade system fully implemented and tested
- **Gravity Physics**: Complete gravity cascade system with gem removal, falling mechanics, top refill, and infinite cascade loops until board stabilization
- **Performance**: Highly optimized for boards up to 15x15 with efficient validation algorithms, early-exit optimizations, and fast cascade processing
- **Cross-Platform**: Responsive design works perfectly on desktop and mobile with touch-optimized controls
- **Default Configuration**: Now defaults to 8x8 grid, 7 colors, 5 minimum moves for enhanced gameplay complexity with satisfying cascade opportunities
- **TypeScript Integration**: Full type safety with comprehensive interfaces for all game logic, gravity system, and component interactions

**🚧 Future Enhancement Opportunities:**
- **Scoring System**: Point tracking with cascade multipliers, combo bonuses, and high score persistence
- **Visual Animations**: Smooth gem falling animations, disappearing effects, and new gem appearance transitions
- **Power-Up System**: Special gems (bombs, line clearers, color changers) and combo effects that integrate with gravity system
- **Audio Experience**: Sound effects for selections, swaps, matches, cascades, and background music
- **Social Features**: Reddit user leaderboards, achievements, cascade records, and community challenges
- **Advanced Visual Effects**: Particle effects, gem explosions, cascade trails, and enhanced visual polish

### Current Game Architecture

**Component Structure:**
- **App.tsx**: Main application wrapper with centered layout and full-height responsive design
- **Game.tsx**: Core game logic, state management, and live level generator controls
- **Board.tsx**: Dynamic CSS Grid rendering that adapts to any board size (3x3 to 15x15)
- **Gem.tsx**: Individual gem components with click handling, hover effects, and selection feedback

**Advanced Level Generation System:**
- **generator.ts**: Multi-algorithm orchestrator with automatic fallback system for guaranteed perfect boards
- **optimizedGenerator.ts**: Three specialized generation algorithms (Pattern-Based, Constraint-Based, Backtracking)
- **validation.ts**: Early-exit algorithms for connected component match detection and move counting
- **hydration.ts**: Converts lightweight schemas to full React state with automatic cleanup integration
- **cleanup.ts**: Post-generation cleanup system for gray gem removal with retry fallback
- **types.ts**: TypeScript interfaces, color mapping, and generator configuration definitions

**Entry Point:**
- **main.tsx**: React application bootstrap with StrictMode for development safety
- **index.html**: Mobile-optimized HTML structure with responsive viewport and touch controls
- **index.css**: Tailwind CSS integration plus custom game styling with smooth animations

### Technology Stack

- [Devvit](https://developers.reddit.com/): Reddit's developer platform for seamless integration
- [Vite](https://vite.dev/): Lightning-fast build tool and development server
- [React](https://react.dev/): Component-based UI framework for smooth interactions
- [Express](https://expressjs.com/): Backend API for game logic and data persistence
- [Tailwind](https://tailwindcss.com/): Utility-first CSS framework for responsive design
- [TypeScript](https://www.typescriptlang.org/): Type-safe development for reliable gameplay

## How to Play

### Game Objective
Create matches of three or more identical gems by swapping adjacent gems. Karma Cascade uses **advanced connected component matching** - gems can form matches in any connected shape (L-shapes, T-shapes, clusters), not just straight lines. Matched gems automatically turn gray ("dulled") to show they've been cleared and won't participate in future matches.

### Step-by-Step Instructions

#### 🚀 Getting Started
1. **Launch the Game**: Open Karma Cascade in your Reddit feed - loads instantly in your browser, no downloads required
2. **Customize Your Board**: Use the Level Generator Controls at the top:
   - **Grid Size** (3-15): Start with 8x8 for balanced gameplay, or try 5x5 for quick games
   - **Number of Colors** (2-7): Default 7 colors provides enhanced strategic depth and complexity
   - **Minimum Moves** (1-20): Guarantees at least this many possible moves on every board
3. **Generate Your Board**: Click the green "Generate New Board" button - the multi-algorithm system automatically creates a perfect, solvable puzzle
4. **Study the Board**: Your grid appears with colorful gems (40x40px each) and zero initial matches, but guaranteed possible moves

#### 🎮 Core Gameplay Loop

**Step 1: Select a Gem**
- Click any gem on the board
- Selected gem highlights with bright yellow border (3px), glow shadow, and 1.1x scaling effect
- Console logs confirm your selection with gem coordinates

**Step 2: Choose Your Move**
- Click an **adjacent gem** (up, down, left, right - no diagonals) to attempt a swap
- The game validates if this swap creates any connected component matches
- Only valid moves that create matches are accepted

**Step 3: Watch the Gravity Cascade**
- **Valid Move**: Gems swap colors instantly, triggering the revolutionary cascade system:
  1. **Matched gems disappear completely** (no gray placeholders - they vanish!)
  2. **Remaining gems fall down** due to gravity, filling empty spaces naturally
  3. **New gems appear at the top** to fill holes left by falling gems
  4. **System checks for new matches** created by fallen or new gems
  5. **Cascade continues** until the board reaches a stable state with no matches
- **Invalid Move**: Nothing happens, board stays unchanged, try a different swap
- Selection automatically clears after any swap attempt

**Step 4: Enjoy Chain Reactions**
- Single moves can trigger **multiple cascade steps**
- Watch as falling gems create new matches, which disappear and cause more gems to fall
- The cascade continues automatically until no more matches can be made
- Final board state shows the complete result of your strategic move

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

#### ⚡ Mastering the Gravity Cascade System

**Understanding Cascade Physics:**
- **Complete Disappearance**: Matched gems vanish entirely, creating holes for gravity to fill
- **Vertical Falling**: Gems fall straight down in their columns (no diagonal movement)
- **Top Refill**: New random gems always appear at the top to maintain full board coverage
- **Infinite Loops**: Cascades continue until no more matches exist anywhere on the board

**Advanced Cascade Strategy:**
- **Setup Cascades**: Look for moves that will create matches after gems fall
- **Multi-Level Thinking**: Consider what happens 2-3 cascade steps ahead
- **Color Distribution**: With fewer colors, expect longer cascades; with more colors, focus on immediate matches
- **Top-Heavy Boards**: Matches near the top create more dramatic cascades as more gems fall

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
- **Gray Gem Barriers**: Dulled gems act as neutral barriers that block connections
- **Multi-Component Planning**: Look for swaps that create multiple separate matches

**Advanced Techniques:**
- **Flood-Fill Visualization**: Mentally trace how gems connect in all four directions
- **Setup Moves**: Create near-matches that can be completed with future swaps  
- **Cascade Thinking**: One swap can trigger multiple connected component matches
- **Color Distribution**: With fewer colors, build large clusters; with more colors (up to 7), find quick 3-gem groups

**Pro Tips:**
- **Invalid moves are rejected** - take time to plan since random clicking won't work
- **Use the generator controls** - stuck on a board? Generate a fresh one with your preferred difficulty
- **Study the console logs** - detailed feedback helps you understand the matching system
- **Central gems have more potential** - they can connect in more directions than edge/corner gems

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
