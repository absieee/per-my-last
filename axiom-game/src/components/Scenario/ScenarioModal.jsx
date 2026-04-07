import { useState } from 'react'
import { CAST } from '../../data/cast.js'

function SenderTag({ fromId, tag }) {
  const sender = CAST.find(c => c.id === fromId)
  const color = sender?.accentColor || 'var(--text-sec)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
      <span className="font-vt323" style={{ fontSize: 15, color, letterSpacing: '0.08em' }}>
        {sender?.name?.toUpperCase() || 'AXIOM COLLECTIVE'}
      </span>
      <span className="font-vt323" style={{
        fontSize: 12,
        border: `1px solid ${color}`,
        color,
        padding: '1px 8px',
        letterSpacing: '0.1em',
      }}>
        {tag}
      </span>
    </div>
  )
}

export default function ScenarioModal({ scenario, onChoice }) {
  const [freeText, setFreeText] = useState('')
  const [freeTextSubmitted, setFreeTextSubmitted] = useState(false)

  const needsFreeText = scenario.requiresFreeText && !freeTextSubmitted

  const handleFreeTextSubmit = () => {
    if (!freeText.trim()) return
    setFreeTextSubmitted(true)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4,6,14,0.96)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(16px, 4vw, 40px)',
    }}>
      <div style={{
        maxWidth: 680,
        width: '100%',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: 'clamp(20px, 4vw, 32px) clamp(18px, 4vw, 36px)',
        maxHeight: 'min(100%, 760px)',
        overflowY: 'auto',
      }}
        className="fade-up"
      >
        <SenderTag fromId={scenario.from} tag={scenario.tag} />

        <h2 className="font-syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          {scenario.title}
        </h2>

        {Array.isArray(scenario.prePressure) && scenario.prePressure.length > 0 && (
          <div style={{
            marginBottom: 20,
            padding: '12px 14px',
            background: 'var(--surface-up)',
            border: '1px solid var(--border)',
            borderRadius: 2,
          }}>
            <div className="font-vt323" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--text-sec)', marginBottom: 10 }}>
              INCOMING
            </div>
            {scenario.prePressure.map((ping, idx) => {
              const sender = CAST.find(c => c.id === ping.from)
              const color = sender?.accentColor || 'var(--text-sec)'
              return (
                <div key={idx} style={{ marginBottom: idx < scenario.prePressure.length - 1 ? 12 : 0 }}>
                  <span className="font-vt323" style={{ fontSize: 11, color, letterSpacing: '0.06em' }}>
                    {(sender?.name || ping.from || '?').toUpperCase()}
                  </span>
                  <p style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--text)', margin: '4px 0 0', fontStyle: 'italic' }}>
                    {ping.text}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)', marginBottom: 12 }}>
          {scenario.brief}
        </p>

        <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-sec)', fontStyle: 'italic', marginBottom: 28, borderLeft: '2px solid var(--border)', paddingLeft: 12 }}>
          {scenario.subtext}
        </p>

        {needsFreeText ? (
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-sec)', marginBottom: 10 }}>
              {scenario.freeTextPrompt}
            </p>
            <textarea
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                background: 'var(--surface-up)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: 13,
                padding: '10px 12px',
                resize: 'none',
                marginBottom: 12,
              }}
              placeholder="What do you say to Simone?"
            />
            <button className="btn-crt" onClick={handleFreeTextSubmit} disabled={!freeText.trim()}>
              CONTINUE
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scenario.choices.map((choice, i) => (
              <button
                key={i}
                className="btn-choice"
                onClick={() => onChoice(i, choice)}
              >
                <span className="choice-label">{choice.label}</span>
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
