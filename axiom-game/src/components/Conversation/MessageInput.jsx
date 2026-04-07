import { useState, useRef } from 'react'

export default function MessageInput({ onSend, disabled, accentColor }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      padding: '12px 16px',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-end',
      background: 'var(--surface)',
    }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? 'Awaiting response…' : 'Type your message…'}
        rows={2}
        style={{
          flex: 1,
          background: 'var(--surface-up)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          fontFamily: 'Josefin Sans, sans-serif',
          fontSize: 13,
          padding: '8px 10px',
          resize: 'none',
          outline: 'none',
          lineHeight: 1.5,
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = accentColor || 'var(--text-sec)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      <button
        className="btn-crt"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        style={{ height: 'fit-content' }}
      >
        SEND
      </button>
    </div>
  )
}
