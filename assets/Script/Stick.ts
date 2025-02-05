const { ccclass, property } = cc._decorator;
import Game from './Game'
import Player from './Player';

@ccclass
export default class Stick extends cc.Component {
  @property(cc.Integer)
  height = 0;

  @property(cc.Integer)
  delta = 10;

  @property(cc.Integer)
  tween = 0.35;

  @property({
    type: cc.AudioClip,
  })
  fallAudio: cc.AudioClip = null;

  private game = null;
  private isIncrease: boolean = false;

  init(game: Game): void {
    this.game = game;
    this.node.zIndex = 3;
  }

  startIncrease() {
    this.isIncrease = true;
  }

  stopIncrease() {
    this.isIncrease = false;
    cc.tween(this.node)
      .to(this.tween, { angle: -90 })
      .call(() => {
        cc.audioEngine.playEffect(this.fallAudio, false);
      })
      .call(this.stop.bind(this))
      .start();
  }

  stop() {
    this.game.player.getComponent(Player).run(this.node.height);
  }

  update(dt) {
    if (this.isIncrease) {
      this.node.height += this.delta;
    }
  }
}
