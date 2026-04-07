import { useRef, useEffect } from 'react'
import CharacterHeader from '../Character/CharacterHeader.jsx'
import EmotionBars from '../Character/EmotionBars.jsx'
import MessageBubble from '../Conversation/MessageBubble.jsx'
import TypingIndicator from '../Conversation/TypingIndicator.jsx'
import MessageInput from '../Conversation/MessageInput.jsx'

function WelcomeScreen() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      textAlign: 'center',
    }}>
      <div className="font-vt323" style={{ fontSize: 48, color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: 16 }}>
        AXIOM
      </div>
      <div className="font-syne" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
        Project Meridian
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-sec)', maxWidth: 360, lineHeight: 1.8, marginBottom: 24 }}>
        You are the PM. Select a stakeholder to begin.
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: 320, lineHeight: 1.7 }}>
        "In AI product management, communication and optics matter more than technical correctness."
      </div>
    </div>
  )
}

export default function MainPanel({ character, isTyping, onSend }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [character?.chatHistory?.length, isTyping])

  if (!character) return (
    <div className="main-panel" style={{ borderLeft: '1px solid var(--border)' }}>
      <WelcomeScreen />
    </div>
  )

  return (
    <div className="main-panel" style={{ borderLeft: '1px solid var(--border)' }}>
      <CharacterHeader character={character} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Conversation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {character.chatHistory.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', paddingTop: 40 }}>
                Begin the conversation.
              </div>
            )}
            {character.chatHistory.map((msg, i) => (
              <MessageBubble key={i} message={msg} accentColor={character.accentColor} />
            ))}
            {isTyping && <TypingIndicator accentColor={character.accentColor} />}
          </div>
          <MessageInput
            onSend={onSend}
            disabled={isTyping}
            accentColor={character.accentColor}
          />
        </div>

        {/* Emotion sidebar */}
        <div style={{ width: 220, borderLeft: '1px solid var(--border)', background: 'var(--surface)', overflowY: 'auto' }}>
          <div className="font-vt323" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em', padding: '10px 16px 4px' }}>
            RELATIONSHIP
          </div>
          <EmotionBars emotion={character.emotion} accentColor={character.accentColor} />
        </div>
      </div>
    </div>
  )
}
