<script lang='ts'>
import {onMount,onDestroy} from 'svelte';
//import * as mapboxgl from 'maplibre-gl';
import * as THREE from 'three'
import {Map, NavigationControl} from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css';
//import '@site/src/node_modules/mapbox-gl/dist/mapbox-gl.css';
import { Threebox } from 'threebox-plugin'; 
import 'threebox-plugin/dist/threebox.css'

import { getAssetsFromCoords } from './assetsHelper'

export let assets:any = getAssetsFromCoords(null)

export let containerClass = 'map-container-maplibre'
export let sceneOrigin:any = [13.471033574202934,  45.85175337043916, 0]
export let sceneCenter:any = [13.471033574202934,  45.85175337043916]

const apiKey = 'pk.eyJ1IjoicXVlc2FsaWQiLCJhIjoiY200Y2w3ZmY1MGNsbzJqcGZwN2dhcms5ZiJ9.K_N3ilmf81hizB-vNIc7Kg'; // Sostituisci con la tua chiave API
let mapcontainer:any
let map:any
//let tb:any
let date = new Date()
let point:any

let mapConfig:any = {
			PAR: {
				origin: sceneOrigin, 
				center: sceneCenter, 
				zoom: 15, pitch: 50, 
				bearing: -250, 
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


onMount(async () => {
	if(!map)
		await addmap()
	// after load fly to the center
	map.flyTo({center: point.center, zoom: point.zoom, pitch: point.pitch, bearing: point.bearing})
})

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
		console.log('addMap',mapcontainer)
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

		window.tb = new Threebox(
			map,
			map.getCanvas().getContext('webgl'),
			{
				//realSunlight: true,
				defaultLights: true,
				sky: true,
				terrain: true,
				enableSelectingObjects: true, 
				enableTooltips: true,
				enableRotatingObjects: true,
			})
		console.log('TB ***** ',tb)
		// Aggiungi il supporto per il terreno
        map.on('load', async () => {
			map.addLayer(modelLayer)
		})

    }
}

const modelLayer = {
		id: mapConfig.names.customLayer,
		type: 'custom',
		renderingMode: '3d',

		onAdd: async function (map:any, mbxContext:any) {
			        // add all the assests to the map
					
					var options = {
						obj: mapConfig.PAR.obj,
						type: 'fbx',
						scale: 1,
						units: 'meters',
						rotation: mapConfig.PAR.rotation,
						anchor: 'auto'
					}
					// add all assets to map
					let model:any = await loadObject(options)
					
					// add assets to map cloning model
					for(let i=0;i<assets.length;i++){
						let asset = assets[i]
						let newmodel = model.duplicate()
						newmodel.setCoords(asset.modelLocation);
						//newmodel.addTooltip(asset.userData.name, true);
						newmodel.color = '0xffff00'
						newmodel.selected = false;
						const children = getSensorModels(newmodel,'Sens')
						for(let i=0;i<children.length;i++){
							if(children[i].name .includes('A4'))
								children[i].material = new THREE.MeshStandardMaterial({color: 0xff0000});
							else
								children[i].material = new THREE.MeshStandardMaterial({color: 0x00ff00});
						}
						tb.add(newmodel);
					}

					
					/*tb.loadObj(options, function (model:any) {
						console.log('LOAD OBJ',options)
						model.setCoords(mapConfig.PAR.origin);
						model.addTooltip("Traliccio Esempio", true);
						model.color = '0x0000ff'
						model.selected = true;
						const children = getSensorModels(model,'Sens')
						for(let i=0;i<children.length;i++){
							if(children[i].name .includes('A4'))
								children[i].material = new THREE.MeshStandardMaterial({color: 0xff0000});
							else
								children[i].material = new THREE.MeshStandardMaterial({color: 0x00ff00});
						}
						tb.add(model);
					})*/

				},
		
		render: function (gl:any, matrix:any) {
			tb.setSunlight(date, point.center);
			tb.update();
		}
}

const loadObject = async (options:any) => {
	return(new Promise((resolve,reject) => {
		tb.loadObj(options, function (model:any) {
			resolve(model)
		})
	}))
}
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