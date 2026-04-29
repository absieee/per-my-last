import Phaser from 'phaser'
import { WATERCOOLER_NPCS } from '../data/watercooler.js'
import { SFX } from '../audio/soundEngine.js'
import { buildOfficeTilemap, MAP_COLS, MAP_ROWS, ROOM_BOUNDS, TILE_IDS, TILE_SIZE } from './officeTilemap.js'

function isSolidStructureTile(tileId) {
  return tileId === TILE_IDS.wall || tileId === TILE_IDS.divider
}

function isWallTile(tileId) {
  return tileId === TILE_IDS.wall
}

const FRAME_W = 24
const FRAME_H = 32
const FRAME_COLS = 4

const INTERACTION_RADIUS = 90
const WC_INTERACTION_RADIUS = 70
const OVERHEAR_RADIUS = 200
const SPOTTED_RADIUS = 110
const PLAYER_SPEED = 160
const MIN_PLAYER_SPEED_MULTIPLIER = 0.68
const PATROL_SPEED = 34
/** If an NPC cannot get closer to its patrol target for this long, skip ahead (e.g. player blocking the waypoint). */
const PATROL_STUCK_MS = 2800
const PLAYER_AVOID_RADIUS = 126
const ALLIANCE_ROUTE_DURATION = 9000
const WATERCOOLER_X = 640
const WATERCOOLER_Y = 364

// Simone's whiteboard focus position — used for both decor placement and focus_spot route
const SIMONE_WHITEBOARD_POS = { x: 376, y: 416 }

const DIRECTIONS = ['down', 'left', 'right', 'up']

const ROOM_SPECS = [
  { id: 'product', ownerId: 'petra', x: 0, y: 0, w: 500, h: 320, color: 0xFF6B6B, floorKey: 'floor-product', label: 'PRODUCT', labelX: 14, labelY: 12 },
  { id: 'legal', ownerId: 'callum', x: 780, y: 0, w: 500, h: 320, color: 0x4ECDC4, floorKey: 'floor-legal', label: 'LEGAL', labelX: 790, labelY: 12 },
  { id: 'engineering', ownerId: 'simone', x: 0, y: 400, w: 500, h: 320, color: 0xFFE66D, floorKey: 'floor-engineering', label: 'ENGINEERING', labelX: 14, labelY: 706 },
  { id: 'comms', ownerId: 'marcus', x: 780, y: 400, w: 500, h: 320, color: 0xA29BFE, floorKey: 'floor-comms', label: 'STRATEGIC COMMS', labelX: 790, labelY: 706 },
]

const MAIN_NPCS = [
  {
    id: 'petra',
    name: 'Petra',
    color: 0xFF6B6B,
    textureKey: 'sheet-petra',
    posture: 'blazer',
    x: 250,
    y: 146,
    roomId: 'product',
    deskPos: { x: 210, y: 162 },
    patrol: [{ x: 250, y: 146 }, { x: 320, y: 146 }, { x: 320, y: 222 }, { x: 220, y: 222 }],
  },
  {
    id: 'callum',
    name: 'Callum',
    color: 0x4ECDC4,
    textureKey: 'sheet-callum',
    posture: 'papers',
    x: 1030,
    y: 146,
    roomId: 'legal',
    deskPos: { x: 990, y: 162 },
    patrol: [{ x: 1030, y: 146 }, { x: 1110, y: 146 }, { x: 1110, y: 228 }, { x: 970, y: 228 }],
  },
  {
    id: 'simone',
    name: 'Simone',
    color: 0xFFE66D,
    textureKey: 'sheet-simone',
    posture: 'tablet',
    x: 250,
    y: 546,
    roomId: 'engineering',
    deskPos: { x: 210, y: 562 },
    patrol: [{ x: 250, y: 546 }, { x: 340, y: 546 }, { x: 340, y: 612 }, { x: 200, y: 612 }],
  },
  {
    id: 'marcus',
    name: 'Marcus',
    color: 0xA29BFE,
    textureKey: 'sheet-marcus',
    posture: 'phone',
    x: 1030,
    y: 546,
    roomId: 'comms',
    deskPos: { x: 990, y: 562 },
    patrol: [{ x: 1030, y: 546 }, { x: 1120, y: 546 }, { x: 1120, y: 612 }, { x: 980, y: 612 }],
  },
]

/** In-room patrol loops near each office's corridor door (no shared hallway). */
const ALLIANCE_INROOM_ROUTES = {
  'callum-petra': {
    petra: [{ x: 400, y: 168 }, { x: 452, y: 168 }, { x: 452, y: 208 }, { x: 392, y: 208 }],
    callum: [{ x: 808, y: 168 }, { x: 884, y: 168 }, { x: 884, y: 208 }, { x: 800, y: 208 }],
  },
  'marcus-petra': {
    petra: [{ x: 400, y: 168 }, { x: 452, y: 168 }, { x: 452, y: 208 }, { x: 392, y: 208 }],
    marcus: [{ x: 988, y: 472 }, { x: 1108, y: 472 }, { x: 1108, y: 520 }, { x: 968, y: 520 }],
  },
  'petra-simone': {
    petra: [{ x: 400, y: 168 }, { x: 452, y: 168 }, { x: 452, y: 208 }, { x: 392, y: 208 }],
    simone: [{ x: 232, y: 472 }, { x: 332, y: 472 }, { x: 332, y: 524 }, { x: 208, y: 524 }],
  },
  'callum-marcus': {
    callum: [{ x: 808, y: 168 }, { x: 884, y: 168 }, { x: 884, y: 208 }, { x: 800, y: 208 }],
    marcus: [{ x: 988, y: 472 }, { x: 1108, y: 472 }, { x: 1108, y: 520 }, { x: 968, y: 520 }],
  },
  'callum-simone': {
    callum: [{ x: 808, y: 168 }, { x: 884, y: 168 }, { x: 884, y: 208 }, { x: 800, y: 208 }],
    simone: [{ x: 232, y: 472 }, { x: 332, y: 472 }, { x: 332, y: 524 }, { x: 208, y: 524 }],
  },
  'marcus-simone': {
    marcus: [{ x: 988, y: 472 }, { x: 1108, y: 472 }, { x: 1108, y: 520 }, { x: 968, y: 520 }],
    simone: [{ x: 232, y: 472 }, { x: 332, y: 472 }, { x: 332, y: 524 }, { x: 208, y: 524 }],
  },
}

