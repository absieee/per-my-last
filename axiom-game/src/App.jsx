import { useReducer, useState, useCallback, useEffect, useRef } from 'react'
import { gameReducer } from './state/gameReducer.js'
import { initialState } from './state/initialState.js'
import { loadGame, saveGame, clearSave } from './api/saveGame.js'

const { hasSave, gameState: savedGameState } = loadGame()
import { generateOpticsReport } from './api/opticsReport.js'
import { generatePressureScenario } from './api/pressureScenario.js'
import { getAvailableDialogue, resolveReply, week2Scenario1PrimersComplete } from './data/dialogues.js'
import { createGame } from './game/index.js'
import { WATERCOOLER_NPCS, getWatercoolerConversation } from './data/watercooler.js'
import { CRISIS_SCENARIOS } from './data/crisisScenarios.js'
import Atmosphere from './components/Layout/Atmosphere.jsx'
import TitleScreen from './components/Game/TitleScreen.jsx'
import IntroScreen from './components/Game/IntroScreen.jsx'
import PauseMenu from './components/Game/PauseMenu.jsx'
import HUD from './components/Game/HUD.jsx'
import PlayerComputer from './components/Game/PlayerComputer.jsx'
import WatercoolerPanel from './components/Game/WatercoolerPanel.jsx'
import WatercoolerOverhear from './components/Game/WatercoolerOverhear.jsx'
import WeekBriefing from './components/Game/WeekBriefing.jsx'
import { getBriefingMessages } from './data/weekBriefing.js'
import LockedNotice from './components/Game/LockedNotice.jsx'
import InteractionPrompt from './components/Game/InteractionPrompt.jsx'
import DialoguePanel from './components/Game/DialoguePanel.jsx'
import ScenarioModal from './components/Scenario/ScenarioModal.jsx'
import StakeholderResponseScreen from './components/Scenario/StakeholderResponseScreen.jsx'
import OpticsReport from './components/OpticsReport/OpticsReport.jsx'
import CharacterDossier from './components/Game/CharacterDossier.jsx'
import './styles/globals.css'

function getPlayerSpeedMultiplier(week) {
  const fatiguePenalty = Math.max(0, week - 1) * 0.065
  return Math.max(0.68, 1 - fatiguePenalty)
}

function buildNpcWorldState(state) {
  const stakeholderIds = new Set(['petra', 'callum', 'simone', 'marcus'])
  const npcStates = Object.fromEntries(
    state.cast
      .filter(character => stakeholderIds.has(character.id))
      .map(character => [
        character.id,
        {
          trust: character.emotion.trust,
          respect: character.emotion.respect,
          wariness: character.emotion.wariness,
          loyalty: character.emotion.loyalty,
          hasReturned: !!character.hasReturned,
        },
      ])
  )

  const alliances = (state.politics?.alliances || [])
    .filter(alliance => alliance?.members?.every(member => stakeholderIds.has(member)))
    .map(alliance => ({
      members: [...alliance.members].sort(),
      formedWeek: alliance.formedWeek ?? state.week,
    }))

  return {
    week: state.week,
    npcStates,
    alliances,
  }
}

