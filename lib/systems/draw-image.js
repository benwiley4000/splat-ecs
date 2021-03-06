"use strict";

function drawEntity(data, entity, context) {
	var image = entity.image.buffer;
	if (!image) {
		image = data.images.get(entity.image.name);
	}
	if (!image) {
		console.error("No such image", entity.image.name, "for entity", entity.id, entity.name);
		return;
	}
	try {
		var dx = entity.image.destinationX + entity.position.x;
		var dy = entity.image.destinationY + entity.position.y;
		if (entity.rotation !== undefined) {
			context.save();

			var x = entity.position.x + entity.rotation.x;
			var y = entity.position.y + entity.rotation.y;
			context.translate(x, y);
			context.rotate(entity.rotation.angle);

			dx = entity.image.destinationX - entity.rotation.x;
			dy = entity.image.destinationY - entity.rotation.y;
		}

		context.drawImage(
			image,
			entity.image.sourceX,
			entity.image.sourceY,
			entity.image.sourceWidth,
			entity.image.sourceHeight,
			dx,
			dy,
			entity.image.destinationWidth,
			entity.image.destinationHeight
		);

		if (entity.rotation !== undefined) {
			context.restore();
		}
	} catch (e) {
		console.error("Error drawing image", entity.image.name, e);
	}
}

module.exports = function(ecs, data) {
	ecs.add(function(entities, context) {
		var keys = Object.keys(entities);
		keys.sort(function(a, b) {
			var za = (entities[a].zindex || { zindex: 0 }).zindex;
			var zb = (entities[b].zindex || { zindex: 0 }).zindex;
			var ya = (entities[a].position || { y: 0 }).y;
			var yb = (entities[b].position || { y: 0 }).y;
			return za - zb || ya - yb;
		});

		for (var i = 0; i < keys.length; i++) {
			var entity = entities[keys[i]];
			if (entity.image === undefined || entity.position === undefined) {
				continue;
			}
			drawEntity(data, entity, context);
		}

	});
};
