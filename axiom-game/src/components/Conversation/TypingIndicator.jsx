export default function TypingIndicator({ accentColor }) {
  return (
    <div className="fade-up" style={{ display: 'flex', gap: 5, padding: '12px 0', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            background: accentColor || 'var(--text-sec)',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
