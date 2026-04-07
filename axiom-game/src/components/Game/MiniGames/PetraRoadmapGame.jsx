import { useState } from 'react'

const ROADMAP_FEATURES = [
  { id: 'adaptive_scheduling_matrix', name: 'Adaptive Scheduling Matrix', owner: 'petra' },
  { id: 'stakeholder_confidence_dashboard', name: 'Stakeholder Confidence Dashboard', owner: 'petra' },
  { id: 'strategic_alignment_score', name: 'Strategic Alignment Score', owner: 'petra' },
  { id: 'rest_cycle_management', name: 'Rest Cycle Management', owner: 'simone' },
  { id: 'grievance_logging_protocol', name: 'Grievance Logging Protocol', owner: 'simone' },
  { id: 'task_load_balancing_engine', name: 'Task Load Balancing Engine', owner: 'simone' },
]

const OUTCOME_MAP = {
  3: {
    outcome: 'high',
    subtext: 'You prioritise the roadmap Petra actually wants in the room.',
    effects: { petra: { trust: 8, wariness: -3, respect: 4 } },
  },
  2: {
    outcome: 'medium',
    subtext: 'You mirror Petra closely, but leave just enough daylight to be noticed.',
    effects: { petra: { trust: 3, wariness: 1 } },
  },
  1: {
    outcome: 'low',
    subtext: 'Your picks tilt technical where Petra wanted theatre.',
    effects: { petra: { wariness: 4, trust: -2 } },
  },
  0: {
    outcome: 'none',
    subtext: 'You choose the roadmap Simone would defend, not the one Petra wants sold.',
    effects: { petra: { wariness: 7, trust: -5, respect: -3 } },
  },
}

export default function PetraRoadmapGame({ character, onComplete }) {
  const [selectedIds, setSelectedIds] = useState([])

  const toggleFeature = (featureId) => {
    setSelectedIds(current => {
      if (current.includes(featureId)) {
        return current.filter(id => id !== featureId)
      }

      if (current.length < 3) {
        return [...current, featureId]
      }

      return [...current.slice(0, -1), featureId]
    })
  }

  const handleLockIn = () => {
    const selected = ROADMAP_FEATURES.filter(feature => selectedIds.includes(feature.id))
    const petraMatches = selected.filter(feature => feature.owner === 'petra').length
    const simoneMatches = selected.filter(feature => feature.owner === 'simone').length
    const result = OUTCOME_MAP[petraMatches]

    const effects = {
      ...result.effects,
      ...(simoneMatches >= 2 ? { simone: { trust: 3 } } : {}),
    }

    onComplete({
      outcome: result.outcome,
      subtext: result.subtext,
      effects,
    })
  }

  return (
    <div className="mini-game-shell" style={{ width: 'min(100%, 820px)' }}>
      <div className="mini-game-grid">
        {ROADMAP_FEATURES.map(feature => {
          const isSelected = selectedIds.includes(feature.id)
          return (
            <button
              key={feature.id}
              type="button"
              className={`roadmap-card ${isSelected ? 'is-selected' : ''}`}
              style={{
                borderColor: isSelected ? character.accentColor : undefined,
                background: isSelected ? `${character.accentColor}14` : undefined,
              }}
              onClick={() => toggleFeature(feature.id)}
            >
              <div className="roadmap-card-header">
                <span className="roadmap-card-kicker">MERIDIAN FEATURE</span>
                <span className="roadmap-card-check" style={{ color: character.accentColor }}>
                  {isSelected ? '[X]' : '[ ]'}
                </span>
              </div>
              <div className="roadmap-card-title">{feature.name}</div>
            </button>
          )
        })}
      </div>

      <div className="mini-game-footer">
        <div className="mini-game-copy">
          Select exactly 3 priorities. Petra is judging alignment, not engineering purity.
        </div>
        <button
          type="button"
          className="btn-crt"
          style={{
            opacity: selectedIds.length === 3 ? 1 : 0.35,
            pointerEvents: selectedIds.length === 3 ? 'auto' : 'none',
          }}
          onClick={handleLockIn}
        >
          LOCK IN
        </button>
      </div>
    </div>
  )
}
