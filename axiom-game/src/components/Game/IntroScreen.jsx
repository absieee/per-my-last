import { useState, useEffect, useRef } from 'react'

const MONO = 'VT323, monospace'
const SANS = 'Josefin Sans, sans-serif'

function NameEntryScreen({ onNext }) {
  const [name, setName] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleConfirm = () => {
    const trimmed = name.trim()
    if (trimmed) onNext(trimmed)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm()
  }

  return (
    <div style={{ maxWidth: 480, width: '100%', animation: 'fadeUp 0.4s ease forwards' }}>
      <div style={{
        fontFamily: MONO,
        fontSize: '12px',
        letterSpacing: '4px',
        color: '#ff9f43',
        opacity: 0.5,
        marginBottom: 20,
        textAlign: 'center',
      }}>
        AXIOM COLLECTIVE · PERSONNEL INTAKE
      </div>

      <div style={{
        border: '1px solid #1e2d42',
        background: 'rgba(6,10,18,0.9)',
        padding: '32px 36px',
      }}>
        <div style={{
          fontFamily: MONO,
          fontSize: '13px',
          letterSpacing: '3px',
          color: '#5a8aaa',
          marginBottom: 20,
        }}>
          IDENTIFY YOURSELF
        </div>

        <input
          ref={inputRef}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={32}
          placeholder="enter name"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #2a3a4e',
            color: '#c4d4e4',
            fontFamily: MONO,
            fontSize: '22px',
            letterSpacing: '3px',
            padding: '8px 0',
            outline: 'none',
            caretColor: '#ff9f43',
          }}
        />

        <div style={{
          marginTop: 10,
          fontFamily: MONO,
          fontSize: '11px',
          letterSpacing: '2px',
          color: '#2a3a4e',
        }}>
          This name will appear in your personnel file.
        </div>
      </div>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleConfirm}
          disabled={!name.trim()}
          className={name.trim() ? 'btn-crt' : undefined}
          style={{
            fontSize: '16px',
            letterSpacing: '4px',
            padding: '12px 44px',
            cursor: name.trim() ? 'pointer' : 'default',
            fontFamily: MONO,
            ...(!name.trim() && {
              background: 'transparent',
              border: '1px solid #1a2535',
              color: '#2a3a4e',
            }),
          }}
        >
          CONFIRM
        </button>
      </div>
    </div>
  )
}

function EmailScreen({ playerName, onNext }) {
  return (
    <div style={{ maxWidth: 580, width: '100%', animation: 'fadeUp 0.4s ease forwards' }}>
      <div style={{
        border: '1px solid #1e2d42',
        background: 'rgba(6,10,18,0.9)',
        padding: '32px 36px',
      }}>
        {/* Header fields */}
        <div style={{ marginBottom: 20 }}>
          {[
            { label: 'FROM',    value: 'people@axiom-collective.com' },
            { label: 'TO',      value: playerName },
            { label: 'SUBJECT', value: 'Your assignment — Project Meridian' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: MONO, fontSize: '14px', letterSpacing: '2px',
                color: '#ff9f43', opacity: 0.55, width: 68, flexShrink: 0,
              }}>{label}</span>
              <span style={{
                fontFamily: MONO, fontSize: '14px', letterSpacing: '1px',
                color: label === 'TO' ? '#c4d4e4' : '#5a7090',
                overflowWrap: 'anywhere',
              }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1a2535', marginBottom: 24 }} />

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontFamily: SANS, fontSize: '15px', color: '#c4d4e4', lineHeight: 1.7, margin: 0 }}>
            Effective immediately, you are appointed Interim Product Manager, Project Meridian.
          </p>
          <p style={{ fontFamily: SANS, fontSize: '15px', color: '#8a9aae', lineHeight: 1.7, margin: 0 }}>
            Your objective: deliver the Q3 stakeholder review without incident.
          </p>
          <p style={{ fontFamily: SANS, fontSize: '15px', color: '#5a7090', lineHeight: 1.7, margin: 0 }}>
            Week 8. Board room. Investors, board members, and your four key stakeholders in the room.
            You will present Meridian&apos;s product status. The room either believes the story you&apos;ve
            told them, or it doesn&apos;t.
          </p>
          <p style={{ fontFamily: SANS, fontSize: '15px', color: '#c4d4e4', lineHeight: 1.7, margin: 0 }}>
            That is what &quot;without incident&quot; means.
          </p>
          <p style={{ fontFamily: SANS, fontSize: '15px', color: '#5a7090', lineHeight: 1.7, margin: 0 }}>
            Your team has been briefed.<br />
            They are watching.
          </p>
          <p style={{ fontFamily: MONO, fontSize: '15px', letterSpacing: '1px', color: '#5a7090', margin: 0, marginTop: 8 }}>
            — Petra Holloway, CPO
          </p>
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
        <button onClick={onNext} className="btn-crt" style={{ fontSize: '16px', letterSpacing: '4px', padding: '12px 44px' }}>
          ACKNOWLEDGED
        </button>
      </div>
    </div>
  )
}

