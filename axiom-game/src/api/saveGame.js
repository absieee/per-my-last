import { supabase } from '../lib/supabase.js'
import { initialState } from '../state/initialState.js'

const SESSION_KEY = 'axiom_session_id'
const SAVE_KEY    = 'axiom_save'

export function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function buildSaveBundle(state) {
  return {
    week:                  state.week,
    weekdayIndex:          state.weekdayIndex ?? 0,
    cast:                  state.cast,
    completedDialogues:    state.completedDialogues,
    completedScenarios:    state.completedScenarios,
    scenarioQueue:         state.scenarioQueue,
    decisionLog:           state.decisionLog,
    unlockedCharacters:    state.unlockedCharacters,
    lockAttempts:          state.lockAttempts,
    politics:              state.politics,
    toneFlagLog:           state.toneFlagLog,
    transitionedCharacters: state.transitionedCharacters,
    opticsReport:          state.opticsReport,
    playerName:            state.playerName,
    officeRumors:          state.officeRumors,
    deskRead:              state.deskRead ?? { q3StrategyBrief: false },
  }
}

export function saveGame(state) {
  const sessionId = getOrCreateSessionId()
  const bundle = buildSaveBundle(state)
  // Synchronous localStorage write
  localStorage.setItem(SAVE_KEY, JSON.stringify(bundle))
  // Background Supabase upsert — fire and forget
  supabase
    .from('game_saves')
    .upsert({ session_id: sessionId, state: bundle, updated_at: new Date().toISOString() })
    .then(({ error }) => { if (error) console.warn('Supabase save failed:', error.message) })
}

export async function clearSave() {
  const sessionId = localStorage.getItem(SESSION_KEY)
  localStorage.removeItem(SAVE_KEY)
  localStorage.removeItem(SESSION_KEY)
  if (sessionId) {
    await supabase.from('game_saves').delete().eq('session_id', sessionId)
  }
}

function mergeOverInitial(bundle) {
  return {
    ...initialState,
    ...bundle,
    weekdayIndex: bundle.weekdayIndex ?? 0,
    deskRead: bundle.deskRead ?? { q3StrategyBrief: false },
    // Reset transient UI state
    activeCharacterId:       null,
    activeScenario:          null,
    outcomeNotice:           null,
    showingStakeholderResponse: false,
    stakeholderResponseData: null,
    nearbyCharacterId:       null,
  }
}

export function loadGame() {
  const sessionId = localStorage.getItem(SESSION_KEY)
  const raw = localStorage.getItem(SAVE_KEY)

  let hasSave = false
  let gameState = initialState

  if (raw) {
    try {
      const bundle = JSON.parse(raw)
      hasSave = true
      gameState = mergeOverInitial(bundle)
    } catch {
      // Corrupt save — ignore, start fresh
    }
  }

  // Background: check Supabase for a newer save (higher week)
  if (sessionId) {
    supabase
      .from('game_saves')
      .select('state')
      .eq('session_id', sessionId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) return
        const remote = data.state
        const localWeek = hasSave ? (JSON.parse(raw || '{}').week ?? 0) : 0
        if ((remote?.week ?? 0) > localWeek) {
          // Remote is newer — overwrite local and reload
          localStorage.setItem(SAVE_KEY, JSON.stringify(remote))
          window.location.reload()
        }
      })
  }

  return { hasSave, gameState }
}
