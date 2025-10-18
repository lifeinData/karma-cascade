import Gem from './Gem';

interface GemData {
  id: string;
  color: string;
  row: number;
  col: number;
}

interface BoardProps {
  board: GemData[][];
  onGemClick: (row: number, col: number) => void;
  selectedGem: {row: number, col: number} | null;
}

const Board = ({ board, onGemClick, selectedGem }: BoardProps) => {
  // Calculate grid size dynamically
  const gridSize = board.length;
  
  // Handle empty board
  if (gridSize === 0) {
    return <div className="board">Loading...</div>;
  }
  
  // Dynamic styles for the board grid
  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    gap: '2px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="board" style={boardStyle}>
      {board.map((row) => row.map((gem) => {
        const isSelected = selectedGem !== null && 
          selectedGem.row === gem.row && 
          selectedGem.col === gem.col;
        
        return (
          <Gem 
            key={gem.id} 
            color={gem.color} 
            id={gem.id} 
            row={gem.row}
            col={gem.col}
            onClick={onGemClick}
            isSelected={isSelected}
          />
        );
      }))}
    </div>
  );
};

export default Board;
