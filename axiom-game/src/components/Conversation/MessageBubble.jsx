import { useState, useEffect } from 'react'

export default function MessageBubble({ message, accentColor }) {
  const isPlayer = message.role === 'user'
  const [showWarning, setShowWarning] = useState(message.political_risk)

  useEffect(() => {
    if (message.political_risk) {
      const t = setTimeout(() => setShowWarning(false), 3000)
      return () => clearTimeout(t)
    }
  }, [message.political_risk])

  return (
    <div
      className="fade-up"
      style={{
        display: 'flex',
        justifyContent: isPlayer ? 'flex-end' : 'flex-start',
        marginBottom: 12,
        gap: 8,
        alignItems: 'flex-start',
      }}
    >
      {!isPlayer && (
        <div style={{
          width: 6,
          background: accentColor,
          alignSelf: 'stretch',
          flexShrink: 0,
          minHeight: 20,
        }} />
      )}
      <div style={{ maxWidth: '72%' }}>
        {showWarning && (
          <div className="political-warning" style={{ marginBottom: 4, fontSize: 14 }}>⚠</div>
        )}
        <div style={{
          background: isPlayer ? 'var(--surface-up)' : 'transparent',
          border: isPlayer ? '1px solid var(--border)' : 'none',
          padding: isPlayer ? '8px 12px' : '4px 0',
          fontSize: 13,
          lineHeight: 1.65,
          color: isPlayer ? 'var(--text-sec)' : 'var(--text)',
          fontStyle: isPlayer ? 'normal' : 'normal',
        }}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
