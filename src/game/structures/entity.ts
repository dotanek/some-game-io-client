import { Scene } from 'phaser';
import * as Phaser from 'phaser';
import Arc = Phaser.GameObjects.Arc;
import config from '../../config/config';
import Rectangle = Phaser.GameObjects.Rectangle;

export class Entity extends Arc {
  private readonly healthBar: HealthBar;
  private mass: number;

  constructor(scene: Scene, x: number, y: number, mass: number) {
    const radius = Entity.convertMassToRadius(mass);
    super(scene, x, y, radius);

    this.healthBar = new HealthBar(scene, x + radius, y - radius / 2, radius * 4, radius, mass);
    this.mass = mass;
  }

  public addToScene(): void {
    this.scene.add.existing(this);
    this.healthBar.addToScene();
  }

  public addToScenePhysic(): void {
    this.scene.physics.add.existing(this, false);
    const body = this.getBody();
    body.setCircle(Entity.convertMassToRadius(this.mass));
    body.setMaxVelocity(config.entity.maxVelocity, config.entity.maxVelocity);
    body.setMass(this.mass);
  }

  public update(): void {
    const position = this.getBody().position;

    this.healthBar.setPosition(position.x + this.radius, position.y - this.radius);
    this.healthBar.update();
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

  public zeroAcceleration(): void {
    this.getBody().setAcceleration(0,0);
    console.log(this.getBody());
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

    const body = this.getBody();
    body.setCircle(Entity.convertMassToRadius(this.mass));
    body.setMaxVelocity(maxVelocity, maxVelocity);
    body.setMass(this.mass);

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

    const minimalMass = config.entity.minMass;
    const maximalVelocity = config.entity.maxVelocity;
    const massVelocityCapacity = config.entity.massVelocityCapacity;

    return maximalVelocity - (maximalVelocity * (mass - minimalMass)) / (massVelocityCapacity - minimalMass);
  }

  public static addPlayerEntityToEntityCollision(player: Entity, other: Entity, scene: Scene) {
    scene.physics.add.collider(player, other, () => {
      //player.addToMassAndUpdateSize(100);
    });
  }

  public static addEntityToEntityCollision(first: Entity, second: Entity, scene: Scene) {
    scene.physics.add.collider(first, second, () => {
      //console.log('Entity to entity collision.');
    });
  }
}

class HealthBar extends Rectangle {
  private valueTotal: number;
  private valueCurrent: number;

  private readonly innerBar: Rectangle;

  constructor(scene: Scene, x: number, y: number, width: number, height: number, valueTotal: number) {
    super(scene, x, y, width, height, 0xffffff, 1);

    this.valueTotal = valueTotal;
    this.valueCurrent = valueTotal;

    const border = height * 0.1;

    this.innerBar = new Rectangle(scene, x, y, width - border, height - border, 0xaaffaa, 1);
    this.innerBar.addedToScene();
  }

  public update(): void {
    this.innerBar.setPosition(this.x, this.y);
  }

  public addToScene(): void {
    this.scene.add.existing(this);
    this.scene.add.existing(this.innerBar);
  }
}
