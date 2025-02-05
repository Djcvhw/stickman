import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {
  private tween: number = 1;

  private game = null;

  @property(cc.Node)
  startScreen: cc.Node = null;

  @property(cc.Node)
  gameOverScreen: cc.Node = null;

  private startScreenUUID: string = null;
  private gameOverScreenUUID: string = null;

  init(game: Game): void {
    this.game = game;
    this.startScreenUUID = this.startScreen.uuid;
    this.gameOverScreenUUID = this.gameOverScreen.uuid;
  }

  move() {
    cc.tween(this.node)
      .to(this.tween, {
        position: cc.v3(this.game.player.x + this.game.node.width / 2 - this.game.player.width),
      })
      .call(() => this.game.nextTick())
      .start();
  }
}
