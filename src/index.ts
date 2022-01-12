import type { Preset } from 'unocss'
import { escapeRegExp } from 'unocss'
import { parseColor } from '@unocss/preset-mini'
import chroma from 'chroma-js'

/**
 * @public
 */
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

export function presetChroma(options: ChromaOptions = {}): Preset {
  const prefix = escapeRegExp(options.prefix ?? 'chroma-')
  const steps = options.steps ?? 7
  const colorBodyRe = /^-((?:\w+(?:-\d+)?|(?:#|hex-)[0-9a-f]{3,8})(?:\/\d+)?)/

  return {
    name: 'unocss-preset-chroma',
    rules: [
      [
        new RegExp(`^${prefix}(?:(linear|radial|conic)-)?(rgb|lab|hsl|lch)((?:-(?:\\w+(?:-\\d+)?|(?:#|hex-)[0-9a-f]{3,8})(?:\\/\\d+)?){2,})$`),
        ([, gradient = 'linear', mode, body], { theme }) => {
          const cs: any[] = []
          while (true) {
            const m = body.match(colorBodyRe)
            if (!m)
              break

            const c = parseColor(m[1] ?? '', theme)
            if (!(c && c.color))
              return

            cs.push(c)
            body = body.replace(colorBodyRe, '')
          }

          if (body.length)
            return

          const g: string[][] = []
          const s = cs.length - 1
          for (let i = 0; i < s; i++) {
            const last = i === s - 1
            const r = resolveChroma(last ? steps : steps + 1, mode, cs[i].color, cs[i + 1].color)
              .map(([c, p])  => [parseColor(c, theme)!.rgba!.join(','), Math.floor(i * 100 / s + p / s)])
              .map(([c, p]) => `rgb(${c}) ${p}%`)
            g.push(last ? r : r.slice(0, -1))
          }

          return {
            '--un-gradient-direction': {
              linear: '0deg',
              radial: 'circle at 50% 50%',
              conic: 'at 50% 50%',
            }[gradient],
            'background-image': `${gradient}-gradient(var(--un-gradient-direction),${g.join(',')})`,
          }
        },
      ],

      [
        new RegExp(`^${prefix}direction-\\[(.+)\\]$`), ([, s]) => ({ '--un-gradient-direction': s.replace(/_/g, ' ') }),
      ],

      [
        new RegExp(`^${prefix}linear-direction-(-?[0-9.]+)$`),
        ([, n]) => {
          const num = parseFloat(n)
          if (!Number.isNaN(num))
            return { '--un-gradient-direction': `${num.toFixed(10).replace(/\.0+$/, '').replace(/(\.\d+?)0+$/, '$1')}deg` }
        },
      ],
    ],
  }
}

export default presetChroma

function resolveChroma(steps: number, mode: string, start: string, end: string) {
  const scale = chroma.scale([start, end]).mode(mode).correctLightness()
  return [...Array(steps).keys()].map((_, i) => {
    const t = i / (steps - 1)
    return [scale(t).hex(), t * 100]
  })
}
