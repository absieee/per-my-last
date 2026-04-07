export default function InteractionPrompt({ characterName, accentColor, isWatercooler }) {
  if (!characterName) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 64,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 50,
      animation: 'fadeUp 0.25s ease forwards',
      pointerEvents: 'none',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      width: 'min(520px, calc(100vw - 24px))',
    }}>
      <div style={{
        border: `1px solid ${accentColor}55`,
        padding: '9px 28px',
        background: 'rgba(4, 6, 14, 0.88)',
        fontFamily: 'VT323',
        fontSize: '16px',
        letterSpacing: '3px',
        color: accentColor,
        width: '100%',
        textAlign: 'center',
        lineHeight: 1.2,
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
      }}>
        [ E ] SPEAK TO {characterName.toUpperCase()}
      </div>
      {!isWatercooler && (
        <div style={{
          fontFamily: 'VT323',
          fontSize: '12px',
          letterSpacing: '2px',
          color: `${accentColor}55`,
          textAlign: 'center',
          whiteSpace: 'normal',
        }}>
          [ TAB ] PROFILE
        </div>
      )}
    </div>
  )
}
