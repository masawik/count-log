import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: [
      './src/pages/**',
    ],
    rules: {
      'fsd/no-segmentless-slices': 'off',
    },
  },
  {
    rules: {
      'fsd/insignificant-slice': 'warn',
    },
  },
  {
    files: [
      './src/shared/db/types.ts',
    ],
    rules: {
      'fsd/forbidden-imports': 'off',
    },
  },
])
