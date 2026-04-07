import { CAST } from '../../data/cast.js'

const NODE_POSITIONS = {
  petra:   { x: 80,  y: 60  },
  callum:  { x: 220, y: 60  },
  simone:  { x: 80,  y: 180 },
  marcus:  { x: 220, y: 180 },
}

function AllianceLines({ alliances }) {
  return alliances.map((a, i) => {
    const [m1, m2] = a.members
    const p1 = NODE_POSITIONS[m1]
    const p2 = NODE_POSITIONS[m2]
    if (!p1 || !p2) return null
    const opacity = Math.min(1, a.strength / 100)
    const strokeWidth = Math.max(1, (a.strength / 100) * 4)
    const color = a.strength > 60 ? 'var(--accent-warm)' : 'var(--text-sec)'
    return (
      <line
        key={i}
        x1={p1.x} y1={p1.y}
        x2={p2.x} y2={p2.y}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeDasharray={a.strength < 40 ? '4 4' : 'none'}
      />
    )
  })
}

function CharacterNode({ character, pressure }) {
  const pos = NODE_POSITIONS[character.id]
  if (!pos) return null
  const pulseDuration = Math.max(0.8, 3 - (pressure / 50))
  return (
    <g>
      <circle
        cx={pos.x} cy={pos.y} r={18}
        fill={`${character.accentColor}22`}
        stroke={character.accentColor}
        strokeWidth={1}
        style={{ animation: `pulse ${pulseDuration}s ease-in-out infinite` }}
      />
      <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
        fontFamily="VT323, monospace" fontSize={14} fill={character.accentColor}>
        {character.shortName.charAt(0)}
      </text>
      <text x={pos.x} y={pos.y + 26} textAnchor="middle"
        fontFamily="Josefin Sans, sans-serif" fontSize={9} fill="var(--text-sec)">
        {character.shortName.toUpperCase()}
      </text>
    </g>
  )
}

export default function PoliticsPanel({ politics, onClose }) {
  const { alliances, agendaPressure, signalLog } = politics

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: 300,
      height: '100vh',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRight: 'none',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeUp 0.2s ease forwards',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-vt323" style={{ fontSize: 16, letterSpacing: '0.1em', color: 'var(--text-sec)' }}>
          POLITICAL LANDSCAPE
        </span>
        <button className="btn-crt" onClick={onClose} style={{ fontSize: 12, padding: '2px 10px' }}>✕</button>
      </div>

      {/* Network diagram */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
        <div className="font-vt323" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
          ALLIANCE WEB
        </div>
        <svg width="300" height="220" style={{ overflow: 'visible' }}>
          <AllianceLines alliances={alliances} />
          {CAST.map(c => (
            <CharacterNode
              key={c.id}
              character={c}
              pressure={agendaPressure[c.id] || 0}
            />
          ))}
        </svg>
      </div>

      {/* Signal log */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
        <div className="font-vt323" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 10 }}>
          SIGNAL LOG
        </div>
        {signalLog.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>No signals detected.</div>
        ) : (
          signalLog.map((entry, i) => (
            <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-sec)', lineHeight: 1.5 }}>{entry.text}</div>
              <div className="font-vt323" style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>Week {entry.week}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
