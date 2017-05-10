// Initialize Phaser, and create a 700x500px game
var game = new Phaser.Game(700, 500, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() {
        //Change the background color to something more sky-like
        game.stage.backgroundColor = "#6495ED";

        //Load the game sprites
        game.load.spritesheet('mario', 'assets/marioSpriteSheet.png', 51, 51);
        game.load.image('brick', 'assets/brick.png');
    },

    create: function() {
        //Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Display Mario on the screen
        this.mario = this.game.add.sprite(100,320,'mario');
        //Sets mario's sprite frame to the 0th one
        this.mario.frame = 0;

        //Creates an animation for mario using the first, second, and third frames at 10fps
        //true turns looping on
        this.mario.animations.add('moving', [1,2,3], 15, true);

        //Makes sure Mario flips around his x-axis
        this.mario.anchor.setTo(0.5, 1);

        //Add gravity to Mario to make him fall
        game.physics.arcade.enable(this.mario);
        this.mario.body.gravity.y = 2500;

        //Create a new TileSprite that can hold the bricks for Mario to stand on
        this.brickTile = this.game.add.tileSprite(0,500-40,800,500-(320+44),'brick');
        //Adds physics to brickTile
        game.physics.arcade.enable(this.brickTile);
        //Makes sure that Mario can never move the ground
        this.brickTile.body.immovable = true;

        //Call the 'jump' function when the space bar is hit
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.jump, this);

        //Adds the left key to the program
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        //Adds the right key to the program
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        //Create a variable to see whether Mario is on the ground
        this.isOnGround = false;
    },

    update: function() {
        //If Mario goes out of the frame, the game will restart

        if(this.mario.inWorld == false) {
            this.restartGame();
        }

        if (game.isOnGround && Math.abs(this.mario.body.velocity.x) > 0){
            this.mario.animations.play('moving')
        }


        //If neither keys are pressed
        if(this.leftKey.isUp && this.rightKey.isUp || (this.leftKey.isDown && this.rightKey.isDown)) {

            this.brickTile.stopScroll();

            this.mario.body.gravity.x = 0; //This keeps mario from speeding up in the air

            if (this.mario.body.velocity.x < 5 && this.mario.body.velocity.x > -5) {
                //Makes mario stand if moving very slowly
                this.mario.body.velocity.x = 0;

                //Makes mario stand if not moving on the ground
                if (game.isOnGround) {
                    this.mario.animations.stop();
                    this.mario.frame = 0;
                }
            }

            //Mario will slow down to a stop, but only if on the ground
            if (game.isOnGround){
                if (this.mario.body.velocity.x > 0) {
                    this.mario.body.gravity.x = -400;
                }
                else if (this.mario.body.velocity.x < 0) {
                    this.mario.body.gravity.x = 400;
                }
                else {
                    this.mario.body.gravity.x = 0;
                }
            }
        }

        //If the a key is pressed, mario accelerates until he reaches full speed

        //Left key
        else if(this.leftKey.isDown && this.rightKey.isUp){

            this.brickTile.stopScroll();

            //Makes mario face to the left
            this.mario.scale.x = -1;

            if (this.mario.body.velocity.x > -200) {
                this.mario.body.gravity.x = -500;
            }
            else {
                this.mario.body.gravity.x = 0;
            }

        }

        //Right key
        else if(this.leftKey.isUp && this.rightKey.isDown){

            //Makes mario face to the right
            this.mario.scale.x = 1;

            if (this.mario.body.velocity.x < 200) {
                this.mario.body.gravity.x = 500;
            }
            else {
                this.mario.body.gravity.x = 0;
            }

            if (this.mario.x > 250){
                this.mario.body.velocity.x = 0;
                this.brickTile.autoScroll(-150,0);
            }

        }

        //If mario collides with the brickTile, he will stop falling
        //This will also set 'isOnGround' to true
        game.physics.arcade.collide(this.mario, this.brickTile, this.marioIsOnGround);
    },

    marioIsOnGround: function() {
        game.isOnGround = true;
    },

    jump: function() {
        //Give Mario a vertical velocity if isOnGround == true
        if (game.isOnGround) {
            this.mario.body.velocity.y = -900;
            //No longer on the ground
            game.isOnGround = false;
            //Set mario's frame to jumping
            this.mario.animations.stop();
            this.mario.frame = 4;
        }
    },

    restartGame: function() {
        //Starts the 'main' state, which returns to the game
        game.state.start('main');
    }
};

// AAdd and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');