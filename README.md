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

`chroma-linear-<mode>-<color-1>-<color-2>-<color-n>`

Value for `mode` are: `rgb`, `lab`, `hsl`, or `lch`.

`chroma-linear-direction-<angle>`

For rotating the gradient.

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

## License

MIT
