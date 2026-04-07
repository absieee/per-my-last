import Phaser from 'phaser'
import { WATERCOOLER_NPCS } from '../data/watercooler.js'
import { SFX } from '../audio/soundEngine.js'

// Room boundaries:
//   Top-left  {x:0,   y:0,   w:500, h:320}  → center (250, 160)
//   Top-right {x:780, y:0,   w:500, h:320}  → center (1030, 160)
//   Bot-left  {x:0,   y:400, w:500, h:320}  → center (250, 560)
//   Bot-right {x:780, y:400, w:500, h:320}  → center (1030, 560)
// Characters placed at y-10 of room center so desk below sits visually centred.

const MAIN_NPCS = [
  { id: 'petra',  label: 'P', color: 0xFF6B6B, name: 'Petra',  x: 250,  y: 150, roomLabel: 'PRODUCT' },
  { id: 'callum', label: 'C', color: 0x4ECDC4, name: 'Callum', x: 1030, y: 150, roomLabel: 'LEGAL & COMPLIANCE' },
  { id: 'simone', label: 'S', color: 0xFFE66D, name: 'Simone', x: 250,  y: 550, roomLabel: 'ENGINEERING' },
  { id: 'marcus', label: 'M', color: 0xA29BFE, name: 'Marcus', x: 1030, y: 550, roomLabel: 'STRATEGIC COMMS' },
]

const INTERACTION_RADIUS    = 90
const WC_INTERACTION_RADIUS = 70
const OVERHEAR_RADIUS       = 200
const SPOTTED_RADIUS        = 110
const PLAYER_SPEED          = 160
const MIN_PLAYER_SPEED_MULTIPLIER = 0.68
const WATERCOOLER_X = 640
const WATERCOOLER_Y = 364

