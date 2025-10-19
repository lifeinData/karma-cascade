import { GEM_SIZE_PX } from './constants.js';
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

interface GemProps {
  gem: GemData;
  onClick: (row: number, col: number) => void;
  onStart?: (row: number, col: number, event: React.MouseEvent | React.TouchEvent) => void;
  onEnd?: (row: number, col: number, event: React.MouseEvent | React.TouchEvent) => void;
  onDirectTouch?: (row: number, col: number) => void;
  isSelected: boolean;
  gemSize?: number;
}

const Gem = ({ gem, onClick, onStart, onEnd, onDirectTouch, isSelected, gemSize = GEM_SIZE_PX }: GemProps) => {
  const { color, row, col, isNew, isMatched } = gem;

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onStart) {
      onStart(row, col, e);
    }
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnd) {
      onEnd(row, col, e);
    }
  };

  // Mobile-specific: Direct touch handler for better responsiveness
  const handleDirectTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // On mobile, use direct touch for better responsiveness
    if (onDirectTouch && window.innerWidth <= 900) {
      onDirectTouch(row, col);
    } else if (onEnd) {
      onEnd(row, col, e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling during touch
    e.preventDefault();
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Reset any touch state
    if (onEnd) {
      onEnd(row, col, e);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onStart && !onEnd) {
      onClick(row, col);
    }
  };

  const animationState = animationManager.getGemAnimationState({
    row,
    col,
    isNew: isNew || false,
    isMatched: isMatched || false,
  });

  let gemClasses = animationManager.getGemClasses(animationState);
  if (isSelected) {
    gemClasses += ' selected';
  }

  const gemX = col * gemSize;
  const gemY = row * gemSize;

  const gemStyle = {
    backgroundColor: color,
    width: `${gemSize}px`,
    height: `${gemSize}px`,
    left: `${gemX}px`,
    top: `${gemY}px`,
    touchAction: 'none' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const,
    WebkitTapHighlightColor: 'transparent',
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
    ...(animationState.delay && {
      animationDelay: `${animationState.delay}ms`,
    }),
  };

  return (
    <div
      className={gemClasses}
      style={gemStyle}
      onClick={handleClick}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleDirectTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleTouchCancel}
      role="button"
      tabIndex={0}
      aria-label={`${color} gem at row ${row + 1}, column ${col + 1}`}
      data-gem-row={row}
      data-gem-col={col}
    >
      {/* Gem content */}
    </div>
  );
};

export default Gem;
