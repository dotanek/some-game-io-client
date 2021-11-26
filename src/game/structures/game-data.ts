import { Socket } from 'socket.io-client';
import { GameScene } from '../../application/scenes/game.scene';
import { SocketEvent } from '../../application/enums/socket-event.enum';
import { EntityDataModel, ServerDataModel } from '../models/server-data.model';
import { EntityFactory } from '../factories/entity.factory';
import config from '../../config/config';
import { Entity } from './entity';

export class GameData {
  private updateInterval: number;

  constructor(private readonly socket: Socket, private readonly gameScene: GameScene, private readonly username: string) {
    this.initializeListeners();

    this.updateInterval = setInterval(this.emitPlayerUpdate.bind(this), config.socket.updateRate);
  }

  public remove(): void {
    clearInterval(this.updateInterval);
    this.removeListeners();
  }

  private initializeListeners(): void {
    this.socket.on(SocketEvent.GAME_UPDATE, this.handleGameUpdate.bind(this));
  }

  private removeListeners(): void {
    this.socket.removeListener(SocketEvent.GAME_UPDATE);
  }

  private handleGameUpdate(data: ServerDataModel): void {
    if (!this.gameScene.isCreated()) {
      return;
    }

    const playerEntityData = data.entities[this.username];
    const otherEntitesDataArray = Object.values(data.entities).filter((entityData) => entityData.name !== this.username);

    console.log(data.entities);

    this.updateOtherEntities(otherEntitesDataArray);
    //this.updatePlayerEntity(playerEntityData);
  }

  private updatePlayerEntity(playerEntityData: EntityDataModel): void {
    this.gameScene.getPlayerEntity().updateWithData(playerEntityData);
  }

  private updateOtherEntities(otherEntitesData: EntityDataModel[]): void {
    const otherEntites = this.gameScene.getOtherEntities();
    const otherEntitesNew: Record<string, Entity> = {};

    otherEntitesData.forEach((entityData) => {
      const name = entityData.name;
      const entity = otherEntites[name];

      if (entity) {
        delete otherEntites[name];
        otherEntitesNew[name] = entity;
      } else {
        otherEntitesNew[name] = this.createNewEntity(name);
      }

      otherEntitesNew[name].updateWithData(entityData);
    });

    this.gameScene.replaceOtherEntities(otherEntitesNew);
  }

  private emitPlayerUpdate(): void {
    if (!this.gameScene.isCreated()) {
      return;
    }

    const entity = this.gameScene.getPlayerEntity();
    const { position, velocity, acceleration } = entity.getBody();

    const entityData = {
      position,
      velocity,
      acceleration,
      mass: entity.getMass(),
    };

    this.socket.emit(SocketEvent.PLAYER_UPDATE, entityData);
  }

  private createNewEntity(name: string): Entity {
    const entity = EntityFactory.createOtherEntity(this.gameScene, 0, 0, 0, name);

    entity.addToScene();
    entity.addToScenePhysic();

    return entity;
  }
}
