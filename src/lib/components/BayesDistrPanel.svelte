<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";

import {dragElement, getDistributionArray} from '../components/GraphUtils'


export let id: string|any = 'defaultDistributionMenuContainer'
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
	if(node.data)
		index = node.data.findIndex((item:any)=>item.distribution)

	dragElement(dragable, dragzone);
 })

const closeMenu = (ev:any)=>{
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";

}


let defDist = (ev:any|undefined)=>{
	index = node.data.findIndex((item:any)=>item.distribution)
	const idx = ev.target.name.split('-')[1]
	if(index >-1 && !isNaN(idx) && node.data[index].status[idx]){
		const element = document.getElementById('NW-'+node.id+'-'+node.data[index].status[idx].name)
		const valueEvent = new CustomEvent("changevalue", { detail: {value:!isNaN(ev.target.value)?ev.target.value:0.0} });
		if(element){
			element.dispatchEvent(valueEvent)
		}
	}
	node = node

}

let getLastRowClass= (idx:any)=>{
	index = node.data.findIndex((item:any)=>item.status)
	let cls = ''
	let remainder = 0
	remainder = (node.data[index].status.length-1)%idx
	cls = (remainder > 0)?'data-menu-row':'data-menu-row barred'
	console.log("LAST CLASS", node.label,(node.data[index].status.length-1),idx,remainder)
	return cls
}


</script>

<div class="data-menu" id="{'dragable'+id}">
	<header id="{'dragzone'+id}">
		<div class="data-menu-header" style="--background-color:{node.bgColor}">
			<span>DISTRIBUTION MENU</span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		<div class="data-distribution-table">
				{#if node.data }
					{#if node.data[0].distribution}
						{#each getDistributionArray(node.data[index].distribution) as Row, Index}
							<div class="data-menu-row">
								{#each Row as item, Index1}
									{#if Index == 0}
										<div class="list-item" style="font-weight: bold ;">
											<label>{item}</label>
										</div>
									{:else if Index1 < (Row.length -1)}
										<div class="list-item">
											<label>{item}</label>
										</div>
									{:else}
										<div class="list-item">
											<input size="10" type="text" name="{'row-'+Index1}" value={item} on:click={defDist} />
										</div>
									{/if}
								{/each}
							</div>
						{/each}
					{/if}
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
		width:50%;
		/*overflow-y: auto;
		overflow-x: auto;
		overflow: hidden;*/
		border-radius: 6px;
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

	.data-menu-row{
		display: grid;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fill, 76px);
		/*grid-template-columns:repeat(auto-fit,minmax(min-content, 1fr));*/
		align-items: center;
		justify-content: space-between;
	}
	.barred{
		border-bottom:  solid 1px;
	}

	.data-distribution-table{
		display:block;
		/*flex-direction: column;
		justify-content: left;*/
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 2px;
		overflow: auto;
	}
	
	.list-item{
		display:flex;
		justify-content: space-between;
		align-items:center ;
		margin: 2px 5px 2px 5px;
		width:inherit;
	}

	.list-item-add{
		width:550px;
		height: 15px;
		margin: 10px 3px 10px 3px;
	}

	label{
		font-size: smaller;
	}

	.statustext{ 
		height: 14px; 
		font-size:12px;
	}
	
</style>