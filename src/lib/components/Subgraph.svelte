<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff
import { Node, Svelvet, Anchor, Resizer,ThemeToggle } from 'svelvet';
import { onMount} from "svelte";
import ContextMenu from './ContextMenu.svelte'
import { utilAddNode, utilAddAnchor} from './GraphUtils.js'
import IsaNode from './IsaNode.svelte'
import DataMenu from './DataMenu.svelte'
import CustomEdge from './CustomEdge.svelte'

export let id: string|any = 'defaultSubgraphMenuContainer'
export let node: any = {data:[{subgraph:{nodes:[],edges:[]}}]}

export let svwidth = 1000
export let svheight = 600


let contextmenu = 'mySubContext'
let anchors:any = []
let currentnode = ''
let editnode:any = {}
let dataindex = -1
let subgraphNodes: any[] = [];
let lsvwidth = svwidth 
let lsvheight = svheight -30

// types for node creation
	let bgColor: any | undefined;
	let borderColor: any | undefined;
	let label: string | undefined;
	let width: number = 200;
	let height: number = 100;
	let inputs: number | undefined;
	let outputs: number | undefined;
	let locked: boolean | undefined;
	let center: boolean | undefined;
	let rotation: number | undefined;
	let zIndex: number | undefined;
	let TD: boolean | undefined;
	let LR: boolean | undefined;
	let useDefaults: boolean | undefined;
	let uid: string | undefined;
	let position:any = {x:svwidth/2,y:svheight/2}
	let nodetype: string = 'DEFAULT'
	let data: any = [{subgraph:{nodes:[],edges:[]}}];


	let nodePropNames: any[] = [
			'bgColor',
			'borderColor',
			'label',
			'width',
			'height',
			'locked',
			'center',
			'inputs',
			'outputs',
			'rotation',
			'zIndex',
			'TD',
			'LR',
			'useDefaults',
			'id',
			'position',
			'nodetype',
			'data'
		];
		

		let nodePropsVals: any= {
			bgColor:bgColor,
			borderColor:borderColor,
			label:label,
			width:width,
			height:height,
			locked:locked,
			center:center,
			inputs:inputs,
			outputs:outputs,
			rotation:rotation,
			zIndex:zIndex,
			TD:TD,
			LR:LR,
			useDefaults:useDefaults,
			id:uid,
			position:position,
			nodetype:nodetype,
			data:data
		};

const listener = (e:any)=>{
	let ancs
	node = e.detail.sgnode
	let edges =  e.detail.edges
	const dataindex = node.data.findIndex((item:any)=>item.subgraph != null)
		if(dataindex > -1){
			console.log("LISTENER",node.data[dataindex].subgraph.nodes)
			subgraphNodes = node.data[dataindex].subgraph.nodes
		}
		for(let i=0; i<subgraphNodes.length;i++ ){
				ancs = utilAddAnchor(subgraphNodes[i],edges)
				anchors[i]=ancs
			}
    
}

onMount(async () => {  
	lsvwidth = svwidth 
	lsvheight = svheight -30
	subgraphNodes = []
	const element = document.getElementById(id)
	element.addEventListener("subgraphVisible",listener)
	
 })

 const onContextMenu = (ev:any)=>{
		ev.preventDefault()
		let contextMenu = document.getElementById(contextmenu);
		contextMenu.style.visibility = "visible";
	}

const closeMenu = (ev:any)=>{
	dataindex = -1
	subgraphNodes = []
	anchors = []


	let contextMenu = document.getElementById(contextmenu);
		contextMenu.style.visibility = "hidden";
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";

}

const changeVal = (ev:any)=>{
		
}

