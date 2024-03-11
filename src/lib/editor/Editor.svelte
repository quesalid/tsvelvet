<script lang="ts">
    // EXTERNAL
	import { onMount, onDestroy } from 'svelte';
    import {Svelvet, Node,Anchor} from 'svelvet';
	import EditorMenu from './EditorMenu.svelte'
	import TestMenu from './TestMenu.svelte'
	// INTERNAL - HERE CUSTOM NODES
	import Icon from './icons/Icon.svelte'
	import CustomEdge from './CustomEdge.svelte'
	import {graphStore,dragNode,uploadFile,downloadJSON} from './graphstore.js'
	// Props
	export let width = 0;
	export let height = 0;
	export let minimap = false;
	export let translation:any = { x: 0, y: 0 };
	export let controls = false;
	export let edge:any = null;
	export let edgeStyle:any = 'bezier';
	export let snapTo = 0;
	export let editable = false;
	export let fitView: boolean | 'resize' = false;
	export let locked = false;
	export let zoom = 1;
	export let theme = 'light';
	export let mermaid = '';
	export let mermaidConfig:any = {};
	export let TD = false;
	export let disableSelection = false;
	export let raiseEdgesOnSelect: boolean | 'source' | 'target' = false;
	export let modifier: 'alt' | 'ctrl' | 'shift' | 'meta' = 'meta';
	export let trackpadPan = false;
	export let toggle = false;


	// Store props in object to be passed to svelvet
	const svelvetProps = {
		width,
		height,
		minimap,
		translation,
		controls,
		edge,
		edgeStyle,
		snapTo,
		editable,
		fitView,
		locked,
		zoom,
		theme,
		mermaid,
		mermaidConfig,
		TD,
		disableSelection,
		raiseEdgesOnSelect,
		modifier,
		trackpadPan,
		toggle
	};

	let defaultNodes:any = [];
	let dropped_in: boolean;
	let drawer = true
	let drawerComponent = TestMenu
	let iconwidth = '60'
	let fill = 'grey'

	// Drag and drop events
	const handleDragEnter = (): void => {
		if (!dropped_in) dropped_in = true;
	};

	const handleDragLeave = (): void => {
		dropped_in = false;
	};

	const onDragOver = (e: DragEvent): boolean => {
		e.preventDefault();
		return false;
	};

	const handleDrop = (e: MouseEvent): void => {
		//e.stopPropagation();
		//Issue click event
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		const target = e.target as HTMLElement;
		target.dispatchEvent(moveEvent);
		// KEEP TRACK OF NODE DROP POSITION
	    const index = $graphStore.nodes.findIndex((item:any) => (item.uid)==$dragNode)
		if(index > -1){
			$graphStore.nodes[index].position.x = e.clientX
			$graphStore.nodes[index].position.y = e.clientY
		}
		$dragNode=''
		defaultNodes = JSON.parse(JSON.stringify($graphStore.nodes));
	};
	const nodeClicked = (ev:any)=>{
		ev.preventDefault()
		console.log("NODE CLICKED")
	}
	const nodeReleased = (ev:any)=>{
		ev.preventDefault()
		console.log("NODE RELEASED")
	}

	const anchorConnection = (ev:any)=>{
		ev.preventDefault()
		let nodeid = ev.detail.node.id
		let anchorid = ev.detail.anchor.id
		let anchortype = ev.detail.anchor.type
		let canchorid = ev.detail.connectedAnchor.id
		let cnodeid = ev.detail.connectedNode.id
		if(nodeid.includes("N-")){
			const Z = nodeid.replace("N-", '');
			nodeid = Z
		}
		if(cnodeid.includes("N-")){
			const Z = cnodeid.replace("N-", '');
			cnodeid = Z
		}
		if(anchorid.includes("A-")){
			const Z = anchorid.replace("A-", '');
			anchorid = Z.split('/')[0]
		}
		if(canchorid.includes("A-")){
			const Z = canchorid.replace("A-", '');
			canchorid = Z.split('/')[0]
		}
		const found = $graphStore.nodes.find((item:any) => (item.uid)==nodeid)
		console.log("FOUND NODE",found,nodeid,$graphStore.nodes)
		if(found){
			const anc = found.anchors.find((item:any)=> item.id == anchorid)
			console.log("FOUND ANCHOR",anc)
			if(anc){
				const cnid = cnodeid
				const caid = canchorid
				anc.connections.push([cnid,caid])
			}
		}
		console.log("ANCHOR CONNECTED",anchortype,anchorid,nodeid,canchorid,cnodeid)
		defaultNodes = $graphStore.nodes
		// KEEP TRACK OF NEW CONNECTION - ADD INPUT AND OUTPUT CONNECTION
	}

	/**
	 * Fired when Icon moved - automagically updates 
	 * @param ev mouse click event
	 */
	const iconClick = (ev:any) =>{
		const target = ev.target
		let id = ev.target.id

		if(id.includes("path-")){
			const Z = id.replace("path-", '');
			id = Z
		}
		// GET DIV NODE ELEMENT
		const divid = 'div-'+id
		const divElement = document.getElementById(divid)
		if(divElement){
			const boundRect = divElement.getBoundingClientRect() 
			// KEEP TRACK OF NODE MOVE
			const found = $graphStore.nodes.find((item:any) => (item.customnode+item.uid)==id)
			if(found){
				found.position.x = boundRect.left
				found.position.y = boundRect.top
			}
		}
		console.log("ICON CLICKED")
	}
	
	/**
	 * Fired when Icon right clicked - show node menu 
	 * @param ev mouse click event
	 */
	let iconContext = (ev:any) =>{
		ev.preventDefault()
		ev.stopImmediatePropagation()
		const target = ev.target
		let id = ev.target.id

		if(id.includes("path-")){
			const Z = id.replace("path-", '');
			id = Z
		}
		// GET DIV NODE ELEMENT
		const divid = 'div-'+id
		const divElement = document.getElementById(divid)
		if(divElement){
			const boundRect = divElement.getBoundingClientRect() 
			// OPEN NODE EDITOR
		}
		
	}

	/** MENU FUNCTIONS */
	let clear = (ev:any) =>{
		$graphStore = {name:'defaultGraph',nodes:[]}
		defaultNodes = $graphStore.nodes
		console.log("CLEAR")
	}

	let exp = (ev:any) =>{
		console.log("EXPORT",$graphStore)
		const name = $graphStore.name+'.json'
		const filestring = JSON.stringify($graphStore)
		uploadFile(filestring,name)
	}

	let imp = (e:any)=>{
		const element = document.getElementById("graph-data-input")
		if(element)
			element.click()
	}


	const downloadData = async (e) => {
		let file = e.target.files[0]
		const result = await downloadJSON(file)
		const data = JSON.parse(result)
		$graphStore = data
		console.log("IMPORTED",$graphStore)
		// Redraw graph
		defaultNodes = $graphStore.nodes
		console.log("IMPORTED DEFAULT NODES",defaultNodes)

	}
	const destroyEdge = (ev:any)=>{
	}
