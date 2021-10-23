import { Game } from 'phaser';
import config from './config/config';
import { EntryScene } from './scenes/entry.scene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  width: config.window.width,
  height: config.window.height,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
  type: Phaser.AUTO,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      debug: config.debugMode,
    },
  },
};

const game = new Game(gameConfig);

/* Add all scenes */
game.scene.add('entry-scene', EntryScene);

/* Start entry scene */
game.scene.start('entry-scene');
