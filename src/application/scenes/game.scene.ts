import config from '../../config/config';
import textureBackground from '../../assets/textures/mock-background.jpg';
import * as Phaser from 'phaser';
import { Entity } from '../../game/structures/entity';
import Vector2 = Phaser.Math.Vector2;
import { EntityFactory } from '../../game/factories/entity.factory';

export class GameScene extends Phaser.Scene {
  private playerEntity!: Entity;
  private otherEntites!: Record<string, Entity>;
  private created = false;

  public preload(): void {
    this.load.image('background', textureBackground);
  }

  public create(): void {
    this.physics.world.setBounds(0, 0, config.world.width, config.world.height);
    this.createBackground();

    if (!config.debugMode) {
      this.createGrid();
    }

    this.playerEntity = EntityFactory.createNewPlayerEntity(this, config.world.width / 2, config.world.height / 2, '');
    this.otherEntites = {};

    this.spawnPlayer();
    this.spawnOtherPlayers();
    this.setUpCamera();

    this.created = true;
  }

  public update() {
    const center = new Vector2(config.window.width / 2, config.window.height / 2);
    const mouse = new Vector2(this.input.x, this.input.y);

    const velocity = new Vector2(mouse.x - center.x, mouse.y - center.y);
    this.playerEntity.getBody().setVelocity(velocity.x, velocity.y);

    this.playerEntity.update();
    this.getOtherEntitiesArray().forEach((entity) => entity.update());

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
    //this.updateCamera();
  }

  private spawnPlayer(): void {
    this.playerEntity.addToScene();
    this.playerEntity.addToScenePhysic();
    this.playerEntity.getBody().setCollideWorldBounds(true);
  }

  private spawnOtherPlayers(): void {
    this.getOtherEntitiesArray().forEach((entity) => {
      entity.addToScene();
      entity.addToScenePhysic();
    });
  }

  public getPlayerEntity(): Entity {
    return this.playerEntity;
  }

  public getOtherEntities(): Record<string, Entity> {
    return this.otherEntites;
  }

  public setPlayer(entity: Entity): void {
    this.playerEntity = entity;
  }

  public replaceOtherEntities(otherEntites: Record<string, Entity>): void {
    this.getOtherEntitiesArray().forEach((entity) => {
      entity.remove();
    });

    this.otherEntites = otherEntites;
  }

  public isCreated(): boolean {
    return this.created;
  }

  private getOtherEntitiesArray(): Entity[] {
    return Object.values(this.otherEntites);
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor(config.styles.backgroundColor);
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
