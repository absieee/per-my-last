const AXIS_COLORS = {
  trust:    '#4ECDC4',
  respect:  '#A29BFE',
  wariness: '#FF6B6B',
  loyalty:  '#FFE66D',
}

function EmotionDots({ emotion }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
      {Object.entries(emotion).map(([key, val]) => {
        const filled = val >= 60
        return (
          <div
            key={key}
            title={key}
            className={`dot ${filled ? 'filled' : ''}`}
            style={{ color: AXIS_COLORS[key] || 'var(--text-sec)' }}
          />
        )
      })}
    </div>
  )
}

export default function CharacterTile({ character, isActive, onClick }) {
  const { name, shortName, title, accentColor, emotion, memory, transitioned, isSuccessor } = character
  const lastMemory = memory?.episodic?.slice(-1)[0]?.summary || '—'
  const dimmed = transitioned

  return (
    <button
      onClick={onClick}
      disabled={transitioned}
      style={{
        width: '100%',
        background: isActive ? `${accentColor}18` : 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--border)',
        borderLeft: isActive ? `2px solid ${accentColor}` : '2px solid transparent',
        padding: '10px 14px',
        cursor: transitioned ? 'default' : 'pointer',
        textAlign: 'left',
        opacity: dimmed ? 0.4 : 1,
        transition: 'background 0.15s, border-color 0.15s, opacity 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28,
          height: 28,
          background: transitioned ? 'var(--border)' : accentColor,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span className="font-vt323" style={{ fontSize: 16, color: transitioned ? 'var(--text-muted)' : '#04060e' }}>
            {shortName.charAt(0)}
          </span>
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: transitioned ? 'var(--text-muted)' : 'var(--text)', whiteSpace: 'nowrap' }}>
              {transitioned ? 'Role open' : shortName}
            </span>
            {isSuccessor && (
              <span className="font-vt323" style={{ fontSize: 11, color: 'var(--accent-warm)' }}>NEW</span>
            )}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-sec)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {transitioned ? title : lastMemory.slice(0, 40) + (lastMemory.length > 40 ? '…' : '')}
          </div>
          {!transitioned && <EmotionDots emotion={emotion} />}
        </div>
      </div>
    </button>
  )
}
