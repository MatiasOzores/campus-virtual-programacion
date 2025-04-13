import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/campus-virtual-programacion/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
}) 