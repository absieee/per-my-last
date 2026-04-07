import { useEffect, useState, useCallback } from 'react'
import { DESK_DOCS } from '../../data/deskContent.js'

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

export default function PlayerComputer({ cast, deskRead, onDismiss, onMarkDeskDocRead }) {
  const [openDocId, setOpenDocId] = useState(null)

  const openDoc = useCallback((doc) => {
    setOpenDocId(doc.id)
    if (!deskRead?.[doc.id]) {
      onMarkDeskDocRead(doc.id)
    }
  }, [deskRead, onMarkDeskDocRead])

  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') {
        if (openDocId) setOpenDocId(null)
        else onDismiss()
      }
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onDismiss, openDocId])

  const ordered = STAKEHOLDER_ORDER.map(id => cast.find(c => c.id === id)).filter(Boolean)
  const activeDoc = DESK_DOCS.find(d => d.id === openDocId)

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

      <div className="overlay-safe-center" style={{ maxWidth: 560, alignItems: 'stretch' }}>
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

        {activeDoc ? (
          <div style={{ marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => setOpenDocId(null)}
              style={{
                fontFamily: 'VT323',
                fontSize: 11,
                letterSpacing: '2px',
                color: '#4a6080',
                background: 'transparent',
                border: '1px solid #1a2535',
                padding: '6px 12px',
                cursor: 'pointer',
                marginBottom: 12,
              }}
            >
              ← FILES
            </button>
            <div style={{
              fontFamily: 'VT323',
              fontSize: 11,
              letterSpacing: '2px',
              color: '#2a3a4e',
              marginBottom: 4,
            }}>
              {activeDoc.kicker}
            </div>
            <div style={{
              fontFamily: 'VT323',
              fontSize: 16,
              letterSpacing: '2px',
              color: '#ff9f43',
              marginBottom: 14,
            }}>
              {activeDoc.label}
            </div>
            <div style={{
              maxHeight: 'min(42vh, 320px)',
              overflowY: 'auto',
              padding: '12px 14px',
              border: '1px solid #1a2535',
              background: 'rgba(6,10,18,0.85)',
            }}>
              {activeDoc.body.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'Josefin Sans, sans-serif',
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: '#9aacbf',
                    margin: i === 0 ? 0 : '12px 0 0',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontFamily: 'VT323',
              fontSize: 12,
              letterSpacing: '3px',
              color: '#3d5266',
              marginBottom: 10,
            }}>
              FILES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
              {DESK_DOCS.map(doc => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => openDoc(doc)}
                  style={{
                    textAlign: 'left',
                    fontFamily: 'VT323',
                    fontSize: 14,
                    letterSpacing: '2px',
                    color: deskRead?.[doc.id] ? '#5a7090' : '#c4d4e4',
                    background: 'rgba(6,10,18,0.75)',
                    border: '1px solid #1a2535',
                    padding: '10px 14px',
                    cursor: 'pointer',
                  }}
                >
                  {doc.label}
                  {deskRead?.[doc.id] ? ' · READ' : ''}
                </button>
              ))}
            </div>

            <div style={{
              fontFamily: 'VT323',
              fontSize: 12,
              letterSpacing: '3px',
              color: '#3d5266',
              marginBottom: 10,
            }}>
              STAKEHOLDER NOTES
            </div>
            <p style={{
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: 11,
              color: '#4a6080',
              letterSpacing: '0.04em',
              margin: '0 0 14px',
              lineHeight: 1.4,
            }}>
              Private optics — not shown on the map.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'min(40vh, 400px)', overflowY: 'auto' }}>
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
          </>
        )}

        <div className="overlay-footer-copy" style={{ marginTop: 18, textAlign: 'center' }}>
          [ ESC BACK / CLOSE ] · [ C TOGGLE ]
        </div>
      </div>
    </div>
  )
}
