import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: '192.168.0.158',  // Isso fará com que o Vite seja acessível em qualquer IP da rede
    port: 5000 // Altere para a porta que você preferir
  }
})
