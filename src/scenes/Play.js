class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

   
    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/eat.png');
        this.load.image('spaceship', './assets/marshmallow.png');
        this.load.image('cupcake', './assets/CUPCAKE.png');
        this.load.image('starfield', './assets/wonderland.png');
        this.load.audio('BGM', './assets/BGM.wav');


        // load spritesheet
        this.load.spritesheet('explosion', './assets/gg.png', {frameWidth:120, frameHeight:86, startFrame: 0, endFrame: 10});
    }

    create() {
        //add bgm
        this.bgm = this.sound.add('BGM', {
            mute:false,
            volume:0.4,
            rate:1,
            loop:true
        });
        this.bgm.play();
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0,1024, 578, 'starfield').setOrigin(0, 0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0, 0);

        // add Spaceships (x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*2, borderUISize*2, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*3 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*4 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship(this, game.config.width, +borderUISize*6 + borderPadding*5, 'cupcake', 0, 5).setOrigin(0,0);


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //Mouse Control
        //reference:https://phaser.discourse.group/t/move-by-mouse/5564, https://www.youtube.com/watch?v=teZavPHW4uQ, and https://phaser.io/examples/v3/view/input/mouse/right-mouse-button
        //locked the fire object by mouse control
		this.input.on('pointerdown', function(pointer){

            this.input.mouse.requestPointerLock();

            if (!this.p1Rocket.isFiring && !this.gameOver && pointer.leftButtonDown()) {

                this.p1Rocket.type = 0;
                this.p1Rocket.isFiring = true;

                this.p1Rocket.sfxRocket.play();

            } 
            else if (!this.p1Rocket.isFiring && !this.gameOver && pointer.rightButtonDown() && this.p1Rocket.rtypeNumber > 0) {

                this.p1Rocket.isFiring = true;
                this.p1Rocket.type = 1;
                this.p1Rocket.setFlipY(true); 
                this.p1Rocket.rtypeNumber--;

                this.p1Rocket.sfxRocket.play();
            }

        }, this);
        //moving the cursors
        this.input.on('pointermove', function (pointer) {

                if (!this.p1Rocket.isFiring && !this.gameOver && this.input.mouse.locked) {

                    this.p1Rocket.x += pointer.movementX;
                    this.p1Rocket.x = Phaser.Math.Wrap(this.p1Rocket.x, 0, game.renderer.width);
                }
            

        }, this);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 10, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score, setting up background message
        let scoreConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '30px',
            color: '#B87CB0',
            align: 'right',
            padding: {
                top: 45,
                bottom: 80,
            },
            fixedWidth: 150
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

         update() {
             //check game is continue to play
             if(!this.gameOver) {
                this.p1Rocket.update();             // update p1
                this.ship01.update();             // update spaceship (x4)
                this.ship02.update();
                this.ship03.update();
                this.ship04.update();
            }
        //pause bgm when game ends
        if(this.gameOver){
            this.bgm.pause();
        }
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        //if restart, replay BGM
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
			this.bgm.pause();
            this.scene.restart();
        }


        // check collisions
       if(this.checkCollision(this.p1Rocket, this.ship04)) {
			this.p1Rocket.reset();
			this.shipExplode(this.ship04);
       }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }
        //check collisons for 3 ships
        checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

        shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += 0.6*ship.points;
        this.scoreLeft.text = this.p1Score; 
        
        this.sound.play('sfx_explosion');
      }
}