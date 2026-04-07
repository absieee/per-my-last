/**
 * Regenerates EMBEDDED_DIALOGUES + EMBEDDED_SCENARIOS in docs/decision-tree.html
 * from src/data/dialogues.js and src/data/scenarios.js. Run from axiom-game:
 *   node scripts/sync-decision-tree-embedded.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { DIALOGUES } from '../src/data/dialogues.js'
import { SCENARIOS, CONFLICT_SCENARIOS } from '../src/data/scenarios.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.resolve(__dirname, '../../docs/decision-tree.html')

function dialogueToEmbedded(d) {
  const ex = d.exchange
  return {
    id: d.id,
    characterId: d.characterId,
    priority: d.priority,
    requiresComposure: !!d.requiresComposure,
    availableSource: d.available.toString(),
    contextLineSource: d.contextLine ? d.contextLine.toString() : null,
    exchange: {
      beats: ex.beats,
      miniGame: ex.miniGame ?? null,
      responses: (ex.responses || []).map((r) => ({
        id: r.id,
        label: r.label,
        subtext: r.subtext,
        effects: r.effects,
        reply: r.reply,
      })),
      replies: ex.replies ?? null,
    },
  }
}

function scenarioToEmbedded(s) {
  const row = {
    id: s.id,
    title: s.title,
    from: s.from,
    tag: s.tag,
    week: s.week,
    involvedParties: s.involvedParties ?? null,
    unlockConditionSource: s.unlockCondition ? s.unlockCondition.toString() : null,
    brief: s.brief,
    subtext: s.subtext,
    prePressure: s.prePressure ?? null,
    choices: s.choices.map((c) => ({
      label: c.label,
      text: c.text,
      outcome: c.outcome,
    })),
  }
  if (s.requiresFreeText) row.requiresFreeText = true
  if (s.freeTextPrompt) row.freeTextPrompt = s.freeTextPrompt
  return row
}

const dialogues = DIALOGUES.map(dialogueToEmbedded)
const scenarios = [...SCENARIOS, ...CONFLICT_SCENARIOS].map(scenarioToEmbedded)

const dialoguesBlock = `const EMBEDDED_DIALOGUES =\n${JSON.stringify(dialogues, null, 2)}\n;`
const scenariosBlock = `const EMBEDDED_SCENARIOS = ${JSON.stringify(scenarios, null, 2)}\n;`

let html = fs.readFileSync(htmlPath, 'utf8')
const start = html.indexOf('const EMBEDDED_DIALOGUES =')
const end = html.indexOf('const OBJECTIVE_TIMELINE =')
if (start === -1 || end === -1) {
  console.error('Could not find EMBEDDED_DIALOGUES or OBJECTIVE_TIMELINE anchors')
  process.exit(1)
}

html = html.slice(0, start) + dialoguesBlock + '\n\n' + scenariosBlock + '\n\n' + html.slice(end)
fs.writeFileSync(htmlPath, html)
console.log(`Updated ${htmlPath} (${dialogues.length} dialogues, ${scenarios.length} scenarios)`)
