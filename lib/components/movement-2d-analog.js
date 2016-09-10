module.exports = {
  factory: function() {
    return {
      yCoord: 0,
      xCoord: 0,
      upMax: -1.0,
      downMax: 1.0,
      leftMax: -1.0,
      rightMax: 1.0
    };
  },
  reset: function(movement2dAnalog) {
    movement2dAnalog.yCoord = 0;
    movement2dAnalog.xCoord = 0;
    movement2dAnalog.upMax = -1.0;
    movement2dAnalog.downMax = 1.0;
    movement2dAnalog.leftMax = -1.0;
    movement2dAnalog.rightMax = 1.0;
  }
};
