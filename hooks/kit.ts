// The parts every season's scene is built from: sky, land, trees, the cabin, the lamp,
// the signs, people and the dog. A scene is one SVG string; all motion is CSS.
import type { SeasonKey, Usage } from '../types'

export const W = 1200
export const H = 750
export const HOUR = 3600
export const BULBS = ['#e04848', '#f0b83a', '#fff3dd', '#4fb3a5'] as const
export const f = (n: number): string => n.toFixed(1)

// How light the scene is drawn, 0 (everything moves) to 3 (nothing moves). It is read
// once when a session starts, and a scene is built again when it changes.
//   1: one thin layer of falling things   2: nothing falls, no blinking, drifting or smoke   3: no motion at all
let lite = 0
export const getLite = (): number => lite
export const setLite = (level: number): void => {
  lite = Number.isInteger(level) && level >= 0 && level <= 3 ? level : 0
}

export type Rand = () => number
export const rng = (start: number): Rand => {
  let seed = start

  return () => {
    seed = (seed * 16807) % 2147483647

    return seed / 2147483647
  }
}
export const pick = <T>(list: readonly T[], n: number): T => list[n % list.length] as T
export const percentOf = (u: Usage | null): number => Math.min(100, Math.max(0, u?.percent ?? 0))

type Anchors = {
  'surface-0': string
  'text-primary': string
  'surface-1'?: string
  'surface-2'?: string
  'surface-3'?: string
  'text-secondary'?: string
  'text-muted'?: string
}
export type ColorDef = {
  label: string
  roles: { accent: string; danger: string; success: string; warning: string; pro: string }
  light: { gray: { anchors: Anchors } }
  dark: { gray: { anchors: Anchors } }
}
export type Season = {
  key: SeasonKey
  label: string
  colors: ColorDef
  bubble: string
  alt: string
  scene: (u: Usage | null, now: number) => string
}

// Keyframes from a list of stops: [percent, declarations, easing to the next stop].
export type Stop = readonly [at: number, css: string, ease?: string]
export const kf = (name: string, stops: readonly Stop[]): string =>
  `@keyframes ${name}{${stops
    .map(s => `${s[0]}%{${s[1]}${s[2] === undefined ? '' : `;animation-timing-function:${s[2]}`}}`)
    .join('')}}`
export const tx = (x: number): string => `transform:translateX(${x}px)`
export const ty = (y: number): string => `transform:translateY(${y}px)`
export const rot = (deg: number): string => `transform:rotate(${deg}deg)`
// One pose shown outside a span of the loop, the other inside it.
export const swap = (a: string, b: string, from: number, to: number): string =>
  kf(a, [[0, 'opacity:1'], [from, 'opacity:1'], [from + 0.1, 'opacity:0'], [to, 'opacity:0'], [to + 0.1, 'opacity:1'], [100, 'opacity:1']]) +
  kf(b, [[0, 'opacity:0'], [from, 'opacity:0'], [from + 0.1, 'opacity:1'], [to, 'opacity:1'], [to + 0.1, 'opacity:0'], [100, 'opacity:0']])

const COMMON_DEFS = `<radialGradient id="glow"><stop offset="0" stop-color="#ffc45a" stop-opacity=".38"/><stop offset="1" stop-color="#ffc45a" stop-opacity="0"/></radialGradient><radialGradient id="sun"><stop offset="0" stop-color="#ffe9a3"/><stop offset="1" stop-color="#f5b638"/></radialGradient><radialGradient id="sunHalo"><stop offset=".3" stop-color="#f7c95a" stop-opacity=".45"/><stop offset="1" stop-color="#f7c95a" stop-opacity="0"/></radialGradient><radialGradient id="moonHalo"><stop offset=".3" stop-color="#f5edd2" stop-opacity=".3"/><stop offset="1" stop-color="#f5edd2" stop-opacity="0"/></radialGradient>`

const BASE_CSS = `.night{display:none}.rays{stroke:#f2b73c;stroke-width:3;stroke-linecap:round;transform-box:fill-box;transform-origin:center;animation:spin 180s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.leg{transform-box:fill-box;transform-origin:50% 0%;animation:step .8s ease-in-out infinite alternate}.legB{animation-delay:-.8s}@keyframes step{from{transform:rotate(28deg)}to{transform:rotate(-28deg)}}
.wleg{animation-duration:1.3s}.wleg.legB{animation-delay:-1.3s}
.cloud{fill:#ffffff;opacity:.75;animation:drift 240s ease-in-out infinite alternate}@keyframes drift{from{transform:translateX(-60px)}to{transform:translateX(90px)}}
.t0{fill:#2f7d55}.t1{fill:#286f4b}.woods .t0{fill:#4c9470}.woods .t1{fill:#448a67}.shade{fill:#0b2a1c;opacity:.14}
.snowline{fill:none;stroke:#ffffff;stroke-linecap:round;stroke-linejoin:round}.snowfill{fill:#ffffff}
.smoke{fill:#ffffff;opacity:.55;animation:puff 9s ease-in-out infinite alternate}@keyframes puff{to{transform:translate(6px,-8px);opacity:.3}}
.bulb{opacity:.95;animation:glow 6s ease-in-out infinite}.b1{animation-delay:-2s}.b2{animation-delay:-4s}@keyframes glow{50%{opacity:.45}}
.dleg{transform-box:fill-box;transform-origin:50% 0%;animation:trot .55s ease-in-out infinite alternate}.dlegB{animation-delay:-.55s}@keyframes trot{from{transform:rotate(40deg)}to{transform:rotate(-40deg)}}
.wag{transform-box:fill-box;transform-origin:100% 100%;animation:wag .5s ease-in-out infinite alternate}@keyframes wag{from{transform:rotate(-14deg)}to{transform:rotate(16deg)}}
.sniff{animation:sniff 1.1s ease-in-out infinite alternate}@keyframes sniff{to{transform:translate(1.5px,2px)}}
.ffly{animation:drift 90s ease-in-out infinite alternate}
.zz{animation:zz 4s ease-in-out infinite}@keyframes zz{50%{opacity:.25;transform:translateY(-4px)}}
.bob{animation:bob 4s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-2px)}}
.flame{transform-box:fill-box;transform-origin:50% 100%;animation:flick 2.6s ease-in-out infinite alternate}@keyframes flick{to{transform:scale(.88,1.1)}}
.run{animation:run 50s linear infinite}@keyframes run{from{transform:translateX(-720px)}to{transform:translateX(900px)}}
.hop{animation:hop 1.4s ease-in-out infinite}.h2{animation-delay:-.7s}@keyframes hop{50%{transform:translateY(-7px)}}`

