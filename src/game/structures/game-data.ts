import { Socket } from 'socket.io-client';
import { GameScene } from '../../application/scenes/game.scene';
import { SocketEvent } from '../../application/enums/socket-event.enum';
import { EntityDataModel, ServerDataModel } from '../models/server-data.model';
import { EntityFactory } from '../factories/entity.factory';

export class GameData {
  constructor(private readonly socket: Socket, private readonly gameScene: GameScene, private readonly username: string) {
    this.initializeListeners();
  }

  private initializeListeners(): void {
    this.socket.on(SocketEvent.GAME_UPDATE, this.handleGameUpdate.bind(this));
  }

  private handleGameUpdate(data: ServerDataModel): void {
    this.emitPlayerUpdate();

    let playerEntityData;
    const otherEntitiesData = [] as EntityDataModel[];

    data.entities.forEach((entityData) => {
      if (entityData.name === this.username) {
        playerEntityData = entityData;
      } else {
        otherEntitiesData.push(entityData);
      }
    });

    this.replaceOtherPlayers(otherEntitiesData);
  }

  private replaceOtherPlayers(entitiesData: EntityDataModel[]): void {
    const entities = entitiesData.map((entityData) => {
      const entity = EntityFactory.createOtherPlayerEntity(this.gameScene, entityData.position.x, entityData.position.y, entityData.mass);
      entity.addToScene();
      entity.addToScenePhysic();
      entity.getBody().setVelocity(entityData.velocity.x, entityData.velocity.y);
      entity.getBody().setAcceleration(entityData.acceleration.x, entityData.acceleration.y);
      entity.getBody().setCollideWorldBounds(true);

      return entity;
    });

    this.gameScene.setOtherPlayers(entities);
  }

  private emitPlayerUpdate(): void {
    const entity = this.gameScene.getPlayerEntity();
    const { position, velocity, acceleration } = entity.getBody();

    const entityData = {
      position,
      velocity,
      acceleration,
      mass: entity.getMass(),
    };

    this.socket.emit(SocketEvent.PLAYER_UPDATE, (entityData));
  }
}
