<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";



import {dragElement} from './GraphUtils'

export let graphs = []

export let submitQuery = (ev:any|undefined)=>console.log("SUBMIT DATA")
export let graphSelect = (ev:any|undefined)=>console.log("LOAD DATA")
export let id: string|any = 'defaultLoadGraphContainer'
export let graph = {nodes:[],edges:[]}


let inpuHeaderColor = '#f1f1f1'



const sleep = function (ms:any) {
						return new Promise(resolve => setTimeout(resolve, ms));
						}


onMount(async () => {  
	const dragable = document.getElementById("dragable"+id);
    const dragzone = document.getElementById("dragzone"+id);
	dragElement(dragable, dragzone);
 })

const closeMenu = (ev:any)=>{
	const select = document.getElementById("ggraph-select")
	if(select)
		select.style.visibility = "hidden";
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";
	const elem = document.getElementById("ggraph-search")
	if(elem)
		elem.value = ''
	// DISPATCH REDRAW EVENT
	const div = document.getElementById("drop_zone")
	// Force panel update
	const event = new CustomEvent("redrawgraph", 
		{
			bubbles: true,
			detail: { graph: graph }
		}
	)
	div.dispatchEvent(event)
}




</script>

<div class="data-menu" id="{'dragable'+id}">
	<header id="{'dragzone'+id}">
		<div class="data-menu-header" style="--background-color:{inpuHeaderColor}">
			<span>LOAD GRAPH </span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		 <div class="data-menu-toolbar">
			<label for="gsearch">Search Graph:</label>
			<input type="search" id="ggraph-search" name="q">
			<input type="submit" on:click={submitQuery}>
		</div>
		<div class="data-menu-body" id="ggraph-select">
			<select  class="form-control" on:change={graphSelect}>
				<option value="">-- Select --</option>
				{#each graphs as graph}
					<option value={graph.id} data-graph={JSON.stringify(graph.graph)}>{graph.name}</option>
				{/each}
			</select>
		</div>
	</header>
</div>


<style>
	.data-menu{
		display:block;
		align-items: left;
		position: absolute;
		top: 50px;
		left: 50px;
		width:max-content;
		overflow-y: auto;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: var(--minimap-shadow, var(--default-minimap-shadow));
		border: solid 1px;
		z-index: 4;
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

	.data-menu-header{
		display:flex;
		justify-content: space-between;
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
		background-color: var(--background-color);
		cursor:grab;
	}

	.data-menu-header input {
		cursor: pointer;
	}
	.data-menu-toolbar{
		display:flex;
		justify-content: left;
		margin-top: 4px;
		margin-bottom: 12px;
		margin-left: 2px;

	}

	.data-menu-toolbar input {
		cursor: pointer;
	}
	.data-menu-toolbar input{
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
	}
	.data-menu-body{
		display:block;
		justify-content: left;
		overflow-y: auto;
		overflow-x:hidden;
		/*height: 250px;*/
		width: 100%;
		padding: 4px;
	}
	#ggraph-select{
		visibility:hidden ;
	}

	label{
		font-size: small;
	}

	.statustext{ 
		height: 14px; 
		font-size:12px;
	}


</style>