import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
<<<<<<< Updated upstream
=======
  server: {
    proxy: {
      '/api': {
        target: 'https://online-shopping-system-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
>>>>>>> Stashed changes
})
