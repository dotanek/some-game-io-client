import { Entity } from '../structures/entity';
import { Scene } from 'phaser';
import config from '../../config/config';

export class EntityFactory {
  public static createNewPlayerEntity(scene: Scene, x: number, y: number, username: string): Entity {
    return new Entity(scene, x, y, config.entity.minMass, username).setOrigin(0.5, 0.5).setFillStyle(0xffaaaa, 1).setVisible(true);
  }

  /*public static createOtherPlayerEntity(scene: Scene, x: number, y: number, mass: number): Entity {
    if (mass < config.entity.minMass) {
      mass = config.entity.minMass;
    }
    return new Entity(scene, x, y, mass).setOrigin(0.5, 0.5).setFillStyle(0xffffff, 1).setVisible(true);
  }*/

  public static createOtherEntity(scene: Scene, x: number, y: number, mass: number, username: string): Entity {
    return new Entity(scene, x, y, mass, username).setOrigin(0.5, 0.5).setFillStyle(0xffffff, 1).setVisible(true);
  }
}
