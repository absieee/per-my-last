import Phaser from 'phaser'
import OfficeScene from './OfficeScene.js'

export function createGame(parentId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: OfficeScene,
    transparent: true,
    backgroundColor: '#04060e',
    parent: parentId,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: false,
    },
  })
}