const BASE_DARK = `.day{display:none}.night{display:inline}.cloud{fill:#2b3663;opacity:.6}.t0{fill:#1f6b47}.t1{fill:#1a5f3e}.woods .t0{fill:#1b4a4a}.woods .t1{fill:#173f42}.snowline{stroke:#e6eaf6}.snowfill{fill:#e6eaf6}.smoke{fill:#8f98bd;opacity:.4}`

// The opening of a scene: gradients, the shared styles, then the season's own.
export const open = (o: {
  skyDay: readonly [string, string]
  skyNight: readonly [string, string]
  defs?: string
  css: string
  dark: string
}): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${COMMON_DEFS}<linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.skyDay[0]}"/><stop offset=".85" stop-color="${o.skyDay[1]}"/></linearGradient><linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.skyNight[0]}"/><stop offset=".85" stop-color="${o.skyNight[1]}"/></linearGradient>${o.defs ?? ''}</defs><style>
${BASE_CSS}
${o.css}
@media (prefers-color-scheme: dark){${BASE_DARK}${o.dark}}
${lite >= 3 ? '*{animation:none!important}' : lite >= 2 ? '.bulb,.cloud,.rays,.smoke,.ffly,.flame,.bob{animation:none!important}' : ''}</style>`

// Sky: a sun with turning rays by day; a cratered moon and stars by night; clouds.
export const sky = (rand: Rand): string => {
  let stars = ''

  for (let n = 0; n < 40; n++) {
    stars += `<circle class="bulb b${n % 3}" cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * 430)}" r="${f(0.7 + rand() * 1.1)}" fill="#fff6d8"/>`
  }
  let rays = ''

  for (let n = 0; n < 12; n++) {
    rays += `<path transform="rotate(${n * 30} 1095 150)" d="M1095 ${n % 2 === 0 ? 96 : 104} V112"/>`
  }
  const cloud = (x: number, y: number, s: number): string =>
    `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="46" ry="13"/><ellipse cx="-20" cy="-9" rx="20" ry="13"/><ellipse cx="10" cy="-13" rx="25" ry="17"/><ellipse cx="34" cy="-5" rx="16" ry="10"/></g>`

  return `<rect class="day" width="${W}" height="${H}" fill="url(#skyDay)"/><rect class="night" width="${W}" height="${H}" fill="url(#skyNight)"/>
<g class="day"><circle cx="1095" cy="150" r="95" fill="url(#sunHalo)"/><g class="rays">${rays}</g><circle cx="1095" cy="150" r="30" fill="url(#sun)"/><path d="M1076 140 a22 22 0 0 1 22 -15" stroke="#fff3c4" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/></g>
<g class="night">${stars}<circle cx="1095" cy="150" r="85" fill="url(#moonHalo)"/><circle cx="1095" cy="150" r="30" fill="#f5edd2"/>
<path d="M1095 120 a30 30 0 0 1 0 60 a38 38 0 0 0 0 -60Z" fill="#cfc19a" opacity=".45"/>
<g fill="#ddd0aa"><circle cx="1084" cy="140" r="5.5"/><circle cx="1101" cy="158" r="4"/><circle cx="1086" cy="162" r="2.6"/><circle cx="1104" cy="136" r="2.2"/><circle cx="1076" cy="153" r="1.8"/></g></g>
<g class="cloud">${cloud(330, 120, 1)}${cloud(760, 78, 0.8)}${cloud(960, 250, 0.65)}</g>`
}

// Far mountains with a cap on each peak, a nearer ridge with a line of small firs,
// and the middle ground. Colors come from the season: far, peak, far2, treeline, hill2.
export const land = (rand: Rand): string => {
  const range = [[0, 620], [110, 530], [210, 600], [330, 500], [470, 610], [600, 540], [720, 605], [850, 515], [980, 600], [1090, 545], [1200, 610]] as const
  let peaks = ''

  range.forEach(([x, y], n) => {
    if (n % 2 === 1) {
      peaks += `<path d="M${x} ${y} L${x + 26} ${y + 22} l-9 5 -8 -6 -9 7 -9 -7 -8 6 -9 -5Z"/>`
    }
  })
  const ridge = (x: number): number => 662 + 14 * Math.sin(x / 140) + 8 * Math.sin(x / 53)
  let ridgePath = `M0 ${H}`
  let treeline = ''

  for (let x = 0; x <= W; x += 20) {
    ridgePath += ` L${x} ${f(ridge(x))}`
    const t = 9 + rand() * 12
    const at = x + rand() * 14
    treeline += `<path d="M${f(at)} ${f(ridge(at) - t)} l${f(t * 0.32)} ${f(t + 3)} h${f(-t * 0.64)}Z"/>`
  }

  return `<path class="far" d="M${range.map(([x, y]) => `${x} ${y}`).join(' L')} V${H} H0Z"/><g class="peak">${peaks}</g>
<g class="treeline">${treeline}</g><path class="far2" d="${ridgePath} L${W} ${H}Z"/>
<path class="hill2" d="M0 708 Q200 690 420 706 T820 702 T1200 698 V${H} H0Z"/>`
}

