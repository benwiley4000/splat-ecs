module.exports = function(ecs, game) {
  game.entities.registerSearch("applyMovement2d", ["velocity", "movement2dAnalog"]);
  ecs.addEach(function applyMovement2dAnalog(entity) {
    var velocity = game.entities.getComponent(entity, "velocity");
    var movement2dAnalog = game.entities.getComponent(entity, "movement2dAnalog");
    velocity.y = Math.min(
      Math.max(movement2dAnalog.yCoord, movement2dAnalog.upMax),
      movement2dAnalog.downMax
    );
    velocity.x = Math.min(
      Math.max(movement2dAnalog.xCoord, movement2dAnalog.leftMax),
      movement2dAnalog.rightMax
    );
  }, "applyMovement2dAnalog");
};
