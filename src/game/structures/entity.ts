import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import Arc = Phaser.GameObjects.Arc;
import config from '../../config/config';

export class Entity extends Arc {
  private mass: number;

  constructor(scene: Scene, x: number, y: number, mass: number) {
    super(scene, x, y, Entity.convertMassToRadius(mass));
    this.mass = mass;
  }

  public addToScene(): void {
    this.scene.add.existing(this);
  }

  public addToScenePhysic(): void {
    this.scene.physics.add.existing(this, false);
    this.getBody().setCircle(Entity.convertMassToRadius(this.mass));
    //this.getBody().setMaxVelocity(config.entity.maxVelocity,  config.entity.maxVelocity);
    this.getBody().setMaxVelocity(100,100);
  }

  public getX(): number {
    return this.body.position.x;
  }

  public getY(): number {
    return this.body.position.y;
  }

  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  public getMass(): number {
    return this.mass;
  }

  public addToMassAndUpdateSize(value: number): void {
    this.mass += value;

    if (this.mass < config.entity.minMass) {
      this.mass = config.entity.minMass;
    }

    this.updateSize();
  }

  private updateSize(): void {
    this.radius = Entity.convertMassToRadius(this.mass);
    const maxVelocity = Entity.convertMassToMaxVelocity(this.mass);
    this.getBody().setCircle(Entity.convertMassToRadius(this.mass));
    this.getBody().setMaxVelocity(maxVelocity,maxVelocity);

    console.log(`New mass: ${this.mass}`);
    console.log(`New max velocity: ${this.getBody().maxVelocity.x}, ${this.getBody().maxVelocity.y}`);
  }

  public static convertMassToRadius(mass: number) {
    return Math.sqrt(mass / Math.PI);
  }

  public static convertMassToMaxVelocity(mass: number) {
    if (mass >= config.entity.massVelocityCapacity) {
      return config.entity.minVelocity;
    }

    const minimalMass= config.entity.minMass;
    const maximalVelocity = config.entity.maxVelocity;
    const massVelocityCapacity = config.entity.massVelocityCapacity;

    return maximalVelocity - maximalVelocity * (mass - minimalMass) / (massVelocityCapacity - minimalMass);
  }

  public static addPlayerEntityToEntityCollision(player: Entity, other: Entity, scene: Scene) {
    scene.physics.add.collider(player, other, () => {
      //player.addToMassAndUpdateSize(100);
    });
  }

  public static addEntityToEntityCollision(first: Entity, second: Entity, scene: Scene) {
    scene.physics.add.collider(first,second, () => console.log('Entity to entity collision.'));
  }
}