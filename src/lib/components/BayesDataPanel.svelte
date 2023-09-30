<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";

import {dragElement, setGraphInitialDistribution} from '../components/GraphUtils'


export let id: string|any = 'defaultDataMenuContainer'
export let node: any 

export let exp = (ev:any|undefined)=>console.log("EXPORT DATA")
export let imp = (ev:any|undefined)=>console.log("IMPORT DATA")
export let graph = {nodes:[],edges:[]}



//export let panel = []


let newkey = ''
let newtype='text'
let newvalue= ''
let index = 0


onMount(async () => {  
     
	const dragable = document.getElementById("dragable"+id);
    const dragzone = document.getElementById("dragzone"+id);
	
	dragElement(dragable, dragzone);
 })

const closeMenu = (ev:any)=>{
	setGraphInitialDistribution(graph)
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";
}


let defVar = (ev:any|undefined)=>{
	index = node.data.findIndex((item:any)=>item.status)
	if(index >-1){
		const status = {name:'',description:''}
		node.data[index].status.push(status)
		if(status.name.length >0)
			setGraphInitialDistribution(graph)
	}
	node = node

	// ADJUST GRAPH NODE
}

let delVar = (ev:any|undefined)=>{
	const id = ev.target.name
	const idx = id.split('-')[1]
	node.data[index].status.splice(idx,1)
	// RE-INITIALIZE DISTRIBUTION
	setGraphInitialDistribution(graph)
	index = node.data.findIndex((item:any)=>item.status)
	node = node
}

let modVar = (ev:any|undefined)=>{
	// RE-INITIALIZE DISTRIBUTION
	index = node.data.findIndex((item:any)=>item.status)
	const idx = ev.target.name.split('-')[1]
	//setGraphInitialDistribution(graph)
}




</script>

<div class="data-menu" id="{'dragable'+id}">
	<header id="{'dragzone'+id}">
		<div class="data-menu-header" style="--background-color:{node.bgColor}">
			<span>STATE MENU</span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		 <div class="data-menu-toolbar">
			<input type="button" value="+" on:click={defVar} />
			<input type="button" value="EXP" on:click={exp} />
			<input type="button" value="IMP" on:click={imp} />
		</div>
		<div class="data-menu-body">
			<!--div class='list-item-add' id="list-item-add-id">
				
			</!--div-->
			{#if node.data && index != -1}
				{#each node.data[index].status as Status, index}
					<div class='list-item'>
						<label for="name">STATUS: </label>
						<input class="statustext" name="name-{index}" type="text" bind:value={Status.name} on:click={modVar}/>
						<label for="description">DESCRIPTION: </label>
						<input class="statustext" name="description-{index}" type="text" bind:value={Status.description} />
						<input  type="button" name="IDX-{index}" value="X" on:click={delVar}  />
					</div>
				{/each}	
			{/if}
		</div>
	</header>
</div>

<style>
	.data-menu{
		display:block;
		align-items: left;
		position: absolute;
		top: 20px;
		left: 20px;
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
	}

	.data-menu-header input {
		cursor: pointer;
	}
	.data-menu-toolbar{
		display:flex;
		justify-content: left;
		margin-top: 2px;
		margin-bottom: 2px;
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
	}
	.list-item{
		display:flex;
		justify-content: space-between;
		align-items:center ;
		margin: 2px 5px 2px 5px;
		width:550px;

	}
	.list-item-add{
		width:550px;
		height: 15px;
		margin: 10px 3px 10px 3px;
	}

	label{
		font-size: x-small;
	}

	.statustext{ 
		height: 14px; 
		font-size:12px;
	}
	
</style>