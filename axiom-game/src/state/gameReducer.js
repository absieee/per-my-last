import { initialState } from './initialState.js'

const clamp = (v) => Math.max(0, Math.min(100, v))

const applyEmotionDelta = (emotion, delta) => {
  const next = { ...emotion }
  for (const [key, val] of Object.entries(delta)) {
    if (key in next) next[key] = clamp(next[key] + val)
  }
  return next
}

const TONE_ADJUSTMENTS = {
  composure: {
    '-2': { trust: -4, respect: -5, wariness: +6 },
    '-1': { trust: -2, wariness: +2 },
    '+1': { trust: +2, respect: +1 },
  },
  clarity: {
    '-1': { respect: -2 },
    '+1': { respect: +2, trust: +1 },
  },
  register: {
    '-1': { wariness: +3, respect: -2 },
  },
  repetition: {
    '-1': { wariness: +2, trust: -1 },
    '-2': { wariness: +4, trust: -3, respect: -3 },
  },
  political_risk: {
    '-1': { wariness: +5 },
  },
}

function toneScoresToDelta(scores) {
  const delta = { trust: 0, respect: 0, wariness: 0, loyalty: 0 }
  for (const [axis, val] of Object.entries(scores)) {
    const key = String(val)
    const adj = TONE_ADJUSTMENTS[axis]?.[key]
    if (adj) {
      for (const [k, v] of Object.entries(adj)) {
        delta[k] = (delta[k] || 0) + v
      }
    }
  }
  return delta
}

