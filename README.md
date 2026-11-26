# claude-mod-theme-seasons

A Claude Code (Desktop) mod: four seasonal themes with an animated backdrop.

- Spring, summer, autumn, winter — each with its own colors and scene
- Dark mode draws the night scene, light mode the morning scene (a dog animation each season)
- The scene shows session usage: context %, 5-hour limit, estimated cost
- Winter snow piles up as the context fills

## Install

Copy this folder to `~/.claude/skills/christmas-snow`, then:

    claude plugin enable christmas-snow@skills-dir

Turn off: `claude plugin disable christmas-snow@skills-dir` (restart the app).

## Commands

- `/season spring|summer|autumn|winter|auto` — pick a season (auto follows the month)
- `/lite 0-3` — draw less to save memory (0 all motion, 3 none)

## Note

Each open session keeps its own backdrop in memory. If memory grows, use `/lite 2` or disable the mod.
