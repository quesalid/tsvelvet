/**
 * @author peterqliu / https://github.com/peterqliu
 * @author jscastro / https://github.com/jscastro76
 */

import * as THREE from 'three';
import utils from "../utils/utils";
import Objects from './objects';
import OBJLoader from "./loaders/OBJLoader";
import MTLLoader from "./loaders/MTLLoader";
import FBXLoader from "./loaders/FBXLoader";
import GLTFLoader from "./loaders/GLTFLoader";
import ColladaLoader from "./loaders/ColladaLoader";



const objLoader = new OBJLoader(undefined);
const materialLoader = new MTLLoader(undefined);
const gltfLoader = new GLTFLoader(undefined);
const fbxLoader = new FBXLoader(undefined);
const daeLoader = new ColladaLoader(undefined);

function loadObj(options, cb, map, promise) {

	const objects = new Objects(map);

	if (options === undefined) return console.error("Invalid options provided to loadObj()");
	options = utils._validate(options, Objects._defaults.loadObj);

	let loader;
	if (!options.type) { options.type = 'mtl'; };
	//[jscastro] support other models
	switch (options.type) {
		case "mtl":
			// TODO: Support formats other than OBJ/MTL
			loader = objLoader;
			break;
		case "gltf":
		case "glb":
			// [jscastro] Support for GLTF/GLB
			loader = gltfLoader;
			break;
		case "fbx":
			loader = fbxLoader;
			//console.log("FBX model loader",loader)
			break;
		case "dae":
			loader = daeLoader;
			break;
	}

	materialLoader.withCredentials = options.withCredentials;
	materialLoader.load(options.mtl, loadObject, () => (null), error => {
		console.warn("No material file found " + error.stack);
	});

	function loadObject(materials) {

		if (materials && options.type == "mtl") {
			materials.preload();
			loader.setMaterials(materials);
		}

		loader.withCredentials = options.withCredentials;
		loader.load(options.obj, obj => {

			//[jscastro] MTL/GLTF/FBX models have a different structure
			let animations = [];
			switch (options.type) {
				case "mtl":
					obj = obj.children[0];
					break;
				case "gltf":
				case "glb":
				case "dae":
					animations = obj.animations;
					obj = obj.scene;
					break;
				case "fbx":
					animations = obj.animations;
					break;
			}
			obj.animations = animations;
			// [jscastro] options.rotation was wrongly used
			const r = utils.types.rotation(options.rotation, [0, 0, 0]);
			const s = utils.types.scale(options.scale, [1, 1, 1]);
			obj.rotation.set(r[0], r[1], r[2]);
			obj.scale.set(s[0], s[1], s[2]);
			// [jscastro] normalize specular/metalness/shininess from meshes in FBX and GLB model as it would need 5 lights to illuminate them properly
			if (options.normalize) { normalizeSpecular(obj); }
			obj.name = "model";
			let userScaleGroup:any = objects._makeGroup(obj, options);
			objects._addMethods(userScaleGroup, false);
			//console.log("loadObject userScaleGroup set anchor")
			//[jscastro] calculate automatically the pivotal center of the object
			userScaleGroup.setAnchor(options.anchor);
			//console.log("loadObject userScaleGroup set center")
			//[jscastro] override the center calculated if the object has adjustments
			userScaleGroup.setCenter(options.adjustment);
			//[jscastro] if the object is excluded from raycasting
			userScaleGroup.raycasted = options.raycasted;
			//[jscastro] return to cache
			//console.log("loadObject userScaleGroup promise", userScaleGroup)
			promise(userScaleGroup);
			//[jscastro] then return to the client-side callback
			//console.log("loadObject userScaleGroup callback")
			cb(userScaleGroup);
			//[jscastro] apply the fixed zoom scale if needed
			//console.log("loadObject userScaleGroup set zoom")
			userScaleGroup.setFixedZoom(options.mapScale);
			//[jscastro] initialize the default animation to avoid issues with skeleton position
			userScaleGroup.idle();

		}, () => (null), error => {
			console.log("Could not load model file: ",error);
			console.error("Could not load model file: " + options.obj + " \n " + error.stack);
			promise("Error loading the model");
		});

	};

	//[jscastro] some FBX/GLTF models have too much specular effects for mapbox
	function normalizeSpecular(model) {
		model.traverse(function (c) {

			if (c.isMesh) {
				//c.castShadow = true;
				let specularColor;
				if (c.material.type == 'MeshStandardMaterial') {

					if (c.material.metalness) { c.material.metalness *= 0.1; }
					if (c.material.glossiness) { c.material.glossiness *= 0.25; }
					specularColor = new THREE.Color(12, 12, 12);

				} else if (c.material.type == 'MeshPhongMaterial') {
					c.material.shininess = 0.1;
					specularColor = new THREE.Color(20, 20, 20);
				}
				if (c.material.specular && c.material.specular.isColor) {
					c.material.specular = specularColor;
				}
				//c.material.needsUpdate = true;

			}

		});
	}

}

export default loadObj;