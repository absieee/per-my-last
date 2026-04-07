// Persona fragment library — injected into system prompts based on game state
// position: 'after_memory' | 'after_cognitive_state' | 'before_tone_rules'

export const FRAGMENT_LIBRARY = {
  emotional_residue: {
    id: 'emotional_residue',
    characters: ['simone'],
    position: 'after_cognitive_state',
    content: `Something about this PM makes you want more certainty than usual. You cannot say why. You trust the instinct.`,
  },

  alliance_active: {
    id: 'alliance_active',
    characters: 'any',
    position: 'before_tone_rules',
    // Slots: [partner], [shared_goal]
    content: (partner, sharedGoal) =>
      `You and ${partner} are currently aligned on ${sharedGoal}. You don't coordinate explicitly, but you notice when the PM's decisions serve or undermine that goal.`,
  },

  successor_briefed: {
    id: 'successor_briefed',
    characters: ['petra', 'callum', 'marcus'],
    position: 'after_memory',
    content: `You have read the file on this PM's tenure. You know what happened to your predecessor. You are professional about this. You are thorough.`,
  },

  hostile_pressure: {
    id: 'hostile_pressure',
    characters: ['simone'],
    position: 'after_cognitive_state',
    content: `You have been raising concerns more frequently. The timelines are tight. You know the PM finds this difficult. You are not doing this to be difficult — you genuinely cannot proceed without more certainty. You wish you could explain why.`,
  },

  politically_activated: {
    id: 'politically_activated',
    characters: 'any',
    position: 'before_tone_rules',
    // Slot: [agenda_goal]
    content: (agendaGoal) =>
      `You are actively pursuing ${agendaGoal}. This PM can help or hinder that. You are not hostile — you are attentive. You will notice what they say and what they don't.`,
  },
}

// Build fragment text from library entry + optional slot values
export const resolveFragment = (fragmentId, slots = {}) => {
  const f = FRAGMENT_LIBRARY[fragmentId]
  if (!f) return ''
  if (typeof f.content === 'function') {
    return f.content(...Object.values(slots))
  }
  return f.content
}
