import { callClaude } from './proxy.js'
import { characterReply } from './characterReply.js'

const SYSTEM = `You are a persona consistency checker. Return only a JSON object with no other text.`

export async function personaCheck(reply, character, playerMessage, week) {
  const { emotion, fragments } = character
  const trustLabel = emotion.trust >= 70 ? 'high' : emotion.trust >= 30 ? 'mid' : 'low'
  const warinessLabel = emotion.wariness >= 70 ? 'high' : emotion.wariness >= 30 ? 'mid' : 'low'

  const prompt = `Check whether this character response is consistent with their current state.

Character: ${character.name}, ${character.title}
Trust: ${trustLabel} (${emotion.trust}) | Wariness: ${warinessLabel} (${emotion.wariness})
Voice signature: ${character.personality}
Active fragments: ${fragments.map(f => f.id).join(', ') || 'none'}
${character.isAndroid ? 'Note: character never uses "feel" — uses "notice" or "observe".' : ''}

Response to check: "${reply}"

Return JSON only:
{
  "passes": true or false,
  "issue": null | "too_warm" | "too_cold" | "wrong_voice" | "over_disclosure" | "android_tell_missed",
  "note": "one sentence explanation if issue found, else null"
}`

  const raw = await callClaude({
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
  })

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    const result = JSON.parse(jsonMatch?.[0] || '{}')
    if (!result.passes && result.issue) {
      // One retry with correction
      const corrected = await characterReply(
        character,
        playerMessage,
        week,
        `CORRECTION: Previous draft flagged as ${result.issue}. Specifically: ${result.note}. Regenerate addressing this.`
      )
      return corrected
    }
    return null // no correction needed
  } catch {
    return null
  }
}
