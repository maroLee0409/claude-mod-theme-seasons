// Autumn: a maple in full color, leaves on the wind, pumpkins by the door. Fallen
// leaves gather and the pile grows as the session's context fills. By day the dog
// takes a running jump into the pile.
import type { Usage } from '../types'
import {
  CABIN_GLOW, DOG_RUN, NIGHT_DOG, VEIL_DEF, W, cabin, canopy, f, falling, kf, kid, lamp, land, open, percentOf, pick, pine, post, rng, roundTree, signs,
  sky, trunk, tx, ty, veil,
} from './kit.js'
import { getLite } from './kit.js'
import type { Season } from './kit.js'

const LEAVES = ['#d9531e', '#e8892b', '#f0b83a', '#b83a2a', '#c96a2b'] as const
// One fallen leaf, turned by its number.
const leaf = (x: number, y: number, r: number, n: number): string =>
  `<path transform="translate(${x} ${y}) rotate(${(n * 53) % 360}) scale(${f(r / 5)})" d="M0 -6 q5 2 4 7 q-2 4 -4 5 q-2 -1 -4 -5 q-1 -5 4 -7Z" fill="${pick(LEAVES, n)}"/>`

type Parts = { head: string; back: string; lying: string[]; pile: string; burst: string; dog: string; front: string; night: string; leaves: string }
const still = (): Parts => {
  const rand = rng(1031)
  const wind = falling(rand, [
    { count: 26, rMin: 3.4, rMax: 5.4, seconds: 52, drift: 120, cls: 'leafy', shape: leaf },
    { count: 14, rMin: 5, rMax: 7.4, seconds: 36, drift: 190, cls: 'leafy', shape: leaf },
  ])

  const woods =
    (
      [
        [18, 716, 1.15, 'au0'], [238, 716, 0.8, 'au2'], [312, 714, 0.55, 'au1'], [428, 712, 0.45, 'au0'],
        [790, 712, 0.5, 'au2'], [846, 716, 0.78, 'au1'], [960, 720, 1.05, 'au0'], [1192, 722, 1.3, 'au1'],
      ] as const
    )
      .map(([x, y, k, cls]) => roundTree(x, y, k, cls))
      .join('') + `<g class="woods">${pine(368, 716, 0.62)}${pine(908, 712, 0.5)}</g>`

  // The maple: clumps of red, orange and rust, with single leaves picked out on top.
  let dots = ''

  for (let n = 0; n < 30; n++) {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand())
    dots += leaf(Math.round(112 + Math.cos(a) * d * 116), Math.round(505 + Math.sin(a) * d * 80), 4.5 + rand() * 2, n + 2)
  }
  const tree = `${trunk(118, 712, 1)}${canopy(rand, 112, 505, 104, 68, 28, 'maple')}${dots}`

  // The cabin in autumn: smoke from the chimney, a ring of leaves on the door, pumpkins.
  const pumpkin = (x: number, y: number, r: number): string =>
    `<ellipse cx="${x}" cy="${f(y - r * 0.8)}" rx="${r}" ry="${f(r * 0.8)}" fill="#e8762b"/><path d="M${x} ${f(y - r * 1.6)} q-${f(r * 0.5)} ${f(r * 0.8)} 0 ${f(r * 1.6)} M${x} ${f(y - r * 1.6)} q${f(r * 0.5)} ${f(r * 0.8)} 0 ${f(r * 1.6)}" stroke="#c45a1c" stroke-width="1" fill="none"/><path d="M${x} ${f(y - r * 1.6)} q1 -3 3 -3.500" stroke="#5a7a3a" stroke-width="1.800" fill="none" stroke-linecap="round"/>`
  const wreath = `<circle cx="1070" cy="672" r="6.500" fill="none" stroke="#c96a2b" stroke-width="3.600" stroke-dasharray="3 1.300"/>${[20, 110, 200, 290]
    .map((a, n) => `<circle cx="${f(1070 + 6.5 * Math.cos((a * Math.PI) / 180))}" cy="${f(672 + 6.5 * Math.sin((a * Math.PI) / 180))}" r="1.800" fill="${pick(LEAVES, n + 2)}"/>`)
    .join('')}`
  const house = cabin({
    hasLights: false,
    wreath,
    flags: ['#e8892b', '#fffaf0', '#b83a2a'],
    extra: `${pumpkin(1044, 712, 7)}${pumpkin(1034, 712, 4.5)}${pumpkin(1097, 712, 6)}<rect x="1118" y="696" width="26" height="16" rx="2" fill="#e3c06a" stroke="#c49a3c" stroke-width="1"/><path d="M1126 696 v16 M1136 696 v16" stroke="#c49a3c" stroke-width="1"/>`,
  })

  // The field, and every leaf that may come to lie on it.
  let grass = ''

  for (let n = 0; n < 56; n++) {
    const x = Math.round(rand() * W)
    const y = Math.round(704 + rand() * 44)
    grass += `M${x} ${y} l-3 -6 M${x} ${y} l1 -8 M${x} ${y} l4 -5 `
  }
  const lying: string[] = []

  for (let n = 0; n < 156; n++) {
    lying.push(leaf(Math.round(rand() * W), Math.round(704 + rand() * 44), 3.6 + rand() * 2.2, n))
  }
  // The pile, drawn around the middle of its base; it is scaled up as the context fills.
  let heap = ''

  for (let n = 0; n < 34; n++) {
    const x = -56 + rand() * 112
    const top = -46 * (1 - (x / 62) ** 2)
    heap += leaf(Math.round(x), Math.round(top * (0.25 + rand() * 0.75)) - 3, 5 + rand() * 2.5, n)
  }
  const pile = `<path d="M-68 2 Q-54 -34 -22 -44 Q4 -56 26 -42 Q56 -32 68 2Z" fill="#c9692b"/><path d="M-68 2 Q-40 -8 0 -6 Q40 -8 68 2Z" fill="#a8521f" opacity=".5"/>${heap}`
  let burst = ''

  for (let n = 0; n < 14; n++) {
    const a = (n / 14) * Math.PI * 2
    const d = 16 + rand() * 22
    burst += leaf(Math.round(Math.cos(a) * d), Math.round(Math.sin(a) * d * 0.8), 5 + rand() * 2, n + 1)
  }

  // The dog runs in, leaps, vanishes into the pile, peeks out, leaps clear and runs on.
  const dog = `<g transform="translate(600 713)"><g class="ax"><g class="ay"><g transform="scale(1.15)">${DOG_RUN}</g></g></g></g>`
  const dogCss =
    `.ax{animation:ax 26s linear infinite}.ay{animation:ay 26s linear infinite}.burst{opacity:0;transform-box:fill-box;transform-origin:center;animation:burst 26s linear infinite}` +
    kf('ax', [[0, tx(-700)], [36, tx(-120)], [42, tx(0)], [60, tx(0)], [65, tx(100)], [100, tx(700)]]) +
    kf('burst', [
      [0, 'opacity:0;transform:scale(.2)'],
      [41.9, 'opacity:0;transform:scale(.2)'],
      [42.6, 'opacity:1;transform:scale(.7)', 'ease-out'],
      [46, 'opacity:1;transform:translateY(-30px) scale(1.3)', 'ease-in'],
      [51, 'opacity:0;transform:translateY(14px) scale(1.5)'],
      [100, 'opacity:0;transform:scale(.2)'],
    ])
  // Someone leans on a rake beside the pile; geese cross the sky.
  const rake = `<path d="M9 -37 L31 -1" stroke="#8a5a34" stroke-width="2.200" stroke-linecap="round"/><path d="M24 -1 h14 M25 -1 v4 M29 -1 v4 M33 -1 v4 M37 -1 v4" stroke="#6b4630" stroke-width="1.500" stroke-linecap="round"/>`
  const raker = `<g transform="translate(1580 0) scale(-1 1)">${kid(790, 712, { coat: '#c9502a', dark: '#9c3a1c', hat: '#d9a52b', hatStyle: 'beanie', scarf: '#3f6ea8', gait: 'still', front: rake })}</g>`
  let flock = ''
  ;[[0, 0], [16, 9], [32, 18], [48, 27], [16, -9], [32, -18], [48, -27]].forEach(([dx = 0, dy = 0]) => {
    flock += `<path d="M${700 + dx} ${170 + dy} q5 -5 9 0 q4 -5 9 0"/>`
  })
  const day = `<g class="day">${raker}<g class="geese" fill="none" stroke="#6a5a52" stroke-width="2" stroke-linecap="round">${flock}</g></g>`

  // At night: an owl on a branch of the maple.
  const owl = `<g class="night"><path d="M146 596 q40 4 84 -10" stroke="#5f3721" stroke-width="5" stroke-linecap="round" fill="none"/><g transform="translate(212 589)"><ellipse cx="0" cy="-13" rx="10" ry="13" fill="#8a6a4a"/><ellipse cx="0" cy="-10" rx="6" ry="8" fill="#c9a97c"/><path d="M-9 -24 l2 -6 l5 5Z M9 -24 l-2 -6 l-5 5Z" fill="#8a6a4a"/><circle cx="-4" cy="-19" r="4.200" fill="#f6e27a"/><circle cx="4" cy="-19" r="4.200" fill="#f6e27a"/><circle class="bulb" cx="-4" cy="-19" r="1.800" fill="#2a2230"/><circle class="bulb" cx="4" cy="-19" r="1.800" fill="#2a2230"/><path d="M0 -17 l-2 4 h4Z" fill="#e09a2c"/><path d="M-4 0 v3 M4 0 v3" stroke="#e09a2c" stroke-width="1.600" stroke-linecap="round"/></g></g>`

  const head = `${open({
    skyDay: ['#fdf0d9', '#fbdcb6'],
    skyNight: ['#1c1424', '#3b2434'],
    defs: `${VEIL_DEF}<linearGradient id="field" gradientUnits="userSpaceOnUse" x1="0" y1="690" x2="0" y2="760"><stop offset="0" stop-color="#ead088"/><stop offset="1" stop-color="#d6ae58"/></linearGradient>`,
    css: `.snowline,.snowfill{display:none}
