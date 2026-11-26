// Spring: a cherry tree in bloom, petals on the wind, a meadow whose flowers come out
// as the session's context fills. By day someone walks the dog, which runs ahead to
// sniff the flowers.
import type { Usage } from '../types'
import {
  CABIN_GLOW, DOG_RUN, DOG_SNIFF, NIGHT_DOG, VEIL_DEF, W, cabin, canopy, f, falling, fireflies, kf, kid, lamp, land, open, percentOf, pick, post, rng,
  roundTree, signs, sky, swap, trunk, tx, veil,
} from './kit.js'
import { getLite } from './kit.js'
import type { Season } from './kit.js'

const BLOOMS = ['#ff7aa2', '#ffd166', '#ffffff', '#c77dff', '#ff9770', '#f25c7a'] as const

// A tulip or a daisy on its stem, rooted at x, y.
const flower = (x: number, y: number, h: number, n: number): string => {
  const color = pick(BLOOMS, n)
  const stem = `<path class="stem" d="M${x} ${y} v${f(-h)}"/>`

  return n % 2 === 0
    ? `${stem}<path d="M${f(x - 3.5)} ${f(y - h)} q0 -7 3.500 -8 q3.500 1 3.500 8 q-3.500 3 -7 0Z" fill="${color}"/>`
    : `${stem}<circle cx="${x}" cy="${f(y - h)}" r="3.200" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="2 1.350"/><circle cx="${x}" cy="${f(y - h)}" r="1.700" fill="#f6c343"/>`
}
// A five-petal blossom.
const blossom = (x: number, y: number, r: number, fill: string): string =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${fill}" stroke-width="${f(r * 1.3)}" stroke-dasharray="${f(r * 0.82)} ${f(r * 0.437)}"/><circle cx="${x}" cy="${y}" r="${f(r * 0.4)}" fill="#f6c343"/>`