const starPoints = (cx: number, cy: number, r: number, inner: number): string => {
  let d = ''

  for (let n = 0; n < 10; n++) {
    const a = ((n * 36 - 90) * Math.PI) / 180
    const q = n % 2 === 0 ? r : r * inner
    d += `${n === 0 ? 'M' : 'L'}${f(cx + q * Math.cos(a))} ${f(cy + q * Math.sin(a))}`
  }

  return `${d}Z`
}
export const starShape = (cx: number, cy: number, r: number, fill: string): string =>
  `<path d="${starPoints(cx, cy, r, 0.5)}" fill="${fill}" stroke-linejoin="round"/>`
// A glowing gold star, for the top of a tree.
export const star = (cx: number, cy: number, r: number): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r * 2.4}" fill="url(#glow)"/><path d="${starPoints(cx, cy, r, 0.45)}" fill="#f7c948" stroke="#dfa01f" stroke-width="1.2" stroke-linejoin="round"/><path d="M${cx} ${cy - r * 0.55} L${cx + r * 0.2} ${cy - r * 0.1} L${cx - r * 0.2} ${cy - r * 0.1}Z" fill="#fff3c4" opacity=".8"/>`

// A fir: five tiers drawn bottom up, sides curving in, snow along each scalloped hem
// and in clumps on the boughs (hidden outside winter). A decorated one gets a gold
// garland with ornaments and a string of small lights on each tier.
export const pine = (cx: number, base: number, k: number, isDecorated = false): string => {
  let out = `<rect x="${f(cx - 5 * k)}" y="${f(base - 6 * k)}" width="${f(10 * k)}" height="${f(14 * k)}" fill="#6b4630"/>`

  for (let j = 4; j >= 0; j--) {
    const top = base - k * (238 - j * 40)
    const h = k * 78
    const half = k * (26 + j * 14)
    const hem = `q${f(-half / 3)} ${f(k * 9)} ${f((-2 * half) / 3)} 0 `.repeat(3)
    out += `<path class="t${j % 2}" d="M${cx} ${f(top)} Q${f(cx + half * 0.3)} ${f(top + h * 0.6)} ${f(cx + half)} ${f(top + h)} ${hem}Q${f(cx - half * 0.3)} ${f(top + h * 0.6)} ${cx} ${f(top)}Z"/><path class="shade" d="M${cx} ${f(top)} Q${f(cx + half * 0.3)} ${f(top + h * 0.6)} ${f(cx + half)} ${f(top + h)} q${f(-half / 3)} ${f(k * 9)} ${f((-2 * half) / 3)} 0 Q${f(cx + half * 0.1)} ${f(top + h * 0.5)} ${cx} ${f(top)}Z"/><path class="snowline" stroke-width="${f(k * 4.5)}" d="M${f(cx + half)} ${f(top + h)} ${hem}"/>`

    if (k > 0.55) {
      const side = j % 2 === 0 ? 1 : -1
      out += `<ellipse class="snowfill" cx="${f(cx + side * half * 0.22)}" cy="${f(top + h * 0.5)}" rx="${f(half * 0.2)}" ry="${f(k * 3.4)}"/><ellipse class="snowfill" cx="${f(cx - side * half * 0.42)}" cy="${f(top + h * 0.8)}" rx="${f(half * 0.16)}" ry="${f(k * 2.8)}"/>`
    }

    if (isDecorated && j > 0) {
      const y0 = top + h * 0.6
      const sag = h * 0.22
      const reach = half * 0.46
      out += `<path d="M${f(cx - reach)} ${f(y0)} Q${cx} ${f(y0 + 2 * sag)} ${f(cx + reach)} ${f(y0)}" fill="none" stroke="#f0b83a" stroke-width="1.8"/>`
      ;[0.08, 0.29, 0.5, 0.71, 0.92].forEach((t, n) => {
        const x = cx + (2 * t - 1) * reach
        const y = y0 + 4 * t * (1 - t) * sag + 5
        const i = (j + n) % 4
        out += `<path d="M${f(x)} ${f(y - 6)} v2" stroke="#b8862a" stroke-width="1.4"/><circle class="bulb b${i % 3}" cx="${f(x)}" cy="${f(y)}" r="4.6" fill="${pick(BULBS, i)}"/><circle cx="${f(x - 1.4)}" cy="${f(y - 1.5)}" r="1.3" fill="#ffffff" opacity=".85"/>`
      })
      const y1 = top + h * 0.3
      const reach1 = half * 0.2
      ;[0, 0.25, 0.5, 0.75, 1].forEach((t, n) => {
        const i = (j + n + 2) % 4
        out += `<circle class="bulb b${(i + 1) % 3}" cx="${f(cx + (2 * t - 1) * reach1)}" cy="${f(y1 + 4 * t * (1 - t) * h * 0.08)}" r="2" fill="${pick(BULBS, i)}"/>`
      })
    }
  }
  const top = base - k * 238

  return `${out}<path class="snowline" stroke-width="${f(k * 5)}" d="M${f(cx - 5 * k)} ${f(top + 13 * k)} L${cx} ${f(top + 3 * k)} L${f(cx + 5 * k)} ${f(top + 13 * k)}"/>`
}

// A small round tree: a trunk and three clumps, colored by the class.
export const roundTree = (x: number, base: number, k: number, cls: string): string =>
  `<rect x="${f(x - 3 * k)}" y="${f(base - 42 * k)}" width="${f(6 * k)}" height="${f(44 * k)}" fill="#6b4630"/><g class="${cls}"><circle cx="${f(x - 16 * k)}" cy="${f(base - 52 * k)}" r="${f(20 * k)}"/><circle cx="${f(x + 15 * k)}" cy="${f(base - 55 * k)}" r="${f(22 * k)}"/><circle cx="${x}" cy="${f(base - 74 * k)}" r="${f(24 * k)}"/></g><circle class="shade" cx="${f(x + 15 * k)}" cy="${f(base - 50 * k)}" r="${f(18 * k)}"/>`

// The forked trunk of a big leafy tree, standing at x, base.
export const trunk = (x: number, base: number, k: number): string =>
  `<g transform="translate(${x} ${base}) scale(${k})"><path d="M-14 0 Q-6 -62 -18 -122 Q-22 -152 -48 -182 L-40 -188 Q-14 -164 -6 -132 Q0 -164 32 -192 L39 -185 Q10 -156 6 -112 Q4 -52 14 0Z" fill="#7a4a2e"/><path d="M-4 -20 q4 -34 -2 -70 M4 -30 q2 -20 0 -44" stroke="#5f3721" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`

// A canopy: clumps scattered in an ellipse, in the three tones c0, c1, c2 of the class.
export const canopy = (rand: Rand, cx: number, cy: number, rx: number, ry: number, count: number, cls: string): string => {
  let out = ''

  for (let n = 0; n < count; n++) {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand())
    out += `<circle class="c${n % 3}" cx="${f(cx + Math.cos(a) * d * rx)}" cy="${f(cy + Math.sin(a) * d * ry)}" r="${f(20 + rand() * 16)}"/>`
  }

  return `<g class="${cls}">${out}</g>`
}

