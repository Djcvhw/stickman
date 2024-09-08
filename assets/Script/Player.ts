import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  private tween: number = 1;

  private game = null;

  @property({
    type: cc.AudioClip,
  })
  fallAudio: cc.AudioClip = null;

  init(game: Game): void {
    this.game = game;
    this.node.zIndex = 2;
  }

  run(height) {
    const nextPlatform = this.game.platforms[this.game.platforms.length - 1];
    const stick = this.game.sticks[this.game.sticks.length - 1];
    let path = this.node.x + height + this.node.width;
    if (path >= nextPlatform.x && path <= nextPlatform.x + nextPlatform.width) {
      if (
        stick.x + stick.height + stick.width >= nextPlatform.x + nextPlatform.width / 2 &&
        stick.x + stick.height + stick.width <=
          nextPlatform.x + nextPlatform.width / 2 + nextPlatform.getChildByName("trigger").width
      ) {
        this.game.gainTrigger();
      }
      path = nextPlatform.x + nextPlatform.width - this.node.width;
      cc.tween(this.node)
        .to(this.getComponent("Player").tween, { position: cc.v3(path, this.node.y) })
        .call(() => {
          this.game.camera.getComponent("Camera").move();
          this.game.gainScore();
        })
        .start();
    } else {
      cc.tween(this.node)
        .to(this.getComponent("Player").tween, { position: cc.v3(path, this.node.y) })
        .call(() => {
          cc.audioEngine.playEffect(this.fallAudio, false);
        })
        .call(() => this.game.gameOver())
        .start();
    }
  }
}
