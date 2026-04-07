import DecisionFlow from './DecisionFlow.jsx'

export default function OpticsReport({ report, decisionLog }) {
  // Handle both old string format and new { text, archetype } format
  const text = typeof report === 'string' ? report : report?.text
  const archetype = typeof report === 'object' ? report?.archetype : null
  const secretEnding = typeof report === 'object' ? report?.secretEnding : null

  const sections = text?.split('\n\n').filter(Boolean) || []

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg)',
      zIndex: 300,
      overflowY: 'auto',
      padding: '60px 0',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
          <div className="font-vt323" style={{ fontSize: 13, color: 'var(--text-sec)', letterSpacing: '0.15em', marginBottom: 8 }}>
            AXIOM COLLECTIVE · INTERNAL
          </div>
          <h1 className="font-syne" style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            PM Performance<br />Optics Report
          </h1>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, fontFamily: 'Josefin Sans' }}>
            Project Meridian · Confidential · Not for distribution
          </div>
        </div>

        {/* Archetype verdict banner */}
        {archetype && (
          <div style={{
            marginBottom: 40,
            padding: '24px 28px',
            border: `1px solid ${archetype.color}44`,
            borderLeft: `3px solid ${archetype.color}`,
            background: `${archetype.color}08`,
          }}>
            <div className="font-vt323" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              color: archetype.color,
              marginBottom: 10,
              opacity: 0.7,
            }}>
              COMMITTEE VERDICT
            </div>
            <div className="font-syne" style={{
              fontSize: 18,
              fontWeight: 800,
              color: archetype.color,
              letterSpacing: '0.05em',
              marginBottom: 12,
            }}>
              {archetype.title}
            </div>
            <div style={{
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: 13,
              color: 'var(--text-sec)',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}>
              {archetype.verdict}
            </div>
          </div>
        )}

        {secretEnding && (
          <div style={{
            marginBottom: 40,
            padding: '20px 28px',
            border: `1px solid ${secretEnding.color}44`,
            borderLeft: `3px solid ${secretEnding.color}`,
            background: `${secretEnding.color}08`,
          }}>
            <div className="font-vt323" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              color: secretEnding.color,
              marginBottom: 10,
              opacity: 0.8,
            }}>
              HIDDEN ENDING UNLOCKED
            </div>
            <div className="font-syne" style={{
              fontSize: 18,
              fontWeight: 800,
              color: secretEnding.color,
              letterSpacing: '0.03em',
              marginBottom: 10,
            }}>
              {secretEnding.title}
            </div>
            <div style={{
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: 13,
              color: 'var(--text-sec)',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}>
              {secretEnding.verdict}
            </div>
          </div>
        )}

        {/* Report body */}
        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 20, lineHeight: 1.8, fontSize: 13, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
            {section}
          </div>
        ))}

        {/* Decision Flow */}
        {decisionLog?.length > 0 && (
          <div style={{ marginTop: 48, borderTop: '1px solid var(--border)', paddingTop: 32 }}>
            <div className="font-syne" style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-warm)', letterSpacing: '0.15em', marginBottom: 20 }}>
              DECISION FLOW
            </div>
            <DecisionFlow decisionLog={decisionLog} />
          </div>
        )}

        {/* Final spacer */}
        <div style={{ height: 80 }} />
      </div>
    </div>
  )
}
