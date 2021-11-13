import config from '../../config/config';
import textureBackground from '../../assets/textures/mock-background.jpg';
import * as Phaser from 'phaser';
import { Entity } from '../../game/structures/entity';
import { EntityFactory } from '../../game/factories/entity.factory';
import Vector2 = Phaser.Math.Vector2;

const entityFactory = new EntityFactory();

export class GameScene extends Phaser.Scene {
  private playerEntity!: Entity;
  private otherEntites!: Entity[];

  public preload(): void {
    this.load.image('background', textureBackground);
  }

  public create(): void {
    this.playerEntity = entityFactory.createNewPlayerEntity(this, config.world.width / 2, config.world.height / 2);
    this.otherEntites = [];

    this.physics.world.setBounds(0, 0, config.world.width, config.world.height);
    this.createBackground();

    if (!config.debugMode) {
      this.createGrid();
    }

    this.spawnPlayer();
    this.playerEntity.getBody().setVelocity(1,1);
    this.spawnOtherPlayers();
    this.setUpCamera();
  }

  public update() {
    const center = new Vector2(config.window.width / 2, config.window.height / 2);
    const mouse = new Vector2(this.input.x, this.input.y);

    const velocity = new Vector2( (mouse.x - center.x), (mouse.y - center.y));
    this.playerEntity.getBody().setVelocity(velocity.x, velocity.y);

    /*const centerX = config.window.width / 2;
    const centerY = config.window.height / 2;

    const mouseX = this.input.x;
    const mouseY = this.input.y;

    const velX = this.playerEntity.getBody().velocity.x;
    const velY = this.playerEntity.getBody().velocity.y;

    const [normVelX, normVelY] = normalizeDirectionVector(velX,velY);
    const [normMouseX, normMouseY] = normalizeDirectionVector((mouseX-centerX)/2,(mouseY-centerY)/2);

    const maxAcc = config.entity.maxAcceleration;

    const accX = (normMouseX*1.1 - normVelX) * maxAcc;
    const accY = (normMouseY*1.1 - normVelY) * maxAcc;

    this.playerEntity.getBody().setAcceleration(accX,accY);*/

    this.playerEntity.update();
    this.otherEntites.forEach(entity => entity.update());
    //this.updateCamera();
  }

  private spawnPlayer(): void {
    this.playerEntity.addToScene();
    this.playerEntity.addToScenePhysic();
    this.playerEntity.getBody().setCollideWorldBounds(true);
  }

  private spawnOtherPlayers(): void {
    for (let i = 0; i < 20; i++) {
      const mass = config.entity.minMass +  Math.random() * (config.entity.massVelocityCapacity - config.entity.minMass);
      const radius = Entity.convertMassToRadius(mass);
      const x = Math.random() * config.world.width - radius * 2;
      const y = Math.random() * config.world.height - radius * 2;
      const entity = entityFactory.createOtherPlayerEntity(this, x, y, mass);
      entity.addToScene();
      entity.addToScenePhysic();
      entity.getBody().setVelocity(Math.random() * 100, Math.random() * 100);
      entity.getBody().setCollideWorldBounds(true, 1, 1);
      entity.getBody().setBounce(1, 1);

      this.otherEntites.forEach((otherEntity) => {
        Entity.addEntityToEntityCollision(entity, otherEntity, this);
      });
      Entity.addPlayerEntityToEntityCollision(this.playerEntity, entity, this);
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
    this.updateCameraZoom();
  }

  private updateCameraZoom(): void {
    const viewHeight = 2 * this.playerEntity.radius * config.camera.entityToViewRatio;
    const zoom = config.window.height / viewHeight;
    this.cameras.main.setZoom(zoom, zoom);
  }
}
