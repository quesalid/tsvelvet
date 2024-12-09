/**
 * @author peterqliu / https://github.com/peterqliu
 * @author jscastro / https://github.com/jscastro76
*/

import * as THREE from 'three';
import utils from '../utils/utils';
import Objects from './objects';
import Object3D from './Object3D';
import material from '../utils/material';

function tube(opt, world) {

	// validate and prep input geometry
	opt = utils._validate(opt, Objects.prototype._defaults.tube);

	let points = []
	opt.geometry.forEach(p => {
		points.push(new THREE.Vector3(p[0], p[1], p[2]));
	})
	const curve = new THREE.CatmullRomCurve3(points);
	let tube = new THREE.TubeGeometry(curve, points.length, opt.radius, opt.sides, false);
	let mat = material(opt);
	let obj = new THREE.Mesh(tube, mat);
	//[jscastro] we convert it in Object3D to add methods, bounding box, model, tooltip...
	return  Object3D({ obj: obj, units: opt.units, anchor: opt.anchor, adjustment: opt.adjustment, bbox: opt.bbox, tooltip: opt.tooltip, raycasted: opt.raycasted });
}

export default tube;