// Winter: a Christmas night with Santa's sleigh, a snowy morning with children and a
// dog that slips on the pond. Snow piles up as the session's context fills.
import type { Usage } from '../types'
import {
  DOG_RUN, DOG_SPLAT, W, WREATH, cabin, f, falling, kf, kid, lamp, land, open, percentOf, pine, post, rng, rot, signs, sky, star, swap, tx,
} from './kit.js'
import { getLite } from './kit.js'
import type { Season } from './kit.js'

const still = (): { head: string; back: string; decor: string; snow: string } => {
  const rand = rng(1225)
  // The nearest layer falls as six-armed flakes, the others as dots.
  const dot = (x: number, y: number, r: number): string => `<circle cx="${x}" cy="${y}" r="${f(r)}"/>`
  const flake = (x: number, y: number, r: number): string =>
    `<path d="M${x} ${f(y - r)} V${f(y + r)} M${f(x - r * 0.87)} ${f(y - r * 0.5)} L${f(x + r * 0.87)} ${f(y + r * 0.5)} M${f(x - r * 0.87)} ${f(y + r * 0.5)} L${f(x + r * 0.87)} ${f(y - r * 0.5)}"/>`
  const snow = falling(rand, [
    { count: 48, rMin: 1.1, rMax: 2, seconds: 72, drift: 20, cls: 'fall', shape: dot },
    { count: 34, rMin: 1.9, rMax: 3, seconds: 50, drift: 40, cls: 'fall', shape: dot },
    { count: 16, rMin: 4, rMax: 6.5, seconds: 34, drift: 60, cls: 'flake', shape: flake },
  ])
  const woods = (
    [
      [8, 720, 1.2], [232, 716, 0.85], [300, 714, 0.5], [352, 716, 0.62], [420, 712, 0.36],
      [790, 712, 0.38], [850, 716, 0.6], [905, 712, 0.45], [958, 720, 1.05], [1192, 722, 1.3],
    ] as const
  )
    .map(([x, y, k]) => pine(x, y, k))
    .join('')
  const tree = `${pine(118, 712, 1.4, true)}${star(118, 366, 15)}`

  // The snowman, standing by the tree.
  const snowman = `<g transform="translate(214 712) scale(1.15)">
<path d="M-16 -50 l-22 -12 m8 4 l-2 -8 m-4 5 l-8 1 M16 -50 l22 -14 m-8 5 l1 -8 m5 4 l8 0" stroke="#6b4630" stroke-width="2.2" stroke-linecap="round" fill="none"/>
<g class="snowman"><circle cx="0" cy="-24" r="25"/><circle cx="0" cy="-58" r="18"/><circle cx="0" cy="-84" r="13"/></g>
<path class="shade" d="M8 -1 a25 25 0 0 0 15 -33 a30 30 0 0 1 -15 33Z M6 -41 a18 18 0 0 0 11 -24 a22 22 0 0 1 -11 24Z M4 -72 a13 13 0 0 0 8 -17 a16 16 0 0 1 -8 17Z"/>
<circle cx="0" cy="-62" r="2.2" fill="#2a2230"/><circle cx="0" cy="-52" r="2.2" fill="#2a2230"/><circle cx="0" cy="-30" r="2.4" fill="#2a2230"/><circle cx="0" cy="-18" r="2.4" fill="#2a2230"/>
<path d="M-13 -74 q13 7 26 0 v6 q-13 7 -26 0Z" fill="#c8323a"/><path d="M6 -70 l3 20 l8 -2 l-4 -19Z" fill="#b02a32"/><path d="M10 -52 l-1 4 M13 -53 l0 4 M16 -53 l1 4" stroke="#c8323a" stroke-width="1.4"/><path d="M-9 -70 v5 M-3 -68 v5 M3 -68 v5" stroke="#f3d9a8" stroke-width="1.2"/>
<circle cx="-5" cy="-88" r="1.7" fill="#2a2230"/><circle cx="5" cy="-88" r="1.7" fill="#2a2230"/><path d="M0 -85 L15 -82 L0 -80Z" fill="#ef8a2c"/>
<g fill="#2a2230"><circle cx="-6" cy="-79" r="1"/><circle cx="-3" cy="-77.3" r="1"/><circle cx="0.5" cy="-76.8" r="1"/><circle cx="4" cy="-77.6" r="1"/></g>
<rect x="-15" y="-98" width="30" height="4" rx="1.5" fill="#2a2230"/><rect x="-10" y="-116" width="20" height="19" rx="1.5" fill="#2a2230"/><rect x="-10" y="-103" width="20" height="4" fill="#c8323a"/>
<path d="M5 -101 q4 -5 7 0 q-4 3 -7 0Z" fill="#2f9e5b"/><circle cx="5" cy="-101" r="1.6" fill="#e04848"/>
</g>`

  // What rests on the snow and rises with it: tracks, sparkle, the frozen pond.
  const gift = (x: number, w: number, h: number, box: string, band: string): string =>
    `<rect x="${x}" y="${708 - h}" width="${w}" height="${h}" rx="2" fill="${box}"/><rect x="${x}" y="${708 - h}" width="${w}" height="${f(h * 0.22)}" fill="#000000" opacity=".12"/><path d="M${x + w / 2} ${708 - h} V708 M${x} ${f(708 - h * 0.5)} h${w}" stroke="${band}" stroke-width="3.2"/><path d="M${x + w / 2} ${708 - h} q-9 -10 -10 -2 q1 5 10 2 q9 3 10 -2 q-1 -8 -10 2Z" fill="${band}"/>`
  const bush = (x: number, s: number): string =>
    `<g transform="translate(${x} 716) scale(${s})"><circle class="t1" cx="-12" cy="-8" r="10"/><circle class="t0" cx="0" cy="-12" r="13"/><circle class="t1" cx="13" cy="-7" r="9"/><path class="snowfill" d="M-13 -17 q6 -9 14 -8 q9 -1 14 9 q-5 3 -9 -1 q-5 4 -9 0 q-5 4 -10 0Z"/><circle cx="-8" cy="-4" r="1.8" fill="#e04848"/><circle cx="4" cy="-3" r="1.8" fill="#e04848"/><circle cx="12" cy="-6" r="1.5" fill="#e04848"/></g>`
  let fence = `<path d="M776 694 H934 M776 704 H934" stroke="#8a5a34" stroke-width="3.5" stroke-linecap="round"/>`

  for (let x = 780; x <= 930; x += 30) {
    fence += `<path d="M${x - 3.5} 716 V688 l3.5 -5 l3.5 5 V716Z" fill="#9a6a40" stroke="#6b4630" stroke-width=".8"/><path class="snowfill" d="M${x - 5} 689 q5 -9 10 0 q-5 3 -10 0Z"/>`
  }
  fence += `<path class="snowfill" d="M786 692 q10 -4 18 0 q-9 3 -18 0Z M846 692 q10 -4 18 0 q-9 3 -18 0Z M876 702 q10 -4 18 0 q-9 3 -18 0Z"/>`
  let prints = ''

  for (let n = 0; n < 13; n++) {
    const t = n / 12
    prints += `<ellipse cx="${f(1036 - t * 240)}" cy="${f(726 + Math.sin(t * 3) * 5 + t * 14 + (n % 2 === 0 ? -2 : 2))}" rx="3.4" ry="1.7"/>`
  }
  let sparks = ''

  for (let n = 0; n < 46; n++) {
    sparks += `<circle class="bulb b${n % 3}" cx="${Math.round(rand() * W)}" cy="${Math.round(718 + rand() * 30)}" r="${f(0.7 + rand() * 0.9)}"/>`
  }
  const decor = `<g class="drift"><path d="M30 728 Q200 716 390 732"/><path d="M860 727 Q1020 718 1185 730"/><path d="M120 742 Q300 734 470 746"/><path d="M640 746 Q800 738 1000 748"/></g>
<ellipse class="mound" cx="330" cy="716" rx="62" ry="9"/><ellipse class="mound" cx="1010" cy="718" rx="56" ry="8"/>
<g class="print">${prints}</g><g class="spark">${sparks}</g>
<ellipse class="ice" cx="650" cy="717" rx="128" ry="12"/><path class="iceline" d="M566 716 q30 -4 62 0 M664 721 q40 -3 72 1 M606 722 l16 -2 M700 713 l22 -1"/>`
  // These stay where they stand, so the rising snow buries them.
  const buried = `<path d="M470 716 q8 -10 18 -4 q8 -5 12 4Z" fill="#8b8590"/><path class="snowfill" d="M473 710 q7 -7 15 -2 q6 -3 9 2 q-12 4 -24 0Z"/>
${fence}${bush(320, 1)}${bush(742, 0.8)}${bush(420, 0.7)}
${gift(34, 26, 24, '#c8323a', '#f0b83a')}${gift(64, 20, 16, '#2f7d55', '#e04848')}${gift(170, 22, 20, '#3f6ea8', '#fffaf0')}${gift(150, 16, 13, '#f0b83a', '#c8323a')}`

  // A reindeer in harness, facing left at a gallop; the lead one has the red nose.
  const leg = (x: number, cls: string): string =>
    `<g class="dleg ${cls}"><path d="M${x} 2 V12" stroke="#7a4e2c" stroke-width="2.2" stroke-linecap="round"/><circle cx="${x}" cy="12.500" r="1.400" fill="#3a2414"/></g>`
  const deer = (x: number, isLead: boolean): string =>
    `<g transform="translate(${x} 0)">${leg(-7, '')}${leg(-3, 'dlegB')}${leg(5, 'dlegB')}${leg(8, '')}
<ellipse cx="12.500" cy="-5" rx="2.600" ry="1.900" fill="#fff3dd"/><path d="M-8 -4 L-14 -13 L-9 -15 L-3 -6Z" fill="#9a6538"/>
<ellipse cx="0" cy="-2" rx="12" ry="5.600" fill="#9a6538"/><ellipse cx="0" cy="1" rx="9" ry="2.800" fill="#c79a6b"/>
<path d="M-13 -17 l-1 -7 m0 3 l-3 -2 m3.300 -1 l2.600 -2.400 M-11 -17 l2.400 -6 m-1 2.800 l3 -1.400" stroke="#d9b88a" stroke-width="1.200" stroke-linecap="round" fill="none"/>
<path d="M-11.500 -16 l3.200 -3.400 l.6 4.200Z" fill="#7a4e2c"/><ellipse cx="-14.500" cy="-14" rx="5" ry="3.600" fill="#9a6538" transform="rotate(-15 -14.500 -14)"/><ellipse cx="-18.600" cy="-12.400" rx="2.700" ry="2.100" fill="#b98350"/>
<circle cx="-15" cy="-15.200" r=".8" fill="#141420"/>${
      isLead
        ? `<circle cx="-21" cy="-12.800" r="7" fill="url(#noseGlow)"/><circle class="bulb" cx="-21" cy="-12.800" r="1.900" fill="#ff4b4b"/>`
        : `<circle cx="-21" cy="-12.800" r="1.200" fill="#2a2230"/>`
    }
<path d="M-7.500 -8 q1.600 4.600 .4 9.400" stroke="#c8323a" stroke-width="2.200" fill="none" stroke-linecap="round"/><circle cx="-7" cy="2" r="1.400" fill="#f0b83a"/>
<path d="M-3 -7.600 h8 l-.6 3.400 h-6.800Z" fill="#c8323a"/><path d="M-3.400 -4.400 h7.600" stroke="#f0b83a" stroke-width=".9"/></g>`
  let trail = ''

  for (let n = 0; n < 7; n++) {
    trail += `<circle class="bulb b${n % 3}" cx="${38 + n * 9}" cy="${n % 2 === 0 ? 3 : -3}" r="${f(2 - n * 0.22)}" fill="#f7c948"/>`
  }
  // Night only: Santa's sleigh crossing the sky now and then.
  const santa = `<g class="night"><g class="fly"><g transform="translate(700 200) scale(1.6)">
${trail}<path d="M-7 -8.500 L-57 -5 L-93 -5 L-129 -5" stroke="#e8b230" stroke-width=".9" fill="none"/>
${deer(-122, true)}${deer(-86, false)}${deer(-50, false)}
<path d="M16 -11 q-4 -13 6 -16 q11 -1 11 8 q1 6 -3 9Z" fill="#8a5a34"/><path d="M19 -25 q4 -4 8 -1" stroke="#5a3620" stroke-width="1.400" fill="none"/><path d="M20 -14 q5 -3 9 1" stroke="#6f4526" stroke-width="1" fill="none"/>
<rect x="24" y="-33" width="7" height="7" rx="1" fill="#2f7d55"/><path d="M27.500 -33 v7 M24 -29.500 h7" stroke="#fffaf0" stroke-width="1"/><rect x="15" y="-32" width="6" height="6" rx="1" fill="#f0b83a"/><path d="M18 -32 v6" stroke="#c8323a" stroke-width="1"/>
<path d="M-16 4 Q-25 4 -25 -5 Q-25 -11 -19 -11 Q-21 -4 -14 -3 L8 -3 L12 -13 H31 Q33 4 22 6 H-12 Q-16 6 -16 4Z" fill="#b8262e"/><path d="M-12 3 H22 Q28 2 28 -8" stroke="#96202a" stroke-width="2.400" fill="none"/>
<path d="M-19 -11 Q-21 -4 -14 -3 L8 -3 L12 -13 H31" stroke="#f0b83a" stroke-width="1.300" fill="none" stroke-linejoin="round"/><path d="M-4 1 q3 -3 6 0 q-3 3 -6 0Z" fill="#f0b83a"/>
<path d="M-22 12 H24 Q31 12 31 5 M-22 12 q-6 0 -6 -5 q0 -3 3 -3 M-10 6 v6 M14 6 v6" stroke="#e8b230" stroke-width="1.800" fill="none" stroke-linecap="round"/>
<ellipse cx="9" cy="-13" rx="7" ry="7.600" fill="#c8323a"/><path d="M2.500 -8 h13" stroke="#fffaf0" stroke-width="2.200" stroke-linecap="round"/><rect x="2.200" y="-13.500" width="13.600" height="2.600" fill="#2a2230"/><rect x="6" y="-14.200" width="4" height="4" rx=".6" fill="none" stroke="#f0b83a" stroke-width="1"/>
<path d="M5 -16 L-5 -9.500" stroke="#c8323a" stroke-width="3.800" stroke-linecap="round"/><circle cx="-4" cy="-10.200" r="2.300" fill="#fffaf0"/><circle cx="-7" cy="-8.500" r="2" fill="#2f7d55"/>
<circle cx="7" cy="-24" r="4.800" fill="#f2c9a5"/><path d="M2.200 -24 q-1.400 10 5.200 10 q5.600 0 6 -8 q-5.600 2.600 -11.200 -2Z" fill="#ffffff"/><path d="M2.400 -23 q2.400 2 5 0" stroke="#e9e3d6" stroke-width="1.300" fill="none" stroke-linecap="round"/>
<circle cx="2.600" cy="-24.400" r="1" fill="#e79a8a"/><circle cx="4.800" cy="-25.800" r=".65" fill="#141420"/><circle cx="4.400" cy="-23.400" r="1.100" fill="#f0a39a" opacity=".6"/>
<path d="M2.400 -27.400 Q8 -39 16.500 -30.500 Q11 -32 12 -27Z" fill="#c8323a"/><rect x="1.600" y="-29" width="11.400" height="2.800" rx="1.400" fill="#fffaf0"/><circle cx="17" cy="-30" r="2.200" fill="#ffffff"/>
</g></g></g>`

  // The dog runs in, hits the pond, slides across it with its legs out, lies there, trots off.
  const dogCss =
    `.wx{animation:wx 28s linear infinite}.wr{transform-box:fill-box;transform-origin:50% 60%;animation:wr 28s linear infinite}.wa{animation:wa 28s linear infinite}.wb{opacity:0;animation:wb 28s linear infinite}` +
    kf('wx', [[0, tx(-700)], [34, tx(-70), 'ease-out'], [46, tx(150)], [54, tx(150)], [100, tx(700)]]) +
    kf('wr', [[0, rot(0)], [34, rot(0)], [36, rot(-22)], [39, rot(14)], [42, rot(-9)], [46, rot(0)], [100, rot(0)]]) +
    swap('wa', 'wb', 34, 54)

  const head = `${open({
    skyDay: ['#f3eadb', '#f9e2c6'],
    skyNight: ['#101630', '#1e2853'],
    defs: `<radialGradient id="noseGlow"><stop offset="0" stop-color="#ff5a4a" stop-opacity=".6"/><stop offset="1" stop-color="#ff5a4a" stop-opacity="0"/></radialGradient><linearGradient id="snowDay" gradientUnits="userSpaceOnUse" x1="0" y1="690" x2="0" y2="830"><stop offset="0" stop-color="#fffdf8"/><stop offset="1" stop-color="#efe3d1"/></linearGradient><linearGradient id="snowNight" gradientUnits="userSpaceOnUse" x1="0" y1="690" x2="0" y2="830"><stop offset="0" stop-color="#97a2d6"/><stop offset="1" stop-color="#6a76ae"/></linearGradient>`,
    css: `.far{fill:#e9dcc8}.peak{fill:#fffaf0}.far2{fill:#e2d2ba}.treeline{fill:#a9b99a}.hill2{fill:#f4e9d6}.hill{fill:url(#snowDay)}.hillB{fill:#f1e6d4}.hillF{fill:#ffffff;opacity:.55}.lump{fill:#fffdf8;opacity:.8}.rim{fill:none;stroke:#e6d4ba;stroke-width:2.5;stroke-linecap:round}.mound{fill:#fffaf0;stroke:#ecdcc4;stroke-width:1}
.drift{fill:none;stroke:#ecdcc4;stroke-width:2;stroke-linecap:round}.print{fill:#e6d5bb}.spark{fill:#d6c2a0}.ice{fill:#d6edf6;stroke:#b3d9ea;stroke-width:1.5}.iceline{fill:none;stroke:#ffffff;stroke-width:1.6;stroke-linecap:round}
.fall{fill:#ffffff;stroke:#dcc7ae;stroke-width:.6}.flake{fill:none;stroke:#cdb99c;stroke-width:1.1;stroke-linecap:round}
.snowman{fill:#ffffff;stroke:#d8c6b0;stroke-width:1}.cap{fill:#ffffff;stroke:#d8c6b0;stroke-width:1}
.fly{animation:fly 55s linear infinite}@keyframes fly{from{transform:translate(800px,40px)}30%{transform:translate(0px,0px)}60%,to{transform:translate(-900px,30px)}}
${snow.css}${dogCss}`,
    dark: `.far{fill:#232d57}.peak{fill:#aab4d6;opacity:.8}.far2{fill:#1a2247}.treeline{fill:#131a3a}.hill2{fill:#2c3760}.hill{fill:url(#snowNight)}.hillB{fill:#7480b8}.hillF{fill:#b4bde6;opacity:.25}.lump{fill:#a6b0e0;opacity:.7}.rim{stroke:#c3cbf0}.mound{fill:#a1abdc;stroke:#b7c0ea}.drift{stroke:#8792c8}.print{fill:#6f7bb3}.spark{fill:#ffffff}.ice{fill:#b7c6f2;stroke:#d8dffb}.fall{fill:#fff6e4;stroke:none;opacity:.5}.flake{stroke:#fff6e4;opacity:.5}.snowman{fill:#eef1fa;stroke:none}.cap{fill:#e6eaf6;stroke:none}`,
  })}
${sky(rand)}${land(rand)}`

  const back = `${santa}<g class="woods">${woods}</g>${cabin({ hasLights: true, wreath: WREATH, flags: ['#c8323a', '#fffaf0', '#2f7d55'] })}${tree}${snowman}${post(true)}${buried}`

  return { head, back, decor, snow: snow.art }
}

let madeAt = -1
let made: ReturnType<typeof still> | undefined

// Day only: two children running across the snow, the second pulling a sled, and the dog.
const SLED = `<path d="M-9 -28 L-30 -9" stroke="#b89a6a" stroke-width="1.2"/><rect x="-56" y="-10" width="28" height="4" rx="2" fill="#b8262e"/><path d="M-52 -6 V-1 M-34 -6 V-1 M-58 -1 H-30 q5 0 5 -6" stroke="#7a4a2a" stroke-width="2" stroke-linecap="round" fill="none"/>`
const KIDS = `<g class="day"><g class="run">${kid(560, 708, { coat: '#c8323a', dark: '#9c2029', hat: '#2f7d55', hatStyle: 'beanie', scarf: '#f0b83a', gait: 'run' })}${kid(470, 708, { coat: '#2f7d55', dark: '#1f5c3d', hat: '#c8323a', hatStyle: 'beanie', scarf: '#fffaf0', gait: 'run', hop: 'h2', extra: SLED })}</g>
<g transform="translate(600 712)"><g class="wx"><g class="wr"><g transform="scale(1.15)"><g class="wa">${DOG_RUN}</g><g class="wb">${DOG_SPLAT}</g></g></g></g></g></g>`

// Snow piles up as the session's context fills. It comes fast at first and slows near
// full: over the cabin door and the snowman by 40%, up to the cabin's gable window and
// the tree's middle boughs by 90%.
const MAX_RISE = 120
const ground = (u: Usage | null, decor: string): string => {
  const rise = Math.round(MAX_RISE * Math.sqrt(percentOf(u) / 100))

  return `<g transform="translate(0 -${rise})"><path class="hillB" d="M0 700 Q150 676 330 694 T700 690 T1000 684 T1200 690 V1150 H0Z"/>
<path class="hill" d="M0 712 Q260 690 560 714 T1200 704 V1150 H0Z"/><path class="rim" d="M0 712 Q260 690 560 714 T1200 704"/>
<path class="hillF" d="M0 748 Q180 730 380 744 T760 740 T1200 746 V1150 H0Z"/><path class="hillF" d="M0 790 Q240 770 520 786 T1200 782 V1150 H0Z"/>
<path class="lump" d="M120 708 q40 -16 90 -4 q30 -12 70 2Z M760 704 q50 -18 110 -2 q40 -10 80 4Z M960 702 q40 -14 90 -2Z M420 712 q30 -10 64 -1Z"/>${decor}${KIDS}</g>`
}

// The top board wears a cap of snow that thickens with the context, and a sprig of holly.
const top = (u: Usage | null): { lift: number; art: string } => {
  const cap = 3 + percentOf(u) * 0.2

  return {
    lift: cap * 1.5,
    art: `<path class="snowfill" d="M50 92 q0 ${f(-cap * 1.6)} 22 ${f(-cap * 1.5)} q14 ${f(-cap * 0.9)} 28 0 q14 ${f(-cap * 0.8)} 28 ${f(cap * 0.2)} q22 0 22 ${f(cap * 1.3)} q-4 5 -10 0 q-5 6 -11 0 q-30 3 -58 0 q-5 6 -10 0 q-6 4 -11 0Z"/>
<path d="M58 ${f(92 - cap)} q-9 -12 4 -14 q-2 10 -4 14Z M66 ${f(90 - cap)} q2 -15 13 -9 q-8 6 -13 9Z" fill="#2f9e5b"/><circle cx="62" cy="${f(92 - cap)}" r="3.500" fill="#e04848"/><circle cx="68" cy="${f(95 - cap)}" r="3" fill="#e04848"/>`,
  }
}

export const winter: Season = {
  key: 'winter',
  label: '겨울',
  colors: {
    label: 'Winter',
    roles: { accent: '#b8262e', danger: '#c2255c', success: '#1f7a45', warning: '#b88410', pro: '#7a4a8c' },
    light: {
      gray: {
        anchors: { 'surface-0': '#f3eadb', 'surface-1': '#f8f1e5', 'surface-2': '#fdf9f1', 'text-primary': '#2a1a17', 'text-secondary': '#4d3832', 'text-muted': '#6b564e' },
      },
    },
    dark: {
      gray: {
        anchors: { 'surface-0': '#141a33', 'surface-1': '#1a2140', 'surface-2': '#20284a', 'surface-3': '#232c50', 'text-primary': '#f4f1e8', 'text-secondary': '#d2d3de', 'text-muted': '#a9adc4' },
      },
    },
  },
  bubble: '#a8232b',
  alt: '눈 내리는 겨울: 낮에는 뛰노는 아이들과 얼음에서 미끄러지는 강아지, 밤에는 산타 썰매, 트리와 오두막, 사용량 팻말과 촛불, 가로등',
  scene: (u, now) => {
    if (made === undefined || madeAt !== getLite()) {
      made = still()
      madeAt = getLite()
    }

    return `${made.head}${made.back}${lamp(u, now)}${signs(u, now, top(u))}${ground(u, made.decor)}${made.snow}</svg>`
  },
}