type Parts = { head: string; back: string; flowers: Array<{ y: number; art: string }>; walk: string; front: string; night: string; petals: string }
const still = (): Parts => {
  const rand = rng(321)
  const petal = (x: number, y: number, r: number, n: number): string =>
    `<ellipse cx="${x}" cy="${y}" rx="${f(r)}" ry="${f(r * 0.55)}" transform="rotate(${(n * 47) % 180} ${x} ${y})"/>`
  const petals = falling(rand, [
    { count: 30, rMin: 2.2, rMax: 3.6, seconds: 58, drift: 150, cls: 'petal', shape: petal },
    { count: 16, rMin: 3.4, rMax: 5, seconds: 40, drift: 220, cls: 'petal p2', shape: petal },
  ])

  const woods = (
    [
      [18, 716, 1.15, 'bl'], [238, 716, 0.8, 'gr'], [312, 714, 0.55, 'bl2'], [368, 716, 0.7, 'gr2'], [428, 712, 0.45, 'bl'],
      [790, 712, 0.5, 'gr'], [846, 716, 0.78, 'bl2'], [908, 712, 0.55, 'gr2'], [960, 720, 1.05, 'bl'], [1192, 722, 1.3, 'gr'],
    ] as const
  )
    .map(([x, y, k, cls]) => roundTree(x, y, k, cls))
    .join('')

  // The cherry tree: clumps of blossom, then single blooms picked out on top.
  let dots = ''

  for (let n = 0; n < 34; n++) {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand())
    dots += `<circle cx="${f(112 + Math.cos(a) * d * 118)}" cy="${f(505 + Math.sin(a) * d * 82)}" r="${f(1.8 + rand() * 1.6)}" fill="${n % 3 === 0 ? '#ffffff' : '#ff8fb3'}"/>`
  }
  const tree = `${trunk(118, 712, 1)}${canopy(rand, 112, 505, 104, 68, 28, 'cherry')}${dots}`

  // The cabin in spring: boxes of flowers under the windows, a ring of blossom on the door.
  const box = (x: number): string =>
    `<rect x="${x - 3}" y="694" width="28" height="6" rx="1.5" fill="#8a5a34"/>${[0, 1, 2, 3]
      .map(n => `<circle cx="${x + 1 + n * 6.6}" cy="${n % 2 === 0 ? 691 : 692.5}" r="2.600" fill="${pick(BLOOMS, n + (x % 5))}"/>`)
      .join('')}<path d="M${x} 694 q5 -4 11 0 q5 -4 11 0" stroke="#4f9a54" stroke-width="1.6" fill="none"/>`
  const wreath = `<circle cx="1070" cy="672" r="6.500" fill="none" stroke="#6fb56a" stroke-width="3"/>${[0, 60, 120, 180, 240, 300]
    .map((a, n) => `<circle cx="${f(1070 + 6.5 * Math.cos((a * Math.PI) / 180))}" cy="${f(672 + 6.5 * Math.sin((a * Math.PI) / 180))}" r="2" fill="${pick(BLOOMS, n)}"/>`)
    .join('')}`
  const pot = (x: number, color: string): string =>
    `<path d="M${x - 5} 702 h10 l-1.500 10 h-7Z" fill="#c4683a"/><path d="M${x} 702 v-8 M${x - 3} 702 q-1 -5 -4 -6 M${x + 3} 702 q1 -5 4 -6" stroke="#4f9a54" stroke-width="1.400" fill="none"/><circle cx="${x}" cy="692.500" r="2.800" fill="${color}"/><circle cx="${x - 7}" cy="695" r="2.200" fill="${color}"/><circle cx="${x + 7}" cy="695" r="2.200" fill="${color}"/>`
  const house = cabin({
    hasLights: false,
    wreath,
    flags: ['#ff9ab8', '#fffaf0', '#8fd0a0'],
    extra: `${box(1008)}${box(1110)}${pot(1046, '#ff7aa2')}${pot(1095, '#ffd166')}`,
  })

  // The meadow: tufts of grass and a worn path; the flowers are picked per render.
  let grass = ''

  for (let n = 0; n < 70; n++) {
    const x = Math.round(rand() * W)
    const y = Math.round(704 + rand() * 44)
    grass += `M${x} ${y} l-3 -7 M${x} ${y} l1 -9 M${x} ${y} l4 -6 `
  }
  const flowers: Array<{ y: number; art: string }> = []

  for (let n = 0; n < 112; n++) {
    const x = Math.round(20 + rand() * (W - 40))
    const y = Math.round(703 + rand() * 44)
    flowers.push({ y, art: flower(x, y, 9 + rand() * 9, n) })
  }
  // The clump the dog stops at.
  const clump = `${flower(748, 713, 20, 0)}${flower(757, 714, 15, 3)}${flower(764, 712, 22, 4)}${flower(741, 714, 13, 1)}<path class="stem" d="M748 713 q-7 -4 -9 -10 M764 712 q7 -4 8 -11"/>`

  // Butterflies, by day.
  const butterfly = (x: number, y: number, color: string, cls: string): string =>
    `<g class="bf ${cls}"><g transform="translate(${x} ${y})"><g class="flap" fill="${color}"><path d="M0 0 q-11 -13 -15 -2 q0 8 15 2Z M0 0 q-9 4 -9 11 q5 3 9 -11Z M0 0 q11 -13 15 -2 q0 8 -15 2Z M0 0 q9 4 9 11 q-5 3 -9 -11Z"/></g><path d="M0 -5 v11 M0 -5 l-3 -5 M0 -5 l3 -5" stroke="#3a2a30" stroke-width="1.400" stroke-linecap="round" fill="none"/></g></g>`
  const butterflies = `<g class="day">${butterfly(430, 620, '#ffd166', '')}${butterfly(690, 590, '#c77dff', 'bf2')}${butterfly(880, 640, '#ff9770', 'bf3')}</g>`

  // Someone walks the dog; it runs ahead to the flowers, sniffs, and falls back in step.
  const leash = `<path d="M12 -22 q-16 8 -34 18" stroke="#c8323a" stroke-width="1.400" fill="none" stroke-linecap="round"/>`
  const walk = `<g class="day"><g class="walk">${kid(600, 712, { coat: '#f4a6c0', dark: '#d9779b', hat: '#6fb1e0', hatStyle: 'cap', pants: ['#4a6fa5', '#5b80b6'], gait: 'walk' })}</g>
<g transform="translate(600 713)"><g class="sx"><g transform="scale(1.15)">${leash}<g class="sa">${DOG_RUN}</g><g class="sb">${DOG_SNIFF}</g></g></g></g></g>`
  const walkCss =
    `.walk{animation:walk 44s linear infinite}@keyframes walk{from{transform:translateX(-680px)}to{transform:translateX(680px)}}
.sx{animation:sx 44s linear infinite}.sa{animation:sa 44s linear infinite}.sb{opacity:0;animation:sb 44s linear infinite}` +
    kf('sx', [[0, tx(-636)], [30, tx(-228)], [38, tx(120)], [58, tx(120)], [62, tx(207)], [100, tx(724)]]) +
    swap('sa', 'sb', 38, 58)

  const head = `${open({
    skyDay: ['#dff1fb', '#fdeef0'],
    skyNight: ['#15132e', '#2c2452'],
    defs: `${VEIL_DEF}<linearGradient id="meadow" gradientUnits="userSpaceOnUse" x1="0" y1="690" x2="0" y2="760"><stop offset="0" stop-color="#b9e394"/><stop offset="1" stop-color="#8fcf74"/></linearGradient>`,
    css: `.snowline,.snowfill,.smoke{display:none}