function hex(colorInt) {
  return `#${colorInt.toString(16).padStart(6, '0')}`
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function blendTint(a, b, t) {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return (r << 16) | (g << 8) | bl
}

function animationKey(textureKey, mode, direction) {
  return `${textureKey}-${mode}-${direction}`
}

function frameTextureKey(textureKey, direction, phase) {
  return `${textureKey}-${direction}-${phase}`
}

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
    this.npcWorldState = { week: 1, npcStates: {}, alliances: [] }
    this.activeAllianceRoutes = []
    this.lastBehaviorRefreshAt = 0
    this.playerDirection = 'down'
    this.lastWallBumpAt = 0
  }

  create() {
    this.createGeneratedTextures()
    this.createAnimations()
    this.drawOffice()
    this.addRoomAtmosphere()
    this.createMainNPCs()
    this.createWatercoolerNPCs()
    this.createPlayer()
    this.setupInput()
    this.setupWindowListeners()
    this.allianceGraphics = this.add.graphics().setDepth(29)
    this.syncNpcBehaviors()
  }

  createGeneratedTextures() {
    this.createTilesetTexture()
    this.createFloorTexture('floor-corridor', 0x101622, 0x182234, 0x0d1320)
    this.createFloorTexture('floor-product', 0x1b1518, 0x2a1a1f, 0x150e11)
    this.createFloorTexture('floor-legal', 0x11191a, 0x152629, 0x0c1314)
    this.createFloorTexture('floor-engineering', 0x1a1a16, 0x29281c, 0x12110d)
    this.createFloorTexture('floor-comms', 0x171520, 0x231f33, 0x120f1a)

    this.createDeskTexture('desk-product', 0xff6b6b)
    this.createDeskTexture('desk-legal', 0x4ECDC4)
    this.createDeskTexture('desk-engineering', 0xFFE66D)
    this.createDeskTexture('desk-comms', 0xA29BFE)
    this.createDeskTexture('desk-neutral', 0x5a7090)

    this.createGlassPanelTexture()
    this.createWhiteboardTexture()
    this.createServerRackTexture()
    this.createBookshelfTexture()
    this.createCouchTexture()
    this.createPosterTexture()
    this.createWatercoolerTexture()
    this.createMonitorTexture()
    this.createPrinterTexture()
    this.createMeetingTableTexture()
    this.createChairTexture()
    this.createCoffeeTableTexture()
    this.createCabinetTexture()
    this.createNoticeBoardTexture()
    this.createFridgeTexture()
    this.createSnackCounterTexture()

    this.createCharacterFrames('sheet-petra', 0xFF6B6B, 'blazer')
    this.createCharacterFrames('sheet-callum', 0x4ECDC4, 'papers')
    this.createCharacterFrames('sheet-simone', 0xFFE66D, 'tablet')
    this.createCharacterFrames('sheet-marcus', 0xA29BFE, 'phone')
    this.createCharacterFrames('sheet-player', 0xff9f43, 'player')
    this.createCharacterFrames('sheet-watercooler', 0x81ecec, 'generic')
  }

  createTilesetTexture() {
    if (this.textures.exists('office-tileset')) return
    const texture = this.textures.createCanvas('office-tileset', TILE_SIZE * 9, TILE_SIZE)
    const ctx = texture.getContext()
    const paintTile = (index, drawFn) => {
      const ox = index * TILE_SIZE
      ctx.save()
      ctx.translate(ox, 0)
      drawFn(ctx)
      ctx.restore()
    }
    const fillRect = (ctx, x, y, w, h, color, alpha = 1) => {
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
      ctx.globalAlpha = 1
    }

    paintTile(TILE_IDS.corridorFloor, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#101622')
      fillRect(ctx, 0, 0, TILE_SIZE, 2, '#182234', 0.45)
      fillRect(ctx, 0, 0, 2, TILE_SIZE, '#182234', 0.45)
      fillRect(ctx, 8, 8, 4, 4, '#0d1320', 0.5)
      fillRect(ctx, 20, 18, 5, 5, '#0d1320', 0.5)
    })
    paintTile(TILE_IDS.productFloor, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#1b1518')
      fillRect(ctx, 0, 0, TILE_SIZE, 2, '#2a1a1f', 0.45)
      fillRect(ctx, 0, 0, 2, TILE_SIZE, '#2a1a1f', 0.45)
      fillRect(ctx, 18, 8, 6, 6, '#4a1f26', 0.3)
    })
    paintTile(TILE_IDS.legalFloor, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#11191a')
      fillRect(ctx, 0, 0, TILE_SIZE, 2, '#152629', 0.45)
      fillRect(ctx, 0, 0, 2, TILE_SIZE, '#152629', 0.45)
      fillRect(ctx, 8, 18, 10, 4, '#254144', 0.3)
    })
    paintTile(TILE_IDS.engineeringFloor, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#1a1a16')
      fillRect(ctx, 0, 0, TILE_SIZE, 2, '#29281c', 0.45)
      fillRect(ctx, 0, 0, 2, TILE_SIZE, '#29281c', 0.45)
      fillRect(ctx, 18, 16, 8, 6, '#384536', 0.3)
    })
    paintTile(TILE_IDS.commsFloor, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#171520')
      fillRect(ctx, 0, 0, TILE_SIZE, 2, '#231f33', 0.45)
      fillRect(ctx, 0, 0, 2, TILE_SIZE, '#231f33', 0.45)
      fillRect(ctx, 10, 18, 12, 4, '#3a3150', 0.3)
    })
    paintTile(TILE_IDS.wall, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#1a2030')
      fillRect(ctx, 0, 0, TILE_SIZE, 3, '#344560', 0.7)
      fillRect(ctx, 0, 3, TILE_SIZE, 2, '#222d40', 0.8)
      fillRect(ctx, 0, 0, 1, TILE_SIZE, '#0d121a', 0.5)
      fillRect(ctx, TILE_SIZE - 1, 0, 1, TILE_SIZE, '#0d121a', 0.5)
    })
    paintTile(TILE_IDS.divider, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#1c2535')
      fillRect(ctx, 14, 0, 3, TILE_SIZE, '#2e3d52', 0.8)
      fillRect(ctx, 0, 12, TILE_SIZE, 2, '#253040', 0.6)
    })
    paintTile(TILE_IDS.glass, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#0b121c', 0.7)
      fillRect(ctx, 2, 2, TILE_SIZE - 4, TILE_SIZE - 4, '#8ecaff', 0.08)
      fillRect(ctx, 15, 0, 2, TILE_SIZE, '#9dc8e8', 0.2)
    })
    paintTile(TILE_IDS.ceiling, (ctx) => {
      fillRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#101622', 0)
      fillRect(ctx, 2, 4, TILE_SIZE - 4, 3, '#dfe8ef', 0.35)
      fillRect(ctx, 6, 8, TILE_SIZE - 12, 2, '#7ef7ff', 0.15)
    })
    texture.refresh()
  }

  createFloorTexture(key, base, stripe, detail) {
    if (this.textures.exists(key)) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(base, 1)
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
    g.fillStyle(stripe, 0.55)
    g.fillRect(0, 0, TILE_SIZE, 4)
    g.fillRect(0, 0, 4, TILE_SIZE)
    g.fillStyle(detail, 0.7)
    g.fillRect(8, 8, 4, 4)
    g.fillRect(20, 18, 5, 5)
    g.lineStyle(1, 0x243247, 0.22)
    g.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
    g.generateTexture(key, TILE_SIZE, TILE_SIZE)
    g.destroy()
  }

  createDeskTexture(key, accent) {
    if (this.textures.exists(key)) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x111822, 1)
    g.fillRect(0, 0, 80, 36)
    g.fillStyle(0x182334, 1)
    g.fillRect(4, 4, 72, 14)
    g.fillStyle(accent, 0.18)
    g.fillRect(4, 19, 72, 13)
    g.lineStyle(2, accent, 0.3)
    g.strokeRect(0, 0, 80, 36)
    g.generateTexture(key, 80, 36)
    g.destroy()
  }

  createGlassPanelTexture() {
    if (this.textures.exists('glass-panel')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x0b121c, 0.7)
    g.fillRect(0, 0, 64, 64)
    g.fillStyle(0x8ecaff, 0.08)
    g.fillRect(4, 4, 56, 56)
    g.lineStyle(2, 0x9dc8e8, 0.18)
    g.strokeRect(2, 2, 60, 60)
    g.lineStyle(1, 0x9dc8e8, 0.12)
    g.lineBetween(32, 0, 32, 64)
    g.generateTexture('glass-panel', 64, 64)
    g.destroy()
  }

  createWhiteboardTexture() {
    if (this.textures.exists('whiteboard')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x1d2430, 1)
    g.fillRect(0, 0, 96, 64)
    g.fillStyle(0xcfd7dc, 1)
    g.fillRect(4, 4, 88, 56)
    g.lineStyle(2, 0x5f6b80, 0.6)
    g.strokeRect(4, 4, 88, 56)
    g.lineStyle(2, 0xff6b6b, 0.6)
    g.lineBetween(14, 18, 76, 18)
    g.lineStyle(2, 0x4ECDC4, 0.5)
    g.lineBetween(16, 30, 62, 42)
    g.lineStyle(2, 0xFFE66D, 0.5)
    g.lineBetween(18, 48, 70, 48)
    g.generateTexture('whiteboard', 96, 64)
    g.destroy()
  }

  createServerRackTexture() {
    if (this.textures.exists('server-rack')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x11161f, 1)
    g.fillRect(0, 0, 48, 80)
    g.lineStyle(2, 0x31435f, 0.7)
    g.strokeRect(0, 0, 48, 80)
    for (let y = 8; y < 72; y += 12) {
      g.fillStyle(0x1c2838, 1)
      g.fillRect(6, y, 36, 8)
      g.fillStyle(0x4ECDC4, 0.45)
      g.fillRect(10, y + 2, 8, 4)
      g.fillStyle(0xFFE66D, 0.35)
      g.fillRect(22, y + 2, 4, 4)
    }
    g.generateTexture('server-rack', 48, 80)
    g.destroy()
  }

  createBookshelfTexture() {
    if (this.textures.exists('bookshelf')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x1d1714, 1)
    g.fillRect(0, 0, 64, 72)
    g.lineStyle(2, 0x5d4b40, 0.7)
    g.strokeRect(0, 0, 64, 72)
    ;[12, 34, 56].forEach(y => g.fillRect(4, y, 56, 3))
    for (let x = 8; x < 52; x += 8) {
      g.fillStyle(0x8a7f70 + ((x % 3) * 0x111111), 1)
      g.fillRect(x, 6, 5, 20)
    }
    g.fillStyle(0x4ECDC4, 0.4)
    g.fillRect(10, 39, 10, 13)
    g.fillStyle(0xFF6B6B, 0.4)
    g.fillRect(24, 39, 7, 13)
    g.fillStyle(0xA29BFE, 0.4)
    g.fillRect(35, 39, 8, 13)
    g.generateTexture('bookshelf', 64, 72)
    g.destroy()
  }

  createCouchTexture() {
    if (this.textures.exists('couch')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x2d2540, 1)
    g.fillRect(0, 16, 72, 28)
    g.fillRect(4, 8, 64, 16)
    g.fillStyle(0x3f3458, 1)
    g.fillRect(6, 14, 60, 8)
    g.lineStyle(2, 0xA29BFE, 0.2)
    g.strokeRect(0, 16, 72, 28)
    g.generateTexture('couch', 72, 44)
    g.destroy()
  }

  createPosterTexture() {
    if (this.textures.exists('vision-poster')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x1f1620, 1)
    g.fillRect(0, 0, 48, 64)
    g.lineStyle(2, 0xFF6B6B, 0.3)
    g.strokeRect(0, 0, 48, 64)
    g.fillStyle(0xff9f43, 0.25)
    g.fillRect(8, 10, 32, 8)
    g.fillStyle(0xFF6B6B, 0.25)
    g.fillRect(8, 26, 24, 6)
    g.fillRect(8, 38, 20, 6)
    g.generateTexture('vision-poster', 48, 64)
    g.destroy()
  }

  createWatercoolerTexture() {
    if (this.textures.exists('watercooler')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x1b2a3f, 1)
    g.fillRect(0, 0, 28, 42)
    g.fillStyle(0x4a90d9, 0.55)
    g.fillRect(6, 6, 16, 16)
    g.fillStyle(0x182334, 1)
    g.fillRect(4, 24, 20, 10)
    g.fillStyle(0x74b9ff, 0.7)
    g.fillRect(9, 34, 4, 4)
    g.fillStyle(0xff6b6b, 0.7)
    g.fillRect(15, 34, 4, 4)
    g.generateTexture('watercooler', 28, 42)
    g.destroy()
  }


  createPrinterTexture() {
    if (this.textures.exists('printer')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x202833, 1)
    g.fillRect(0, 8, 40, 24)
    g.fillStyle(0xd7dee4, 0.9)
    g.fillRect(6, 0, 28, 14)
    g.fillStyle(0x91a3b6, 0.8)
    g.fillRect(9, 4, 22, 6)
    g.fillStyle(0x4ECDC4, 0.45)
    g.fillRect(26, 18, 6, 4)
    g.lineStyle(2, 0x4b5968, 0.7)
    g.strokeRect(0, 8, 40, 24)
    g.generateTexture('printer', 40, 32)
    g.destroy()
  }

  createMeetingTableTexture() {
    if (this.textures.exists('meeting-table')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x1a202b, 1)
    g.fillRect(0, 0, 104, 52)
    g.fillStyle(0x273142, 1)
    g.fillRect(8, 8, 88, 36)
    g.lineStyle(2, 0x50617d, 0.6)
    g.strokeRect(2, 2, 100, 48)
    g.fillStyle(0xff9f43, 0.18)
    g.fillRect(18, 18, 24, 14)
    g.fillStyle(0x4ECDC4, 0.18)
    g.fillRect(62, 18, 24, 14)
    g.generateTexture('meeting-table', 104, 52)
    g.destroy()
  }

  createChairTexture() {
    if (this.textures.exists('chair')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x344055, 1)
    g.fillRect(4, 2, 16, 8)
    g.fillRect(6, 10, 12, 8)
    g.fillStyle(0x1e2633, 1)
    g.fillRect(10, 18, 4, 6)
    g.fillRect(7, 23, 2, 3)
    g.fillRect(15, 23, 2, 3)
    g.generateTexture('chair', 24, 26)
    g.destroy()
  }

  createCoffeeTableTexture() {
    if (this.textures.exists('coffee-table')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x1f2732, 1)
    g.fillRect(0, 4, 52, 20)
    g.fillStyle(0x2d3949, 1)
    g.fillRect(4, 0, 44, 8)
    g.fillStyle(0xA29BFE, 0.18)
    g.fillRect(12, 8, 10, 8)
    g.fillStyle(0xff9f43, 0.18)
    g.fillRect(30, 8, 10, 8)
    g.generateTexture('coffee-table', 52, 24)
    g.destroy()
  }

  createCabinetTexture() {
    if (this.textures.exists('cabinet')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x2a313a, 1)
    g.fillRect(0, 0, 36, 52)
    g.fillStyle(0x394351, 1)
    g.fillRect(4, 4, 28, 12)
    g.fillRect(4, 20, 28, 12)
    g.fillRect(4, 36, 28, 12)
    g.fillStyle(0xd8dde3, 0.45)
    g.fillRect(25, 10, 4, 2)
    g.fillRect(25, 26, 4, 2)
    g.fillRect(25, 42, 4, 2)
    g.generateTexture('cabinet', 36, 52)
    g.destroy()
  }

  createNoticeBoardTexture() {
    if (this.textures.exists('notice-board')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x372a20, 1)
    g.fillRect(0, 0, 76, 54)
    g.fillStyle(0x5a4537, 1)
    g.fillRect(4, 4, 68, 46)
    g.fillStyle(0xded3c0, 0.9)
    g.fillRect(10, 8, 16, 12)
    g.fillRect(30, 10, 18, 14)
    g.fillRect(52, 8, 10, 10)
    g.fillStyle(0xe84393, 0.55)
    g.fillRect(14, 24, 14, 10)
    g.fillStyle(0x81ecec, 0.55)
    g.fillRect(34, 28, 20, 10)
    g.fillStyle(0xfdcb6e, 0.55)
    g.fillRect(56, 26, 10, 12)
    g.generateTexture('notice-board', 76, 54)
    g.destroy()
  }

  createFridgeTexture() {
    if (this.textures.exists('fridge')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0xcfd7de, 1)
    g.fillRect(0, 0, 36, 60)
    g.fillStyle(0xa9b7c6, 1)
    g.fillRect(0, 28, 36, 2)
    g.fillStyle(0x7ef7ff, 0.25)
    g.fillRect(4, 6, 28, 14)
    g.fillStyle(0x58697a, 0.8)
    g.fillRect(28, 10, 2, 8)
    g.fillRect(28, 38, 2, 10)
    g.generateTexture('fridge', 36, 60)
    g.destroy()
  }

  createSnackCounterTexture() {
    if (this.textures.exists('snack-counter')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x1d2330, 1)
    g.fillRect(0, 10, 64, 22)
    g.fillStyle(0x364253, 1)
    g.fillRect(0, 0, 64, 12)
    g.fillStyle(0xfdcb6e, 0.35)
    g.fillRect(8, 2, 10, 6)
    g.fillStyle(0x55efc4, 0.35)
    g.fillRect(24, 2, 8, 6)
    g.fillStyle(0xff6b6b, 0.35)
    g.fillRect(38, 2, 12, 6)
    g.generateTexture('snack-counter', 64, 32)
    g.destroy()
  }

  createMonitorTexture() {
    if (this.textures.exists('monitor')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x0f141c, 1)
    g.fillRect(0, 0, 34, 24)
    g.fillStyle(0x7ef7ff, 0.3)
    g.fillRect(4, 4, 26, 14)
    g.fillStyle(0x1f2a38, 1)
    g.fillRect(14, 24, 6, 5)
    g.fillRect(10, 29, 14, 3)
    g.generateTexture('monitor', 34, 32)
    g.destroy()
  }

  createCharacterFrames(key, accent, posture) {
    DIRECTIONS.forEach(direction => {
      for (let phase = 0; phase < FRAME_COLS; phase++) {
        const textureKey = frameTextureKey(key, direction, phase)
        if (this.textures.exists(textureKey)) continue
        const texture = this.textures.createCanvas(textureKey, FRAME_W, FRAME_H)
        const ctx = texture.getContext()
        this.drawCharacterFrame(ctx, key, accent, posture, direction, phase)
        texture.refresh()
      }
    })

    // Desk idle frames (phases 0 and 1 only — used when NPC is seated at desk)
    const hasDesk = key !== 'sheet-watercooler' && key !== 'sheet-player'
    if (hasDesk) {
      for (let phase = 0; phase < 2; phase++) {
        const textureKey = frameTextureKey(key, 'desk', phase)
        if (this.textures.exists(textureKey)) continue
        const texture = this.textures.createCanvas(textureKey, FRAME_W, FRAME_H)
        const ctx = texture.getContext()
        this.drawDeskIdleFrame(ctx, key, accent, posture, phase)
        texture.refresh()
      }
    }
  }

  drawCharacterFrame(ctx, key, accent, posture, direction, phase) {
    ctx.clearRect(0, 0, FRAME_W, FRAME_H)

    // Watercooler NPCs stay monochrome — they're incidental characters
    if (key === 'sheet-watercooler') {
      const a = hex(accent)
      const fill = (x, y, w, h, color, alpha = 1) => {
        ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1
      }
      const isIdle = phase <= 1
      const legShift = isIdle ? (phase === 1 ? 1 : 0) : (phase === 2 ? -1 : 1)
      const armShift = isIdle ? (phase === 1 ? -1 : 0) : (phase === 2 ? 2 : -2)
      fill(8, 2, 8, 8, a); fill(7, 10, 10, 10, a)
      fill(6, 12 + Math.max(0, armShift), 2, 7, a)
      fill(17, 12 + Math.max(0, -armShift), 2, 7, a)
      fill(9, 21, 3, 8, a); fill(13, 21, 3, 8, a)
      fill(9 + legShift, 28, 3, 2, a, 0.5)
      return
    }

    // Per-character appearance: skin, hair, legs, shoes
    const LOOKS = {
      'sheet-petra':  { skin: '#c9896a', hair: '#140608', legs: '#18101e', shoes: '#300808' },
      'sheet-callum': { skin: '#d4aa82', hair: '#2a1a0a', legs: '#24242e', shoes: '#14100a' },
      'sheet-simone': { skin: '#b0bcb8', hair: '#222230', legs: '#10101a', shoes: '#1c1c24' },
      'sheet-marcus': { skin: '#7a4828', hair: '#120c06', legs: '#16121e', shoes: '#281606' },
      'sheet-player': { skin: '#c49a72', hair: '#1a1208', legs: '#1a1e2c', shoes: '#141414' },
    }
    const looks = LOOKS[key] ?? LOOKS['sheet-player']
    const accentHex = hex(accent)

    const fill = (x, y, w, h, color, alpha = 1) => {
      ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1
    }

    const isIdle = phase <= 1
    const legShift = isIdle ? (phase === 1 ? 1 : 0) : (phase === 2 ? -1 : 1)
    const armShift = isIdle ? (phase === 1 ? -1 : 0) : (phase === 2 ? 2 : -2)
    const bodyLean = posture === 'phone' ? 1 : posture === 'papers' ? -1 : 0
    const shoulderWidth = posture === 'blazer' ? 12 : posture === 'player' ? 11 : 10
    const headX = direction === 'left' ? 7 : direction === 'right' ? 9 : 8
    const headW = direction === 'left' || direction === 'right' ? 7 : 8
    const bodyX = 12 - Math.floor(shoulderWidth / 2) + bodyLean
    const armLeftX = bodyX - 1 + (direction === 'left' ? -1 : 0)
    const armRightX = bodyX + shoulderWidth - 1 + (direction === 'right' ? 1 : 0)
    const accessoryOnFront = direction === 'down' || direction === 'up'

    // Hair — drawn first so skin renders over the face area
    if (direction === 'down') {
      fill(headX - 1, 0, headW + 2, 3, looks.hair)   // top strip + side peeks
      fill(headX - 1, 3, 2, 4, looks.hair)            // left side
      fill(headX + headW - 1, 3, 2, 4, looks.hair)    // right side
    } else if (direction === 'up') {
      fill(headX - 1, 0, headW + 2, 9, looks.hair)   // full back of head
    } else {
      fill(headX, 0, headW, 2, looks.hair)             // top strip
      const backX = direction === 'left' ? headX + headW - 2 : headX
      fill(backX, 1, 3, 6, looks.hair)                 // hair at back of profile
    }

    // Head — skin tone over hair
    fill(headX, 2, headW, 8, looks.skin)
    // Eyes
    fill(headX + 2, 4, 1, 1, '#0a0808', 0.9)
    fill(headX + headW - 3, 4, 1, 1, '#0a0808', 0.9)
    // Subtle brow highlight
    fill(headX + 1, 3, 2, 1, '#ffffff', 0.07)

    // Torso — accent color (the character's domain color)
    fill(bodyX, 10, shoulderWidth, 11, accentHex)

    // Arms — accent (sleeves match outfit)
    fill(armLeftX, 12 + Math.max(0, armShift), 2, 8, accentHex)
    fill(armRightX, 12 + Math.max(0, -armShift), 2, 8, accentHex)

    // Legs — distinct trouser color
    fill(bodyX + 1 + legShift, 21, 3, 7, looks.legs)
    fill(bodyX + shoulderWidth - 4 - legShift, 21, 3, 7, looks.legs)

    // Shoes — small accent block
    fill(bodyX + 1 + legShift, 28, 3, 2, looks.shoes)
    fill(bodyX + shoulderWidth - 4 - legShift, 28, 3, 2, looks.shoes)

    // Posture accessories
    if (posture === 'blazer') {
      // Lapel Vs on blazer
      fill(bodyX + 4, 10, 1, 6, '#ffffff', 0.22)
      fill(bodyX + shoulderWidth - 5, 10, 1, 6, '#ffffff', 0.22)
    } else if (posture === 'papers') {
      fill(direction === 'left' ? armLeftX - 2 : armRightX + 1, 15, 4, 6, '#c9d1d9', 0.8)
    } else if (posture === 'tablet') {
      fill(bodyX + 2, accessoryOnFront ? 14 : 15, 6, 6, '#7ef7ff', 0.7)
    } else if (posture === 'phone') {
      fill(direction === 'left' ? armLeftX - 1 : armRightX + 1, 13, 2, 6, '#c9d1d9', 0.7)
    } else if (posture === 'player') {
      fill(bodyX + 3, 13, 4, 4, '#ff9f43', 0.55)
    }

    // Body edge shadows
    fill(headX - 1, 3, 1, 6, '#04060e', 0.4)
    fill(headX + headW, 3, 1, 6, '#04060e', 0.4)
    fill(bodyX - 1, 11, 1, 10, '#04060e', 0.35)
    fill(bodyX + shoulderWidth, 11, 1, 10, '#04060e', 0.35)
  }

  drawDeskIdleFrame(ctx, key, accent, posture, phase) {
    ctx.clearRect(0, 0, FRAME_W, FRAME_H)

    const LOOKS = {
      'sheet-petra':  { skin: '#c9896a', hair: '#140608', legs: '#18101e' },
      'sheet-callum': { skin: '#d4aa82', hair: '#2a1a0a', legs: '#24242e' },
      'sheet-simone': { skin: '#b0bcb8', hair: '#222230', legs: '#10101a' },
      'sheet-marcus': { skin: '#7a4828', hair: '#120c06', legs: '#16121e' },
    }
    const looks = LOOKS[key] ?? LOOKS['sheet-petra']
    const accentHex = hex(accent)

    const fill = (x, y, w, h, color, alpha = 1) => {
      ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1
    }

    const shoulderWidth = posture === 'blazer' ? 12 : 10
    const bodyX = 12 - Math.floor(shoulderWidth / 2)
    const headX = 8
    const headW = 8
    const headY = phase === 1 ? 4 : 3  // phase 1: slight lean forward

    // Hair — top strip visible above face
    fill(headX - 1, headY - 2, headW + 2, 3, looks.hair)
    fill(headX - 1, headY + 1, 2, 4, looks.hair)
    fill(headX + headW - 1, headY + 1, 2, 4, looks.hair)

    // Head (skin)
    fill(headX, headY, headW, 8, looks.skin)
    fill(headX + 2, headY + 3, 1, 1, '#0a0808', 0.75)
    fill(headX + headW - 3, headY + 3, 1, 1, '#0a0808', 0.75)
    fill(headX - 1, headY + 1, 1, 6, '#04060e', 0.4)
    fill(headX + headW, headY + 1, 1, 6, '#04060e', 0.4)

    // Torso (accent)
    fill(bodyX, headY + 9, shoulderWidth, 8, accentHex)
    fill(bodyX - 1, headY + 10, 1, 7, '#04060e', 0.35)
    fill(bodyX + shoulderWidth, headY + 10, 1, 7, '#04060e', 0.35)

    // Posture accessories
    if (posture === 'blazer') {
      fill(bodyX + 4, headY + 9, 1, 5, '#ffffff', 0.2)
      fill(bodyX + shoulderWidth - 5, headY + 9, 1, 5, '#ffffff', 0.2)
    } else if (posture === 'papers') {
      fill(bodyX + shoulderWidth + 1, headY + 14, 5, 4, '#c9d1d9', 0.75)
    } else if (posture === 'tablet') {
      fill(bodyX + 1, headY + 12, 7, 5, '#7ef7ff', 0.7)
    } else if (posture === 'phone') {
      fill(bodyX + shoulderWidth + 1, headY + 12, 2, 5, '#c9d1d9', 0.7)
    }

    // Arms on desk
    const armY = headY + 17
    fill(bodyX - 1, armY, shoulderWidth + 2, 3, accentHex)

    // Desk surface hint
    fill(2, armY + 3, FRAME_W - 4, 2, '#04060e', 0.2)
    // Lower body faded behind desk
    fill(bodyX, armY + 4, shoulderWidth, 7, looks.legs, 0.35)
  }

  createAnimations() {
    const sheets = ['sheet-petra', 'sheet-callum', 'sheet-simone', 'sheet-marcus', 'sheet-player', 'sheet-watercooler']
    sheets.forEach(sheet => {
      DIRECTIONS.forEach(direction => {
        const idleKey = animationKey(sheet, 'idle', direction)
        const walkKey = animationKey(sheet, 'walk', direction)
        if (!this.anims.exists(idleKey)) {
          this.anims.create({
            key: idleKey,
            frames: [
              { key: frameTextureKey(sheet, direction, 0) },
              { key: frameTextureKey(sheet, direction, 1) },
            ],
            frameRate: 2,
            repeat: -1,
          })
        }
        if (!this.anims.exists(walkKey)) {
          this.anims.create({
            key: walkKey,
            frames: [
              { key: frameTextureKey(sheet, direction, 1) },
              { key: frameTextureKey(sheet, direction, 2) },
              { key: frameTextureKey(sheet, direction, 1) },
              { key: frameTextureKey(sheet, direction, 3) },
            ],
            frameRate: 7,
            repeat: -1,
          })
        }
      })

      // Desk idle animation — only for the 4 main character sheets
      const hasDeskAnim = sheet !== 'sheet-watercooler' && sheet !== 'sheet-player'
      if (hasDeskAnim) {
        const deskKey = animationKey(sheet, 'idle', 'desk')
        if (!this.anims.exists(deskKey)) {
          this.anims.create({
            key: deskKey,
            frames: [
              { key: frameTextureKey(sheet, 'desk', 0) },
              { key: frameTextureKey(sheet, 'desk', 1) },
            ],
            frameRate: 1,
            repeat: -1,
          })
        }
      }
    })
  }

  drawOffice() {
    const { base, structure, accents } = buildOfficeTilemap()
    this.collisionStructure = structure
    const tilesetKey = 'office-tileset'
    const createLayer = (data, depth, alpha = 1) => {
      const map = this.make.tilemap({ data, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE })
      const tileset = map.addTilesetImage(tilesetKey, tilesetKey, TILE_SIZE, TILE_SIZE, 0, 0, 0)
      const layer = map.createLayer(0, tileset, 0, 0)
      layer.setDepth(depth)
      layer.setAlpha(alpha)
      return layer
    }

    this.baseLayer = createLayer(base, 0)
    this.accentLayer = createLayer(accents, 2, 0.95)

    ROOM_SPECS.forEach(room => {
      this.drawRoomOverlay(room)
      this.drawRoomLabel(room)
    })
    this.structureLayer = createLayer(structure, 6)
    this.drawCorridorStructure()
    this.drawDepartmentDecor()
    this.drawSharedArea()
  }

  drawRoomOverlay(room) {
    const g = this.add.graphics().setDepth(3)
    g.fillStyle(room.color, 0.03)
    g.fillRect(room.x, room.y, room.w, room.h)
    g.lineStyle(1, room.color, 0.08)
    g.strokeRect(room.x + 1, room.y + 1, room.w - 2, room.h - 2)
  }

  addRoomAtmosphere() {
    // Simone's engineering room — cyan server glow over the two server racks (x=70,y=440 and x=126,y=440)
    const simoneGlow = this.add.ellipse(120, 470, 80, 50, 0x00ffff, 0.05).setDepth(3.5)
    this.tweens.add({
      targets: simoneGlow,
      alpha: { from: 0.06, to: 0.18 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Marcus's comms room — purple lounge glow over couch (x=850,y=580) and coffee table (x=912,y=592)
    const marcusGlow = this.add.ellipse(900, 590, 90, 40, 0xA29BFE, 0.04).setDepth(3.5)
    this.tweens.add({
      targets: marcusGlow,
      alpha: { from: 0.04, to: 0.14 },
      duration: 2400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  drawRoomLabel(room) {
    this.add.text(room.labelX, room.labelY, room.label, {
      fontFamily: 'VT323',
      fontSize: '12px',
      color: hex(room.color),
    }).setAlpha(0.42).setDepth(12)
  }

  drawCorridorStructure() {
    const g = this.add.graphics().setDepth(6)
    g.lineStyle(2, 0x243247, 0.72)
    g.lineBetween(0, 360, 1280, 360)
    g.lineBetween(640, 0, 640, 720)
    g.lineStyle(1, 0xff9f43, 0.1)
    g.lineBetween(612, 360, 668, 360)
    g.lineBetween(640, 332, 640, 388)

    this.add.image(626, 342, 'watercooler').setOrigin(0).setDepth(18)

  }

  drawDepartmentDecor() {
    const legalBounds = ROOM_BOUNDS.legal
    const engineeringBounds = ROOM_BOUNDS.engineering
    const commsBounds = ROOM_BOUNDS.comms

    this.add.image(412, 36, 'glass-panel').setOrigin(0).setDepth(10)
    this.add.image(412, 100, 'glass-panel').setOrigin(0).setDepth(10)
    this.add.image(118, 42, 'whiteboard').setOrigin(0).setDepth(10)
    this.add.image(396, 214, 'vision-poster').setOrigin(0).setDepth(10)

    this.add.image(212, 94, 'meeting-table').setOrigin(0).setDepth(10).setScale(0.9)
    this.add.image(214, 74, 'chair').setOrigin(0).setDepth(10)
    this.add.image(280, 74, 'chair').setOrigin(0).setDepth(10)
    this.add.image(220, 146, 'chair').setOrigin(0).setDepth(10)
    this.add.image(276, 146, 'chair').setOrigin(0).setDepth(10)

    this.add.image(legalBounds.x1 * TILE_SIZE - 80, legalBounds.y0 * TILE_SIZE + 48, 'bookshelf').setOrigin(0).setDepth(10)
    this.add.image(legalBounds.x1 * TILE_SIZE - 132, legalBounds.y0 * TILE_SIZE + 48, 'bookshelf').setOrigin(0).setDepth(10)
    this.add.image(legalBounds.x0 * TILE_SIZE + 96, legalBounds.y0 * TILE_SIZE + 48, 'glass-panel').setOrigin(0).setDepth(10).setAlpha(0.6)

    this.add.image(876, 180, 'cabinet').setOrigin(0).setDepth(10)
    this.add.image(924, 180, 'cabinet').setOrigin(0).setDepth(10)
    this.add.image(1010, 232, 'printer').setOrigin(0).setDepth(10)

    this.add.image(engineeringBounds.x0 * TILE_SIZE + 70, engineeringBounds.y0 * TILE_SIZE + 24, 'server-rack').setOrigin(0).setDepth(10)
    this.add.image(engineeringBounds.x0 * TILE_SIZE + 126, engineeringBounds.y0 * TILE_SIZE + 24, 'server-rack').setOrigin(0).setDepth(10)
    this.add.image(SIMONE_WHITEBOARD_POS.x, SIMONE_WHITEBOARD_POS.y, 'whiteboard').setOrigin(0).setDepth(10).setScale(0.85).setAlpha(0.88)
    this.add.image(385, 418, 'monitor').setOrigin(0).setDepth(10)
    this.add.image(420, 418, 'monitor').setOrigin(0).setDepth(10)

    this.add.image(340, 452, 'monitor').setOrigin(0).setDepth(10)
    this.add.image(382, 452, 'monitor').setOrigin(0).setDepth(10)
    this.add.image(332, 494, 'cabinet').setOrigin(0).setDepth(10).setScale(0.9)

    this.add.image(commsBounds.x0 * TILE_SIZE + 82, commsBounds.y0 * TILE_SIZE + 164, 'couch').setOrigin(0).setDepth(10)
    this.add.image(commsBounds.x1 * TILE_SIZE - 128, commsBounds.y0 * TILE_SIZE + 4, 'vision-poster').setOrigin(0).setDepth(10).setTint(0xbda8ff)
    this.add.image(commsBounds.x0 * TILE_SIZE + 102, commsBounds.y0 * TILE_SIZE + 12, 'glass-panel').setOrigin(0).setDepth(10).setAlpha(0.5)

    this.add.image(912, 592, 'coffee-table').setOrigin(0).setDepth(10)
    this.add.image(1030, 438, 'notice-board').setOrigin(0).setDepth(10)
  }

  drawSharedArea() {
    for (let i = 0; i < 4; i++) {
      this.add.image(516 + i * 56, 334, 'desk-neutral').setOrigin(0).setDepth(15).setScale(0.55)
    }
    this.add.image(586, 262, 'couch').setOrigin(0).setDepth(14).setScale(0.8)
    this.add.image(618, 454, 'couch').setOrigin(0).setDepth(14).setScale(0.8)

    this.add.image(544, 220, 'meeting-table').setOrigin(0).setDepth(14)
    this.add.image(546, 198, 'chair').setOrigin(0).setDepth(14)
    this.add.image(622, 198, 'chair').setOrigin(0).setDepth(14)
    this.add.image(698, 198, 'chair').setOrigin(0).setDepth(14)
    this.add.image(548, 262, 'chair').setOrigin(0).setDepth(14)
    this.add.image(700, 262, 'chair').setOrigin(0).setDepth(14)
    this.add.image(738, 262, 'fridge').setOrigin(0).setDepth(14)
    this.add.image(732, 326, 'snack-counter').setOrigin(0).setDepth(14)
    this.add.image(476, 508, 'printer').setOrigin(0).setDepth(14)
    this.add.image(752, 492, 'notice-board').setOrigin(0).setDepth(14)
  }

  buildRouteMap(npc) {
    return {
      desk_loop: npc.patrol,
      focus_spot: npc.id === 'simone'
        ? [
            { x: SIMONE_WHITEBOARD_POS.x, y: SIMONE_WHITEBOARD_POS.y + 28 },
            { x: SIMONE_WHITEBOARD_POS.x + 44, y: SIMONE_WHITEBOARD_POS.y + 28 },
            { x: SIMONE_WHITEBOARD_POS.x + 44, y: SIMONE_WHITEBOARD_POS.y + 64 },
            { x: SIMONE_WHITEBOARD_POS.x, y: SIMONE_WHITEBOARD_POS.y + 64 },
          ]
        : npc.patrol,
    }
  }

  getDefaultBehavior() {
    return {
      speedMultiplier: 1,
      idleMultiplier: 1,
      avoidPlayer: false,
      avoidRadius: PLAYER_AVOID_RADIUS,
      routePreference: 'desk_loop',
      bobDuration: 1400,
    }
  }

  createMainNPCs() {
    const petraFirst = !window.__petraVisited

    const mainNpcs = MAIN_NPCS.map(def => {
      const hidden = petraFirst && def.id !== 'petra'
      const room = ROOM_SPECS.find(spec => spec.ownerId === def.id)
      const deskKey = room ? `desk-${room.id}` : 'desk-neutral'
      const routeMap = this.buildRouteMap(def)

      const shadow = this.add.ellipse(def.x, def.y + 15, 24, 9, 0x04060e, 0.38).setDepth(30)
      const desk = this.add.image(def.deskPos.x, def.deskPos.y, deskKey).setOrigin(0).setDepth(24)
      const sprite = this.add.sprite(def.x, def.y, frameTextureKey(def.textureKey, 'down', 0)).setOrigin(0.5, 0.74).setDepth(40)
      const labelText = this.add.text(def.x, def.y - 26, def.name.toUpperCase(), {
        fontFamily: 'VT323',
        fontSize: '10px',
        color: hex(def.color),
      }).setOrigin(0.5, 0.5).setAlpha(0.42).setDepth(42)
      const ring = this.add.graphics().setDepth(28)

      this.setActorAnimation(sprite, def.textureKey, 'idle', 'down')

      if (hidden) {
        ;[shadow, desk, sprite, labelText, ring].forEach(node => node.setAlpha(0))
      }

      return {
        ...def,
        x: def.x,
        y: def.y,
        shadow,
        desk,
        graphic: sprite,
        labelText,
        ring,
        hexColor: hex(def.color),
        isWatercooler: false,
        radius: INTERACTION_RADIUS,
        hidden,
        routeMap,
        activeRouteName: 'desk_loop',
        activeRoute: routeMap.desk_loop,
        patrolIndex: 0,
        patrolTimer: Phaser.Math.Between(500, 1600),
        behavior: this.getDefaultBehavior(),
        direction: 'down',
        currentMode: 'idle',
      }
    })

    this.npcs.push(...mainNpcs)
  }

  createWatercoolerNPCs() {
    const wcNpcs = WATERCOOLER_NPCS.map(npc => {
      const hidden = !window.__petraVisited
      const shadow = this.add.ellipse(npc.x, npc.y + 12, 20, 8, 0x04060e, 0.32).setDepth(30)
      const sprite = this.add.sprite(npc.x, npc.y, frameTextureKey('sheet-watercooler', 'down', 0)).setOrigin(0.5, 0.75).setDepth(38).setTint(npc.color)
      const labelText = this.add.text(npc.x, npc.y - 22, npc.name.toUpperCase(), {
        fontFamily: 'VT323',
        fontSize: '9px',
        color: npc.hexColor,
      }).setOrigin(0.5, 0.5).setAlpha(0.28).setDepth(40)
      const ring = this.add.graphics().setDepth(28)

      this.setActorAnimation(sprite, 'sheet-watercooler', 'idle', 'down')

      if (hidden) {
        ;[shadow, sprite, labelText, ring].forEach(node => node.setAlpha(0))
      }

      return {
        ...npc,
        graphic: sprite,
        shadow,
        labelText,
        ring,
        hexColor: npc.hexColor,
        isWatercooler: true,
        radius: WC_INTERACTION_RADIUS,
        hidden,
        direction: 'down',
      }
    })

    this.npcs.push(...wcNpcs)
  }

  createPlayer() {
    this.playerGlow = this.add.ellipse(this.playerX, this.playerY + 15, 32, 10, 0xff9f43, 0.16).setDepth(30)
    this.playerSprite = this.add.sprite(this.playerX, this.playerY, frameTextureKey('sheet-player', 'down', 0)).setOrigin(0.5, 0.76).setDepth(41)
    this.playerText = this.add.text(this.playerX, this.playerY + 22, 'THE PM', {
      fontFamily: 'VT323',
      fontSize: '14px',
      color: '#ff9f43',
      letterSpacing: 3,
    }).setOrigin(0.5, 0.5).setDepth(43)
    this.setActorAnimation(this.playerSprite, 'sheet-player', 'idle', 'down')
  }

  setActorAnimation(sprite, textureKey, mode, direction) {
    const key = animationKey(textureKey, mode, direction)
    if (sprite.anims.currentAnim?.key !== key) {
      sprite.anims.play(key, true)
    }
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)
  }

  setupWindowListeners() {
    this._onPause = () => { this.isPaused = true }
    this._onResume = () => { this.isPaused = false }
    this._onRevealCharacters = () => {
      this.npcs.filter(npc => npc.hidden && npc.id !== 'petra').forEach(npc => {
        const targets = [npc.graphic, npc.ring, npc.labelText, npc.shadow, npc.desk].filter(Boolean)
        this.tweens.add({ targets, alpha: 1, duration: 600, ease: 'Sine.easeOut' })
        npc.hidden = false
      })
    }
    this._onFatigueUpdate = e => {
      const next = e.detail?.speedMultiplier
      if (typeof next === 'number') this.playerSpeedMultiplier = clamp(next, MIN_PLAYER_SPEED_MULTIPLIER, 1)
    }
    this._onNpcStateUpdate = e => {
      this.npcWorldState = e.detail || { week: 1, npcStates: {}, alliances: [] }
      this.syncNpcBehaviors()
    }

    window.addEventListener('phaser:pause', this._onPause)
    window.addEventListener('phaser:resume', this._onResume)
    window.addEventListener('phaser:reveal_characters', this._onRevealCharacters)
    window.addEventListener('phaser:fatigue_update', this._onFatigueUpdate)
    window.addEventListener('phaser:npc_state_update', this._onNpcStateUpdate)
  }

  syncNpcBehaviors() {
    this.updateAllianceRoutes()
    this.npcs.forEach(npc => {
      if (npc.isWatercooler) return
      const emotions = this.npcWorldState.npcStates?.[npc.id] || {}
      const wariness = emotions.wariness ?? 30
      const trust = emotions.trust ?? 50
      const allianceRoute = this.activeAllianceRoutes.find(route => route.members.includes(npc.id))
      const routePreference = allianceRoute
        ? allianceRoute.key
        : npc.id === 'simone' && trust >= 70
          ? 'focus_spot'
          : 'desk_loop'

      npc.behavior = {
        speedMultiplier: clamp(
          1 + Math.max(0, wariness - 55) / 90 + (trust < 25 ? 0.35 : trust < 40 ? 0.18 : 0),
          1, 1.8
        ),
        idleMultiplier: trust < 25 ? 0.28 : trust < 35 ? 0.45 : wariness >= 65 ? 0.68 : 1,
        avoidPlayer: trust < 35,
        faceAwayFromPlayer: wariness > 70 || trust < 25,
        avoidRadius: PLAYER_AVOID_RADIUS,
        effectiveRadius: trust < 30 ? 45 : INTERACTION_RADIUS,
        routePreference,
        bobDuration: Math.max(650, 1400 - Math.max(0, wariness - 50) * 10),
      }

      // Tint shift: stressed state bleeds into sprite color
      if (npc.graphic) {
        if (wariness > 75 || trust < 20) {
          npc.graphic.setTint(blendTint(npc.color, 0x666666, 0.35))
        } else if (wariness > 55) {
          npc.graphic.setTint(blendTint(npc.color, 0x888888, 0.15))
        } else {
          npc.graphic.clearTint()
        }
      }

      if (allianceRoute) {
        const memberRoute = allianceRoute.routesByMemberId?.[npc.id]
        if (memberRoute?.length) npc.routeMap[allianceRoute.key] = memberRoute
      }
      this.updateNpcRoute(npc, routePreference)
    })
  }

  updateAllianceRoutes() {
    const now = this.time.now
    const nextRoutes = []
    ;(this.npcWorldState.alliances || []).forEach(alliance => {
      const members = [...alliance.members].sort()
      const pairKey = members.join('-')
      const routesByMemberId = ALLIANCE_INROOM_ROUTES[pairKey]
      if (!routesByMemberId) return
      const existing = this.activeAllianceRoutes.find(item => item.id === pairKey)
      nextRoutes.push({
        id: pairKey,
        members,
        key: `alliance_${pairKey}`,
        routesByMemberId,
        expiresAt: existing ? Math.max(existing.expiresAt, now + 2500) : now + ALLIANCE_ROUTE_DURATION,
      })
    })
    this.activeAllianceRoutes = [
      ...nextRoutes,
      ...this.activeAllianceRoutes.filter(route => route.expiresAt > now && !nextRoutes.some(next => next.id === route.id)),
    ]
  }

  updateNpcRoute(npc, routeName) {
    const nextRoute = npc.routeMap[routeName] || npc.routeMap.desk_loop
    if (!nextRoute?.length) return
    if (npc.activeRouteName === routeName && npc.activeRoute === nextRoute) return
    npc.activeRouteName = routeName
    npc.activeRoute = nextRoute
    npc.patrolIndex = this.getNearestRouteIndex(npc, nextRoute)
    npc.patrolTimer = Phaser.Math.Between(200, 700)
    npc.patrolStuckMs = 0
    npc._patrolPrevTargetDist = undefined
  }

  getNearestRouteIndex(npc, route) {
    let nearestIndex = 0
    let nearestDistance = Infinity
    route.forEach((point, index) => {
      const dist = Phaser.Math.Distance.Between(npc.x, npc.y, point.x, point.y)
      if (dist < nearestDistance) {
        nearestDistance = dist
        nearestIndex = index
      }
    })
    return nearestIndex
  }

  getDirectionAwayFromPlayer(x, y) {
    const dx = x - this.playerX
    const dy = y - this.playerY
    if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'right' : 'left'
    return dy >= 0 ? 'down' : 'up'
  }

  getDirection(dx, dy, fallback = 'down') {
    if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) return fallback
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left'
    return dy > 0 ? 'down' : 'up'
  }

  worldXYToTile(wx, wy) {
    return {
      col: Phaser.Math.Clamp(Math.floor(wx / TILE_SIZE), 0, MAP_COLS - 1),
      row: Phaser.Math.Clamp(Math.floor(wy / TILE_SIZE), 0, MAP_ROWS - 1),
    }
  }

  isWorldXYBlocked(wx, wy) {
    if (!this.collisionStructure) return false
    const { col, row } = this.worldXYToTile(wx, wy)
    return isSolidStructureTile(this.collisionStructure[row][col])
  }

  canPlayerStandAt(x, y) {
    const pts = [[x - 9, y], [x + 9, y], [x, y - 12], [x, y + 6]]
    return pts.every(([px, py]) => !this.isWorldXYBlocked(px, py))
  }

  /** Sample structure tile at world pixel (for wall-hit feedback). */
  getStructureTileAtWorld(wx, wy) {
    if (!this.collisionStructure) return TILE_IDS.empty
    const { col, row } = this.worldXYToTile(wx, wy)
    return this.collisionStructure[row][col]
  }

  triggerWallBumpFeedback(time, vx, vy, tryX, tryY) {
    if (time <= this.lastWallBumpAt + 140) return
    this.lastWallBumpAt = time
    SFX.wallBump()
    let sampleX = this.playerX
    let sampleY = this.playerY
    if (Math.abs(vx) > 1e-6 && !this.canPlayerStandAt(tryX, this.playerY)) sampleX += Math.sign(vx) * 20
    if (Math.abs(vy) > 1e-6 && !this.canPlayerStandAt(this.playerX, tryY)) sampleY += Math.sign(vy) * 20
    const tile = this.getStructureTileAtWorld(sampleX, sampleY)
    const tint = isWallTile(tile) ? 0xffc9a8 : 0xc8e6ff
    this.playerSprite.setTint(tint)
    this.time.delayedCall(85, () => {
      if (this.playerSprite?.active) this.playerSprite.clearTint()
    })
  }

  update(time, delta) {
    if (this.isPaused) return

    const dt = delta / 1000
    let vx = 0
    let vy = 0
    const previousX = this.playerX
    const previousY = this.playerY

    if (time - this.lastBehaviorRefreshAt > 3000) {
      this.lastBehaviorRefreshAt = time
      this.syncNpcBehaviors()
    }

    this.updateNpcPatrols(dt)
    this.updateAllianceDrift(dt)
    this.drawAllianceLines()

    const currentSpeed = PLAYER_SPEED * this.playerSpeedMultiplier
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx -= currentSpeed
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx += currentSpeed
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy -= currentSpeed
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy += currentSpeed
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707
      vy *= 0.707
    }

    const tryX = clamp(this.playerX + vx * dt, 16, 1264)
    const tryY = clamp(this.playerY + vy * dt, 16, 704)
    let blockedBySolid = false
    if (this.canPlayerStandAt(tryX, this.playerY)) this.playerX = tryX
    else if (Math.abs(vx) > 1e-6) blockedBySolid = true
    if (this.canPlayerStandAt(this.playerX, tryY)) this.playerY = tryY
    else if (Math.abs(vy) > 1e-6) blockedBySolid = true
    if (blockedBySolid) this.triggerWallBumpFeedback(time, vx, vy, tryX, tryY)
    this.playerSprite.setPosition(this.playerX, this.playerY)
    this.playerGlow.setPosition(this.playerX, this.playerY + 15)
    this.playerText.setPosition(this.playerX, this.playerY + 22)

    const playerMoving = Math.abs(vx) > 1 || Math.abs(vy) > 1
    this.playerDirection = this.getDirection(vx, vy, this.playerDirection)
    this.setActorAnimation(this.playerSprite, 'sheet-player', playerMoving ? 'walk' : 'idle', this.playerDirection)

    const frameDx = this.playerX - previousX
    const frameDy = this.playerY - previousY
    const frameSpeed = Math.sqrt(frameDx * frameDx + frameDy * frameDy)
    const coolerDistance = Phaser.Math.Distance.Between(WATERCOOLER_X, WATERCOOLER_Y, this.playerX, this.playerY)
    const inOuterRing = coolerDistance <= OVERHEAR_RADIUS
    const inInnerRing = coolerDistance <= SPOTTED_RADIUS

    if (inOuterRing && !this.inOverhearZone) {
      this.inOverhearZone = true
      this.outerRingEntryTime = time
      this.overhearSpotted = false
      this.overhearNpcId = this.getNearestWatercoolerNpcId()
      if (this.overhearNpcId) {
        window.dispatchEvent(new CustomEvent('phaser:overhear_start', { detail: { wcNpcId: this.overhearNpcId } }))
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
      const timeInOuterRing = time - (this.outerRingEntryTime || time)
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

    let closest = null
    let closestDist = Infinity
    this.npcs.forEach(npc => {
      if (npc.hidden) return
      const dist = Phaser.Math.Distance.Between(npc.x, npc.y, this.playerX, this.playerY)
      npc.ring.clear()
      if (npc.isWatercooler && dist < npc.radius * 1.5) {
        const alpha = Math.max(0, 0.3 - (dist / (npc.radius * 1.5)) * 0.3)
        npc.ring.lineStyle(1, npc.color, alpha)
        npc.ring.strokeCircle(npc.x, npc.y, npc.radius)
      }
      const effectiveR = npc.behavior?.effectiveRadius ?? npc.radius
      if (dist < effectiveR && dist < closestDist) {
        closestDist = dist
        closest = npc
      }
    })

    if (closest !== this.nearbyNpc) {
      this.nearbyNpc = closest
      window.dispatchEvent(new CustomEvent('phaser:proximity', {
        detail: closest
          ? { characterId: closest.id, characterName: closest.name, accentColor: closest.hexColor, isWatercooler: closest.isWatercooler }
          : null,
      }))
    }

    const eDown = this.eKey.isDown
    if (eDown && !this.ePressedLastFrame && this.nearbyNpc) {
      SFX.interact()
      window.dispatchEvent(new CustomEvent('phaser:interact', {
        detail: { characterId: this.nearbyNpc.id, isWatercooler: this.nearbyNpc.isWatercooler },
      }))
    }
    this.ePressedLastFrame = eDown

    const tabDown = this.tabKey.isDown
    if (tabDown && !this.tabPressedLastFrame && this.nearbyNpc && !this.nearbyNpc.isWatercooler) {
      window.dispatchEvent(new CustomEvent('phaser:dossier', { detail: { characterId: this.nearbyNpc.id } }))
    }
    this.tabPressedLastFrame = tabDown
  }

  updateAllianceDrift(dt) {
    this.activeAllianceRoutes.forEach(route => {
      const [idA, idB] = route.members
      const npcA = this.npcs.find(n => n.id === idA)
      const npcB = this.npcs.find(n => n.id === idB)
      if (!npcA || !npcB || npcA.hidden || npcB.hidden) return
      if (npcA.isWatercooler || npcB.isWatercooler) return

      // Only drift when both are idle (dwelling at a waypoint)
      if (npcA.patrolTimer <= 0 || npcB.patrolTimer <= 0) return

      const dx = npcA.x - npcB.x
      const dy = npcA.y - npcB.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 22) {
        // Close enough — face each other
        const towardA = this.getDirection(dx, dy, npcB.direction)
        const towardB = this.getDirection(-dx, -dy, npcA.direction)
        this.setActorAnimation(npcB.graphic, npcB.textureKey, 'idle', towardA)
        this.setActorAnimation(npcA.graphic, npcA.textureKey, 'idle', towardB)
        return
      }

      if (dist > 90) return  // Too far apart — routing hasn't converged them yet

      // B drifts toward A at a subtle speed
      const DRIFT_SPEED = 7  // px/s
      const step = DRIFT_SPEED * dt
      npcB.x += (dx / dist) * step
      npcB.y += (dy / dist) * step
      npcB.graphic.setPosition(npcB.x, npcB.y)
      npcB.shadow.setPosition(npcB.x, npcB.y + 15)
      npcB.labelText.setPosition(npcB.x, npcB.y - 26)
    })
  }

  drawAllianceLines() {
    if (!this.allianceGraphics) return
    this.allianceGraphics.clear()
    ;(this.npcWorldState.alliances ?? []).forEach(alliance => {
      const [idA, idB] = alliance.members
      const npcA = this.npcs.find(n => n.id === idA)
      const npcB = this.npcs.find(n => n.id === idB)
      if (!npcA || !npcB || npcA.hidden || npcB.hidden) return
      this.allianceGraphics.lineStyle(1, 0xffffff, 0.12)
      this.allianceGraphics.beginPath()
      this.allianceGraphics.moveTo(npcA.x, npcA.y)
      this.allianceGraphics.lineTo(npcB.x, npcB.y)
      this.allianceGraphics.strokePath()
    })
  }

  updateNpcPatrols(dt) {
    this.npcs.forEach(npc => {
      if (npc.hidden) return

      if (npc.isWatercooler) {
        this.setActorAnimation(npc.graphic, 'sheet-watercooler', 'idle', npc.direction || 'down')
        return
      }

      const distToPlayer = Phaser.Math.Distance.Between(npc.x, npc.y, this.playerX, this.playerY)
      if (npc.behavior.avoidPlayer && distToPlayer < npc.behavior.avoidRadius) {
        // Flee: move directly away from the player
        const awayX = npc.x - this.playerX
        const awayY = npc.y - this.playerY
        const awayLen = Math.sqrt(awayX * awayX + awayY * awayY) || 1
        const step = PATROL_SPEED * npc.behavior.speedMultiplier * dt * 1.2
        npc.x += (awayX / awayLen) * step
        npc.y += (awayY / awayLen) * step
        const fleeDir = Math.abs(awayX) > Math.abs(awayY)
          ? (awayX > 0 ? 'right' : 'left')
          : (awayY > 0 ? 'down' : 'up')
        npc.graphic.setPosition(npc.x, npc.y)
        npc.shadow.setPosition(npc.x, npc.y + 15)
        npc.labelText.setPosition(npc.x, npc.y - 26)
        this.setActorAnimation(npc.graphic, npc.textureKey, 'walk', fleeDir)
        return
      } else if (distToPlayer < npc.radius + 16) {
        npc.patrolStuckMs = 0
        npc._patrolPrevTargetDist = undefined
        this.setActorAnimation(npc.graphic, npc.textureKey, 'idle', npc.direction)
        return
      }

      const atDesk = npc.deskPos &&
        Phaser.Math.Distance.Between(npc.x, npc.y, npc.deskPos.x + 8, npc.deskPos.y + 8) < 22

      if (npc.patrolTimer > 0) {
        npc.patrolTimer -= dt * 1000
        if (atDesk) {
          this.setActorAnimation(npc.graphic, npc.textureKey, 'idle', 'desk')
        } else {
          const idleDir = npc.behavior.faceAwayFromPlayer
            ? this.getDirectionAwayFromPlayer(npc.x, npc.y)
            : npc.direction
          this.setActorAnimation(npc.graphic, npc.textureKey, 'idle', idleDir)
        }
        return
      }

      const nextIndex = (npc.patrolIndex + 1) % npc.activeRoute.length
      const target = npc.activeRoute[nextIndex]
      const dx = target.x - npc.x
      const dy = target.y - npc.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 2) {
        npc.patrolIndex = nextIndex
        npc.patrolTimer = Phaser.Math.Between(700, 1600) * npc.behavior.idleMultiplier
        npc.patrolStuckMs = 0
        npc._patrolPrevTargetDist = undefined
        if (atDesk) {
          this.setActorAnimation(npc.graphic, npc.textureKey, 'idle', 'desk')
        } else {
          const arrivalDir = npc.behavior.faceAwayFromPlayer
            ? this.getDirectionAwayFromPlayer(npc.x, npc.y)
            : npc.direction
          this.setActorAnimation(npc.graphic, npc.textureKey, 'idle', arrivalDir)
        }
        return
      }

      const prevTargetDist = npc._patrolPrevTargetDist
      if (prevTargetDist != null && dist >= prevTargetDist - 0.2) {
        npc.patrolStuckMs = (npc.patrolStuckMs || 0) + dt * 1000
      } else {
        npc.patrolStuckMs = 0
      }
      npc._patrolPrevTargetDist = dist

      if (npc.patrolStuckMs > PATROL_STUCK_MS) {
        npc.patrolIndex = nextIndex
        npc.patrolTimer = Phaser.Math.Between(400, 900) * npc.behavior.idleMultiplier
        npc.patrolStuckMs = 0
        npc._patrolPrevTargetDist = undefined
        if (atDesk) {
          this.setActorAnimation(npc.graphic, npc.textureKey, 'idle', 'desk')
        } else {
          const stuckDir = npc.behavior.faceAwayFromPlayer
            ? this.getDirectionAwayFromPlayer(npc.x, npc.y)
            : npc.direction
          this.setActorAnimation(npc.graphic, npc.textureKey, 'idle', stuckDir)
        }
        return
      }

      const step = Math.min(PATROL_SPEED * npc.behavior.speedMultiplier * dt, dist)
      npc.x += (dx / dist) * step
      npc.y += (dy / dist) * step

      const direction = this.getDirection(dx, dy, npc.direction)
      npc.direction = direction
      const horizontalBias = npc.behavior.avoidPlayer && distToPlayer < 170
        ? clamp((npc.x - this.playerX) * 0.015, -2, 2)
        : 0

      npc.graphic.setPosition(npc.x + horizontalBias, npc.y)
      npc.shadow.setPosition(npc.x, npc.y + 15)
      npc.labelText.setPosition(npc.x, npc.y - 26)
      this.setActorAnimation(npc.graphic, npc.textureKey, 'walk', direction)
    })
  }

  getNearestWatercoolerNpcId() {
    const visible = this.npcs.filter(npc => npc.isWatercooler && !npc.hidden)
    if (!visible.length) return null
    return visible.slice().sort((a, b) => Phaser.Math.Distance.Between(a.x, a.y, this.playerX, this.playerY) - Phaser.Math.Distance.Between(b.x, b.y, this.playerX, this.playerY))[0]?.id || null
  }

  getNearestStakeholderId() {
    const visible = this.npcs.filter(npc => !npc.isWatercooler && !npc.hidden)
    if (!visible.length) return null
    return visible.slice().sort((a, b) => Phaser.Math.Distance.Between(a.x, a.y, this.playerX, this.playerY) - Phaser.Math.Distance.Between(b.x, b.y, this.playerX, this.playerY))[0]?.id || null
  }

  shutdown() {
    window.removeEventListener('phaser:pause', this._onPause)
    window.removeEventListener('phaser:resume', this._onResume)
    window.removeEventListener('phaser:reveal_characters', this._onRevealCharacters)
    window.removeEventListener('phaser:fatigue_update', this._onFatigueUpdate)
    window.removeEventListener('phaser:npc_state_update', this._onNpcStateUpdate)
  }
}
