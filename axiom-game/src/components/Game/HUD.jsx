const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI']

export default function HUD({
  week,
  weekdayIndex,
  nearbyCharacter,
  scenarioPending,
  onOpenScenario,
  onOpenComputer,
}) {
  const wd = Math.min(4, Math.max(0, weekdayIndex ?? 0))

  return (
    <>
      <div className="hud-shell">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          borderBottom: '1px solid #111822',
          paddingBottom: 8,
          marginBottom: 10,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'VT323', fontSize: '20px', letterSpacing: '3px', color: '#8aacbf', flexShrink: 0 }}>
                WEEK {week}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {WEEKDAY_LABELS.map((label, i) => (
                <span
                  key={label}
                  style={{
                    fontFamily: 'VT323',
                    fontSize: i === wd ? '17px' : '13px',
                    letterSpacing: '1px',
                    color: i === wd ? '#ff9f43' : '#4a6a8a',
                    opacity: i === wd ? 1 : 0.75,
                    background: i === wd ? 'rgba(255,159,67,0.1)' : 'transparent',
                    border: i === wd ? '1px solid rgba(255,159,67,0.3)' : '1px solid transparent',
                    padding: '1px 5px',
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
            {week === 2 && wd === 3 && (
              <div style={{
                fontFamily: 'VT323',
                fontSize: '10px',
                letterSpacing: '1px',
                color: '#ff9f43',
                opacity: 0.85,
                lineHeight: 1.3,
              }}>
                {'Product Alignment Review today — Petra\'s session.'}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenComputer}
            style={{
              flexShrink: 0,
              fontFamily: 'VT323',
              fontSize: '11px',
              letterSpacing: '2px',
              color: '#6b8aaa',
              background: 'transparent',
              border: '1px solid #1a2535',
              padding: '6px 10px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#ff9f4340'
              e.currentTarget.style.color = '#9aacbf'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1a2535'
              e.currentTarget.style.color = '#6b8aaa'
            }}
          >
            DESK [C]
          </button>
        </div>

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
              overflowWrap: 'anywhere',
            }}>
              {nearbyCharacter.title?.toUpperCase()}
            </div>
            <div style={{
              fontFamily: 'VT323',
              fontSize: '9px',
              letterSpacing: '1px',
              color: '#3d5266',
              marginTop: 8,
              lineHeight: 1.35,
            }}>
              Open your desk (C) to see trust, wariness, and other optics.
            </div>
          </div>
        )}
      </div>

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
