// Unified match detection system for both schema and gem boards

export interface Position {
  row: number;
  col: number;
}

export interface MatchResult {
  matches: Set<string>;
  components: Array<{
    color: string;
    positions: Position[];
    size: number;
  }>;
}

// Generic color extractor interface
export interface ColorExtractor<T> {
  getColor(item: T): string | null;
  isValid(item: T): boolean;
}

// Color extractor for schema (string[][])
export const schemaColorExtractor: ColorExtractor<string> = {
  getColor: (item: string) => item || null,
  isValid: (item: string) => Boolean(item),
};

// Color extractor for Gem objects
export const gemColorExtractor: ColorExtractor<{ color: string }> = {
  getColor: (item: { color: string }) => (item.color === 'gray' ? null : item.color),
  isValid: (item: { color: string }) => Boolean(item && item.color !== 'gray'),
};

// Generic connected component detection
export function findConnectedComponents<T>(
  grid: T[][],
  colorExtractor: ColorExtractor<T>,
  minComponentSize: number = 3
): MatchResult {
  const gridRows = grid.length;
  if (gridRows === 0) return { matches: new Set(), components: [] };

  const gridCols = grid[0]?.length || 0;
  if (gridCols === 0) return { matches: new Set(), components: [] };

  const visited = new Set<string>();
  const matches = new Set<string>();
  const components: Array<{ color: string; positions: Position[]; size: number }> = [];

  // Generic flood fill function
  const floodFill = (startRow: number, startCol: number, targetColor: string): Position[] => {
    const component: Position[] = [];
    const stack: Position[] = [{ row: startRow, col: startCol }];

    while (stack.length > 0) {
      const { row, col } = stack.pop()!;
      const key = `${row}-${col}`;

      // Skip if already visited or out of bounds
      if (visited.has(key) || row < 0 || row >= gridRows || col < 0 || col >= gridCols) {
        continue;
      }

      const item = grid[row]?.[col];
      if (!item || !colorExtractor.isValid(item)) {
        continue;
      }

      const itemColor = colorExtractor.getColor(item);
      if (itemColor !== targetColor) {
        continue;
      }

      // Mark as visited and add to component
      visited.add(key);
      component.push({ row, col });

      // Add adjacent cells (up, down, left, right - no diagonals)
      stack.push(
        { row: row - 1, col: col }, // up
        { row: row + 1, col: col }, // down
        { row: row, col: col - 1 }, // left
        { row: row, col: col + 1 } // right
      );
    }

    return component;
  };

  // Find all connected components
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const key = `${row}-${col}`;
      if (visited.has(key)) continue;

      const item = grid[row]?.[col];
      if (!item || !colorExtractor.isValid(item)) continue;

      const color = colorExtractor.getColor(item);
      if (!color) continue;

      const componentPositions = floodFill(row, col, color);

      // Only consider components with minimum size as matches
      if (componentPositions.length >= minComponentSize) {
        const component = {
          color,
          positions: componentPositions,
          size: componentPositions.length,
        };

        components.push(component);

        // Add all positions to matches set
        componentPositions.forEach((pos) => {
          matches.add(`${pos.row}-${pos.col}`);
        });
      }
    }
  }

  return { matches, components };
}

// Convenience function for schema boards
export function findSchemaMatches(schema: string[][], minComponentSize: number = 3): MatchResult {
  return findConnectedComponents(schema, schemaColorExtractor, minComponentSize);
}

// Convenience function for gem boards
export function findGemMatches(
  board: { color: string }[][],
  minComponentSize: number = 3
): MatchResult {
  return findConnectedComponents(board, gemColorExtractor, minComponentSize);
}

// Check if a schema has any matches (for validation)
export function hasMatches(schema: string[][]): boolean {
  const result = findSchemaMatches(schema);
  return result.matches.size > 0;
}

// Check if placing a color at a position would create matches
export function wouldCreateMatches(schema: string[][], row: number, col: number): boolean {
  const gridRows = schema.length;
  if (gridRows === 0 || !schema[row] || !schema[row][col]) return false;

  // Create a temporary single-position grid to check just this position's component
  const color = schema[row][col];
  if (!color) return false;

  const visited = new Set<string>();
  let componentSize = 0;

  // Simplified flood fill just for this position
  const stack: Position[] = [{ row, col }];

  while (stack.length > 0) {
    const { row: r, col: c } = stack.pop()!;
    const key = `${r}-${c}`;

    if (visited.has(key) || r < 0 || r >= gridRows || c < 0 || c >= (schema[0]?.length || 0)) {
      continue;
    }

    const checkRow = schema[r];
    if (!checkRow || !checkRow[c] || checkRow[c] !== color) {
      continue;
    }

    visited.add(key);
    componentSize++;

    stack.push(
      { row: r - 1, col: c },
      { row: r + 1, col: c },
      { row: r, col: c - 1 },
      { row: r, col: c + 1 }
    );
  }

  return componentSize >= 3;
}
