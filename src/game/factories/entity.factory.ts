import { Entity } from '../structures/entity';
import { Scene } from 'phaser';
import config from '../../config/config';

export class EntityFactory {
  public createNewPlayerEntity(scene: Scene, x: number, y: number): Entity {
    return new Entity(scene, x, y, config.entity.minMass).setOrigin(0.5, 0.5).setFillStyle(0xffffff, 1).setVisible(true);
  }
}
