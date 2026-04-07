# AGENTS.md - Project Technical Guide

## Project Overview

AXIOM — Per My Last is a browser-based PM simulation game set in Greywater, 2041. The player manages Project Meridian as a human PM navigating 4 corporate stakeholders. Game thesis: communication optics matter more than technical correctness. Built with Vite + React + Phaser.js. One AI call at game end (Optics Report via Gemini).

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Game Engine**: Phaser 3 (top-down office world, no physics)
- **AI**: Gemini 2.0 Flash via Express proxy (`server.js`)
- **Fonts**: VT323, Josefin Sans, Syne (Google Fonts)
- **Audio**: Web Audio API (procedural, no asset files)

## Project Structure

```
axiom-game/
├── src/
│   ├── api/            # Gemini proxy calls (opticsReport, pressureScenario)
│   ├── audio/          # soundEngine.js — Web Audio procedural SFX + ambient
│   ├── components/
│   │   ├── Game/       # DialoguePanel, HUD, InteractionPrompt, WatercoolerPanel, IntroScreen
│   │   ├── Scenario/   # ScenarioModal, StakeholderResponseScreen
│   │   ├── OpticsReport/
│   │   └── Layout/     # Atmosphere (CRT scanline overlay)
│   ├── data/           # cast.js, scenarios.js, dialogues.js, fragments.js, watercooler.js
│   ├── game/           # OfficeScene.js, index.js (Phaser config)
│   ├── state/          # gameReducer.js, initialState.js
│   └── styles/         # globals.css (CRT design system, CSS variables)
├── server.js           # Express proxy → Gemini API
├── .env                # GEMINI_API_KEY
└── TODO.md             # Task list — primary source of new tasks
```

## Working Rules

**Plan before building when the task touches multiple files AND requires more than ~20 lines of changes.** Use EnterPlanMode, explore, write a plan, get confirmation, then implement. For smaller changes (single file, under 20 lines, or straightforward edits) just do it directly.

**Read TODO.md first.** It is the primary source of new tasks. Check off items (`- [x]`) as they are completed.

## Running the Game

```bash
cd axiom-game
npm run dev       # Vite frontend (port 5173)
npm run server    # Gemini proxy (port 3001) — required for Optics Report
```

## Key Patterns

- **Phaser ↔ React**: communicate via `window.dispatchEvent(new CustomEvent(...))`. Phaser emits `phaser:proximity` and `phaser:interact`; React emits `phaser:pause` and `phaser:resume`.
- **Dialogue system**: pre-written trees in `src/data/dialogues.js`. `getAvailableDialogue(characterId, state)` + `resolveReply(response, emotion)`. No AI during gameplay.
- **State**: `useReducer` with `gameReducer`. All emotion deltas go through `applyEmotionDelta` (clamped 0–100).
- **Sound**: `SFX.startAmbient()` must be called after a user gesture (browser autoplay policy). Called on first `phaser:interact` event.
