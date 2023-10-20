// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       // this property quotes the  Prefab
        starPrefab: {
            default: null,
            type: cc.Prefab
        },

        //the random scale of disappearing time for stars
        maxStarDuration: 0,
        minStarDuration: 0,

        //ground node for confirming the height of generated star's position
        ground: {
            default: null,
            type: cc.Node
        },

        //player node for obtaining the jump height of the chracter and  controlling the movement of the main character
        player: {
            default: null,
            type: cc.Node
        },

        //score node for the game
        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        scoreAudio: {
            default: null,
            type: cc.AudioClip
        }


    },

    

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        //obtain anchor point of ground level on y axis
        this.groundY = this.ground.y + this.ground.height / 2; 
        // generates a new star 
        this.spawnNewStar();
        // initialize scoring
        this.score = 0;
        // initialize timer
        this.timer = 0;
        this.starDuration = 0;
    },

    spawnNewStar: function () {
        //generate a new node in the scene with preset template
        var newStar = cc.instantiate(this.starPrefab);
        //put newly added node under canvas ndode
        this.node.addChild(newStar);
        //set up a random position for star
        newStar.setPosition(this.getNewStarPosition());   
        newStar.getComponent('Star').game = this;
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;

    },

    getNewStarPosition: function () {
        var randX = 0;
        // According to the position of the ground level and the main character's jump height, randomly obtain an anchor point
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // According to width of the screen, randomly obtain the anchor point of star on x axis
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        //return to the anchor point of the star
        return cc.v2(randX, randY);


    },
   

   

    update: function (dt) {
        // update timer for each frame when a new star is not generated after exceeding duration
        //invoke the logic of game failure
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    },

    gainScore: function () {
        this.score += 1;
        //update words of score label
        this.scoreDisplay.string = 'Score: ' + this.score;
        // play the scoring soud effect
        cc.audioEngine.playEffect(this.scoreAudio, false);

    },

    gameOver: function () {
        this.player.stopAllActions(); // stop the jumping action
        cc.director.loadScene('game');
    }
   
   
});