export default class OfficeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OfficeScene' })
    this.playerX = 640
    this.playerY = 360
    this.npcs = []
    this.nearbyNpc = null
    this.isPaused = false
    this.ePressedLastFrame = false
    this.tabPressedLastFrame = false
    this.playerSpeedMultiplier = 1
    this.outerRingEntryTime = null
    this.inOverhearZone = false
    this.inInnerRing = false
    this.overhearNpcId = null
    this.overhearSpotted = false
    this.lastPlayerX = this.playerX
    this.lastPlayerY = this.playerY
  }

  create() {
    this.drawOffice()
    this.createMainNPCs()
    this.createWatercoolerNPCs()
    this.createPlayer()
    this.createPetraHint()
    this.setupInput()
    this.setupWindowListeners()
  }

  drawOffice() {
    const g = this.add.graphics()
    const W = 1280, H = 720

    // Dark floor
    g.fillStyle(0x060a10, 1)
    g.fillRect(0, 0, W, H)

    // Grid
    g.lineStyle(1, 0x141e2e, 0.6)
    for (let x = 0; x <= W; x += 40) g.lineBetween(x, 0, x, H)
    for (let y = 0; y <= H; y += 40) g.lineBetween(0, y, W, y)

    // Corner room tints
    const rooms = [
      { x: 0,   y: 0,   w: 500, h: 320, color: 0xFF6B6B },
      { x: 780, y: 0,   w: 500, h: 320, color: 0x4ECDC4 },
      { x: 0,   y: 400, w: 500, h: 320, color: 0xFFE66D },
      { x: 780, y: 400, w: 500, h: 320, color: 0xA29BFE },
    ]
    rooms.forEach(r => {
      g.fillStyle(r.color, 0.03)
      g.fillRect(r.x, r.y, r.w, r.h)
      g.lineStyle(1, r.color, 0.15)
      g.strokeRect(r.x, r.y, r.w, r.h)
    })

    // Corridor dividers
    g.lineStyle(1, 0x1e2d42, 0.8)
    g.lineBetween(0, 360, W, 360)
    g.lineBetween(640, 0, 640, H)

    // Center crosshair for PM spawn
    g.lineStyle(1, 0xff9f43, 0.08)
    g.lineBetween(620, 360, 660, 360)
    g.lineBetween(640, 340, 640, 380)

    // Water cooler object at center of corridor
    g.fillStyle(0x1e3a5f, 0.6)
    g.fillRect(630, 350, 20, 28)
    g.lineStyle(1, 0x4a90d9, 0.3)
    g.strokeRect(630, 350, 20, 28)
    g.fillStyle(0x4a90d9, 0.5)
    g.fillRect(636, 370, 8, 6)

    // Room labels
    const ls = { fontFamily: 'VT323', fontSize: '12px' }
    const roomLabels = [
      { npcId: 'petra', x: 14, y: 12 },
      { npcId: 'callum', x: 790, y: 12 },
      { npcId: 'simone', x: 14, y: 706 },
      { npcId: 'marcus', x: 790, y: 706 },
    ]

    roomLabels.forEach(({ npcId, x, y }) => {
      const npc = MAIN_NPCS.find(({ id }) => id === npcId)
      if (!npc?.roomLabel) return
      this.add.text(x, y, npc.roomLabel, { ...ls, color: `#${npc.color.toString(16).padStart(6, '0')}` }).setAlpha(0.35)
    })
  }

  createMainNPCs() {
    const petraFirst = !window.__petraVisited

    const mainNpcs = MAIN_NPCS.map(npc => {
      const hexColor = '#' + npc.color.toString(16).padStart(6, '0')
      const isPetra = npc.id === 'petra'
      const hidden = petraFirst && !isPetra

      // Desk
      const desk = this.add.graphics()
      desk.fillStyle(0x111822, 1)
      desk.fillRect(npc.x - 32, npc.y + 18, 64, 18)
      desk.lineStyle(1, npc.color, 0.2)
      desk.strokeRect(npc.x - 32, npc.y + 18, 64, 18)

      // Character square
      const charG = this.add.graphics()
      charG.fillStyle(npc.color, 0.8)
      charG.fillRect(-9, -9, 18, 18)
      charG.lineStyle(1, npc.color, 1)
      charG.strokeRect(-9, -9, 18, 18)
      charG.setPosition(npc.x, npc.y)

      // Initial
      const labelText = this.add.text(npc.x, npc.y, npc.label, {
        fontFamily: 'VT323', fontSize: '14px', color: '#04060e',
      }).setOrigin(0.5, 0.5)

      // Proximity ring — Petra gets a brighter ring when she's the only character
      const ringOpacity = (isPetra && petraFirst) ? 0.25 : 0.05
      const ring = this.add.graphics()
      ring.lineStyle(1, npc.color, ringOpacity)
      ring.strokeCircle(npc.x, npc.y, INTERACTION_RADIUS)

      // Petra pulses faster when she's the only visible character
      const pulseDuration = (isPetra && petraFirst)
        ? 700 + Math.random() * 300
        : 1400 + Math.random() * 800

      this.tweens.add({
        targets: charG,
        alpha: { from: 0.8, to: 1.0 },
        duration: pulseDuration,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      })

      // Hide non-Petra characters until petra_intro is complete
      if (hidden) {
        charG.setAlpha(0)
        desk.setAlpha(0)
        labelText.setAlpha(0)
        ring.setAlpha(0)
      }

      return { ...npc, graphic: charG, desk, labelText, ring, hexColor, isWatercooler: false, radius: INTERACTION_RADIUS, hidden }
    })

    this.npcs.push(...mainNpcs)
  }

  createWatercoolerNPCs() {
    const wcNpcs = WATERCOOLER_NPCS.map(npc => {
      const hexColor = npc.hexColor

      // Smaller square — no desk
      const charG = this.add.graphics()
      charG.fillStyle(npc.color, 0.5)
      charG.fillRect(-10, -10, 20, 20)
      charG.lineStyle(1, npc.color, 0.6)
      charG.strokeRect(-10, -10, 20, 20)
      charG.setPosition(npc.x, npc.y)

      // Initial
      this.add.text(npc.x, npc.y, npc.label, {
        fontFamily: 'VT323', fontSize: '16px', color: '#04060e',
      }).setOrigin(0.5, 0.5)

      // Proximity ring
      const ring = this.add.graphics()
      ring.lineStyle(1, npc.color, 0.04)
      ring.strokeCircle(npc.x, npc.y, WC_INTERACTION_RADIUS)

      // Slower, subtler pulse
      this.tweens.add({
        targets: charG,
        alpha: { from: 0.45, to: 0.7 },
        duration: 2000 + Math.random() * 1000,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      })

      // Hide watercooler NPCs until Petra intro is done
      const hidden = !window.__petraVisited
      if (hidden) {
        charG.setAlpha(0)
        ring.setAlpha(0)
      }

      return { ...npc, graphic: charG, ring, isWatercooler: true, radius: WC_INTERACTION_RADIUS, hidden }
    })

    this.npcs.push(...wcNpcs)
  }

  createPlayer() {
    // Faint glow backdrop
    this.playerGlow = this.add.graphics()
    this.playerGlow.fillStyle(0xff9f43, 0.08)
    this.playerGlow.fillRect(-22, -8, 44, 16)
    this.playerGlow.setPosition(640, 360)

    // "THE PM" floating text
    this.playerText = this.add.text(640, 360, 'THE PM', {
      fontFamily: 'VT323',
      fontSize: '14px',
      color: '#ff9f43',
      letterSpacing: 3,
    }).setOrigin(0.5, 0.5)

    this.tweens.add({
      targets: [this.playerText, this.playerGlow],
      alpha: { from: 0.75, to: 1.0 },
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    })
  }

  createPetraHint() {
    if (window.__petraVisited) return
    // Stepped L-shaped arrow path: first go LEFT, then go UP into Petra's room
    const leftPoints = [
      { x: 570, y: 358 },
      { x: 490, y: 358 },
      { x: 410, y: 358 },
      { x: 330, y: 358 },
    ]
    const upPoints = [
      { x: 250, y: 295 },
      { x: 250, y: 225 },
      { x: 250, y: 165 },
    ]

    this.petraArrows = []

    const drawLeftArrow = (g, px, py) => {
      // Tip points left
      g.fillTriangle(px - 7, py, px + 4, py - 5, px + 4, py + 5)
    }

    const drawUpArrow = (g, px, py) => {
      // Tip points up
      g.fillTriangle(px, py - 7, px - 5, py + 4, px + 5, py + 4)
    }

    const allPoints = [
      ...leftPoints.map(p => ({ ...p, draw: drawLeftArrow })),
      ...upPoints.map(p => ({ ...p, draw: drawUpArrow })),
    ]

    allPoints.forEach(({ x, y, draw }, i) => {
      const g = this.add.graphics()
      g.fillStyle(0xFF6B6B, 1)
      draw(g, x, y)
      g.setAlpha(0)
      this.petraArrows.push(g)

      this.time.delayedCall(600 + i * 60, () => {
        this.tweens.add({
          targets: g,
          alpha: { from: 0.08, to: 0.35 },
          duration: 900,
          delay: i * 120,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      })
    })
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = {
      up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.eKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)
  }

  setupWindowListeners() {
    this._onPause  = () => { this.isPaused = true }
    this._onResume = () => { this.isPaused = false }
    this._onPetraVisited = () => {
      if (!this.petraArrows?.length) return
      this.tweens.killTweensOf(this.petraArrows)
      this.tweens.add({
        targets: this.petraArrows,
        alpha: 0,
        duration: 400,
        onComplete: () => {
          this.petraArrows.forEach(g => g?.destroy())
          this.petraArrows = []
        },
      })
    }
    this._onRevealCharacters = () => {
      this.npcs
        .filter(n => n.hidden && n.id !== 'petra')
        .forEach(npc => {
          const targets = [npc.graphic, npc.ring, npc.labelText, npc.desk].filter(Boolean)
          this.tweens.add({ targets, alpha: 1, duration: 600, ease: 'Sine.easeOut' })
          npc.hidden = false
        })
    }
    this._onFatigueUpdate = (e) => {
      const next = e.detail?.speedMultiplier
      if (typeof next === 'number') {
        this.playerSpeedMultiplier = Phaser.Math.Clamp(next, MIN_PLAYER_SPEED_MULTIPLIER, 1)
      }
    }
    window.addEventListener('phaser:pause',            this._onPause)
    window.addEventListener('phaser:resume',           this._onResume)
    window.addEventListener('phaser:petra_visited',    this._onPetraVisited)
    window.addEventListener('phaser:reveal_characters', this._onRevealCharacters)
    window.addEventListener('phaser:fatigue_update', this._onFatigueUpdate)
  }

  update(_time, delta) {
    if (this.isPaused) return

    const dt = delta / 1000
    let vx = 0, vy = 0
    const previousX = this.playerX
    const previousY = this.playerY

    const currentSpeed = PLAYER_SPEED * this.playerSpeedMultiplier

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  vx -= currentSpeed
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx += currentSpeed
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    vy -= currentSpeed
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  vy += currentSpeed

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707 }

    this.playerX = Phaser.Math.Clamp(this.playerX + vx * dt, 16, 1264)
    this.playerY = Phaser.Math.Clamp(this.playerY + vy * dt, 16, 704)
    this.playerText.setPosition(this.playerX, this.playerY)
    this.playerGlow.setPosition(this.playerX, this.playerY)

    const frameDx = this.playerX - previousX
    const frameDy = this.playerY - previousY
    const frameSpeed = Math.sqrt(frameDx * frameDx + frameDy * frameDy)
    const coolerDx = WATERCOOLER_X - this.playerX
    const coolerDy = WATERCOOLER_Y - this.playerY
    const coolerDistance = Math.sqrt(coolerDx * coolerDx + coolerDy * coolerDy)
    const inOuterRing = coolerDistance <= OVERHEAR_RADIUS
    const inInnerRing = coolerDistance <= SPOTTED_RADIUS

    if (inOuterRing && !this.inOverhearZone) {
      this.inOverhearZone = true
      this.outerRingEntryTime = _time
      this.overhearSpotted = false
      this.overhearNpcId = this.getNearestWatercoolerNpcId()
      if (this.overhearNpcId) {
        window.dispatchEvent(new CustomEvent('phaser:overhear_start', {
          detail: { wcNpcId: this.overhearNpcId },
        }))
      }
    }

    if (!inOuterRing && this.inOverhearZone) {
      this.inOverhearZone = false
      this.inInnerRing = false
      this.outerRingEntryTime = null
      this.overhearNpcId = null
      this.overhearSpotted = false
      window.dispatchEvent(new CustomEvent('phaser:overhear_end'))
    }

    if (this.inOverhearZone && inInnerRing && !this.inInnerRing && !this.overhearSpotted) {
      const timeInOuterRing = _time - (this.outerRingEntryTime || _time)
      if (timeInOuterRing < 2000 || frameSpeed > 4) {
        this.overhearSpotted = true
        window.dispatchEvent(new CustomEvent('phaser:overhear_spotted', {
          detail: { nearestStakeholderId: this.getNearestStakeholderId() },
        }))
      }
    }

    this.inInnerRing = inInnerRing
    this.lastPlayerX = this.playerX
    this.lastPlayerY = this.playerY

    // Proximity — each NPC has its own radius; skip hidden characters entirely
    let closest = null
    let closestDist = Infinity
    this.npcs.forEach(npc => {
      if (npc.hidden) return

      const dx = npc.x - this.playerX
      const dy = npc.y - this.playerY
      const dist = Math.sqrt(dx * dx + dy * dy)

      npc.ring.clear()
      if (dist < npc.radius * 1.5) {
        const alpha = Math.max(0, 0.3 - (dist / (npc.radius * 1.5)) * 0.3)
        npc.ring.lineStyle(1, npc.color, alpha)
        npc.ring.strokeCircle(npc.x, npc.y, npc.radius)
      }

      if (dist < npc.radius && dist < closestDist) {
        closestDist = dist
        closest = npc
      }
    })

    if (closest !== this.nearbyNpc) {
      this.nearbyNpc = closest
      window.dispatchEvent(new CustomEvent('phaser:proximity', {
        detail: closest
          ? {
              characterId:   closest.id,
              characterName: closest.name,
              accentColor:   closest.hexColor,
              isWatercooler: closest.isWatercooler,
            }
          : null,
      }))
    }

    const eDown = this.eKey.isDown
    if (eDown && !this.ePressedLastFrame && this.nearbyNpc) {
      SFX.interact()
      window.dispatchEvent(new CustomEvent('phaser:interact', {
        detail: {
          characterId:   this.nearbyNpc.id,
          isWatercooler: this.nearbyNpc.isWatercooler,
        },
      }))
    }
    this.ePressedLastFrame = eDown

    const tabDown = this.tabKey.isDown
    if (tabDown && !this.tabPressedLastFrame && this.nearbyNpc && !this.nearbyNpc.isWatercooler) {
      window.dispatchEvent(new CustomEvent('phaser:dossier', {
        detail: { characterId: this.nearbyNpc.id },
      }))
    }
    this.tabPressedLastFrame = tabDown
  }

  shutdown() {
    window.removeEventListener('phaser:pause',             this._onPause)
    window.removeEventListener('phaser:resume',            this._onResume)
    window.removeEventListener('phaser:petra_visited',     this._onPetraVisited)
    window.removeEventListener('phaser:reveal_characters', this._onRevealCharacters)
    window.removeEventListener('phaser:fatigue_update', this._onFatigueUpdate)
  }

  getNearestWatercoolerNpcId() {
    const visibleWatercoolerNpcs = this.npcs.filter(npc => npc.isWatercooler && !npc.hidden)
    if (!visibleWatercoolerNpcs.length) return null

    return visibleWatercoolerNpcs
      .slice()
      .sort((a, b) => {
        const distA = Phaser.Math.Distance.Between(a.x, a.y, this.playerX, this.playerY)
        const distB = Phaser.Math.Distance.Between(b.x, b.y, this.playerX, this.playerY)
        return distA - distB
      })[0]?.id || null
  }

  getNearestStakeholderId() {
    const visibleStakeholders = this.npcs.filter(npc => !npc.isWatercooler && !npc.hidden)
    if (!visibleStakeholders.length) return null

    return visibleStakeholders
      .slice()
      .sort((a, b) => {
        const distA = Phaser.Math.Distance.Between(a.x, a.y, this.playerX, this.playerY)
        const distB = Phaser.Math.Distance.Between(b.x, b.y, this.playerX, this.playerY)
        return distA - distB
      })[0]?.id || null
  }
}
