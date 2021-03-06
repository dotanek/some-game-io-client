import { Scene } from 'phaser';
import config from '../../config/config';

export class EntryScene extends Scene {
  public create(): void {
    this.cameras.main.setBackgroundColor(config.styles.backgroundColor);
    this.generateAmbienceBalls(10);

    console.log('created!');
  }

  private generateAmbienceBalls(amount: number) {
    const balls: Phaser.GameObjects.Arc[] = [];

    for (let i = 0; i < amount; i++) {
      const newBall = this.createRandomBall();
      balls.forEach((ball) => this.physics.add.collider(newBall, ball));
      balls.push(newBall);
    }
  }

  private createRandomBall(): Phaser.GameObjects.Arc {
    // Random radius between 20 - 100
    const radius = Math.random() * 60 + 40;

    // Random position within window boundaries
    const positionX = Math.random() * (config.window.width - 2 * radius) + radius;
    const positionY = Math.random() * (config.window.height - 2 * radius) + radius;

    // Random velocities between -50 and 50
    const velocityX = (Math.random() - 0.5) * 100;
    const velocityY = (Math.random() - 0.5) * 100;

    const ball = this.add.circle(positionX, positionY, radius, 0xffffff, 1).setOrigin(0.5, 0.5);
    ball.body = new Phaser.Physics.Arcade.Body(this.physics.world, ball);
    ball.body.setCircle(radius);
    ball.body.setBounce(0.9, 0.9);
    ball.body.setVelocity(velocityX, velocityY);
    ball.body.setCollideWorldBounds(true, 1, 1);
    this.physics.add.existing(ball);

    return ball;
  }
}
