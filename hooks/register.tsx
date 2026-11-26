import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionUsage, ThemeSetArgs } from 'claude-code'

import type { SeasonKey, Usage } from '../types'
import { getLite, setLite } from './kit.js'
import { makeColors } from './make-colors.js'
import { SEASONS, parseChoice, seasonOf } from './seasons.js'
import type { Choice } from './seasons.js'

// The season a session opens in until the person picks one with /season.
const DEFAULT: Choice = 'winter'
const MARK: Record<SeasonKey, string> = { spring: '🌸', summer: '🏖️', autumn: '🍂', winter: '🎄' }

const usage = atom({ plugin: 'christmas-snow', key: 'usage' } as const, null)

// A season's whole look: its colors, its scene by name, the person's bubble in its color.
type Look = { whole: ThemeSetArgs; plain: ThemeSetArgs; problem: string | undefined }
const looks = new Map<SeasonKey, Look>()
const lookOf = (key: SeasonKey): Look => {
  let look = looks.get(key)

  if (look === undefined) {
    const one = SEASONS[key]
    const { theme, problems } = makeColors(one.colors)
    const plain: ThemeSetArgs = { colors: theme, backdrop: { scene: key } }
    look = {
      plain,
      whole: { ...plain, style: { UserMessage: { backgroundColor: one.bubble, color: '#fff6e6', radius: 14 } } },
      // While you build: the line that would stop Desktop painting this look.
      problem: problems.find(line => line.startsWith("Desktop won't paint")),
    }
    looks.set(key, look)
  }

  return look
}

const parseSeason = (name: unknown): SeasonKey | undefined => {
  const choice = parseChoice(name)

  return choice === 'auto' ? undefined : choice
}

const toUsage = (u: Pick<SessionUsage, 'context' | 'rateLimits' | 'cost'>, at: number): Usage => {
  const fiveHour = u.rateLimits.find(limit => limit.kind === 'five_hour')

  return {
    at,
    ...(u.context.percent !== undefined && { percent: u.context.percent }),
    ...(fiveHour !== undefined && { fiveHour: Math.round(fiveHour.percentUsed) }),
    ...(u.cost !== undefined && { usd: u.cost.usd }),
  }
}

// The same figures as one status line, for surfaces that draw no scene.
const statusLine = (u: Usage, key: SeasonKey): string => {
  const parts: string[] = []

  if (u.percent !== undefined) {
    parts.push(`문맥 ${u.percent}%`)
  }

  if (u.fiveHour !== undefined) {
    parts.push(`5시간 ${u.fiveHour}%`)
  }

  if (u.usd !== undefined) {
    parts.push(`약 $${u.usd.toFixed(2)}(추정)`)
  }

  return parts.length === 0 ? `${MARK[key]} ${SEASONS[key].label}` : `${MARK[key]} ${parts.join(' · ')}`
}

// The season showing now. A reload starts it over, and session.start sets it again.
let current: SeasonKey = 'winter'
const show = async ($: EngineInterface, key: SeasonKey): Promise<void> => {
  const look = lookOf(key)

  if (look.problem !== undefined) {
    $.ui.toast(look.problem)
  }
  // An older build takes no style: set the look again without it.
  await $.theme.set(look.whole).catch(() => $.theme.set(look.plain))
  current = key
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'season',
      description: '배경 계절 바꾸기: 봄, 여름, 가을, 겨울, 자동(달에 맞춤)',
      argumentHint: '봄|여름|가을|겨울|자동',
    })
    await $.command.register({
      name: 'lite',
      description: '배경을 가볍게 그리는 정도 바꾸기(메모리 줄이기): 0 전부 움직임, 1 눈 줄임, 2 눈·반짝임 없음, 3 움직임 없음',
      argumentHint: '0|1|2|3',
    })
    setLite(Number(await $.store.get('lite')))
    const now = await $.clock.now()
    await show($, seasonOf(parseChoice(await $.store.get('season')) ?? DEFAULT, now))
    const first = toUsage(await $.session.usage(), now)
    await update($, usage, () => first)
    $.ui.status(statusLine(first, current))

    return next(e)
  })

  on('command.run', { command: 'season' }, async ($, e) => {
    const choice = parseChoice(e.args)

    if (choice === undefined) {
      return { text: `지금은 ${SEASONS[current].label}입니다. 바꾸려면 /season 뒤에 봄, 여름, 가을, 겨울, 자동 가운데 하나를 붙여 주세요.` }
    }
    await $.store.set('season', choice)
    await show($, seasonOf(choice, await $.clock.now()))
    const now = await read($, usage)

    if (now !== null) {
      $.ui.status(statusLine(now, current))
    }

    return {
      text:
        choice === 'auto'
          ? `계절을 달에 맞춰 자동으로 고릅니다. 지금은 ${SEASONS[current].label}입니다.`
          : `${SEASONS[current].label} 테마로 바꿨습니다. 새로 여는 세션도 ${SEASONS[current].label}로 열립니다.`,
    }
  })

  on('command.run', { command: 'lite' }, async ($, e) => {
    const text = e.args.trim()

    if (!/^[0-3]$/.test(text)) {
      return { text: `지금 가볍게 하는 정도는 ${getLite()}단계입니다. /lite 0~3 중 하나를 붙여 주세요. (0 전부 움직임, 1 눈 줄임, 2 눈·반짝임 없음, 3 움직임 없음) 앱을 다시 켜야 모든 세션에 적용됩니다.` }
    }
    await $.store.set('lite', Number(text))
    setLite(Number(text))

    return { text: `${text}단계로 저장했습니다. 이 세션에는 바로 적용되고, 다른 세션은 새로 열 때부터 적용됩니다.` }
  })

  on('session.measure', async ($, e, next) => {
    const now = toUsage(e, await $.clock.now())
    await update($, usage, () => now)
    $.ui.status(statusLine(now, current))

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    // The theme names its scene after the season, so the two never disagree.
    const one = SEASONS[parseSeason(e.props.scene) ?? current]

    return <Svg source={one.scene(await read($, usage), await $.clock.now())} alt={one.alt} isInteractive />
  })
}
