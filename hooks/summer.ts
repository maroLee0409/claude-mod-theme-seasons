// Summer: a beach with palms, a parasol and a sandcastle. The tide comes in as the
// session's context fills. By day the dog races along the sand and takes a tumble.
import type { Usage } from '../types'
import {
  CABIN_GLOW, DOG_RUN, NIGHT_DOG, VEIL_DEF, W, cabin, f, kf, kid, lamp, open, percentOf, post, rng, rot, signs, sky, starShape, tx, ty, veil,
} from './kit.js'
import { getLite } from './kit.js'
import type { Season } from './kit.js'

// A palm: a ringed trunk leaning right, eight fronds, a few coconuts.
const palm = (x: number, base: number, k: number): string => {
  const frond = (a: number, isLeft: boolean, fill: string): string =>
    `<path transform="translate(34 -236)${isLeft ? ' scale(-1 1)' : ''} rotate(${a})" d="M0 0 Q60 -46 124 8 Q62 -18 0 0Z" fill="${fill}"/>`
  const fronds = [-64, -30, 6, 40]
    .map((a, n) => frond(a, true, n % 2 === 0 ? '#2f8544' : '#3f9a4f') + frond(a, false, n % 2 === 0 ? '#3f9a4f' : '#2f8544'))
    .join('')

  return `<g transform="translate(${x} ${base}) scale(${k})"><path d="M0 0 Q-14 -110 34 -236" stroke="#a9763f" stroke-width="17" fill="none" stroke-linecap="round"/><path d="M0 0 Q-14 -110 34 -236" stroke="#7d5229" stroke-width="17" stroke-dasharray="2 13" fill="none"/>
${fronds}<circle cx="27" cy="-228" r="7" fill="#7a4e2c"/><circle cx="40" cy="-226" r="7" fill="#6b4226"/><circle cx="34" cy="-218" r="6.500" fill="#855632"/></g>`
}