const addNode = (e:any|undefined,addnode=null,edges=[])=>{
		let nodeProps
		let ancs
		let nodeParam = nodePropsVals
		
		if(addnode)
			nodeParam = addnode


		
		nodeParam.id = null
		nodeProps = utilAddNode(e,nodeParam,svwidth,svheight)
		
		dataindex = node.data.findIndex((item:any)=>item.subgraph != null)
		if(dataindex > -1){
			subgraphNodes = node.data[dataindex].subgraph.nodes
			// ADD ANCHORS
			for(let i=0; i<subgraphNodes.length;i++ ){
				ancs = utilAddAnchor(subgraphNodes[i],edges)
				anchors[i]=ancs
			}
		}

		ancs = utilAddAnchor(nodeProps,edges)
		if(addnode){
			const idx = subgraphNodes.findIndex((item:any)=>item.id == node)
			anchors[idx]=ancs
		}else{
			anchors.push(ancs)
		}
		subgraphNodes = [...subgraphNodes, { ...nodeProps }];
		console.log("SUBGRAPH ADDNODE",subgraphNodes,anchors)
		node.data[dataindex].subgraph.nodes.push(nodeProps);
		console.log("ADD SUBGRAPH NODE",node.data[dataindex].subgraph.nodes)
		node = node
		currentnode = nodeProps['id']

	}

	const modifyNode = (e:any|undefined)=>{
		dataindex = node.data.findIndex((item:any)=>item.subgraph != null)
		subgraphNodes = node.data[dataindex].subgraph.nodes
		const index = subgraphNodes.findIndex((item:any)=>item.id == currentnode)
		if(index > -1){
			nodePropsVals.id = currentnode
			const nodeProps = utilAddNode(e,nodePropsVals)
			subgraphNodes[index] = nodeProps
			node.data[dataindex].subgraph.nodes[index] = nodeProps
		}
	}

	
	const deleteNodeClicked = async(ev:any)=>{
		dataindex = node.data.findIndex((item:any)=>item.subgraph != null)
		subgraphNodes = node.data[dataindex].subgraph.nodes
		const nodeid = ev.target.getAttribute("data-node").substring(2)
		const filterdNodes = subgraphNodes.filter((item:any)=> (item.id) != nodeid)
		const index = subgraphNodes.findIndex((item:any)=> (item.id) == nodeid)
		// TBD: ADJUST ANCHORS BEFORE SPLICE
		// 1. CHECK AFFECTED INPUT NODES
		for(let i=0; i< anchors.length; i++){
			let anc = anchors[i]
			//console.log("ANCH",anc)
			let inputs = anc.find((item:any) => item.input)
			for(let j=0; j<inputs.connections.length;j++){
				let connection = inputs.connections[j]
				if(connection[0] == nodeid){
					console.log("CONNECTION",connection,anchors[i][0].connections[j])
					anchors[i][0].connections[j] = [[],[]]
				}
			}
		}
		// 2. DELETE RELEVANT CONNECTION ON INPUT NODE
		if(index > -1)
			anchors.splice(index,1)
		subgraphNodes = filterdNodes
		node.data[dataindex].subgraph.nodes = filterdNodes
		if(subgraphNodes.length > 0)
			currentnode = subgraphNodes[0].id
		else
			currentnode = ''
	}


	const nodeClicked = (ev:any)=>{
		dataindex = node.data.findIndex((item:any)=>item.subgraph != null)
		subgraphNodes = node.data[dataindex].subgraph.nodes
		// SET CURRENT NODE
		currentnode = ev.detail.node.id.substring(2)
		// HIGHLIGTH NODE
		const wrappers = document.getElementsByClassName("node-wrapper-p")
		for(let i=0;i<wrappers.length;i++){
			wrappers[i].setAttribute('style','border: 1px solid black')
		}
		const nwuid = 'NW-'+ev.detail.node.id.substring(2)
		const wrapper = document.getElementById(nwuid)
		if(wrapper){
			wrapper.setAttribute('style','border: 3px solid red;')
			// SET CURRENT PANEL VALUE FROM defaultNodes
			const found = subgraphNodes.find((item:any)=> item.id == currentnode)
			// UPDATE DEFAULT + CUSTOM VALUES FOR CONTEXT PANEL
			if(found){
				const keys = Object.keys(found)
				for(let i=0;i<keys.length;i++){
					const value = found[keys[i]]
					// DO NOT UPDATE node id WITH OLD VALUE
					if(keys[i] != 'id')
						nodePropsVals[keys[i]] = value
				}
				// UPDATE GRAPH VALUES
				for(let i=0; i<nodePropNames.length;i++ ){
					let variable = undefined
					if(ev.detail.node[nodePropNames[i]] && ev.detail.node[nodePropNames[i]].subscribe){
						ev.detail.node[nodePropNames[i]].subscribe((value) => {variable=value})
						nodePropsVals[nodePropNames[i]] = variable
					}
				}
			}
		}
	}

	const dataNodeClicked = (ev:any)=>{
		dataindex = node.data.findIndex((item:any)=>item.subgraph != null)
		const id = ev.target.getAttribute('data-node').substring(2)
		const found = node.data[dataindex].subgraph.nodes.find((item:any)=> item.id == id )
		editnode = found
		const div = document.getElementById("defaultSubGraphDataMenuContainer")
		if(div)
			div.style.visibility='visible'
	}

