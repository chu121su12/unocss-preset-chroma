import { defineConfig } from 'vite'
import { presetUno } from 'unocss'
import { presetChroma } from './src'
import unocss from 'unocss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    unocss({
      presets: [
        presetUno(),
        presetChroma(),
      ],
    }),
  ],
  build: {
    minify: mode === 'demo',
    lib:
      mode === 'demo'
        ? false
        : {
            entry: './src/index.ts',
            formats: ['es'],
            fileName: () => 'index.js',
          },
    rollupOptions: {
      external: ['unocss'],
    },
  },
}))
