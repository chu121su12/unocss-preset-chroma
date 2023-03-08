import { describe, expect, it } from 'vitest'
import { createGenerator, presetUno } from 'unocss'
import { presetChroma } from '../src/index'

describe('chroma preset', async () => {
  it('generate gradient css', async () => {
    const generator = createGenerator({
      presets: [
        presetUno(),
        presetChroma(),
      ],
    })

    const target = [
      'chroma-rgb-#ff0-#00f chroma-shape-[90deg]',
      'chroma-conic-hsl-#a08df7-#fff-#ffe261',
      'chroma-linear-lab-#000080-#ffff00',
      'chroma-linear-hsl-#008000-#ff00ff',
      'chroma-linear-lch-#800000-#00ffff',
      'chroma-linear-direction-30',
    ].join(' ')

    const { css } = await generator.generate(target, { preflights: false })
    expect(css).toMatchSnapshot()
  })
})
