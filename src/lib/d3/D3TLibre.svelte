<script lang='ts'>
import {onMount,onDestroy,afterUpdate} from 'svelte';
//import * as mapboxgl from 'maplibre-gl';
//import * as Three from 'three'
import {Map, NavigationControl} from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css';
//import '@site/src/node_modules/mapbox-gl/dist/mapbox-gl.css';
 
import * as THREE from 'three'
//import 'threebox-plugin/dist/threebox.css'

import Threebox from './src/Threebox'
import './src/threebox.css'
import { getAssetsFromCoords } from './assetsHelper'

export let assets:any = getAssetsFromCoords(null)

export let containerClass = 'map-container-maplibre'
export let sceneOrigin:any = [13.471033574202934,  45.85175337043916, 0]
export let sceneCenter:any = [13.471033574202934,  45.85175337043916]

const apiKey = 'pk.eyJ1IjoicXVlc2FsaWQiLCJhIjoiY200Y2w3ZmY1MGNsbzJqcGZwN2dhcms5ZiJ9.K_N3ilmf81hizB-vNIc7Kg'; // Sostituisci con la tua chiave API
let mapcontainer:any
let map:any
let tb:any
let date = new Date()
let layerAdded = false

let mapConfig:any = {
			PAR: {
				origin: sceneOrigin, 
				center: sceneCenter, 
				zoom: 16, pitch: 60, 
				bearing: 0, 
				scale: 1, 
				rotation: { x: 0, y: 0, z: 0 }, 
				timezone: 'Europe/Paris', 
				obj: 'OHMS_3D_SENS_.fbx',
			},
			names: {
				customLayer: "custom-layer",
				//fillExtrusion: "composite-b",
				//fillExtrusionLayer: "building-b"
			}
		}
let options = {
				obj: mapConfig.PAR.obj,
				type: 'fbx',
				scale: 1,
				units: 'meters',
				rotation: mapConfig.PAR.rotation,
				anchor: 'auto'
}

let point:any = mapConfig.PAR



onMount(async () => {
	console.log("IN ONMOUNT ----------------> ")
	if(!map)
		addmap()
	console.log("END ONMOUNT ----------------> ")
	// after load fly to the center
	map.flyTo({
		center: point.center,
		zoom: point.zoom, 
		pitch: point.pitch, 
		bearing: point.bearing,
	})
	
})

afterUpdate(() => {
        // Aggiorna il layer ogni volta che `assets` cambia
        if (map && modelLayer.updateLayer) {
            modelLayer.updateLayer(map,options);
        }
 });

onDestroy(() => {
	if(tb)
		tb.dispose()
	if(map)
		map.remove()
})

const getChildModel = (model:any,name:any) => {
	let retchild = null
	model.traverse((child:any) => {
		if(child.name == name){
			retchild = child
		}
	})
	return retchild
}

const getSensorModels = (model:any,name:any) => {
	let children = []
	model.traverse((child:any) => {
		if(child.name.includes(name)){
			children.push(child)
		}
	})
	return children
}

const addmap = async () => {
	point = mapConfig.PAR;
	if(!map){
		console.log('addMap ---------------------->',mapcontainer)
		map = new Map({
			style: 'mapbox://styles/mapbox/satellite-streets-v9', //'mapbox://styles/mapbox/outdoors-v11', //'mapbox://styles/mapbox/dark-v10',//'mapbox://styles/mapbox/light-v10',//'mapbox://styles/mapbox/satellite-streets-v9',
			center: point.center,
			zoom: point.zoom,
			pitch: point.pitch,
			bearing: point.bearing,
			container: mapcontainer,
			antialias: true, 
			hash: true,
			accessToken:apiKey
		})

		map.addControl(new NavigationControl())

		let canvas = map.getCanvas()
		let gl = canvas.getContext('webgl')
		tb = (window.tb = new Threebox(
				map,
				gl,
				{
					//realSunlight: true,
					defaultLights: true,
					sky: false,
					terrain: true,
					enableSelectingObjects: true, 
					enableTooltips: false,
					enableRotatingObjects: false,
				})
			)
		map.on('style.load', () => {
			console.log('Map loaded ---------------------->')
			if(!layerAdded){
				map.addLayer(modelLayer)
				layerAdded = true
				tb.update()
			}
		})
	}
}


const modelLayer = {
		id: mapConfig.names.customLayer,
		type: 'custom',
		renderingMode: '3d',

		onAdd(map:any, mbxContext:any){
					//this.updateLayer(map,options)
				},

        updateLayer(map:any, options:any){
			map.tb.loadObj(options, (model:any) => {
				for(let i=0;i<assets.length;i++){
						let asset = assets[i]
						let newmodel = model.duplicate()
						newmodel.setCoords(asset.modelLocation);
						newmodel.addTooltip(asset.userData.name, true);
						newmodel.color = '0xffff00'
						if(i==0)
							newmodel.selected = true;
						else
							newmodel.selected = false;
						newmodel.userData = asset.userData
						const children = getSensorModels(newmodel,'Sens')
						for(let i=0;i<children.length;i++){
							if(children[i].name .includes('A4'))
								children[i].material = new THREE.MeshStandardMaterial({color: 0xff0000});
							else
								children[i].material = new THREE.MeshStandardMaterial({color: 0x00ff00});
						}
						//newmodel.addEventListener('SelectedChange', onSelectedChange, true);
						//newmodel.addEventListener('ObjectDragged', onDraggedObject, false);
						//newmodel.addEventListener('ObjectMouseOver', onObjectMouseOver, false);
						//newmodel.addEventListener('ObjectMouseOut', onObjectMouseOut, false);
						asset.model = newmodel
						tb.add(newmodel);
				}
			})
		},

		render(gl:any, matrix:any){
			//window.tb.setSunlight(date, point.center);
			tb.update();
		}
}

const loadObject =  (options:any) => {
	return(new Promise((resolve,reject) => {
		tb.loadObj(options, function (model:any) {
			console.log("Model loaded ------------------->",model)
			resolve(model)
		})
	}))
}
/*const onSelectedChange = (event:any) => {
	console.log('SelectedChange',event)
}

const onObjectMouseOver = (event:any) => {
	console.log('ObjectMouseOver',event)
}

const onObjectMouseOut = (event:any) => {
	console.log('ObjectMouseOut',event)
}*/

</script>

 
    <div id="map-container" class="{containerClass}">
         <div class="class-mapbox" bind:this="{mapcontainer}"></div>
    </div>

<style>

.class-mapbox {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>