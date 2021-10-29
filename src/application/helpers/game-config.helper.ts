import config from '../../config/config';
import { DOMElement } from '../../dom/enums/dom-element.enum';

export const getGameConfig = (): Phaser.Types.Core.GameConfig => {
  return {
    width: config.window.width,
    height: config.window.height,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    },
    type: Phaser.AUTO,
    parent: DOMElement.GAME,
    physics: {
      default: 'arcade',
      arcade: {
        debug: config.debugMode,
      },
    },
  };
};
