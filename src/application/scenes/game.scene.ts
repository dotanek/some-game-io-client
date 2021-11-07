import config from '../../config/config';
import textureBackground from '../../assets/textures/mock-background.jpg';
import * as Phaser from 'phaser';
import { Entity } from '../../game/structures/entity';
import { EntityFactory } from '../../game/factories/entity.factory';
import { averageAngles } from '../../common/helpers/math.helper';
import Between = Phaser.Math.Angle.Between;

export class GameScene extends Phaser.Scene {
  private playerEntity!: Entity;
  private otherEntites!: Entity[];

  public preload(): void {
    this.load.image('background', textureBackground);
  }

  public create(): void {
    this.playerEntity = new EntityFactory().createNewPlayerEntity(this, config.world.width / 2, config.world.height / 2);
    this.otherEntites = [];

    this.physics.world.setBounds(0, 0, config.world.width, config.world.height);
    this.createBackground();

    if (config.debugMode) {
      this.createGrid();
    }

    this.spawnPlayer();
    this.playerEntity.getBody().setVelocity(-1,-1);
    //this.spawnOtherPlayers();
    this.setUpCamera();
  }

  public update() {
    const centerX = config.window.width / 2;
    const centerY = config.window.height / 2;

    const mouseX = this.input.x;
    const mouseY = this.input.y;

    const velX = this.playerEntity.getBody().velocity.x;
    const velY = this.playerEntity.getBody().velocity.y;

    const mouseAngle = Between(centerX, centerY, mouseX, mouseY) * 180 / Math.PI;
    const velAngle = Between(0, 0, velX, velY) * 180 / Math.PI;
    const accAngle = averageAngles(mouseAngle, velAngle);

    console.log(`Mouse angle: ${mouseAngle}\nVelocity angle: ${velAngle}\naccAngle: ${accAngle}`);
    //const maxAcc = config.entity.maxAcceleration;

    //const accX = Math.cos(accAngle) * maxAcc;
    //const accY = Math.sin(accAngle) * maxAcc;

    //this.playerEntity.getBody().setAcceleration(accX, accY);
    this.updateCamera();
  }

  private spawnPlayer(): void {
    this.playerEntity.addToScene();
    this.playerEntity.addToScenePhysic();
    this.playerEntity.getBody().setCollideWorldBounds(true);
  }

  private spawnOtherPlayers(): void {
    for (let i = 0; i < 20; i++) {
      const mass = Math.random() * 5000;
      const radius = Entity.convertMassToRadius(mass);
      const entity = new Entity(
        this,
        Math.random() * config.world.width - radius * 2,
        Math.random() * config.world.height - radius * 2,
        mass,
      );
      entity.addToScene();
      entity.addToScenePhysic();
      entity.getBody().setVelocity(Math.random() * 100, Math.random() * 100);
      entity.getBody().setCollideWorldBounds(true, 1, 1);
      entity.setFillStyle(0xffeeee, 1);
      entity.getBody().setBounce(1, 1);
      this.otherEntites.forEach((otherEntity) => {
        Entity.addEntityToEntityCollision(entity, otherEntity, this);
      });
      Entity.addPlayerEntityToEntityCollision(this.playerEntity, entity, this, this.otherEntites);
      this.otherEntites.push(entity);
    }
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor(config.styles.backgroundColor);
    //this.add.rectangle(config.world.width / 2, config.world.height / 2, config.world.width, config.world.height, 0x80cccc,1).setOrigin(0.5, 0.5);
  }

  private createGrid(): void {
    const worldWidth = config.world.width;
    const worldHeight = config.world.height;

    this.add.grid(worldWidth / 2, worldHeight / 2, worldWidth, worldHeight, 200, 200, undefined, undefined, 0xffffff);
  }

  private setUpCamera(): void {
    this.cameras.main.startFollow(this.playerEntity);
  }

  private updateCamera(): void {
    const viewHeight = 2 * this.playerEntity.radius * config.camera.entityToViewRatio;
    const zoom = config.window.height / viewHeight;
    this.cameras.main.setZoom(zoom, zoom);
  }
}
