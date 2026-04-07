import { useState, useEffect } from 'react'
import { SFX } from '../../audio/soundEngine.js'

function useTypewriter(text, speed = 24, active = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayed('')
      setDone(false)
      return
    }
    if (!active) {
      setDisplayed(text)
      setDone(true)
      return
    }

    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      SFX.tick()
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, active])

  return { displayed, done }
}

export default function WatercoolerPanel({ npc, conversation, onDiscoverClue, onDismiss }) {
  const [stage, setStage] = useState('opening')
  const [clueRecorded, setClueRecorded] = useState(false)

  const accent = npc.hexColor
  const mystery = conversation?.mystery || null

  const activeText = stage === 'followup'
    ? mystery?.response || ''
    : conversation?.text || ''

  const { displayed, done } = useTypewriter(activeText, 24, true)

  useEffect(() => {
    if (stage !== 'followup' || !done || !mystery || clueRecorded) return
    onDiscoverClue({
      clueId: mystery.id,
      npcId: npc.id,
      npcName: npc.name,
      clue: mystery.clue,
    })
    setClueRecorded(true)
  }, [stage, done, mystery, clueRecorded, npc, onDiscoverClue])

  useEffect(() => {
    const handler = (e) => {
      if (stage === 'opening' && done && mystery && (e.key === 'Enter' || e.key === 'e' || e.key === 'E')) {
        e.preventDefault()
        SFX.select()
        setStage('followup')
        return
      }

      if (done && (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape')) {
        SFX.dismiss()
        onDismiss()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [done, mystery, onDismiss, stage])

  return (
    <div
      className="overlay-safe"
      style={{
        zIndex: 100,
        background: 'rgba(4, 6, 14, 0.88)',
      }}
      onClick={done && !(stage === 'opening' && mystery) ? () => { SFX.dismiss(); onDismiss() } : undefined}
    >
      <div className="overlay-safe-center">
        <div className="overlay-header-row">
          <div className="overlay-header-title" style={{
            fontFamily: 'VT323',
            fontSize: '18px',
            letterSpacing: '4px',
            color: accent,
            opacity: 0.5,
            lineHeight: 1.15,
          }}>
            {npc.name.toUpperCase()} — {npc.title.toUpperCase()}
          </div>
        </div>

        <div style={{
          width: 'min(100%, 720px)',
          border: `1px solid ${accent}22`,
          padding: 'clamp(24px, 4vw, 36px) clamp(20px, 4vw, 44px)',
          background: 'rgba(8, 12, 20, 0.97)',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 20,
        }}>
          <p style={{
            fontFamily: 'VT323',
            fontSize: '26px',
            color: '#c9d1d9',
            lineHeight: 1.55,
            margin: 0,
            overflowWrap: 'anywhere',
          }}>
            {displayed}
            {!done && (
              <span style={{ color: accent, opacity: 0.7, animation: 'bar-pulse 0.8s step-end infinite' }}>▌</span>
            )}
          </p>

          {stage === 'opening' && done && mystery && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <button
                onClick={() => {
                  SFX.select()
                  setStage('followup')
                }}
                className="btn-crt"
                style={{ fontSize: '14px', letterSpacing: '0.12em', padding: '8px 18px' }}
              >
                {mystery.promptLabel}
              </button>
              <div style={{
                fontFamily: 'VT323',
                fontSize: '12px',
                letterSpacing: '2px',
                color: '#4a6080',
                textAlign: 'right',
              }}>
                Optional. You can leave it there.
              </div>
            </div>
          )}

          {stage === 'followup' && done && clueRecorded && (
            <div style={{
              borderTop: `1px solid ${accent}22`,
              paddingTop: 14,
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '13px',
              color: '#7a8a9e',
              lineHeight: 1.6,
            }}>
              You file that away. Not proof. Not nothing.
            </div>
          )}
        </div>

        <div className="overlay-footer-copy" style={{
          fontFamily: 'VT323',
          fontSize: '14px',
          letterSpacing: '3px',
          color: '#2a3a4e',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          {stage === 'opening' && done && mystery
            ? '[ E / ENTER ] ASK · [ SPACE ] LEAVE'
            : '[ SPACE ] TO CONTINUE'}
        </div>
      </div>
    </div>
  )
}
