"use strict";

var gridSize = 64;

function toGrid(i) {
	return Math.floor(i / gridSize);
}
function keys(entity) {
	var x1 = toGrid(entity.position.x);
	var x2 = toGrid(entity.position.x + entity.size.width);

	var y1 = toGrid(entity.position.y);
	var y2 = toGrid(entity.position.y + entity.size.height);

	var k = [];
	for (var x = x1; x <= x2; x++) {
		for (var y = y1; y <= y2; y++) {
			k.push(x + "," + y);
		}
	}
	return k;
}

function add(hash, entity, key) {
	if (!hash[key]) {
		hash[key] = [entity];
		return;
	}
	for (var i = 0; i < hash[key].length; i++) {
		var peer = hash[key][i];
		// FIXME: when an entity's collisions are removed, it stays forever in the hash. this needs to get cleaned up somehow.
		if (peer.collisions === undefined) {
			continue;
		}
		if (collides(entity, peer)) {
			entity.collisions.push(peer.id);
			peer.collisions.push(entity.id);
		}
	}
	hash[key].push(entity);
}

function remove(hash, entity, key) {
	var list = hash[key];
	var pos = list.indexOf(entity);
	if (pos === -1) {
		return;
	}
	list.splice(pos, 1);
}

function collides(b, a) {
	return a.position.x + a.size.width > b.position.x &&
		a.position.x < b.position.x + b.size.width &&
		a.position.y + a.size.height > b.position.y &&
		a.position.y < b.position.y + b.size.height;
}

function removeEntity(entity, oldKeys, entities, spatialHash){
	function notCurrentEntityId(id) {
		return id !== entity.id;
	}
	for (var i = 0; i < oldKeys.length; i++) {
		remove(spatialHash, entity, oldKeys[i]);
	}
	for (i = 0; i < entity.collisions.length; i++) {
		var peer = entities[entity.collisions[i]];
		if (peer === undefined) {
			continue;
		}
		peer.collisions = peer.collisions.filter(notCurrentEntityId);
	}
}

var spatialHash = {};

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars

		if (entity.collisionKeys === undefined || entity.velocity !== undefined) {
			var oldKeys = entity.collisionKeys || [];
			entity.collisionKeys = keys(entity);

			if (entity.velocity !== undefined || !areArraysSame(oldKeys, entity.collisionKeys)) {
				removeEntity(entity, oldKeys, data.entities.entities, spatialHash);
				entity.collisions = [];
				for (var i = 0; i < entity.collisionKeys.length; i++) {
					add(spatialHash, entity, entity.collisionKeys[i]);
				}
			}
		}
	}, ["position", "size", "collisions"]);
};

module.exports.onEntityDelete = function(entity, data) {
	removeEntity(entity, entity.collisionKeys || [], data.entities.entities, spatialHash);
};

function areArraysSame(a, b) {
	if (a.length !== b.length) {
		return false;
	}
	for (var i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}
