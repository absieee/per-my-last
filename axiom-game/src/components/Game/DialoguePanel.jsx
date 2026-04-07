import { useState, useEffect, useRef } from 'react'
import { SFX } from '../../audio/soundEngine.js'
import MiniGameRouter from './MiniGames/MiniGameRouter.jsx'

const COMPOSURE_DURATION = 15

function useTypewriter(text, speed = 28, active = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (!text || !active) { setDisplayed(''); setDone(false); return }
    setDisplayed('')
    setDone(false)
    pausedRef.current = false
    let i = 0
    const id = setInterval(() => {
      if (pausedRef.current) return
      i++
      setDisplayed(text.slice(0, i))
      SFX.tick()
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, active])

  const skip = () => {
    pausedRef.current = true
    setDisplayed(text)
    setDone(true)
  }

  return { displayed, done, skip }
}

function mergeEffects(baseEffects = {}, characterId, delta = {}) {
  if (!delta || Object.keys(delta).length === 0) return baseEffects
  return {
    ...baseEffects,
    [characterId]: {
      ...(baseEffects[characterId] || {}),
      ...Object.fromEntries(
        Object.entries(delta).map(([key, value]) => [
          key,
          (baseEffects[characterId]?.[key] || 0) + value,
        ]),
      ),
    },
  }
}

function getComposureResult(timeLeft) {
  if (timeLeft >= 11) return { score: 'high', effects: { wariness: -1, respect: 1 } }
  if (timeLeft >= 5) return { score: 'neutral', effects: {} }
  return { score: 'low', effects: { wariness: 2 } }
}

