import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint';
import alias from '@rollup/plugin-alias'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

const projectRoot = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslintPlugin({
      include: "src/**/*.{js,jsx,ts,tsx,vue}",
      exclude: ['node_modules', 'index.html', 'vite/preload-helper']
    }),
    tsconfigPaths(),
    vue(),
    alias({
      entries: [
        {
          find: '@',
          replacement: resolve(projectRoot, 'src')
        }
      ]
    })
  ]
})
