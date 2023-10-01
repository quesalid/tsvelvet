<script lang="ts">
// https://dev.to/shantanu_jana/how-to-create-a-draggable-div-in-javascript-iff

import { onMount} from "svelte";

import {dragElement, getDistributionArray1} from '../components/GraphUtils'


export let id: string|any = 'defaultDistributionMenuContainer'
export let node: any ={data:[]}

export let exp = (ev:any|undefined)=>console.log("EXPORT DATA")
export let imp = (ev:any|undefined)=>console.log("IMPORT DATA")
export let graph = {nodes:[],edges:[]}



//export let panel = []


let newkey = ''
let index = 0


onMount(async () => {  
    const dragable = document.getElementById("dragable"+id);
    const dragzone = document.getElementById("dragzone"+id);
	if(node.data)
		index = node.data.findIndex((item:any)=>item.distribution)

	dragElement(dragable, dragzone);
	
 })

const closeMenu = async(ev:any)=>{
	let dataMenu = document.getElementById(id);
	 dataMenu.style.visibility = "hidden";
}


let defDist = (ev:any|undefined)=>{
	/*index = node.data.findIndex((item:any)=>item.distribution)
	const idx = ev.target.name.split('-')[1]
	if(index >-1 && !isNaN(idx) && node.data[index].status[idx]){
		const element = document.getElementById('NW-'+node.id+'-'+node.data[index].status[idx].name)
		const valueEvent = new CustomEvent("changevalue", { detail: {value:!isNaN(ev.target.value)?ev.target.value:0.0} });
		if(element){
			element.dispatchEvent(valueEvent)
		}
	}
	node = node*/

}

const isNumber = (value:any)=>{
	return (typeof(value) === "number")
}

</script>

<div class="data-menu" id="{'dragable'+id}">
	<header id="{'dragzone'+id}">
		<div class="data-menu-header" style="--background-color:{node.bgColor}">
			<span style="margin-right:5px;">DISTRIBUTION  {node.label}</span>
			<input type="button" value="CLOSE" on:click={closeMenu} />
		</div>
		<table style="width:100%">
			{#if node.data }
				{#if node.data[index].distribution}
						<tr>
							{#each getDistributionArray1(node,index).header as col}
								<th align='left'>{col}</th>
							 {/each}
						</tr>
					  {#each getDistributionArray1(node,index).distarray as row}
						  <tr>
							{#each row as col,index}
								{#if !isNumber(col)}
									<td>{col}</td>
								{:else}
									<td><input size="6" type="text" name={'NW-'+node.id+'-'+row[0]} value={col} on:change={defDist} /></td>
								{/if}
							{/each}
						  </tr>
					  {/each}
				{/if}
			{/if}
		</table>
	</header>
</div>

<style>
	.data-menu{
		display:block;
		align-items: left;
		position: absolute;
		top: 20px;
		left: 20px;
		min-width:250px;
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

	table{
		font-size:small ;
	}
	th, td {
		padding: 3px;
	}
	
</style>