// The cabin, drawn around its doorstep at 1070,712 and scaled up from there. Its snow
// shows in winter alone; `extra` is drawn in the cabin's own coordinates.
export const cabin = (o: { hasLights: boolean; wreath: string; flags: readonly string[]; extra?: string }): string => {
  let planks = ''

  for (let x = 1000; x <= 1140; x += 10) {
    planks += `M${x} 712 V${f(712 - (80 - Math.abs(x - 1070)) * 1.9)} `
  }
  let roofSnow = ''
  let roofLights = ''

  for (let n = 0; n < 9; n++) {
    const t = (n + 0.5) / 9
    const r = 5 + (n % 3)
    roofSnow += `<circle cx="${f(1070 - 86 * t)}" cy="${f(548 + 170 * t)}" r="${r}"/><circle cx="${f(1070 + 86 * t)}" cy="${f(548 + 170 * t)}" r="${r}"/>`
    roofLights += `<circle class="bulb b${n % 3}" cx="${f(1070 - 70 * t)}" cy="${f(582 + 132 * t)}" r="2" fill="${pick(BULBS, n)}"/><circle class="bulb b${(n + 1) % 3}" cx="${f(1070 + 70 * t)}" cy="${f(582 + 132 * t)}" r="2" fill="${pick(BULBS, n + 2)}"/>`
  }
  let bunting = ''

  for (let n = 0; n < 7; n++) {
    bunting += `<path d="M${1042 + n * 8} 641 h8 l-4 7Z" fill="${pick(o.flags, n)}"/>`
  }
  const pane = (x: number): string =>
    `<rect x="${x - 4}" y="668" width="4" height="26" fill="#8f2a2a"/><rect x="${x + 22}" y="668" width="4" height="26" fill="#8f2a2a"/><rect x="${x}" y="668" width="22" height="26" rx="1.5" fill="#ffd27a" stroke="#4f2e18" stroke-width="2"/><path d="M${x + 11} 668 V694 M${x} 681 H${x + 22}" stroke="#4f2e18" stroke-width="1.6"/><path d="M${x + 1} 669 q5 5 1 12 M${x + 21} 669 q-5 5 -1 12" stroke="#f2a94e" stroke-width="2" fill="none"/><rect class="snowfill" x="${x - 5}" y="693" width="32" height="4.5" rx="2.2"/>`

  return `<circle cx="1070" cy="640" r="190" fill="url(#glow)"/><g transform="translate(1070 712) scale(1.5) translate(-1070 -712)">
<g class="smoke"><circle cx="1113" cy="566" r="5"/><circle cx="1118" cy="552" r="7"/><circle cx="1110" cy="536" r="9"/></g>
<rect x="1104" y="580" width="18" height="62" fill="#6a6470"/><path d="M1104 590 h18 M1104 600 h18 M1104 610 h18 M1104 620 h18 M1113 580 v10 M1109 590 v10 M1117 600 v10 M1111 610 v10" stroke="#514c58" stroke-width="1"/><rect x="1101" y="577" width="24" height="5" rx="1.5" fill="#514c58"/>
<path class="snowfill" d="M1100 582 q1 -8 11 -7 q13 -2 15 7 q-2 4 -13 3 q-11 1 -13 -3Z"/>
<path d="M990 712 L1070 560 L1150 712Z" fill="#7a4a2e"/><path d="${planks}" stroke="#633a22" stroke-width="1" fill="none"/>
<path d="M996 712 L1070 572 L1144 712" stroke="#4f2e18" stroke-width="5" fill="none" stroke-linejoin="round"/>
<path d="M1070 594 L1089 628 H1051Z" fill="#ffd98a" stroke="#4f2e18" stroke-width="2.2" stroke-linejoin="round"/><path d="M1070 594 V628 M1060 612 H1080" stroke="#4f2e18" stroke-width="1.4"/>
<path d="M1066 628 l2 -9 l2 4 l2 -6 l2 11Z" fill="#2f7d55"/>
<rect x="1038" y="636" width="64" height="5" rx="1.5" fill="#4f2e18"/>${bunting}
${pane(1008)}${pane(1110)}
<rect x="1057" y="658" width="26" height="54" rx="3" fill="#4f2e18"/><rect x="1059" y="660" width="22" height="52" rx="2" fill="#a8232b"/><path d="M1062 684 h16 v24 h-16Z M1070 684 v24" stroke="#861b22" stroke-width="1.2" fill="none"/><circle cx="1078" cy="690" r="1.6" fill="#f0b83a"/>
${o.wreath}
<rect x="1088" y="668" width="5" height="8" rx="1" fill="#ffd98a" stroke="#3a2a20" stroke-width="1"/>
${o.hasLights ? `<path d="M1070 580 L1000 714 M1070 580 L1140 714" stroke="#3a2a20" stroke-width=".6" fill="none"/>${roofLights}` : ''}
<path d="M1070 546 L1161 721 H1147 L1070 573 L993 721 H979Z" fill="#5f3a2c"/><path d="M1070 549 L1157 719 M1070 549 L983 719" stroke="#7a4f3c" stroke-width="2" fill="none"/>
<path class="snowfill" d="M1070 544 L1162 722 H1146 L1070 574 L994 722 H978Z"/><g class="snowfill">${roofSnow}</g>
<rect x="1050" y="706" width="40" height="6" rx="1" fill="#8b8590"/><rect class="snowfill" x="1048" y="703" width="44" height="4.5" rx="2.2"/>
${o.extra ?? ''}</g>`
}
// The cabin's windows once more, to shine through a night veil laid over the scene.
export const CABIN_GLOW = `<g class="night"><circle cx="1070" cy="640" r="170" fill="url(#glow)"/><g transform="translate(1070 712) scale(1.5) translate(-1070 -712)" fill="#ffd98a"><path d="M1070 596 L1087 627 H1053Z"/><rect x="1009" y="669" width="20" height="24"/><rect x="1111" y="669" width="20" height="24"/><rect x="1088" y="668" width="5" height="8" rx="1"/><path d="M1070 596 V627 M1060 612 H1080 M1019 669 V693 M1009 681 H1029 M1121 669 V693 M1111 681 H1131" stroke="#4f2e18" stroke-width="1.4" fill="none"/></g></g>`
export const WREATH = `<circle cx="1070" cy="672" r="6.5" fill="none" stroke="#2f7d55" stroke-width="4" stroke-dasharray="3 1.2"/><path d="M1070 677 l-4 5 h8Z" fill="#e04848"/><circle cx="1066" cy="668" r="1.1" fill="#e04848"/><circle cx="1075" cy="673" r="1.1" fill="#e04848"/>`

