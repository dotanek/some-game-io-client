import { Game } from 'phaser';
import { SceneType } from '../enums/scene.enum';
import { EntryScene } from '../scenes/entry.scene';
import { GameScene } from '../scenes/game.scene';
import { DialogBox } from '../../dom/structures/dialog-box';
import { getGameConfig } from '../helpers/game-config.helper';
import { io } from 'socket.io-client';
import config from '../../config/config';
import { SocketEvent } from '../enums/socket-event.enum';

export class Application {
  private readonly dialogBox = new DialogBox(this);
  private readonly game = new Game(getGameConfig());
  private readonly socket = io(config.socket.server);
  private activeScene?: SceneType;

  constructor() {
    this.initScenes();
    this.initListeners();
  }

  public start(): void {
    this.changeScene(SceneType.ENTRY);
  }

  public joinGame(name: string): void {
    console.log(`Joining game with name '${name}'...`);

    this.socket.emit(SocketEvent.GAME_JOIN, name, () => {
      this.changeScene(SceneType.GAME);
    });
  }

  private changeScene(scene: SceneType) {
    if (this.activeScene) {
      this.game.scene.switch(this.activeScene, scene);
    } else {
      this.game.scene.start(scene);
    }

    this.activeScene = scene;
  }

  private initScenes(): void {
    this.game.scene.add(SceneType.ENTRY, EntryScene);
    this.game.scene.add(SceneType.GAME, GameScene);
  }

  private initListeners(): void {
    // Connection
    this.socket.on(SocketEvent.CONNECT, () => {
      console.log(`Connected with id '${this.socket.id}'.`);
    });
    this.socket.on(SocketEvent.DISCONNECT, () => {
      console.log(`Disconnected.`);
    });

    // Game
    this.socket.on(SocketEvent.GAME_UPDATE, (message: string) => {
      console.log(message);
    });
  }
}
