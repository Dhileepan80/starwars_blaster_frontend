import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      // sourcemap: mode === 'development',
    sourcemap: env.VITE_GENERATE_SOURCEMAP === 'true',
    }
  }
})
