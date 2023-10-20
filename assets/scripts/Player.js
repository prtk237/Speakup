// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // Jump Height
        jumpHeight: 0,
        // Jump Duration
        jumpDuration: 0,
        // Maimum Movement Speed
        maxMoveSpeed: 0,
        // Acceleration
        accel: 0,
        // Jumping Sound Effect
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
      
    },

    onKeyDown(event) {
        // set a flag when kew pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;

        }
    },

    onKeyUp(event) {
        // unset a flag when kew pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;

        }
    },

    setJumpAction: function () {
        // Jump Up
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // Jump Down
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // add callback function
        var callback = cc.callFunc(this.playJumpSound, this);
        // Repeat
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpSound: function () {
        // invoke sound engine to play sound
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    // LIFE-CYCLE CALLBACKS:

        onLoad: function () {
            // initialize Jump Action
            this.jumpAction = this.setJumpAction();
            this.node.runAction(this.jumpAction);
            //Acceleration direction switch
            this.accLeft = false;
            this.accRight = false;
            // The main character's current horizontal velocity
            this.xSpeed = 0;

            // initialize the Keyboard Input Listening
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            
        },

    onDestroy() {
        // cancel Keyboard Input Monitoring
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    },

    

    start () {

    },


    update: function (dt) {
        //update speed of each frame according to the current acceleration direction
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        }
        else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        //restrict the movement speed of the main character to maximum movement speed
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            //if speed reaches limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // update the position of main character according to the current speed
        this.node.x += this.xSpeed * dt;

    },
});
