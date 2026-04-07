import { useEffect, useRef, useState } from 'react'
import { WATERCOOLER_NPCS, getAvailableOverhearLine } from '../../data/watercooler.js'
import { SFX } from '../../audio/soundEngine.js'

function useTypewriter(text, speed = 22, active = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayed('')
      setDone(false)
      return
    }

    if (!active) return

    setDisplayed('')
    setDone(false)
    let index = 0
    const id = setInterval(() => {
      index++
      setDisplayed(text.slice(0, index))
      SFX.tick()
      if (index >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)

    return () => clearInterval(id)
  }, [text, speed, active])

  return { displayed, done, setDisplayed, setDone }
}

export default function WatercoolerOverhear({
  week,
  rumorState,
  onDiscoverIntel,
  onApplyWariness,
}) {
  const [payload, setPayload] = useState(null)
  const [visible, setVisible] = useState(false)
  const [typewriterActive, setTypewriterActive] = useState(true)
  const discoveredRef = useRef(new Set())
  const dismissTimeoutRef = useRef(null)
  const text = payload?.line?.text || ''

  const { displayed, done, setDisplayed, setDone } = useTypewriter(text, 22, typewriterActive)

  useEffect(() => {
    const handleStart = (event) => {
      const wcNpcId = event.detail?.wcNpcId
      const npc = WATERCOOLER_NPCS.find(entry => entry.id === wcNpcId)
      const line = getAvailableOverhearLine(wcNpcId, week, rumorState)
      if (!npc || !line) {
        setVisible(false)
        setPayload(null)
        return
      }

      setTypewriterActive(true)
      setPayload({ npc, line, spotted: false })
      setVisible(true)
    }

    const handleSpotted = (event) => {
      setPayload(current => {
        if (!current || current.spotted) return current
        const interrupted = `${current.line.text}\n— (conversation stops)`
        setTypewriterActive(false)
        setDisplayed(interrupted)
        setDone(true)
        onApplyWariness(event.detail?.nearestStakeholderId)
        return { ...current, spotted: true }
      })
    }

    const handleEnd = () => {
      setVisible(false)
      setPayload(null)
      setTypewriterActive(true)
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current)
    }

    window.addEventListener('phaser:overhear_start', handleStart)
    window.addEventListener('phaser:overhear_spotted', handleSpotted)
    window.addEventListener('phaser:overhear_end', handleEnd)

    return () => {
      window.removeEventListener('phaser:overhear_start', handleStart)
      window.removeEventListener('phaser:overhear_spotted', handleSpotted)
      window.removeEventListener('phaser:overhear_end', handleEnd)
    }
  }, [onApplyWariness, rumorState, setDisplayed, setDone, week])

  useEffect(() => {
    if (!done || !payload?.line?.intelTag || payload.spotted) return
    if (discoveredRef.current.has(payload.line.intelTag)) return

    discoveredRef.current.add(payload.line.intelTag)
    onDiscoverIntel({
      intelTag: payload.line.intelTag,
      npcId: payload.npc.id,
      npcName: payload.npc.name,
      text: payload.line.text,
      stakeholderHint: payload.line.stakeholderHint,
    })

    dismissTimeoutRef.current = setTimeout(() => {
      setVisible(false)
      setPayload(null)
      setTypewriterActive(true)
    }, 5000)

    return () => {
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current)
    }
  }, [done, onDiscoverIntel, payload])

  if (!visible || !payload) return null

  return (
    <div className={`overhear-panel ${visible ? 'is-visible' : ''}`}>
      <div className="overhear-panel-title" style={{ color: payload.npc.hexColor }}>
        {payload.npc.name} (overheard):
      </div>
      <div className="overhear-panel-text">{displayed}</div>
    </div>
  )
}
