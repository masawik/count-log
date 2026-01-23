import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),

    (!isSsrBuild &&
    visualizer({
      filename: 'dist/client_stats.html',
      gzipSize: true,
      brotliSize: true,
    })),
  ],
  base: '/<repo>/',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
  },
}))
