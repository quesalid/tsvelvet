<script lang="ts">
// BPM https://www.visual-paradigm.com/guide/
//     https://camunda.com/bpmn/examples/
//     https://www.pleus.net/blog/?p=2142
//	   ICONS https://icon-sets.iconify.design/bpmn/
// DRAG https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/

// EXTERNAL
import { onMount, onDestroy, getContext } from 'svelte';
import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';


// INTERNAL
import Icon from './icons/Icon.svelte'
import CustomEdge from './CustomEdge.svelte'
import {nodePropDefault,
		anchorPropDefault,
		createNodeProps,
		updateDragNode,
		graphStore,
		toArrayObjProps} from './graphstore.js'



onMount(async () => {
	// CLEAR STORE ON OPENS
	$graphStore = {name:'defaultGraph',nodes:[]}
})


export let exp = (ev:any) =>{console.log("EXPORT")}
export let imp = (ev:any) =>{console.log("IMPORT")}
export let load = (ev:any) =>{console.log("LOAD")}
export let save = (ev:any) =>{console.log("SAVE")}
export let del = (ev:any) =>{console.log("DEL")}
export let clear = (ev:any) =>{console.log("CLEAR")}

export let buttons = [
	{value:'EXP',function:exp},
	{value:'IMP',function:imp},
	{value:'LOAD',function:load},
	{value:'SAVE',function:save},
	{value:'DEL',function:del},
	{value:'CLEAR',function:clear},
]

let nav:HTMLElement;
let drawerMenuContent: HTMLElement;
let drawerMenuHeader: HTMLElement;
let drawerMenuBody: HTMLElement;

const handleDrawer = () => {
		if (!isOpen) {
			isOpen = true;
			nav.style.height = 'fit-content';
			nav.style.width = '300px';
			drawerMenuContent.style.width= '300px'
			drawerMenuContent.style.height= 'fit-content'
			drawerMenuContent.style.display= 'block'
		} else {
			isOpen = false;
			nav.style.height = '35px';
			nav.style.width = '35px';
			drawerMenuContent.style.width= '35px'
			drawerMenuContent.style.height= '35px'
			drawerMenuContent.style.display= 'none'
		}
	};


let isOpen = false
let width = '16px'
let iconwidth = '40'
let iconwidthbig = '80'
let fill = 'teal'


// START DRAG EVENT
let iconDragStart = (ev:any)=>{
		let id = ev.target.id

		if(id.includes("div-")){
			const Z = id.replace("div-", '');
			id = Z
		}
		// A. CREATE NEW CUSTOM NODE
		const newNodeProps = JSON.parse(JSON.stringify(nodePropDefault))
		const found = icons.find((item:any) => item.name==id)
		newNodeProps.customnode = found.name
		newNodeProps.width = found.nodewidth
		newNodeProps.height = found.nodeheight
		newNodeProps.fillColor = found.fill
		newNodeProps.uid = uuidv4()
		newNodeProps.id = newNodeProps.uid
		if(found.customedge)
			newNodeProps.edge = found.customedge
		const nodeArray = toArrayObjProps(newNodeProps)
		// B. CREATE NEW INPUT ANCHORS
		const anchorsArray = []
		// INPUTS
		for(let i=0;i<newNodeProps.inputs;i++){
			const newAnchorProps = JSON.parse(JSON.stringify(anchorPropDefault))
			newAnchorProps.input = true
			newAnchorProps.dynamic = true
			newAnchorProps.direction = 'west'
			newAnchorProps.id = 'IN-'+i+'-'+newNodeProps.uid
			const anchor = toArrayObjProps(newAnchorProps)
			anchorsArray.push(newAnchorProps)
		}
		// OUTPUTS
		for(let i=0;i<newNodeProps.outputs;i++){
			const newAnchorProps = JSON.parse(JSON.stringify(anchorPropDefault))
			newAnchorProps.output = true
			newAnchorProps.dynamic = true
			newAnchorProps.id = 'OUT-'+i+'-'+newNodeProps.uid
			newAnchorProps.direction = 'east'
			const anchor = toArrayObjProps(newAnchorProps)
			anchorsArray.push(newAnchorProps)
		}
		// DROP IN Editor.handleDrop()
		createNodeProps(nodeArray,null,anchorsArray)
		updateDragNode(newNodeProps.uid)
}

let icons:any = [
	{width:iconwidth,nodewidth:60,nodeheight:70,fill:fill,name:"gateway_parallel",dragStart:iconDragStart},
	{width:iconwidth,nodewidth:60,nodeheight:70,fill:fill,name:"gateway_eventbased",dragStart:iconDragStart},
	{width:iconwidth,nodewidth:60,nodeheight:70,fill:fill,name:"gateway_xor",dragStart:iconDragStart},
	{width:iconwidth,nodewidth:120,nodeheight:120,fill:fill,name:"subprocess_expanded",dragStart:iconDragStart,customedge:CustomEdge},
]
</script>

<nav id="drawerWrapper" bind:this={nav} style="--controls-text-color:#222">
	<button
			class="drawerBtn"
			on:click={handleDrawer}
			aria-label="Open/Close Drawer"
		>
			<Icon icon={isOpen ? 'south_east' : 'north_west'} fill="black" />
		</button>
	  <div class="drawerMenuContent" bind:this={drawerMenuContent} style="--width:{width};">
		  <div class="drawerMenuHeader" bind:this={drawerMenuHeader} style="--width:{width};">
			  {#each buttons as btn}
					<input type="button" value="{btn.value}" on:click={btn.function} />
				{/each}
		  </div>
		  <div class="drawerMenuBody" bind:this={drawerMenuBody}>
			  {#each icons as IC}
			<Icon  icon={IC.name} width='{IC.width}' viewbox="0 0 2048 2048" fill={IC.fill} iconDragStart={IC.dragStart}/>
			{/each}
		  </div>
	  </div>
</nav>

<style>
#drawerWrapper {
		position: absolute;
		width: 35px;
		height: 30px;
		border-radius: 6px;
		left: 10px;
		top: 10px;
		border: solid 1px;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: left;
		transition: 1s;
		padding-top: 10px;
		cursor: auto;
		color: var(
			--prop-controls-text-color,
			var(--controls-text-color, var(--default-controls-text-color))
		);
		background-color: var(
			--prop-controls-background-color,
			var(--controls-background-color, var(--default-controls-background-color))
		);
	}
.drawerBtn {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 20px;
		left: 20px;
		font-size: 20px;
		cursor: pointer;
		padding: 0.2rem 0;
		border: none;
		background: none;
		color: inherit;
	}

	.drawerMenuContent {
		display: none;
		padding-top: var(--width);
		align-items: flex-start;
	}
	.drawerMenuHeader {
		display: flex;
		margin-top: 6px;
		list-style: none;
		width: 100%;
		text-decoration: none;
		font-size: 13px;
		overflow: hidden;
		transition: 0.3s;
		padding: 0;
	}
	.drawerMenuHeader input[type='button']{
		background-color: #eeeeee;
		cursor:pointer;
		border: 1px solid #aaaaaa;
		padding-bottom: 2px ;
		margin-right: 1px;
		padding: 1px;
	}
	.drawerMenuHeader input[type='button']:hover{
		font-weight: bold ;
	}
	.drawerMenuBody {
		margin-top: 10px;
		display: flex;
	}
	
</style>