type Parts = { head: string; back: string; standing: string; day: string; front: string; night: string }
const still = (): Parts => {
  const rand = rng(808)

  // The sea to the horizon: an island, a sailboat by day, the moon's path by night.
  let waves = ''
  ;[574, 590, 608, 630, 652].forEach((y, n) => {
    waves += `<path class="wave${n % 2 === 0 ? '' : ' w2'}" d="M-80 ${y} H${W + 80}" stroke-dasharray="${16 + n * 7} ${34 + n * 12}"/>`
  })
  let glitter = ''

  for (let n = 0; n < 7; n++) {
    const half = 10 + n * 5
    glitter += `<path class="bulb b${n % 3}" d="M${1095 - half} ${570 + n * 13} h${half * 2}"/>`
  }
  let sparkle = ''

  for (let n = 0; n < 26; n++) {
    sparkle += `<circle class="bulb b${n % 3}" cx="${Math.round(rand() * W)}" cy="${Math.round(566 + rand() * 90)}" r="${f(0.8 + rand())}" fill="#ffffff"/>`
  }
  const sea = `<rect y="560" width="${W}" height="190" fill="url(#sea)"/>
<path d="M740 561 q46 -24 104 -17 q44 -14 86 6 q34 2 56 11Z" fill="#7fb98a"/><path d="M836 546 q-2 -15 5 -25 M900 548 q0 -13 -5 -20" stroke="#6b5a3a" stroke-width="2.400" fill="none"/><path d="M841 521 q-12 -6 -18 3 M841 521 q11 -8 18 1 M841 521 q-3 -12 -13 -11 M841 521 q6 -12 15 -9 M895 528 q-11 -5 -16 3 M895 528 q10 -7 16 1 M895 528 q-2 -11 -11 -10 M895 528 q6 -10 13 -7" stroke="#3f9a4f" stroke-width="2.600" fill="none" stroke-linecap="round"/>
<g class="day"><g class="sail"><path d="M300 559 h46 l-9 9 h-28Z" fill="#c8323a"/><path d="M324 557 V521 l19 32Z" fill="#ffffff"/><path d="M321 557 V529 l-15 25Z" fill="#fdf0d0"/></g></g>
${waves}<g class="day">${sparkle}</g><g class="night" stroke="#f5edd2" stroke-width="2" stroke-linecap="round" opacity=".6">${glitter}</g>`

  // The sand, speckled, with what the beach is strewn with.
  let grains = ''

  for (let n = 0; n < 60; n++) {
    grains += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(672 + rand() * 74)}" r="${f(0.7 + rand() * 0.8)}"/>`
  }
  const shell = (x: number, y: number, fill: string): string =>
    `<path d="M${x} ${y} q-7 -9 0 -11 q7 2 0 11Z M${x} ${y} q-11 -4 -8 -9 q6 -4 8 9Z M${x} ${y} q11 -4 8 -9 q-6 -4 -8 9Z" fill="${fill}" stroke="#d9b98c" stroke-width=".6"/>`
  const parasol = `<path d="M352 706 L346 612" stroke="#8a5a34" stroke-width="3" stroke-linecap="round"/><path d="M290 624 Q346 556 402 620 q-9 6 -19 0 q-9 7 -18 0 q-10 7 -19 0 q-9 7 -19 0 q-9 6 -18 0 q-9 6 -19 4Z" fill="#e0483f"/><path d="M346 590 L327 624 q9 6 19 0Z M346 590 L365 620 q9 6 18 0Z M346 590 L290 624 q9 4 18 -2Z" fill="#fff6e6"/><circle cx="346" cy="588" r="3" fill="#8a5a34"/>`
  const beach = `<path d="M0 668 Q300 650 600 664 T1200 656 V760 H0Z" fill="url(#sand)"/><g fill="#d9bb7c">${grains}</g>
<path d="M376 700 l62 -6 l4 10 l-62 6Z" fill="#4fb3d9"/><path d="M388 699 l4 10 M404 697 l4 10 M420 696 l4 10" stroke="#fff6e6" stroke-width="3"/>
<path d="M470 706 v-17 h6 v-5 h5 v5 h7 v-5 h5 v5 h6 v17Z" fill="#e3c27d" stroke="#cfa95f" stroke-width="1"/><path d="M478 689 v-14 h4 v-4 h5 v4 h4 v14Z" fill="#ecd091" stroke="#cfa95f" stroke-width="1"/><path d="M485 671 v-11 l9 3 l-9 3" fill="#e04848" stroke="#8a5a34" stroke-width="1"/><path d="M481 706 v-7 q4 -5 8 0 v7Z" fill="#b9934e"/>
<path d="M508 706 l2 -11 h10 l2 11Z" fill="#3f8fd6"/><path d="M509 695 q6 -8 12 0" stroke="#2f6fb0" stroke-width="1.400" fill="none"/><path d="M528 706 l5 -16" stroke="#e04848" stroke-width="2.400" stroke-linecap="round"/>
<circle cx="560" cy="699" r="9" fill="#ffffff" stroke="#e6dcc8" stroke-width=".8"/><path d="M560 690 a9 9 0 0 1 7.800 4.500 L560 699Z" fill="#e04848"/><path d="M560 708 a9 9 0 0 1 -7.800 -4.500 L560 699Z" fill="#3f8fd6"/><path d="M551 699 a9 9 0 0 1 4.500 -7.800 L560 699Z" fill="#f0b83a"/>
${starShape(690, 702, 7, '#f08a5d')}${starShape(250, 716, 5.5, '#f2a65a')}${shell(734, 712, '#fbe3d0')}${shell(196, 706, '#f7d1dc')}${shell(912, 716, '#fdf0d0')}
<g transform="translate(800 708)"><g class="crab"><path d="M-8 -5 l-7 -5 m7 7 l-8 0 M8 -5 l7 -5 m-7 7 l8 0" stroke="#c4412e" stroke-width="1.600" stroke-linecap="round" fill="none"/><ellipse cx="0" cy="-5" rx="8.500" ry="5.500" fill="#e0533d"/><path d="M-9 -9 q-6 -5 -3 -9 q5 0 5 6Z M9 -9 q6 -5 3 -9 q-5 0 -5 6Z" fill="#e0533d"/><circle cx="-3" cy="-11" r="1.700" fill="#ffffff"/><circle cx="3" cy="-11" r="1.700" fill="#ffffff"/><circle cx="-3" cy="-11" r=".8" fill="#2a2230"/><circle cx="3" cy="-11" r=".8" fill="#2a2230"/></g></g>`

  // The hut: a lifebuoy on the door, surfboards against the wall.
  const buoy = `<circle cx="1070" cy="672" r="6" fill="none" stroke="#ffffff" stroke-width="4.400"/><circle cx="1070" cy="672" r="6" fill="none" stroke="#e04848" stroke-width="4.400" stroke-dasharray="4.700 4.700"/>`
  const boards = `<path d="M982 712 q-9 -36 0 -72 q9 36 0 72Z" fill="#4fb3d9" stroke="#2f8fb8" stroke-width="1"/><path d="M982 706 v-60" stroke="#fff6e6" stroke-width="1.600"/><path d="M996 712 q-8 -30 0 -60 q8 30 0 60Z" fill="#f0b83a" stroke="#cf962a" stroke-width="1"/><path d="M996 707 v-50" stroke="#e04848" stroke-width="1.600"/>`
  const hut = cabin({ hasLights: true, wreath: buoy, flags: ['#4fb3d9', '#fffaf0', '#f0b83a'], extra: boards })

  // The dog tears along the sand, trips into a somersault, shakes it off and runs on.
  const dogCss =
    `.mx{animation:mx 26s linear infinite}.my{animation:my 26s linear infinite}.mr{transform-box:fill-box;transform-origin:50% 55%;animation:mr 26s linear infinite}` +
    kf('mx', [[0, tx(-700)], [40, tx(-80)], [46, tx(0)], [53, tx(0)], [100, tx(700)]]) +
    kf('my', [[0, ty(0)], [40, ty(0), 'ease-out'], [43, ty(-26), 'ease-in'], [46, ty(0)], [100, ty(0)]]) +
    kf('mr', [[0, rot(0)], [40, rot(0)], [46, rot(360)], [47.5, rot(351)], [49, rot(368)], [50.5, rot(354)], [52, rot(364)], [53, rot(360)], [100, rot(360)]])
  const day = `<g class="day"><g class="run">${kid(430, 712, { coat: '#ffd166', dark: '#e9b44c', hat: '#e04848', hatStyle: 'straw', pants: ['#3a86c8', '#4a96d8'], gait: 'run' })}</g>
<g transform="translate(600 713)"><g class="mx"><g class="my"><g class="mr"><g transform="scale(1.15)">${DOG_RUN}</g></g></g></g></g>
<g class="gull" fill="none" stroke="#5a6470" stroke-width="2" stroke-linecap="round"><path d="M200 120 q7 -7 13 0 q6 -7 13 0"/><path d="M246 142 q6 -6 11 0 q5 -6 11 0"/><path d="M170 152 q5 -5 9 0 q4 -5 9 0"/></g></g>`

  // At night: a small fire on the sand.
  const fire = `<g class="night"><circle cx="600" cy="700" r="60" fill="url(#glow)"/><path d="M584 712 l32 -8 M584 704 l32 8" stroke="#6b4630" stroke-width="5" stroke-linecap="round"/><path class="flame" d="M600 680 q13 14 0 26 q-13 -12 0 -26Z" fill="#ffb53a"/><path class="flame" d="M600 690 q6 8 0 15 q-6 -7 0 -15Z" fill="#fff3c4"/></g>`

  const head = `${open({
    skyDay: ['#bfe6fb', '#e9f8ff'],
    skyNight: ['#0b1b33', '#17365a'],
    defs: `${VEIL_DEF}<linearGradient id="sea" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="672"><stop offset="0" stop-color="#3fb4e0"/><stop offset="1" stop-color="#9fe3ee"/></linearGradient><linearGradient id="sand" gradientUnits="userSpaceOnUse" x1="0" y1="650" x2="0" y2="760"><stop offset="0" stop-color="#f9e8bd"/><stop offset="1" stop-color="#ecd091"/></linearGradient>`,
    css: `.snowline,.snowfill,.smoke{display:none}
