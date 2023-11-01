<script lang="ts">
	// https://timdeschryver.dev/blog/how-to-test-svelte-components#jest-setup
	import { onMount, getContext,getAllContexts} from "svelte";
	import { Node, Svelvet, Anchor, Resizer,ThemeToggle } from 'svelvet';

	import ContextMenu from './ContextMenu.svelte'
	import IsaNode from './IsaNode.svelte'
	import CustomEdge from './CustomEdge.svelte';

	
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
	    adjustNodeHeight,
		getParamsAddNode,
		getParamsModNode,
		getAllEdges,
		updateAllCValues} from './GraphUtils.js'
   
    

	
	// BINDINGS
	export let defaultNodes: any[] = [];
	export let anchors: any[] = [];
	export let edges: any[] = []
	export let editnode:any = {}
	export let typeOptions = [{value:"DEFAULT",options:{level:'level0'}}]
	export let sgnode:any = {}
	export let innernode = IsaNode
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
	let title = ''
	let wrapperClassName = "node-wrapper-p"
	
	
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
		if(options.title)
			title = options.title
		nodePropsVals.data = loadData(datacomp)
		if(datacomp == 'BAYES')
				wrapperClassName = "bayes-node-wrapper-p"

		setContextTitle(datacomp)
		await addMouseListener()
		// ADD REDRAW GRAPH LISTENER
		const div = document.getElementById("drop_zone")
		if(div){
			console.log("ADDED REDRAW LISTENER")
			div.addEventListener('redrawgraph',redrawEvent)
		}

		
	})
		
	const redrawEvent = (ev:any)=>{
		console.log("REDRAW EVENT",ev.detail.graph)
		redrawGraph(ev,graph)
	}

	const addMouseListener = async ()=>{
		const dropzone = document.getElementById("drop_zone")
		const canvas = document.getElementById("G-GRAPH_CANVAS")
		if(dropzone){
			dropzone.addEventListener("mousemove",  function(e:any) {
				x = e.clientX
				y = e.clientY
			})
		}
		if(canvas){
			canvas.addEventListener("mousedown",  function(e:any) {
				console.log("CANVAS MOUSEDOWN")
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
				if(zoom < 0.1)
					setZoomValue(0.1)
			})
			outListener = true
			if(dropzone ){
				dropzone.addEventListener("wheel", function(e) {
					if(e.deltaY > 0){
						zoom = zoom - 0.1
						if(zoom < 0.1)
							setZoomValue(0.1)
					}
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
		setZoomValue(1.0)
		graph = updateGraph()
	}

	/**
	 * Set Context title
	 * @param name name to add to title
	 */
	const setContextTitle = (name:any)=>{
		title = datacomp+" GRAPH - "+name
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

	const clickReset = ()=>{
		const resets = document.getElementsByClassName("reset")
		if(resets.length){
			resets.item(0).dispatchEvent(new Event('mousedown'));
		}
	}

	/**
	 * Dosplay context menu
	 * @param ev context menu event
	 */
	const onContextMenu = (ev:any)=>{
		ev.preventDefault()
		let contextMenu = document.getElementById(contextmenu);
		contextMenu.style.height = ""
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

		// Adjust node params to current node type and graph type
		getParamsAddNode(nodeParam,typeOptions)

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
			const idx = defaultNodes.findIndex((item:any)=>item.id == node.id)
			anchors[idx]=ancs
		}else{
			anchors.push(ancs)
		}
		defaultNodes = [...defaultNodes, { ...nodeProps }];
		graph = updateGraph()
		await redrawGraph(e,graph)
		currentnode = nodeProps['id']
		editnode = graph.nodes.find((item:any)=> item.id ==  nodeProps['id'])
		// Highlight node
		highlightNode(nodeProps.id)

	}

	const highlightNode = (id:any)=>{
		const wrappers = document.getElementsByClassName(wrapperClassName)
		for(let i=0;i<wrappers.length;i++){
			const style = window.getComputedStyle(wrappers[i], null)
			const border = style.getPropertyValue('border')
			wrappers[i].setAttribute('style',border)
		}
		const nwuid = 'NW-'+id
		const wrapper = document.getElementById(nwuid)
		if(wrapper)
			wrapper.setAttribute('style','border: 4px solid red;')
	}


	/**
	 * Modify current graph node
	 * @param e modify node event
	 */
	const modifyNode = async (e:any|undefined)=>{
		const index = defaultNodes.findIndex((item:any)=>item.id == currentnode.substring(2))
		let found
		if(index > -1){
			nodePropsVals.id = currentnode.substring(2)
			//nodePropsVals.id = editnode.id
			found = defaultNodes.find((item:any)=> item.id == currentnode.substring(2))
			// Adjust node params to current node type and graph type
			getParamsModNode(nodePropsVals,typeOptions)
			const nodeProps = utilAddNode(e,nodePropsVals)
			defaultNodes[index] = nodeProps
			defaultNodes = defaultNodes

		}
		graph = updateGraph()
		await redrawGraph(e,graph)
		if(found){
			console.log("MODIFY NODE FOUND")
			const div = document.getElementById("dragabledefaultDataMenuContainer")
			// Force panel update
			const event = new CustomEvent("checknodedata", 
				{
					bubbles: true,
					detail: { node: found }
				}
			)
			div.dispatchEvent(event)
		}
		
	}

	/**
	 * Export graph to json file
	 * @param e export graph event
	 */
	const exportGraph = async (e:any|undefined)=>{
		let filestring = ''
		//setZoomValue(1.0)
		clickReset()
		const exp = updateGraph()
		if(exp.nodes && exp.nodes.length > 0 && exp.nodes[0].graphtype == 'ISA'){
			 const tree = await getTreeFromGraph(exp,exp.nodes[0],null)
			 let seen = []
		     filestring = JSON.stringify(tree, function (key, val) {
					if (typeof val == "object") {
						if (seen.indexOf(val) >= 0)
							return
						seen.push(val)
					}
					return val
				});
		}else{
			filestring = JSON.stringify(exp)
		}
		uploadFile(filestring,'TEST.json')
	}

	/**
	 * Update graph from current edges and nodes
	 */
	const updateGraph = ()=>{
		const edges = getAllEdges(document)
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
		// CLICK RESET TO CENTER GRAPH
		clickReset()
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
	 * called by: addNode, modifyNode, downloadFile, deleteNodeClicked, destroyEdge
	 * @param e event
	 * @param nodes graph nodes
	 * @param edges graph edges
	 */
	const redrawGraph = async (e:any,graph:any)=>{
		const currentzoom = zoom
		// SHOUlD ADJUST NODE POSITIN TO CURRENT ZOOM
		clearGraph(e)
		setZoomValue(1.0)
		const nodes = graph.nodes
		const edges = graph.edges


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
		//defaultNodes = defaultNodes
		if(nodes.length > 0){
			currentnode = nodes[0].id
			//editnode = nodes[0]
		}
		oldanchors = anchors
		//console.log("OLD ANCHORS",oldanchors)
		addAnchorListener()
		addZoomListener()
		setZoomValue(currentzoom)
		adjustNodeHeight(graph,document)
		defaultNodes = defaultNodes
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
		for(let i=0;i<arcArray.length;i++){
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
		edges = getAllEdges(document)
		graph.edges = edges
		if(graph.nodes && graph.nodes.length > 0 && graph.nodes[0].graphtype == 'BAYES'){
			setGraphInitialDistribution(graph)
		}
	}

	/**
	 * Dowload graph from json file clicking on hidden input
	 * @param e hidden input event
	 */
	const downloadFile = async (e:any|undefined)=>{
		//setZoomValue(1.0)
		clickReset()
		let file = e.target.files[0]
		//console.log("DOWNLOAD DATA",file.name)
		const fname = file.name.split('.')[0]
		setContextTitle(fname)
		const result = await downloadJSON(file)
		// FROM TREE TO GRAPH IF options.datacomp == 'ISA'
		if(options.datacomp == 'ISA'){
			const tree = JSON.parse(result)
			graph = await getGraphFromTree(tree)
		}
		else
			graph = JSON.parse(result)
		
		// DEFAULT NODES
		const nodes = graph.nodes
		edges = graph.edges
		if(options.datacomp == 'bayes')
			setGraphInitialDistribution(graph)
		await redrawGraph(e,graph)
		updateAllCValues(document,graph)
	}

	/**
	 * Clear graph
	 * @param e clear graph event
	 */
	const clearGraph = (e:any|undefined)=>{
		anchors = []
		defaultNodes = []
		currentnode = ''
		//setContextTitle(datacomp)
		//editnode = {}
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
			}
		}
		if(element){
			   element.remove()
			   edges = edges.filter((item:any)=> item.id != id)
		}
		// UPDATE GRAPH EDGES
		graph.edges = edges
		// REDRAW GRAPH
		element = document.getElementById("file-db-input")
		if(options.datacomp == 'bayes')
			setGraphInitialDistribution(graph)
		graph.nodes = defaultNodes
		redrawGraph(element,graph)
	}

	
	/**
	 * Select node on clik
	 * @param ev node click event
	 */
	const nodeClicked = (ev:any)=>{
		
		// SET CURRENT NODE
		currentnode = ev.detail.node.id
		//editnode = ev.detail.node
		// HIGHLIGTH NODE
		const wrappers = document.getElementsByClassName(wrapperClassName)
		for(let i=0;i<wrappers.length;i++){
			const style = window.getComputedStyle(wrappers[i], null)
			const border = style.getPropertyValue('border')
			wrappers[i].setAttribute('style',border)
		}
		const nwuid = 'NW-'+ev.detail.node.id.substring(2)
		const wrapper = document.getElementById(nwuid)
		if(wrapper){
			wrapper.setAttribute('style','border: 4px solid red;')
			// SET CURRENT PANEL VALUE FROM defaultNodes
			const found = defaultNodes.find((item:any)=> item.id == currentnode.substring(2))
			// UPDATE DEFAULT + CUSTOM VALUES FOR CONTEXT PANEL
			if(found){
				editnode = found
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

	const nodeReleased = (ev:any)=>{
		// SET CURRENT NODE
		//console.log("NODE RELEASED",ev.detail.node)
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
		if(options.datacomp == 'bayes')
			setGraphInitialDistribution(graph)
		//graph = updateGraph()
		await redrawGraph(element,graph)
		
	}

	/**
	 * Show data panel on node click
	 * @param ev data node click event
	 */
	const dataNodeClicked = (ev:any)=>{
		const id = ev.target.getAttribute('data-node').substring(2)
		const found = defaultNodes.find((item:any)=> item.id == id )
		// Highlight node
		highlightNode(id)
		if(found){
			editnode = found
			const div = document.getElementById("defaultDataMenuContainer")
			if(div)
				div.style.visibility='visible'
		}
		
	}

	/**
	 * Show distribution panel on node click
	 * @param ev distribution node click event
	 */
	const distNodeClicked = (ev:any)=>{
		const id = ev.target.getAttribute('data-node').substring(2)
		const found = defaultNodes.find((item:any)=> item.id == id )
		editnode = found
		// Highlight node
		highlightNode(id)
		const div = document.getElementById("defaultDistributionMenuContainer")
		if(div)
			div.style.visibility='visible'
	}

	/**
	 * Show distribution definition panel on node click
	 * @param ev distribution node click event
	 */
	const distDefClicked = (ev:any)=>{
		const id = ev.target.getAttribute('data-node').substring(2)
		const found = defaultNodes.find((item:any)=> item.id == id )
		editnode = found
		// Highlight node
		highlightNode(id)
		const div = document.getElementById("defaultDistributionDefContainer")
		if(div)
			div.style.visibility='visible'
	}

	const loadGraph = (ev:any)=>{
		const div = document.getElementById("defaultLoadGraphContainer")
		if(div)
			div.style.visibility='visible'
	}

	const saveGraph = (ev:any)=>{
		const div = document.getElementById("defaultSaveGraphContainer")
		if(div)
			div.style.visibility='visible'
	}

	const deleteGraph = (ev:any)=>{
		const div = document.getElementById("defaultDeleteGraphContainer")
		if(div)
			div.style.visibility='visible'
	}
	

	</script>


<div
	id="drop_zone"
	on:contextmenu={onContextMenu}
	class="editor-container"
	style="--width:{svwidth+'px'};--height:{svheight+'px'};position:relative;"
	>

		<Svelvet  bind:zoom={zoom} minimap controls id="GRAPH-CANVAS">
			{#each defaultNodes as node , index}
				<Node {...node}
				drop="cursor" bind:position={node.position} on:nodeClicked={nodeClicked} on:nodeReleased={nodeReleased} style="display:flex;justify-content: left;">
					{#each anchors[index] as anch}
							<Anchor {...anch} multiple>
								<CustomEdge slot=edge label="DEL" destroyEdge={destroyEdge}/>
							</Anchor>
					{/each}
						<!-- HERE SHOULD ADD SUBGRAPH SPECIFIC NODE TYPE -->
						<Resizer width height rotation/>
						<svelte:component this={innernode} graph={graph} bind:node={node} deleteNodeClicked={deleteNodeClicked} dataNodeClicked={dataNodeClicked} distNodeClicked={distNodeClicked} distDefClicked={distDefClicked}/>
					
				</Node>
			{/each}
			<!--ThemeToggle main="light" alt="dark" slot="toggle" /-->
		</Svelvet>
	
		<ContextMenu bind:title={title} bind:x={x} bind:y={y} bind:zoom={zoom} id="{contextmenu}" del={deleteGraph} save={saveGraph} load={loadGraph} add={addNode} modify={modifyNode} exp={exportGraph} imp={importGraph} clear={clearGraph} bind:propArrayVal={nodePropsVals} typeOptions={typeOptions} options={options}/>
	
		<input id="file-db-input"name="file-db-input" type='file' accept=".json" style="visibility:hidden;"  on:change={downloadFile} >
		<input id="file-data-input"name="file-data-input" type='file' accept=".json" style="visibility:hidden;"  on:change={downloadData}>
		<div id="defaultDataMenuContainer">
			<slot name="data">No slot </slot>
		</div>
		<div id="defaultDistributionMenuContainer">
			<slot name="distribution">No slot</slot>
		</div>
		<div id="defaultDistributionDefContainer">
			<slot name="distributiondef">No slot</slot>
		</div>
		<div id="defaultLoadGraphContainer">
			<slot name="importgraph">No slot</slot>
		</div>
		<div id="defaultSaveGraphContainer">
			<slot name="savegraph">No slot</slot>
		</div>
		<div id="defaultDeleteGraphContainer">
			<slot name="deletegraph">No slot</slot>
		</div>
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

#defaultDistributionDefContainer{
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

#defaultLoadGraphContainer{
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

#defaultSaveGraphContainer{
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

#defaultDeleteGraphContainer{
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


