<script lang='ts'>
// MAPTILER KEY gH88mRCqCEYrX8xwbYGo
// MAPTILER URL https://api.maptiler.com/maps/topo/style.json?key=gH88mRCqCEYrX8xwbYGo
// https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/tiles.json?key=gH88mRCqCEYrX8xwbYGo

import { onMount, onDestroy,afterUpdate } from 'svelte';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three-stdlib';

import AssetPanel from './AssetPanel.svelte'
import AssetChart from '../asset/AssetChart.svelte'
    

export let terrain = true
export let addModels = true
export let roads = false
export let water = false
//export let objectUrl = 'https://maplibre.org/maplibre-gl-js/docs/assets/34M_17/34M_17.gltf'
//export let objectUrl = 'OHMS_3D_127.gltf'
//export let objectUrl = 'PANNELLI_X10.gltf'
//export let objectUrl = 'OHMS_3D.gltf'
export let objectUrl = 'OHMS_3D_Y-UP_L.fbx'
export let showPanel = true
export let assets:any = []
export let sceneOrigin:any = [13.471033574202934,  45.85175337043916]
export let containerClass = 'map-container-maplibre'

let map:any;
const apiKey = 'gH88mRCqCEYrX8xwbYGo'; // Sostituisci con la tua chiave API
const terrainSourceId = 'maptiler-terrain';
let mapcontainer:any
let modelLoaded:any
let mapcontainerName = 'map-3d-maplibre'
let flyAsset:any = null
let prevFlyAsset:any = null
let currentHelper:any = null; // Riferimento al BoxHelper attivo
let currentRayHelper:any = null; // Riferimento al RayHelper attivo
let currentAssets:any = []; // Array di asset attualmente presenti nella scena


  onMount(async () => {
    //modelLoaded = await loadModel(objectUrl);
    modelLoaded = await loadFBXModel(objectUrl);
    const mapcont:any = document.querySelector('.'+containerClass);
    if(mapcont && !map){
        await addmap()
    }
    // add event listner to containerClass to fly to asset
    mapcont?.addEventListener('flyToAsset', (e:any) => {
        if(currentAssets.length == 0){
		    assets = e.detail.assets?e.detail.assets:[]
            console.log("FLY TO ASSETS SET ASSESTS",assets)
        }

        flyAsset = e.detail.asset

		if(flyAsset && modelLayer.scene){

            map.flyTo({
				    center: flyAsset.modelLocation,
				    zoom: 15.9,
				    speed: 0.8,
				    curve: 1,
				    easing(t:any) {
					    return t;
				    }
			    });

            // udate elevation
            assets = [...assets]

            const object = getObjectById(flyAsset.userData.id);
           
            if (object) {
                // Rimuovi il vecchio BoxHelper se esiste
                if (currentHelper) {
                    if(currentHelper.parent)
                    currentHelper.parent.remove(currentHelper);
                    currentHelper.dispose();
                    currentHelper = null;
                }

                // Aggiorna la matrice del modello
                object.updateMatrixWorld();

                // Crea un nuovo BoxHelper
                currentHelper = new THREE.BoxHelper(object, 0x00ff00);
                // setta la posizione dell'helper uguale a quella dell'oggetto
                currentHelper.position.copy(object.position);
                // setta la scala dell'helper uguale a quella dell'oggetto
                currentHelper.scale.copy(object.scale);
                // setta la rotazione dell'helper uguale a quella dell'oggetto
                currentHelper.rotation.copy(object.rotation);
                currentHelper.updateMatrixWorld();

                // Aggiungi il BoxHelper come figlio del modello
                object.add(currentHelper);
               
                console.log("OBJECT-HELPER POSITION",object.position,currentHelper.position)
                console.log("OBJECT-HELPER SCALE",object.scale,currentHelper.scale)
                console.log("OBJECT-HELPER ROTATION",object.rotation,currentHelper.rotation)

            }

		}
	});
    // force re-rendering
    assets = [...assets]
   
  });

  afterUpdate(() => {
        // Aggiorna il layer ogni volta che `assets` cambia
        if (map && modelLayer.updateLayer) {
            modelLayer.updateLayer(map);
        }
    });

  const addmap = async () => {
	 if(!map){
        map =  new maplibregl.Map({
          container: mapcontainerName, // ID del contenitore
          style: `https://api.maptiler.com/maps/outdoor/style.json?key=${apiKey}`,
          //style: `https://api.maptiler.com/maps/basic-v2/style.json??key=${apiKey}`,
          //style: `https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`,
          center: [13.471033574202934,  45.85175337043916], // Centro della mappa (long, lat)
          zoom: 15,
          pitch: 60,
          pitchWithRotate: true,
        });

        map.addControl(
            new maplibregl.NavigationControl({
                visualizePitch: true,
                showZoom: true,
                showCompass: true,
            })
        );

        // Aggiungi il supporto per il terreno
        map.on('load', async () => {
          if(terrain){
              // check if source already exists
              if (map.getSource(terrainSourceId)) {
			    return;
		      }
              await map.addSource(terrainSourceId, {
                type: 'raster-dem',
                url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${apiKey}`,
                tileSize: 256,
                maxzoom: 15.9, // Zoom massimo supportato dal DEM
                exaggeration: 3,
              });
            
              // Configura il layer per il terreno
              map.setTerrain({ source: terrainSourceId, exaggeration: 1.5 });

              // Aggiungi un effetto di ombreggiatura (opzionale)
              // check if layer already exists
              if (!map.getLayer('hillshade')) {
                  map.addLayer({
                    id: 'hillshade',
                    type: 'hillshade',
                    source: terrainSourceId,
                    layout: {},
                    paint: {
                      'hillshade-exaggeration': 2,
                    },
                  });
              }
              map.addControl(
                    new maplibregl.TerrainControl({
                        source: 'terrainSource',
                        exaggeration: 1
                    })
                );
          }
        });
        map.on('idle', async () => {
            if(addModels && !map.getLayer('3d-model')){
                  for(let i=0;i<assets.length;i++){
				      assets[i].model = modelLoaded.clone();
                      // aggiungi id al modello
                      assets[i].model.userData.id = assets[i].userData.id;
                      // se status è ALARM cambia colore ad red
                      if(assets[i].userData.status == 'ALARM'){
						  assets[i].model.traverse((child:any) => {
							  if (child.isMesh) {
								  child.material = new THREE.MeshBasicMaterial({color: 0xff0000});
							  }
						  });
					  }
                      // se status è WARNING cambia colore a orange
					  if(assets[i].userData.status == 'WARNING'){
                          assets[i].model.traverse((child:any) => {
                              if (child.isMesh) {
                                  child.material = new THREE.MeshBasicMaterial({color: 0xffa500});
							  }
                              });
                      }
			      }
                  await map.addLayer(modelLayer);
              }
        })
     }
     
  }

  onDestroy(() => {
	if (map) {
      // free up gpu memory
      modelLoaded.traverse((child:any) => {
		if (child.isMesh) {
			child.geometry.dispose();
			child.material.dispose();
		}
	  });
	  map.remove();
	}
  });

  /** OBJECT LOADING FUNCTIONS */
const calculateDistanceMercatorToMeters =(from:any, to:any) => {
    const mercatorPerMeter = from.meterInMercatorCoordinateUnits();
    // mercator x: 0=west, 1=east
    const dEast = to.x - from.x;
    const dEastMeter = dEast / mercatorPerMeter;
    // mercator y: 0=north, 1=south
    const dNorth = from.y - to.y;
    const dNorthMeter = dNorth / mercatorPerMeter;
    return {dEastMeter, dNorthMeter};
}

const adjustCoords = (coords:any, map:any) => {
	const sceneElevation = map.queryTerrainElevation(sceneOrigin) || 0;
    const modelElevation = map.queryTerrainElevation(coords) || 0;
    const modelup = (modelElevation - sceneElevation);
    const sceneOriginMercator = maplibregl.MercatorCoordinate.fromLngLat(sceneOrigin);
    const modelMercator = maplibregl.MercatorCoordinate.fromLngLat(coords);
    const { dEastMeter: modeleast, dNorthMeter: modelnorth } = calculateDistanceMercatorToMeters(sceneOriginMercator, modelMercator);
    return {modeleast, modelup, modelnorth}
}

const  loadModel = async (url:any) => {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    const model = gltf.scene;
    // add basic material to model
    model.traverse((child:any) => {
		if (child.isMesh) {
			child.material = new THREE.MeshBasicMaterial({color: 0x777777});
		}
	});
    
    return model;
}

const getObjectById = (id:any) => {
   // rotorna on ogetto nella scena con id uguale a id
   return modelLayer.scene.children.find((child:any) => child.userData.id === id);
}

const  loadFBXModel = async (url:any) => {
    return (new Promise((resolve, reject) => {
		const loader = new FBXLoader();
		loader.load(url, (object:any) =>{
			object.traverse((child:any) => {
				if (child.isMesh) {
					child.material = new THREE.MeshBasicMaterial({color: 0x777777});
				}
			});
			resolve(object);
		});
	}));
}



const modelLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',



    onAdd(map:any, gl:any) {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.scene = new THREE.Scene();
        this.scene.rotateX(Math.PI / 2);
        this.scene.scale.multiply(new THREE.Vector3(1, 1, -1));

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(50, 70, -30).normalize();
        this.scene.add(light);

        this.clickableObjects = [];
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });
        this.renderer.autoClear = false;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector3();

        map.getCanvas().addEventListener('click', (event:any) => {
            this.onMouseClick(event, map);
        });


        // Carica gli asset iniziali
        this.updateLayer(map);
    },

    updateLayer(map:any) {
        if(!this.scene)
            return
        try{
        // Rimuove gli oggetti che non sono più presenti in `assets`
        const assetIds = assets.map((asset:any) => asset.userData.id);
        currentAssets = currentAssets.filter((existingAsset:any) => {
            if (!assetIds.includes(existingAsset.userData.id)) {
                this.scene.remove(existingAsset);
                this.clickableObjects = this.clickableObjects.filter((obj:any) => obj !== existingAsset);
                return false; // Rimuovi dal layer
            }
            return true; // Mantieni
        });
        // Aggiunge nuovi asset o aggiorna quelli esistenti
        for (let i=0;i< assets.length;i++) {
            let asset = assets[i];
            let existingAsset:any = currentAssets.find((a:any) => a.userData.id === asset.userData.id);
            
            // aggiusta le coordinate in base al terreno
            const { modeleast, modelup, modelnorth } = adjustCoords(asset.modelLocation, map);

            if (!existingAsset) {
                // Aggiungi nuovo asset
                // se asset nuovo aggiungi il model
                asset.model = asset.model?asset.model:modelLoaded.clone();
                asset.model.userData = asset.userData;
               
                // tenere conto della exageration del terreno
                asset.model.position.set(modeleast, modelup, modelnorth);

                if(asset.userData.status == 'ALARM'){
						asset.model.traverse((child:any) => {
							if (child.isMesh) {
								child.material = new THREE.MeshBasicMaterial({color: 0xff0000});
                                child.material.side = THREE.DoubleSide;
							}
						});
					}
                    // se status è WARNING cambia colore a orange
					if(asset.userData.status == 'WARNING'){
                        asset.model.traverse((child:any) => {
                            if (child.isMesh) {
                                child.material = new THREE.MeshBasicMaterial({color: 0xffa500});
                                child.material.side = THREE.DoubleSide;
							}
                            });
                    }
                    if(asset.userData.status == 'NORMAL'){
                        asset.model.traverse((child:any) => {
                            if (child.isMesh) {
                            child.material = new THREE.MeshBasicMaterial({color: 0x777777});
                            child.material.side = THREE.DoubleSide;
                            }
                            });
                    }

                // aggiorna world matrix
                asset.model.updateMatrixWorld();
                this.scene.add(asset.model);
                this.clickableObjects.push(asset.model);
                currentAssets.push(asset);
            } else {
                // Aggiorna asset esistente
                existingAsset.model.position.set(modeleast, modelup, modelnorth);
                existingAsset.model.traverse((child:any) => {
                    if (child.isMesh) {
                        child.material.color.set(existingAsset.userData.status === 'ALARM' ? 0xff0000 :
                                                 existingAsset.userData.status === 'WARNING' ? 0xffa500 :
                                                 0x777777);
                    }
                });
            }
        }

        map.triggerRepaint();
        }catch(e){
            console.log("ERROR UPDATING LAYER",e)
        }
    },

    onMouseClick(event:any, map:any) {
        const rect = map.getCanvas().getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

         // Step 1: Coordinate geografiche
        const lngLat = map.unproject([this.mouse.x, this.mouse.y]);
        
        // Step 2: Adjust coordinates for terrain
        const { modeleast, modelup, modelnorth } = adjustCoords(lngLat, map);


        let raycastorigin = new THREE.Vector3();
        let raycastmouse = new THREE.Vector3(modeleast, modelup, modelnorth);
        if(flyAsset){
            const newposition = JSON.parse(JSON.stringify(flyAsset.model.position))
			raycastorigin = newposition;
            // exagerate y position
            raycastorigin.y = raycastorigin.y + 20;
            raycastorigin.x = raycastorigin.x + 20;
            raycastorigin.z = raycastorigin.z;
		}
        
        // Step 4: direzione del raggio dall'origine al punto di click del mouse
        //let direction  = new THREE.Vector3();
        //const newdir = this.camera.getWorldDirection(direction.subVectors( raycastorigin, raycastmouse ).normalize())
        const newdir = {x:-1,y:0,z:0}
        
        this.raycaster.set(raycastorigin, newdir)
        
        // cancella il vecchio RayHelper se esiste
        if (currentRayHelper) {
			this.scene.remove(currentRayHelper);
			currentRayHelper.dispose();
			currentRayHelper = null;
		}

        /** RAY CASTER HELPER*/
        const rayHelper = new THREE.ArrowHelper(
            this.raycaster.ray.direction,
            this.raycaster.ray.origin,
            60, // lunghezza del raggio
            0xff0000 // colore
        );
        this.scene.add(rayHelper);
        currentRayHelper = rayHelper;

        const intersects = this.raycaster.intersectObjects(this.clickableObjects);

        console.log("INTERSECTS",intersects,this.clickableObjects)
       

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            clickedObject.userData.onClick?.();
        }
    },

    render(gl:any, mercatorMatrix:any) {
        const offsetFromCenterElevation = map.queryTerrainElevation(sceneOrigin) || 0;
        const sceneOriginMercator = maplibregl.MercatorCoordinate.fromLngLat(sceneOrigin, offsetFromCenterElevation);

        const sceneTransform = {
            translateX: sceneOriginMercator.x,
            translateY: sceneOriginMercator.y,
            translateZ: sceneOriginMercator.z,
            scale: sceneOriginMercator.meterInMercatorCoordinateUnits()
        };

        const m = new THREE.Matrix4().fromArray(mercatorMatrix);
        const l = new THREE.Matrix4()
            .makeTranslation(sceneTransform.translateX, sceneTransform.translateY, sceneTransform.translateZ)
            .scale(new THREE.Vector3(sceneTransform.scale, -sceneTransform.scale, sceneTransform.scale));

        this.camera.projectionMatrix = m.multiply(l);
        this.camera.updateMatrixWorld();
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        try{
            map.triggerRepaint();
        }catch(e){
			console.log("ERROR RENDERING MAP")
		}
    },

    onRemove(map:any, gl:any) {
        this.renderer.dispose();
        this.scene = null;
        currentAssets = [];
    }
};



</script>
<div>
    <div id="map-container" class="{containerClass}">
        <div id="map-3d-maplibre" bind:this={mapcontainer}></div>
        {#if showPanel}
            <AssetPanel bind:asset={flyAsset}/>
        {/if}
    </div>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

#map-3d-maplibre {
    width: 60vw;
    height: 65vh;
  }
.asset-graph-container{
    margin-top: 30px;
}

</style>