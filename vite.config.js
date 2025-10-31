import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
    fs: {
      strict: true,
      allow: [
        // Only allow serving files from the project root
        process.cwd()
      ]
    }
  },
  preview: {
    port: 5174,
    host: 'localhost'
  },
  // Disable pre-bundling to avoid scanning unrelated files
  optimizeDeps: {
    disabled: true
  }
})



