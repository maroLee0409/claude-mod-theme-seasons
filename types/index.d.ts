export type Usage = { percent?: number; fiveHour?: number; usd?: number; at: number }
export type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter'

declare module 'claude-code' {
  interface PluginState {
    'christmas-snow': { usage: Usage | null }
  }
}
