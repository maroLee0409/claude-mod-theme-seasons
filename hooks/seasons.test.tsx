import { expect, test } from 'claude-code/testing'

import { getLite, setLite } from './kit.js'
import { SEASONS, byMonth, parseChoice, seasonOf } from './seasons.js'

const SCENE = { plugin: 'christmas-snow', component: 'Backdrop', surface: 'desktop' } as const
const NOW = Date.UTC(2026, 10, 25)

test('every season draws a scene the app takes', async ($, on) => {
  on('clock.now', () => ({ value: NOW }))

  for (const scene of ['spring', 'summer', 'autumn', 'winter']) {
    const ui = await $.ui.mount({ ...SCENE, props: { scene, glass: {} } })

    expect(await ui.find({ type: 'Svg' })).toBeDefined()
    await ui.unmount()
  }
})

test('a scene stays under the size the app accepts, empty or full', () => {
  for (const season of Object.values(SEASONS)) {
    for (const percent of [0, 50, 100]) {
      const svg = season.scene({ percent, fiveHour: 99, usd: 123.45, at: NOW - 600000 }, NOW)

      expect(svg.length).toBeLessThan(131072)
      expect(svg.endsWith('</svg>')).toBe(true)
    }
    expect(season.scene(null, NOW).length).toBeLessThan(131072)
  }
})

test('a season is chosen by its name in Korean or English, or by the month', () => {
  expect(parseChoice('가을')).toBe('autumn')
  expect(parseChoice(' Spring ')).toBe('spring')
  expect(parseChoice('자동')).toBe('auto')
  expect(parseChoice('장마')).toBeUndefined()
  expect(parseChoice('constructor')).toBeUndefined()
  expect(parseChoice(undefined)).toBeUndefined()

  expect([11, 0, 1].map(byMonth)).toEqual(['winter', 'winter', 'winter'])
  expect([2, 4, 5, 7, 8, 10].map(byMonth)).toEqual(['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn'])
  expect(seasonOf('summer', NOW)).toBe('summer')
  expect(seasonOf('auto', NOW)).toBe('autumn')
})

test('each lighter level draws less and moves less', () => {
  const NOW_AT = { percent: 40, fiveHour: 10, usd: 1, at: NOW - 600000 }
  const sizes: number[] = []

  for (const level of [0, 1, 2, 3]) {
    setLite(level)
    const svg = SEASONS.winter.scene(NOW_AT, NOW)
    sizes.push(svg.length)
    expect(svg.includes('*{animation:none!important}')).toBe(level === 3)
    expect(svg.includes('.bulb,.cloud,.rays')).toBe(level === 2)
  }
  // Fewer falling flakes make a smaller scene, step by step.
  expect(sizes[1] ?? 0).toBeLessThan(sizes[0] ?? 0)
  expect(sizes[2] ?? 0).toBeLessThan(sizes[1] ?? 0)

  setLite(9)
  expect(getLite()).toBe(0)
  setLite(0)
})
