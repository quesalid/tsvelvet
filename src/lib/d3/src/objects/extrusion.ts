/**
 * @author jscastro / https://github.com/jscastro76
 */
import Objects from './objects';
import utils from '../utils/utils';
import Object3D from './Object3D';
import * as THREE from 'three';


/**
 * 
 * @param {any} opt must fit the default defined in Objects.prototype._defaults.extrusion 
 * @param {arr} opt.coordinates could receive a feature.geometry.coordinates
 */
/*function extrusion(opt) {

	opt = utils._validate(opt, Objects._defaults.extrusion);
	let shape = extrusion.prototype.buildShape(opt.coordinates);
	let geometry = extrusion.prototype.buildGeometry(shape, opt.geometryOptions);
	let mesh = new THREE.Mesh(geometry, opt.materials);
	opt.obj = mesh;
	//[jscastro] we convert it in Object3D to add methods, bounding box, model, tooltip...
	return Object3D(opt);

}

extrusion.prototype = {

	buildShape: function (coords) {
		if (coords[0] instanceof (THREE.Vector2 || THREE.Vector3)) return new THREE.Shape(coords);
		let shape = new THREE.Shape();
		for (let i = 0; i < coords.length; i++) {
			if (i === 0) {
				shape = new THREE.Shape(this.buildPoints(coords[0], coords[0]));
			} else {
				shape.holes.push(new THREE.Path(this.buildPoints(coords[i], coords[0])));
			}
		}
		return shape;
	},

	buildPoints: function (coords, initCoords) {
		const points = [];
		let init = utils.projectToWorld([initCoords[0][0], initCoords[0][1], 0]);
		for (let i = 0; i < coords.length; i++) {
			let pos = utils.projectToWorld([coords[i][0], coords[i][1], 0]);
			points.push(new THREE.Vector2(utils.toDecimal((pos.x - init.x), 9), utils.toDecimal((pos.y - init.y), 9)));
		}
		return points;
	},

	buildGeometry: function (shape, settings) {
		let geometry = new THREE.ExtrudeBufferGeometry(shape, settings);
		geometry.computeBoundingBox();
		return geometry;
	}

}*/

function extrusion(opt,objects) {

	opt = utils._validate(opt, objects.extrusion);
	let shape = extrusion.prototype.buildShape(opt.coordinates);
	let geometry = extrusion.prototype.buildGeometry(shape, opt.geometryOptions);
	let mesh = new THREE.Mesh(geometry, opt.materials);
	opt.obj = mesh;
	//[jscastro] we convert it in Object3D to add methods, bounding box, model, tooltip...
	return Object3D(opt);

}

extrusion.prototype = {

	buildShape: function (coords) {
		if (coords[0] instanceof (THREE.Vector2 || THREE.Vector3)) return new THREE.Shape(coords);
		let shape = new THREE.Shape();
		for (let i = 0; i < coords.length; i++) {
			if (i === 0) {
				shape = new THREE.Shape(this.buildPoints(coords[0], coords[0]));
			} else {
				shape.holes.push(new THREE.Path(this.buildPoints(coords[i], coords[0])));
			}
		}
		return shape;
	},

	buildPoints: function (coords, initCoords) {
		const points = [];
		let init = utils.projectToWorld([initCoords[0][0], initCoords[0][1], 0]);
		for (let i = 0; i < coords.length; i++) {
			let pos = utils.projectToWorld([coords[i][0], coords[i][1], 0]);
			points.push(new THREE.Vector2(utils.toDecimal((pos.x - init.x), 9), utils.toDecimal((pos.y - init.y), 9)));
		}
		return points;
	},

	buildGeometry: function (shape, settings) {
		let geometry = new THREE.ExtrudeBufferGeometry(shape, settings);
		geometry.computeBoundingBox();
		return geometry;
	}

}

export default  extrusion;