// The lamp post; its light is drawn each time, since it tells the time.
export const post = (hasBow: boolean): string =>
  `<path d="M262 716 h20 l-3 -8 h-14Z" fill="#231c2a"/><rect x="269" y="596" width="6" height="114" fill="#2a2230"/><rect x="266" y="640" width="12" height="4" rx="2" fill="#231c2a"/><rect x="266" y="700" width="12" height="4" rx="2" fill="#231c2a"/>
<path d="M258 574 h28 l-5 -9 h-18Z" fill="#231c2a"/><circle cx="272" cy="562" r="3" fill="#231c2a"/><path d="M262 574 l3 24 h14 l3 -24Z" fill="#3b3040"/><rect x="264" y="597" width="16" height="4" rx="1.5" fill="#231c2a"/>
<path class="snowfill" d="M256 573 q4 -9 16 -10 q12 1 16 10 q-16 5 -32 0Z"/>${
    hasBow
      ? `<path d="M272 612 l-11 -6 v12Z M272 612 l11 -6 v12Z" fill="#c8323a"/><path d="M270 613 l-4 12 l5 -3Z M274 613 l4 12 l-5 -3Z" fill="#b02a32"/><circle cx="272" cy="612" r="3" fill="#e04848"/>`
      : ''
  }`

// The street lamp is a clock: full brightness at the last reply, dimming over the hour after it.
export const lamp = (u: Usage | null, now: number): string => {
  const elapsed = u === null ? 0 : Math.min(HOUR, Math.max(0, (now - u.at) / 1000))
  const start = (1 - (elapsed / HOUR) * 0.88).toFixed(2)
  const left = Math.round(HOUR - elapsed)
  const dim = left > 0 ? `animation:dim ${left}s linear forwards` : ''

  return `<style>.lamp{opacity:${start};${dim}}@keyframes dim{to{opacity:.12}}</style>
<circle class="lamp" cx="272" cy="586" r="85" fill="url(#glow)"/><path class="lamp" d="M264 576 l2.500 20 h11 l2.500 -20Z" fill="#ffd98a"/><path d="M272 576 v20" stroke="#3b3040" stroke-width="1.2"/>`
}