.wave{fill:none;stroke:#ffffff;stroke-width:2;stroke-linecap:round;opacity:.55;animation:wave 8s ease-in-out infinite alternate}.w2{animation-delay:-4s}@keyframes wave{to{transform:translateX(36px)}}
.sail{animation:sail 150s ease-in-out infinite alternate}@keyframes sail{to{transform:translateX(280px)}}
.crab{animation:crab 9s ease-in-out infinite alternate}@keyframes crab{to{transform:translateX(70px)}}
.gull{animation:gull 90s linear infinite}@keyframes gull{from{transform:translateX(-320px)}to{transform:translateX(1100px)}}
.tide{fill:#9fe3ee;opacity:.84}.foam{fill:none;stroke:#ffffff;stroke-width:4;stroke-linecap:round;opacity:.9}.lap{animation:lap 3.6s ease-in-out infinite alternate}@keyframes lap{to{transform:translateY(3px)}}
${dogCss}`,
    dark: `.wave{opacity:.25}`,
  })}
${sky(rand)}`

  return {
    head,
    back: `${sea}${beach}`,
    standing: `${parasol}${palm(34, 716, 0.72)}${palm(104, 712, 1.05)}${hut}${post(false)}`,
    day,
    front: `${veil(0.56)}${CABIN_GLOW}`,
    night: `${fire}${NIGHT_DOG}`,
  }
}

let madeAt = -1
let made: Parts | undefined

// The tide: the water's edge moves down the beach as the context fills, over the
// sandcastle and up to the palms when it is full.
const tide = (u: Usage | null): string => {
  const r = Math.round(percentOf(u) * 0.46)

  return `<g class="lap"><path class="tide" d="M0 668 Q300 650 600 664 T1200 656 V${656 + r} Q900 ${678 + r} 600 ${664 + r} Q300 ${650 + r} 0 ${668 + r}Z"/><path class="foam" d="M0 ${668 + r} Q300 ${650 + r} 600 ${664 + r} T1200 ${656 + r}"/></g>`
}

// The top board in summer: a starfish and a shell.
const TOP = {
  lift: 0,
  art: `${starShape(62, 87, 7, '#f08a5d')}<path d="M138 91 q-6 -9 0 -11 q6 2 0 11Z M138 91 q-10 -4 -7 -9 q5 -3 7 9Z M138 91 q10 -4 7 -9 q-5 -3 -7 9Z" fill="#fbe3d0" stroke="#d9b98c" stroke-width=".6"/>`,
}

export const summer: Season = {
  key: 'summer',
  label: '여름',
  colors: {
    label: 'Summer',
    roles: { accent: '#0f7fb5', danger: '#c9302c', success: '#1f8a5b', warning: '#b8860b', pro: '#6b5fc7' },
    light: {
      gray: {
        anchors: { 'surface-0': '#eaf5f7', 'surface-1': '#f2f9fa', 'surface-2': '#fafdfe', 'text-primary': '#10262e', 'text-secondary': '#2e4a54', 'text-muted': '#4e6972' },
      },
    },
    dark: {
      gray: {
        anchors: { 'surface-0': '#0d1f33', 'surface-1': '#12283f', 'surface-2': '#18304a', 'surface-3': '#1b3550', 'text-primary': '#eef6f8', 'text-secondary': '#c9dbe2', 'text-muted': '#9fb6c2' },
      },
    },
  },
  bubble: '#0f6f9e',
  alt: '여름 해변: 야자수와 파라솔, 모래성, 낮에는 뛰놀다 구르는 강아지, 밤에는 모닥불, 사용량 팻말과 촛불, 가로등',
  scene: (u, now) => {
    if (made === undefined || madeAt !== getLite()) {
      made = still()
      madeAt = getLite()
    }

    return `${made.head}${made.back}${tide(u)}${made.standing}${made.day}${made.front}${lamp(u, now)}${made.night}${signs(u, now, TOP)}</svg>`
  },
}
