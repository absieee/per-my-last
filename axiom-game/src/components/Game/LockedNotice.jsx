import { useEffect } from 'react'

export default function LockedNotice({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 1400)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'relative',
        border: '1px solid #ff9f4388',
        padding: '18px 36px',
        background: '#04060ecc',
        animation: 'fadeUp 0.25s ease forwards',
        textAlign: 'center',
        width: 'min(560px, calc(100vw - 24px))',
      }}>
        {/* Scanlines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          fontFamily: 'VT323, monospace',
          fontSize: '18px',
          letterSpacing: '4px',
          color: '#ff9f43',
          opacity: 0.85,
          position: 'relative',
          lineHeight: 1.15,
          overflowWrap: 'anywhere',
        }}>
          {message}
        </div>
      </div>
    </div>
  )
}
