import { callClaude } from './proxy.js'

const SYSTEM = `You are a silent tone evaluator. Analyse the PM's message and return only a JSON object with no other text.`

export async function toneEvaluator(playerMessage, character, recentExchanges, repetitionLog) {
  const context = [
    `Character: ${character.name}`,
    `Trust: ${character.emotion.trust} | Wariness: ${character.emotion.wariness}`,
    `Recent exchanges: ${recentExchanges.slice(-3).map(m => `[${m.role}]: ${m.content.slice(0, 80)}`).join(' | ')}`,
    `Topics already addressed: ${repetitionLog.join(', ') || 'none'}`,
  ].join('\n')

  const prompt = `Evaluate this message from a Product Manager to ${character.name}.
Context: ${context}

PM message: "${playerMessage}"

Return JSON only:
{
  "composure": -2 to +1,
  "clarity": -1 to +1,
  "register": -1 to +1,
  "repetition": -2 to 0,
  "political_risk": -1 to 0
}

composure: -2 agitated/condescending, -1 mild impatience, 0 neutral, +1 notably calm.
clarity: -1 vague, 0 adequate, +1 unusually clear.
register: -1 wrong tone for relationship, 0 appropriate, +1 well-calibrated.
repetition: 0 not a repeat, -1 mild retread, -2 clearly addressed before.
political_risk: 0 safe, -1 problematic if forwarded.`

  const raw = await callClaude({
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
  })

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    return JSON.parse(jsonMatch?.[0] || '{}')
  } catch {
    return { composure: 0, clarity: 0, register: 0, repetition: 0, political_risk: 0 }
  }
}