function ControlsScreen({ onComplete }) {
  const controls = [
    { keys: 'WASD / ARROW KEYS', desc: 'Move around the floor' },
    { keys: 'E',                  desc: 'Interact with a character' },
    { keys: 'ESC',               desc: 'Pause / close dialog' },
  ]

  return (
    <div style={{ maxWidth: 580, width: '100%', animation: 'fadeUp 0.4s ease forwards' }}>
      <div style={{
        fontFamily: MONO, fontSize: '22px', letterSpacing: '6px',
        color: '#ff9f43', opacity: 0.8, marginBottom: 32, textAlign: 'center',
      }}>
        HOW TO PLAY
      </div>

      <div style={{
        border: '1px solid #1e2d42',
        background: 'rgba(6,10,18,0.9)',
        padding: '28px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {controls.map(({ keys, desc }) => (
          <div key={keys} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: MONO, fontSize: '18px', letterSpacing: '2px',
              color: '#ff9f43', opacity: 0.7, width: 220, maxWidth: '100%', flexShrink: 0,
            }}>{keys}</span>
            <span style={{
              fontFamily: SANS, fontSize: '17px', color: '#8a9aae', letterSpacing: '0.04em',
              overflowWrap: 'anywhere',
            }}>{desc}</span>
          </div>
        ))}

        <div style={{
          marginTop: 8,
          fontFamily: MONO, fontSize: '13px', letterSpacing: '2px',
          color: '#4a6080',
        }}>
          ⚠ There is no mouse navigation.
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
        <button onClick={onComplete} className="btn-crt" style={{ fontSize: '16px', letterSpacing: '4px', padding: '12px 44px' }}>
          START
        </button>
      </div>
    </div>
  )
}

export default function IntroScreen({ onComplete }) {
  const [slide, setSlide] = useState(0)
  const [playerName, setPlayerName] = useState('')
  const [exiting, setExiting] = useState(false)

  const goTo = (next) => {
    setExiting(true)
    setTimeout(() => {
      setSlide(next)
      setExiting(false)
    }, 300)
  }

  const handleNameConfirm = (name) => {
    setPlayerName(name)
    goTo(1)
  }

  const handleAcknowledged = () => goTo(2)

  const handleStart = () => {
    setExiting(true)
    setTimeout(() => onComplete(playerName), 400)
  }

  // Enter key on controls screen
  useEffect(() => {
    if (slide !== 2) return
    const handler = (e) => { if (e.key === 'Enter') handleStart() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [slide])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 500,
      background: '#04060e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(20px, 5vw, 60px) clamp(12px, 6vw, 80px)',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 0.3s ease',
      overflowY: 'auto',
    }}>
      {/* Scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
        pointerEvents: 'none',
      }} />

      <div key={slide}>
        {slide === 0 && <NameEntryScreen onNext={handleNameConfirm} />}
        {slide === 1 && <EmailScreen playerName={playerName} onNext={handleAcknowledged} />}
        {slide === 2 && <ControlsScreen onComplete={handleStart} />}
      </div>
    </div>
  )
}
