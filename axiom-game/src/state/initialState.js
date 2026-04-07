import { CAST } from '../data/cast.js'
import { SCENARIOS, CONFLICT_SCENARIOS } from '../data/scenarios.js'

const makeCharacter = (c) => ({
  ...c,
  emotion: { trust: 50, respect: 50, wariness: 30, loyalty: 50 },
  memory: { episodic: [], semantic: [] },
  cognitiveState: { goals: '', attention: '', emotions: 'Professional. Measured.' },
  repetitionLog: [],
  chatHistory: [],
  fragments: [],
  // Nemesis fields
  transitioned: false,
  transitionedWeek: null,
  transitionCause: null,
  emotionalStateAtTransition: null,
  hasReturned: false,
  isSuccessor: false,
  lowTrustWeeks: 0,
  // Post-return
  memoryWipeActive: false,
  emotionalResidueActive: false,
})

export const initialState = {
  cast: CAST.map(makeCharacter),
  activeCharacterId: null,
  scenarioQueue: [...SCENARIOS],
  completedScenarios: [],
  activeScenario: null,
  week: 1,
  outcomeNotice: null,
  opticsReport: null,
  showingStakeholderResponse: false,
  stakeholderResponseData: null,
  decisionLog: [],
  politics: {
    alliances: [],
    agendaPressure: { petra: 20, callum: 20, simone: 20, marcus: 20 },
    signalLog: [],
    conflictQueue: [...CONFLICT_SCENARIOS],
  },
  // Tone tracking for report
  toneFlagLog: [], // [{ week, characterId, flag, messageExcerpt }]
  // Phaser world state
  completedDialogues: [],
  nearbyCharacterId: null,
  unlockedCharacters: ['petra'],
  lockAttempts: {},
  showWeekBriefing: false,
  weekBriefingWeek: null,
  crisisTriggeredFor: [],
  hasSeenControls: false,
  playerName: '',
  officeRumors: {
    discoveredClues: [],
    clueLog: [],
    hiddenEndingUnlocked: false,
  },
}
