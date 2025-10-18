import { useState, useEffect } from 'react';
import Board from './Board.js';
import { generateValidBoard, type Gem, type GeneratorConfig } from './levelGeneration';
import { findGemMatches } from './levelGeneration/matchDetection';
import { processGravityCascade } from './gameLogic';

const Game = () => {
  const [board, setBoard] = useState<Gem[][]>([]);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);

  // Generator configuration state
  const [gridSize, setGridSize] = useState(8);
  const [numColors, setNumColors] = useState(7);
  const [minMoves, setMinMoves] = useState(5);

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

  // Post-swap consequence logic - runs whenever board changes
  useEffect(() => {
    if (board.length === 0) return; // Skip if board is not initialized

    // Log current board state
    console.log('🎮 Board State Changed:');
    const boardMatrix = board.map((row) => row.map((gem) => gem.color));
    console.table(boardMatrix);

    const matches = findMatches(board);
    console.log('🔍 Matches found:', matches.size > 0 ? Array.from(matches) : 'None');

    if (matches.size > 0) {
      // Create generator configuration for the cascade
      const config: GeneratorConfig = {
        gridSize,
        numColors,
        minMoves,
      };

      // Process the complete gravity cascade
      const finalBoard = processGravityCascade(board, config);
      
      console.log('✨ Gravity cascade complete, updating board');
      setBoard(finalBoard);
    }
  }, [board, gridSize, numColors, minMoves]);

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
    result.components.forEach(component => {
      console.log(`🔍 Found connected component of ${component.size} ${component.color} gems:`, 
        component.positions.map(pos => `${pos.row}-${pos.col}`));
    });
    
    return result.matches;
  };

  const handleGemClick = (row: number, col: number) => {
    console.log(`👆 Gem clicked at (${row}, ${col})`);

    if (selectedGem === null) {
      console.log(`🎯 Selecting gem at (${row}, ${col})`);
      setSelectedGem({ row, col });
    } else if (selectedGem.row === row && selectedGem.col === col) {
      // Clicking on the same gem deselects it
      console.log(`❌ Deselecting gem at (${row}, ${col})`);
      setSelectedGem(null);
    } else {
      console.log(
        `🔄 Attempting swap: (${selectedGem.row}, ${selectedGem.col}) ↔ (${row}, ${col})`
      );

      // Second click - check if adjacent and swap
      const adjacent = isAdjacent(selectedGem, { row, col });
      console.log(`📏 Adjacent check:`, adjacent);

      if (adjacent) {
        // Create a deep copy of the board state
        const newBoard = board.map((boardRow) => boardRow.map((gem) => ({ ...gem })));

        // Swap the positions of the two gems
        const gem1 = newBoard[selectedGem.row]?.[selectedGem.col];
        const gem2 = newBoard[row]?.[col];

        if (!gem1 || !gem2) {
          console.log(`❌ Invalid gem positions for swap`);
          setSelectedGem(null);
          return;
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
        } else {
          console.log(`❌ Invalid move - no matches created.`);
        }
        // If no matches, the board state remains unchanged (invalid move)
      } else {
        console.log(`❌ Invalid move - gems not adjacent.`);
      }
      // Reset selection regardless of outcome
      console.log(`🔄 Resetting selection`);
      setSelectedGem(null);
    }
  };

  return (
    <div className="game-container">
      <h1>Bejeweled Game</h1>

      {/* Generator Testing UI */}
      <div
        className="generator-controls"
        style={{
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      >
        <h3>Level Generator Controls</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label>
            Grid Size:
            <input
              type="number"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              min="3"
              max="15"
              style={{ marginLeft: '5px', width: '60px' }}
            />
          </label>

          <label>
            Number of Colors:
            <input
              type="number"
              value={numColors}
              onChange={(e) => setNumColors(Number(e.target.value))}
              min="2"
              max="7"
              style={{ marginLeft: '5px', width: '60px' }}
            />
          </label>

          <label>
            Minimum Moves:
            <input
              type="number"
              value={minMoves}
              onChange={(e) => setMinMoves(Number(e.target.value))}
              min="1"
              max="20"
              style={{ marginLeft: '5px', width: '60px' }}
            />
          </label>

          <button
            onClick={handleGenerateBoard}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Generate New Board
          </button>
        </div>
      </div>

      <Board board={board} onGemClick={handleGemClick} selectedGem={selectedGem} />
    </div>
  );
};

export default Game;