</script>

<div class="subgraph-class" >
	
		<div class="subgraph-menu-header" style="--background-color:{node.bgColor}">
			<span>SUBGRAPH EDITOR: {node.label}</span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		<div id="subdrop_zone" 
			class="subgraph-menu-body" 
			style="--width:{lsvwidth+'px'};--height:{lsvheight+'px'};
			"on:contextmenu={onContextMenu}>
			<Svelvet  zoom={0.9} minimap controls id="SUBGRAPH-CANVAS" edgesAboveNode>
				
					{#each subgraphNodes as node,index}
						<Node {...node}  drop="cursor" bind:position={node.position} on:nodeClicked={nodeClicked} style="display:flex;justify-content: left;">
							{#each anchors[index] as anch}
									<Anchor {...anch} >
										
									</Anchor>
							{/each}
						
								<IsaNode bind:node={node} deleteNodeClicked={deleteNodeClicked} dataNodeClicked={dataNodeClicked} />
						
						</Node>
					
					{/each}
				
			</Svelvet>
			<ContextMenu id="{contextmenu}" add={addNode} modify={modifyNode} title="SUBGRAPH MENU" bind:propArrayVal={nodePropsVals}/>
			<div id="defaultSubGraphDataMenuContainer">
				<DataMenu id="defaultSubGraphDataMenuContainer" bind:node={editnode}/>
			</div>
		</div>
	
		
</div>

<style>f
	.subgraph-class{
		display:block;
		align-items: left;
		position: absolute;
		top: 0px;
		left: 0px;
		width:99.5%;
		height:99.5%;
		margin-left: 1px;
		border-radius: 6px;
		overflow:hidden;
		box-shadow: var(--minimap-shadow, var(--default-minimap-shadow));
		border: solid 1px;
		z-index: 3;
		justify-content: space-between;
		align-items: left;
		background-color: var(
			--prop-minimap-background-color,
			var(
				--minimap-background-color,
				var(--background-color, var(--default-minimap-background-color))
			)
		);
		border-color: var(
			--prop-minimap-border-color,
			var(--minimap-border, var(--default-minimap-border))
		);
		font-family:Verdana, Geneva, Tahoma, sans-serif;
		font-size: normal;
	}

	.subgraph-menu-header{
		display:flex;
		justify-content: space-between;
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
		background-color: var(--background-color);
	}

	.subgraph-menu-header input {
		cursor: pointer;
	}
	
	.subgraph-menu-body{
		display:block;
		justify-content: left;
		width: 100%;
		width: var(--width);
		height: var(--height);
		z-index: 3;
	}

	#defaultSubGraphDataMenuContainer{
	  visibility: hidden; /* Hidden by default */
	  position: fixed; /* Stay in place */
	  z-index: 4; /* Sit on top */
	  left: 0;
	  top: 0;
	  width:inherit; /* Full width */
	  height: inherit; /* Full height */
	  overflow: auto; /* Enable scroll if needed */
	  background-color: rgb(0,0,0); /* Fallback color */
	  background-color: rgba(0,0,0,0.1); /* Black w/ opacity */
	  overflow:hidden;
	}
	

</style>