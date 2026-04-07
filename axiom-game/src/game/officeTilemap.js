export const MAP_COLS = 40
export const MAP_ROWS = 22
export const TILE_SIZE = 32

export const TILE_IDS = {
  empty: -1,
  corridorFloor: 0,
  productFloor: 1,
  legalFloor: 2,
  engineeringFloor: 3,
  commsFloor: 4,
  wall: 5,
  divider: 6,
  glass: 7,
  ceiling: 8,
}

export const ROOM_BOUNDS = {
  product: { x0: 0, x1: 15, y0: 0, y1: 9 },
  legal: { x0: 24, x1: 39, y0: 0, y1: 9 },
  engineering: { x0: 0, x1: 15, y0: 13, y1: 21 },
  comms: { x0: 24, x1: 39, y0: 13, y1: 21 },
}

function createGrid(fill) {
  return Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill(fill))
}

function paintRect(layer, bounds, tileId, inset = 0) {
  for (let y = bounds.y0 + inset; y <= bounds.y1 - inset; y++) {
    for (let x = bounds.x0 + inset; x <= bounds.x1 - inset; x++) {
      layer[y][x] = tileId
    }
  }
}

function setTile(layer, x, y, tileId) {
  if (x < 0 || x >= MAP_COLS || y < 0 || y >= MAP_ROWS) return
  layer[y][x] = tileId
}

function drawHorizontalDivider(layer, y, fromX, toX, doorStart, doorEnd) {
  for (let x = fromX; x <= toX; x++) {
    if (x < doorStart || x > doorEnd) {
      setTile(layer, x, y, TILE_IDS.divider)
    }
  }
}

function drawVerticalDivider(layer, x, fromY, toY, doorStart, doorEnd) {
  for (let y = fromY; y <= toY; y++) {
    if (y < doorStart || y > doorEnd) {
      setTile(layer, x, y, TILE_IDS.divider)
    }
  }
}

export function buildOfficeTilemap() {
  const base = createGrid(TILE_IDS.corridorFloor)
  const structure = createGrid(TILE_IDS.empty)
  const accents = createGrid(TILE_IDS.empty)

  paintRect(base, ROOM_BOUNDS.product, TILE_IDS.productFloor)
  paintRect(base, ROOM_BOUNDS.legal, TILE_IDS.legalFloor)
  paintRect(base, ROOM_BOUNDS.engineering, TILE_IDS.engineeringFloor)
  paintRect(base, ROOM_BOUNDS.comms, TILE_IDS.commsFloor)

  for (let x = 0; x < MAP_COLS; x++) {
    setTile(structure, x, 0, TILE_IDS.wall)
    setTile(structure, x, MAP_ROWS - 1, TILE_IDS.wall)
  }
  for (let y = 0; y < MAP_ROWS; y++) {
    setTile(structure, 0, y, TILE_IDS.wall)
    setTile(structure, MAP_COLS - 1, y, TILE_IDS.wall)
  }

  drawVerticalDivider(structure, 15, ROOM_BOUNDS.product.y0, ROOM_BOUNDS.product.y1, 4, 6)
  drawVerticalDivider(structure, 24, ROOM_BOUNDS.legal.y0, ROOM_BOUNDS.legal.y1, 4, 6)
  drawVerticalDivider(structure, 15, ROOM_BOUNDS.engineering.y0, ROOM_BOUNDS.engineering.y1, 15, 17)
  drawVerticalDivider(structure, 24, ROOM_BOUNDS.comms.y0, ROOM_BOUNDS.comms.y1, 15, 17)

  drawHorizontalDivider(structure, 9, ROOM_BOUNDS.product.x0, ROOM_BOUNDS.product.x1, 6, 9)
  drawHorizontalDivider(structure, 9, ROOM_BOUNDS.legal.x0, ROOM_BOUNDS.legal.x1, 30, 33)
  drawHorizontalDivider(structure, 13, ROOM_BOUNDS.engineering.x0, ROOM_BOUNDS.engineering.x1, 6, 9)
  drawHorizontalDivider(structure, 13, ROOM_BOUNDS.comms.x0, ROOM_BOUNDS.comms.x1, 30, 33)

  for (let y = 1; y <= 8; y++) {
    setTile(accents, 12, y, TILE_IDS.glass)
    setTile(accents, 13, y, TILE_IDS.glass)
  }

  for (let x = 1; x < MAP_COLS - 1; x += 2) {
    setTile(accents, x, 1, TILE_IDS.ceiling)
    setTile(accents, x, 11, TILE_IDS.ceiling)
  }

  return { base, structure, accents }
}
