"use strict";

var x = 0;
var y = 0;

module.exports = {
	moveToCamera: function(ecs, data) {
		data.entities.registerSearch("viewport", ["camera", "position"]);
		ecs.add(function(entities, context) { // eslint-disable-line no-unused-vars
			x = 0;
			y = 0;
		});
		ecs.addEach(function(entity, context) {
			var position = data.entities.get(entity, "position");
			var camera = data.entities.get(entity, "camera");

			var dx = Math.floor(position.x + camera.x) - x;
			var dy = Math.floor(position.y + camera.y) - y;
			x += dx;
			y += dy;
			context.translate(-dx, -dy);
		}, "viewport");
	},
	reset: function(ecs) {
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			context.translate(x, y);
			x = 0;
			y = 0;
		}, "viewport");
	}
};
