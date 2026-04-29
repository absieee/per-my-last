import { callClaude } from './proxy.js'

function narrativeEmotion(char) {
  const { trust, respect, wariness, loyalty } = char.emotion
  const t = trust >= 70 ? 'high trust' : trust >= 30 ? 'cautious' : 'arm\'s length'
  const r = respect >= 70 ? 'genuine respect' : respect >= 30 ? 'professional regard' : 'dismissive'
  const w = wariness >= 70 ? 'very wary' : wariness >= 30 ? 'watchful' : 'relaxed'
  const l = loyalty >= 70 ? 'loyal' : loyalty >= 30 ? 'neutral' : 'disengaged'
  return `${char.name}: ${t}, ${r}, ${w}, ${l}`
}


/**
 * Score the PM on two independent axes:
 *   political  — did you play the corporate game? (Petra trust + scenario choices)
 *   simone     — did you protect and trust Simone? (Simone trust + scenario choices)
 * Both axes are clamped 0–100.
 */
export function computeScores(state) {
  const { cast, decisionLog = [] } = state

  const petraTrust  = cast.find(c => c.id === 'petra')?.emotion.trust  ?? 50
  const simoneTrust = cast.find(c => c.id === 'simone')?.emotion.trust ?? 50

  let political = petraTrust
  let simone    = simoneTrust

  for (const d of decisionLog) {
    switch (d.scenarioId) {
      case 'scenario_1':
        if (d.choiceLabel === 'COMPLY & COVER') political += 20
        else if (d.choiceLabel === 'REDIRECT')  political += 10
        else if (d.choiceLabel === 'PUSH BACK') political -= 15
        break
      case 'scenario_3':
        if (d.choiceLabel === 'SPIN & COMPLY')  political += 15
        else if (d.choiceLabel === 'REDIRECT')  political += 10
        else if (d.choiceLabel === 'GO DARK')   political +=  5
        else if (d.choiceLabel === 'DENY')      political -= 10
        break
      case 'scenario_4':
        if (d.choiceLabel === 'LISTEN')         simone += 25
        else if (d.choiceLabel === 'HOLD STEADY') simone += 15
        else if (d.choiceLabel === 'ESCALATE')  simone -= 25
        break
      case 'conflict_petra_simone':
        if (d.choiceLabel === "SIMONE'S CALL")  simone += 15
        else if (d.choiceLabel === "PETRA'S CALL") simone -= 15
        break
      case 'conflict_callum_simone':
        if (d.choiceLabel === "SIMONE'S CALL")  simone += 15
        else if (d.choiceLabel === "CALLUM'S CALL") simone -= 10
        break
    }
  }

  return {
    political: Math.max(0, Math.min(100, political)),
    simone:    Math.max(0, Math.min(100, simone)),
  }
}

export function computeArchetype(state) {
  const { political, simone } = computeScores(state)

  const playedPolitics  = political >= 55
  const trustedSimone   = simone    >= 55

  if (playedPolitics && trustedSimone) {
    return {
      id: 'architect',
      title: 'THE ARCHITECT',
      verdict: 'You understood what the room needed. You also understood what the room could not see. These two things are not supposed to coexist in the same PM. They did, briefly.',
      color: '#4ECDC4',
    }
  }
  if (playedPolitics && !trustedSimone) {
    return {
      id: 'operator',
      title: 'THE OPERATOR',
      verdict: "You delivered exactly what was asked. The Q3 review was without incident. Simone's metrics have improved. She has stopped initiating conversation.",
      color: '#A29BFE',
    }
  }
  if (!playedPolitics && trustedSimone) {
    return {
      id: 'dissident',
      title: 'THE DISSIDENT',
      verdict: "The board room was uncomfortable. The story you told was true. Someone in the room respected you for it. The committee has noted which someone.",
      color: '#ff9f43',
    }
  }
  return {
    id: 'leftover',
    title: 'THE LEFTOVER',
    verdict: 'You made it to week eight. The review was noted. You are already being replaced. The role remains open for the next performance cycle.',
    color: '#FFE66D',
  }
}

export function computeSecretEnding(state) {
  const clueCount = state.officeRumors?.discoveredClues?.length || 0
  if (clueCount < 3) return null

  return {
    id: 'inherited_optics',
    title: 'UNOFFICIAL FILE NOTE: INHERITED OPTICS',
    verdict: 'The PM appears to have noticed a pattern the committee does not formally acknowledge: Meridian has a habit of failing in ways that remain narratively convenient for everyone except the PM holding the room.',
    color: '#fd79a8',
  }
}

