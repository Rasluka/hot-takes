import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default defineConfig({
  test: {
    globals: true, // allows describe/it/expect without importing
    environment: 'node', // for backend testing
    include: ['src/**/__tests__/**/*.test.ts'],
    exclude: ['**/*.integration.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
