class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/start.wav');
        this.load.audio('sfx_explosion', './assets/eating.wav');
        this.load.audio('sfx_rocket', './assets/fire.wav');
        this.load.image('open', './assets/open.png');
        this.load.audio('TITLEBGM', './assets/Ringo.wav');


    }

    create() {
      //add bgm
      this.bgm = this.sound.add('TITLEBGM', {
        mute:false,
        volume:0.4,
        rate:1,
        loop:true
     });

    this.bgm.play();
      //set title
      this.open = this.add.tileSprite(0, 0,1024, 578, 'open').setOrigin(0, 0);
      // menu text configuration
      let menuConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '36px',
            color: '#59118c',
            align: 'right',
            padding: {
                top: 10,
                bottom: 40,
            },
            fixedWidth: 0
        }
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/4 - borderUISize - borderPadding, 'ROCKET PATROL Ver.2', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2.4, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use mouse click to control & fire', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize +borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 5,
            gameTimer: 90000    
          }
          this.sound.play('sfx_select');
          this.bgm.pause('TITLEBGM')  ;
          this.scene.start("playScene");  
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 20,
            gameTimer: 90000    
          }
          this.sound.play('sfx_select');
          this.bgm.pause('TITLEBGM');
          this.scene.start("playScene");    
        }
      }
}