import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),

    (!isSsrBuild &&
    visualizer({
      filename: 'build/client_stats.html',
      gzipSize: true,
      brotliSize: true,
    })),
  ],
}))