export function gameReducer(state, action) {
  switch (action.type) {

    case 'SET_ACTIVE_CHARACTER':
      return { ...state, activeCharacterId: action.id }

    case 'APPEND_MESSAGE': {
      const { characterId, message } = action
      return {
        ...state,
        cast: state.cast.map(c =>
          c.id === characterId
            ? { ...c, chatHistory: [...c.chatHistory, message] }
            : c
        ),
      }
    }

    case 'APPEND_EPISODIC': {
      const { characterId, entry } = action
      return {
        ...state,
        cast: state.cast.map(c => {
          if (c.id !== characterId) return c
          const episodic = [...c.memory.episodic, entry].slice(-8)
          return { ...c, memory: { ...c.memory, episodic } }
        }),
      }
    }

    case 'APPEND_SEMANTIC': {
      const { characterId, sentence } = action
      return {
        ...state,
        cast: state.cast.map(c => {
          if (c.id !== characterId) return c
          const semantic = [...c.memory.semantic, sentence].slice(-4)
          return { ...c, memory: { ...c.memory, semantic } }
        }),
      }
    }

    case 'APPLY_TONE_SCORES': {
      const { characterId, scores, messageExcerpt } = action
      const delta = toneScoresToDelta(scores)
      const isPoliticalRisk = scores.political_risk === -1
      // Log tone flags
      const newFlags = []
      if (scores.composure <= -1)
        newFlags.push({ week: state.week, characterId, flag: 'composure', messageExcerpt })
      if (scores.repetition <= -1)
        newFlags.push({ week: state.week, characterId, flag: 'repetition', messageExcerpt })
      if (isPoliticalRisk)
        newFlags.push({ week: state.week, characterId, flag: 'political_risk', messageExcerpt })

      return {
        ...state,
        cast: state.cast.map(c => {
          if (c.id !== characterId) return c
          // Political risk affects all characters in the loop
          return { ...c, emotion: applyEmotionDelta(c.emotion, delta) }
        }),
        toneFlagLog: [...state.toneFlagLog, ...newFlags],
        // Political risk wariness bump to all characters
        ...(isPoliticalRisk ? {
          cast: state.cast.map(c =>
            c.id !== characterId
              ? { ...c, emotion: applyEmotionDelta(c.emotion, { wariness: 5 }) }
              : { ...c, emotion: applyEmotionDelta(c.emotion, delta) }
          ),
          toneFlagLog: [...state.toneFlagLog, ...newFlags],
        } : {}),
      }
    }

    case 'APPLY_REPETITION': {
      const { characterId, count } = action
      const deltas = count === 1
        ? { wariness: +2, trust: -1 }
        : count === 2
          ? { wariness: +4, trust: -5 }
          : { wariness: +6, trust: -8, respect: -8 }
      return {
        ...state,
        cast: state.cast.map(c =>
          c.id === characterId
            ? { ...c, emotion: applyEmotionDelta(c.emotion, deltas) }
            : c
        ),
      }
    }

    case 'ADD_REPETITION_TOPIC': {
      const { characterId, topic } = action
      return {
        ...state,
        cast: state.cast.map(c =>
          c.id === characterId
            ? { ...c, repetitionLog: [...c.repetitionLog, topic] }
            : c
        ),
      }
    }

    case 'UPDATE_COGNITIVE_STATE': {
      const { characterId, cognitiveState } = action
      return {
        ...state,
        cast: state.cast.map(c =>
          c.id === characterId
            ? { ...c, cognitiveState: { ...c.cognitiveState, ...cognitiveState } }
            : c
        ),
      }
    }

    case 'ADD_FRAGMENT': {
      const { characterId, fragment } = action
      return {
        ...state,
        cast: state.cast.map(c => {
          if (c.id !== characterId) return c
          const exists = c.fragments.find(f => f.id === fragment.id)
          if (exists) return c
          return { ...c, fragments: [...c.fragments, fragment] }
        }),
      }
    }

    case 'DISCOVER_OFFICE_RUMOR': {
      const { clueId, npcId, npcName, clue } = action
      if (state.officeRumors?.discoveredClues?.includes(clueId)) return state

      const discoveredClues = [...(state.officeRumors?.discoveredClues || []), clueId]
      const clueLog = [
        ...(state.officeRumors?.clueLog || []),
        { clueId, npcId, npcName, clue, week: state.week },
      ]

      return {
        ...state,
        officeRumors: {
          discoveredClues,
          clueLog,
          hiddenEndingUnlocked: discoveredClues.length >= 3,
        },
      }
    }

    case 'DISCOVER_OVERHEAR_INTEL': {
      const { intelTag, npcId, npcName, text, stakeholderHint } = action
      if (!intelTag || state.officeRumors?.discoveredClues?.includes(intelTag)) return state

      const discoveredClues = [...(state.officeRumors?.discoveredClues || []), intelTag]
      const clueLog = [
        ...(state.officeRumors?.clueLog || []),
        { clueId: intelTag, npcId, npcName, clue: text, stakeholderHint, week: state.week, type: 'overheard' },
      ]

      return {
        ...state,
        officeRumors: {
          discoveredClues,
          clueLog,
          hiddenEndingUnlocked: discoveredClues.length >= 3,
        },
      }
    }

    case 'APPLY_EAVESDROP_WARINESS': {
      const { stakeholderId } = action
      if (!stakeholderId) return state
      return {
        ...state,
        cast: state.cast.map(c =>
          c.id === stakeholderId
            ? { ...c, emotion: applyEmotionDelta(c.emotion, { wariness: 2 }) }
            : c
        ),
      }
    }

    case 'REMOVE_FRAGMENT': {
      const { characterId, fragmentId } = action
      return {
        ...state,
        cast: state.cast.map(c =>
          c.id === characterId
            ? { ...c, fragments: c.fragments.filter(f => f.id !== fragmentId) }
            : c
        ),
      }
    }

    case 'SET_ACTIVE_SCENARIO':
      return { ...state, activeScenario: action.scenario }

    case 'RESOLVE_SCENARIO': {
      const { scenarioId, choiceIndex, choice } = action
      const scenario = [...state.scenarioQueue, ...state.politics.conflictQueue]
        .find(s => s.id === scenarioId)
      if (!scenario) return state

      // Apply emotion effects to each character
      let nextCast = state.cast.map(c => {
        const delta = choice.effects?.[c.id]
        if (!delta) return c
        return { ...c, emotion: applyEmotionDelta(c.emotion, delta) }
      })

      // Build stakeholder response data
      const stakeholderResponseData = {
        scenarioId,
        scenarioTitle: scenario.title,
        choiceLabel: choice.label,
        characterReactions: state.cast.map(c => ({
          id: c.id,
          name: c.shortName,
          accentColor: c.accentColor,
          ...choice.reactionLabels?.[c.id],
        })),
      }

      // Add to decision log
      const decisionEntry = {
        scenarioId,
        scenarioTitle: scenario.title,
        choiceLabel: choice.label,
        choiceIndex,
        outcome: choice.outcome,
        week: state.week,
        effects: choice.effects || {},
        triggersSimoneReturn: choice.triggersSimoneReturn || false,
      }

      return {
        ...state,
        cast: nextCast,
        activeScenario: null,
        completedScenarios: [...state.completedScenarios, scenarioId],
        scenarioQueue: state.scenarioQueue.filter(s => s.id !== scenarioId),
        showingStakeholderResponse: true,
        stakeholderResponseData,
        decisionLog: [...state.decisionLog, decisionEntry],
      }
    }

    case 'DISMISS_STAKEHOLDER_RESPONSE': {
      const lastDecision = state.decisionLog[state.decisionLog.length - 1]
      return {
        ...state,
        showingStakeholderResponse: false,
        stakeholderResponseData: null,
        outcomeNotice: lastDecision?.outcome || null,
      }
    }

    case 'CLEAR_OUTCOME_NOTICE':
      return { ...state, outcomeNotice: null }

    case 'ADVANCE_WEEK': {
      let nextState = { ...state, week: state.week + 1 }
      // Track low-trust weeks for transitions
      nextState = {
        ...nextState,
        cast: nextState.cast.map(c => {
          if (c.transitioned || c.isAndroid) return c
          const lowTrust = c.emotion.trust < 10
          return {
            ...c,
            lowTrustWeeks: lowTrust ? (c.lowTrustWeeks || 0) + 1 : 0,
          }
        }),
      }
      return nextState
    }

    case 'TRANSITION_CHARACTER': {
      const { characterId, cause, successorName } = action
      const char = state.cast.find(c => c.id === characterId)
      if (!char) return state
      const baselineEmotions = {
        scenario_decision:    { trust: 50, respect: 50, wariness: 65, loyalty: 10 },
        relationship_collapse: { trust: 50, respect: 50, wariness: 55, loyalty: 15 },
        both:                 { trust: 50, respect: 50, wariness: 80, loyalty: 5 },
      }[cause] || { trust: 50, respect: 50, wariness: 60, loyalty: 15 }

      const successor = {
        ...char,
        name: successorName || `${char.shortName}'s Successor`,
        isSuccessor: true,
        transitioned: false,
        emotion: baselineEmotions,
        memory: {
          episodic: [{ week: state.week, summary: char.successorMemory, tone_flag: null }],
          semantic: [],
        },
        chatHistory: [],
        fragments: [{ id: 'successor_briefed', position: 'after_memory' }],
      }
      return {
        ...state,
        cast: state.cast.map(c => {
          if (c.id !== characterId) return c
          return { ...c, transitioned: true, transitionedWeek: state.week, transitionCause: cause, emotionalStateAtTransition: c.emotion }
        }),
        // Add successor as a new entry; UI shows successor instead of transitioned char
        transitionedCharacters: [...(state.transitionedCharacters || []), { original: char, successor, week: state.week }],
      }
    }

    case 'RETURN_SIMONE': {
      const simone = state.cast.find(c => c.id === 'simone')
      if (!simone) return state
      const priorTrust = simone.emotionalStateAtTransition?.trust || simone.emotion.trust
      const priorWariness = simone.emotionalStateAtTransition?.wariness || simone.emotion.wariness
      const priorLoyalty = simone.emotionalStateAtTransition?.loyalty || simone.emotion.loyalty
      return {
        ...state,
        cast: state.cast.map(c => {
          if (c.id !== 'simone') return c
          return {
            ...c,
            transitioned: false,
            hasReturned: true,
            emotion: {
              trust: Math.max(5, priorTrust - 40),
              respect: c.emotion.respect,
              wariness: Math.min(95, priorWariness + 40),
              loyalty: Math.max(5, priorLoyalty - 35),
            },
            memory: { ...c.memory, episodic: [] },
            memoryWipeActive: true,
            emotionalResidueActive: true,
            fragments: [...c.fragments, { id: 'emotional_residue', position: 'after_cognitive_state' }],
          }
        }),
      }
    }

    case 'UPDATE_ALLIANCE': {
      const { alliance } = action
      const existing = state.politics.alliances.findIndex(
        a => a.members.slice().sort().join() === alliance.members.slice().sort().join()
      )
      const alliances = existing >= 0
        ? state.politics.alliances.map((a, i) => i === existing ? { ...a, ...alliance } : a)
        : [...state.politics.alliances, { ...alliance, formedWeek: state.week }]
      return {
        ...state,
        politics: { ...state.politics, alliances },
      }
    }

    case 'DISSOLVE_ALLIANCE': {
      const { members } = action
      const key = members.slice().sort().join()
      return {
        ...state,
        politics: {
          ...state.politics,
          alliances: state.politics.alliances.filter(
            a => a.members.slice().sort().join() !== key
          ),
        },
      }
    }

    case 'UPDATE_AGENDA_PRESSURE': {
      const { characterId, delta } = action
      return {
        ...state,
        politics: {
          ...state.politics,
          agendaPressure: {
            ...state.politics.agendaPressure,
            [characterId]: clamp((state.politics.agendaPressure[characterId] || 0) + delta),
          },
        },
      }
    }

    case 'ADD_SIGNAL_LOG': {
      const { entry } = action
      const signalLog = [{ ...entry, week: state.week }, ...state.politics.signalLog].slice(0, 8)
      return {
        ...state,
        politics: { ...state.politics, signalLog },
      }
    }

    case 'INJECT_PRESSURE_SCENARIO': {
      const { scenario } = action
      return {
        ...state,
        scenarioQueue: [scenario, ...state.scenarioQueue],
      }
    }

    case 'SET_OPTICS_REPORT':
      return { ...state, opticsReport: action.report }

    case 'SET_NEARBY_CHARACTER':
      return { ...state, nearbyCharacterId: action.id }

    case 'ATTEMPT_LOCKED_CHARACTER': {
      const { characterId } = action
      const prev = state.lockAttempts[characterId] ?? 0
      const next = prev + 1
      const nowUnlocked = next >= 3

      let nextCast = state.cast
      let nextUnlocked = state.unlockedCharacters
      if (nowUnlocked) {
        nextUnlocked = [...state.unlockedCharacters, characterId]
        // Anger Petra for being bypassed
        nextCast = state.cast.map(c => {
          if (c.id !== 'petra') return c
          return { ...c, emotion: applyEmotionDelta(c.emotion, { trust: -15, wariness: +20 }) }
        })
      }

      return {
        ...state,
        cast: nextCast,
        unlockedCharacters: nextUnlocked,
        lockAttempts: { ...state.lockAttempts, [characterId]: next },
      }
    }

    case 'COMPLETE_DIALOGUE': {
      const { dialogueId, effects } = action
      if (state.completedDialogues.includes(dialogueId)) return state

      let nextCast = state.cast.map(c => {
        const delta = effects?.[c.id]
        if (!delta) return c
        return { ...c, emotion: applyEmotionDelta(c.emotion, delta) }
      })

      const completed = [...state.completedDialogues, dialogueId]

      // Completing petra_intro unlocks all main characters
      const nextUnlocked = dialogueId === 'petra_intro'
        ? ['petra', 'callum', 'simone', 'marcus']
        : state.unlockedCharacters

      // Advance week every 4 completed dialogues
      const shouldAdvance = completed.length % 4 === 0
      let nextWeek = state.week
      if (shouldAdvance) {
        nextWeek = state.week + 1
        // Track low-trust weeks for nemesis transitions
        nextCast = nextCast.map(c => {
          if (c.transitioned || c.isAndroid) return c
          return { ...c, lowTrustWeeks: c.emotion.trust < 10 ? (c.lowTrustWeeks || 0) + 1 : 0 }
        })
      }

      const nextWeekdayIndex = shouldAdvance ? 0 : ((state.weekdayIndex ?? 0) + 1) % 5

      return {
        ...state,
        cast: nextCast,
        completedDialogues: completed,
        week: nextWeek,
        weekdayIndex: nextWeekdayIndex,
        unlockedCharacters: nextUnlocked,
        showWeekBriefing: shouldAdvance,
        weekBriefingWeek: shouldAdvance ? state.week : state.weekBriefingWeek,
      }
    }

    case 'DISMISS_WEEK_BRIEFING':
      return { ...state, showWeekBriefing: false }

    case 'MARK_CRISIS_TRIGGERED': {
      const { characterId } = action
      const triggered = state.crisisTriggeredFor ?? []
      if (triggered.includes(characterId)) return state
      return { ...state, crisisTriggeredFor: [...triggered, characterId] }
    }

    case 'MARK_CONTROLS_SEEN':
      return { ...state, hasSeenControls: true }

    case 'MARK_DESK_DOC_READ': {
      const { docId } = action
      if (!docId || !state.deskRead || state.deskRead[docId]) return state
      if (!(docId in state.deskRead)) return state
      return {
        ...state,
        deskRead: { ...state.deskRead, [docId]: true },
      }
    }

    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.name }

    case 'RESET_GAME':
      return { ...initialState }

    default:
      return state
  }
}
