
// Phaser docs: http://phaser.io/docs/2.6.2/index

// Initialize Phaser, and create a 700x500px game
var game = new Phaser.Game(700, 500, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() {
        //Change the background color to something more sky-like
        game.stage.backgroundColor = "#6495ED";

        //Load mario's sprite from a spritesheet with images of 51x51
        game.load.spritesheet('mario', 'assets/marioSpriteSheet.png', 51, 51);
    },

    create: function() {
        //Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Display mario on the screen
        this.mario = this.game.add.sprite(100,320,'mario');
        //Sets mario's sprite frame to the 0th one
        this.mario.frame = 0;

        //Add gravity to Mario to make him fall
        game.physics.arcade.enable(this.mario);
        this.mario.body.gravity.y = 2500;

        //Call the 'jump' function when the space bar is hit
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.jump, this);
    },

    update: function() {

        //If Mario falls out of the frame, the game will restart
        if(this.mario.y >= 500) {
            this.restartGame();
        }
    },

    jump: function() {
        //Give mario some vertical velocity
        this.mario.body.velocity.y = -900;
    },

    restartGame: function() {
        //Starts the 'main' state, which returns to the game
        game.state.start('main');
    }
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');