// A child, feet at x, y. `extra` is drawn behind, `front` in front, both in the child's
// own coordinates; the gait decides which parts move.
export type Kid = {
  coat: string
  dark: string
  hat: string
  hatStyle: 'beanie' | 'cap' | 'straw'
  scarf?: string
  pants?: readonly [string, string]
  gait: 'run' | 'walk' | 'still'
  hop?: string
  extra?: string
  front?: string
}
export const kid = (x: number, y: number, k: Kid): string => {
  const [near, far] = k.pants ?? ['#3b4a6b', '#46587d']
  const leg = k.gait === 'run' ? 'leg' : k.gait === 'walk' ? 'leg wleg' : ''
  const body = k.gait === 'run' ? `hop ${k.hop ?? ''}` : ''
  const scarf =
    k.scarf === undefined
      ? ''
      : `<path d="M-6 -41 q-11 -3 -18 3 l2 4 q7 -5 15 -3Z" fill="${k.scarf}"/><rect x="-8" y="-43" width="16" height="5" rx="2.5" fill="${k.scarf}"/>`
  const hat =
    k.hatStyle === 'beanie'
      ? `<path d="M-7.5 -54 Q-7 -63 1 -63 Q9.5 -63 9.5 -54Z" fill="${k.hat}"/><path d="M-3 -62 v7 M2 -63 v8 M6.500 -61 v6" stroke="#000000" stroke-width=".7" opacity=".18"/><rect x="-8.5" y="-57" width="19" height="4.5" rx="2.2" fill="#fffaf0" stroke="#d8c6b0" stroke-width=".5"/><circle cx="1" cy="-64.5" r="3.2" fill="#fffaf0" stroke="#d8c6b0" stroke-width=".5"/>`
      : k.hatStyle === 'cap'
        ? `<path d="M-7.5 -54 Q-7 -63 1 -63 Q9.5 -63 9.5 -54Z" fill="${k.hat}"/><path d="M7 -57 h9 q3 1 2 3.500 h-11Z" fill="${k.dark}"/><circle cx="1" cy="-63" r="1.3" fill="${k.dark}"/>`
        : `<ellipse cx="1" cy="-55.500" rx="15" ry="3.400" fill="#e9c46a"/><path d="M-6.500 -55.500 Q-6 -65 1 -65 Q8.500 -65 8.500 -55.500Z" fill="#f0d27c"/><rect x="-6.500" y="-59" width="15" height="2.600" fill="${k.hat}"/>`

  return `<g transform="translate(${x} ${y}) scale(1.25)">${k.extra ?? ''}<g class="${body}">
<g class="${leg}"><rect x="-4" y="-19" width="6" height="16" rx="3" fill="${near}"/><ellipse cx="0" cy="-2" rx="5.5" ry="3" fill="#5a3a2a"/></g>
<g class="${leg} legB"><rect x="-1" y="-19" width="6" height="16" rx="3" fill="${far}"/><ellipse cx="3" cy="-2" rx="5.5" ry="3" fill="#6b4630"/></g>
<rect x="-6" y="-37" width="6" height="15" rx="3" fill="${k.dark}" transform="rotate(42 -3 -36)"/>
<rect x="-9" y="-41" width="18" height="25" rx="8" fill="${k.coat}"/><rect x="-9" y="-22" width="18" height="5" rx="2.5" fill="${k.dark}"/><path d="M0 -40 v18" stroke="${k.dark}" stroke-width="1"/><circle cx="0" cy="-34" r="1" fill="#f0d9b5"/><circle cx="0" cy="-28" r="1" fill="#f0d9b5"/>
<rect x="-2" y="-37" width="6" height="15" rx="3" fill="${k.dark}" transform="rotate(-55 1 -36)"/><circle cx="13" cy="-28" r="3.4" fill="${k.scarf ?? '#f6d3b3'}"/>
${scarf}
<circle cx="1" cy="-50" r="8" fill="#f6d3b3"/><path d="M-6.500 -52 q-2 4 0 8" stroke="#6b4630" stroke-width="2.4" stroke-linecap="round" fill="none"/><circle cx="6" cy="-46.5" r="2" fill="#f0a39a" opacity=".7"/><circle cx="5.5" cy="-49.5" r="1.2" fill="#2a2230"/><path d="M4.5 -45 q1.8 1.5 3.6 0" stroke="#2a2230" stroke-width=".8" stroke-linecap="round" fill="none"/>
${hat}${k.front ?? ''}
</g></g>`
}

// The dog, facing right with its feet at 0,0. Four poses share one body.
const FUR = '#e0a458'
const FUR2 = '#c4873a'
const CREAM = '#fbe9cf'
const INK = '#2a2230'
const dleg = (x: number, cls: string, fill: string): string =>
  `<g class="${cls}"><rect x="${x}" y="-14" width="5.5" height="14" rx="2.7" fill="${fill}"/></g>`
const TAIL = `<g class="wag"><path d="M-17 -22 q-9 -6 -7 -17" stroke="${FUR}" stroke-width="5" stroke-linecap="round" fill="none"/></g>`
const BODY = `<rect x="-19" y="-28" width="38" height="18" rx="9" fill="${FUR}"/><ellipse cx="1" cy="-12.500" rx="13" ry="3.600" fill="${CREAM}"/><path d="M11 -30 l6 3 l-3 9 l-5 -3Z" fill="#c8323a"/><circle cx="12.500" cy="-18.500" r="2" fill="#f0b83a"/>`
const head = (eye: string, mouth: string): string =>
  `<circle cx="22" cy="-34" r="10.500" fill="${FUR}"/><path d="M15 -43 q-9 3 -7 16 q8 -3 9 -12Z" fill="${FUR2}"/><ellipse cx="31" cy="-30.500" rx="7.500" ry="5.500" fill="${CREAM}"/><circle cx="37.500" cy="-32.500" r="2.200" fill="${INK}"/><circle cx="26" cy="-29" r="2.200" fill="#f0a39a" opacity=".6"/>${eye}${mouth}`