</script>


<div role="presentation"
		class="drop_zone"
		on:dragenter={handleDragEnter}
		on:dragleave={handleDragLeave}
		on:dragover={onDragOver}
		on:drop={handleDrop}>
		<Svelvet id='1' {...svelvetProps}>
			{#each defaultNodes as { anchors, edgeProps, ...nodeProps }}
					<Node {...nodeProps} drop="cursor" on:nodeClicked={nodeClicked} on:nodeReleased={nodeReleased}>
						{#if anchors}
							{#each anchors as AnchorProps}
									<Anchor {...AnchorProps} on:connection={anchorConnection} multiple>
										<CustomEdge slot=edge {destroyEdge}/>
									</Anchor>
							{/each}
						{/if}
						{#if nodeProps.customnode}
							<Icon  uid={nodeProps.uid} 
									icon={nodeProps.customnode} 
									width={nodeProps.width} 
									viewbox="0 0 2048 2048" 
									fill={nodeProps.fillColor} 
									{iconClick}
									{iconContext}/>
						{/if}
					</Node>
			{/each}
			<slot name="minimap" slot="minimap" />
			<slot name="controls" slot="controls" />
			<slot name="toggle" slot="toggle" />
		</Svelvet>
		{#if drawer}
				<svelte:component this={drawerComponent} clear={clear} exp={exp} imp={imp}/>
		{/if}
</div>
 <div>
		  <input id="graph-data-input"name="file-data-input" type='file' accept=".json" style="visibility:hidden;"  on:change={downloadData}>
</div>



<style>
.drop_zone {
	box-shadow: none;
}
:root[svelvet-theme='light'] {
	--anchor-color: #ffff00;
	--anchor-border-color: #999999;
	--anchor-connected: #0000ff;
	--node-selection-color: #00FF00;
}

</style>