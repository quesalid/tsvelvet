/**
 * @author peterqliu / https://github.com/peterqliu
 * @author jscastro / https://github.com/jscastro76
*/

import * as THREE from 'three';
import utils from '../utils/utils';
import Objects from './objects';
import Object3D from './Object3D';
import material from '../utils/material';

function Sphere(opt,world=undefined) {

	opt = utils._validate(opt, Objects.prototype._defaults.sphere);
	let geometry = new THREE.SphereBufferGeometry(opt.radius, opt.sides, opt.sides);
	let mat = material(opt)
	let output = new THREE.Mesh(geometry, mat);
	//[jscastro] we convert it in Object3D to add methods, bounding box, model, tooltip...
	return Object3D({ obj: output, units: opt.units, anchor: opt.anchor, adjustment: opt.adjustment, bbox: opt.bbox, tooltip: opt.tooltip, raycasted: opt.raycasted });

}


export default Sphere;