"use strict";

function drawEntity(images, imageComponent, position, context) {
	var image = images.get(imageComponent.name);
	if (!image) {
		console.error("No such image", imageComponent.name);
		return;
	}
	try {
		context.drawImage(
			image,
			imageComponent.sourceX,
			imageComponent.sourceY,
			imageComponent.sourceWidth,
			imageComponent.sourceHeight,
			imageComponent.destinationX + position.x,
			imageComponent.destinationY + position.y,
			imageComponent.destinationWidth,
			imageComponent.destinationHeight
		);
	} catch (e) {
		console.error("Error drawing image", imageComponent.name, e);
	}
}

module.exports = function(ecs, data) {
	data.entities.registerSearch("drawImage", ["image", "position"]);
	ecs.add(function(entities, context) {
		var ids = entities.find("drawImage");
		ids.sort(function(a, b) {
			var za = (entities.get(a, "zindex") || { zindex: 0 }).zindex;
			var zb = (entities.get(b, "zindex") || { zindex: 0 }).zindex;
			var ya = (entities.get(a, "position") || { y: 0 }).y;
			var yb = (entities.get(b, "position") || { y: 0 }).y;
			return za - zb || ya - yb;
		});

		for (var i = 0; i < ids.length; i++) {
			drawEntity(data.images, entities.get(ids[i], "image"), entities.get(ids[i], "position"), context);
		}
	});
};