export default function DialoguePanel({ dialogue, character, onComplete }) {
  const [stage, setStage] = useState('beat')
  const [beatIndex, setBeatIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showSkipWarning, setShowSkipWarning] = useState(false)
  const [composureTimeLeft, setComposureTimeLeft] = useState(COMPOSURE_DURATION)
  const [composureScore, setComposureScore] = useState(null)
  const composureIntervalRef = useRef(null)
  const autoSelectedRef = useRef(false)

  const beats = dialogue.exchange.beats
  const responses = dialogue.exchange.responses || []
  const hasMiniGame = !!dialogue.exchange.miniGame
  const hasComposure = stage === 'choices' && dialogue.requiresComposure && responses.length > 0

  const { displayed: beatText, done: beatDone, skip: skipBeat } = useTypewriter(
    stage === 'beat' ? beats[beatIndex] : null,
  )

  const { displayed: replyText, done: replyDone } = useTypewriter(
    stage === 'reply' ? (selected?.resolvedReply || '') : null,
  )

  useEffect(() => {
    return () => {
      if (composureIntervalRef.current) clearInterval(composureIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (!hasComposure) {
      if (composureIntervalRef.current) clearInterval(composureIntervalRef.current)
      composureIntervalRef.current = null
      return
    }

    setComposureTimeLeft(COMPOSURE_DURATION)
    setComposureScore(null)
    autoSelectedRef.current = false

    composureIntervalRef.current = setInterval(() => {
      setComposureTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(composureIntervalRef.current)
          composureIntervalRef.current = null
          if (!autoSelectedRef.current && responses[0]) {
            autoSelectedRef.current = true
            setComposureScore('expired')
            handleChoice(responses[0], { wariness: 3 })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (composureIntervalRef.current) clearInterval(composureIntervalRef.current)
      composureIntervalRef.current = null
    }
  }, [hasComposure, responses])

  const advanceBeat = () => {
    if (stage !== 'beat' || !beatDone) return
    if (beatIndex < beats.length - 1) {
      setBeatIndex(b => b + 1)
    } else {
      setStage(hasMiniGame ? 'miniGame' : 'choices')
    }
  }

  useEffect(() => {
    if (stage !== 'beat') return
    const handler = (e) => {
      if (e.type === 'keydown' && e.key !== ' ') return
      e.preventDefault()
      advanceBeat()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [stage, beatDone, beatIndex, hasMiniGame])

  useEffect(() => {
    if (replyDone && stage === 'reply') {
      const t = setTimeout(() => {
        SFX.dismiss()
        onComplete(selected?.effects || {})
      }, 3500)
      return () => clearTimeout(t)
    }
  }, [replyDone, stage, selected, onComplete])

  const handleChoice = (response, composureDelta = null) => {
    if (composureIntervalRef.current) {
      clearInterval(composureIntervalRef.current)
      composureIntervalRef.current = null
    }

    let nextEffects = response.effects || {}
    if (dialogue.requiresComposure && composureDelta) {
      nextEffects = mergeEffects(nextEffects, character.id, composureDelta)
    } else if (dialogue.requiresComposure && !composureScore) {
      const composureResult = getComposureResult(composureTimeLeft)
      setComposureScore(composureResult.score)
      nextEffects = mergeEffects(nextEffects, character.id, composureResult.effects)
    }

    SFX.select()
    setSelected({ ...response, effects: nextEffects })
    setStage('subtext')
    setTimeout(() => setStage('reply'), 1600)
  }

  const handleMiniGameComplete = (result) => {
    const resolvedReply = dialogue.exchange.replies?.[result.outcome] || ''
    SFX.select()
    setSelected({
      id: `mini-game-${result.outcome}`,
      subtext: result.subtext,
      effects: result.effects,
      resolvedReply,
    })
    setStage('reply')
  }

  const handleSkipConfirm = () => {
    skipBeat()
    setShowSkipWarning(false)
    setStage(hasMiniGame ? 'miniGame' : 'choices')
  }

  const accent = character.accentColor

  return (
    <div className="overlay-safe" style={{
      zIndex: 100,
      background: 'rgba(4, 6, 14, 0.94)',
    }}>
      <div className="overlay-safe-center">
        <div className="overlay-header-row">
          <div className="overlay-header-title" style={{
            fontFamily: 'VT323',
            fontSize: '18px',
            letterSpacing: '4px',
            color: accent,
            opacity: 0.6,
            lineHeight: 1.15,
          }}>
            {character.shortName?.toUpperCase()} — {character.title?.toUpperCase()}
          </div>

          {stage === 'beat' && beatIndex === 0 && !showSkipWarning && (
            <button
              onClick={() => setShowSkipWarning(true)}
              className="overlay-header-action"
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: 'VT323',
                fontSize: '13px',
                letterSpacing: '2px',
                color: '#2a3a4e',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = accent }}
              onMouseLeave={e => { e.currentTarget.style.color = '#2a3a4e' }}
            >
              [ SKIP ]
            </button>
          )}
        </div>

        <div
          style={{
            width: 'min(100%, 820px)',
            border: `1px solid ${accent}2a`,
            padding: 'clamp(24px, 4vw, 36px) clamp(20px, 4vw, 44px)',
            background: 'rgba(8, 12, 20, 0.97)',
            minHeight: 130,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: (stage === 'beat' && beatDone) ? 'pointer' : 'default',
          }}
          onClick={advanceBeat}
        >
          {showSkipWarning && (
            <div style={{
              padding: '18px 24px',
              border: `1px solid ${accent}44`,
              background: `${accent}08`,
              marginBottom: 16,
              animation: 'fadeUp 0.2s ease forwards',
            }}>
              <p style={{
                fontFamily: 'Josefin Sans',
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#8a9ab0',
                lineHeight: 1.6,
                margin: '0 0 16px 0',
              }}>
                Skipping this briefing will leave you with less context when making your decision.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={handleSkipConfirm}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${accent}66`,
                    color: accent,
                    fontFamily: 'VT323',
                    fontSize: '14px',
                    letterSpacing: '2px',
                    padding: '6px 16px',
                    cursor: 'pointer',
                  }}
                >
                  SKIP ANYWAY
                </button>
                <button
                  onClick={() => setShowSkipWarning(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #1e2d42',
                    color: '#4a5568',
                    fontFamily: 'VT323',
                    fontSize: '14px',
                    letterSpacing: '2px',
                    padding: '6px 16px',
                    cursor: 'pointer',
                  }}
                >
                  KEEP READING
                </button>
              </div>
            </div>
          )}

          {dialogue.contextLine && (stage === 'beat' || stage === 'choices' || stage === 'miniGame') && (
            <div style={{
              marginBottom: 16,
              paddingBottom: 14,
              borderBottom: `1px solid ${accent}18`,
            }}>
              <p style={{
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '13px',
                fontStyle: 'italic',
                color: '#3a4a60',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {dialogue.contextLine}
              </p>
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {(stage === 'beat' || stage === 'choices' || stage === 'miniGame') && (
              <p style={{ fontFamily: 'VT323', fontSize: '26px', color: '#c9d1d9', lineHeight: 1.55, margin: 0, overflowWrap: 'anywhere' }}>
                {stage === 'beat' ? beatText : beats[beats.length - 1]}
                {stage === 'beat' && !beatDone && (
                  <span style={{ color: accent, opacity: 0.8, animation: 'bar-pulse 0.8s step-end infinite' }}>▌</span>
                )}
              </p>
            )}

            {stage === 'subtext' && selected && (
              <p style={{
                fontFamily: 'Josefin Sans',
                fontSize: '16px',
                fontStyle: 'italic',
                color: '#7a8a9e',
                lineHeight: 1.65,
                margin: 0,
                overflowWrap: 'anywhere',
              }}>
                {selected.subtext}
              </p>
            )}

            {stage === 'reply' && (
              <p style={{ fontFamily: 'VT323', fontSize: '26px', color: '#c9d1d9', lineHeight: 1.55, margin: 0, overflowWrap: 'anywhere' }}>
                {replyText}
                {!replyDone && (
                  <span style={{ color: accent, opacity: 0.8, animation: 'bar-pulse 0.8s step-end infinite' }}>▌</span>
                )}
              </p>
            )}
          </div>

          {stage === 'beat' && beatDone && (
            <div style={{
              marginTop: 20,
              fontFamily: 'VT323',
              fontSize: '14px',
              letterSpacing: '3px',
              color: accent,
              opacity: 0.4,
              animation: 'pulse 1.8s ease-in-out infinite',
              alignSelf: 'flex-end',
              textAlign: 'right',
            }}>
              [ SPACE ] CONTINUE
            </div>
          )}
        </div>

        {stage === 'choices' && hasComposure && (
          <div className="composure-bar-container" style={{ width: 'min(100%, 820px)' }}>
            <div
              className={`composure-bar ${composureTimeLeft < 5 ? 'is-low' : ''}`}
              style={{
                width: `${(composureTimeLeft / COMPOSURE_DURATION) * 100}%`,
                background: accent,
              }}
            />
          </div>
        )}

        {stage === 'choices' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(responses.length, 3)}, minmax(0, 1fr))`,
            gap: 14,
            width: 'min(100%, 820px)',
          }}>
            {responses.map(response => (
              <ChoiceCard
                key={response.id}
                response={response}
                accent={accent}
                onSelect={() => {
                  if (dialogue.requiresComposure) {
                    const composureResult = getComposureResult(composureTimeLeft)
                    setComposureScore(composureResult.score)
                    handleChoice(response, composureResult.effects)
                    return
                  }
                  handleChoice(response)
                }}
              />
            ))}
          </div>
        )}

        {stage === 'miniGame' && (
          <MiniGameRouter
            type={dialogue.exchange.miniGame.type}
            character={character}
            onComplete={handleMiniGameComplete}
          />
        )}

        <div className="overlay-footer-copy" style={{
          fontFamily: 'VT323',
          fontSize: '14px',
          letterSpacing: '2px',
          color: '#333',
          minHeight: 18,
        }}>
          {stage === 'choices' ? 'CHOOSE YOUR APPROACH' : ''}
        </div>
      </div>
    </div>
  )
}

function ChoiceCard({ response, accent, onSelect }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${accent}0e` : 'transparent',
        border: `1px solid ${hovered ? accent : `${accent}44`}`,
        padding: '22px 24px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.12s, background 0.12s',
        minWidth: 0,
      }}
    >
      <div style={{
        fontFamily: 'VT323',
        fontSize: '20px',
        letterSpacing: '2px',
        color: accent,
        marginBottom: 10,
      }}>
        {response.label}
      </div>
      <div style={{
        fontFamily: 'Josefin Sans',
        fontSize: '14px',
        color: '#8a9ab0',
        lineHeight: 1.55,
        overflowWrap: 'anywhere',
      }}>
        {response.subtext}
      </div>
    </button>
  )
}