const EYE = `<circle cx="25" cy="-36.500" r="1.800" fill="${INK}"/><circle cx="25.600" cy="-37.100" r=".6" fill="#ffffff"/>`
const EYE_SHUT = `<path d="M23 -36.500 q2 1.800 4 0" stroke="${INK}" stroke-width="1.200" fill="none" stroke-linecap="round"/>`
const EYE_WIDE = `<circle cx="25" cy="-36.500" r="3.200" fill="#ffffff"/><circle cx="25.600" cy="-36.500" r="1.400" fill="${INK}"/>`
const SMILE = `<path d="M30 -27.500 q3 2.500 6 -.5" stroke="${INK}" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M32.500 -27 q.5 5.500 3 4.500 q1.500 -1.500 .5 -5Z" fill="#ef7f8e"/>`
const GASP = `<ellipse cx="33" cy="-26.500" rx="2" ry="2.400" fill="${INK}"/>`
const LEGS_RUN = dleg(-16, 'dleg', FUR2) + dleg(-10, 'dleg dlegB', FUR) + dleg(7, 'dleg dlegB', FUR2) + dleg(13, 'dleg', FUR)
const LEGS_STAND = dleg(-16, '', FUR2) + dleg(-10, '', FUR) + dleg(7, '', FUR2) + dleg(13, '', FUR)
export const DOG_RUN = `${TAIL}${LEGS_RUN}${BODY}${head(EYE, SMILE)}`
export const DOG_SNIFF = `${TAIL}${LEGS_STAND}${BODY}<g transform="rotate(40 14 -26)"><g class="sniff">${head(EYE_SHUT, '')}</g></g>`
export const DOG_SPLAT = `<path d="M-46 -24 h-10 M-48 -14 h-14 M-44 -4 h-9" stroke="#9fc4dc" stroke-width="1.6" stroke-linecap="round"/><g transform="translate(0 7)"><path d="M-17 -20 q-12 -2 -16 -11" stroke="${FUR}" stroke-width="5" stroke-linecap="round" fill="none"/>
<rect x="-34" y="-11" width="17" height="5.5" rx="2.7" fill="${FUR2}" transform="rotate(12 -18 -8)"/><rect x="-33" y="-18" width="16" height="5.5" rx="2.7" fill="${FUR}" transform="rotate(-10 -18 -15)"/>
<rect x="14" y="-11" width="18" height="5.5" rx="2.7" fill="${FUR2}" transform="rotate(-8 15 -8)"/>${BODY}<rect x="12" y="-16" width="20" height="5.5" rx="2.7" fill="${FUR}" transform="rotate(12 13 -13)"/>${head(EYE_WIDE, GASP)}</g>`
export const DOG_SLEEP = `<ellipse cx="0" cy="-9" rx="21" ry="10" fill="${FUR}"/><ellipse cx="-2" cy="-4" rx="13" ry="3.400" fill="${CREAM}"/><path d="M-19 -8 q-9 6 3 9 q9 1 13 -3" stroke="${FUR2}" stroke-width="5" stroke-linecap="round" fill="none"/>
<circle cx="17" cy="-10" r="9.500" fill="${FUR}"/><path d="M11 -18 q-8 4 -5 14 q7 -3 8 -10Z" fill="${FUR2}"/><ellipse cx="24.500" cy="-6.500" rx="6.500" ry="4.500" fill="${CREAM}"/><circle cx="29.800" cy="-8" r="1.900" fill="${INK}"/><path d="M16.500 -11.500 q2 1.800 4 0" stroke="${INK}" stroke-width="1.200" fill="none" stroke-linecap="round"/>
<g class="zz" fill="#fff6d8" font-family="sans-serif" font-weight="700"><text x="27" y="-24" font-size="9">z</text><text x="34" y="-34" font-size="12">z</text></g>`
// A dog asleep by the cabin door, at night.
export const NIGHT_DOG = `<g class="night"><g transform="translate(986 714) scale(1.15)">${DOG_SLEEP}</g></g>`

