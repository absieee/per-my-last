const LABELS = {
  trust:   ['HOSTILE', 'WARY', 'NEUTRAL', 'OPEN', 'TRUSTING'],
  respect: ['DISMISSIVE', 'SKEPTICAL', 'NEUTRAL', 'RESPECTFUL', 'DEFERENTIAL'],
  wariness:['RELAXED', 'ATTENTIVE', 'CAUTIOUS', 'GUARDED', 'SUSPICIOUS'],
  loyalty: ['OPPOSED', 'INDIFFERENT', 'NEUTRAL', 'ALIGNED', 'COMMITTED'],
}

function label(axis, value) {
  return LABELS[axis]?.[Math.min(4, Math.floor(value / 25))] ?? '—'
}

function Bar({ axis, value, accent }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: 'VT323', fontSize: '11px', letterSpacing: '1px', color: '#2a3a4e' }}>
          {axis.toUpperCase()}
        </span>
        <span style={{ fontFamily: 'VT323', fontSize: '11px', letterSpacing: '1px', color: accent, opacity: 0.7 }}>
          {label(axis, value)}
        </span>
      </div>
      <div style={{ height: 2, background: '#111822', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, right: `${100 - value}%`,
          background: accent, opacity: 0.55,
          transition: 'right 0.6s ease',
        }} />
      </div>
    </div>
  )
}

export default function HUD({ week, nearbyCharacter, scenarioPending, onOpenScenario }) {
  return (
    <>
      {/* Top-right panel */}
      <div className="hud-shell">
        {/* Wordmark + week */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
          borderBottom: '1px solid #111822',
          paddingBottom: 8,
          marginBottom: 10,
        }}>
          <span style={{ fontFamily: 'VT323', fontSize: '20px', letterSpacing: '5px', color: '#ff9f43', minWidth: 0 }}>AXIOM</span>
          <span style={{ fontFamily: 'VT323', fontSize: '12px', letterSpacing: '2px', color: '#2a3a4e', flexShrink: 0 }}>WK {week}</span>
        </div>

        {/* Nearby character card */}
        {nearbyCharacter && (
          <div style={{
            border: `1px solid ${nearbyCharacter.accentColor}33`,
            padding: '12px 14px',
            background: `${nearbyCharacter.accentColor}06`,
            width: '100%',
          }}>
            <div style={{
              fontFamily: 'VT323',
              fontSize: '16px',
              letterSpacing: '2px',
              color: nearbyCharacter.accentColor,
              marginBottom: 2,
              overflowWrap: 'anywhere',
            }}>
              {nearbyCharacter.shortName?.toUpperCase()}
            </div>
            <div style={{
              fontFamily: 'VT323',
              fontSize: '11px',
              letterSpacing: '1px',
              color: '#2a3a4e',
              marginBottom: 12,
              overflowWrap: 'anywhere',
            }}>
              {nearbyCharacter.title?.toUpperCase()}
            </div>
            {Object.entries(nearbyCharacter.emotion).map(([axis, val]) => (
              <Bar key={axis} axis={axis} value={val} accent={nearbyCharacter.accentColor} />
            ))}
          </div>
        )}
      </div>

      {/* Scenario alert — bottom right */}
      {scenarioPending && (
        <div style={{
          position: 'fixed',
          bottom: 72,
          right: 24,
          zIndex: 60,
          maxWidth: 'calc(100vw - 48px)',
        }}>
          <button
            onClick={onOpenScenario}
            style={{
              background: 'transparent',
              border: '1px solid #ff4757',
              color: '#ff4757',
              fontFamily: 'VT323',
              fontSize: '13px',
              letterSpacing: '3px',
              padding: '10px 20px',
              cursor: 'pointer',
              animation: 'pulse 1.6s ease-in-out infinite',
              maxWidth: '100%',
              whiteSpace: 'normal',
            }}
          >
            ⚠ OPEN SCENARIO
          </button>
        </div>
      )}
    </>
  )
}
