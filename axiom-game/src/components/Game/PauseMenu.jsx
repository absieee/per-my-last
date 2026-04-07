import { useState, useEffect, useCallback } from 'react'

const OPTIONS = ['RESUME', 'RESTART', 'MAIN MENU']

export default function PauseMenu({ onResume, onRestart, onMainMenu }) {
  const [selected, setSelected] = useState(0)

  const confirm = useCallback((index) => {
    if (index === 0) onResume()
    if (index === 1) onRestart()
    if (index === 2) onMainMenu()
  }, [onResume, onRestart, onMainMenu])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, OPTIONS.length - 1))
      else if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0))
      else if (e.key === 'Enter' || e.key === ' ') confirm(selected)
      else if (e.key === 'Escape') onResume()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, confirm, onResume])

  return (
    <div className="overlay-safe" style={{
      zIndex: 450,
      background: 'rgba(4,6,14,0.93)',
      animation: 'fadeUp 0.2s ease forwards',
    }}>
      {/* Scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
        pointerEvents: 'none',
      }} />

      <div className="overlay-safe-center" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        width: 'min(100%, 420px)',
      }}>
        {/* Header */}
        <div style={{
          fontFamily: 'VT323, monospace',
          fontSize: '13px',
          letterSpacing: '5px',
          color: '#ff9f43',
          opacity: 0.45,
          marginBottom: 32,
        }}>
          PAUSED
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {OPTIONS.map((label, i) => {
            const isSelected = i === selected
            return (
              <button
                key={label}
                onClick={() => confirm(i)}
                onMouseEnter={() => setSelected(i)}
                className={isSelected ? 'btn-crt' : undefined}
                style={{
                  fontSize: '16px',
                  letterSpacing: '4px',
                  padding: '11px 52px',
                  cursor: 'pointer',
                  fontFamily: 'VT323, monospace',
                  minWidth: 240,
                  width: 'min(100%, 320px)',
                  textAlign: 'center',
                  ...(!isSelected && {
                    background: 'transparent',
                    border: '1px solid #2a3a4e',
                    color: '#4a6080',
                  }),
                }}
              >
                {isSelected ? `› ${label}` : label}
              </button>
            )
          })}
        </div>

        {/* Hint */}
        <div style={{
          marginTop: 24,
          fontFamily: 'VT323, monospace',
          fontSize: '12px',
          letterSpacing: '2px',
          color: '#1e2d42',
          animation: 'pulse 2s ease-in-out infinite',
          textAlign: 'center',
        }}>
          ↑ ↓ TO SELECT · ENTER TO CONFIRM · ESC TO RESUME
        </div>
      </div>
    </div>
  )
}
