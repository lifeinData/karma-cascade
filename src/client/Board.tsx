import Gem from './Gem';
import { GEM_SIZE_PX } from './constants.js';
import { MatchEffects } from './animations/MatchEffects';
import { animationManager } from './animations/AnimationManager';

interface GemData {
  id: string;
  color: string;
  row: number;
  col: number;
  isNew?: boolean;
  isMatched?: boolean;
  animationState?: 'normal' | 'disappearing' | 'falling' | 'appearing' | 'landing';
}

interface BoardProps {
  board: GemData[][];
  onGemClick: (row: number, col: number) => void;
  selectedGem: { row: number; col: number } | null;
}

const Board = ({ board, onGemClick, selectedGem }: BoardProps) => {
  // Calculate grid size dynamically
  const gridSize = board.length;

  // Handle empty board
  if (gridSize === 0) {
    return <div className="board">Loading...</div>;
  }

  // Get active match positions for sparkle effects
  const activeMatchPositions = animationManager.getActiveMatchPositions();

  // Dynamic styles for the board container (changed to relative positioning for absolute gem positioning)
  const boardStyle = {
    position: 'relative' as const,
    width: `${gridSize * GEM_SIZE_PX}px`,
    height: `${gridSize * GEM_SIZE_PX}px`,
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="board" style={boardStyle}>
      {/* Render all gems */}
      {board.map((row) =>
        row.map((gem) => {
          const isSelected =
            selectedGem !== null && selectedGem.row === gem.row && selectedGem.col === gem.col;

          return <Gem key={gem.id} gem={gem} onClick={onGemClick} isSelected={isSelected} />;
        })
      )}

      {/* Render match effects (sparkles) */}
      <MatchEffects matches={activeMatchPositions} gemSize={GEM_SIZE_PX} />
    </div>
  );
};

export default Board;
