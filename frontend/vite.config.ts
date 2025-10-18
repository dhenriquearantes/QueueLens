import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const plugins = [react()]
  
  if (command === 'build' || process.env.ELECTRON_DEV === 'true') {
    plugins.push(
      electron({
        entry: 'electron/main.js',
        onstart(options) {
          if (process.env.VITE_DEV_SERVER_URL) {
            options.startup()
          }
        },
        vite: {
          build: {
            sourcemap: true,
            minify: false,
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron']
            },
            lib: {
              entry: 'electron/main.js',
              formats: ['cjs'],
              fileName: () => 'main.cjs'
            }
          }
        }
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },
    server: {
      port: 3000
    }
  }
})
