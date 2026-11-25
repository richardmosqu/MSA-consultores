import * as migration_20261124_213334_initial from './20261124_213334_initial';
import * as migration_20261125_022357_highlights_block from './20261125_022357_highlights_block';

export const migrations = [
  {
    up: migration_20261124_213334_initial.up,
    down: migration_20261124_213334_initial.down,
    name: '20261124_213334_initial',
  },
  {
    up: migration_20261125_022357_highlights_block.up,
    down: migration_20261125_022357_highlights_block.down,
    name: '20261125_022357_highlights_block'
  },
];
