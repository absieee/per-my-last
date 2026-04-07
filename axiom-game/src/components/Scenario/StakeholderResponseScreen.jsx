import { useState, useEffect } from 'react'

function useTypewriter(text, speed = 35, active = true) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active) { setDisplayed(text); return }
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text, active])
  return displayed
}

function CharacterPanel({ reaction, index, visible }) {
  const { name, accentColor, label, delta } = reaction
  return (
    <div
      style={{
        border: `1px solid ${accentColor}33`,
        background: `${accentColor}08`,
        padding: '20px 24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.4s ease ${index * 0.2}s, transform 0.4s ease ${index * 0.2}s`,
      }}
    >
      <div className="font-vt323" style={{ fontSize: 13, color: accentColor, letterSpacing: '0.08em', marginBottom: 6 }}>
        {name?.toUpperCase()}
      </div>
      <div className="font-syne" style={{ fontSize: 20, fontWeight: 800, color: accentColor, marginBottom: 8, letterSpacing: '0.02em' }}>
        {label || 'NOTED'}
      </div>
      {delta && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Josefin Sans', letterSpacing: '0.05em' }}>
          {delta}
        </div>
      )}
    </div>
  )
}

export default function StakeholderResponseScreen({ data, onDismiss }) {
  const [panelsVisible, setPanelsVisible] = useState(false)
  const [btnVisible, setBtnVisible] = useState(false)

  const heading = useTypewriter('STAKEHOLDER RESPONSE', 40)

  useEffect(() => {
    const t1 = setTimeout(() => setPanelsVisible(true), 800)
    const t2 = setTimeout(() => setBtnVisible(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Auto-advance after 12s
  useEffect(() => {
    const t = setTimeout(onDismiss, 12000)
    return () => clearTimeout(t)
  }, [onDismiss])

  const reactions = data?.characterReactions || []

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(20px, 5vw, 60px)',
      animation: 'fadeUp 0.3s ease forwards',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40, width: 'min(100%, 720px)' }}>
        <div className="font-syne" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text)', minHeight: 40 }}>
          {heading}
        </div>
        <div className="font-vt323" style={{ fontSize: 16, color: 'var(--text-sec)', letterSpacing: '0.1em', marginTop: 6, lineHeight: 1.2, overflowWrap: 'anywhere' }}>
          {data?.scenarioTitle?.toUpperCase()} — {data?.choiceLabel}
        </div>
      </div>

      {/* 2×2 grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
        width: '100%',
        maxWidth: 640,
        marginBottom: 40,
      }}>
        {reactions.map((r, i) => (
          <CharacterPanel key={r.id} reaction={r} index={i} visible={panelsVisible} />
        ))}
      </div>

      {/* Continue */}
      <div style={{
        opacity: btnVisible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        <button className="btn-crt" onClick={onDismiss} style={{ letterSpacing: '0.15em', padding: '8px 32px' }}>
          CONTINUE
        </button>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Josefin Sans' }}>
          auto-advancing
        </span>
      </div>
    </div>
  )
}
