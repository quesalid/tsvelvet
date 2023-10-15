<script lang="ts">
	// https://timdeschryver.dev/blog/how-to-test-svelte-components#jest-setup
	import { onMount, getContext,getAllContexts} from "svelte";
	import { Node, Svelvet, Anchor, Resizer,ThemeToggle } from 'svelvet';

	import ContextMenu from './ContextMenu.svelte'
	import InnerNode from './InnerNode.svelte'
	import CustomEdge from './CustomEdge.svelte';

	// FOR NOW SUBGRAPH SUPPORT DISABLED DUE TO SVELVET LIB LACK OF SUPPORT
	//import SubgraphNode from './SubgraphNode.svelte'
	//import Subgraph from './Subgraph.svelte'

	import { utilAddNode, 
		utilAddAnchor,
		getTreeFromGraph,
		getGraphFromTree, 
		setGraphInitialDistribution, 
		uploadFile,
		downloadJSON, 
		createLoadObserver, 
		loadData,
		getDefaultProperties,
		getDefaultPropertiesNames,
	    adjustNodeHeight} from './GraphUtils.js'

	
	// BINDINGS
	export let defaultNodes: any[] = [];
	export let anchors: any[] = [];
	export let edges: any[] = []
	export let editnode:any = {}
	export let typeOptions = [{value:"DEFAULT",options:{level:'level0'}}]
	export let sgnode:any = {}
	export let innernode = InnerNode
	export let graph = {nodes:[],edges:[]}
    export let options: any = {};
	export const sleep = function (ms:any) {
						return new Promise(resolve => setTimeout(resolve, ms));
						}

	// OPTIONS
	let contextmenu = 'myContext'
	let currentnode = ''
	let datacomp= 'ISA'
	let svwidth = 1000
	let svheight = 600
	let oldanchors = []
	
	
	// LOCAL VARS
	let inListener = false
	let outListener = false	
	let resListener = false
	let zoom = 1
	let x = 0
	let y = 0
	
	onMount(async () => {  
		defaultNodes = []
		anchors = []
		edges = []
		if(options.contextmenu)
			contextmenu = options.contextmenu
		if(options.currentnode)
			currentnode = options.currentnode
		if(options.zoom)
			zoom = options.zoom
		if(options.datacomp)
			datacomp = options.datacomp
		if(options.svwidth)
			svwidth = options.svwidth
		if(options.svheight)
			svheight = options.svheight
		nodePropsVals.data = loadData(datacomp)

		await addMouseListener()
		
	})

	const addMouseListener = async ()=>{
		const dropzone = document.getElementById("drop_zone")
		if(dropzone){
			dropzone.addEventListener("mousemove",  function(e:any) {
				//console.log("MOUSE LISTENER",e)
				x = e.clientX
				y = e.clientY
			})
		}
	}

	
   /**
	 * Add zoom listener to zoom in/out buttons
	 */
   const addZoomListener = async ()=>{
		const zoomins = document.getElementsByClassName("zoom-in")
		const zoomouts = document.getElementsByClassName("zoom-out")
		const resets = document.getElementsByClassName("reset")
		const dropzone = document.getElementById("drop_zone")
		if(zoomins.length >0 && !inListener){
			zoomins.item(0).addEventListener("mousedown", function() {
				zoom = zoom + 0.1
			})
		    inListener = true
		}
		if(zoomouts.length >0 && !outListener){
			zoomouts.item(0).addEventListener("mousedown", function() {
				zoom = zoom - 0.1
			})
			outListener = true
			if(dropzone ){
				dropzone.addEventListener("wheel", function(e) {
					if(e.deltaY > 0)
						zoom = zoom - 0.1
					else
						zoom = zoom + 0.1
				})
			}
		}
		if(resets.length >0 && !resListener){
			resets.item(0).addEventListener("mousedown", resetListener)
		    resListener = true
		}
	}

	const resetListener = async(ev:any)=>{
		//setZoomValue(1.0)
	}

	/**
	 * Set zoom value
	 * @param wanted zoom value
	 */
	const setZoomValue = (wanted:number)=>{
		const zoomins = document.getElementsByClassName("zoom-in")
		const zoomouts = document.getElementsByClassName("zoom-out")
		const direction = (wanted - zoom > 0)? 'in' : 'out'
		// LIMIT WANTED ZOOM VALUES
		if(wanted > 2.0)
			wanted = 2.0
		if(wanted < 0.2)
			wanted = 0.2
		let clicknum = Math.round(Math.abs((wanted - zoom)/0.1))
		switch(direction){
			case 'in':
				if(zoomins.length){
					for(let i=0;i<clicknum; i++){
						zoomins.item(0).dispatchEvent(new Event('mousedown'));
						
					}
				}
			break
			case 'out':
				if(zoomouts.length){
					for(let i=0;i<clicknum; i++){
						zoomouts.item(0).dispatchEvent(new Event('mousedown'));
					}
				}
			break
		}
	}

	/**
	 * Dosplay context menu
	 * @param ev context menu event
	 */
	const onContextMenu = (ev:any)=>{
		ev.preventDefault()
		let contextMenu = document.getElementById(contextmenu);
		/*let subgraphmenu = document.getElementById("defaultSubgraphMenuContainer")
		console.log("SUBGRAPH VISIBILITY",subgraphmenu.style.visibility)
		if(subgraphmenu.style.visibility != 'visible')*/
			contextMenu.style.visibility = "visible";
	}

	
	let nodePropNames = getDefaultPropertiesNames()
	let nodePropsVals = getDefaultProperties(typeOptions,options)

	/**
	 * Add new node to graph
	 * @param e add node event
	 * @param node node to add
	 * @param edges edges to add
	 */
	const addNode = async (e:any|undefined,node=null,edges=[])=>{
		let nodeProps
		let ancs
		let nodeParam = JSON.parse(JSON.stringify(nodePropsVals))

		// Set data to zero for new node 
		if(nodeParam.graphtype == 'ISA'){
				nodeParam.data = []
				let level = typeOptions.find((item:any)=>item.value == nodeParam['nodetype'])
				const dt = {type:'text', key:'level', value:level.options.level}
				const dt1 = {type:'text', key:'nodetype', value:nodeParam['nodetype']}
				nodeParam['data'].push(dt)
				nodeParam['data'].push(dt1)
		}

		// CHECK IF NODE LABEL IS UNIQUE
		const found = defaultNodes.find((item:any)=> item.label == nodeParam.label)
		if(found)
            nodeParam.label = nodeParam.label + '1'

		if(node){
			nodeParam = node
		}
		
		nodeParam.id = null
		nodeProps = utilAddNode(e,nodeParam,svwidth,svheight)
		ancs = utilAddAnchor(nodeProps,edges)

		if(node){
			const idx = defaultNodes.findIndex((item:any)=>item.id == node)
			anchors[idx]=ancs
		}else{
			anchors.push(ancs)
		}
		defaultNodes = [...defaultNodes, { ...nodeProps }];
		currentnode = nodeProps['id']
		graph = updateGraph()
		await redrawGraph(e,graph.nodes,graph.edges)
		adjustNodeHeight(graph)
		//addZoomListener()

	}

	/**
	 * Modify current graph node
	 * @param e modify node event
	 */
	const modifyNode = async (e:any|undefined)=>{
		const index = defaultNodes.findIndex((item:any)=>item.id == currentnode)
		if(index > -1){
			nodePropsVals.id = currentnode
			if(nodePropsVals.graphtype == 'ISA'){
				let level = typeOptions.find((item:any)=>item.value == nodePropsVals['nodetype'])
				const dt = {type:'text', key:'level',  value:level.options.level}
				const dt1 = {type:'text', key:'nodetype', value:nodePropsVals['nodetype']}
				const index = nodePropsVals['data'].findIndex((item:any)=>item.key == 'level')
				const index1 = nodePropsVals['data'].findIndex((item:any)=>item.key == 'nodetype')
				if(index > -1)
					nodePropsVals['data'][index] = dt
				else
					nodePropsVals['data'].push(dt)
				if(index1 > -1)
					nodePropsVals['data'][index1] = dt1
				else
					nodePropsVals['data'].push(dt1)
			}
			const nodeProps = utilAddNode(e,nodePropsVals)
			defaultNodes[index] = nodeProps

			defaultNodes = defaultNodes

		}
		graph = updateGraph()
		await redrawGraph(e,graph.nodes,graph.edges)
		adjustNodeHeight(graph)
		
	}

	/**
	 * Export graph to json file
	 * @param e export graph event
	 */
	const exportGraph = async (e:any|undefined)=>{
		setZoomValue(1.0)
		const exp = updateGraph()
		//console.log("GRAPH",exp)
		/*if(exp.nodes && exp.nodes.length > 0){
			 const tree = await getTreeFromGraph(exp,exp.nodes[0],null)
			 console.log("TREE",tree)
			 const backgraph = await getGraphFromTree(tree)
			 console.log("BACKGRAPH",backgraph)
		}*/
		const filestring = JSON.stringify(exp)
		uploadFile(filestring,'TEST.json')
	}

	/**
	 * Update graph from current edges and nodes
	 */
	const updateGraph = ()=>{
		const edges = getAllEdges()
		const nodes = defaultNodes
		const exp = {nodes:nodes,edges:edges}
		return exp
	}

	
	/**
	 * Import graph from json file clicking on hidden input
	 * @param e import graph event
	 */
	const importGraph = (e:any|undefined)=>{
		const element = document.getElementById("file-db-input")
		if(element)
			element.click()
	}

	/**
	 * Download data from json file clicking on hidden input
	 * @param e hidden input event
	 */
	const downloadData = async (e:any|undefined)=>{
		let file = e.target.files[0]
		const result = await downloadJSON(file)
		const data = JSON.parse(result)
		const keys = Object.keys(data)
		for(let i=0;i<data.length;i++){
			const dt = data[i]
			const index = editnode.data.findIndex((item:any)=> item.key == dt.key)
			if(index >-1)
				editnode.data[index].value = dt.value
			else
				editnode.data.push(dt)
		}
		editnode = editnode
	}

	/**
	 * Redraw graph from nodes and edges
	 * @param e event
	 * @param nodes graph nodes
	 * @param edges graph edges
	 */
	const redrawGraph = async (e:any,nodes:any,edges:any)=>{
		// 1. GET ALL GRAPH ANCHORS
		//const oldanchors = document.getElementsByClassName("svelvet-anchor")
		
		anchors = []
		defaultNodes = []

		for(let i=0;i<nodes.length;i++){
			const node = nodes[i]
			let nodeProps
			let ancs
			nodeProps = utilAddNode(e,node,svwidth,svheight)
			ancs = utilAddAnchor(node,edges)
			anchors.push(ancs)
			defaultNodes = [...defaultNodes, { ...nodeProps }]
			await sleep(30)
		}
		defaultNodes = defaultNodes
		if(nodes.length > 0)
			currentnode = nodes[0]
		oldanchors = anchors
		//console.log("OLD ANCHORS",oldanchors)
		addAnchorListener()
		addZoomListener()
	}


	/**
	 * Add listener to all anchors
	 * @param tag tag to filter anchors
	 */
	const addAnchorListener = (tag="INPUT")=>{
		// GET ALL INPUT ANCHORS
		let arcwrapper = document.getElementsByClassName("anchor-wrapper")
		let arcArray = Array.from(arcwrapper)
		arcArray = arcArray.filter((item:any)=> item.id.includes(tag))
		//console.log("ARC WRAPPER",arcArray)
		for(let i=0;i<arcArray.length;i++){
			//console.log("INPUT ARC ",arcArray[i])
			const elem = document.getElementById(arcArray[i].id)
			if(elem){
				elem.removeEventListener("mouseUp", anchorMouseUp)
				elem.addEventListener("mouseup", anchorMouseUp)
			}
		}
	}

	/**
	 * Anchor mouseup listener
	 * @param tag tag to filter anchors
	 */
	const anchorMouseUp = (ev:any)=>{
		// UPDATES GRAPH EDGES
		edges = getAllEdges()
		graph.edges = edges
		setGraphInitialDistribution(graph)

	}

	/**
	 * Dowload graph from json file clicking on hidden input
	 * @param e hidden input event
	 */
	const downloadFile = async (e:any|undefined)=>{
		setZoomValue(1.0)
		let file = e.target.files[0]
		const result = await downloadJSON(file)
		graph = JSON.parse(result)
		// DEFAULT NODES
		const nodes = graph.nodes
		edges = graph.edges
		setGraphInitialDistribution(graph)
		await redrawGraph(e,nodes,edges)
		adjustNodeHeight(graph)
	}

	/**
	 * Clear graph
	 * @param e clear graph event
	 */
	const clearGraph = (e:any|undefined)=>{
		anchors = []
		defaultNodes = []
		currentnode = ''
	}

	/**
	 * Destroy edge on button click
	 * @param ev button click event
	 */
	const destroyEdge = (ev:any)=>{
		let element = ev.target.parentNode 
		let id = ''
		while(element && element.nodeName != 'svg')
			element = element.parentNode
		// GET INPUT/OUPUT ANCHORS
		
		const children = element.children
		for(let i=0;i<children.length;i++){
			const child = children[i]
			if(child.nodeName == 'path' && child.id){
				id = child.id
				/*const splitted = child.id.split('+')
				const input = splitted[0].split('/')[0]
				const destination = splitted[0].split('/')[1]
				const output = splitted[1].split('/')[0]
				const source = splitted[1].split('/')[1]
				console.log("PATH",input,destination, output,source)
				console.log("EDGES",edges,child.id)*/
			}
		}
		if(element){
			   element.remove()
			   edges = edges.filter((item:any)=> item.id != id)
			   console.log("SVG",element,edges)
		}
		// UPDATE GRAPH EDGES
		//edges = edges.filter((item:any)=> item.id != id)
		graph.edges = edges
		// REDRAW GRAPH
		element = document.getElementById("file-db-input")
		setGraphInitialDistribution(graph)
		redrawGraph(element,graph.nodes,edges)
		adjustNodeHeight(graph)
	}

	
	/**
	 * Select node on clik
	 * @param ev node click event
	 */
	const nodeClicked = (ev:any)=>{
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
			const found = defaultNodes.find((item:any)=> item.id == currentnode)
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

	/**
	 * Delete clicked node
	 * @param ev delete node click event
	 */
	const deleteNodeClicked = async(ev:any)=>{
		// DELETE NODE FROM graph nodes AND EDGES FROM graph edges
		// THEN REDRAW  graph
		const nodeid = ev.target.getAttribute("data-node").substring(2)
		const element = document.getElementById("file-db-input")

		graph.nodes = graph.nodes.filter((item:any)=> item.id != nodeid)
		graph.edges = graph.edges.filter((item:any)=> (item.source !=('N-'+nodeid)) && (item.destination != ('N-'+nodeid)))


		const nodes = graph.nodes
		edges = graph.edges
		setGraphInitialDistribution(graph)
		await redrawGraph(element,nodes,edges)
		adjustNodeHeight(graph)
		
	}

	/**
	 * Show data panel on node click
	 * @param ev data node click event
	 */
	const dataNodeClicked = (ev:any)=>{
		const id = ev.target.getAttribute('data-node').substring(2)
		const found = defaultNodes.find((item:any)=> item.id == id )
		editnode = found
		const div = document.getElementById("defaultDataMenuContainer")
		if(div)
			div.style.visibility='visible'
		
	}

	/**
	 * Show distribution panel on node click
	 * @param ev distribution node click event
	 */
	const distNodeClicked = (ev:any)=>{
		const id = ev.target.getAttribute('data-node').substring(2)
		const found = defaultNodes.find((item:any)=> item.id == id )
		editnode = found
		const div = document.getElementById("defaultDistributionMenuContainer")
		if(div)
			div.style.visibility='visible'
	}

	/*const openGraphClicked = (ev:any)=>{
		const id = ev.target.getAttribute('data-node').substring(2)
		const found = defaultNodes.find((item:any)=> item.id == id )
		sgnode = found
		const index = sgnode.data.findIndex((item:any)=>item.subgraph != null)
		if(index < 0)
			sgnode.data.push({subgraph:{nodes:[],edges:[]}})
		console.log("openGraphClicked ......",sgnode)
		const div = document.getElementById("defaultSubgraphMenuContainer")
		const cevent = new CustomEvent("subgraphVisible", 
			{
				bubbles: true,
				detail: { sgnode: sgnode,edges:[] }
			}
		)
		div.dispatchEvent( cevent)
		if(div)
			div.style.visibility='visible'
	}*/

	/**
	 * Get all graph edges by document parsing
	 * Temporary because library doesn't have import/export yet
	 * @retunn all graph edges
	 */
	const getAllEdges = ()=>{
		const EDGES = []
		// Query the dom to get all edges
		let edgeArray:any
		const edgewrappers = document.getElementsByClassName("edges-wrapper")
		edgeArray = Array.from(edgewrappers)
		for(let i=0;i<edgeArray.length;i++){
			let pathArray:any
			var dummyEl = document.createElement( 'html' )
			dummyEl.innerHTML = edgeArray[i].innerHTML
			//let paths = dummyEl.getElementsByClassName("edge")
			let paths = dummyEl.getElementsByTagName("path")
			pathArray = Array.from(paths)
			for(let j=0;j<pathArray.length;j++){
				// Split source destination
				if(pathArray[j].id && pathArray[j].id.includes('+')){
					const splitted = pathArray[j].id.split('+')
					const destsplit = splitted[0].split('/')
					const sourcesplit = splitted[1].split('/')
					const sourcenode = sourcesplit[1].replace('-target', '')
					const sourceanch = sourcesplit[0]
					const destnode = destsplit[1]
					const destanch = destsplit[0]
					const path = pathArray[j].getAttribute("d")
					const edge = {
						id:pathArray[j].id,
						source:sourcenode,
						sourceanchor:sourceanch,
						destination:destnode,
						destanchor:destanch,
						path:path
					}
					EDGES.push(edge)
				}
			}
		}
		return(EDGES)
	}

</script>


<div
	id="drop_zone"
	on:contextmenu={onContextMenu}
	class="editor-container"
	style="--width:{svwidth+'px'};--height:{svheight+'px'};position:relative;">

	<Svelvet  bind:zoom={zoom} minimap controls id="GRAPH-CANVAS">
		{#each defaultNodes as node,index}
			<Node {...node}  drop="cursor"  bind:position={node.position} on:nodeClicked={nodeClicked}  style="display:flex;justify-content: left;">
				{#each anchors[index] as anch}
						<Anchor {...anch} multiple>
							<CustomEdge slot=edge label="DEL" destroyEdge={destroyEdge}/>
						</Anchor>
				{/each}
					<!-- HERE SHOULD ADD SUBGRAPH SPECIFIC NODE TYPE -->
					<Resizer width height rotation/>
					<svelte:component this={innernode} graph={graph} bind:node={node} deleteNodeClicked={deleteNodeClicked} dataNodeClicked={dataNodeClicked} distNodeClicked={distNodeClicked}/>
					
			</Node>
		{/each}
		<!--ThemeToggle main="light" alt="dark" slot="toggle" /-->
	</Svelvet>
	
	<ContextMenu bind:x={x} bind:y={y} bind:zoom={zoom} id="{contextmenu}" add={addNode} modify={modifyNode} exp={exportGraph} imp={importGraph} clear={clearGraph} bind:propArrayVal={nodePropsVals} typeOptions={typeOptions} options={options}/>
	
	<input id="file-db-input"name="file-db-input" type='file' accept=".json" style="visibility:hidden;"  on:change={downloadFile} >
	<input id="file-data-input"name="file-data-input" type='file' accept=".json" style="visibility:hidden;"  on:change={downloadData}>
	<div id="defaultDataMenuContainer">
		<slot name="data">No slot </slot>
	</div>
	<div id="defaultDistributionMenuContainer">
		<slot name="distribution">No slot</slot>
	</div>
	<!--div id="defaultSubgraphMenuContainer">
		<Subgraph id="defaultSubgraphMenuContainer" bind:node={sgnode} svwidth={svwidth} svheight={svheight} />
	</!-div-->
</div>

<style>
#drop_zone{
	width: var(--width);
	height: var(--height);
	position: fixed; /* Stay in place */
	left: 0;
	top: 0;
	overflow:hidden ;
}
#defaultDataMenuContainer{
  visibility: hidden; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 3; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width:inherit; /* Full width */
  height: inherit; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.1); /* Black w/ opacity */
}

#defaultDistributionMenuContainer{
  visibility: hidden; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 3; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width:inherit; /* Full width */
  height: inherit; /* Full height */
  overflow: auto; /*Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.1); /* Black w/ opacity */
}




</style>


