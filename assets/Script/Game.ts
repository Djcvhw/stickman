const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property(cc.Prefab)
  platformPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  playerPrefab: cc.Prefab = null;

  @property(cc.Label)
  scoreDisplay: cc.Label = null;

  @property(cc.Label)
  gameOverScoreDisplay: cc.Label = null;

  @property(cc.Label)
  maxScoreDisplay: cc.Label = null;

  @property(cc.Node)
  camera: cc.Node = null;

  @property(cc.Node)
  bg: cc.Node = null;

  @property({
    type: cc.AudioClip,
  })
  scoreAudio: cc.AudioClip = null;

  @property({
    type: cc.AudioClip,
  })
  backgroundAudio: cc.AudioClip = null;

  @property(cc.Integer)
  min_space_between = 150;

  @property(cc.Prefab)
  stickPrefab: cc.Prefab = null;

  public platforms: cc.Node[] = [];
  public sticks: cc.Node[] = [];
  private player: cc.Node = null;
  private score: number = 0;
  private height: number = -900;
  private maxScore: number = 0;

  init() {
    const platform = cc.instantiate(this.platformPrefab);
    this.node.addChild(platform);
    platform.width = 300;
    platform.setPosition(platform.width - this.node.width, this.height);
    platform.getComponent("Platform").init(this);
    this.platforms.push(platform);
    this.player = cc.instantiate(this.playerPrefab);
    this.node.addChild(this.player);
    this.player.setPosition(platform.x + platform.width - this.player.width, -300);
    this.player.getComponent("Player").init(this);
    this.camera.getComponent("Camera").init(this);
  }

  onLoad() {
    this.bg.on(cc.Node.EventType.TOUCH_START, this.startIncrease, this);
    this.bg.on(cc.Node.EventType.TOUCH_END, this.stopIncrease, this);
    cc.audioEngine.play(this.backgroundAudio, true, 0.2);
    this.init();
  }

  onStartGame() {
    cc.tween(this.camera.getChildByName("StartScreen"))
      .to(1, { opacity: 0 })
      .call(() => {
        this.camera.getChildByName("StartScreen").active = false;
        this.nextTick();
      })
      .start();
  }

  gainScore() {
    this.score += 1;
    this.scoreDisplay.string = this.score.toString();
    cc.audioEngine.playEffect(this.scoreAudio, false);
  }

  gainTrigger() {
    this.score += 1;
  }

  onResetGame() {
    cc.tween(this.camera.getChildByName("GameOverScreen"))
      .to(1, { opacity: 0 })
      .call(() => {
        this.camera.getChildByName("GameOverScreen").active = false;
        this.score = 0;
        this.scoreDisplay.string = this.score.toString();
        this.platforms.forEach((platform) => {
          platform.destroy();
        });
        this.platforms = [];
        this.sticks.forEach((stick) => {
          stick.destroy();
        });
        this.sticks = [];
        this.camera.setPosition(0, 0);
        this.showStartScreen();
      })
      .start();
  }
  showStartScreen() {
    this.camera.getChildByName("StartScreen").active = true;
    cc.tween(this.camera.getChildByName("StartScreen"))
      .to(1, { opacity: 255 })
      .call(() => {
        this.init();
      })
      .start();
  }

  showGameOverScreen() {
    this.camera.getChildByName("GameOverScreen").active = true;
    cc.tween(this.camera.getChildByName("GameOverScreen"))
      .to(1, { opacity: 255 })
      .start();
  }

  nextTick() {
    const prevPlatform = this.platforms[this.platforms.length - 1];
    const stick = cc.instantiate(this.stickPrefab);
    this.node.addChild(stick);
    stick.setPosition(
      prevPlatform.x + prevPlatform.width - stick.width,
      prevPlatform.y + prevPlatform.height
    );
    const stickComponent = stick.getComponent("Stick");
    stickComponent.init(this);
    this.sticks.push(stick);
    const platform = cc.instantiate(this.platformPrefab);
    this.node.addChild(platform);
    const space = this.getRandom(
      this.min_space_between,
      this.node.width - platform.width - prevPlatform.width
    );
    platform.setPosition(prevPlatform.x + prevPlatform.width + space, this.height * 2);
    platform.getComponent("Platform").init(this);
    platform.getComponent("Platform").slide();
    this.platforms.push(platform);
    this.destroyOldPlatform();
  }

  gameOver() {
    cc.tween(this.player)
      .to(1, { position: cc.v3(this.player.x, this.player.y - 2000), angle: -90 })
      .call(() => {
        this.showGameOverScreen()
        if (this.score > this.maxScore) {
          this.maxScore = this.score;
        }
        this.gameOverScoreDisplay.string = "Score: " + this.score.toString();
        this.maxScoreDisplay.string = "Max Score: " + this.maxScore.toString();
      })
      .start();
  }
  startIncrease() {
    const stick = this.sticks[this.sticks.length - 1].getComponent("Stick");
    stick.startIncrease();
  }
  stopIncrease() {
    const stick = this.sticks[this.sticks.length - 1].getComponent("Stick");
    stick.stopIncrease();
  }
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  destroyOldPlatform() {
    const stick = this.sticks[0];
    if (stick.x + stick.width < this.camera.x - this.node.width / 2) {
      this.platforms[0].destroy();
      this.platforms.shift();
      this.sticks[0].destroy();
      this.sticks.shift();
    }
  }
}
