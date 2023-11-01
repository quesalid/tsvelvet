<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";



import {dragElement} from './GraphUtils'


export let saveQuery = (ev:any|undefined)=>console.log("SAVE DATA")
export let id: string|any = 'defaultSaveGraphContainer'
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
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";
}




</script>

<div class="data-menu" id="{'dragable'+id}">
	<header id="{'dragzone'+id}">
		<div class="data-menu-header" style="--background-color:{inpuHeaderColor}">
			<span style="margin-right: 20px;">SAVE GRAPH </span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		 <div class="data-menu-toolbar">
			<input type="submit" on:click={saveQuery} value="SAVE">
		</div>
		<div class="data-menu-body" id="ggraph-select">
			
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
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 24px;
		margin-bottom: 24px;

	}

	.data-menu-toolbar input {
		cursor: pointer;
	}
	.data-menu-toolbar input{
		align:center;
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
	

	label{
		font-size: small;
	}

	.statustext{ 
		height: 14px; 
		font-size:12px;
	}


</style>