import config from '../../config/config';

export class GameScene extends Phaser.Scene {
  private playerEntity: Phaser.GameObjects.GameObject | undefined;

  public preload(): void {
    this.load.image('background', 'src/assets/textures/mock-background.jpg');
  }

  public create(): void {
    //this.cameras.main.setBackgroundColor(config.styles.backgroundColor);

    let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
    let scaleX = this.cameras.main.width / image.width;
    let scaleY = this.cameras.main.height / image.height;
    let scale = Math.max(scaleX, scaleY);
    image.setScale(scale).setScrollFactor(0);

    this.add.image(0, 0, 'background');
    this.playerEntity = this.add
      .circle(config.window.width / 2, config.window.height / 2, 10, 0xffffff, 1)
      .setOrigin(0.5, 0.5);
    //this.physics.add.existing(this.playerEntity);
    //this.playerEntity.body.setVelocity(10, 10);
  }

  public update() {
    //const x = this.playerEntity.body.x;
    //const y = this.playerEntity.body.y;
    //(this.playerEntity.body as Phaser.Physics.Arcade.Body).x = this.input.x - 10;
    //(this.playerEntity.body as Phaser.Physics.Arcade.Body).y = this.input.y - 10;
  }
}
