# unocss-preset-chroma

<p>
  <a href="https://npmjs.com/package/unocss-preset-chroma" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/v/unocss-preset-chroma" alt="npm version">
  </a>
  <a href="https://nodejs.org/en/about/releases/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/node/v/unocss-preset-chroma" alt="node version">
  </a>
</p>

> chroma-js gradient for UnoCSS

## Installation

```sh
npm i unocss-preset-chroma unocss --save-dev # with npm
yarn add unocss-preset-chroma unocss -D # with yarn
pnpm add unocss-preset-chroma unocss -D # with pnpm
```

## Usage

```js
// unocss.config.js
import { presetUno, defineConfig } from 'unocss'
import { presetChroma } from 'unocss-preset-chroma'

export default defineConfig({
  presets: [
    presetUno(), // for color theme
    presetChroma(),
  ],
})
```

## Utilities

- Shorthand gradient + stops:

  `chroma-(linear|radial|conic)-(rgb|lab|hsl|lch)-<colors>`

  Where `<colors>` is dash-separated hex color.

- Stops only:

  `chroma-stops-(rgb|lab|hsl|lch)-<color-1>-<color-2>-<color-n>`

- Shape:

  `chroma-shape-[contour/size/potiion/direction/etc]`

- Base gradient function (`background-image`):

  `chroma-(linear|radial|conic)`

### Type of `ChromaOptions`

```ts
export interface ChromaOptions {
  /**
   * Class prefix for matching gradient rules.
   *
   * @defaultValue `chroma-`
   */
  prefix?: string
  /**
   * Number of gradient steps to generate.
   *
   * @defaultValue 7
   */
  steps?: number
}
```

## Acknowledgement

- [Polychroma](https://polychroma.app/)
- [chroma.js](https://vis4.net/chromajs/)
- [Make Beautiful Gradients](https://www.joshwcomeau.com/css/make-beautiful-gradients/) by Josh Comeau

## License

MIT

## Demo

Clone the repo, run `pnpm dev`.
