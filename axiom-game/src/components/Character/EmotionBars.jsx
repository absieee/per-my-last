import { useRef, useEffect } from 'react'

const AXES = [
  { key: 'trust',    label: 'TRUST',    high: 'Trusts you',    mid: 'Cautious',    low: "Arm's length" },
  { key: 'respect',  label: 'RESPECT',  high: 'Respects you',  mid: 'Professional', low: 'Dismissive' },
  { key: 'wariness', label: 'WARINESS', high: 'Wary',          mid: 'Watchful',     low: 'Relaxed', invert: true },
  { key: 'loyalty',  label: 'LOYALTY',  high: 'Loyal',         mid: 'Neutral',      low: 'Disengaged' },
]

function getLabel(val, axis) {
  if (axis.invert) {
    if (val >= 70) return axis.high
    if (val >= 30) return axis.mid
    return axis.low
  }
  if (val >= 70) return axis.high
  if (val >= 30) return axis.mid
  return axis.low
}

function BarRow({ axis, value, accentColor }) {
  const barRef = useRef(null)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current !== value && barRef.current) {
      barRef.current.classList.remove('bar-pulse')
      void barRef.current.offsetWidth // reflow
      barRef.current.classList.add('bar-pulse')
    }
    prevValue.current = value
  }, [value])

  const qualLabel = getLabel(value, axis)
  const fillColor = axis.invert
    ? value >= 70 ? 'var(--alert)' : value >= 30 ? 'var(--text-sec)' : accentColor
    : value >= 70 ? accentColor : value >= 30 ? 'var(--text-sec)' : 'var(--text-muted)'

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="font-vt323" style={{ fontSize: 13, color: 'var(--text-sec)', letterSpacing: '0.08em' }}>
          {axis.label}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-sec)', fontFamily: 'Josefin Sans' }}>
          {qualLabel}
        </span>
      </div>
      <div style={{ height: 3, background: 'var(--border)', position: 'relative' }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: `${value}%`,
            background: fillColor,
            transition: 'width 0.6s ease, background 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}

export default function EmotionBars({ emotion, accentColor }) {
  return (
    <div style={{ padding: '12px 16px' }}>
      {AXES.map(axis => (
        <BarRow key={axis.key} axis={axis} value={emotion[axis.key]} accentColor={accentColor} />
      ))}
    </div>
  )
}
