import CharacterTile from '../Character/CharacterTile.jsx'
import OutcomeNotice from '../Scenario/OutcomeNotice.jsx'

export default function Sidebar({ cast, activeCharacterId, week, pendingScenario, outcomeNotice, onCharacterSelect, onShowPolitics, onClearOutcome }) {
  return (
    <div className="sidebar">
      {/* Wordmark */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--border)' }}>
        <div className="font-vt323" style={{ fontSize: 22, letterSpacing: '0.2em', color: 'var(--text)' }}>
          AXIOM
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Josefin Sans', letterSpacing: '0.08em' }}>
          COLLECTIVE · MERIDIAN
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-vt323" style={{ fontSize: 13, color: 'var(--text-sec)', letterSpacing: '0.1em' }}>
            WEEK
          </span>
          <span className="font-vt323" style={{ fontSize: 20, color: 'var(--accent-warm)' }}>
            {String(week).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Pending scenario alert */}
      {pendingScenario && (
        <div
          className="pulse-anim"
          style={{
            margin: '8px 12px',
            padding: '8px 12px',
            border: '1px solid var(--alert)',
            background: 'rgba(255,107,107,0.06)',
            fontSize: 11,
            color: 'var(--alert)',
            fontFamily: 'VT323, monospace',
            letterSpacing: '0.08em',
          }}
        >
          ⚠ SCENARIO PENDING: {pendingScenario.title?.toUpperCase()}
        </div>
      )}

      {/* Outcome notice */}
      <OutcomeNotice notice={outcomeNotice} onDismiss={onClearOutcome} />

      {/* Character tiles */}
      <div style={{ flex: 1 }}>
        <div className="font-vt323" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em', padding: '10px 14px 4px' }}>
          STAKEHOLDERS
        </div>
        {cast.map(c => (
          <CharacterTile
            key={c.id}
            character={c}
            isActive={c.id === activeCharacterId}
            onClick={() => !c.transitioned && onCharacterSelect(c.id)}
          />
        ))}
      </div>

      {/* Politics panel toggle */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
        <button className="btn-crt" onClick={onShowPolitics} style={{ width: '100%', fontSize: 12, letterSpacing: '0.1em' }}>
          POLITICAL LANDSCAPE
        </button>
      </div>
    </div>
  )
}
