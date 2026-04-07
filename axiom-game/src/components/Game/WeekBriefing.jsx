import { useEffect, useState } from 'react'

function NotificationCard({ name, accentColor, message, timestamp, delay, visible }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [visible, delay])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '10px 14px',
      background: '#080c18',
      border: `1px solid ${accentColor}22`,
      borderLeft: `2px solid ${accentColor}`,
      width: 'min(300px, calc(100vw - 32px))',
      opacity: show ? 1 : 0,
      transform: show ? 'translateX(0)' : 'translateX(32px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      pointerEvents: 'auto',
    }}>
      {/* Colour dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: accentColor,
        marginTop: 5,
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{
            fontFamily: 'VT323, monospace',
            fontSize: '14px',
            letterSpacing: '2px',
            color: accentColor,
          }}>
            {name?.toLowerCase()}
          </span>
          <span style={{
            fontFamily: 'VT323, monospace',
            fontSize: '12px',
            letterSpacing: '1px',
            color: '#2a3a4e',
          }}>
            {timestamp}
          </span>
        </div>
        <div style={{
          fontFamily: 'Josefin Sans, sans-serif',
          fontSize: '12px',
          color: '#6b7a99',
          lineHeight: 1.5,
        }}>
          "{message}"
        </div>
      </div>
    </div>
  )
}

export default function WeekBriefing({ week, messages, onDismiss }) {
  const lastDelay = messages.length > 0 ? messages[messages.length - 1].delay : 0
  const [allVisible, setAllVisible] = useState(false)

  // Show dismiss hint only after all messages have animated in
  useEffect(() => {
    const t = setTimeout(() => setAllVisible(true), lastDelay + 400)
    return () => clearTimeout(t)
  }, [lastDelay])

  useEffect(() => {
    if (!allVisible) return
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onDismiss, allVisible])

  return (
    <div
      onClick={allVisible ? onDismiss : undefined}
      style={{
        position: 'fixed',
        bottom: 80,
        right: 24,
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'flex-end',
        pointerEvents: allVisible ? 'auto' : 'none',
        cursor: allVisible ? 'pointer' : 'default',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      {/* Week header */}
      <div style={{
        fontFamily: 'VT323, monospace',
        fontSize: '11px',
        letterSpacing: '3px',
        color: '#2a3a4e',
        marginBottom: 4,
        opacity: 1,
        transition: 'opacity 0.3s ease',
        textAlign: 'right',
      }}>
        WEEK {week} — END OF DAY
      </div>

      {messages.map((msg, i) => (
        <NotificationCard
          key={msg.characterId + i}
          name={msg.name}
          accentColor={msg.accentColor}
          message={msg.message}
          timestamp={msg.timestamp}
          delay={msg.delay}
          visible={true}
        />
      ))}

      <div style={{
        fontFamily: 'VT323, monospace',
        fontSize: '13px',
        letterSpacing: '2px',
        color: allVisible ? '#3a5a7a' : 'transparent',
        marginTop: 4,
        transition: 'color 0.4s ease',
        textAlign: 'right',
      }}>
        CLICK OR PRESS SPACE TO CONTINUE
      </div>
    </div>
  )
}