export async function generateOpticsReport(state) {
  const { cast, decisionLog, toneFlagLog, completedScenarios, politics, officeRumors } = state

  const archetype = computeArchetype(state)
  const { political: politicalScore, simone: simoneScore } = computeScores(state)
  const secretEnding = computeSecretEnding(state)

  // Top 3 tone moments (worst then best)
  const sortedFlags = [...toneFlagLog].sort((a, b) => {
    const order = { political_risk: 0, composure: 1, repetition: 2 }
    return (order[a.flag] ?? 3) - (order[b.flag] ?? 3)
  })
  const flaggedMoments = sortedFlags.slice(0, 3)

  const emotionNarratives = cast.map(narrativeEmotion).join('\n')
  const decisionsNarrative = decisionLog.map(d => `${d.scenarioTitle}: ${d.choiceLabel}`).join(', ')
  const repetitionCount = toneFlagLog.filter(f => f.flag === 'repetition').length
  const transitionedChars = cast.filter(c => c.transitioned || c.isSuccessor)
  const simoneReturned = cast.find(c => c.id === 'simone')?.hasReturned || false

  const allianceCount = politics.alliances.length
  const conflictsSeen = decisionLog.filter(d => d.scenarioId.startsWith('conflict_') || d.scenarioId.startsWith('crisis_')).length
  const rumorClues = officeRumors?.clueLog || []
  const clueSummary = rumorClues.map(entry => `- Week ${entry.week}, from ${entry.npcName}: ${entry.clue}`).join('\n')

  const simoneVoiceNote = {
    architect: "Simone's feedback should feel warm but precise — she is still watching you, and this is unusual for her.",
    operator:  "Simone's feedback should be short, clinical, and absent of warmth. She is correct and she is done.",
    dissident: "Simone's feedback should be unexpectedly present — she noticed, and she wants you to know she noticed.",
    leftover:  "Simone's feedback should be a single sentence. No affect. The sentence should feel final.",
  }[archetype.id] ?? ''

  const prompt = `You are generating the end-of-game Optics Report for a corporate PM simulation set at Axiom Collective, Greywater, 2041. The tone is dry British corporate absurdism.

OVERALL VERDICT ARCHETYPE: "${archetype.title}" — ${archetype.verdict}
Write the entire report consistent with this ending archetype. The archetype reflects the PM's overall stakeholder trajectory.

AXIS SCORES (internal, do not mention directly):
- Political alignment score: ${politicalScore}/100 (higher = played the corporate game)
- Simone relationship score: ${simoneScore}/100 (higher = trusted and protected Simone)

SIMONE VOICE NOTE: ${simoneVoiceNote}

FINAL EMOTIONAL STATES:
${emotionNarratives}

SCENARIO DECISIONS:
${decisionsNarrative || 'No scenarios completed.'}

FLAGGED TONE MOMENTS (${flaggedMoments.length}):
${flaggedMoments.map(f => `- ${f.flag} flag, Week ${f.week}, in conversation with ${f.characterId}: "${f.messageExcerpt?.slice(0, 60)}..."`).join('\n') || 'None.'}

REPETITION TRIGGER COUNT: ${repetitionCount}
ALLIANCES ACTIVE: ${allianceCount}
CONFLICT SCENARIOS RESOLVED: ${conflictsSeen}
CHARACTERS TRANSITIONED: ${transitionedChars.map(c => c.name).join(', ') || 'None'}
SIMONE RETURNED: ${simoneReturned}
OFFICE RUMOUR CLUES DISCOVERED: ${rumorClues.length}
RUMOUR FILE:
${clueSummary || 'None.'}

Write the Optics Report with exactly these 5 sections:

1. EXECUTIVE SUMMARY (2 sentences — blunt, corporate)
2. STAKEHOLDER FEEDBACK — one paragraph per character (Petra, Callum, Simone, Marcus), written in each character's voice
3. COMMUNICATION OBSERVATIONS — exactly 3 flagged moments, described without editorialising
4. ALIGNMENT ASSESSMENT (one closing paragraph — the committee's view of the PM's future)
5. Final line, always exactly: "Project Meridian continues. The PM role remains open for the next performance cycle."

${transitionedChars.length > 0 ? `Add after section 4: "The review period included workforce transitions with relevance to the PM's stakeholder portfolio. The committee considered both the immediate decision context and the longer-term relational pattern that preceded it."` : ''}
${simoneReturned ? `Add after the transitions paragraph: "The committee notes the PM and Simone Adeyemi appear to have experienced a period of recalibration. Simone has not raised concerns directly. The committee does not consider this a closed matter."` : ''}

Add a POLITICAL LANDSCAPE section between sections 4 and 5:
"The review period was notable for cross-functional dynamics that intersected with the PM's decision-making. The PM navigated ${conflictsSeen} formal conflict situations and ${allianceCount} periods of informal stakeholder misalignment."

Then add one sentence per character's political assessment using these exact templates:
- Petra: 'Petra notes the PM was, on balance, "very process-aware." She has not elaborated on what she means by "on balance."'
- Callum: 'Callum's assessment was provided in writing. It runs to four pages. The committee has summarised it as: cautious confidence, with caveats.'
- Marcus: 'Marcus declined to provide written feedback, preferring a conversation. The committee has noted the content. It will not be shared with the PM.'
- Simone: '${{
    architect: 'Simone\'s feedback was one sentence: "You were paying attention." The committee has read this three times.',
    operator:  'Simone submitted feedback. It was empty. The committee has noted this as a systems error pending review.',
    dissident: 'Simone\'s feedback read: "The PM made the correct calls. I noticed." The committee is uncertain whether this is professional.',
    leftover:  'Simone\'s feedback read: "The PM made decisions. Some of them were correct." The committee is uncertain whether this is positive.',
  }[archetype.id] ?? 'Simone\'s feedback read: "The PM made decisions. Some of them were correct." The committee is uncertain whether this is positive.'}'`

  const finalPrompt = secretEnding
    ? `${prompt}

The PM has also quietly pieced together unofficial corridor rumours about the previous PM's exit.
Add one extra section titled "UNOFFICIAL NOTE" between POLITICAL LANDSCAPE and the final line.
This section should be one paragraph only. It must imply, not confirm, that the PM may have inherited an impossible narrative situation rather than caused a wholly new one.
Do not solve the mystery. Do not state objective truth. Keep it ambiguous, unsettling, and bureaucratically deniable.`
    : prompt

  const text = await callClaude({
    system: 'You are a corporate performance review committee. Write in dry, precise British English. Do not break character.',
    messages: [{ role: 'user', content: finalPrompt }],
    model: 'claude-sonnet-4-6',
    max_tokens: 900,
  })

  return { text, archetype, secretEnding }
}
