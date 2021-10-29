import { Game } from 'phaser';
import { SceneType } from '../enums/scene.enum';
import { EntryScene } from '../scenes/entry.scene';
import { GameScene } from '../scenes/game.scene';
import { DialogBox } from '../../dom/structures/dialog-box';
import { getGameConfig } from '../helpers/game-config.helper';

export class Application {
  private readonly dialogBox = new DialogBox(this);
  private readonly game = new Game(getGameConfig());
  private activeScene?: SceneType;

  constructor() {
    this.initScenes();
  }

  public start(): void {
    this.changeScene(SceneType.ENTRY);
  }

  public connect(name: string): void {
    console.log(`Connecting with name '${name}'...`);
    this.changeScene(SceneType.GAME);
    console.log(`Connected. (not really, this is a mock)`);
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
}
