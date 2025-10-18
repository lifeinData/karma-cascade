// Inner representation types for level generation

export type BoardSchema = string[][];

export interface GeneratorConfig {
  gridSize: number;
  numColors: number;
  minMoves: number;
}

// Color mapping for schema to actual colors
export const COLOR_MAP: { [key: string]: string } = {
  'A': 'red',
  'B': 'blue',
  'C': 'green',
  'D': 'yellow',
  'E': 'purple',
  'F': 'orange',
  'G': 'cyan',
};