.far{fill:#d5ead0}.peak{fill:#f4faf1}.far2{fill:#bfe0b0}.treeline{fill:#8fc48a}.hill2{fill:#a9d68f}.hill{fill:url(#meadow)}.hillB{fill:#c4e8a4}
.trail{fill:none;stroke:#e9d9a8;stroke-width:15;stroke-linecap:round;opacity:.75}.grass{fill:none;stroke:#6fb35c;stroke-width:1.5;stroke-linecap:round}.stem{fill:none;stroke:#4f9a54;stroke-width:1.5;stroke-linecap:round}
.bl{fill:#ffb7cf}.bl2{fill:#ffd3e0}.gr{fill:#8fce7a}.gr2{fill:#a9dc8f}.cherry .c0{fill:#ffc2d6}.cherry .c1{fill:#ffaec9}.cherry .c2{fill:#ffd9e5}
.petal{fill:#ffb3cb;opacity:.85}.p2{fill:#ffd0de}
.bf{animation:bf 34s ease-in-out infinite}.bf2{animation-duration:41s;animation-delay:-12s}.bf3{animation-duration:29s;animation-delay:-20s}@keyframes bf{0%{transform:translate(0px,0px)}20%{transform:translate(70px,-36px)}45%{transform:translate(150px,10px)}70%{transform:translate(60px,34px)}100%{transform:translate(0px,0px)}}
.flap{transform-box:fill-box;transform-origin:center;animation:flap .42s ease-in-out infinite alternate}@keyframes flap{to{transform:scaleX(.3)}}
${petals.css}${walkCss}`,
    dark: `.far{fill:#252a55}.peak{fill:#8f97c9;opacity:.45}.far2{fill:#1f2a4a}.treeline{fill:#16203c}.petal{fill:#f3b6cc;opacity:.55}`,
  })}
${sky(rand)}${land(rand)}`

  const back = `${woods}${house}${tree}${post(false)}<path class="hillB" d="M0 700 Q150 680 330 696 T700 692 T1000 686 T1200 692 V760 H0Z"/><path class="hill" d="M0 712 Q260 692 560 714 T1200 704 V760 H0Z"/>
<path class="trail" d="M-20 724 Q300 708 600 724 T1220 716"/><path class="grass" d="${grass}"/>${clump}`

  return { head, back, flowers, walk, front: `${butterflies}${veil(0.5)}${CABIN_GLOW}`, night: `${fireflies(rand, 16)}${NIGHT_DOG}`, petals: petals.art }
}

let madeAt = -1
let made: Parts | undefined

// The top board in spring: a few blossoms.
const TOP = {
  lift: 0,
  art: `${blossom(60, 90, 4.4, '#ffb3cb')}${blossom(72, 86, 3.4, '#ffd0de')}${blossom(140, 91, 3.6, '#ffb3cb')}<path d="M64 92 q8 3 14 -2" stroke="#4f9a54" stroke-width="1.600" fill="none"/>`,
}

export const spring: Season = {
  key: 'spring',
  label: '봄',
  colors: {
    label: 'Spring',
    roles: { accent: '#c2457a', danger: '#c9302c', success: '#2e8b57', warning: '#b88410', pro: '#7a5cc2' },
    light: {
      gray: {
        anchors: { 'surface-0': '#f7eef1', 'surface-1': '#fbf4f6', 'surface-2': '#fefafb', 'text-primary': '#2b1a22', 'text-secondary': '#52394a', 'text-muted': '#735a68' },
      },
    },
    dark: {
      gray: {
        anchors: { 'surface-0': '#17142c', 'surface-1': '#1e1a38', 'surface-2': '#252044', 'surface-3': '#292449', 'text-primary': '#f6eef4', 'text-secondary': '#d8cadb', 'text-muted': '#b0a3bd' },
      },
    },
  },
  bubble: '#b93a6f',
  alt: '꽃 피는 봄: 벚나무와 흩날리는 꽃잎, 낮에는 산책하다 꽃 향기를 맡는 강아지, 밤에는 반딧불, 사용량 팻말과 촛불, 가로등',
  // The meadow blooms as the context fills: a handful of flowers at first, all of them when full.
  scene: (u: Usage | null, now) => {
    if (made === undefined || madeAt !== getLite()) {
      made = still()
      madeAt = getLite()
    }
    const shown = made.flowers.slice(0, Math.round(16 + percentOf(u) * 0.96))
    const behind = shown.filter(one => one.y <= 714)
    const ahead = shown.filter(one => one.y > 714)

    return `${made.head}${made.back}${behind.map(one => one.art).join('')}${made.walk}${ahead.map(one => one.art).join('')}${made.front}${lamp(u, now)}${made.night}${signs(u, now, TOP)}${made.petals}</svg>`
  },
}
