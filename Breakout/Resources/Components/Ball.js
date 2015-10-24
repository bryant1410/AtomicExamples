"atomic component";

var MAX_SPEED = 4;

//A Ball component
exports.component = function(self) {

    //get a sound source from the scene
    var brickDestroySound = self.scene.getChild("BrickSound").getComponent("SoundSource");
    //function to play the brick destroy sound
    function playBrickDestroySound() {
        brickDestroySound.play(brickDestroySound.sound);
    }

    self.start = function() {
        //define node name
        self.node.name = "Ball";
        self.rigidBody = self.getComponent("RigidBody2D");
        self.subscribeToEvent("PhysicsBeginContact2D", function(data){
            //get an collidable object
            var other = (data.nodeA == self.node) ? data.nodeB : data.nodeA;
            //check collision for a brick
            if (other.name.indexOf("Brick") > -1) {
                //play brick destroy sound
                playBrickDestroySound();
                //remove brick
                other.remove();
            }
        });
    }

    self.update = function(delta) {
        if (!self.started) return;

        //if x || y velocity of the ball is around zero,
        //add 1 velocity to prevent bound up / down or left / right for ever
        if (Math.abs(self.rigidBody.linearVelocity[0]) <= 0.5)
            self.rigidBody.linearVelocity = [self.rigidBody.linearVelocity[0]+1, self.rigidBody.linearVelocity[1]];

        if (Math.abs(self.rigidBody.linearVelocity[1]) <= 0.5)
            self.rigidBody.linearVelocity = [self.rigidBody.linearVelocity[0], self.rigidBody.linearVelocity[1]+1];

        //normalize a ball speed
        if (self.rigidBody.linearVelocity[0] > MAX_SPEED)
            self.rigidBody.linearVelocity = [MAX_SPEED, self.rigidBody.linearVelocity[1]];

        if (self.rigidBody.linearVelocity[1] > MAX_SPEED)
            self.rigidBody.linearVelocity = [self.rigidBody.linearVelocity[0], MAX_SPEED];

        //check if a ball fell down
        if (self.node.position2D[1] <= -4) {
            self.remove();
        }
    }
}
