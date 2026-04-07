import { CAST } from '../../data/cast.js'

const SCENARIO_CHOICES = {
  scenario_1: ['COMPLY & COVER', 'REDIRECT', 'PUSH BACK'],
  scenario_2: ['FULL DISCLOSURE', 'TECHNICALITY', 'SPIN & COMPLY'],
  scenario_3: ['DENY', 'REDIRECT', 'GO DARK'],
  scenario_4: ['LISTEN', 'ESCALATE', 'HOLD STEADY'],
}

const SCENARIO_LABELS = {
  scenario_1: 'Roadmap Revision',
  scenario_2: 'Transparency Filing',
  scenario_3: 'Comms Incident',
  scenario_4: 'The Simone Question',
}

const SENDERS = {
  scenario_1: 'petra',
  scenario_2: 'callum',
  scenario_3: 'marcus',
  scenario_4: 'simone',
}

const COL_WIDTH = 200
const COL_GAP = 60
const NODE_H = 44
const BRANCH_OFFSET = [0, 60, 120]

export default function DecisionFlow({ decisionLog }) {
  const scenarios = Object.keys(SCENARIO_CHOICES)
  const totalW = scenarios.length * COL_WIDTH + (scenarios.length - 1) * COL_GAP
  const totalH = 320

  const getDecision = (scenarioId) => decisionLog.find(d => d.scenarioId === scenarioId)

  return (
    <div style={{ overflowX: 'auto', padding: '20px 0' }}>
      <svg width={totalW} height={totalH} style={{ display: 'block', margin: '0 auto' }}>
        {scenarios.map((sid, colIdx) => {
          const decision = getDecision(sid)
          const choices = SCENARIO_CHOICES[sid]
          const sender = CAST.find(c => c.id === SENDERS[sid])
          const accentColor = sender?.accentColor || 'var(--text-sec)'
          const x = colIdx * (COL_WIDTH + COL_GAP)
          const nodeY = 20

          return (
            <g key={sid}>
              {/* Scenario node */}
              <rect x={x} y={nodeY} width={COL_WIDTH} height={NODE_H}
                fill={`${accentColor}18`} stroke={accentColor} strokeWidth={1} />
              <text x={x + COL_WIDTH / 2} y={nodeY + 14} textAnchor="middle"
                fontFamily="VT323, monospace" fontSize={13} fill={accentColor} letterSpacing="0.06em">
                {SCENARIO_LABELS[sid]?.toUpperCase()}
              </text>
              <text x={x + COL_WIDTH / 2} y={nodeY + 30} textAnchor="middle"
                fontFamily="Josefin Sans, sans-serif" fontSize={9} fill="var(--text-sec)">
                {sender?.shortName?.toUpperCase()}
              </text>

              {/* Branch lines and choice nodes */}
              {choices.map((choiceLabel, ci) => {
                const chosen = decision?.choiceLabel === choiceLabel
                const branchY = nodeY + NODE_H + 40 + ci * 70
                const lineColor = chosen ? '#ff9f43' : '#2d3550'
                const lineWidth = chosen ? 2 : 1
                const nodeBg = chosen ? 'rgba(255,159,67,0.12)' : 'var(--surface-up)'
                const nodeBorder = chosen ? '#ff9f43' : '#1a1f2e'
                const textColor = chosen ? '#ff9f43' : '#2d3550'

                return (
                  <g key={ci}>
                    {/* Line from scenario node to choice */}
                    <line
                      x1={x + COL_WIDTH / 2} y1={nodeY + NODE_H}
                      x2={x + COL_WIDTH / 2} y2={branchY}
                      stroke={lineColor} strokeWidth={lineWidth}
                      strokeDasharray={chosen ? 'none' : '3 3'}
                    />
                    {/* Choice node */}
                    <rect x={x + 10} y={branchY} width={COL_WIDTH - 20} height={36}
                      fill={nodeBg} stroke={nodeBorder} strokeWidth={1} />
                    <text x={x + COL_WIDTH / 2} y={branchY + 14} textAnchor="middle"
                      fontFamily="VT323, monospace" fontSize={12} fill={textColor} letterSpacing="0.05em">
                      {choiceLabel}
                    </text>
                    {chosen && decision?.outcome && (
                      <text x={x + COL_WIDTH / 2} y={branchY + 28} textAnchor="middle"
                        fontFamily="Josefin Sans, sans-serif" fontSize={8} fill="var(--text-sec)">
                        {decision.outcome.slice(0, 32)}{decision.outcome.length > 32 ? '…' : ''}
                      </text>
                    )}
                    {/* Transition marker */}
                    {chosen && decision?.triggersSimoneReturn && (
                      <text x={x + COL_WIDTH / 2} y={branchY + 50} textAnchor="middle"
                        fontFamily="VT323, monospace" fontSize={10} fill="var(--alert)" letterSpacing="0.05em">
                        ↩ RETURNED
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Connector to next scenario */}
              {colIdx < scenarios.length - 1 && decision && (
                <line
                  x1={x + COL_WIDTH} y1={nodeY + NODE_H / 2}
                  x2={x + COL_WIDTH + COL_GAP} y2={nodeY + NODE_H / 2}
                  stroke="#ff9f43" strokeWidth={1.5}
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
