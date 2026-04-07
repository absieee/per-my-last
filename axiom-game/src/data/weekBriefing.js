// Generates Slack-style notification messages for the end-of-week briefing.
// Each message is from a cast member, tonally derived from their emotional state.

const MESSAGES = {
  petra: {
    alarmed:     ["I need to raise something with you directly.", "Can we talk before this goes any further?", "I've flagged this with the board."],
    wary:        ["Following up on a few things from this week.", "Let's find time to align before Monday.", "I want to make sure we're on the same page."],
    neutral:     ["Good week overall. See you Monday.", "Let's keep the momentum going.", "Meridian is tracking well on my end.", "Q3 review prep starts now. Thursday's alignment review is the first gate."],
    warm:        ["Really strong week. The team noticed.", "Glad we had that conversation. It helped.", "You're building the right credibility here.", "Strong first week. The Q3 review is in sight. Thursday matters."],
  },
  callum: {
    alarmed:     ["I've escalated a few items. Worth discussing.", "Legal has some concerns. I'll send a summary.", "This needs to be documented before it moves forward."],
    wary:        ["Looping in Legal on a couple of items. Will keep you posted.", "Wanted to make sure we're on the same page.", "A few questions came up on our side. Not urgent, but worth a chat."],
    neutral:     ["Legal is tracking. All clear for now.", "Meridian is looking fine on our end.", "Nothing blocking from my side."],
    warm:        ["Clean week from a compliance standpoint.", "Solid alignment across the board.", "No blockers. Keep doing what you're doing."],
  },
  simone: {
    alarmed:     ["Engineering had questions I couldn't answer. That's a problem.", "Sprint is at risk. We need to talk.", "The team is frustrated. I can't keep this contained."],
    wary:        ["A few things came up in sprint planning. Worth a chat.", "Engineering has some questions I couldn't answer.", "We're managing it, but it's getting harder."],
    neutral:     ["Sprint's on track. Team is heads down.", "Good progress this week.", "Nothing major to flag from engineering."],
    warm:        ["Team is energised. Good signals.", "Velocity is up. Keep it coming.", "Engineering is bought in. Let's not waste it."],
  },
  marcus: {
    alarmed:     ["Comms is getting direct inbounds. This is escalating.", "A few journalists have been asking questions.", "The narrative is slipping. We need to act."],
    wary:        ["Comms wanted to flag something. Can you review before EOD?", "A few stakeholders have been reaching out directly.", "The optics on this week are... mixed."],
    neutral:     ["Coverage is building. Steady week.", "Board seems satisfied with the direction.", "Comms is managing the narrative."],
    warm:        ["Really strong optics this week.", "The story is landing exactly right.", "Board is bullish. Great moment to press forward."],
  },
}

const TIMESTAMPS = ['just now', '1m ago', '3m ago', '5m ago', '8m ago']

function getTone(character) {
  const { trust, wariness } = character.emotion
  if (trust < 20 || wariness > 75) return 'alarmed'
  if (trust < 40 || wariness > 55) return 'wary'
  if (trust > 65 && wariness < 40)  return 'warm'
  return 'neutral'
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getBriefingMessages(state) {
  // Pick the 2–3 most notable characters to message the PM
  const scored = state.cast
    .filter(c => !c.transitioned)
    .map(c => {
      // Score = how "notable" is this character's state right now
      const { trust, wariness } = c.emotion
      const score = Math.abs(trust - 50) + Math.abs(wariness - 35)
      return { c, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ c }) => c)

  // Shuffle timestamps
  const times = [...TIMESTAMPS].sort(() => Math.random() - 0.5)

  return scored.map((character, i) => {
    const tone = getTone(character)
    const pool = MESSAGES[character.id]?.[tone] ?? MESSAGES[character.id]?.neutral ?? ['No updates.']
    return {
      characterId:  character.id,
      name:         character.shortName,
      accentColor:  character.accentColor,
      message:      pick(pool),
      timestamp:    times[i] ?? 'just now',
      delay:        i * 500, // stagger entry
    }
  })
}
