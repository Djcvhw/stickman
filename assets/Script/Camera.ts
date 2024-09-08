import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {
  private tween: number = 1;

  private game = null;

  init(game: Game): void {
    this.game = game;
  }

  move() {
    cc.tween(this.node)
      .to(this.getComponent("Camera").tween, {
        position: cc.v3(this.game.player.x + this.game.node.width / 2 - this.game.player.width),
      })
      .call(() => this.game.nextTick())
      .start();
  }
}
