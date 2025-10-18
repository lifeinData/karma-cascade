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
  isSelected: boolean;
}

const Gem = ({ gem, onClick, isSelected }: GemProps) => {
  const { color, row, col, isNew, isMatched } = gem;
  
  const handleClick = () => {
    onClick(row, col);
  };

  // Get animation state from animation manager
  const animationState = animationManager.getGemAnimationState({ 
    row, 
    col, 
    isNew: isNew || false, 
    isMatched: isMatched || false 
  });
  
  // Get CSS classes including animation classes
  let gemClasses = animationManager.getGemClasses(animationState);
  if (isSelected) {
    gemClasses += ' selected';
  }
  
  // Calculate visual position
  const gemX = col * GEM_SIZE_PX;
  const gemY = row * GEM_SIZE_PX;
  
  const gemStyle = {
    backgroundColor: color,
    width: `${GEM_SIZE_PX}px`,
    height: `${GEM_SIZE_PX}px`,
    left: `${gemX}px`,
    top: `${gemY}px`,
    // Add animation delay if specified
    ...(animationState.delay && {
      animationDelay: `${animationState.delay}ms`
    })
  };

  // Debug logging for new gems (commented out to reduce console noise)
  // if (isNew) {
  //   console.log(`🆕 New gem at (${row}, ${col}) -> position (${gemX}px, ${gemY}px), color: ${color}`);
  // }

  return (
    <div className={gemClasses} style={gemStyle} onClick={handleClick}>
      {/* Gem content */}
    </div>
  );
};

export default Gem;