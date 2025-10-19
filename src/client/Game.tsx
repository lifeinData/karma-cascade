import { useState, useEffect } from 'react';
import Board from './Board.js';
import { generateValidBoard, type Gem, type GeneratorConfig } from './levelGeneration';
import { findGemMatches } from './levelGeneration/matchDetection';
import { removeMatchedGems, applyGravity, fillTopHoles } from './gameLogic';
import { animationManager } from './animations/AnimationManager';

const Game = () => {
  const [board, setBoard] = useState<Gem[][]>([]);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);

  // Responsive game configuration for blitz mode
  const isMobile = window.innerWidth <= 900;
  const gridSize = isMobile ? 8 : 10; // Smaller grid on mobile for larger gems
  const numColors = 7;
  const minMoves = 5;

  // Log selected gem changes
  useEffect(() => {
    if (selectedGem) {
      console.log(`🎯 Selected gem:`, selectedGem);
    } else {
      console.log(`🎯 No gem selected`);
    }
  }, [selectedGem]);

  // Main handler function for board generation
  const handleGenerateBoard = () => {
    console.log('🚀 Starting board generation pipeline');

    // Create generator configuration
    const config: GeneratorConfig = {
      gridSize,
      numColors,
      minMoves,
    };

    // Generate complete board (schema + hydration + cleanup)
    const generatedBoard = generateValidBoard(config);

    // Update board state to trigger render
    setBoard(generatedBoard);

    // Reset selection when new board is generated
    setSelectedGem(null);

    console.log('🎉 Board generation pipeline complete');
  };

  useEffect(() => {
    // Use the new generator on initial load
    handleGenerateBoard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // State to prevent cascade loops
  const [isProcessingCascade, setIsProcessingCascade] = useState(false);

  // Step-by-step cascade system
  const processStepByCascade = (
    currentBoard: Gem[][],
    step: 'initial' | 'gravity' | 'newGems' = 'initial'
  ) => {
    const config: GeneratorConfig = { gridSize, numColors, minMoves };

    console.log(`🔄 Processing cascade step: ${step}`);

    const matches = findMatches(currentBoard);
    console.log('🔍 Matches found:', matches.size > 0 ? Array.from(matches) : 'None');

    if (matches.size > 0) {
      // Mark matched gems for disappearing animation
      const boardWithMatchedGems = currentBoard.map((row) =>
        row.map((gem) => {
          const gemKey = `${gem.row}-${gem.col}`;
          if (matches.has(gemKey)) {
            return { ...gem, isMatched: true, animationState: 'disappearing' as const };
          }
          return { ...gem, isMatched: false, animationState: 'normal' as const };
        })
      );

      setBoard(boardWithMatchedGems);

      // Start match animation with sparkles
      animationManager.startMatchAnimation(matches, () => {
        // Remove matched gems and apply gravity
        const cleanBoard = currentBoard.map((row) =>
          row.map((gem) => ({ id: gem.id, color: gem.color, row: gem.row, col: gem.col }))
        );

        const boardAfterRemoval = removeMatchedGems(cleanBoard, matches);
        const boardAfterGravity = applyGravity(boardAfterRemoval);

        // Immediately fill holes to get a complete board
        const completeBoard = fillTopHoles(boardAfterGravity, config);

        // Create two versions: one for gravity match checking, one for display
        const gravityCheckBoard = completeBoard.map((row) =>
          row.map((gem) => ({
            ...gem,
            isNew: false, // Ignore new gem markers for gravity match checking
            isMatched: false,
            animationState: 'normal' as const,
          }))
        );

        setBoard(gravityCheckBoard);

        // Check for matches after gravity
        setTimeout(() => {
          const gravityMatches = findMatches(gravityCheckBoard);

          if (gravityMatches.size > 0) {
            // Matches found after gravity - continue cascade
            processStepByCascade(gravityCheckBoard, 'gravity');
          } else {
            // No matches after gravity - show new gems with falling animation
            const boardWithFallingGems = completeBoard.map((row) =>
              row.map((gem) => ({
                ...gem,
                animationState: gem.isNew ? ('falling' as const) : ('normal' as const),
              }))
            );

            setBoard(boardWithFallingGems);

            // Start falling animation for new gems
            const newGemPositions = completeBoard.flatMap((row, rowIndex) =>
              row
                .map((gem, colIndex) => (gem.isNew ? { row: rowIndex, col: colIndex } : null))
                .filter((pos) => pos !== null)
            ) as Array<{ row: number; col: number }>;

            if (newGemPositions.length > 0) {
              animationManager.startGravityAnimation(newGemPositions, () => {
                // After falling animation, reset animation states and check for matches
                const finalBoard = completeBoard.map((row) =>
                  row.map((gem) => ({
                    ...gem,
                    isNew: false,
                    isMatched: false,
                    animationState: 'normal' as const,
                  }))
                );

                setBoard(finalBoard);

                // Check for matches from new gems
                setTimeout(() => {
                  const newGemMatches = findMatches(finalBoard);

                  if (newGemMatches.size > 0) {
                    // Matches found from new gems - continue cascade
                    processStepByCascade(finalBoard, 'newGems');
                  } else {
                    // No more matches - cascade complete
                    console.log('✅ Cascade complete - no more matches');
                    setIsProcessingCascade(false);
                  }
                }, 100);
              });
            } else {
              // No new gems - cascade complete
              console.log('✅ Cascade complete - no new gems needed');
              setIsProcessingCascade(false);
            }
          }
        }, 100);
      });
    } else {
      // No matches - cascade complete
      console.log('✅ Cascade complete - no matches found');
      setIsProcessingCascade(false);
    }
  };

  // Post-swap consequence logic - runs whenever board changes
  useEffect(() => {
    if (board.length === 0 || isProcessingCascade) return; // Skip if board is not initialized or cascade in progress

    // Log current board state
    console.log('🎮 Board State Changed:');
    const boardMatrix = board.map((row) => row.map((gem) => gem.color));
    console.table(boardMatrix);

    const matches = findMatches(board);
    console.log('🔍 Initial matches found:', matches.size > 0 ? Array.from(matches) : 'None');

    if (matches.size > 0) {
      setIsProcessingCascade(true);
      processStepByCascade(board, 'initial');
    }
  }, [board, isProcessingCascade]);

  const isAdjacent = (
    gem1: { row: number; col: number },
    gem2: { row: number; col: number }
  ): boolean => {
    const rowDiff = Math.abs(gem1.row - gem2.row);
    const colDiff = Math.abs(gem1.col - gem2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const findMatches = (boardState: Gem[][]): Set<string> => {
    const result = findGemMatches(boardState);

    // Log found components for debugging
    result.components.forEach((component) => {
      console.log(
        `🔍 Found connected component of ${component.size} ${component.color} gems:`,
        component.positions.map((pos) => `${pos.row}-${pos.col}`)
      );
    });

    return result.matches;
  };

  // Unified swap logic for both click and drag
  const performGemSwap = (
    gem1Pos: { row: number; col: number },
    gem2Pos: { row: number; col: number }
  ) => {
    console.log(
      `🔄 Attempting swap: (${gem1Pos.row}, ${gem1Pos.col}) ↔ (${gem2Pos.row}, ${gem2Pos.col})`
    );

    // Check if adjacent
    const adjacent = isAdjacent(gem1Pos, gem2Pos);
    console.log(`📏 Adjacent check:`, adjacent);

    if (adjacent) {
      // Create a deep copy of the board state
      const newBoard = board.map((boardRow) => boardRow.map((gem) => ({ ...gem })));

      // Swap the positions of the two gems
      const gem1 = newBoard[gem1Pos.row]?.[gem1Pos.col];
      const gem2 = newBoard[gem2Pos.row]?.[gem2Pos.col];

      if (!gem1 || !gem2) {
        console.log(`❌ Invalid gem positions for swap`);
        return false;
      }

      console.log(`🎨 Swapping colors: ${gem1.color} ↔ ${gem2.color}`);

      // Swap colors (keeping positions the same)
      const tempColor = gem1.color;
      gem1.color = gem2.color;
      gem2.color = tempColor;

      // Validate the move by checking for matches
      const matches = findMatches(newBoard);
      console.log(
        `✅ Move validation - matches found:`,
        matches.size > 0 ? Array.from(matches) : 'None'
      );

      // If matches are found, the move is valid - commit the change
      if (matches.size > 0) {
        console.log(`✨ Valid move! Committing board change.`);
        setBoard(newBoard);
        setSelectedGem(null); // Clear selection after successful swap
        return true;
      } else {
        console.log(`❌ Invalid move - no matches created.`);
        return false;
      }
    } else {
      console.log(`❌ Invalid move - gems not adjacent.`);
      return false;
    }
  };

  const handleGemSwap = (
    gem1: { row: number; col: number },
    gem2: { row: number; col: number }
  ) => {
    const swapSuccessful = performGemSwap(gem1, gem2);
    if (!swapSuccessful) {
      // If swap failed, deselect everything (as requested)
      setSelectedGem(null);
    }
  };

  const handleGemClick = (row: number, col: number) => {
    console.log(`👆 Gem clicked at (${row}, ${col})`);

    if (selectedGem === null) {
      // No gem selected - select this one
      console.log(`🎯 Selecting gem at (${row}, ${col})`);
      setSelectedGem({ row, col });
    } else if (selectedGem.row === row && selectedGem.col === col) {
      // Clicking on the same gem - deselect it
      console.log(`❌ Deselecting gem at (${row}, ${col})`);
      setSelectedGem(null);
    } else {
      // Clicking on a different gem - check if adjacent first
      const rowDiff = Math.abs(selectedGem.row - row);
      const colDiff = Math.abs(selectedGem.col - col);
      const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

      if (isAdjacent) {
        // Adjacent gems - try to swap
        const swapSuccessful = performGemSwap(selectedGem, { row, col });
        if (!swapSuccessful) {
          // Adjacent but invalid swap - deselect everything
          console.log(`❌ Invalid adjacent swap - deselecting everything`);
          setSelectedGem(null);
        }
      } else {
        // Not adjacent - select the new gem instead
        console.log(`🎯 Not adjacent - selecting new gem at (${row}, ${col})`);
        setSelectedGem({ row, col });
      }
    }
  };

  return (
    <div className="game-container">
      <Board
        board={board}
        onGemClick={handleGemClick}
        onGemSwap={handleGemSwap}
        selectedGem={selectedGem}
      />
    </div>
  );
};

export default Game;
