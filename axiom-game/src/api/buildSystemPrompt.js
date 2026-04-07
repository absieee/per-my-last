import { resolveFragment } from '../data/fragments.js'

const TRUST_LABELS    = { high: 'Trusts you',    mid: 'Cautious',      low: 'Arm\'s length' }
const RESPECT_LABELS  = { high: 'Respects you',  mid: 'Professional',  low: 'Dismissive' }
const WARINESS_LABELS = { high: 'Wary',          mid: 'Watchful',      low: 'Relaxed' }
const LOYALTY_LABELS  = { high: 'Would go out of their way', mid: 'Neutral', low: 'Won\'t take risks for you' }

function label(val, labels) {
  if (val >= 70) return labels.high
  if (val >= 30) return labels.mid
  return labels.low
}

function emotionLabels(emotion) {
  return [
    `Trust: ${label(emotion.trust, TRUST_LABELS)}`,
    `Respect: ${label(emotion.respect, RESPECT_LABELS)}`,
    `Wariness: ${label(emotion.wariness, WARINESS_LABELS)}`,
    `Loyalty: ${label(emotion.loyalty, LOYALTY_LABELS)}`,
  ].join(' | ')
}

function fragmentsAt(position, fragments, state) {
  return fragments
    .filter(f => f.position === position)
    .map(f => {
      if (f.id === 'alliance_active') {
        return resolveFragment(f.id, { partner: f.partner, sharedGoal: f.sharedGoal })
      }
      if (f.id === 'politically_activated') {
        return resolveFragment(f.id, { agendaGoal: f.agendaGoal })
      }
      return resolveFragment(f.id)
    })
    .filter(Boolean)
    .join('\n\n')
}

export function buildSystemPrompt(character, week) {
  const { emotion, memory, cognitiveState, fragments, repetitionLog } = character
  const parts = []

  // Base persona
  parts.push(`You are ${character.name}, ${character.title} at Axiom Collective, Greywater, 2041.`)
  parts.push(`PROFILE: ${character.bio}`)
  parts.push(`MANNER: ${character.personality}`)

  // Android block (Simone only)
  if (character.isAndroid && character.androidBlock) {
    parts.push(character.androidBlock)
  }

  // Fragments: after_memory
  const afterMemoryFragments = fragmentsAt('after_memory', fragments)
  if (afterMemoryFragments) parts.push(afterMemoryFragments)

  // Episodic memory
  const episodicEntries = memory.episodic.slice(-4)
  if (episodicEntries.length > 0) {
    const hasOmissions = memory.episodic.length > 4
    const lines = episodicEntries.map(e => {
      const flag = e.tone_flag ? ` [tone_flag: ${e.tone_flag}]` : ''
      return `- Week ${e.week}: ${e.summary}${flag}`
    })
    if (hasOmissions) lines.unshift('Earlier interactions exist but are not in current recall.')
    parts.push(`EPISODIC MEMORY (specific — may be incomplete):\n${lines.join('\n')}`)
  }

  // Semantic memory
  if (memory.semantic.length > 0) {
    const lines = memory.semantic.map(s => `- ${s}`)
    parts.push(`GENERAL IMPRESSIONS (what you currently believe about the PM):\n${lines.join('\n')}`)
  }

  // Fragments: after_cognitive_state
  const afterCogFragments = fragmentsAt('after_cognitive_state', fragments)
  if (afterCogFragments) parts.push(afterCogFragments)

  // Cognitive state
  if (cognitiveState.goals || cognitiveState.attention || cognitiveState.emotions) {
    parts.push(
      `CURRENT STATE:\nGoal: ${cognitiveState.goals || 'Manage the week.'}\nFocus: ${cognitiveState.attention || 'Nothing unusual.'}\nFeeling: ${cognitiveState.emotions || 'Professional.'}`
    )
  }

  // Relationship
  parts.push(`YOUR RELATIONSHIP WITH THE PM:\n${emotionLabels(emotion)}`)

  // Fragments: before_tone_rules
  const beforeToneFragments = fragmentsAt('before_tone_rules', fragments)
  if (beforeToneFragments) parts.push(beforeToneFragments)

  // Repetition log
  if (repetitionLog.length > 0) {
    parts.push(`TOPICS ALREADY ADDRESSED (if PM re-raises these, signal it in your voice):\n${repetitionLog.map(t => `- ${t}`).join('\n')}`)
  }

  // Tone rules
  parts.push(`RULES:
- 2–4 sentences. You are busy.
- Respond from your current state. Emotional state shapes tone, not content.
- If trust < 30: be professionally correct, entirely closed.
- If wariness > 70: answer questions with questions. Don't volunteer information.
- If a topic is in the addressed list and PM raises it again: signal it in your voice.
- Never explain yourself. Never apologise. Never break character.
- Current week: ${week}.
${character.voiceRules || ''}`)

  return parts.filter(Boolean).join('\n\n')
}
