// Initialize Phaser, and create a 700x500px game
var game = new Phaser.Game(700, 500, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() {
        //Change the background color to something more sky-like
        game.stage.backgroundColor = "#6495ED"

        //Load the game sprites
        game.load.image('marioStand', 'assets/marioStand.png');
        game.load.image('marioRun1', 'assets/marioRun1.png');
        game.load.image('marioRun2', 'assets/marioRun2.png');
    },

    create: function() {
        //Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Display Mario on the screen
        this.mario = this.game.add.sprite(100,300,'marioStand');

        //Add gravity to Mario to make him fall
        game.physics.arcade.enable(this.mario);
        this.mario.body.gravity.y = 1776;

        //Call the 'jump' function when the space bar is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },

    update: function() {
        //If Mario goes out of the frame, the game will restart

        if(this.mario.inWorld == false) {
            this.restartGame();
        }
    },

    jump: function() {
        //Give Mario a vertical velocity
        this.mario.body.velocity.y = -600;
    },

    restartGame: function() {
        //Starts the 'main' state, which returns to the game
        game.state.start('main');
    }
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');