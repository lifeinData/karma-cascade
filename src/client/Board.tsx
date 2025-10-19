import { useState, useEffect, useRef } from 'react';
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
  onGemSwap?: (gem1: { row: number; col: number }, gem2: { row: number; col: number }) => void;
  selectedGem: { row: number; col: number } | null;
}

const Board = ({ board, onGemClick, onGemSwap, selectedGem }: BoardProps) => {
  const gridSize = board.length;
  const [gemSize, setGemSize] = useState(GEM_SIZE_PX);
  const boardRef = useRef<HTMLDivElement>(null);

  // Simple touch/mouse tracking
  const startGemRef = useRef<{ row: number; col: number } | null>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Global cleanup to prevent stuck states - but with delay to avoid race conditions
  useEffect(() => {
    const handleGlobalEnd = () => {
      // Delay the cleanup to avoid race conditions with gem touch events
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
      touchTimeoutRef.current = setTimeout(() => {
        startGemRef.current = null;
      }, 100); // Small delay to let gem events process first
    };

    document.addEventListener('touchend', handleGlobalEnd);
    document.addEventListener('touchcancel', handleGlobalEnd);
    document.addEventListener('mouseup', handleGlobalEnd);

    return () => {
      document.removeEventListener('touchend', handleGlobalEnd);
      document.removeEventListener('touchcancel', handleGlobalEnd);
      document.removeEventListener('mouseup', handleGlobalEnd);
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  const calculateGemSize = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = viewportWidth <= 900 ? 80 : 40;
    const maxWidth = Math.min(viewportWidth - margin, viewportHeight - margin);
    const calculatedGemSize = Math.floor(maxWidth / gridSize);
    const minGemSize = viewportWidth <= 900 ? 45 : 35;
    return Math.max(calculatedGemSize, minGemSize);
  };

  useEffect(() => {
    const updateGemSize = () => setGemSize(calculateGemSize());
    updateGemSize();
    window.addEventListener('resize', updateGemSize);
    return () => window.removeEventListener('resize', updateGemSize);
  }, [gridSize]);

  // SIMPLE: Handle touch/mouse start
  const handleStart = (row: number, col: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    startGemRef.current = { row, col };
  };

  // SIMPLE: Handle touch/mouse end
  const handleEnd = (row: number, col: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Clear any pending timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }

    if (!startGemRef.current) {
      // No start gem - treat as direct click
      onGemClick(row, col);
      return;
    }

    // All gem interactions go to Game.tsx for unified logic
    onGemClick(row, col);

    // Immediately reset to ensure clean state
    startGemRef.current = null;
  };

  // MOBILE-SPECIFIC: Direct touch handler for better responsiveness
  const handleDirectTouch = (row: number, col: number) => {
    // Bypass all the start/end tracking for mobile - just direct click
    onGemClick(row, col);
  };

  if (gridSize === 0) {
    return <div className="board">Loading...</div>;
  }

  const activeMatchPositions = animationManager.getActiveMatchPositions();
  const isMobile = window.innerWidth <= 900;
  const boardPadding = isMobile ? '5px' : '10px';

  const boardStyle = {
    position: 'relative' as const,
    width: `${gridSize * gemSize}px`,
    height: `${gridSize * gemSize}px`,
    padding: boardPadding,
    backgroundColor: '#f0f0f0',
    borderRadius: isMobile ? '12px' : '8px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    margin: '0 auto',
    touchAction: 'none' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const,
  };

  return (
    <div ref={boardRef} className="board" style={boardStyle}>
      {board.map((row) =>
        row.map((gem) => {
          const isSelected =
            selectedGem !== null && selectedGem.row === gem.row && selectedGem.col === gem.col;
          const isPressed =
            startGemRef.current &&
            startGemRef.current.row === gem.row &&
            startGemRef.current.col === gem.col;

          return (
            <Gem
              key={gem.id}
              gem={gem}
              onClick={onGemClick}
              onStart={handleStart}
              onEnd={handleEnd}
              onDirectTouch={handleDirectTouch}
              isSelected={isSelected || Boolean(isPressed)}
              gemSize={gemSize}
            />
          );
        })
      )}
      <MatchEffects matches={activeMatchPositions} gemSize={gemSize} />
    </div>
  );
};

export default Board;
