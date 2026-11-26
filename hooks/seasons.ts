// The four seasons, and how one is chosen: by name, or by the month.
import type { SeasonKey } from '../types'
import { autumn } from './autumn.js'
import type { Season } from './kit.js'
import { spring } from './spring.js'
import { summer } from './summer.js'
import { winter } from './winter.js'

export const SEASONS: Record<SeasonKey, Season> = { spring, summer, autumn, winter }
export type Choice = SeasonKey | 'auto'

const WORDS = new Map<string, Choice>([
  ['봄', 'spring'], ['spring', 'spring'],
  ['여름', 'summer'], ['summer', 'summer'],
  ['가을', 'autumn'], ['autumn', 'autumn'], ['fall', 'autumn'],
  ['겨울', 'winter'], ['winter', 'winter'],
  ['자동', 'auto'], ['auto', 'auto'],
])
export const parseChoice = (text: unknown): Choice | undefined =>
  typeof text === 'string' ? WORDS.get(text.trim().toLowerCase()) : undefined

// The season of a month (0 is January), north of the equator.
export const byMonth = (month: number): SeasonKey =>
  month <= 1 || month === 11 ? 'winter' : month <= 4 ? 'spring' : month <= 7 ? 'summer' : 'autumn'
export const seasonOf = (choice: Choice, now: number): SeasonKey =>
  choice === 'auto' ? byMonth(new Date(now).getMonth()) : choice
