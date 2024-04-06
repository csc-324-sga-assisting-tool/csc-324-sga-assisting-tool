// Colors defined by tailwind / flowbite
type Color =
  | 'gray'
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'amber'
  | 'slate'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'orange'
  | 'lime'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

// Colors defined from our palette
type PaletteColor = 'pallete-1' | 'pallete-2' | 'pallete-3' | 'pallete-4';
('pallete-5');

export type {Color, PaletteColor};
