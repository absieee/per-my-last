import { useEffect } from 'react'
import { DOSSIERS } from '../../data/dossiers.js'

const EMOTION_LABELS = {
  trust:    ['HOSTILE', 'WARY', 'NEUTRAL', 'OPEN', 'TRUSTING'],
  wariness: ['RELAXED', 'ATTENTIVE', 'CAUTIOUS', 'GUARDED', 'SUSPICIOUS'],
  respect:  ['DISMISSIVE', 'SKEPTICAL', 'NEUTRAL', 'RESPECTFUL', 'DEFERENTIAL'],
}

export default function CharacterDossier({ character, onDismiss }) {
  const dossier = DOSSIERS[character.id]
  const accent = character.accentColor

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        e.preventDefault()
        onDismiss()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onDismiss])

  if (!dossier) return null

  const fields = [
    { label: 'AGENDA',    value: dossier.agenda },
    { label: 'WATCH OUT', value: dossier.watchOut },
  ]

  const bars = [
    { label: 'TRUST',    value: character.emotion.trust,    axis: 'trust' },
    { label: 'WARINESS', value: character.emotion.wariness, axis: 'wariness' },
    { label: 'RESPECT',  value: character.emotion.respect,  axis: 'respect' },
  ]

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(4, 6, 14, 0.97)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(20px, 5vw, 48px) clamp(12px, 5vw, 60px)',
        animation: 'fadeUp 0.2s ease forwards',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          border: `1px solid ${accent}22`,
          background: 'rgba(6, 10, 18, 0.98)',
          padding: 'clamp(20px, 4vw, 36px) clamp(18px, 4vw, 40px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          maxHeight: 'min(100%, 760px)',
          overflowY: 'auto',
        }}
      >
        {/* Name + title */}
        <div style={{
          fontFamily: 'VT323, monospace',
          fontSize: '22px',
          letterSpacing: '3px',
          color: accent,
          marginBottom: 4,
        }}>
          {dossier.name.toUpperCase()}
        </div>
        <div style={{
          fontFamily: 'Josefin Sans, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: `${accent}88`,
          textTransform: 'uppercase',
          marginBottom: 28,
        }}>
          {dossier.title}
        </div>

        {/* 4-field rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
          {fields.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{
                fontFamily: 'VT323, monospace',
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: '#5a8aaa',
                width: 80,
                flexShrink: 0,
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '14px',
                color: '#c4d4e4',
                lineHeight: 1.5,
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Emotion bars */}
        <div style={{
          fontFamily: 'VT323, monospace',
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: '#5a8aaa',
          marginBottom: 10,
        }}>
          CURRENT DISPOSITION
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 28 }}>
          {bars.map(({ label, value, axis }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                fontFamily: 'VT323, monospace',
                fontSize: '12px',
                letterSpacing: '0.12em',
                color: '#5a8aaa',
                width: 68,
                flexShrink: 0,
              }}>
                {label}
              </div>
              <div style={{ flex: 1, height: 3, background: '#0e1520', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 0, top: 0, height: '100%',
                  width: `${value}%`,
                  background: label === 'WARINESS' ? '#FF6B6B44' : `${accent}66`,
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{
                fontFamily: 'VT323, monospace',
                fontSize: '12px',
                color: '#5a8aaa',
                width: 28,
                textAlign: 'right',
                flexShrink: 0,
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Dismiss hint */}
        <div style={{
          fontFamily: 'VT323, monospace',
          fontSize: '12px',
          letterSpacing: '2px',
          color: '#4a6a84',
          lineHeight: 1.3,
          overflowWrap: 'anywhere',
        }}>
          [ ESC ] OR [ TAB ] CLOSE · [ E ] TO SPEAK
        </div>
      </div>
    </div>
  )
}
