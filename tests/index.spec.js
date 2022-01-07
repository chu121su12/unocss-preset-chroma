import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { createGenerator, presetUno } from 'unocss'
import { presetChroma } from 'unocss-preset-chroma'
import { genSnapshot } from './utils.js'

const update = process.argv.includes('-u')
const chroma = suite('chroma')

chroma('chroma-gradient', async () => {
  const generator = createGenerator({
    presets: [
      presetUno(),
      presetChroma(),
    ],
  })

  const target = [
    'chroma-linear-lab-#000080-#ffff00',
    'chroma-linear-hsl-#008000-#ff00ff',
    'chroma-linear-lch-#800000-#00ffff',
    'chroma-linear-direction-30',
  ].join(' ')

  const { css } = await generator.generate(target)
  console.log({target, css})
  const expected = genSnapshot(css, 'chroma-gradient', update)

  assert.snapshot(css, expected)
})

chroma.run()
