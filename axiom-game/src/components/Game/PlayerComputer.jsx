import { useEffect, useState, useCallback } from 'react'
import { DESK_DOCS } from '../../data/deskContent.js'

const EMOTION_LABELS = {
  trust:    ['HOSTILE', 'WARY', 'NEUTRAL', 'OPEN', 'TRUSTING'],
  respect:  ['DISMISSIVE', 'SKEPTICAL', 'NEUTRAL', 'RESPECTFUL', 'DEFERENTIAL'],
  wariness: ['RELAXED', 'ATTENTIVE', 'CAUTIOUS', 'GUARDED', 'SUSPICIOUS'],
  loyalty:  ['OPPOSED', 'INDIFFERENT', 'NEUTRAL', 'ALIGNED', 'COMMITTED'],
}

function axisLabel(axis, value) {
  return EMOTION_LABELS[axis]?.[Math.min(4, Math.floor(value / 25))] ?? '—'
}

function EmotionBar({ axis, value, accent }) {
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
const WEEKDAY = ['MON', 'TUE', 'WED', 'THU', 'FRI']
const TABS = ['FILES', 'STAKEHOLDERS', 'DECISIONS', 'PREVIOUS PM']

const BOOT_LINES = [
  'AXIOM WORKSTATION v2.3 — SECURE SESSION',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '> AUTHENTICATING...',
  '> SESSION ESTABLISHED',
  '> LOADING FILES...',
]

export default function PlayerComputer({
  cast,
  deskRead,
  decisionLog = [],
  discoveredClues = [],
  hiddenEndingUnlocked = false,
  completedDialogues = [],
  onDismiss,
  onMarkDeskDocRead,
}) {
  const [bootComplete, setBootComplete] = useState(false)
  const [activeTab, setActiveTab] = useState('FILES')
  const [openDocId, setOpenDocId] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setBootComplete(true), 750)
    return () => clearTimeout(t)
  }, [])

  const openDoc = useCallback((doc) => {
    setOpenDocId(doc.id)
    if (!deskRead?.[doc.id]) onMarkDeskDocRead(doc.id)
  }, [deskRead, onMarkDeskDocRead])

  useEffect(() => {
    const esc = (e) => {
      if (e.key !== 'Escape') return
      if (openDocId) { setOpenDocId(null); return }
      onDismiss()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onDismiss, openDocId])

  const ordered = STAKEHOLDER_ORDER.map(id => cast.find(c => c.id === id)).filter(Boolean)
  const visibleDocs = DESK_DOCS.filter(d =>
    d.unlocksAfter === null || completedDialogues.includes(d.unlocksAfter)
  )
  const activeDoc = visibleDocs.find(d => d.id === openDocId)

  // ── SCANLINE OVERLAY ────────────────────────────────────────────────────
  const scanlines = (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
    }} />
  )

  // ── BOOT SCREEN ─────────────────────────────────────────────────────────
  if (!bootComplete) {
    return (
      <div className="overlay-safe" style={{ zIndex: 240, background: 'rgba(4,6,14,0.97)' }}>
        {scanlines}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 420,
          width: '100%',
          padding: '0 24px',
        }}>
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: 'VT323',
                fontSize: i === 0 ? 16 : 13,
                letterSpacing: i === 0 ? '3px' : '1px',
                color: i === 0 ? '#ff9f43' : '#3d5266',
                marginBottom: i === 1 ? 12 : 4,
                opacity: 0,
                animation: `fadeUp 0.3s ease ${i * 130}ms forwards`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── MAIN DESKTOP UI ─────────────────────────────────────────────────────
  return (
    <div
      className="overlay-safe"
      style={{
        zIndex: 240,
        background: 'rgba(4,6,14,0.96)',
        animation: 'fadeUp 0.2s ease forwards',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {scanlines}

      {/* Title bar */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px 12px',
        borderBottom: '1px solid #1a2535',
        background: '#04060e',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'VT323', fontSize: '17px', letterSpacing: '4px', color: '#ff9f43' }}>
            AXIOM WORKSTATION
          </span>
          <span style={{ fontFamily: 'VT323', fontSize: '11px', letterSpacing: '2px', color: '#2a3a4e' }}>
            SECURE SESSION
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            fontFamily: 'VT323', fontSize: '11px', letterSpacing: '2px',
            color: '#4a6080', background: 'transparent',
            border: '1px solid #1a2535', padding: '5px 10px', cursor: 'pointer',
          }}
        >
          CLOSE
        </button>
      </div>

      {/* Body: sidebar + content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Sidebar */}
        <div style={{
          width: 160,
          flexShrink: 0,
          background: '#060a12',
          borderRight: '1px solid #1a2535',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 16,
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); setOpenDocId(null) }}
                style={{
                  textAlign: 'left',
                  fontFamily: 'VT323',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  color: active ? '#ff9f43' : '#3d5266',
                  background: active ? 'rgba(255,159,67,0.04)' : 'transparent',
                  border: 'none',
                  borderLeft: active ? '3px solid #ff9f43' : '3px solid transparent',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'color 0.15s',
                }}
              >
                {tab}
              </button>
            )
          })}

          {/* Spacer + footer */}
          <div style={{ flex: 1 }} />
          <div style={{
            padding: '12px 14px',
            fontFamily: 'VT323',
            fontSize: '10px',
            letterSpacing: '1px',
            color: '#1e2d42',
            lineHeight: 1.4,
            borderTop: '1px solid #0d1220',
          }}>
            [ ESC ] BACK<br />
            [ C ] TOGGLE
          </div>
        </div>

        {/* Content panel */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
        }}>
          {activeTab === 'FILES' && (
            <FilesPanel
              visibleDocs={visibleDocs}
              deskRead={deskRead}
              activeDoc={activeDoc}
              openDoc={openDoc}
              onBack={() => setOpenDocId(null)}
            />
          )}
          {activeTab === 'STAKEHOLDERS' && (
            <StakeholdersPanel ordered={ordered} />
          )}
          {activeTab === 'DECISIONS' && (
            <DecisionsPanel decisionLog={decisionLog} />
          )}
          {activeTab === 'PREVIOUS PM' && (
            <PreviousPMPanel
              discoveredClues={discoveredClues}
              hiddenEndingUnlocked={hiddenEndingUnlocked}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── TAB: FILES ─────────────────────────────────────────────────────────────

function FilesPanel({ visibleDocs, deskRead, activeDoc, openDoc, onBack }) {
  if (activeDoc) {
    return (
      <div>
        <button
          type="button"
          onClick={onBack}
          style={{
            fontFamily: 'VT323', fontSize: '11px', letterSpacing: '2px',
            color: '#4a6080', background: 'transparent',
            border: '1px solid #1a2535', padding: '6px 12px',
            cursor: 'pointer', marginBottom: 16,
          }}
        >
          ← FILES
        </button>
        <div style={{
          fontFamily: 'VT323', fontSize: '11px', letterSpacing: '2px',
          color: '#2a3a4e', marginBottom: 4,
        }}>
          {activeDoc.kicker}
        </div>
        <div style={{
          fontFamily: 'VT323', fontSize: '16px', letterSpacing: '2px',
          color: '#ff9f43', marginBottom: 16,
        }}>
          {activeDoc.label}
        </div>
        <div style={{
          padding: '14px 16px',
          border: '1px solid #1a2535',
          background: 'rgba(6,10,18,0.85)',
        }}>
          {activeDoc.body.map((para, i) => (
            <p key={i} style={{
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: 13, lineHeight: 1.6,
              color: '#9aacbf',
              margin: i === 0 ? 0 : '14px 0 0',
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        fontFamily: 'VT323', fontSize: '11px', letterSpacing: '3px',
        color: '#3d5266', marginBottom: 14,
      }}>
        FILES — {visibleDocs.length} AVAILABLE
      </div>
      {visibleDocs.length === 0 && (
        <div style={{
          fontFamily: 'Josefin Sans, sans-serif', fontSize: 13,
          color: '#2a3a4e', lineHeight: 1.5,
        }}>
          No files available yet.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visibleDocs.map(doc => {
          const read = deskRead?.[doc.id]
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => openDoc(doc)}
              style={{
                textAlign: 'left',
                fontFamily: 'VT323', fontSize: '14px', letterSpacing: '2px',
                color: read ? '#5a7090' : '#c4d4e4',
                background: 'rgba(6,10,18,0.75)',
                border: '1px solid #1a2535',
                padding: '10px 14px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff9f4340' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a2535' }}
            >
              <span>{doc.label}</span>
              {read && (
                <span style={{ marginLeft: 12, color: '#2a3a4e', fontSize: '11px', letterSpacing: '1px' }}>
                  · READ
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── TAB: STAKEHOLDERS ─────────────────────────────────────────────────────

function StakeholdersPanel({ ordered }) {
  return (
    <div>
      <div style={{
        fontFamily: 'VT323', fontSize: '11px', letterSpacing: '3px',
        color: '#3d5266', marginBottom: 6,
      }}>
        STAKEHOLDER OPTICS
      </div>
      <p style={{
        fontFamily: 'Josefin Sans, sans-serif', fontSize: 11,
        color: '#4a6080', letterSpacing: '0.04em',
        margin: '0 0 18px', lineHeight: 1.4,
      }}>
        Private — not visible on the map.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ordered.map(c => (
          <div key={c.id} style={{
            border: `1px solid ${c.accentColor}28`,
            padding: '12px 14px',
            background: `${c.accentColor}08`,
          }}>
            <div style={{
              fontFamily: 'VT323', fontSize: '15px', letterSpacing: '2px',
              color: c.accentColor, marginBottom: 2,
            }}>
              {(c.shortName || c.name).toUpperCase()}
            </div>
            <div style={{
              fontFamily: 'VT323', fontSize: '10px', letterSpacing: '1px',
              color: '#2a3a4e', marginBottom: 10,
            }}>
              {(c.title || '').toUpperCase()}
            </div>
            {Object.entries(c.emotion).map(([axis, val]) => (
              <EmotionBar key={axis} axis={axis} value={val} accent={c.accentColor} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── TAB: DECISIONS ────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI']

function DecisionsPanel({ decisionLog }) {
  return (
    <div>
      <div style={{
        fontFamily: 'VT323', fontSize: '11px', letterSpacing: '3px',
        color: '#3d5266', marginBottom: 6,
      }}>
        DECISION LOG
      </div>
      <p style={{
        fontFamily: 'Josefin Sans, sans-serif', fontSize: 11,
        color: '#4a6080', letterSpacing: '0.04em',
        margin: '0 0 18px', lineHeight: 1.4,
      }}>
        Your private audit trail. Every call you have made is here.
      </p>
      {decisionLog.length === 0 ? (
        <div style={{
          fontFamily: 'VT323', fontSize: '13px', letterSpacing: '2px',
          color: '#2a3a4e',
        }}>
          No decisions recorded yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {decisionLog.map((entry, i) => (
            <div key={i} style={{
              border: '1px solid #1a2535',
              padding: '10px 14px',
              background: 'rgba(6,10,18,0.75)',
            }}>
              <div style={{
                fontFamily: 'VT323', fontSize: '11px', letterSpacing: '2px',
                color: '#2a3a4e', marginBottom: 4,
              }}>
                WEEK {entry.week}
              </div>
              <div style={{
                fontFamily: 'VT323', fontSize: '14px', letterSpacing: '2px',
                color: '#6b8aaa', marginBottom: 4,
              }}>
                {entry.scenarioTitle}
              </div>
              <div style={{
                fontFamily: 'Josefin Sans, sans-serif', fontSize: 12,
                color: '#9aacbf', lineHeight: 1.4,
              }}>
                {entry.choiceLabel}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── TAB: PREVIOUS PM ──────────────────────────────────────────────────────

function PreviousPMPanel({ discoveredClues, hiddenEndingUnlocked }) {
  return (
    <div>
      <div style={{
        fontFamily: 'VT323', fontSize: '11px', letterSpacing: '3px',
        color: '#3d5266', marginBottom: 6,
      }}>
        AXIOM_INCIDENT_LOG.TXT
      </div>
      <p style={{
        fontFamily: 'Josefin Sans, sans-serif', fontSize: 11,
        color: '#4a6080', letterSpacing: '0.04em',
        margin: '0 0 18px', lineHeight: 1.4,
      }}>
        Something was left behind. Read carefully.
      </p>
      <div style={{
        padding: '14px 16px',
        border: '1px solid #1a2535',
        background: 'rgba(6,10,18,0.85)',
      }}>
        {discoveredClues.length === 0 && !hiddenEndingUnlocked ? (
          <div style={{
            fontFamily: 'VT323', fontSize: '13px', letterSpacing: '2px',
            color: '#2a3a4e',
          }}>
            [REDACTED] — NO DATA AVAILABLE
            <span style={{ animation: 'pulse 1.2s step-end infinite', marginLeft: 4 }}>█</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {discoveredClues.map((clue, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'VT323', fontSize: '11px', letterSpacing: '2px',
                  color: '#2a3a4e', marginBottom: 2,
                }}>
                  ENTRY {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{
                  fontFamily: 'Josefin Sans, sans-serif', fontSize: 13,
                  color: '#9aacbf', lineHeight: 1.5,
                }}>
                  {clue}
                </div>
              </div>
            ))}
            {hiddenEndingUnlocked && (
              <div style={{
                marginTop: 8,
                padding: '10px 12px',
                border: '1px solid #ff6b6b28',
                background: 'rgba(255,107,107,0.04)',
              }}>
                <div style={{
                  fontFamily: 'VT323', fontSize: '11px', letterSpacing: '2px',
                  color: '#ff6b6b', marginBottom: 4,
                }}>
                  FINAL ENTRY — UNLOCKED
                </div>
                <div style={{
                  fontFamily: 'Josefin Sans, sans-serif', fontSize: 13,
                  color: '#9aacbf', lineHeight: 1.5,
                }}>
                  The previous PM knew what the brief meant. They read the spec. They saw the same gap you are looking at now. The reason they are no longer here is not in any file on this system.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
