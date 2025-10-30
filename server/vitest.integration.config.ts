import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' }); // test DB

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    sequence: { concurrent: false },
    include: ['src/**/__tests__/integration/**/*.test.ts'],
    fileParallelism: false,
  },
});
