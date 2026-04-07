// Procedural sound engine — Web Audio API only, no external files.
// All sounds are synthesised at runtime.

let ctx = null
let melodyScheduler = null
let melodyGain = null
let melodyRunning = false
let isMuted = false

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ── Utilities ──────────────────────────────────────────────────────────────

function sine(freq, duration, gainPeak = 0.15, startTime = 0) {
  const ac = getCtx()
  const t = ac.currentTime + startTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(gainPeak, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

function noiseClick(duration = 0.012, gainPeak = 0.04) {
  const ac = getCtx()
  const t = ac.currentTime
  const bufferSize = ac.sampleRate * duration
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

  const source = ac.createBufferSource()
  source.buffer = buffer

  const filter = ac.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 2400

  const gain = ac.createGain()
  gain.gain.setValueAtTime(gainPeak, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ac.destination)
  source.start(t)
}

// Schedules one pass of the melody and returns how long it will take (seconds)
function scheduleMelody() {
  const ac = getCtx()
  const NOTES = [261.6, 329.6, 392.0, 440.0, 392.0, 329.6, 293.7, 261.6]
  const BASE_DUR = 0.30
  const GAP = 0.05

  let t = ac.currentTime + 0.05
  NOTES.forEach((freq) => {
    // ~5% chance: skip note entirely (brief silence)
    if (Math.random() < 0.05) { t += BASE_DUR + GAP; return }

    // ~8% chance: cut note short
    const dur = Math.random() < 0.08 ? BASE_DUR * 0.45 : BASE_DUR

    // ~15% chance: corrupt pitch by ±12 cents
    const centsOff = Math.random() < 0.15 ? (Math.random() * 24 - 12) : 0
    const hz = freq * Math.pow(2, centsOff / 1200)

    const osc = ac.createOscillator()
    const env = ac.createGain()
    osc.connect(env)
    env.connect(melodyGain)
    osc.type = 'sine'
    osc.frequency.value = hz

    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(0.18, t + 0.02)
    env.gain.setValueAtTime(0.18, t + dur - 0.04)
    env.gain.linearRampToValueAtTime(0, t + dur)

    osc.start(t)
    osc.stop(t + dur + 0.02)
    t += BASE_DUR + GAP
  })

  return t - ac.currentTime
}

// ── Public API ─────────────────────────────────────────────────────────────

export const SFX = {
  // Typewriter tick — called per character
  tick() {
    if (Math.random() > 0.5) return  // skip ~half to reduce repetitiveness
    try { noiseClick(0.007, 0.01) } catch (_) {}
  },

  // Press E to interact with an NPC
  interact() {
    try {
      sine(440, 0.09, 0.12)
      sine(660, 0.07, 0.06, 0.04)
    } catch (_) {}
  },

  // Select a dialogue choice card
  select() {
    try {
      sine(520, 0.06, 0.1)
      sine(780, 0.12, 0.07, 0.03)
    } catch (_) {}
  },

  // Dialogue / panel close
  dismiss() {
    try {
      const ac = getCtx()
      const t = ac.currentTime
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(380, t)
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.18)
      gain.gain.setValueAtTime(0.08, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
      osc.start(t)
      osc.stop(t + 0.22)
    } catch (_) {}
  },

  // Scenario alert — single two-tone pulse (call repeatedly via CSS animation)
  alert() {
    try {
      sine(660, 0.08, 0.1)
      sine(880, 0.08, 0.08, 0.1)
    } catch (_) {}
  },

  // Start corrupted elevator muzak loop
  startAmbient() {
    if (melodyRunning) return
    try {
      const ac = getCtx()
      melodyGain = ac.createGain()
      melodyGain.gain.setValueAtTime(0, ac.currentTime)
      melodyGain.gain.linearRampToValueAtTime(isMuted ? 0 : 0.7, ac.currentTime + 1.5)
      melodyGain.connect(ac.destination)
      melodyRunning = true

      const loop = () => {
        const dur = scheduleMelody()
        melodyScheduler = setTimeout(loop, (dur - 0.05) * 1000)
      }
      loop()
    } catch (_) {}
  },

  stopAmbient() {
    if (!melodyRunning) return
    clearTimeout(melodyScheduler)
    melodyScheduler = null
    try {
      const ac = getCtx()
      melodyGain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.8)
      setTimeout(() => { melodyGain = null; melodyRunning = false }, 900)
    } catch (_) {}
  },

  mute() {
    isMuted = true
    if (melodyGain) {
      const ac = getCtx()
      melodyGain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3)
    }
  },

  unmute() {
    isMuted = false
    if (melodyGain) {
      const ac = getCtx()
      melodyGain.gain.linearRampToValueAtTime(0.7, ac.currentTime + 0.3)
    }
  },
}
