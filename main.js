// Initialize Phaser, and create a 700x500px game
var game = new Phaser.Game(700, 500, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() {
        //Change the background color to something more sky-like
        game.stage.backgroundColor = "#6495ED";

        //Load the game sprites
        game.load.image('marioStand', 'assets/marioStand.png');
        game.load.image('marioRun1', 'assets/marioRun1.png');
        game.load.image('marioRun2', 'assets/marioRun2.png');
        game.load.image('brick', 'assets/brick.png');
    },

    create: function() {
        //Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Display Mario on the screen
        this.mario = this.game.add.sprite(100,320,'marioStand');

        //Add gravity to Mario to make him fall
        game.physics.arcade.enable(this.mario);
        this.mario.body.gravity.y = 1776;

        //Call the 'jump' function when the space bar is hit
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.jump, this);

        //Create a new TileSprite that can hold the bricks for Mario to stand on
        this.brickTile = this.game.add.tileSprite(0,500-40,800,500-(320+44),'brick');
        //Adds physics to brickTile
        game.physics.arcade.enable(this.brickTile);
        //Makes sure that Mario can never move the ground
        this.brickTile.body.immovable = true;

        //Create a variable to see whether Mario is on the ground
        this.isOnGround = false;
    },

    update: function() {
        //If Mario goes out of the frame, the game will restart

        if(this.mario.inWorld == false) {
            this.restartGame();
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
        console.log(this.isOnGround);
        if (game.isOnGround) {
            this.mario.body.velocity.y = -600;
            game.isOnGround = false;
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