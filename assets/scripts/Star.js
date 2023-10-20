// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,
    },

    getPlayerDistance: function () {
        // judge the distnace according to the playe node's position
        var playerPos = this.game.player.getPosition();
        //calculate the distance between two nodes according to their positions
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function () {
        // When stars are being collected, invoke the interface in the Game script to generate a new star
        this.game.spawnNewStar();
        // invoke the scoring method of game script
        this.game.gainScore();
        // then destroy the current star's node
        this.node.destroy();
        
    },

    update: function (dt) {
        //judge if distance between star and main character is less than the collecting distance for each frame
        if (this.getPlayerDistance() < this.pickRadius) {
            //invoke collecting behaviour
            this.onPicked();
            return;
        }

        //update the transparency of the star according to the timer
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));

    },
});
