import { useEffect } from 'react'

export default function ControlsOverlay({ onDismiss }) {
  useEffect(() => {
    const handler = () => onDismiss()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onDismiss])

  return (
    <div className="overlay-safe" style={{
      zIndex: 250,
      background: 'rgba(4,6,14,0.92)',
      animation: 'fadeUp 0.3s ease forwards',
    }}>
      {/* Scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Arrow cross */}
      <div className="overlay-safe-center" style={{ gap: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {/* Up arrow */}
        <div style={{ fontFamily: 'VT323, monospace', fontSize: '52px', color: '#ff9f43', lineHeight: 1, opacity: 0.85 }}>↑</div>
        {/* Middle row */}
        <div style={{ display: 'flex', gap: 8, lineHeight: 1 }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: '52px', color: '#ff9f43', opacity: 0.85 }}>←</div>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: '52px', color: '#ff9f43', opacity: 0.85 }}>↓</div>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: '52px', color: '#ff9f43', opacity: 0.85 }}>→</div>
        </div>
      </div>

      {/* Label */}
      <div style={{
        fontFamily: 'VT323, monospace',
        fontSize: '18px',
        letterSpacing: '5px',
        color: '#ff9f43',
        opacity: 0.7,
        marginBottom: 12,
        textAlign: 'center',
        maxWidth: 'min(100%, 560px)',
        lineHeight: 1.15,
      }}>
        MOVE WITH WASD OR ARROW KEYS
      </div>

      {/* Sub-label */}
      <div style={{
        fontFamily: 'Josefin Sans, sans-serif',
        fontSize: '13px',
        letterSpacing: '0.08em',
        color: '#4a6080',
        marginBottom: 16,
        textAlign: 'center',
        maxWidth: 'min(100%, 420px)',
      }}>
        Walk to Petra to begin.
      </div>

      <div style={{
        fontFamily: 'VT323, monospace',
        fontSize: '14px',
        letterSpacing: '3px',
        color: '#3d5266',
        marginBottom: 40,
        textAlign: 'center',
      }}>
        PRESS C FOR YOUR DESK TERMINAL — STAKEHOLDER OPTICS & NOTES
      </div>

      {/* Dismiss hint */}
      <div style={{
        fontFamily: 'VT323, monospace',
        fontSize: '13px',
        letterSpacing: '3px',
        color: '#1e2d42',
        animation: 'pulse 2s ease-in-out infinite',
        textAlign: 'center',
      }}>
        [ ANY KEY TO DISMISS ]
      </div>
      </div>
    </div>
  )
}
