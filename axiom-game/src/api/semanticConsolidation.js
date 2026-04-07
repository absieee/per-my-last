import { callClaude } from './proxy.js'

export async function semanticConsolidation(character, episodicEntries) {
  const entries = episodicEntries.slice(-4).map(e => `Week ${e.week}: ${e.summary}`).join('\n')

  const prompt = `Summarise these recent interactions from ${character.name}'s perspective.
Write 1–2 sentences in first person — a general belief or impression of the PM, not a memory of what happened.
Write in ${character.name}'s voice: ${character.personality}
Do not reference specific events. Do not use the word "feel" if the character is Simone.

Recent interactions:
${entries}

Output only the impression sentence(s). No preamble.`

  return callClaude({
    system: `You are ${character.name}. Write a brief consolidated impression of the PM.`,
    messages: [{ role: 'user', content: prompt }],
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
  })
}