// The top-left signs: context, the five-hour limit, the estimated cost, and a candle
// that burns down over the hour after the last reply.
const plank = (y: number, h: number): string =>
  `<rect x="52" y="${y}" width="96" height="${h}" rx="7" fill="#7a4a2a" stroke="#4f2e18" stroke-width="2.5"/><rect x="55" y="${y + 3}" width="90" height="${f(h * 0.3)}" rx="5" fill="#ffffff" opacity=".07"/>
<path d="M60 ${f(y + h * 0.3)} h26 M104 ${f(y + h * 0.22)} h34 M66 ${f(y + h * 0.8)} h20 M112 ${f(y + h * 0.84)} h28" stroke="#643a1e" stroke-width="1" stroke-linecap="round" opacity=".7"/>
<g fill="#3a2414"><circle cx="59" cy="${y + 7}" r="1.6"/><circle cx="141" cy="${y + 7}" r="1.6"/><circle cx="59" cy="${y + h - 7}" r="1.6"/><circle cx="141" cy="${y + h - 7}" r="1.6"/></g>`
const board = (y: number, h: number, big: string, small: string, size: number): string =>
  `${plank(y, h)}<text x="100" y="${f(y + h / 2 + size * 0.2)}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="${size}" fill="#fff3dd">${big}</text>
<text x="100" y="${y + h - 7}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#f0d9b5">${small}</text>`
// A small blue tit in a red scarf, sitting on the top board.
const BIRD = `<g class="bob"><path d="M-2 0 v-5 M4 0 v-5 M-4 0 h4 M2 0 h4" stroke="#5a4a40" stroke-width="1.2" stroke-linecap="round" fill="none"/>
<path d="M-9 -10 l-11 -5 l3 7Z" fill="#3f6ea8"/><ellipse cx="0" cy="-12" rx="11" ry="9" fill="#6f8fb8"/><ellipse cx="2.500" cy="-9.500" rx="8" ry="6.500" fill="#f2c94c"/>
<path d="M-8 -14 q8 -7 14 0 q-6 8 -14 0Z" fill="#4a78b0"/><path d="M-5 -13.500 q5 -3 9 0" stroke="#35598a" stroke-width=".8" fill="none"/>
<circle cx="7" cy="-21" r="7" fill="#f7f3e8"/><path d="M0.500 -23 a7 7 0 0 1 13 -1.500 q-6 -2.500 -13 1.500Z" fill="#3f6ea8"/><path d="M2 -21.500 L13.500 -20.500" stroke="#2a3550" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="9" cy="-21" r="1.3" fill="#141420"/><circle cx="9.400" cy="-21.400" r=".4" fill="#ffffff"/><path d="M13.500 -20 l5 1.600 l-5 1.400Z" fill="#e09a2c"/>
<path d="M1 -16 q6 3 12 0 v3 q-6 3 -12 0Z" fill="#c8323a"/><path d="M3 -13 l-2 8 l4 -1 l1 -7Z" fill="#b02a32"/></g>`
// `top.art` dresses the top board for the season; the bird sits `top.lift` above it.
export const signs = (u: Usage | null, now: number, top: { lift: number; art: string }): string => {
  const rows: Array<[string, string]> = []

  if (u?.fiveHour !== undefined) {
    rows.push([`${u.fiveHour}%`, '5시간 한도'])
  }

  if (u?.usd !== undefined) {
    rows.push([`$${u.usd.toFixed(2)}`, '비용(추정)'])
  }
  let out = `<path d="M64 0 V92 M136 0 V92" stroke="#b89a6a" stroke-width="2.4"/><path d="M64 20 l1.500 3 M64 44 l1.500 3 M64 68 l1.500 3 M136 20 l1.500 3 M136 44 l1.500 3 M136 68 l1.500 3" stroke="#8f744c" stroke-width="1"/>${board(90, 64, u?.percent === undefined ? '–' : `${u.percent}%`, '문맥', 28)}
${top.art}<g transform="translate(112 ${f(92 - top.lift)})">${BIRD}</g>`
  let y = 164

  for (const [big, small] of rows) {
    out += `<path d="M70 ${y - 10} V${y} M130 ${y - 10} V${y}" stroke="#b89a6a" stroke-width="2"/>${board(y, 44, big, small, 17)}`
    y += 54
  }
  // The candle: its height is the share of the hour that is left.
  const elapsed = u === null ? 0 : Math.min(HOUR, Math.max(0, (now - u.at) / 1000))
  const left = Math.round(HOUR - elapsed)
  const full = 1 - (elapsed / HOUR) * 0.8
  const burn = left > 0 ? `animation:burn ${left}s linear forwards` : ''
  const sink = left > 0 ? `animation:sink ${left}s linear forwards` : ''

  return `${out}<path d="M70 ${y - 10} V${y} M130 ${y - 10} V${y}" stroke="#b89a6a" stroke-width="2"/>${plank(y, 44)}
<style>.wax{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(${f(full)});${burn}}@keyframes burn{to{transform:scaleY(.2)}}.wick{transform:translateY(${f((1 - full) * 26)}px);${sink}}@keyframes sink{to{transform:translateY(20.800px)}}</style>
<ellipse cx="74" cy="${y + 37}" rx="11" ry="2.500" fill="#4f2e18"/><rect class="wax" x="68" y="${y + 11}" width="12" height="26" rx="2" fill="#fff3dd"/>
<g class="wick"><path d="M74 ${y + 11} v-3" stroke="#3a2414" stroke-width="1.2"/><circle cx="74" cy="${y + 4}" r="9" fill="url(#glow)"/><path class="flame" d="M74 ${y - 2} q5 6 0 10 q-5 -4 0 -10Z" fill="#ffb53a"/><path d="M74 ${y + 3} q2 3 0 5 q-2 -2 0 -5Z" fill="#fff3c4"/></g>
<text x="112" y="${y + 21}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="15" fill="#fff3dd">1시간</text>
<text x="112" y="${y + 36}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#f0d9b5">캐시</text>`
}

// Things that fall: each layer is drawn twice, one screen apart, and both copies slide
// down one screen, so the loop has no visible jump.
export type Layer = {
  count: number
  rMin: number
  rMax: number
  seconds: number
  drift: number
  cls: string
  shape: (x: number, y: number, r: number, n: number) => string
}
export const falling = (rand: Rand, all: readonly Layer[]): { art: string; css: string } => {
  const layers = lite >= 2 ? [] : lite === 1 ? all.slice(0, 1).map(layer => ({ ...layer, count: Math.ceil(layer.count / 2) })) : all

  return {
  art: layers
    .map((layer, i) => {
      let dots = ''

      for (let n = 0; n < layer.count; n++) {
        const r = layer.rMin + rand() * (layer.rMax - layer.rMin)
        dots += layer.shape(Math.round(-layer.drift + rand() * (W + layer.drift)), Math.round(rand() * H), r, n)
      }

      return `<g class="${layer.cls} l${i}"><g>${dots}</g><g transform="translate(${-layer.drift} ${-H})">${dots}</g></g>`
    })
    .join(''),
  css: layers
    .map(
      (layer, i) =>
        `.l${i}{animation:f${i} ${layer.seconds}s linear infinite}@keyframes f${i}{to{transform:translate(${layer.drift}px,${H}px)}}`,
    )
    .join(''),
  }
}

// A veil laid over the day-colored scene at night; what should glow is drawn after it.
export const veil = (opacity: number): string =>
  `<rect class="night" y="380" width="${W}" height="${H - 380}" fill="url(#veil)" opacity="${opacity}"/>`
export const VEIL_DEF = `<linearGradient id="veil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1030" stop-opacity="0"/><stop offset=".26" stop-color="#0a1030"/></linearGradient>`

// Fireflies: slow glowing dots over the ground at night.
export const fireflies = (rand: Rand, count: number): string => {
  let out = ''

  for (let n = 0; n < count; n++) {
    out += `<circle class="bulb b${n % 3}" cx="${Math.round(rand() * W)}" cy="${Math.round(560 + rand() * 150)}" r="${f(1.4 + rand())}" fill="#f6e27a"/>`
  }

  return `<g class="night"><g class="ffly">${out}</g></g>`
}
