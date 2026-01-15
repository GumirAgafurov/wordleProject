import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  base: 'https://github.com/GumirAgafurov/wordleProject/', 
=======
  base: '/wordleProject/', 
>>>>>>> 0f03a4e165124859f761c87bcf323ba6d891919f
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  },
  server: {
    port: 3000,
  }
<<<<<<< HEAD
})
=======
})

>>>>>>> 0f03a4e165124859f761c87bcf323ba6d891919f
