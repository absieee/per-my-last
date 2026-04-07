export default function CharacterHeader({ character }) {
  const { name, title, department, accentColor, transitioned, isSuccessor } = character
  return (
    <div style={{
      borderBottom: `1px solid ${accentColor}33`,
      padding: '14px 20px',
      background: `${accentColor}0d`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36,
          height: 36,
          background: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span className="font-vt323" style={{ fontSize: 18, color: '#04060e' }}>
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="font-syne" style={{ fontSize: 15, fontWeight: 700, color: accentColor }}>
              {name}
            </span>
            {isSuccessor && (
              <span className="font-vt323" style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                [NEW]
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 2 }}>
            {title} · {department}
          </div>
        </div>
      </div>
    </div>
  )
}
