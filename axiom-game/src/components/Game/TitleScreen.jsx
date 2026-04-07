import { useState, useEffect, useCallback } from 'react'

export default function TitleScreen({ hasSave, onComplete, onContinue, onNewGame }) {
  const [exiting, setExiting] = useState(false)
  const [selected, setSelected] = useState(0)

  const options = hasSave
    ? ['CONTINUE', 'NEW GAME']
    : ['ENTER']

  const confirm = useCallback((index) => {
    setExiting(true)
    const action = hasSave
      ? [onContinue, onNewGame][index]
      : onComplete
    setTimeout(action, 500)
  }, [hasSave, onComplete, onContinue, onNewGame])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setSelected(s => Math.min(s + 1, options.length - 1))
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setSelected(s => Math.max(s - 1, 0))
      } else if (e.key === 'Enter' || e.key === ' ') {
        confirm(selected)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, options.length, confirm])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 500,
      background: '#04060e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(24px, 5vw, 48px)',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 0.5s ease',
      animation: 'fadeUp 0.6s ease forwards',
    }}>
      {/* CRT scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Amber vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,159,67,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        textAlign: 'center',
        width: '100%',
        maxWidth: 640,
        margin: '0 auto',
        animation: 'fadeUp 0.5s ease 0.1s both',
        paddingBottom: 72,
      }}>
        {/* Presenter label */}
        <div style={{
          fontFamily: 'VT323, monospace',
          fontSize: '14px',
          letterSpacing: '5px',
          color: '#ff9f43',
          opacity: 0.5,
          marginBottom: 28,
          lineHeight: 1.2,
        }}>
          AXIOM COLLECTIVE PRESENTS
        </div>

        {/* Game title */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(48px, 10vw, 76px)',
          color: '#d4c9b0',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          margin: 0,
          marginBottom: 16,
        }}>
          Per My Last
        </h1>

        {/* Subtitle */}
        <div style={{
          fontFamily: 'Josefin Sans, sans-serif',
          fontSize: '13px',
          letterSpacing: '3px',
          color: '#2a3a4e',
          textTransform: 'uppercase',
          marginBottom: 56,
          lineHeight: 1.25,
        }}>
          a PM simulation
        </div>

        {/* Menu options */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {options.map((label, i) => {
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
                  padding: '12px 48px',
                  cursor: 'pointer',
                  fontFamily: 'VT323, monospace',
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

        {hasSave && (
          <div style={{
            marginTop: 20,
            fontFamily: 'VT323, monospace',
            fontSize: '12px',
            letterSpacing: '2px',
            color: '#1e2d42',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            ↑ ↓ TO SELECT · ENTER TO CONFIRM
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 32,
        left: 24,
        right: 24,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        fontFamily: 'VT323, monospace',
        fontSize: '13px',
        color: '#1a2030',
      }}>
        <span style={{ letterSpacing: '3px' }}>GREYWATER, 2041</span>
        <span style={{ letterSpacing: '2px', textAlign: 'right' }}>PROJECT MERIDIAN</span>
      </div>
    </div>
  )
}
