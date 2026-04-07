import { useEffect } from 'react'

const LABELS = {
  trust:   ['HOSTILE', 'WARY', 'NEUTRAL', 'OPEN', 'TRUSTING'],
  respect: ['DISMISSIVE', 'SKEPTICAL', 'NEUTRAL', 'RESPECTFUL', 'DEFERENTIAL'],
  wariness:['RELAXED', 'ATTENTIVE', 'CAUTIOUS', 'GUARDED', 'SUSPICIOUS'],
  loyalty: ['OPPOSED', 'INDIFFERENT', 'NEUTRAL', 'ALIGNED', 'COMMITTED'],
}

function axisLabel(axis, value) {
  return LABELS[axis]?.[Math.min(4, Math.floor(value / 25))] ?? '—'
}

function Bar({ axis, value, accent }) {
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontFamily: 'VT323', fontSize: '10px', letterSpacing: '1px', color: '#2a3a4e' }}>
          {axis.toUpperCase()}
        </span>
        <span style={{ fontFamily: 'VT323', fontSize: '10px', letterSpacing: '1px', color: accent, opacity: 0.7 }}>
          {axisLabel(axis, value)}
        </span>
      </div>
      <div style={{ height: 2, background: '#111822', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, right: `${100 - value}%`,
          background: accent, opacity: 0.55,
          transition: 'right 0.45s ease',
        }} />
      </div>
    </div>
  )
}

const STAKEHOLDER_ORDER = ['petra', 'callum', 'simone', 'marcus']

export default function PlayerComputer({ cast, onDismiss }) {
  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onDismiss])

  const ordered = STAKEHOLDER_ORDER.map(id => cast.find(c => c.id === id)).filter(Boolean)

  return (
    <div
      className="overlay-safe"
      style={{
        zIndex: 240,
        background: 'rgba(4,6,14,0.94)',
        animation: 'fadeUp 0.2s ease forwards',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
        pointerEvents: 'none',
      }} />

      <div className="overlay-safe-center" style={{ maxWidth: 520, alignItems: 'stretch' }}>
        <div className="overlay-header-row" style={{ borderBottom: '1px solid #1a2535', paddingBottom: 10, marginBottom: 14 }}>
          <div className="overlay-header-title" style={{ fontFamily: 'VT323', letterSpacing: '4px', color: '#ff9f43' }}>
            YOUR DESK — SECURE TERMINAL
          </div>
          <button
            type="button"
            className="overlay-header-action"
            onClick={onDismiss}
            style={{ fontFamily: 'VT323', cursor: 'pointer', background: 'transparent', border: '1px solid #1a2535', color: '#4a6080' }}
          >
            CLOSE
          </button>
        </div>

        <p style={{
          fontFamily: 'Josefin Sans, sans-serif',
          fontSize: 12,
          color: '#4a6080',
          letterSpacing: '0.04em',
          margin: '0 0 18px',
          lineHeight: 1.45,
        }}>
          Stakeholder optics (trust, respect, wariness, loyalty) — pulled from your private notes. Not shown on the map.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'min(58vh, 520px)', overflowY: 'auto' }}>
          {ordered.map(c => (
            <div
              key={c.id}
              style={{
                border: `1px solid ${c.accentColor}28`,
                padding: '12px 14px',
                background: `${c.accentColor}08`,
              }}
            >
              <div style={{ fontFamily: 'VT323', fontSize: 15, letterSpacing: '2px', color: c.accentColor, marginBottom: 2 }}>
                {(c.shortName || c.name).toUpperCase()}
              </div>
              <div style={{ fontFamily: 'VT323', fontSize: 10, letterSpacing: '1px', color: '#2a3a4e', marginBottom: 10 }}>
                {(c.title || '').toUpperCase()}
              </div>
              {Object.entries(c.emotion).map(([axis, val]) => (
                <Bar key={axis} axis={axis} value={val} accent={c.accentColor} />
              ))}
            </div>
          ))}
        </div>

        <div className="overlay-footer-copy" style={{ marginTop: 18, textAlign: 'center' }}>
          [ ESC TO CLOSE ] · [ C TO TOGGLE ]
        </div>
      </div>
    </div>
  )
}
