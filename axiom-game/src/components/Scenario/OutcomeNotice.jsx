import { useEffect } from 'react'

export default function OutcomeNotice({ notice, onDismiss }) {
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(onDismiss, 8000)
    return () => clearTimeout(t)
  }, [notice, onDismiss])

  if (!notice) return null

  return (
    <div
      className="fade-up"
      style={{
        margin: '8px 12px',
        padding: '10px 12px',
        border: '1px solid var(--accent-warm)',
        background: 'rgba(255,159,67,0.06)',
        fontSize: 12,
        lineHeight: 1.6,
        color: 'var(--text)',
        fontStyle: 'italic',
      }}
    >
      <div className="font-vt323" style={{ fontSize: 13, color: 'var(--accent-warm)', marginBottom: 4, letterSpacing: '0.06em' }}>
        OUTCOME
      </div>
      {notice}
    </div>
  )
}