.far{fill:#ecd2ac}.peak{fill:#f6e6cc}.far2{fill:#dcaa6c}.treeline{fill:#b5652f}.hill2{fill:#d9b56a}.hill{fill:url(#field)}.hillB{fill:#f0da9c}
.grass{fill:none;stroke:#b8973f;stroke-width:1.5;stroke-linecap:round}
.au0{fill:#d9531e}.au1{fill:#e8892b}.au2{fill:#e9b53a}.maple .c0{fill:#e2622b}.maple .c1{fill:#f0902f}.maple .c2{fill:#c9402a}
.leafy{opacity:.9}.geese{animation:geese 110s linear infinite}@keyframes geese{from{transform:translateX(700px)}to{transform:translateX(-900px)}}
${wind.css}${dogCss}`,
    dark: `.far{fill:#2a1f38}.peak{fill:#8f7fa8;opacity:.4}.far2{fill:#241a2c}.treeline{fill:#1a1220}.leafy{opacity:.6}`,
  })}
${sky(rand)}${land(rand)}`

  const back = `${woods}${house}${tree}${post(false)}<path class="hillB" d="M0 700 Q150 680 330 696 T700 692 T1000 686 T1200 692 V760 H0Z"/><path class="hill" d="M0 712 Q260 692 560 714 T1200 704 V760 H0Z"/><path class="grass" d="${grass}"/>`

  return { head, back, lying, pile, burst, dog, front: `${day}${veil(0.52)}${CABIN_GLOW}`, night: `${owl}${NIGHT_DOG}`, leaves: wind.art }
}

let madeAt = -1
let made: Parts | undefined

// Leaves gather as the context fills: more of them lie about, and the pile grows from
// knee-high to shoulder-high. The dog's jump is sized to the pile it lands in.
const ground = (u: Usage | null, parts: Parts): string => {
  const p = percentOf(u)
  const grow = 1 + p * 0.006
  const tall = 50 * grow
  const inside = 14
  const peek = -(tall - 40)
  const over = -(tall + 14)
  const jump = kf('ay', [
    [0, ty(0)], [36, ty(0), 'ease-out'], [39, ty(over), 'ease-in'], [42, ty(inside)], [47, ty(inside), 'ease-out'], [49, ty(peek)],
    [57, ty(peek), 'ease-in'], [59, ty(inside), 'ease-out'], [62.5, ty(over), 'ease-in'], [65, ty(0)], [100, ty(0)],
  ])

  return `<style>${jump}</style>${parts.lying.slice(0, Math.round(24 + p * 1.32)).join('')}<g class="day">${parts.dog}</g>
<g transform="translate(600 716) scale(${f(grow)})">${parts.pile}</g><g class="day"><g transform="translate(600 ${f(716 - tall * 0.7)})"><g class="burst">${parts.burst}</g></g></g>`
}

// The top board in autumn: three leaves.
const TOP = { lift: 0, art: `${leaf(60, 88, 7, 0)}${leaf(71, 90, 5.5, 2)}${leaf(140, 89, 6, 1)}` }

export const autumn: Season = {
  key: 'autumn',
  label: '가을',
  colors: {
    label: 'Autumn',
    roles: { accent: '#b8501a', danger: '#c9302c', success: '#4e7d3a', warning: '#a86f14', pro: '#7a4a8c' },
    light: {
      gray: {
        anchors: { 'surface-0': '#f5ead8', 'surface-1': '#f9f1e3', 'surface-2': '#fdf8ee', 'text-primary': '#2a1c12', 'text-secondary': '#523b28', 'text-muted': '#70573f' },
      },
    },
    dark: {
      gray: {
        anchors: { 'surface-0': '#1f1518', 'surface-1': '#281b1e', 'surface-2': '#302225', 'surface-3': '#342528', 'text-primary': '#f7ecdd', 'text-secondary': '#dccbb6', 'text-muted': '#b5a28e' },
      },
    },
  },
  bubble: '#a8481a',
  alt: '낙엽 지는 가을: 단풍나무와 흩날리는 낙엽, 낮에는 낙엽 더미로 뛰어드는 강아지, 밤에는 부엉이, 사용량 팻말과 촛불, 가로등',
  scene: (u, now) => {
    if (made === undefined || madeAt !== getLite()) {
      made = still()
      madeAt = getLite()
    }

    return `${made.head}${made.back}${ground(u, made)}${made.front}${lamp(u, now)}${made.night}${signs(u, now, TOP)}${made.leaves}</svg>`
  },
}
