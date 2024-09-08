import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Platform extends cc.Component {
  @property(cc.Integer)
  min_width = 100;

  @property(cc.Integer)
  max_width = 200;

  @property(cc.Integer)
  positionY = 200;

  @property(cc.Integer)
  tween = 1;

  @property(cc.Integer)
  min_space_between = 150;

  @property(cc.Node)
  trigger: cc.Node = null;

  private game = null;
  private platformWidth: number = 0;

  init(game: Game): void {
    this.game = game;
    this.node.zIndex = 1;
  }

  slide() {
    const prevPlatform = this.game.platforms[this.game.platforms.length - 1];
    this.platformWidth =
      prevPlatform.width * 0.8 < this.trigger.width ? this.trigger.width : prevPlatform.width * 0.8;
    this.node.width = this.platformWidth;
    this.trigger.setPosition(this.platformWidth / 2, this.trigger.y);

    cc.tween(this.node)
      .to(this.getComponent("Platform").tween, { position: cc.v3(this.node.x, this.game.height) })
      .start();
  }
}
