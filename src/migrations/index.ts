import * as migration_20250412_170155 from './20250412_170155';

export const migrations = [
  {
    up: migration_20250412_170155.up,
    down: migration_20250412_170155.down,
    name: '20250412_170155'
  },
];
