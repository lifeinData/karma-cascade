/**
 * Drag and touch utilities for gem swapping
 */

export interface DragState {
  isDragging: boolean;
  startPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
  startGem: { row: number; col: number } | null;
  targetGem: { row: number; col: number } | null;
}

export interface GemPosition {
  row: number;
  col: number;
}

/**
 * Calculate which gem is at a given screen position
 */
export const getGemAtPosition = (
  x: number,
  y: number,
  boardElement: HTMLElement,
  gemSize: number,
  gridSize: number
): GemPosition | null => {
  const boardRect = boardElement.getBoundingClientRect();
  
  // Calculate relative position within the board
  const relativeX = x - boardRect.left;
  const relativeY = y - boardRect.top;
  
  // Account for board padding (5px or 10px)
  const padding = 10; // Adjust based on your board padding
  const adjustedX = relativeX - padding;
  const adjustedY = relativeY - padding;
  
  // Calculate grid position
  const col = Math.floor(adjustedX / gemSize);
  const row = Math.floor(adjustedY / gemSize);
  
  // Check if position is within grid bounds
  if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
    return { row, col };
  }
  
  return null;
};

/**
 * Check if two gems are adjacent (can be swapped)
 */
export const areGemsAdjacent = (gem1: GemPosition, gem2: GemPosition): boolean => {
  const rowDiff = Math.abs(gem1.row - gem2.row);
  const colDiff = Math.abs(gem1.col - gem2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

/**
 * Calculate drag direction and distance
 */
export const getDragDirection = (
  startPos: { x: number; y: number },
  currentPos: { x: number; y: number }
): { direction: 'up' | 'down' | 'left' | 'right' | null; distance: number } => {
  const deltaX = currentPos.x - startPos.x;
  const deltaY = currentPos.y - startPos.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Minimum distance threshold to register as a drag - reduced for mobile
  if (distance < 15) {
    return { direction: null, distance };
  }
  
  // Determine primary direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return { direction: deltaX > 0 ? 'right' : 'left', distance };
  } else {
    return { direction: deltaY > 0 ? 'down' : 'up', distance };
  }
};

/**
 * Get target gem position based on drag direction
 */
export const getTargetGemFromDirection = (
  startGem: GemPosition,
  direction: 'up' | 'down' | 'left' | 'right'
): GemPosition => {
  switch (direction) {
    case 'up':
      return { row: startGem.row - 1, col: startGem.col };
    case 'down':
      return { row: startGem.row + 1, col: startGem.col };
    case 'left':
      return { row: startGem.row, col: startGem.col - 1 };
    case 'right':
      return { row: startGem.row, col: startGem.col + 1 };
  }
};