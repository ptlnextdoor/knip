import { defineConfig } from 'vite-plus';
import { sharedTasks } from './tasks.ts';

export default defineConfig({
  run: {
    tasks: {
      sprite: {
        command: 'node scripts/build-sprite.ts',
      },
      ...sharedTasks,
    },
  },
  staged: {
    '*.ts': 'node scripts/check-format.ts',
  },
});