function normalizeDialogueEffects(effects, characterId, castIds) {
  if (!effects) return {}
  const effectKeys = Object.keys(effects)
  const isMultiCharacterMap = effectKeys.some(key => castIds.includes(key))
  if (isMultiCharacterMap) return effects
  return { [characterId]: effects }
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, savedGameState)
  const [screen, setScreen] = useState('title') // 'title' | 'intro' | 'game'
  const [nearbyChar, setNearbyChar] = useState(null) // { characterId, characterName, accentColor, isWatercooler }
  const [activeDialogue, setActiveDialogue] = useState(null)
  const [activeDialogueChar, setActiveDialogueChar] = useState(null)
  const [activeWatercooler, setActiveWatercooler] = useState(null) // { npc, conversation }
  const [lockedNotice, setLockedNotice] = useState(null) // { attempts }
  const [activeDossier, setActiveDossier] = useState(null) // character object
  const [activeComputer, setActiveComputer] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const gameRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state

  // Change 3 — track whether petra was already visited on mount (don't re-notify on reload)
  const petraVisitedAtMount = useRef(state.completedDialogues.includes('petra_intro'))
  const [showNewContacts, setShowNewContacts] = useState(false)

  // Change 4 — mouse tooltip
  const hasMoved = useRef(false)
  const mouseTooltipShown = useRef(false)
  const [mouseTooltip, setMouseTooltip] = useState({ show: false, x: 0, y: 0 })

  // Mount Phaser only once game screen is active
  useEffect(() => {
    if (screen !== 'game') return
    if (gameRef.current) return
    const s = stateRef.current
    if (s.completedDialogues.includes('petra_intro')) {
      window.__petraVisited = true
    }
    gameRef.current = createGame('phaser-root')
    window.dispatchEvent(new CustomEvent('phaser:fatigue_update', {
      detail: { speedMultiplier: getPlayerSpeedMultiplier(s.week) },
    }))
    window.dispatchEvent(new CustomEvent('phaser:npc_state_update', {
      detail: buildNpcWorldState(s),
    }))
    if (s.completedDialogues.includes('petra_intro')) {
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent('phaser:reveal_characters'))
      })
    }
    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [screen])

  // Proximity event — update nearby character display
  useEffect(() => {
    const handler = (e) => setNearbyChar(e.detail || null)
    window.addEventListener('phaser:proximity', handler)
    return () => window.removeEventListener('phaser:proximity', handler)
  }, [])

  // Dossier event — open character profile on TAB
  useEffect(() => {
    const handler = (e) => {
      const { characterId } = e.detail
      const character = stateRef.current.cast.find(c => c.id === characterId)
      if (!character) return
      setActiveDossier({ id: characterId })
      window.dispatchEvent(new CustomEvent('phaser:pause'))
    }
    window.addEventListener('phaser:dossier', handler)
    return () => window.removeEventListener('phaser:dossier', handler)
  }, [])

  const handleDossierDismiss = useCallback(() => {
    setActiveDossier(null)
    window.dispatchEvent(new CustomEvent('phaser:resume'))
  }, [])

  // Interact event — open dialogue panel or watercooler panel
  useEffect(() => {
    const handler = (e) => {
      const { characterId, isWatercooler } = e.detail

      if (isWatercooler) {
        const npc = WATERCOOLER_NPCS.find(n => n.id === characterId)
        if (!npc) return
        const conversation = getWatercoolerConversation(characterId, stateRef.current.officeRumors)
        setActiveWatercooler({ npc, conversation })
        window.dispatchEvent(new CustomEvent('phaser:pause'))
        return
      }

      const current = stateRef.current

      // Room locking — only petra is accessible until petra_intro is done
      const isUnlocked = current.unlockedCharacters.includes(characterId)
      if (!isUnlocked) {
        setLockedNotice({ message: 'SPEAK TO PETRA FIRST' })
        return
      }
      const character = current.cast.find(c => c.id === characterId)
      if (!character) return

      const dialogue = getAvailableDialogue(characterId, current)
      if (!dialogue) {
        setLockedNotice({ message: `${character.shortName?.toUpperCase() ?? characterId.toUpperCase()} HAS NOTHING NEW FOR YOU RIGHT NOW` })
        return
      }

      const enriched = {
        ...dialogue,
        contextLine: dialogue.contextLine ? dialogue.contextLine(current) : null,
        exchange: {
          ...dialogue.exchange,
          responses: (dialogue.exchange.responses || []).map(r => ({
            ...r,
            effects: normalizeDialogueEffects(
              r.effects,
              characterId,
              current.cast.map(entry => entry.id),
            ),
            resolvedReply: resolveReply(r, character.emotion),
          })),
        },
      }

      setActiveDialogue(enriched)
      setActiveDialogueChar(character)
      window.dispatchEvent(new CustomEvent('phaser:pause'))
    }
    window.addEventListener('phaser:interact', handler)
    return () => window.removeEventListener('phaser:interact', handler)
  }, [])

  const handleDialogueComplete = useCallback((dialogueId, effects) => {
    dispatch({ type: 'COMPLETE_DIALOGUE', dialogueId, effects })
    setActiveDialogue(null)
    setActiveDialogueChar(null)
    window.dispatchEvent(new CustomEvent('phaser:resume'))
  }, [])

  const handleWatercoolerDismiss = useCallback(() => {
    setActiveWatercooler(null)
    window.dispatchEvent(new CustomEvent('phaser:resume'))
  }, [])


  // Auto-generate Optics Report when all 4 scenarios complete
  useEffect(() => {
    if (state.completedScenarios.length >= 4 && !state.opticsReport) {
      generateOpticsReport(state).then(report => {
        dispatch({ type: 'SET_OPTICS_REPORT', report })
      })
    }
  }, [state.completedScenarios.length])

  // Simone hostile escalation post-return
  useEffect(() => {
    const simone = state.cast.find(c => c.id === 'simone')
    if (simone?.hasReturned && simone.emotion.wariness > 70) {
      const hasPressure = state.scenarioQueue.some(s => s.tag === 'PRESSURE')
      if (!hasPressure) {
        generatePressureScenario(simone, state.week, state.decisionLog).then(scenario => {
          if (scenario) dispatch({ type: 'INJECT_PRESSURE_SCENARIO', scenario })
        })
      }
    }
  }, [state.cast.find(c => c.id === 'simone')?.emotion?.wariness])

  // Crisis trigger — any stakeholder hits trust < 20 AND wariness > 75
  const crisisSig = state.cast.map(c => `${c.id}:${c.emotion.trust}:${c.emotion.wariness}`).join(',')
  useEffect(() => {
    state.cast.forEach(c => {
      if (c.emotion.trust < 20 && c.emotion.wariness > 75) {
        if (!(state.crisisTriggeredFor ?? []).includes(c.id)) {
          const scenario = CRISIS_SCENARIOS[c.id]
          if (scenario) {
            dispatch({ type: 'MARK_CRISIS_TRIGGERED', characterId: c.id })
            dispatch({ type: 'INJECT_PRESSURE_SCENARIO', scenario })
          }
        }
      }
    })
  }, [crisisSig]) // eslint-disable-line react-hooks/exhaustive-deps

  const pendingScenario = (() => {
    const q = state.scenarioQueue
    if (!q.length) return null
    const s = q[0]
    if (s.week > state.week) return null
    if (typeof s.unlockCondition === 'function' && !s.unlockCondition(state)) return null
    return s
  })()

  const handleScenarioChoice = useCallback((choiceIndex, choice) => {
    dispatch({ type: 'RESOLVE_SCENARIO', scenarioId: state.activeScenario.id, choiceIndex, choice })
    if (choice.triggersSimoneReturn) {
      setTimeout(() => dispatch({ type: 'RETURN_SIMONE' }), 3000)
    }
    state.cast.forEach(c => {
      const delta = choice.effects?.[c.id]
      if (delta && (Math.abs(delta.trust || 0) > 3 || Math.abs(delta.wariness || 0) > 3)) {
        dispatch({
          type: 'UPDATE_COGNITIVE_STATE',
          characterId: c.id,
          cognitiveState: {
            emotions: (delta.trust || 0) < -3 ? 'Professionally careful.' : (delta.trust || 0) > 3 ? 'Cautiously optimistic.' : 'Watchful.',
          },
        })
      }
    })
  }, [state.activeScenario, state.cast])

  // Compute nearby character full data for HUD and prompt
  const nearbyFull = nearbyChar
    ? state.cast.find(c => c.id === nearbyChar.characterId) ?? null
    : null

  const playerSpeedMultiplier = getPlayerSpeedMultiplier(state.week)
  const npcWorldState = buildNpcWorldState(state)

  useEffect(() => {
    if (screen !== 'game') return
    window.dispatchEvent(new CustomEvent('phaser:fatigue_update', {
      detail: { speedMultiplier: playerSpeedMultiplier },
    }))
  }, [playerSpeedMultiplier, screen])

  useEffect(() => {
    if (screen !== 'game') return
    window.dispatchEvent(new CustomEvent('phaser:npc_state_update', {
      detail: npcWorldState,
    }))
  }, [npcWorldState, screen])

  const scenarioPending = !!(
    pendingScenario &&
    !state.activeScenario &&
    !state.showingStakeholderResponse &&
    !activeDialogue &&
    !activeWatercooler
  )

  // Auto-save on meaningful progress
  useEffect(() => {
    if (state.completedDialogues.length > 0 || state.completedScenarios.length > 0 || state.week > 1) {
      saveGame(state)
    }
  }, [state.completedDialogues.length, state.completedScenarios.length, state.week, state.deskRead?.q3StrategyBrief])

  const handleNewGame = useCallback(async () => {
    await clearSave()
    dispatch({ type: 'RESET_GAME' })
    window.__petraVisited = false
    setScreen('intro')
  }, [])

  const petraVisited = state.completedDialogues.includes('petra_intro')

  // Derive current objective from state
  const currentObjective = (() => {
    if (!state.completedDialogues.includes('petra_intro')) return 'SPEAK TO PETRA'
    if (state.week >= 2 && !state.completedScenarios.includes('scenario_1')) {
      if (!state.completedDialogues.includes('petra_q3_context')) return 'PETRA — WEEK TWO CONTEXT'
      if (!state.deskRead?.q3StrategyBrief) return 'READ Q3 BRIEF — DESK [C]'
      if (!state.completedDialogues.includes('petra_roadmap_prioritization')) return 'PETRA — ROADMAP (THURSDAY PREP)'
      if (!week2Scenario1PrimersComplete(state)) return 'ALIGN WITH TEAM'
      if (!state.completedDialogues.includes('petra_preread')) return 'PETRA — BEFORE THE REVIEW'
      if (state.week === 2 && state.weekdayIndex !== 3) return 'WAIT FOR THURSDAY — PRODUCT ALIGNMENT REVIEW'
    }
    if (state.completedScenarios.includes('scenario_1') && !state.completedScenarios.includes('scenario_2')) {
      if (!state.completedDialogues.includes('callum_filing_check')) return 'CALLUM — FILING DEADLINE'
      if (!state.deskRead?.slta) return 'READ SLTA — DESK [C]'
    }
    if (state.completedScenarios.includes('scenario_2') && !state.completedScenarios.includes('scenario_3')) {
      if (!state.completedDialogues.includes('marcus_journalist_contact')) return 'MARCUS — PRESS ENQUIRY'
    }
    if (state.completedScenarios.includes('scenario_3') && !state.completedScenarios.includes('scenario_4')) {
      if (!state.completedDialogues.includes('simone_week6_unease')) return 'SIMONE — CHECK IN'
    }
    if (pendingScenario) return 'REVIEW PENDING SCENARIO'
    const teamIntros = ['callum_intro', 'simone_intro', 'marcus_intro']
    const unmet = teamIntros.filter(d => !state.completedDialogues.includes(d))
    if (unmet.length > 0) return 'MEET YOUR TEAM'
    if (state.week >= 4 && state.week <= 6) {
      const midgameBeats = [
        'petra_week4_check', 'callum_week4_watch', 'simone_week4_anomaly',
        'petra_week5_governance', 'marcus_week5_prelude', 'petra_week6_tighten',
      ]
      if (midgameBeats.some(id => !state.completedDialogues.includes(id))) {
        return 'CHECK IN WITH YOUR STAKEHOLDERS'
      }
    }
    return 'DELIVER THE Q3 REVIEW'
  })()

  useEffect(() => {
    if (petraVisited) {
      window.__petraVisited = true
      window.dispatchEvent(new CustomEvent('phaser:petra_visited'))
      // Always reveal office NPCs when Petra intro is done (including save load — Phaser may mount after this effect on first paint).
      window.dispatchEvent(new CustomEvent('phaser:reveal_characters'))
      if (!petraVisitedAtMount.current) {
        setShowNewContacts(true)
      }
    } else {
      window.__petraVisited = false
    }
  }, [petraVisited])

  // Pause menu — ESC when no dialog/dossier/scenario/overlay is open
  const anyPanelOpen = !!(
    activeDialogue || activeDossier || activeWatercooler || lockedNotice ||
    state.activeScenario || state.showingStakeholderResponse ||
    state.showWeekBriefing || state.opticsReport || !state.hasSeenControls ||
    activeComputer
  )

  const showGameplayOverlay = (
    screen === 'game' &&
    !gamePaused &&
    !anyPanelOpen
  )

  const showTopObjective = showGameplayOverlay && !showNewContacts

  useEffect(() => {
    if (screen !== 'game') return
    const handler = (e) => {
      if (e.key === 'Escape' && !anyPanelOpen) {
        setGamePaused(p => {
          const next = !p
          window.dispatchEvent(new CustomEvent(next ? 'phaser:pause' : 'phaser:resume'))
          return next
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, anyPanelOpen])

  const handleResume = useCallback(() => {
    setGamePaused(false)
    window.dispatchEvent(new CustomEvent('phaser:resume'))
  }, [])

  const handleComputerDismiss = useCallback(() => {
    setActiveComputer(false)
    window.dispatchEvent(new CustomEvent('phaser:resume'))
  }, [])

  useEffect(() => {
    if (screen !== 'game') return
    const onKey = (e) => {
      if (e.key !== 'c' && e.key !== 'C') return
      if (gamePaused) return
      if (activeComputer) {
        handleComputerDismiss()
        return
      }
      const blocked =
        activeDialogue || activeDossier || activeWatercooler || lockedNotice ||
        stateRef.current.activeScenario || stateRef.current.showingStakeholderResponse ||
        stateRef.current.showWeekBriefing || stateRef.current.opticsReport ||
        !stateRef.current.hasSeenControls
      if (blocked) return
      setActiveComputer(true)
      window.dispatchEvent(new CustomEvent('phaser:pause'))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, gamePaused, activeComputer, activeDialogue, activeDossier, activeWatercooler, lockedNotice, handleComputerDismiss])

  const handleMainMenu = useCallback(() => {
    setGamePaused(false)
    setActiveComputer(false)
    window.dispatchEvent(new CustomEvent('phaser:resume'))
    setScreen('title')
  }, [])

  // Change 4 — mouse assumption tooltip
  useEffect(() => {
    if (screen !== 'game') return
    const onKey = (e) => {
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
        hasMoved.current = true
    }
    const onClick = (e) => {
      if (!hasMoved.current && !mouseTooltipShown.current) {
        mouseTooltipShown.current = true
        setMouseTooltip({ show: true, x: e.clientX, y: e.clientY })
        setTimeout(() => setMouseTooltip(t => ({ ...t, show: false })), 2000)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [screen])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#04060e', overflow: 'hidden' }}>
      {screen === 'title' && (
        <TitleScreen
          hasSave={hasSave}
          onComplete={() => setScreen('intro')}
          onContinue={() => setScreen('game')}
          onNewGame={handleNewGame}
        />
      )}

      {screen === 'intro' && (
        <IntroScreen onComplete={(name) => {
          if (name) dispatch({ type: 'SET_PLAYER_NAME', name })
          setScreen('game')
        }} />
      )}

      {/* Phaser canvas */}
      <div id="phaser-root" style={{ position: 'fixed', inset: 0 }} />


      {/* Pause menu */}
      {gamePaused && (
        <PauseMenu
          onResume={handleResume}
          onRestart={handleNewGame}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* MENU button — visible in game when no panels are open */}
      {screen === 'game' && !gamePaused && state.hasSeenControls && (
        <button
          onClick={() => {
            setGamePaused(true)
            window.dispatchEvent(new CustomEvent('phaser:pause'))
          }}
          style={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'VT323, monospace',
            fontSize: '13px',
            letterSpacing: '3px',
            color: '#2a3a4e',
            background: 'transparent',
            border: '1px solid #1a2535',
            padding: '6px 14px',
            cursor: 'pointer',
            zIndex: 150,
          }}
        >
          MENU
        </button>
      )}

      {/* New contacts notification — fades in after Petra intro */}
      {showNewContacts && (
        <div
          onAnimationEnd={() => {}}
          style={{
            position: 'fixed',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'VT323, monospace',
            fontSize: '16px',
            letterSpacing: '5px',
            color: '#ff9f43',
            background: 'rgba(4,6,14,0.85)',
            padding: '8px 20px',
            border: '1px solid rgba(255,159,67,0.2)',
            zIndex: 300,
            animation: 'fadeUp 0.3s ease forwards',
            pointerEvents: 'none',
            width: 'min(420px, calc(100vw - 24px))',
            textAlign: 'center',
            lineHeight: 1.15,
          }}
          ref={el => {
            if (el) setTimeout(() => setShowNewContacts(false), 3000)
          }}
        >
          NEW CONTACTS AVAILABLE
        </div>
      )}

      {/* Mouse assumption tooltip */}
      {mouseTooltip.show && (
        <div style={{
          position: 'fixed',
          left: mouseTooltip.x + 12,
          top: mouseTooltip.y - 20,
          fontFamily: 'VT323, monospace',
          fontSize: '14px',
          letterSpacing: '2px',
          color: '#ff9f43',
          background: 'rgba(4,6,14,0.9)',
          padding: '4px 10px',
          border: '1px solid rgba(255,159,67,0.15)',
          pointerEvents: 'none',
          zIndex: 400,
          animation: 'fadeUp 0.2s ease',
        }}>
          USE WASD OR ARROW KEYS TO MOVE
        </div>
      )}

      {/* CRT scanline + vignette overlay — always on top of canvas, below UI */}
      <Atmosphere />

      {/* Objective — top-center, visible during gameplay */}
      {showTopObjective && (
        <div className="top-objective">
          <div className="top-objective-label">OBJECTIVE</div>
          <div className="top-objective-text">{currentObjective}</div>
        </div>
      )}

      {/* HUD — always visible */}
      {showGameplayOverlay && (
        <HUD
          week={state.week}
          weekdayIndex={state.weekdayIndex ?? 0}
          nearbyCharacter={nearbyFull}
          scenarioPending={scenarioPending}
          onOpenScenario={() => dispatch({ type: 'SET_ACTIVE_SCENARIO', scenario: pendingScenario })}
          onOpenComputer={() => {
            if (activeDialogue || activeDossier || activeWatercooler || lockedNotice ||
              state.activeScenario || state.showingStakeholderResponse ||
              state.showWeekBriefing || state.opticsReport || !state.hasSeenControls) return
            setActiveComputer(true)
            window.dispatchEvent(new CustomEvent('phaser:pause'))
          }}
        />
      )}

      {activeComputer && (
        <PlayerComputer
          cast={state.cast}
          deskRead={state.deskRead}
          decisionLog={state.decisionLog}
          discoveredClues={state.officeRumors.discoveredClues}
          hiddenEndingUnlocked={state.officeRumors.hiddenEndingUnlocked}
          completedDialogues={state.completedDialogues}
          onDismiss={handleComputerDismiss}
          onMarkDeskDocRead={(docId) => dispatch({ type: 'MARK_DESK_DOC_READ', docId })}
        />
      )}


      {/* Interaction prompt — visible when near character but not in dialogue */}
      {showGameplayOverlay && nearbyChar && (
        <InteractionPrompt
          characterName={nearbyChar.characterName}
          accentColor={nearbyChar.accentColor}
          isWatercooler={nearbyChar.isWatercooler}
        />
      )}

      {screen === 'game' && !gamePaused && (
        <WatercoolerOverhear
          week={state.week}
          rumorState={state.officeRumors}
          onDiscoverIntel={(payload) => dispatch({ type: 'DISCOVER_OVERHEAR_INTEL', ...payload })}
          onApplyWariness={(stakeholderId) => dispatch({ type: 'APPLY_EAVESDROP_WARINESS', stakeholderId })}
        />
      )}

      {/* Dialogue panel */}
      {activeDialogue && activeDialogueChar && (
        <DialoguePanel
          key={activeDialogue.id}
          dialogue={activeDialogue}
          character={activeDialogueChar}
          onComplete={(effects) => handleDialogueComplete(activeDialogue.id, effects)}
        />
      )}

      {/* Week briefing — Slack-style notifications */}
      {state.showWeekBriefing && screen === 'game' && (
        <WeekBriefing
          week={state.weekBriefingWeek}
          messages={getBriefingMessages(state)}
          onDismiss={() => dispatch({ type: 'DISMISS_WEEK_BRIEFING' })}
        />
      )}

      {/* Character dossier */}
      {activeDossier && (
        <CharacterDossier
          character={state.cast.find(c => c.id === activeDossier?.id) ?? activeDossier}
          onDismiss={handleDossierDismiss}
        />
      )}

      {/* Locked room notice */}
      {lockedNotice && (
        <LockedNotice
          message={lockedNotice.message}
          onDismiss={() => setLockedNotice(null)}
        />
      )}

      {/* Watercooler panel */}
      {activeWatercooler && (
        <WatercoolerPanel
          npc={activeWatercooler.npc}
          conversation={activeWatercooler.conversation}
          onDiscoverClue={(payload) => dispatch({ type: 'DISCOVER_OFFICE_RUMOR', ...payload })}
          onDismiss={handleWatercoolerDismiss}
        />
      )}

      {/* Scenario modal */}
      {state.activeScenario && !state.showingStakeholderResponse && (
        <ScenarioModal
          scenario={state.activeScenario}
          onChoice={handleScenarioChoice}
        />
      )}

      {/* Stakeholder response */}
      {state.showingStakeholderResponse && (
        <StakeholderResponseScreen
          data={state.stakeholderResponseData}
          onDismiss={() => dispatch({ type: 'DISMISS_STAKEHOLDER_RESPONSE' })}
        />
      )}

      {/* Optics report — end game */}
      {state.opticsReport && (
        <OpticsReport
          report={state.opticsReport}
          decisionLog={state.decisionLog}
        />
      )}
    </div>
  )
}
