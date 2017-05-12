//Tutorial created by Jake Present, unpaid intern
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
        game.load.image('brick', 'assets/brick.png');
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

        //Makes sure Mario flips around his x-axis
        this.mario.anchor.setTo(0.5, 1);

        //Adds the left key to the program
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        //Adds the right key to the program
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        //Creates a group of blocks for mario to jump on
        this.blocks = game.add.group(); //Creates a group
        this.blocks.enableBody = true; //Adds physics to the group
        this.blocks.createMultiple(21, 'brick'); //Creates 21 blocks

        //Adds the two starting platforms
        this.addPlatform(0, 500-34);
        this.addPlatform(34*3, 500-34);

        //Create a variable to see whether Mario is on the ground
        this.isOnGround = false;

        //Creates an animation for mario using the first, second, and third frames at 10fps
        //true turns looping on
        this.mario.animations.add('moving', [1,2,3], 15, true);

        //Creates 5 starting blocks
        for (var i = 0; i < 5; i++) {
            this.addPlatformToGame();
        }
    },

    update: function() {

        //If Mario falls out of the frame, the game will restart
        if(this.mario.y >= 500) {
            this.restartGame();
        }

        //If neither key is pressed
        if(this.leftKey.isUp && this.rightKey.isUp || (this.leftKey.isDown && this.rightKey.isDown)) {

            //Stops mario from moving
            this.mario.body.velocity.x = 0;

            //Sets mario's frame to the one where he stands
            if(game.isOnGround) {
                this.mario.frame = 0;
            }
        }

        //If the a key is pressed, mario starts running

        //Left key
        else if(this.leftKey.isDown && this.rightKey.isUp){

            //Makes mario face to the left
            this.mario.scale.x = -1;

            //Gives mario his leftward speed
            this.mario.body.velocity.x = -200;

            //Plays the moving animation if moving and on ground
            if (game.isOnGround) {
                this.mario.animations.play('moving');
            }
            
            //Prevents mario from going off screen to the left
            if(this.mario.x < 21){
                this.mario.body.velocity.x = 0;
            }

            //Plays the moving animation if moving and on ground
            if (game.isOnGround) {
                this.mario.animations.play('moving');
            }
        }

        //Right key
        else if(this.rightKey.isDown && this.leftKey.isUp){

            //Makes mario face to the right
            this.mario.scale.x = 1;

            //Gives mario his rightward speed
            this.mario.body.velocity.x = 200;

            //Plays the moving animation if moving and on ground
            if (game.isOnGround) {
                this.mario.animations.play('moving');
            }
        }

        //If mario collides with the any member of the 'blocks' group, he will stop falling
        //This will also set 'isOnGround' to true
        game.physics.arcade.collide(this.mario, this.blocks, this.marioIsOnGround);
    },

    jump: function() {
        //Give Mario a vertical velocity if isOnGround == true and if he isn't already moving in the y direction
        if (game.isOnGround && this.mario.body.velocity.y == 0) {
            this.mario.body.velocity.y = -900;

            //No longer on the ground
            game.isOnGround = false;
        }

        //Set mario's frame to jumping
        this.mario.animations.stop();
        this.mario.frame = 4;
    },

    restartGame: function() {
        //Starts the 'main' state, which returns to the game
        game.state.start('main');
    },

    addBlock: function(x, y) {
        //Get the first dead block in our group
        var block = this.blocks.getFirstDead();

        //Set the new position of the block
        block.reset(x, y);

        //Makes sure mario can't push blocks around
        block.body.immovable = true;

    },

    //Adds three blocks in a row
    addPlatform: function(x, y) {
        //block sprite is 34x34
        this.addBlock(x, y);
        this.addBlock(x+34, y);
        this.addBlock(x+(34*2), y);
    },

    marioIsOnGround: function() {
        game.isOnGround = true;
    },

    //Adds a platform at a random but jumpable height after the given hole vaule
    addPlatformToGame: function() {
        var yRandHeight = Math.floor(Math.random() * 500) + 1;

        var holeSize = 150;

        //Loop through all blocks and find the highest x value
        var x = this.getLastAddedBlock().x;

        //if yRandHeight is not jumpable, it will keep resetting it until it works
        while (this.checkJumpable(yRandHeight) == false) {
            yRandHeight = Math.floor(Math.random() * 500) + 1;
        }

        //Adds a new platform at the new position
        this.addPlatform(x + holeSize, yRandHeight);
    },

    //Loops through all blocks, finds the one with the highest x value, and returns it
    getLastAddedBlock: function() {
        var x = 0;
        var lastAddedBlock;
        for (var i = 0; i < this.blocks.length; i++){
            if (this.blocks.children[i].x > x){
                x = this.blocks.children[i].x
                lastAddedBlock = this.blocks.children[i];
            }
        }
        return lastAddedBlock;
    },

    //Checks if a block with a given y value can be jumped to from the last created block
    checkJumpable: function(y) {

        var lastAdded = this.getLastAddedBlock();

        if (lastAdded.y - y < 130 && y < 466)
            return true;

        return false;
    }
};

// AAdd and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');