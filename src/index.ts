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

const colorsReStr = /(?:\w+(?:-\d+)?|(?:#|hex-)[0-9a-f]{3,8})(?:\/\d+)?/.source
const colorBodyRe = new RegExp(`^-(${colorsReStr})`)

export function presetChroma(options: ChromaOptions = {}): Preset {
  const prefix = escapeRegExp(options.prefix ?? 'chroma-')
  const defaultSteps = options.steps ?? 7
  const defaultShapes = {
    linear: '0deg',
    radial: 'circle at 50% 50%',
    conic: 'at 50% 50%',
  }

  return {
    name: 'unocss-preset-chroma',
    rules: [
      [
        new RegExp(`^${prefix}(?:((?:linear|radial|conic))-)?(?:(\\d+)-)?(rgb|lab|hsl|lch)((?:-${colorsReStr}){2,})$`),
        ([, type = 'linear', precision, mode, body], { theme }) => {
          let steps = parseInt(precision || '0', 10)
          if (Number.isNaN(steps) || steps < 1)
            steps = defaultSteps
          const stops = resolveStops(steps, mode, body, theme)
          if (stops != null) {
            return {
              '--un-gradient-shape': defaultShapes[type],
              '--un-gradient-stops': stops.join(','),
              '--un-gradient': 'var(--un-gradient-shape), var(--un-gradient-stops)',
              'background-image': `${type}-gradient(var(--un-gradient))`,
            }
          }
        },
      ],

      [
        new RegExp(`^${prefix}stops-(?:(\\d+)-)?(rgb|lab|hsl|lch)((?:-${colorsReStr}){2,})$`),
        ([, precision, mode, body], { theme }) => {
          let steps = parseInt(precision || '0', 10)
          if (Number.isNaN(steps) || steps < 1)
            steps = defaultSteps
          const stops = resolveStops(steps, mode, body, theme)
          if (stops != null)
            return { '--un-gradient-stops': stops.join(',') }
        },
      ],

      [
        new RegExp(`^${prefix}shape-\\[(.+)\\]$`),
        ([, s]) => ({
          '--un-gradient-shape': s.replace(/_/g, ' '),
          '--un-gradient': `var(--un-gradient-shape), var(--un-gradient-stops)`,
        }),
      ],

      [
        new RegExp(`^${prefix}((?:repeating-)?(?:linear|radial|conic))$`),
        ([, s]) => ({
          'background-image': `${s}-gradient(var(--un-gradient, var(--un-gradient-stops, rgba(255, 255, 255, 0))))`,
        }),
      ],
    ],
  }
}

export default presetChroma

function resolveStops(steps: number, mode: string, body: string, theme: any) {
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
      .map(([c, p])  => [parseColor(c, theme)?.cssColor?.components?.join(','), Math.floor(i * 100 / s + p / s)])
      .map(([c, p]) => `rgb(${c}) ${p}%`)
    g.push(last ? r : r.slice(0, -1))
  }

  return g
}

function resolveChroma(steps: number, mode: string, start: string, end: string) {
  const scale = chroma.scale([start, end]).mode(mode).correctLightness()
  return [...Array(steps).keys()].map((_, i) => {
    const t = i / (steps - 1)
    return [scale(t).hex(), t * 100]
  })
}
